'use strict';
const assert=require('node:assert/strict');
const arena=require('../arena-competition.js');
assert.equal(arena.DEMOS.length,3);
const maxima=[100,150,250],xp=[10,15,25];
arena.DEMOS.forEach((ch,i)=>{
 assert.equal(ch.points,maxima[i]);
 assert.ok(ch.task.length>40);
 assert.equal(ch.cases.reduce((s,t)=>s+t.points,0),ch.points);
 assert.ok(ch.initial.startsWith('extends Node'));
 const calls=ch.cases.map(c=>({method:ch.method,status:'executed',value:c.expected}));
 const result=arena.gradeReply(ch,{status:'executed',methodCalls:calls},'');
 assert.equal(result.points,ch.points);
 assert.equal(result.checks.every(x=>x.passed),true);
 const broken=calls.map((v,k)=>k===0?{...v,value:'wrong'}:v);
 assert.equal(arena.gradeReply(ch,{status:'executed',methodCalls:broken},'').points,
   ch.points-ch.cases[0].points);
 assert.equal(arena.gradeReply(ch,{status:'compile_error',methodCalls:calls},'').points,0);
 assert.equal(arena.gradeReply(ch,{status:'executed',methodCalls:calls},'Some runtime error').points,0);
});
const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'..','arena-competition.js'),'utf8');
assert.doesNotMatch(source,/state\.xp\s*[+\-]=|gdh_record_verified_verdict|service_role/);
console.log('Competition Arena local Godot-demo scoring logic passed (no official awards).');
