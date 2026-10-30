'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),w={},ctx=vm.createContext({window:w,console,Date});
for(const f of ['lessons.js','lesson_practice.js','curriculum_extension.js','practice_catalog.js','curriculum_drills_v2.js','chapter_quizzes.js','gameplay_lessons.js','curriculum_restructure.js'])
 vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const ls=w.LESSONS_DATA.filter(l=>!l.isQuiz),catalog=w.LessonPractice,ids=w.GDHIndividualPractice.ids;
assert.equal(ls.length,85);assert.equal(ids.length,76);
let total=0,personalized=0;
const names=new Set();
for(const l of ls){
 const tasks=catalog.tasksFor(l);
 const expected=l.chapterId===1||l.chapterId===10?4:3;
 assert.equal(tasks.length,expected,'Incorrect task count '+l.id);
 assert.equal(new Set(tasks.map(t=>t.key)).size,expected);
 assert.ok(tasks.some(t=>t.nativeOriginal));
 for(const t of tasks){
  total++;
  assert.ok(t.title&&t.task&&t.initialCode&&t.solution);
  if(t.nativeOriginal||t.nativeGameplay)continue;
  const checks=catalog.grade(t,t.solution,t.expectedOutput);
  assert.ok(checks.every(c=>c.passed),'Invalid solution '+l.id+'/'+t.key+': '+JSON.stringify(checks));
  assert.equal(catalog.grade(t,t.solution,'INVALID_OUTPUT')[0].passed,false);
  if(l.chapterId!==1){
   personalized++;
   assert.equal(t.behaviorInputs.length,1,'Missing input scenario '+l.id+'/'+t.key);
   const name=t.title.toLowerCase().normalize('NFKD').replace(/\s+/g,' ').trim();
   assert.ok(!names.has(name),'Repeated drill '+name);
   names.add(name);
   assert.ok(t.task.length>=35);
  }
 }
}
assert.equal(personalized,152);
assert.equal(total,264);
const old=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(old.indexOf('practice_catalog.js')<old.indexOf('curriculum_drills_v2.js'));
assert.ok(old.indexOf('curriculum_drills_v2.js')<old.indexOf('app.js'));
console.log('PASS: 85 lessons, 152 individualized drills, 264 tasks, unique titles and valid source checks.');
