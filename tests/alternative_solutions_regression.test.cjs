'use strict';
// node tests/alternative_solutions_regression.test.cjs
// Test del correttore con output simulato; non sostituisce Godot WASM.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),w={};
const ctx=vm.createContext({window:w,console,Date});
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
for(const f of ['lessons.js','lesson_practice.js','curriculum_extension.js','practice_catalog.js'])
  vm.runInContext(read(f),ctx,{filename:f});
const lp=w.LessonPractice,lessons=w.LESSONS_DATA;
const entries=lessons.flatMap(l=>lp.tasksFor(l).filter(t=>!t.nativeOriginal).map(t=>({l,t})));
const passes=(t,s,out=t.expectedOutput)=>lp.grade(t,s,out).every(x=>x.passed);
const by=(id,key)=>lp.getTask(id,key);
assert.equal(entries.length,243);
let official=0,validComment=0,badOutput=0,deadMethod=0;
for(const {l,t} of entries){
  assert.ok(passes(t,t.solution),'Official '+l.id+'/'+t.key);official++;
  const withComment=t.solution.replace('func _ready():\n','func _ready():\n    # nota neutra\n');
  assert.ok(passes(t,withComment),'Comment '+l.id+'/'+t.key);validComment++;
  assert.equal(passes(t,t.solution,'__ERR__'),false,'Bad output '+l.id+'/'+t.key);badOutput++;
  if((t.requirements.mustUse||[]).length){
    const dead=t.solution.replace('func _ready():','func non_usata():')+
      '\nfunc _ready():\n    print("Risposta fissa")\n';
    assert.equal(passes(t,dead),false,'Dead method '+l.id+'/'+t.key);deadMethod++;
  }
}
let variants=0;
const equivalent=(l,key,a,b)=>{
  const t=by(l.id,key),code=t.solution.replace(a,b);
  assert.notEqual(code,t.solution);assert.ok(passes(t,code),'Equivalent '+l.id+'/'+key);variants++;
};
for(const l of lessons.filter(l=>l.chapterId===4))
  equivalent(l,'p2','prezzo * quantita','quantita * prezzo');
for(const l of lessons.filter(l=>l.chapterId===8))
  equivalent(l,'p4','numero * 3','numero + numero + numero');
for(const l of lessons.filter(l=>l.chapterId===7))
  equivalent(l,'p4','contatore += 1','contatore = contatore + 1');
const n=by(3,'p3');
assert.ok(passes(n,n.solution.replace('print(3)','var vite: int = 3\n    print(vite)')));
assert.equal(passes(n,n.solution.replace('print(3)','var vite = "3"\n    print(vite)')),false);
const t=by(5,'p2');
const helper='func mostra():\n    var eroe = "Lia"\n    var vite = 3\n'+
  '    print(eroe)\n    print(vite)\nfunc _ready():\n    mostra()\n';
assert.ok(passes(t,helper),'Valid called helper rejected');
const unused=helper.replace('    mostra()','    print("Lia")\n    print(3)');
assert.equal(passes(t,unused),false,'Unused helper accepted');
const inComment='func _ready():\n    # var eroe = "Lia"; var vite=3; print(eroe)\n'+
  '    print("Lia")\n    print(3)';
assert.equal(passes(t,inComment),false,'Comment treated as code');
const inString='func _ready():\n    var note = "var eroe=1; var vite=3; print(eroe)"\n'+
  '    print("Lia")\n    print(3)';
assert.equal(passes(t,inString),false,'String treated as code');
const deadBranch='func _ready():\n    if false:\n        var eroe = "Lia"\n'+
  '        var vite = 3\n        print(eroe)\n    print("Lia")\n    print(3)';
assert.equal(passes(t,deadBranch),false,'if false treated as executed code');
const adapter=read('native/native-beta-adapter.js');
assert.ok(adapter.includes("const valid=run.status==='executed'&&!String(run.stderr||'').trim()"));
assert.ok(adapter.includes('const passed=valid&&checks.length>2&&checks.every(c=>c.passed)'));
console.log('PASS',JSON.stringify({official,validComment,badOutput,deadMethod,variants}));
