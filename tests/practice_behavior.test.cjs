'use strict';
// Regression tests for data-dependent practice evaluation.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const win={};
const context=vm.createContext({window:win,console,Date});
for(const file of ['lessons.js','lesson_practice.js','curriculum_extension.js',
  'practice_catalog.js','chapter_quizzes.js','gameplay_lessons.js',
  'curriculum_restructure.js','practice-behavior.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const lessons=win.LESSONS_DATA.filter(l=>!l.isQuiz);
assert.equal(lessons.length,85);
let total=0,probed=0;
for(const lesson of lessons){
  const tasks=win.LessonPractice.tasksFor(lesson);
  assert.equal(tasks.length,4,'Unexpected task count in '+lesson.id);
  for(const task of tasks.filter(t=>!t.nativeOriginal&&!t.nativeGameplay)){
    total++;
    const probes=win.GDHPracticeBehavior.createProbes(lesson,task,task.solution);
    if(lesson.chapterId===1)assert.equal(probes.length,0);
    else {
      assert.ok(probes.length>=1,'No counterexample for '+lesson.id+'/'+task.key);
      probed++;
      for(const p of probes){
        assert.notEqual(p.reference,task.solution,'Unchanged reference');
        assert.notEqual(p.student,task.solution,'Unchanged candidate');
        assert.match(p.reference,/func |class /);
      }
    }
  }
}
assert.equal(total,243);
assert.equal(probed,228);
// The old grader alone accepts this cheat: the new native check must try
// the same alternate input in reference and candidate (4 instead of 10).
const gate=lessons.find(l=>l.id===17);
const task=win.LessonPractice.tasksFor(gate).find(t=>t.key==='p2');
const cheating='extends Node\nfunc _ready():\n    var punti = 10\n    if punti >= 10:\n        pass\n    else:\n        pass\n    print("Aperto")\n';
assert.ok(win.LessonPractice.grade(task,cheating,'Aperto').every(c=>c.passed),
  'The test is not exercising the vulnerable old behavior');
const challenge=win.GDHPracticeBehavior.createProbes(gate,task,cheating);
assert.equal(challenge.length,1);
assert.match(challenge[0].reference,/punti = 4/);
assert.match(challenge[0].student,/punti = 4/);
assert.match(challenge[0].student,/print\("Aperto"\)/);
assert.match(challenge[0].reference,/print\("Chiuso"\)/);
// Do not reject an alternative merely because it has no known mutation
// anchor: a valid differently structured solution requires its own behavior test.
const different=win.GDHPracticeBehavior.createProbes(gate,task,
 'extends Node\nfunc _ready():\n    if 10 >= 10:\n        print("Aperto")\n    else:\n        print("Chiuso")\n');
assert.equal(different.length,0);
console.log('PASS: '+probed+'/'+total+' non-gameplay drills have discriminating native-input probes');
