'use strict';
const assert=require('assert/strict'),fs=require('fs'),vm=require('vm');
const {w,ctx,files}=require('./helpers/load_course.cjs')();
const P=require('../progression.js');
const tests={
 curriculum(){
  assert.equal(w.LESSONS_DATA.length,235);assert.equal(w.CHAPTERS_DATA.length,43);
  assert.deepEqual(Array.from(w.LESSONS_DATA,l=>l.id),Array.from({length:235},(_,i)=>10001+i));
  assert.equal(new Set(w.LESSONS_DATA.map(l=>l.manualLessonNumber)).size,235);
  assert.ok(files.includes('manuale235/course-finale.js'));
  assert.ok(!files.some(f=>f==='chapter_quizzes.js'||f==='course_capstone.js'));
  assert.ok(w.LESSONS_DATA.every(l=>l.validationReady&&typeof l.validate==='function'));
 },
 content(){
  for(const l of w.LESSONS_DATA){assert.ok(l.task&&l.theory&&l.initialCode,l.title);assert.ok(l.conceptId.startsWith('manual_chapter_'));}
  assert.match(w.LESSONS_DATA[0].initialCode,/print\("Ciao GDScript!"\)/);
  assert.match(w.LESSONS_DATA[1].initialCode,/print\(""\)/);
  assert.ok(w.LESSONS_DATA.slice(170).every(l=>l.requiresMultipleFiles));
  const solutions=require('../manuale235/solutions.json');
  assert.equal(Object.keys(solutions).length,235);
  for(const l of w.LESSONS_DATA){const solved={...l.sourceFiles,...solutions[l.manualLessonNumber]};
   if(l.requiresMultipleFiles){const p=w.GDHManualProject.prepare(l,solved);assert.equal(p.entry,'main.gd');assert.ok(Object.keys(p.files).length>=2);}
  }
 },
 progression(){
  const app=loadApp();app.saveStorage=()=>{};app.isLocalEnvironment=()=>false;
  const ids=Array.from(w.LESSONS_DATA,l=>l.id);
  for(let n=0;n<=ids.length;n++){
   app.state.finishedLessons=ids.slice(0,n);app.state.completedLessons=[];
   app.ensureUnlockedConsistency();
   assert.deepEqual(Array.from(app.state.finishedLessons),ids.slice(0,n));
   assert.deepEqual(Array.from(app.state.completedLessons),ids.slice(0,Math.min(n+1,ids.length)));
   assert.equal(app.getRoadmapContinueId(),ids[n]??null);
  }
  app.state.finishedLessons=[1,201,10005];app.state.xp=50;app.ensureUnlockedConsistency();
  assert.deepEqual(Array.from(app.state.finishedLessons),[10005]);assert.equal(app.getRoadmapContinueId(),10001);
  assert.equal(app.state.xp,50);assert.ok(!app.state.finishedLessons.includes(10001));
 },
 review(){
  assert.equal(w.REVIEW_VARIANTS.length,235);
  assert.equal(w.ReviewEngine.getAllConceptsWithStatus({finishedLessons:[]}).flatMap(c=>c.variants).length,0);
  const state={finishedLessons:[10001],reviewProgress:{completedVariants:[],variantHistory:{}},learningTelemetry:{daily_activity:{}}};
  assert.equal(w.ReviewEngine.getAllConceptsWithStatus(state).flatMap(c=>c.variants).length,1);
  w.ReviewEngine.recordVariantAttempt('manual_review_10001',true,0,state);
  assert.ok(state.reviewProgress.completedVariants.includes('manual_review_10001'));
  assert.deepEqual(state.finishedLessons,[10001]);
 },
 xp(){
  const app=loadApp(),l=w.LESSONS_DATA[0];app.state.xp=0;
  assert.equal(app.creditLessonXp(l),50);assert.equal(app.creditLessonXp(l),0);assert.equal(app.state.xp,50);
  const auth=loadAuth();
  const a={xp:150,lessonRewardsV1:{10001:50},rewardsV2:P.createRewards(0)};
  const b={xp:150,lessonRewardsV1:{10002:50},rewardsV2:P.createRewards(0)};
  const merged=auth.mergeProgress(a,b);assert.equal(merged.xp,200);assert.equal(auth.mergeProgress(merged,a).xp,200);
  const c={xp:50,lessonRewardsV1:{10001:50},rewardsV2:P.createRewards(0)};
  assert.equal(auth.mergeProgress(c,c).xp,50);
 },
 drafts(){
  const auth=loadAuth();
  const a={xp:0,manualDrafts:{10171:{files:{'a.gd':'local A','b.gd':'base B'},fileUpdatedAt:{'a.gd':20,'b.gd':1},updatedAt:20}}};
  const b={xp:0,manualDrafts:{10171:{files:{'a.gd':'base A','b.gd':'remote B'},fileUpdatedAt:{'a.gd':1,'b.gd':30},updatedAt:30}}};
  const m=auth.mergeProgress(a,b);assert.equal(m.manualDrafts[10171].files['a.gd'],'local A');assert.equal(m.manualDrafts[10171].files['b.gd'],'remote B');
  const stdinOnly={xp:0,manualDrafts:{10171:{files:{'a.gd':'base A'},stdin:'nuovo input',updatedAt:99,fileUpdatedAt:{}}}};
  assert.equal(auth.mergeProgress(a,stdinOnly).manualDrafts[10171].files['a.gd'],'local A','Modificare stdin non deve sovrascrivere il codice su un altro dispositivo');
  const backup=auth.createBackupPayload({...m,lessonRewardsV1:{10001:50}});
  const parsed=auth.parseBackupString(JSON.stringify(backup)).data;
  assert.equal(JSON.stringify(parsed.manualDrafts),JSON.stringify(m.manualDrafts));assert.equal(parsed.lessonRewardsV1[10001],50);
  const app=loadApp();
  vm.runInContext(fs.readFileSync('manuale235/studio.js','utf8'),ctx);
  assert.equal(typeof w.GDHManualStudio.showSolution,'function');
  const lesson=w.LESSONS_DATA[170],draft=w.GDHManualStudio.getDraft(lesson);
  draft.files['greeter.gd']='bozza prima identita';
  draft.files['main.gd']='falso';
  assert.equal(w.GDHManualStudio.getDraft(lesson).files['main.gd'],lesson.sourceFiles['main.gd']);
  const previous=app.state;app.state={userCode:{},manualDrafts:{}};
  assert.notEqual(w.GDHManualStudio.getDraft(lesson).files['greeter.gd'],'bozza prima identita');
  app.state=previous;
  assert.equal(app.hasOverlappingCloudDrafts(a,b,{data:{manualDrafts:{10171:{files:{'a.gd':'base A','b.gd':'base B'}}}}}),false);
  const conflict={xp:0,manualDrafts:{10171:{files:{'a.gd':'other A'},updatedAt:40}}};
  assert.equal(app.hasOverlappingCloudDrafts(a,conflict),true);
 },
 async grading(){
  for(const l of w.LESSONS_DATA.slice(0,170)){
   const r=await w.GDHManualVerifier.verify(l.id,'extends Node\nfunc _ready():\n    print("sbagliato")',async()=>({status:'executed',stdout:'sbagliato',stderr:'',reply:{status:'executed'}}));
   assert.equal(r.accepted,false,'Output fisso accettato '+l.id);
  }
  for(const l of w.LESSONS_DATA.slice(170)){
   for(const locked of l.readOnlyFiles||['main.gd'])assert.throws(()=>w.GDHManualProject.prepare(l,{...l.sourceFiles,[locked]:l.sourceFiles[locked]+'\n# modifica'}),/modificato/);
  }
 }
};
function loadApp(){
 Object.assign(ctx,{ProgressionV2:P,SoundFX:{enabled:true,volume:.8},setTimeout,clearTimeout});
 w.addEventListener=()=>{};
 ctx.document.getElementById=()=>null;
 vm.runInContext('(()=>{'+fs.readFileSync('app.js','utf8')+'})()',ctx);
 return w.App;
}
function loadAuth(){Object.assign(ctx,{ProgressionV2:P,SoundFX:{enabled:true,volume:.8},localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});w.ProgressionV2=P;vm.runInContext('(()=>{'+fs.readFileSync('auth.js','utf8')+'})()',ctx);return w.AuthManager;}
async function run(names=Object.keys(tests)){for(const n of names){await tests[n]();console.log('PASS manuale: '+n);}}
module.exports=run;
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1});
