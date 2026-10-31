'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.cwd();
const context={window:{},CHAPTERS_DATA:[],LESSONS_DATA:[],CONCEPTS_CATALOG:{},console};
vm.createContext(context);
for(const file of ['manuale235/data.js','manuale235/catalog.js']){
  const src=fs.readFileSync(root+'/'+file,'utf8');
  vm.runInContext(src,context,{filename:file,timeout:3000});
}
const lessons=context.LESSONS_DATA,chapters=context.CHAPTERS_DATA;
assert.equal(lessons.length,235);
assert.equal(chapters.length,43);
assert.deepEqual(lessons.map(x=>x.manualLessonNumber),Array.from({length:235},(_,i)=>i+1));
assert.equal(new Set(lessons.map(x=>x.id)).size,235);
assert.equal(lessons[0].title,'1. Il linguaggio');
assert.equal(lessons[1].title,'2. Ciao mondo!');
assert.equal(lessons[234].title,'235. Servizio di noleggio veicoli');
assert.match(lessons[0].initialCode,/print\("Ciao GDScript!"\)/);
assert.match(lessons[1].initialCode,/print\(""\)/);
assert.match(lessons[2].initialCode,/print\("Arrivederci!"\)/);
assert.ok(lessons.every(x=>x.theory&&x.task&&x.initialCode&&x.title));
assert.ok(lessons.every(x=>typeof x.validate==='function'));
assert.ok(lessons.slice(0,8).every(x=>x.validationReady===true));
assert.ok(lessons.slice(8).every(x=>x.validationReady===false));
assert.ok(lessons.slice(170).every(x=>x.sourceFiles['main.gd']));
const stats=context.window.GDHManualMigration;
assert.equal(stats.total,235);
assert.equal(stats.chapters,43);
assert.equal(stats.validated,8);
assert.equal(stats.readyForRelease,false);
async function checks(n,logs,source=lessons[n-1].initialCode){
  return lessons[n-1].validate({code:source,success:true,logs});
}
(async()=>{
  const one=await checks(1,['Ciao GDScript!']);
  assert.ok(one.every(x=>x.passed),'La prima lezione deve essere completabile con Esegui');
  const two=await checks(2,['Ciao mondo!'],'extends Node\nfunc _ready():\n    print("Ciao mondo!")');
  assert.ok(two.every(x=>x.passed),'La seconda richiede codice scritto');
  const wrong=await checks(2,[],lessons[1].initialCode);
  assert.ok(wrong.some(x=>!x.passed),'Lo starter vuoto non può superare la seconda');
  const wrong3=await checks(3,['Ciao!']);
  assert.ok(wrong3.some(x=>!x.passed),'Eliminare il print non equivale a commentarlo');
  const unsupported=await checks(9,[]);
  assert.ok(unsupported.some(x=>!x.passed),'Nessuna promozione automatica per le lezioni non validate');
  console.log('OK: catalogo 235/235, capitoli 43, prime otto attività configurate e verifica conservativa');
})().catch(err=>{console.error(err);process.exitCode=1});
