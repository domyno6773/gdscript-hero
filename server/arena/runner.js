'use strict';
// Node 22 coordinator: never execute student scripts directly on the host.
const { spawn }=require('node:child_process');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');
const crypto=require('node:crypto');
const IMAGE='gdh-godot-grader:4.4.1';
const MAX_SOURCE_BYTES=10000,MAX_CASES=12,MAX_POINTS=250;
const idPattern=/^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
function validateFixture(fixture,challenge){
 if(!fixture||typeof fixture!=='object'||Array.isArray(fixture)||
     fixture.challenge_id!==challenge.id||fixture.grading_version!==challenge.grading_version ||
     !idPattern.test(fixture.method||'')||!Array.isArray(fixture.tests)||
     fixture.tests.length<1||fixture.tests.length>MAX_CASES) throw Error('Invalid private fixture');
 let sum=0;
 for(const t of fixture.tests){
   if(!Array.isArray(t.args)||t.args.length>5||
       !t.args.every(a=>a===null||typeof a==='boolean'||typeof a==='string'&&a.length<=160||
         typeof a==='number'&&Number.isFinite(a))||
       !(t.expected===null||typeof t.expected==='boolean'||typeof t.expected==='string'&&t.expected.length<=160||
         typeof t.expected==='number'&&Number.isFinite(t.expected))||
       !Number.isInteger(t.points)||t.points<1||t.points>MAX_POINTS||
       typeof t.requirement!=='string'||t.requirement.length>120) throw Error('Invalid fixture case');
   sum+=t.points;
 }
 if(sum!==challenge.points_max)throw Error('Fixture points do not match published challenge');
 return fixture;
}
function validateCode(source){
 if(typeof source!=='string'||Buffer.byteLength(source,'utf8')>MAX_SOURCE_BYTES||
   !source.trim())throw Error('Invalid GDScript input');
 return source;
}
function parseVerdict(stdout){
 const lines=String(stdout).split(/\r?\n/).filter(Boolean);
 const tagged=lines.filter(line=>line.startsWith('GDH_VERDICT:'));
 if(tagged.length!==1||lines.at(-1)!==tagged[0])throw Error('Godot verdict missing or ambiguous');
 let object;
 try{object=JSON.parse(tagged[0].slice('GDH_VERDICT:'.length));}catch{throw Error('Invalid verdict JSON');}
 if(!object||!['executed','missing_method','compile_error','invalid','not_instantiable',
    'unsupported_return'].includes(object.status))throw Error('Unexpected grader verdict');
 return object;
}
function runProcess(command,args,options={}) {
 return new Promise((resolve,reject)=>{
   const child=spawn(command,args,{stdio:['ignore','pipe','pipe'],env:{PATH:process.env.PATH||'/usr/bin:/bin'},...options});
   let stdout='',stderr='',settled=false;
   const cap=10000;
   const finish=(error,output)=>{
     if(settled)return;settled=true;clearTimeout(timer);
     error?reject(error):resolve(output);
   };
   const timer=setTimeout(()=>{
     child.kill('SIGKILL');
     finish(Error('Godot timeout'));
   },Number(options.timeoutMs)||4000);
   child.on('error',error=>finish(error));
   child.stdout.on('data',b=>{stdout+=b; if(stdout.length>cap){child.kill('SIGKILL');finish(Error('Godot output exceeded limit'));}});
   child.stderr.on('data',b=>{stderr+=b; if(stderr.length>cap){child.kill('SIGKILL');finish(Error('Godot stderr exceeded limit'));}});
   child.on('close',code=>{
     if(code!==0)finish(Error('Godot exited abnormally'));
     else finish(null,{stdout,stderr,code});
   });
 });
}
async function dockerCase(source,method,args,{spawnRunner=runProcess,image=IMAGE}={}){
 // The host keeps ALL expected values outside this directory.
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'gdh-case-'));
 const id=crypto.randomUUID();
 const container='gdh-grade-'+id;
 try{
   await fs.chmod(dir,0o755);
   await fs.writeFile(path.join(dir,'student.gd'),source,{mode:0o644,flag:'wx'});
   await fs.writeFile(path.join(dir,'input.json'),JSON.stringify({method,args}),{mode:0o644,flag:'wx'});
   const argv=['run','--rm','--name',container,'--network','none',
     '--read-only','--cap-drop','ALL','--security-opt','no-new-privileges',
     '--pids-limit','64','--memory','192m','--cpus','0.5',
     '--user','65534:65534','--tmpfs','/tmp:rw,nosuid,nodev,noexec,size=8m',
     '--mount','type=bind,src='+dir+',dst=/work,readonly',
     image,'/work/student.gd','/work/input.json'];
   let out;
   try{
     out=await spawnRunner('docker',argv,{timeoutMs:4000});
   }catch(e){
     // Timeouts can leave detached/orphaned containers; force cleanup by name.
     await spawnRunner('docker',['rm','-f',container],{timeoutMs:1800}).catch(()=>{});
     throw e;
   }
   if(out.stderr && /SCRIPT ERROR|ERROR:/.test(out.stderr))throw Error('Godot runtime reported errors');
   return parseVerdict(out.stdout);
 }finally{await fs.rm(dir,{recursive:true,force:true});}
}
function safeCompare(a,b){return typeof a===typeof b && (a===b || (typeof a==='number'&&Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-9));}
async function grade({code,fixture,challenge,executor=dockerCase}){
 validateCode(code);validateFixture(fixture,challenge);
 let points=0;
 const categories=new Map();
 for(const entry of fixture.tests){
   // Each case is a fresh Godot process/container, no shared state across cases.
   const verdict=await executor(code,fixture.method,entry.args);
   const accepted=verdict.status==='executed' && safeCompare(verdict.value,entry.expected);
   if(accepted)points+=entry.points;
   const category=categories.get(entry.requirement)||{requirement:entry.requirement,points:0,max:0};
   category.max+=entry.points;
   if(accepted)category.points+=entry.points;
   categories.set(entry.requirement,category);
 }
 return {points,maxPoints:challenge.points_max,gradingVersion:challenge.grading_version,
   feedback:Array.from(categories.values()).map(c=>({requirement:c.requirement,points:c.points,max:c.max}))};
}
module.exports={IMAGE,MAX_SOURCE_BYTES,validateFixture,validateCode,parseVerdict,dockerCase,grade,safeCompare};
