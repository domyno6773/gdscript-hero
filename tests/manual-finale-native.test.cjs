'use strict';
// GODOT_BIN=/path/to/Godot_4.5.1 node tests/manual-design-patterns-native.test.cjs
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const assert=require('node:assert/strict');
const bin=process.env.GODOT_BIN;
assert.ok(bin,'Imposta GODOT_BIN a Godot 4.5 o successivo');
const context={window:{},CHAPTERS_DATA:[],LESSONS_DATA:[],CONCEPTS_CATALOG:{},console};
vm.createContext(context);
const structural=fs.readFileSync('tests/manual-235-structural.test.cjs','utf8');
const files=structural.match(/for\(const file of (\[[\s\S]*?\])\)\{/)[1];
for(const filename of vm.runInNewContext(files))
 vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename});
const solutions=require('./helpers/manual-finale-solutions.cjs');
const project=context.window.GDHManualProject;
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gdh-patterns-'));
fs.writeFileSync(path.join(dir,'project.godot'),'config_version=5\n[application]\nconfig/name="Manual patterns QA"\n');
fs.writeFileSync(path.join(dir,'boot.gd'),`extends SceneTree
func _initialize():
    var script = load("res://student.gd")
    if script == null:
        quit(1)
        return
    create_timer(1.0).timeout.connect(func(): quit(2))
    root.add_child.call_deferred(script.new())
`);
let runs=0;
function execute(l,files,testcase){
 const src=(project.build(l,files)+(testcase.harness||'')).replace(/OS\.read_string_from_stdin\(\)/g,'__read_test_input()');
 const ready=src.indexOf('\nfunc _ready(');
 const next=src.indexOf('\nfunc ',ready+1);
 const stop=next<0?src.length:next;
 const observe=testcase.returns?'\n    print("__GDH_RET__", JSON.stringify(__manual_contract()))\n':'';
 const executable=src.slice(0,stop)+observe+'\n    print("__GDH_DONE__")\n    get_tree().quit()\n'+src.slice(stop);
 const script=executable+'\n'+
 'var __test_input = '+JSON.stringify(testcase.stdin)+'\n'+
 'func __read_test_input() -> String:\n    return str(__test_input.pop_front())\n';
 fs.writeFileSync(path.join(dir,'student.gd'),script);
 const r=spawnSync(bin,['--headless','--path',dir,'--script','res://boot.gd'],{
  encoding:'utf8',timeout:5000,env:{...process.env,GODOT_SILENCE_ROOT_WARNING:'1'}});
 runs++;
 const stdout=(r.stdout||'').replace(/^Godot Engine[^\n]*\n\n?/,'');
 const success=r.status===0&&stdout.includes('__GDH_DONE__')&&!/SCRIPT ERROR|Parse Error|ERROR:/.test(r.stderr||'');
 const observed=stdout.match(/^__GDH_RET__(.*)$/m);
 return {success,observed:observed?JSON.parse(observed[1]):null,output:stdout.replace(/^__GDH_RET__.*\n?/m,'').replace(/__GDH_DONE__\n?[\s\S]*$/,'').trimEnd(),details:r.stderr||r.error?.message||stdout};
}
try{
 for(const n of Object.keys(solutions).map(Number)){
  console.log('Godot nativo: lezione '+n);
  const l=context.LESSONS_DATA[n-1];
  const solved={...l.sourceFiles,...Object.fromEntries(Object.entries(solutions[n]).map(([f,lines])=>[f,lines.join('\n')]))};
  for(const testcase of context.window.GDHManualVerifier.expectedCases[n]){
   const r=execute(l,solved,testcase);
   assert.ok(r.success,`${n} ${testcase.name}: ${r.details}`);
   assert.equal(r.output,testcase.output,`${n} ${testcase.name}`);
   if(testcase.returns)assert.deepEqual(r.observed,JSON.parse(JSON.stringify(testcase.returns[0])),`${n}: valore restituito`);
  }
  const starter=execute(l,l.sourceFiles,context.window.GDHManualVerifier.expectedCases[n][0]);
  assert.ok(!starter.success||starter.output!==context.window.GDHManualVerifier.expectedCases[n][0].output,'Starter accettato '+n);
 }
 for(const [n,file,from,to] of require('./helpers/manual-finale-mutations.cjs')){
  const l=context.LESSONS_DATA[n-1];
  const changed={...l.sourceFiles,...Object.fromEntries(Object.entries(solutions[n]).map(([f,lines])=>[f,lines.join('\n')]))};
  assert.ok(changed[file].includes(from),'Mutazione assente '+n);changed[file]=changed[file].replace(from,to);
  assert.equal(l.manualSourceCheck(Object.values(changed).join('\n')),true,'La mutazione deve compilare e superare il controllo sorgente '+n);
  let rejected=false;
  for(const testcase of context.window.GDHManualVerifier.expectedCases[n]){
   const r=execute(l,changed,testcase);
   assert.ok(r.success,`Mutazione ${n} non compilabile: ${r.details}`);
   if(r.output!==testcase.output||(testcase.returns&&JSON.stringify(r.observed)!==JSON.stringify(testcase.returns[0]))){rejected=true;break;}
  }
  assert.ok(rejected,'Mutazione comportamentale accettata '+n);
 }
 console.log(`PASS: Godot nativo, 94 scenari finali corretti, 15 starter e 15 mutazioni respinti (${runs} esecuzioni).`);
}finally{fs.rmSync(dir,{recursive:true,force:true});}
