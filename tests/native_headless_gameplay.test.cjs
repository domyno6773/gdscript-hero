'use strict';
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {spawnSync}=require('node:child_process');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),w={};
vm.runInNewContext(fs.readFileSync(path.join(root,'gameplay_lessons.js'),'utf8'),{window:w});
const api=w.GDHGameplayLessons;
(async()=>{
 const entries=api.entries.map(l=>({id:l.id,code:l.solution,accepted:true,name:String(l.id)}));
 const add=(id,name,code)=>entries.push({id,name,code,accepted:false});
 add(301,'301-no-delta',api.entries[0].solution.replace(' * delta',''));
 add(302,'302-inverted-input',api.entries[1].solution.replace('"ui_left", "ui_right"','"ui_right", "ui_left"'));
 add(303,'303-through-wall',api.entries[2].initialCode);
 add(304,'304-premature-reward',api.entries[3].solution.replace('var punti = 0','var punti = 1'));
 add(304,'304-no-removal',api.entries[3].solution.replace('        $Coin.queue_free()','        pass'));
 const cases=[];
 for(const e of entries){let i=0;await api.verify(e.id,e.code,async(code,options)=>{cases.push({key:e.name+'/'+i++,code,options});return {status:'executed',reply:{status:'executed',scene:{},properties:{}},stdout:'',stderr:''};});}
 const dir=fs.mkdtempSync('/tmp/gdh-gameplay-');
 try{
  const input=path.join(dir,'cases.json');fs.writeFileSync(input,JSON.stringify(cases));
  const execution=spawnSync(process.env.GODOT_BIN||'godot',['--headless','--path',root,'--script','tests/native_godot/gameplay.gd','--',input],{encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024});
  assert.equal(execution.status,0,execution.stderr||String(execution.error));
  assert.doesNotMatch(execution.stderr||'',/SCRIPT ERROR|ERROR:/);
  const results={};let key=null,lines=[];
  for(const line of execution.stdout.split(/\r?\n/)){
   if(line.startsWith('__GDH_BEGIN__')){key=line.slice(13);lines=[];}
   else if(line.startsWith('__GDH_REPLY__')){const reply=JSON.parse(line.slice(13));results[key]={reply,status:reply.status,stdout:lines.join('\n'),stderr:''};key=null;}
   else if(key)lines.push(line);
  }
  for(const e of entries){let i=0;const result=await api.verify(e.id,e.code,async(code,options)=>{const key=e.name+'/'+i++;const planned=cases.find(c=>c.key===key);assert.equal(code,planned.code);assert.equal(JSON.stringify(options),JSON.stringify(planned.options));assert.ok(results[key],key);return results[key];});if(result.accepted!==e.accepted)console.error(JSON.stringify(Object.fromEntries(Object.entries(results).filter(([k])=>k.startsWith(e.name+'/'))),null,2));assert.equal(result.accepted,e.accepted,e.name+': '+JSON.stringify(result.feedback.checks));}
  console.log('PASS real gameplay: 4 working solutions and 5 rejected mistakes; '+cases.length+' native operations.');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
