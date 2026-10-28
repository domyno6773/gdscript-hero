'use strict';
// Verifica struttura e integrazione didattica degli esercizi aggiuntivi.
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{},console});
for(const file of ['lessons.js','curriculum_extension.js'])
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const lessons=context.window.LESSONS_DATA;
const extension=context.window.GDHCurriculumExtension;
assert.equal(lessons.length,81);
assert.equal(extension.count,21);
assert.equal(new Set(lessons.map(x=>x.id)).size,81);
assert.deepEqual(lessons.map(x=>x.chapterId).slice().sort((a,b)=>a-b),lessons.map(x=>x.chapterId));
for(let chapter=1;chapter<=15;chapter++){
  const items=lessons.filter(x=>x.chapterId===chapter);
  assert.ok(items.length>=5,'Manca esercizio di approfondimento capitolo '+chapter);
  const last=items.at(-1);
  assert.ok(last.isConsolidation&&last.isMastery,'Il capitolo '+chapter+' deve terminare con consolidamento');
  assert.equal(items.filter(x=>x.isConsolidation).length,1);
}
(async()=>{
  for(const l of lessons.filter(x=>x.isSupplemental)){
    assert.equal(l.hints.length,3);
    assert.ok(l.theory.length>75&&l.task.length>75);
    assert.ok(l.solution&&l.initialCode&&l.expectedOutput);
    const fakeSuccess=async code=>({status:'executed',stdout:code===l.solution?l.expectedOutput:'',stderr:'',reply:{status:'executed'}});
    const result=await extension.verify(l.id,l.solution,fakeSuccess);
    assert.ok(result.accepted,l.id+' ha una regola di verifica incompatibile con la soluzione: '+JSON.stringify(result.feedback.checks));
    const starter=await extension.verify(l.id,l.initialCode,fakeSuccess);
    assert.ok(!starter.accepted,'Lo starter non deve essere valutato completo '+l.id);
  }
  console.log('OK: 81 esercizi, 15 consolidamenti e 21 estensioni con verifica strutturale.');
})().catch(e=>{console.error(e);process.exitCode=1;});
