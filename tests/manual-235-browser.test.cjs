'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml',
  '.wasm':'application/wasm','.pck':'application/octet-stream','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const requested=decodeURIComponent((req.url||'/').split('?')[0]);
  const filename=path.resolve(root,requested==='/'?'index.html':requested.replace(/^\/+/,''));
  if(!filename.startsWith(root+path.sep))return res.writeHead(403).end();
  fs.readFile(filename,(err,data)=>{if(err)return res.writeHead(404).end();
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream',
      'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}).end(data);
  });
});
async function main(){
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
    await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded',timeout:40000});
    await page.waitForFunction(()=>window.App&&Array.isArray(window.LESSONS_DATA),{timeout:30000});
    // Il tour del primo accesso non deve coprire i controlli del corso.
    const introduction=page.locator('#site-welcome');
    if(await introduction.isVisible()){
      await page.locator('#site-skip-tour').click();
      if(await page.locator('#site-goal-gate').isVisible())
        await page.locator('#site-goal-gate [data-goal="rilassato"]').click();
      if(await page.locator('#streak-modal').isVisible())
        await page.locator('#btn-close-streak').click();
    }
    const stats=await page.evaluate(()=>({
      count:LESSONS_DATA.length,chapters:CHAPTERS_DATA.length,
      prepared:GDHManualMigration.validated,
      first:LESSONS_DATA[0].title,last:LESSONS_DATA[234].title
    }));
    assert.equal(stats.count,235);
    assert.equal(stats.chapters,43);
    assert.equal(stats.prepared,30);
    await page.evaluate(()=>App.openLesson(10001));
    assert.match(await page.locator('#code-editor').inputValue(),/print\("Ciao GDScript!"\)/);
    assert.match(await page.locator('#btn-run-code').innerText(),/Esegui codice/);
    // In Godot reale, lo starter deve essere valido senza cambiare nulla.
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>{
      const x=document.getElementById('real-output-pre')?.textContent||'';
      return x.includes('Ciao GDScript!')||x.includes('Errore Godot');
    },null,{timeout:125000});
    const result=await page.locator('#real-output-pre').innerText();
    assert.match(result,/Ciao GDScript!/);
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10001),null,{timeout:30000});
    await page.evaluate(()=>App.openLesson(10002));
    assert.match(await page.locator('#code-editor').inputValue(),/print\(""\)/);
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>!App.isValidating,null,{timeout:30000});
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10002)),false,
      'La seconda lezione non deve risultare superata con lo starter vuoto');
    await page.locator('#code-editor').fill('extends Node\nfunc _ready():\n    print("Ciao mondo!")');
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10002),null,{timeout:30000});
    await page.evaluate(()=>App.openLesson(10009));
    const snippet=await page.locator('#code-editor').inputValue();
    assert.match(snippet,/^extends Node/m);
    assert.match(snippet,/^    var PlayerName/m);
    await page.evaluate(()=>App.openLesson(10027));
    assert.equal(await page.locator('#manual-stdin-lines').inputValue(),'45');
    await page.locator('#code-editor').fill(
      'extends Node\nfunc _ready():\n    var wind = int(OS.read_string_from_stdin())\n'+
      '    var status = ""\n    if wind < 8:\n        status = "Calmo"\n    elif wind <= 31:\n        status = "Brezza"\n    elif wind <= 63:\n        status = "Vento forte"\n    else:\n        status = "Tempesta"\n    print("stato = ", status)'
    );
    await page.locator('.manual-preview-btn').click();
    await page.waitForFunction(()=>!document.querySelector('.manual-preview-btn')?.disabled,null,{timeout:30000});
    assert.match(await page.locator('#real-output-pre').innerText(),/stato = Vento forte/);
    await page.evaluate(()=>App.openLesson(10171));
    assert.ok(await page.locator('.manual-file-tab').count()>=2);
    assert.match(await page.locator('#code-editor').inputValue(),/class_name Greeter/);
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),null);
    await page.locator('.manual-file-tab', {hasText:'main.gd'}).click();
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    assert.equal(errors.length,0,'Page errors: '+errors.join(' | '));
    console.log('PASS browser: manuale 235, primo esercizio Godot, stdin e schede .gd.');
  }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
