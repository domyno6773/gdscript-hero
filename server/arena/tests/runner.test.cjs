'use strict';
const {test}=require('node:test'),a=require('node:assert/strict');
const {grade,validateFixture,parseVerdict,validateCode}=require('../runner');
const challenge={id:'2026-11-base-1',grading_version:1,points_max:100};
const fixture={challenge_id:challenge.id,grading_version:1,method:'double_value',tests:[
  {args:[4],expected:8,points:35,requirement:'positive'},
  {args:[0],expected:0,points:35,requirement:'zero'},
  {args:[-2],expected:-4,points:30,requirement:'negative'}
]};
test('fixture sum, method and version are constrained',()=>{
 a.equal(validateFixture(fixture,challenge),fixture);
 a.throws(()=>validateFixture({...fixture,grading_version:2},challenge));
 a.throws(()=>validateFixture({...fixture,method:'__init;quit()'},challenge));
 a.throws(()=>validateFixture({...fixture,tests:[...fixture.tests,{args:[],expected:1,points:10,requirement:'x'}]},challenge));
 a.throws(()=>validateCode(' '.repeat(10)));
 a.throws(()=>validateCode('a'.repeat(10001)));
});
test('Godot record is unambiguous and always last',()=>{
 a.deepEqual(parseVerdict('Godot Engine\nGDH_VERDICT:{"status":"executed","value":10}\n'),
   {status:'executed',value:10});
 a.throws(()=>parseVerdict('GDH_VERDICT:{"status":"executed","value":10}\nextra'));
 a.throws(()=>parseVerdict('GDH_VERDICT:{"status":"executed","value":10}\nGDH_VERDICT:{"status":"executed","value":10}\n'));
});
test('server scores Godot return values, not submitted points',async()=>{
 const executor=async(_source,_method,args)=>({status:'executed',value:args[0]*2});
 const result=await grade({code:'extends Node\nfunc double_value(n): return n*2',fixture,challenge,executor});
 a.equal(result.points,100);
 a.equal(result.feedback.length,3);
 const partial=await grade({code:'extends Node\nfunc double_value(n): return n*2',fixture,challenge,
   executor:async(_s,_m,args)=>({status:'executed',value:args[0]===0?10:args[0]*2})});
 a.equal(partial.points,65);
 a.equal(partial.feedback.find(f=>f.requirement==='zero').points,0);
});
