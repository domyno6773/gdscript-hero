'use strict';
// Avvio: node tests/review_native_parity.test.cjs
// Test della logica nativa con risposte simulate; non esegue Godot WASM.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const adapter=read('native/native-beta-adapter.js');
const review=read('review_variants.js'),app=read('app.js');
assert.doesNotMatch(review,/\bGDScriptRuntime\.execute\s*\(/);
const method=app.slice(app.indexOf('async runAndValidateReviewVariant('),
  app.indexOf('updateReviewIndicators() {',app.indexOf('async runAndValidateReviewVariant(')));
assert.match(method,/GDHGodot\.verifyReview\(variant\.id,\s*code\)/);
assert.doesNotMatch(method,/GDScriptRuntime\.execute/);
assert.match(method,/native\.feedback\.verdict !== 'inconclusive'/);
const window={addEventListener(){},__runs:[]};
const context=vm.createContext({window,console,URL:class{
  constructor(path,base){this.href=String(base||'https://example.test/')+path;}
},document:{baseURI:'https://example.test/'}});
vm.runInContext(read('lessons.js'),context,{filename:'lessons.js'});
vm.runInContext(review,context,{filename:'review_variants.js'});
const variants=window.REVIEW_VARIANTS;
assert.equal(variants.length,17);
assert.equal(new Set(variants.map(v=>v.id)).size,17);
const start=adapter.indexOf('  const executeCompat=async(source,options={})=>{');
const end=adapter.indexOf('  // Il ripasso passa dallo stesso adapter nativo',start);
assert.ok(start>=0&&end>start,'Wrapper nativo modificato');
const stub=[
 '  const executeCompat=async(source,options={})=>{',
 '    const variant=options.lesson;',
 '    if(!variant)throw Error("Missing variant context");',
 '    window.__runs.push({id:variant.id,source});',
 '    const failed=source==="__INVALID_GDSCRIPT__"||source==="__UNAVAILABLE_GODOT__";',
 '    const good=source===variant.solution;',
 '    const lines=failed?[]:good?variant.expectedOutput.split(/\\r?\\n/).filter(Boolean):',
 '      ["rev_conditions_01","rev_conditions_02"].includes(variant.id)?',
 '      [variant.id==="rev_conditions_01"?"Accesso Negato":"Accesso Negato: Quarantena Attiva"]:[];',
 '    const scene={has_node(name){return ["MonitorTermico","BtnLancio","TimerMina","MinaGrafica"].includes(name);},',
 '      get_node(name){return name==="MonitorTermico"?{text:"Temperatura: 300 K"}:',
 '        name==="MinaGrafica"?{queued:true,_is_queued_for_deletion:true}:{};}};',
 '    return {success:!failed,code:source,logs:lines,',
 '      error:failed?"Esecuzione nativa non riuscita":null,scope:{},scene,',
 '      native:{status:source==="__UNAVAILABLE_GODOT__"?"unsupported":',
 '        failed?"compile_error":"executed"}};',
 '  };'
].join('\n');
vm.runInContext(adapter.slice(0,start)+stub+adapter.slice(end),context,
  {filename:'native/native-beta-adapter.js'});
assert.equal(typeof window.GDHGodot.verifyReview,'function');
assert.equal(typeof window.GDHGodot.executeReview,'function');
assert.equal(typeof window.GDHGodot.verifyLesson,'function');
assert.equal(typeof window.GDHGodot.verifyPracticeTask,'function');

async function main(){
  for(const v of variants){
    const out=await window.GDHGodot.verifyReview(v.id,v.solution);
    assert.equal(out.accepted,true,v.id+' ufficiale');
    assert.equal(out.feedback.verdict,'accepted',v.id);
    assert.equal(out.feedback.checks.every(c=>c.passed),true,v.id+' checks');
    assert.ok(out.feedback.checks.length>=2,v.id+' validazione didattica');
    assert.equal(out.execution.native.status,'executed');
    assert.ok(window.__runs.some(e=>e.id===v.id&&e.source===v.solution),
      v.id+' non passato all’esecutore');
  }
  const bad=await window.GDHGodot.verifyReview(variants[0].id,'__INVALID_GDSCRIPT__');
  assert.equal(bad.accepted,false);
  assert.equal(bad.feedback.verdict,'invalid_code');
  assert.equal(bad.feedback.checks[0].passed,false);
  const unavailable=await window.GDHGodot.verifyReview(variants[0].id,'__UNAVAILABLE_GODOT__');
  assert.equal(unavailable.accepted,false);
  assert.equal(unavailable.feedback.verdict,'inconclusive');
  await assert.rejects(window.GDHGodot.verifyReview('missing_variant',variants[0].solution),
    /non disponibile/);
  for(const [id,scene] of [['rev_scene_tree_01',61],['rev_ui_button_01',62],['rev_timers_01',63]]){
    assert.ok(adapter.includes(id+':'+scene),'Scena nativa '+id+' non configurata');
  }
  console.log('PASS: 17 ripassi, flusso nativo, errori e scene 61-63');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
