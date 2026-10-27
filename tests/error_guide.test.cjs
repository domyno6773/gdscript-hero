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
assert.match(syntax.title,/due punti/);
assert.match(syntax.hint,/rientrat/);
assert.ok(!syntax.hint.includes('if health > 0:'));

const undefinedVar=guide.diagnose({
 source:code,error:'Identifier "health" not declared in the current scope. At: res://student.gd:3:5'
});
assert.equal(undefinedVar.line,3);
assert.match(undefinedVar.title,/nome/i);

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

// Il runner Web indica gli script effimeri con gdscript://, non res://.
const typo=guide.diagnose({
 source:'extends Node\n\nfunc _ready():\n    prin("ciao")',
 error:'SCRIPT ERROR: Parse Error: Function "prin()" not found in base self. at: GDScript::reload (gdscript://-9223372012930464558.gd:4)'
});
assert.equal(typo.line,4);
assert.match(typo.title,/Funzione non riconosciuta/);
assert.match(typo.why,/prin/);
assert.match(typo.hint,/print/);
assert.ok(!/leggi il messaggio tecnico/i.test(typo.hint));
const unexpected=guide.diagnose({
 source:'extends Node\nfunc _ready():\n    xyz',
 error:'SCRIPT ERROR: Parse Error: Unexpected token at: gdscript://-99.gd:3'
});
assert.equal(unexpected.line,3);
assert.match(unexpected.why,/sintassi/);

assert.equal(guide.diagnose({source:code}),null);
assert.ok(guide.diagnose({source:code,error:'Runtime error'}));
console.log('PASS: Godot error guide parses exact lines, fallback hints and requirement failures');
