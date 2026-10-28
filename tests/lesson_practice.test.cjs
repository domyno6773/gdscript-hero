'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const win={LESSONS_DATA:[1,2,3,4].map(id=>({
  id,chapterId:1,isMastery:id===4,task:'original',initialCode:'func _ready():\n    pass\n',
  solution:'func _ready():\n    print("base")\n',expectedOutput:'base',
  hints:[{level:1,text:'x'}]
}))};
vm.runInNewContext(fs.readFileSync(path.join(root,'lesson_practice.js'),'utf8'),
  {window:win,console});
const engine=win.LessonPractice;
for(const lesson of win.LESSONS_DATA){
  const tasks=engine.tasksFor(lesson);
  assert.equal(tasks.length,4,'Every pilot lesson has 4 tasks');
  assert.equal(new Set(tasks.map(t=>t.key)).size,4);
  assert.equal(tasks.filter(t=>t.nativeOriginal).length,1);
  for(const task of tasks.filter(t=>!t.nativeOriginal)){
    assert.ok(task.task&&task.solution&&task.initialCode&&task.expectedOutput);
    assert.equal(task.hints.length,3);
    const correct=engine.grade(task,task.solution,task.expectedOutput);
    assert.ok(correct.every(c=>c.passed),
      'Solution rejected '+lesson.id+'/'+task.key+': '+JSON.stringify(correct));
  }
}
assert.equal(engine.enabled(5),false,'Other chapters remain unchanged');
const l1=engine.tasksFor(win.LESSONS_DATA[0]);
const numeric=engine.tasksFor(win.LESSONS_DATA[2]);
const comments=engine.tasksFor(win.LESSONS_DATA[1]);
assert.equal(engine.grade(numeric[2],numeric[2].initialCode,numeric[2].expectedOutput)
  .every(x=>x.passed),false,'Quoted number must fail');
assert.equal(engine.grade(comments[1],comments[1].initialCode,comments[1].expectedOutput)
  .every(x=>x.passed),false,'Missing comment must fail');
assert.equal(engine.grade(l1[1],l1[1].initialCode,l1[1].expectedOutput)
  .every(x=>x.passed),false,'Empty script must fail');
const merged=engine.mergeProgress(
  {1:{completed:['base'],codes:{base:'local'},activeIndex:1}},
  {1:{completed:['p2'],codes:{p2:'remote'},activeIndex:2}});
assert.deepEqual([...merged[1].completed].sort(),['base','p2']);
assert.equal(merged[1].activeIndex,2);
assert.equal(merged[1].codes.base,'local');
assert.equal(merged[1].codes.p2,'remote');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('id="lesson-practice-progress"'));
assert.ok(html.includes('<script src="lesson_practice.js"></script>'));
console.log('PASS: 16 task definitions, 12 solutions, checks, merge and UI contract');
