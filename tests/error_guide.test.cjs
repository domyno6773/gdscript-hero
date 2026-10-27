'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','error-guide.js'),'utf8');
const context={};
vm.runInNewContext(source,context);
const guide=context.GDHErrorGuide;
assert.ok(guide,'Error guide did not load');

const code='extends Node\nfunc _ready():\n    if health > 0\n        print(health)';
const syntax=guide.diagnose({
 source:code,
 error:'SCRIPT ERROR: Parse Error: Expected ":" after "if" condition.\n at: GDScript::reload (res://student.gd:3)'
});
assert.equal(syntax.kind,'engine');
assert.equal(syntax.line,3);
assert.equal(syntax.exact,true);
assert.match(syntax.title,/separatore/);
assert.match(syntax.hint,/rientro/);
assert.ok(!syntax.hint.includes('if health > 0:'));

const undefinedVar=guide.diagnose({
 source:code,error:'Identifier "health" not declared in the current scope. At: res://student.gd:3:5'
});
assert.equal(undefinedVar.line,3);
assert.match(undefinedVar.title,/Nome/);

const badPosition=guide.diagnose({source:code,error:'Error in res://student.gd:900'});
assert.equal(badPosition.line,null,'Must not invent out-of-range line numbers');
assert.equal(badPosition.exact,false);

const requirement=guide.diagnose({
 source:code,failedTest:{desc:'Valore corretto',diff:'Atteso 10, ottenuto 5'}
});
assert.equal(requirement.kind,'requirement');
assert.equal(requirement.line,null);
assert.match(requirement.requirement,/Atteso 10/);
assert.match(requirement.hint,/Confronta/);

assert.equal(guide.diagnose({source:code}),null);
assert.ok(guide.diagnose({source:code,error:'Runtime error'}));
console.log('PASS: Godot error guide parses exact lines, fallback hints and requirement failures');
