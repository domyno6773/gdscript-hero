// Regressione: quiz aggiunti tra lezioni già completate non devono apparire bloccati.
// Eseguire dalla root con: node --test tests/roadmap-progression.test.cjs
'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,name),'utf8');
const all=new Function('window',
  ['lessons.js','curriculum_extension.js','chapter_quizzes.js','gameplay_lessons.js','curriculum_restructure.js']
    .map(source).join('\n;\n')+
  '\nreturn LESSONS_DATA.map(x=>({id:x.id,isQuiz:!!x.isQuiz,chapterId:x.chapterId}));'
)({});
const appSource=source('app.js');
const start=appSource.indexOf('    ensureUnlockedConsistency() {');
const end=appSource.indexOf('\n    unlockAllLessons(',start);
assert.ok(start>=0&&end>start,'Metodi di progressione non trovati');
const methods=new Function('LESSONS_DATA',
  'return {'+appSource.slice(start,end)+'};')(all);
const create=(finished=[],unlocked=[],dev=false,local=false)=>({
  state:{finishedLessons:finished.slice(),completedLessons:unlocked.slice(),devAllUnlocked:dev},
  isLocalEnvironment:()=>local,
  saves:0,saveStorage(){this.saves++}
});
const check=app=>{methods.ensureUnlockedConsistency.call(app);return methods.getRoadmapContinueId.call(app)};

test('Tutti i punti della sequenza sbloccano solo il prossimo elemento',()=>{
  for(let n=0;n<=all.length;n++){
    const app=create(all.slice(0,n).map(x=>x.id));
    const focus=check(app);
    assert.deepEqual(app.state.completedLessons,all.slice(0,Math.min(n+1,all.length)).map(x=>x.id));
    assert.equal(focus,all[n]?.id??null);
    const writes=app.saves;
    check(app);
    assert.equal(app.saves,writes,'Ricalcolo idempotente (no salvataggi extra)');
  }
});
test('Salvataggio precedente ai quiz: nessun blocco prima di un consolidamento concluso',()=>{
  for(let chapter=1;chapter<=15;chapter++){
    const last=all.filter(x=>x.chapterId===chapter).at(-1);
    const finalIndex=all.findIndex(x=>x.id===last.id);
    const app=create([last.id],[all[0].id]);
    check(app);
    for(const item of all.slice(0,finalIndex)){
      assert.ok(app.state.completedLessons.includes(item.id), 'Bloccato: '+item.id);
    }
    assert.equal(app.state.completedLessons.includes(all[finalIndex+1]?.id),!!all[finalIndex+1]);
    assert.deepEqual(app.state.finishedLessons,[last.id],'Nessun completamento fittizio');
  }
});
test('Quiz del capitolo 1 dopo la lezione 101 rimane accessibile se il consolidamento 4 è finito',()=>{
  const app=create([1,2,3,4],[1,2,3,4]);
  assert.equal(check(app),5);
  assert.ok(app.state.completedLessons.includes(202));
  assert.ok(!app.state.finishedLessons.includes(202));
});
test('Sblocco completo solo su localhost, non sul sito pubblico',()=>{
  const local=create([],[],true,true);
  check(local);
  assert.equal(local.state.completedLessons.length,all.length);
  const online=create([],all.map(x=>x.id),true,false);
  check(online);
  assert.deepEqual(online.state.completedLessons,[all[0].id]);
  assert.equal(online.state.devAllUnlocked,false);
});
