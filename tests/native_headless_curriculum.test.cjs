'use strict';
// Runs real Godot; no browser, transpiler, or mock execution.
// GODOT_BIN=/path/to/godot node tests/native_headless_curriculum.test.cjs
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),w={};
const ctx=vm.createContext({window:w,console});
for(const f of ['lessons.js','curriculum_extension.js','chapter_quizzes.js','gameplay_lessons.js','curriculum_restructure.js','native/lesson-fixtures.js','native/lesson-validation.js','native/lesson-validation-native-scenes.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const lab=w.GDHLessonLab,entries=[];
for(const fixture of w.GDHLessonFixtures.filter(x=>x.id<=60)){
  const lesson=w.LESSONS_DATA.find(l=>l.id===fixture.id);
  entries.push({fixture,code:lesson.solution,name:String(lesson.id)});
}
const alt=(id,change)=>{const fixture=w.GDHLessonFixtures.find(x=>x.id===id);entries.push({fixture,code:change(fixture.solution),name:id+'-alternative'});};
alt(34,s=>s.replace('posizione.x += velocita','posizione += Vector2(velocita, 0)'));
alt(50,s=>s.replaceAll('$Titolo','get_node("Titolo")'));
alt(54,s=>s.replaceAll('quando_premuto','esegui_attacco'));
alt(55,s=>s.replaceAll('al_click','aggiungi_punto').replace('punti += 1','punti = punti + 1'));
alt(56,s=>s.replaceAll('attiva_motori','accelera').replaceAll('attiva_allarme','difendi'));
const cases=entries.flatMap(e=>[{key:'base',code:e.code},...lab.scenarios(e.fixture.id,e.code)].map(step=>({
 key:e.name+'/'+step.key,code:step.code,options:{inspect:e.fixture.properties||[],locals:step.key==='base'?lab.captureNames(e.fixture.id,e.code)||[]:[],calls:step.key==='base'?e.fixture.calls||[]:[],emissions:step.key==='base'?e.fixture.emissions||[]:[],objectCalls:step.key==='base'?e.fixture.objectCalls||[]:[],scene:e.fixture.scene||0,actions:step.actions||e.fixture.actions||[]}
})));
const dir=fs.mkdtempSync('/tmp/gdh-curriculum-');
try{
 const input=path.join(dir,'cases.json');fs.writeFileSync(input,JSON.stringify(cases));
 const execution=spawnSync(process.env.GODOT_BIN||'godot',['--headless','--path',root,'--script','tests/native_godot/curriculum.gd','--',input],{encoding:'utf8',maxBuffer:16*1024*1024,timeout:120000});
 assert.equal(execution.status,0,execution.stderr||String(execution.error));
 assert.doesNotMatch(execution.stderr||'',/SCRIPT ERROR|ERROR:/,'Native execution errors');
 const output=execution.stdout;
 const results={};let key=null,lines=[];
 for(const line of output.split(/\r?\n/)){
  if(line.startsWith('__GDH_BEGIN__')){key=line.slice(13);lines=[];}
  else if(line.startsWith('__GDH_REPLY__')){results[key]={reply:JSON.parse(line.slice(13)),stdout:lines.join('\n'),stderr:''};key=null;}
  else if(key)lines.push(line);
 }
 const failures=[];
 for(const e of entries){
  const steps={};for(const c of cases.filter(c=>c.key.startsWith(e.name+'/')))steps[c.key.slice(e.name.length+1)]=results[c.key];
  assert.ok(steps.base,'Missing Godot reply '+e.name);
  const b=steps.base,result=lab.grade(e.fixture.id,e.code,b.reply,b.stdout,b.stderr,steps);
  if(!result.passed)failures.push({lesson:e.name,failed:result.checks.filter(c=>!c.passed)});
 }
 assert.deepEqual(failures,[],'Godot rejected course solutions');
 console.log('PASS real Godot: '+entries.length+' solutions, '+cases.length+' executions (including equivalent syntax).');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
