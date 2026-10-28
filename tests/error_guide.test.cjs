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
assert.equal(syntax.category,'syntax');
assert.equal(syntax.steps.length,2);
assert.equal(syntax.line,3);
assert.equal(syntax.exact,true);
assert.match(syntax.title,/due punti/);
assert.match(syntax.hint,/fine della riga/);
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
assert.equal(requirement.category,'requirement');
assert.equal(requirement.steps.length,2);
assert.equal(requirement.line,null);
assert.match(requirement.requirement,/Atteso 10/);
assert.match(requirement.hint,/Confronta/);

// Il runner Web indica gli script effimeri con gdscript://, non res://.
const typo=guide.diagnose({
 source:'extends Node\n\nfunc _ready():\n    prin("ciao")',
 error:'SCRIPT ERROR: Parse Error: Function "prin()" not found in base self. at: GDScript::reload (gdscript://-9223372012930464558.gd:4)'
});
assert.equal(typo.line,4); // Il sorgente ha già extends, nessun offset.
const noExtendsSource = 'func _ready():\n    # Stampa qualcosa\n    prin("ciao")\n';
const prefixedTypo = guide.diagnose({
 source:noExtendsSource,
 error:'SCRIPT ERROR: Parse Error: Function "prin()" not found in base self. at: GDScript::reload (gdscript://-9223372012930464558.gd:4)'
});
assert.equal(prefixedTypo.line,3, 'Il runner antepone extends Node: la riga 4 di Godot è la riga 3 dell’editor');
assert.equal(prefixedTypo.exact,true);
assert.equal(guide.diagnose({
 source:noExtendsSource,
 error:'Error at: GDScript::reload (gdscript://-9223372012930464558.gd:1)'
}).line,null, 'La riga sintetica del runner non appartiene all’editor');
assert.equal(guide.diagnose({
 source:noExtendsSource,
 error:'Error in res://student.gd:3'
}).line,3, 'Non sottrarre offset ai percorsi che non appartengono allo script temporaneo');
assert.match(typo.title,/Funzione non riconosciuta/);
assert.match(typo.why,/prin/);
assert.doesNotMatch(typo.hint,/print\(/,'La correzione non deve essere mostrata subito');
assert.equal(typo.category,'syntax');
assert.equal(typo.steps.length,2);
assert.equal(typo.steps.some(text=>/print\(/.test(text)),false,'Gli indizi non devono fornire la correzione esatta');
assert.ok(!/leggi il messaggio tecnico/i.test(typo.hint));
const unexpected=guide.diagnose({
 source:'extends Node\nfunc _ready():\n    xyz',
 error:'SCRIPT ERROR: Parse Error: Unexpected token at: gdscript://-99.gd:3'
});
assert.equal(unexpected.line,3);
assert.match(unexpected.why,/sintassi/);

const runtime=guide.diagnose({source:code,error:'SCRIPT ERROR: Invalid get index \'health\' (on base: Nil). at: res://student.gd:3'});
assert.equal(runtime.category,'runtime');
assert.match(runtime.why,/oggetto|operazione/i);
assert.equal(runtime.steps.length,2);
const timeout=guide.diagnose({source:code,error:'Execution timed out',verdict:'timeout'});
assert.equal(timeout.category,'timeout');
assert.equal(timeout.steps.length,2);
const network=guide.diagnose({source:code,error:'NetworkError: Failed to fetch'});
assert.equal(network.category,'system');
assert.equal(network.steps.length,0,'Problemi del motore non richiedono indizi didattici');
const invalid=guide.diagnose({source:code,error:'Parse Error: Something went wrong at res://student.gd:900'});
assert.equal(invalid.line,null);
assert.equal(guide.diagnose({source:code}),null);
assert.ok(guide.diagnose({source:code,error:'Runtime error'}));

const unexpectedRootPrint='SCRIPT ERROR: Parse Error: Unexpected identifier "print" in class body.\n'+
  '   at: GDScript::reload (gdscript://-9223372012494256936.gd:2)';
const bareOpen=guide.diagnose({
  source:'print("Ciao"',error:unexpectedRootPrint
});
assert.equal(bareOpen.category,'syntax');
assert.match(bareOpen.title,/parentesi/i);
assert.match(bareOpen.why,/chiusura/i);
assert.match(bareOpen.why,/fuori da una funzione/i);
assert.equal(bareOpen.line,1,'Unmatched bracket belongs to the editor, not Godot prefix');
assert.equal(bareOpen.raw,unexpectedRootPrint,'Original Godot output must remain accessible');
assert.ok(bareOpen.steps.length>=2,'Sandbox must give progressive, specific guidance');
const rootBalanced=guide.diagnose({
  source:'print("Ciao")',error:unexpectedRootPrint
});
assert.match(rootBalanced.title,/fuori da una funzione/i);
assert.match(rootBalanced.why,/_ready/i);
assert.doesNotMatch(rootBalanced.title,/parentesi/i);
const quotedDelimiter=guide.diagnose({
  source:'extends Node\nfunc _ready():\n    print(")") # (',
  error:'SCRIPT ERROR: Parse Error: Unexpected token at: gdscript://-123.gd:3'
});
assert.doesNotMatch(quotedDelimiter.title,/parentesi di chiusura/i,
  'Brackets in string/comment are not syntax delimiters');
const unclosedWithFalseClose=guide.diagnose({
  source:'extends Node\nfunc _ready():\n    print("Ciao" # ) solo commento',
  error:'SCRIPT ERROR: Parse Error: Unexpected token at: gdscript://-123.gd:3'
});
assert.match(unclosedWithFalseClose.title,/parentesi di chiusura/i,
  'Comment must not hide a missing bracket');
const unclosedArray=guide.diagnose({
  source:'extends Node\nvar loot = [1, 2, 3',
  error:'SCRIPT ERROR: Parse Error: Unexpected end of file at: gdscript://-123.gd:2'
});
assert.match(unclosedArray.title,/quadra/i);
assert.equal(unclosedArray.line,2);
const multilineString=guide.diagnose({
  source:'extends Node\nvar text = """ [ ( { """\n',
  error:'SCRIPT ERROR: Parse Error: Unexpected token at: gdscript://-123.gd:2'
});
assert.doesNotMatch(multilineString.title,/chiusura/i,
  'Delimiters inside a multiline string must not be parsed as code');
console.log('PASS: Godot error guide parses exact lines, fallback hints and requirement failures');
