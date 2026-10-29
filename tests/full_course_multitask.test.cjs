'use strict';
// node tests/full_course_multitask.test.cjs
// Analizza 81 percorsi e 243 esercizi aggiuntivi con runner simulato.
// Non sostituisce un test reale di Godot WebAssembly.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const browser={};
const ctx=vm.createContext({window:browser,console,Date});
function read(filename){
  return fs.readFileSync(path.join(root,filename),'utf8');
}
function run(filename){
  vm.runInContext(read(filename),ctx,{filename});
}
run('lessons.js');
run('lesson_practice.js');
run('curriculum_extension.js');
run('practice_catalog.js');
const practice=browser.LessonPractice;
const lessons=browser.LESSONS_DATA;
const originalKeys=new Set();
let total=0,original=0,extra=0;
assert.equal(lessons.length,81,'Il percorso comprende 81 lezioni');
assert.equal(new Set(lessons.map(x=>x.id)).size,81,'Gli ID delle lezioni sono univoci');
assert.equal(new Set(lessons.map(x=>x.chapterId)).size,15,'Capitoli coperti');
assert.equal(browser.GDHPracticeCatalog.chapters.length,14);
for(const lesson of lessons){
  const tasks=practice.tasksFor(lesson);
  assert.ok(practice.enabled(lesson.id),'Lezione non abilitata: '+lesson.id);
  assert.equal(tasks.length,4,'Ogni lezione deve proporre quattro compiti: '+lesson.id);
  assert.equal(new Set(tasks.map(t=>t.key)).size,4,'Chiavi duplicate: '+lesson.id);
  const base=tasks.find(t=>t.nativeOriginal);
  assert.ok(base&&base.key==='base','Manca il compito nativo: '+lesson.id);
  assert.equal(base.solution,lesson.solution,'La soluzione nativa rimane invariata');
  if(lesson.isMastery){
    assert.equal(tasks[3].key,'base','Il consolidamento rimane l’ultimo compito');
  }else{
    assert.equal(tasks[0].key,'base','L’esercizio originale rimane il primo');
  }
  for(const task of tasks){
    assert.equal(practice.getTask(lesson.id,task.key).solution,task.solution);
    assert.ok(task.task&&task.solution&&task.initialCode&&task.expectedOutput);
    assert.equal(task.hints.length,3,'Tre indizi progressivi');
    total++;
    if(task.nativeOriginal){original++;continue;}
    extra++;
    const checks=practice.grade(task,task.solution,task.expectedOutput);
    assert.ok(checks.every(c=>c.passed),
      'Soluzione ufficiale respinta '+lesson.id+'/'+task.key+': '+
      JSON.stringify(checks.filter(c=>!c.passed)));
    const bad=practice.grade(task,task.solution,'__OUTPUT_SCONOSCIUTO__');
    assert.equal(bad[0].passed,false,'L’output scorretto non deve essere accettato');
    if(task.requirements.mustUse){
      assert.ok(task.requirements.mustUse.length>0);
      const cheat='extends Node\n\nfunc _ready():\n    print("bar")\n';
      assert.ok(practice.grade(task,cheat,task.expectedOutput).some(c=>!c.passed),
        'Un output inventato non soddisfa i costrutti '+lesson.id+'/'+task.key);
    }
    if(lesson.chapterId>=2){
      assert.ok(!originalKeys.has(lesson.id+'/'+task.key));
      originalKeys.add(lesson.id+'/'+task.key);
    }
  }
}
// I dati esistenti non possono sparire durante un merge account o un sync.
const first=lessons.find(l=>l.id===23);
const incoming={'23':{completed:['base','p2'],codes:{base:'var mia_bozza = 7',p2:'altro codice'},activeIndex:2}};
const merged=practice.mergeProgress({'23':{completed:['base'],codes:{base:'var locale = 5'},activeIndex:0}},incoming);
assert.deepEqual([...merged['23'].completed].sort(),['base','p2']);
assert.equal(merged['23'].codes.base,'var mia_bozza = 7');
assert.equal(merged['23'].activeIndex,2);
const malformed=practice.mergeProgress({}, {'23':{completed:['base','inesistente'],codes:{},activeIndex:99}});
assert.deepEqual([...malformed['23'].completed],['base']);
assert.equal(malformed['23'].activeIndex,1);
const html=read('index.html');
const sources=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
assert.ok(sources.indexOf('curriculum_extension.js')<sources.indexOf('practice_catalog.js'));
assert.ok(sources.indexOf('practice_catalog.js')<sources.indexOf('app.js'));
assert.equal(total,324);
assert.equal(original,81);
assert.equal(extra,243);
console.log('PASS:',lessons.length,'lezioni,',total,'compiti,',extra,'nuovi, 15 capitoli.');
