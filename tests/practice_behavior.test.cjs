'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),{w}=require('./helpers/load_course.cjs')();
let count=0;
for(const id of w.GDHIndividualPractice.ids){
 const l=w.LESSONS_DATA.find(x=>x.id===id);
 for(const t of w.LessonPractice.tasksFor(l).filter(x=>!x.nativeOriginal)){
  const p=w.GDHPracticeBehavior.createProbes(l,t,t.solution);
  assert.equal(p.length,1,'Missing scenario '+id+'/'+t.key);
  assert.notEqual(p[0].reference,t.solution);
  assert.equal(p[0].student,p[0].reference,'Official mismatch '+id+'/'+t.key);
  assert.ok(p[0].student.includes('func _ready()'));
  count++;
 }
}
const l=w.LESSONS_DATA.find(x=>x.id===17),t=w.LessonPractice.getTask(17,'p2');
const cheating=t.solution.replace(/print\(livello >= 7\)/,"var controllo = livello >= 7\n    print(true)");
const c=w.GDHPracticeBehavior.createProbes(l,t,cheating);
assert.equal(c.length,1);
assert.notEqual(c[0].reference,c[0].student);
assert.equal(count,152);
console.log('PASS: 152 individual behavior probes; fixed-output bypass detected.');
