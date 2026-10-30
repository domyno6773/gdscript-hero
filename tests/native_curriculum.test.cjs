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
   // The Godot iframe deliberately has an opaque (null) origin. Godot's WASM
   // and pack fetches therefore require CORS even on localhost.
   res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream',
     'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(buffer);
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
   const browserErrors=[],failedAssets=[];
   page.on('pageerror',e=>browserErrors.push(String(e)));
   page.on('requestfailed',req=>{
     if(/\/(?:native\/)?godot\.(?:pck|wasm|js)/.test(req.url()))
       failedAssets.push({url:req.url(),failure:req.failure()});
   });
   // Prevent third-party network/auth calls; the native WebAssembly files
   // and lesson validators are all served from this local test origin.
   await page.route(/^https:\/\//,route=>route.abort('blockedbyclient'));
   await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
   await page.waitForFunction(()=>window.GDHGodot?.engine==='Godot 4.4.1 WebAssembly'&&window.LESSONS_DATA?.length===115);
   const ids=await page.evaluate(()=>LESSONS_DATA.filter(x=>x.id<=60).map(x=>x.id).sort((a,b)=>a-b));
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
     if(!result.accepted || result.nativeStatus!=='executed'){
       if(id===1 && result.error && (/Failed to fetch|Godot:|scaduto|startup/i.test(result.error))) {
         throw new Error('Godot runtime unavailable (not a lesson failure): '+JSON.stringify({
           result,browserErrors,failedAssets
         }));
       }
       failed++;
       console.error('NATIVE FAIL lesson '+id+': '+JSON.stringify(result));
     }else{
       passed++;
       if(id%10===0)console.log('NATIVE PASS '+id+'/60');
     }
   }
   assert.equal(failed,0,'Godot WASM rejected '+failed+' of 60 official solutions');
   assert.equal(passed,60);

   // Le lezioni individuali contengono l'originale e due attività uniche.
   // Introduzione e gameplay mantengono quattro prove.
   const progressive=await page.evaluate(()=>LESSONS_DATA.filter(l=>!l.isQuiz).every(l=>{
     const tasks=LessonPractice.tasksFor(l);
     const count=l.chapterId===1||l.chapterId===10?4:3;
     return tasks.length===count&&tasks.filter(t=>t.nativeOriginal).length===1;
   }));
   assert.ok(progressive,'Il percorso deve avere tre o quattro attività coerenti');
   for(const id of [301,302,303,304]){
     const result=await page.evaluate(async id=>{
       const l=LESSONS_DATA.find(l=>l.id===id);
       const good=await GDHGodot.verifyLesson(id,l.solution);
       const bad=await GDHGodot.verifyLesson(id,l.initialCode);
       return {good:good.accepted,bad:bad.accepted,checks:good.feedback.checks};
     },id);
     assert.ok(result.good&&!result.bad,'Gameplay verification: '+id+' '+JSON.stringify(result));
   }

   // Ogni nuovo compito di gameplay deve superare una verifica fisica reale.
   // Non basta confrontare testi o eseguire codice JavaScript illustrativo.
   for(const id of [301,302,303,304]){
     for(const key of ['p2','p3','p4']){
       const result=await page.evaluate(async ({id,key})=>{
         const task=LessonPractice.getTask(id,key);
         try {
           const verified=await GDHGodot.verifyPracticeTask(id,key,task.solution);
           return {accepted:verified.accepted,status:verified.execution?.nativeStatus,
             failed:(verified.feedback?.checks||[]).filter(x=>!x.passed),error:verified.execution?.error};
         }catch(error){return {accepted:false,error:String(error)};}
       },{id,key});
       assert.ok(result.accepted&&result.status==='executed',
         'La soluzione fisica deve funzionare su Godot '+id+'/'+key+': '+JSON.stringify(result));
     }
   }

   // Phase 2: exercise every individualized task in the actual Godot engine.
   const idsV2=await page.evaluate(()=>GDHIndividualPractice.ids);
   assert.equal(idsV2.length,76);
   let verified=0,discriminating=0,rejectedStarters=0;
   for(const id of idsV2){
     for(const key of ['p2','p3']){
       const outcome=await page.evaluate(async ({id,key})=>{
         const task=LessonPractice.getTask(id,key);
         const correct=await GDHGodot.verifyPracticeTask(id,key,task.solution);
         const initial=await GDHGodot.verifyPracticeTask(id,key,task.initialCode);
         return {accepted:correct.accepted,status:correct.execution?.nativeStatus,
           checks:correct.feedback?.checks,
           rejectedStarter:!initial.accepted,
           output:correct.execution?.logs,reason:correct.feedback?.reason,
           initialChecks:initial.feedback?.checks?.filter(x=>!x.passed)};
       },{id,key});
       assert.ok(outcome.accepted&&outcome.status==='executed',
         'Invalid lesson-specific native task '+id+'/'+key+': '+JSON.stringify(outcome));
       assert.ok(outcome.rejectedStarter,
         'Starter accepted without completed code: '+id+'/'+key+': '+JSON.stringify(outcome));
       verified++;rejectedStarters++;
       discriminating+=outcome.checks.filter(c=>c.desc.startsWith('Funzionamento con valori diversi')&&c.passed).length;
     }
     if(verified%20===0)console.log('NATIVE PHASE2 '+verified+'/152');
   }
   // Not every exercise has different visible output under its alternate input:
   // count true behavioral tests separately from task execution and failures.
   assert.equal(discriminating,152,'Every individual drill must react correctly to changed input');
   const cheat=await page.evaluate(async ()=>{
     const task=LessonPractice.getTask(17,'p2');
     const hardcoded=task.solution.replace(/print\(livello >= 7\)/,"var controllo = livello >= 7\n    print(true)");
     const result=await GDHGodot.verifyPracticeTask(17,'p2',hardcoded);
     return {accepted:result.accepted,checks:result.feedback.checks};
   });
   assert.equal(cheat.accepted,false,'Hard-coded correct output accepted');
   assert.ok(cheat.checks.some(c=>c.desc.startsWith('Funzionamento con valori diversi')&&!c.passed));
   console.log('PHASE 2 NATIVE PASS: '+verified+' solutions, '+rejectedStarters+
     ' incomplete starters rejected, '+discriminating+' discriminating data variations, bypass rejected.');

   // Fixture snapshots must stay synchronized with the actual 60 lessons.
   const snapshots=await page.evaluate(()=>LESSONS_DATA.filter(l=>l.id<=60).flatMap(l=>{
     const f=GDHLessonFixtures.find(x=>x.id===l.id);
     const mismatches=[];
     if(!f){mismatches.push('missing fixture');return [{id:l.id,mismatches}];}
     if(f.solution!==l.solution)mismatches.push('official solution differs');
     // Starter scaffolding is owned by the current curriculum, not the legacy fixture.
     return mismatches.length?[{id:l.id,mismatches}]:[];
   }));
   assert.deepEqual(snapshots,[],'Native metadata is stale: '+JSON.stringify(snapshots));

   // Every starter must be rejected. Every correct solution must tolerate an
   // ordinary trailing comment, regardless of chapter or script complexity.
   let incompleteAccepted=0,commentRejected=0;
   for(const id of ids){
     const outcomes=await page.evaluate(async id=>{
       const l=LESSONS_DATA.find(x=>x.id===id);
       const runs=[
         {case:'starter',code:l.initialCode},
         {case:'comment',code:l.solution+(l.solution.endsWith('\n')?'':'\n')+
           '# Commento facoltativo che non modifica la logica\n'}
       ];
       const results=[];
       for(const run of runs){
         try{
           const r=await GDHGodot.verifyLesson(id,run.code);
           results.push({case:run.case,accepted:r.accepted,nativeStatus:r.execution?.nativeStatus,
             verdict:r.feedback?.verdict,failed:(r.feedback?.checks||[])
               .filter(c=>!c.passed).map(c=>c.desc).slice(0,10),
             error:r.execution?.error||null});
         }catch(e){results.push({case:run.case,accepted:false,error:String(e)});}
       }
       return results;
     },id);
     if(outcomes[0].accepted){
       incompleteAccepted++;
       console.error('STARTER INCORRECTLY ACCEPTED lesson '+id+': '+JSON.stringify(outcomes[0]));
     }
     if(!outcomes[1].accepted||outcomes[1].nativeStatus!=='executed'){
       commentRejected++;
       console.error('VALID COMMENT REJECTED lesson '+id+': '+JSON.stringify(outcomes[1]));
     }
     if(id%10===0)console.log('NATIVE STARTER/COMMENT CHECK '+id+'/60');
   }
   assert.equal(incompleteAccepted,0,'Unfinished starter code accepted in '+incompleteAccepted+' lessons');
   assert.equal(commentRejected,0,'Comment-only changes rejected in '+commentRejected+' lessons');

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
   // I nuovi esercizi attraversano lo stesso Godot WebAssembly dei precedenti.
   const extras=await page.evaluate(()=>LESSONS_DATA.filter(l=>l.isSupplemental).map(l=>l.id));
   assert.equal(extras.length,21,'Sono previsti 21 nuovi esercizi interdisciplinari');
   let extraPassed=0;
   for(const id of extras){
     const outcome=await page.evaluate(async id=>{
       const lesson=LESSONS_DATA.find(l=>l.id===id);
       try{
         const correct=await GDHGodot.verifyLesson(id,lesson.solution);
         const initial=await GDHGodot.verifyLesson(id,lesson.initialCode);
         return {correct:correct.accepted,initial:initial.accepted,
           nativeStatus:correct.execution?.nativeStatus,
           failed:(correct.feedback?.checks||[]).filter(x=>!x.passed).map(x=>x.desc),
           error:correct.execution?.error||null};
       }catch(error){return {correct:false,error:String(error)};}
     },id);
     assert.ok(outcome.correct && outcome.nativeStatus==='executed',
       'Nuovo esercizio '+id+' fallisce in Godot: '+JSON.stringify(outcome));
     assert.equal(outcome.initial,false,'Starter già superato: '+id);
     extraPassed++;
   }
   console.log('NUOVI ESERCIZI NATIVI: '+extraPassed+'/21 accettati, 21/21 starter respinti.');
   assert.deepEqual(browserErrors,[],'Uncaught browser errors');
   console.log('NATIVE CURRICULUM SUCCESS: '+passed+'/60 official accepted; 60/60 starters rejected; '+
     '60/60 solutions with extra comments accepted; '+variants+
     ' extra variants confirmed by the Godot WASM engine.');
   await context.close();
 }finally{
   if(browser)await browser.close();
   await new Promise(resolve=>server.close(resolve));
 }
})().catch(err=>{console.error('NATIVE CURRICULUM FAILED:',err);process.exitCode=1;});
