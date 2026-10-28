'use strict';
/*
 * GDScript Hero — real Godot 4.4.1 WASM curriculum parity.
 * Exercises go through GDHGodot.verifyLesson, exactly like a learner.
 * No progress, XP, auth or storage is changed by this test.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css',
 '.wasm':'application/wasm','.pck':'application/octet-stream','.svg':'image/svg+xml',
 '.png':'image/png'};
const server=http.createServer((req,res)=>{
 let filename;
 try{
   const uri=decodeURIComponent((req.url||'/').split('?')[0]);
   filename=path.resolve(root,uri==='/'?'index.html':uri.replace(/^\/+/,'')); 
 }catch(e){res.writeHead(400).end();return;}
 if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(filename,(err,buffer)=>{
   if(err){res.writeHead(404).end();return;}
   res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream',
     'Cache-Control':'no-store'});res.end(buffer);
 });
});
function failures(verdict){
 return (verdict?.checks||[]).filter(x=>!x.passed).map(x=>x.desc+' — '+(x.diff||'')).slice(0,9);
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
   browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
   const context=await browser.newContext({viewport:{width:1280,height:800},locale:'it-IT'});
   const page=await context.newPage();
   page.setDefaultTimeout(30000);
   const browserErrors=[];
   page.on('pageerror',e=>browserErrors.push(String(e)));
   // Prevent third-party network/auth calls; the native WebAssembly files
   // and lesson validators are all served from this local test origin.
   await page.route(/^https:\/\//,route=>route.abort('blockedbyclient'));
   await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
   await page.waitForFunction(()=>window.GDHGodot?.engine==='Godot 4.4.1 WebAssembly'&&window.LESSONS_DATA?.length===60);
   const ids=await page.evaluate(()=>LESSONS_DATA.map(x=>x.id));
   assert.deepEqual(ids,Array.from({length:60},(_,i)=>i+1),'Missing lessons in native curriculum');
   let passed=0,failed=0;
   for(const id of ids){
     const result=await page.evaluate(async id=>{
       const lesson=LESSONS_DATA.find(x=>x.id===id);
       try{
         const data=await GDHGodot.verifyLesson(id,lesson.solution);
         return {accepted:data.accepted,verdict:data.feedback?.verdict,
           nativeStatus:data.execution?.nativeStatus,failed:(data.feedback?.checks||[])
             .filter(x=>!x.passed).map(x=>x.desc+' — '+(x.diff||'')).slice(0,12),
           error:data.execution?.error||null,steps:Object.keys(data.original||{})};
       }catch(error){return {accepted:false,error:String(error),stage:GDHGodot.lastStage};}
     },id);
     if(!result.accepted){
       failed++;
       console.error('NATIVE FAIL lesson '+id+': '+JSON.stringify(result));
     }else{
       passed++;
       if(id%10===0)console.log('NATIVE PASS '+id+'/60');
     }
   }
   assert.equal(failed,0,'Godot WASM rejected '+failed+' of 60 official solutions');
   assert.equal(passed,60);

   // Correct equivalent code and harmless comments must not be rejected.
   const positives=[
     {id:1,code:'func _ready():\n    # Un commento libero e innocuo\n    print("Ciao Godot!")\n'},
     {id:2,code:'func _ready():\n    # Testo commentato aggiuntivo\n    # Un altro commento valido\n    print("Benvenuto nel gioco")\n'}
   ];
   // Anti-cheat here means DIDACTIC validation: these variants must be
   // rejected despite similar output, not treated as trusted server proof.
   const negatives=[
     {id:1,code:'func _ready():\n    print("Ciao!")\n'},
     {id:3,code:'func _ready():\n    print("Livello")\n    print("1")\n'},
     {id:25,kind:'mutation',old:'range(3)',replacement:'range(0)'},
     {id:59,kind:'mutation',old:'print("Moneta presente prima: ", has_node("Moneta"))',
       replacement:'print("Moneta presente prima: true")'}
   ];
   let variants=0;
   for(const item of [...positives.map(x=>({...x,expected:true})),
       ...negatives.map(x=>({...x,expected:false}))]){
     const outcome=await page.evaluate(async item=>{
       const l=LESSONS_DATA.find(x=>x.id===item.id);
       const code=item.kind==='mutation'?l.solution.replace(item.old,item.replacement):item.code;
       if(item.kind==='mutation'&&code===l.solution)return {testInvalid:true};
       try{
         const r=await GDHGodot.verifyLesson(item.id,code);
         return {accepted:r.accepted,verdict:r.feedback?.verdict,
           nativeStatus:r.execution?.nativeStatus,failed:(r.feedback?.checks||[])
             .filter(x=>!x.passed).map(x=>x.desc).slice(0,12),error:r.execution?.error};
       }catch(e){return {accepted:false,error:String(e)};}
     },item);
     assert.ok(!outcome.testInvalid,'Negative transformation was not applied: '+item.id);
     assert.equal(outcome.accepted,item.expected,
       'Godot lesson '+item.id+' '+(item.expected?'valid alternative rejected':'invalid source accepted')+': '+JSON.stringify(outcome));
     variants++;
   }
   assert.deepEqual(browserErrors,[],'Uncaught browser errors');
   console.log('NATIVE CURRICULUM SUCCESS: '+passed+'/60 official accepted; '+variants+
     ' positive/negative variants confirmed by the deployed WASM engine.');
   await context.close();
 }finally{
   if(browser)await browser.close();
   await new Promise(resolve=>server.close(resolve));
 }
})().catch(err=>{console.error('NATIVE CURRICULUM FAILED:',err);process.exitCode=1;});
