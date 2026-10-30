'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),{w}=require('./helpers/load_course.cjs')();
let accepted=0,commented=0,wrong=0;
for(const id of w.GDHIndividualPractice.ids){
 for(const t of w.LessonPractice.tasksFor(w.LESSONS_DATA.find(l=>l.id===id)).filter(t=>!t.nativeOriginal)){
  const checks=(src,out)=>w.LessonPractice.grade(t,src,out).every(x=>x.passed);
  assert.ok(checks(t.solution,t.expectedOutput),'Official '+id+'/'+t.key);accepted++;
  assert.ok(checks(t.solution+'\n# commento libero\n',t.expectedOutput),'Comment '+id+'/'+t.key);commented++;
  assert.ok(!checks(t.solution,'ERR'),'Output mismatch '+id+'/'+t.key);wrong++;
 }
}
const adapter=fs.readFileSync(path.join(root,'native/native-beta-adapter.js'),'utf8');
assert.ok(adapter.includes('GDHPracticeBehavior?.createProbes'));
assert.ok(adapter.includes('const passed=valid&&!probeError'));
console.log('PASS:',JSON.stringify({accepted,commented,wrong}));
