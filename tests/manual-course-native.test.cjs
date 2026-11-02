'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert/strict'),{spawnSync}=require('child_process');
const {w}=require('./helpers/load_course.cjs')();
const solutions=require('../manuale235/solutions.json'),requests=[];
const verifier=w.GDHManualVerifier;
let files;
w.GDHManualStudio={getDraft:()=>({files})};
const lessonCode=(l,override={})=>{
 files={...l.sourceFiles,...solutions[l.manualLessonNumber],...override};
 return files[Object.keys(files).find(f=>!l.requiresMultipleFiles||!(l.readOnlyFiles||['main.gd']).includes(f))]||l.initialCode;
};
const observed=(l,c)=>{
 let stdout=l.expectedOutput;
 if(c){
  if(c.linesSpec)stdout=c.linesSpec.map(x=>typeof x==='string'?x:(x.prefix||'')+JSON.stringify(x.object)).join('\n');
  else if(c.object!==undefined)stdout=(c.prefix!==undefined?c.prefix+'\n':'')+JSON.stringify(c.object);
  else stdout=c.output||'';
 }
 return {status:'executed',stderr:'',stdout,reply:{status:'executed',methodCalls:(c?.calls||[]).map((call,i)=>({method:call.method,status:'executed',value:c.returns?.[i]}))}};
};
const native=s=>s.replace(/String\(JavaScriptBridge\.eval\("window\.__gdhManualReadStdin\(\)"\)\)/g,'str(Engine.get_meta("__manual_input").pop_front())');
async function run({numbers=null,negative=true}={}){
 const lessons=w.LESSONS_DATA.filter(l=>!numbers||numbers.includes(l.manualLessonNumber));
 const plans=lessons.map(l=>({l,label:'solution',accepted:true,override:{}}));
 const alternatives={
  19:solutions[19]['main.gd'].replace('var a: int = 12','var a: int = -12').replace('var b: int = 2','var b: int = -2'),
  55:'func sigma(n: int):\n    return n * (n + 1) / 2',
  72:solutions[72]['main.gd'].replace('text.split(" ", false)','text.strip_edges().split(" ", false)'),
  93:solutions[93]['main.gd'].replace('score.pad_zeros(6)','score.lpad(6, "0")')
 };
 for(const [n,code] of Object.entries(alternatives)){
  const l=lessons.find(l=>l.manualLessonNumber===Number(n));
  if(l)plans.push({l,label:'alternative',accepted:true,override:{'main.gd':code}});
 }
 if(negative){
  for(const l of lessons.filter(l=>l.manualLessonNumber!==1))plans.push({l,label:'starter',accepted:false,override:{...l.sourceFiles,...(!l.requiresMultipleFiles?{'main.gd':l.initialCode}:{})}});
  const mutations=[
   [216,'score_manager.gd','if instance == null:','if true:'],
   [217,'enemy_factory.gd','match kind.to_lower():','match kind:'],
   [218,'weather_station.gd','if temperature_changed.is_connected(display.on_temperature_changed):','if false and temperature_changed.is_connected(display.on_temperature_changed):'],
   [219,'fixed_off.gd','return maxi(0, total - amount)','return total - amount'],
   [220,'command_history.gd','done.pop_back()','done.pop_front()'],
   ...require('./helpers/manual-finale-mutations.cjs')
  ];
  for(const [n,file,from,to] of mutations){const l=lessons.find(l=>l.manualLessonNumber===n);if(!l)continue;
   const before=solutions[n][file];assert.ok(before.includes(from));
   plans.push({l,label:'mutation',accepted:false,override:{[file]:before.replace(from,to)}});
  }
 }
 for(const plan of plans){
  const {l,label,override}=plan;
  const code=lessonCode(l,override);let index=0;
  await verifier.verify(l.id,code,async(code,options)=>{
   const c=verifier.expectedCases[l.manualLessonNumber]?.[index];
   const opts=JSON.parse(JSON.stringify(options));
   if(opts.project)for(const f in opts.project.files)opts.project.files[f]=native(opts.project.files[f]);
   requests.push({key:l.id+'/'+label+'/'+index++,code:native(code),options:opts});
   return observed(l,c);
  });
 }
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gdh-all-'));
 try{
  const input=path.join(dir,'cases.json');fs.writeFileSync(input,JSON.stringify(requests));
  const r=spawnSync('/bin/sh',['-c','exec \"$@\" 2>&1','gdh-native',process.env.GODOT_BIN||'godot','--headless','--path',path.resolve('native/project'),'--script',path.resolve('tests/native_godot/manual_cases.gd'),'--',input],{encoding:'utf8',maxBuffer:30*1024*1024,timeout:180000});
  fs.writeFileSync('/tmp/gdh-all-native-stderr.log',r.stderr||'');
  assert.equal(r.status,0,String(r.error||r.signal||'')+'\n'+r.stderr?.slice(0,3000));
  const outputs={};let key,lines=[];
  for(const line of r.stdout.split(/\r?\n/)){
   if(line.startsWith('__GDH_BEGIN__')){key=line.slice(13);lines=[];}
   else if(line.startsWith('__GDH_REPLY__')){const reply=JSON.parse(line.slice(13));outputs[key]={status:reply.status,reply,stdout:lines.join('\n'),stderr:lines.some(l=>/^(SCRIPT ERROR|ERROR):/.test(l))?lines.join('\n'):''};key=null;}
   else if(key)lines.push(line);
  }
  const failures=[];
  for(const {l,label,override,accepted} of plans){
   const code=lessonCode(l,override);let index=0;
   const result=await verifier.verify(l.id,code,async()=>outputs[l.id+'/'+label+'/'+index++]||{status:'missing',stderr:'Esecuzione mancante'});
   if(result.accepted!==accepted)failures.push({lesson:l.manualLessonNumber,label,expected:accepted,checks:result.feedback?.checks?.filter(c=>!c.passed)});
  }
  if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1;return;}
  console.log('PASS: '+lessons.length+' soluzioni, '+requests.length+' scenari, '+plans.filter(p=>!p.accepted).length+' controlli negativi; risorse native multifile.');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
module.exports=run;
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1});
