'use strict';
// Tests the actual course loaded by index.html, not the pre-restructure 324-task catalogue.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const browser={};
const ctx=vm.createContext({window:browser,console,Date});
for(const file of ['lessons.js','lesson_practice.js','curriculum_extension.js',
  'practice_catalog.js','chapter_quizzes.js','gameplay_lessons.js','curriculum_restructure.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
}
const lessons=browser.LESSONS_DATA.filter(l=>!l.isQuiz);
const practice=browser.LessonPractice;
assert.equal(lessons.length,85,'Il percorso pubblicato include 85 esercizi non quiz');
let total=0,physics=0,validated=0;
for(const lesson of lessons){
  assert.ok(practice.enabled(lesson.id),'Attività non abilitata: '+lesson.id);
  const tasks=practice.tasksFor(lesson);
  assert.equal(tasks.length,4,'Non quattro compiti: '+lesson.id);
  assert.equal(new Set(tasks.map(t=>t.key)).size,4,'Chiavi duplicate: '+lesson.id);
  const base=tasks.filter(t=>t.nativeOriginal);
  assert.equal(base.length,1,'Manca una verifica nativa: '+lesson.id);
  assert.equal(base[0].solution,lesson.solution,'La soluzione originale cambia: '+lesson.id);
  assert.equal(tasks[lesson.isMastery?3:0].key,'base',
    'La posizione della verifica finale è sbagliata: '+lesson.id);
  for(const t of tasks){
    total++;
    assert.ok(t.title&&t.task!==undefined&&t.solution&&typeof t.initialCode==='string',
      'Compito incompleto: '+lesson.id+'/'+t.key);
    if(t.nativeOriginal)continue;
    if(t.nativeGameplay){
      assert.ok([301,302,303,304].includes(lesson.id));
      physics++;
      assert.equal(t.expectedOutput,'','Il gameplay non deve essere valutato via print');
    }else{
      const checks=practice.grade(t,t.solution,t.expectedOutput);
      assert.ok(checks.length&&checks.every(c=>c.passed),
        'Soluzione respinta '+lesson.id+'/'+t.key+': '+
        JSON.stringify(checks.filter(c=>!c.passed)));
      validated++;
    }
  }
}
assert.equal(total,340);
assert.equal(physics,12);
assert.equal(validated,243,'Le soluzioni dei compiti aggiuntivi vanno controllate sul nuovo corso');
// Regressione: le lezioni riordinate devono utilizzare i template dei capitoli originali.
const oldChapter=lessons.find(l=>l.id===5);
assert.equal(oldChapter.legacyChapterId,2);
assert.deepEqual(practice.tasksFor(oldChapter).map(t=>t.key),['base','p2','p3','p4']);
// Il completamento di un compito non assegna automaticamente XP.
assert.equal(practice.tasksFor(lessons.find(l=>l.id===1)).length,4);
console.log('PASS: current course',lessons.length,'lessons,',total,
  'tasks,',validated,'practice solutions,',physics,'native physics drills.');
