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
    // Un consolidamento già passato certifica le tappe precedenti del
    // salvataggio storico: non mostrare mai nuove croci o triangoli a ritroso.
    assert.deepEqual(app.state.finishedLessons,all.slice(0,finalIndex+1).map(l=>l.id),
      'I prerequisiti legacy vanno riconosciuti come completati');
  }
});
test('Ristrutturazione: il consolidamento già superato riconosce i nuovi quiz e lezioni intermedie',()=>{
  const app=create([1,2,3,4],[1,2,3,4]);
  const xp=150;app.state.xp=xp;
  assert.equal(check(app),5);
  for(const id of [201,3,101,202,4])
    assert.ok(app.state.finishedLessons.includes(id),'Spunta persa: '+id);
  assert.ok(app.state.completedLessons.includes(5));
  assert.equal(app.state.xp,xp,'Nessun XP attribuito per migrazioni retroattive');
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

test('Screenshot reale: quiz 201 e consolidamento 4 conclusi, esercizi 3/101/202 non devono restare incompleti',()=>{
  const app=create([201,4],[1,2,201,3,101,202,4]);
  app.state.xp=145;
  const focus=check(app);
  const end=all.findIndex(x=>x.id===4);
  assert.equal(focus,5);
  assert.deepEqual(app.state.finishedLessons,all.slice(0,end+1).map(x=>x.id));
  assert.equal(app.state.xp,145);
  const writes=app.saves;
  check(app);
  assert.equal(app.saves,writes,'Nessun salvataggio ripetuto dopo la riparazione');
});

test('Se la quarta attività è salvata ma la spunta manca, recupera il completamento senza XP duplicati',()=>{
  const mockPractice={
    enabled:id=>id===1,
    tasksFor:()=>[{key:'base'},{key:'p2'},{key:'p3'},{key:'p4'}]
  };
  const localMethods=new Function('LESSONS_DATA','window',
    'return {'+appSource.slice(start,end)+'};')(all,{LessonPractice:mockPractice});
  const app=create();
  app.state.lessonTaskProgress={'1':{completed:['base','p2','p3','p4'],codes:{base:'bozza originale'}}};
  app.state.xp=30;
  localMethods.ensureUnlockedConsistency.call(app);
  assert.ok(app.state.finishedLessons.includes(1));
  assert.ok(app.state.completedLessons.includes(2));
  assert.equal(app.state.xp,30);
  assert.equal(app.state.lessonTaskProgress['1'].codes.base,'bozza originale');
});

test('La modalita sviluppatore puo aprire lezioni future senza completarle automaticamente',()=>{
  const app=create([4],[],true,true);
  check(app);
  assert.deepEqual(app.state.finishedLessons,[4]);
  assert.equal(app.state.completedLessons.length,all.length);
});
