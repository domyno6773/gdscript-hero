'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{},console});
for(const file of ['lessons.js','curriculum_extension.js','chapter_quizzes.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const lessons=context.window.LESSONS_DATA;
const extension=context.window.GDHCurriculumExtension;
const quizzes=context.window.GDHChapterQuizzes;
assert.equal(lessons.length,111);
assert.equal(new Set(lessons.map(l=>l.id)).size,111,'ID duplicati');
assert.ok(lessons.every((l,i)=>l.displayIndex===i+1),'La numerazione visibile dev essere consecutiva');
assert.equal(lessons.filter(l=>!l.isQuiz).length,81);
assert.equal(lessons.filter(l=>l.isQuiz).length,30);
assert.equal(lessons.filter(l=>l.isSupplemental).length,21);
assert.equal(lessons.filter(l=>l.isConsolidation).length,15);
assert.equal(extension.count,21);
assert.equal(quizzes.sessions.length,30);
assert.equal(quizzes.sessions.reduce((n,s)=>n+s.questions.length,0),90);
for(let chapter=1;chapter<=15;chapter++){
 const items=lessons.filter(l=>l.chapterId===chapter);
 const quizItems=items.filter(l=>l.isQuiz);
 assert.equal(quizItems.length,2,'Due quiz per capitolo '+chapter);
 assert.ok(items[2].isQuiz,'Il primo quiz segue due esercizi '+chapter);
 assert.ok(items.at(-2).isQuiz,'Il secondo quiz precede il consolidamento '+chapter);
 assert.ok(items.at(-1).isMastery&&items.at(-1).isConsolidation,
   'Consolidamento non conclusivo '+chapter);
 assert.ok(items.length>=7,'Poche attività capitolo '+chapter);
}
for(const session of quizzes.sessions){
 assert.equal(session.questions.length,3);
 assert.deepEqual(Array.from(session.questions,q=>q.type),['single','multi','code']);
 const ids=new Set();
 for(const q of session.questions){
  assert.ok(!ids.has(q.id),'ID domanda duplicato');ids.add(q.id);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4,'Opzioni duplicate '+session.id+'/'+q.id);
  assert.ok(q.prompt&&q.hint&&q.explanation);
  if(q.type==='code')assert.ok(q.code.includes('□□□□'));
  if(q.type==='multi')assert.ok(q.correct.length>=2&&q.correct.length<=3);
  else assert.equal(q.correct.length,1);
  assert.ok(q.correct.every(i=>Number.isInteger(i)&&i>=0&&i<4));
 }
 const solutions=Object.fromEntries(session.questions.map(q=>[q.id,q.correct]));
 assert.ok(quizzes.grade(session,solutions).every(g=>g.correct),'Chiave corretta rifiutata '+session.id);
 assert.ok(quizzes.grade(session,{}).every(g=>!g.correct),'Risposta vuota accettata '+session.id);
 const wrong={...solutions,[session.questions[0].id]:[(session.questions[0].correct[0]+1)%4]};
 const grades=quizzes.grade(session,wrong);
 assert.equal(grades.filter(g=>g.correct).length,2,'Risposta errata non riconosciuta '+session.id);
}
(async()=>{
 for(const lesson of lessons.filter(x=>x.isSupplemental)){
  assert.equal(lesson.hints.length,3);
  assert.ok(lesson.theory.length>75&&lesson.task.length>75);
  assert.ok(lesson.solution&&lesson.initialCode&&lesson.expectedOutput);
  const fake=async code=>({status:'executed',
   stdout:code===lesson.solution?lesson.expectedOutput:'',
   stderr:'',reply:{status:'executed'}});
  const solution=await extension.verify(lesson.id,lesson.solution,fake);
  assert.ok(solution.accepted,'Soluzione ufficiale nuova respinta '+lesson.id+': '+JSON.stringify(solution.feedback.checks));
  const starter=await extension.verify(lesson.id,lesson.initialCode,fake);
  assert.equal(starter.accepted,false,'Codice iniziale già accettato '+lesson.id);
 }
 console.log('OK: 81 esercizi, 15 consolidamenti, 30 quiz/90 domande distribuiti in 15 capitoli.');
})().catch(e=>{console.error(e);process.exitCode=1;});
