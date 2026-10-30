'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.wasm':'application/wasm','.pck':'application/octet-stream','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,(req.url||'/').split('?')[0].replace(/^\//,'')||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*'}).end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  for(const width of [1280,390]){
   const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.route(/^https:\/\//,r=>r.abort());
   await page.goto('http://127.0.0.1:'+server.address().port);
   await page.waitForFunction(()=>window.App&&window.GDHCourseCapstone&&window.GDHGodot);
   const before=await page.evaluate(()=>{
    App.createSandboxProject('Bozza da conservare');
    App.getActiveSandboxProject().code='extends Node2D\n# La mia bozza\n';App.saveStorage();
    const saved=JSON.stringify(App.state.sandbox.projects);
    App.openLesson(48);
    // Remove welcome layers for direct access to the already-tested lesson screen.
    for(const el of document.querySelectorAll('#site-welcome,#site-tour'))el.remove();
    return {saved,count:App.state.sandbox.projects.length};
   });
   await page.locator('#gdh-start-final-project').click({force:true});
   const created=await page.evaluate(()=>({project:App.getActiveSandboxProject(),projects:App.state.sandbox.projects}));
   assert.equal(created.projects.length,before.count+1);
   assert.equal(JSON.stringify(created.projects.slice(0,-1)),before.saved);
   assert.match(created.project.code,/TODO 1/);
   // Real native scene, real connections, collection and victory in both orders.
   const native=await page.evaluate(async()=>{
    const cap=GDHCourseCapstone;
    const starter=await GDHGodot.runNative(cap.starter,{mode:'sandbox_start',nodes:cap.nodes});
    let solution=cap.starter.replace('    # TODO 1:', '    zaino.aggiungi("Moneta")\n    monete += 1\n    tesoro_raccolto.emit(monete)\n    $Coin.queue_free()\n    # TODO 1:')
     .replace('    # TODO 4:', '    boss["hp"] -= 10\n    if boss["hp"] < 0:\n        boss["hp"] = 0\n    _aggiorna_stato()\n    # TODO 4:');
    solution+='\nfunc __test_finale(prima_moneta):\n    if prima_moneta:\n        $Coin.body_entered.emit($Player)\n    $UsaPozione.pressed.emit()\n    $UsaPozione.pressed.emit()\n    $UsaPozione.pressed.emit()\n    $UsaPozione.pressed.emit()\n    if not prima_moneta:\n        $Coin.body_entered.emit($Player)\n    return [monete, boss["hp"], zaino.oggetti.size(), $PuntiLabel.text, $StatoLabel.text, $Coin.is_queued_for_deletion()]\n';
    const outcomes=[];
    for(const first of [true,false])outcomes.push(await GDHGodot.runNative(solution,{mode:'sandbox_start',nodes:cap.nodes,calls:[{method:'__test_finale',args:[first]}]}));
    return {starter,outcomes};
   });
   assert.equal(native.starter.status,'executed',JSON.stringify(native.starter));
   for(const run of native.outcomes){
    assert.equal(run.status,'executed',JSON.stringify(run));assert.equal(run.stderr,'');
    assert.deepEqual(run.reply.methodCalls[0].value,[1,0,1,'Tesori: 1','Vittoria!',true]);
   }
   assert.deepEqual(errors,[]);await context.close();
   console.log('PASS capstone '+width+'px: actual launch button, preserved drafts, native starter, inventory, real signals, HP floor and victory in both orders.');
  }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
