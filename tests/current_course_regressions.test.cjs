'use strict';
// Tests the public curriculum through the shared index.html manifest loader.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {w:browser}=require('./helpers/load_course.cjs')();
const lessons=browser.LESSONS_DATA.filter(l=>!l.isQuiz);
const practice=browser.LessonPractice;
assert.equal(lessons.length,85,'Il percorso pubblicato include 85 esercizi non quiz');
let total=0,physics=0,validated=0;
for(const lesson of lessons){
  assert.ok(practice.enabled(lesson.id),'Attività non abilitata: '+lesson.id);
  const tasks=practice.tasksFor(lesson);
  const count=lesson.chapterId===1||lesson.chapterId===10?4:3;
  assert.equal(tasks.length,count,'Numero di compiti errato: '+lesson.id);
  assert.equal(new Set(tasks.map(t=>t.key)).size,count,'Chiavi duplicate: '+lesson.id);
  const base=tasks.filter(t=>t.nativeOriginal);
  assert.equal(base.length,1,'Manca una verifica nativa: '+lesson.id);
  assert.equal(base[0].solution,lesson.solution,'La soluzione originale cambia: '+lesson.id);
  assert.equal(tasks[lesson.isMastery?count-1:0].key,'base',
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
assert.equal(total,264);
assert.equal(physics,12);
assert.equal(validated,167,'Le soluzioni dei compiti aggiuntivi vanno controllate sul nuovo corso');
// Regressione: le lezioni riordinate devono utilizzare i template dei capitoli originali.
const oldChapter=lessons.find(l=>l.id===5);
assert.equal(oldChapter.legacyChapterId,2);
assert.equal(JSON.stringify(practice.tasksFor(oldChapter).map(t=>t.key)),JSON.stringify(['base','p2','p3']));
// Le consegne nuove devono spiegare cosa fare con valori specifici,
// invece di ripetere un'istruzione generica in tutte le lezioni.
const supplemental=lessons.filter(l=>l.isSupplemental);
assert.equal(supplemental.length,21);
for(const lesson of supplemental){
  assert.ok(lesson.task.length>155,'Consegna troppo generica: '+lesson.id);
  assert.doesNotMatch(lesson.task,/Scrivi il codice per ottenere il comportamento richiesto|non limitarti a stampare una risposta preconfezionata/i,
    'La consegna non deve usare il vecchio testo generico: '+lesson.id);
  assert.ok(lesson.task.includes('<code>'),'La consegna deve citare dati o API concreti: '+lesson.id);
}
const scriptReady=supplemental.find(l=>l.id===101);
assert.match(scriptReady.task,/Avvio: OK/);
assert.match(scriptReady.task,/Controllo: OK/);
assert.match(scriptReady.task,/print\(\)/);
assert.notEqual(scriptReady.has2DViewport,true); // Nessuna viewport per uno script solo console.

// Il completamento di un compito non assegna automaticamente XP.
assert.equal(practice.tasksFor(lessons.find(l=>l.id===1)).length,4);
console.log('PASS: current course',lessons.length,'lessons,',total,
  'tasks,',validated,'practice solutions,',physics,'native physics drills.');
