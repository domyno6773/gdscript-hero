'use strict';
/* Native Godot exercise parity test for the real lessons 49-60.
   The grades are local demo feedback, not trustworthy for progress/account systems. */
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'), output=path.join(root,'test-artifacts');
fs.mkdirSync(output,{recursive:true});
const parent='http://127.0.0.1:18767',runner='http://localhost:18768';
const servers=[
 spawn('python3',['-m','http.server','18767','--bind','127.0.0.1','--directory',path.join(root,'host')],{stdio:'ignore'}),
 spawn('python3',[path.join(root,'tests','cors_server.py'),'18768',path.join(root,'web')],{stdio:'ignore'})
];
const sleep=t=>new Promise(r=>setTimeout(r,t));
async function ready(url){
 for(let i=0;i<100;i++){
  const yes=await new Promise(ok=>http.get(url,r=>{r.resume();ok(r.statusCode===200)}).on('error',()=>ok(false)));
  if(yes)return;await sleep(100);
 }
 throw Error('Server unavailable: '+url);
}
async function run(page,id,code){
 await page.selectOption('#lesson',String(id));
 if(code===null)await page.locator('#solution').click();
 else await page.locator('#code').fill(code);
 await page.locator('#run').click();
 await page.waitForFunction(expected=>{
  try {const data=JSON.parse(document.querySelector('#grade').textContent);return data.id===expected;}
  catch {return false;}
 },id,{timeout:14000});
 const feedback=JSON.parse(await page.locator('#grade').textContent());
 const raw=JSON.parse(await page.locator('#result').textContent());
 const stdout=await page.locator('#stdout').textContent();
 return {feedback,raw,stdout};
}
(async()=>{
 let browser;
 const results=[];
 try{
  await Promise.all([ready(parent+'/lesson-lab.html'),ready(runner+'/isolated.html')]);
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:1250,height:900}});
  await page.goto(parent+'/lesson-lab.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__gdhIsolation?.ready===true,null,{timeout:80000});
  for(let id=49;id<=60;id++){
   const r=await run(page,id,null);
   const failed=r.feedback.checks.filter(c=>!c.passed);
   assert.equal(r.raw.status,'executed','Native execution failed lesson '+id);
   assert.equal(r.feedback.passed,true,'Official lesson '+id+' failed native grading: '+JSON.stringify({failed,raw:r.raw,stdout:r.stdout}));
   
   results.push({id,positive:true,stdout:r.stdout,locals:r.raw.locals});
   console.log('NATIVE_LESSON_PASS '+id+' '+JSON.stringify({capture:r.raw.localCapture,stdout:r.stdout}));
  }
  // Mutation-based negatives: generated directly from each official GDScript solution.
  const mutations={
    49: src=>src.replace('print("Nodo rilevato: ", $Giocatore.name)','print("Nodo rilevato: Giocatore")'),
    50: src=>src.replace('$Titolo.text = "Benvenuto in Godot 4!"','pass')
               .replace('print("Testo a schermo: ", $Titolo.text)','print("Testo a schermo: Benvenuto in Godot 4!")'),
    51: src=>src.replace('$SaluteLabel.text = "HP: 75"','pass')
               .replace('print("Nuova salute: ", $SaluteLabel.text)','print("Nuova salute: HP: 75")'),
    52: src=>src.replace('$TitoloDungeon.text = "Caverna dei Goblin"','pass'),
    53: src=>src.replace('$AttaccaBtn.text = "Sferra Attacco"','pass')
               .replace('print("Pulsante configurato: ", $AttaccaBtn.text)','print("Pulsante configurato: Sferra Attacco")'),
    54: src=>src.replace('$AttaccaBtn.pressed.connect(quando_premuto)','quando_premuto()'),
    55: src=>src.replace('punti += 1','punti = 1'),
    56: src=>src.replace('$MotoriBtn.pressed.connect(attiva_motori)','attiva_motori()'),
    57: src=>src.replace('$Cooldown.start()','pass'),
    58: src=>src.replace('$BarraVita.color = "#22c55e"','pass'),
    59: src=>src.replace('$Moneta.queue_free()','pass'),
    60: src=>src.replace('monete -= 25','monete = 75')
  };
  for(const [rawId,mutate] of Object.entries(mutations)){
    const id=Number(rawId);
    const original=await page.evaluate(id=>window.GDHLessonLab.get(id).solution,id);
    const bad=mutate(original);
    assert.notEqual(bad,original,'Negative mutation must change lesson '+id);
    const r=await run(page,id,bad);
    assert.equal(r.feedback.passed,false,'Lesson '+id+' accepted known bypass: '+JSON.stringify(r));
    results.push({id,bypassRejected:true,failed:r.feedback.checks.filter(c=>!c.passed).map(c=>c.desc)});
    console.log('NATIVE_BYPASS_REJECTED '+id);
  }
  // Correct independent formatting variants, not byte-identical to model answers.
  // For this phase the main value is executing real scenes, not requiring exact source bytes.
  for(let id=49;id<=60;id++){
    const original=await page.evaluate(id=>window.GDHLessonLab.get(id).solution,id);
    const modified='# Esecuzione alternativa con un commento di contesto\n'+original.replace(
      /print\("/, 'print( "'
    );
    assert.notEqual(modified,original);
    const r=await run(page,id,modified);
    assert.equal(r.feedback.passed,true,'Valid source variant rejected in lesson '+id+': '+JSON.stringify(r));
    results.push({id,alternativeAccepted:true});
    console.log('NATIVE_ALTERNATIVE_ACCEPTED '+id);
  }

  await page.screenshot({path:path.join(output,'native-49-60-lessons-lab.png'),fullPage:true});
  fs.writeFileSync(path.join(output,'native-49-60-lessons.json'),JSON.stringify(results,null,2));
 }catch(e){
  fs.writeFileSync(path.join(output,'native-49-60-lessons-FAILED.txt'),String(e.stack||e));
  throw e;
 }finally{if(browser)await browser.close();servers.forEach(p=>p.kill());}
})().catch(e=>{console.error(e);process.exitCode=1});
