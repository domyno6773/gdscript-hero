'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','code-guide.js'),'utf8'),context);
const guide=context.GDHCodeGuide;
assert.ok(guide);
const chapter1='func _ready():\n    # Stampa il saluto\n    pass';
const first=guide.analyze(chapter1);
assert.ok(first.some(x=>x.key==='ready'));
assert.ok(first.some(x=>x.key==='comment'));
assert.ok(first.some(x=>x.key==='pass'));
const challenge='extends Node\n\nfunc _ready():\n    print("=== AVVIO SISTEMA ===")\n    # Completa le stampe\n    print("=== FINE ===")';
const entries=guide.analyze(challenge);
const extend=entries.find(x=>x.key==='extends');
assert.ok(extend);
assert.deepEqual(Array.from(extend.lines),[1]);
assert.match(extend.detail,/nodo|Node/);
assert.match(entries.find(x=>x.key==='ready').detail,/automaticamente/);
assert.deepEqual(Array.from(entries.find(x=>x.key==='print').lines),[4,6]);
assert.ok(!entries.some(x=>x.detail.includes('print("Sistema: Godot OS")')),
 'Il glossario non deve anticipare la soluzione dell’esercizio');
assert.ok(!entries.some(x=>x.key==='func' && x.title.includes('_ready')));
const previous=guide.unseenKeys(4,[{id:1,initialCode:chapter1},{id:4,initialCode:challenge}]);
assert.equal(previous.has('ready'),true);
assert.equal(previous.has('extends'),false);
const updated=guide.analyze(challenge+'\n    var nomi = ["A", "B"]\n    signal attivato');
assert.ok(updated.some(x=>x.key==='var'));
assert.ok(updated.some(x=>x.key==='array'));
assert.ok(updated.some(x=>x.key==='signal'));
const comment=guide.analyze('# extends Node\n# print("test")\npass');
assert.equal(comment.some(x=>x.key==='extends'||x.key==='print'),false,
 'I commenti non vanno interpretati come codice eseguibile');
assert.equal(guide.analyze('').length,0);
// Selezionare un termine nell'editor non deve rivelare soluzioni o interpretare
// testo fra virgolette, commenti o parole sconosciute come istruzioni.
const help=guide.explainAt;
const at=(source,word)=>help(source,source.indexOf(word)+1);
assert.equal(at(challenge,'extends').key,'extends');
assert.equal(at(challenge,'Node').key,'extends');
assert.equal(at(challenge,'_ready').key,'ready');
assert.equal(at(challenge,'print').key,'print');
assert.equal(at('var salute = 100','var').key,'var');
assert.equal(at('func heal(amount):\n    pass','func').key,'func');
assert.equal(at('func _ready():\n    pass','pass').key,'pass');
assert.equal(at('if health > 0:\n    print(health)','if').key,'if');
assert.equal(at('var x = true','true').key,'boolean');
assert.equal(at('$Label.text = "ok"','$Label').key,'nodepath');
assert.equal(at('var x = range(3)','range').key,'range');
assert.equal(at('print("extends Node")','extends'),null);
assert.equal(at('# usa print()','print'),null);
assert.equal(at('# usa print()','#').key,'comment');
assert.equal(help(challenge,-1),null);
assert.equal(help(challenge,challenge.length+1),null);
assert.equal(at('foo = 1','foo'),null);
assert.equal(at('printer()','printer'),null);
assert.ok(!at('print("segreto")','print').detail.includes('segreto'));
// Parole digitate dallo studente, anche prima di aggiungere sintassi completa.
for(const [source,word,key] of [
 ['func','func','func'],['var','var','var'],['extends','extends','extends'],
 ['print','print','print'],['const','const','const'],
 ['func nuova():','func','func'],['var vita','var','var'],
 ['if','if','if'],['for','for','for'],['signal','signal','signal'],
 ['return','return','return'],['@export','@export','@export'],
 ['print("ciao")','print','print']
]){
  assert.equal(at(source,word)?.key,key,'La parola '+word+' appena scritta deve avere una spiegazione');
}
assert.equal(guide.explainAt('func',4,{strict:true}),null,'Fuori dalla parola non deve apparire il tooltip');
assert.equal(guide.explainAt('func',3,{strict:true}).key,'func');
assert.equal(guide.explainAt('func x():\n    var hp = 0',11,{strict:true}),null,
 'Non interpretare spazi bianchi come istruzioni');
assert.equal(at('"func"','func'),null,'Niente popup nel testo fra virgolette');
assert.equal(at('# func','func'),null,'Niente popup sui commenti');
console.log('PASS: context-aware code explanations, first encounter, live constructs and no solutions');
