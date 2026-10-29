'use strict';
// Avvio: node tests/supplemental_curriculum_regression.test.cjs
// Controlla banca didattica, scenari e validazione. Il runner Godot viene
// simulato: questo test NON sostituisce l'esecuzione WebAssembly reale.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'..','curriculum_extension.js'),'utf8');

const LESSONS_DATA=[];
for(let chapter=1;chapter<=15;chapter++){
  for(let i=0;i<5;i++) LESSONS_DATA.push({
    id:(chapter-1)*5+i+1,chapterId:chapter,isMastery:i===4,
    title:'Esercizio',theory:'',task:''
  });
}
const sandbox={window:{},LESSONS_DATA,console};
const instrumented=source.replace(
  'window.GDHCurriculumExtension=Object.freeze({has:',
  'window.__testScenarios=scenarios;window.GDHCurriculumExtension=Object.freeze({has:');
assert.notEqual(source,instrumented,'La funzione scenari deve restare ispezionabile');
vm.runInNewContext(instrumented,sandbox,{filename:'curriculum_extension.js'});
const api=sandbox.window.GDHCurriculumExtension;
const extras=LESSONS_DATA.filter(l=>l.isSupplemental);
assert.equal(api.count,21,'Numero totale esercizi supplementari');
assert.equal(extras.length,21);
assert.equal(new Set(extras.map(l=>l.id)).size,21);
assert.equal(new Set(extras.map(l=>l.hints[1].text)).size,21,
  'Ogni suggerimento strutturale deve essere specifico');
assert.equal(new Set(extras.map(l=>l.hints[2].text)).size,21,
  'Ogni esempio deve essere specifico');
for(const lesson of extras){
  assert.equal(lesson.hints.length,3);
  assert.ok(lesson.theory.length>300,'Teoria troppo breve '+lesson.id);
  for(const hint of lesson.hints)assert.ok(hint.text.length>40,'Indizio breve '+lesson.id);
}
const text=output=>String(output).split(/\r?\n/).filter(Boolean).join('\n');
function runner(map){
  let calls=0;
  return {
    run:async code=>{
      calls++;
      return {status:'executed',stderr:'',stdout:map.has(code)?map.get(code):'__OUTPUT_ERRATO__'};
    },
    get calls(){return calls;}
  };
}
async function main(){
  let validations=0,extraCases=0;
  for(const lesson of extras){
    const variants=sandbox.window.__testScenarios(lesson.id,lesson.solution,lesson.expectedOutput);
    const outputs=new Map([[lesson.solution,lesson.expectedOutput]]);
    for(const variant of variants){
      assert.ok(variant.ready,'Scenario non applicabile '+lesson.id+' '+variant.label);
      assert.notEqual(variant.code,lesson.solution,'Scenario invariato '+lesson.id);
      assert.ok(variant.label.length>5);
      outputs.set(variant.code,variant.expected);
      extraCases++;
    }
    const native=runner(outputs);
    const ok=await api.verify(lesson.id,lesson.solution,native.run);
    assert.equal(ok.accepted,true,'Soluzione ufficiale respinta: '+lesson.id+
      ' '+JSON.stringify(ok.feedback.checks.filter(c=>!c.passed)));
    assert.equal(native.calls,1+variants.length,
      'Numero esecuzioni Godot: '+lesson.id);
    assert.ok(ok.feedback.checks.every(c=>!c.desc.includes('\\b')),
      'Il feedback non deve mostrare espressioni regolari');
    validations++;

    // Un codice che mostra l'output base, ma fallisce le prove nascoste,
    // non deve venire promosso come soluzione generalizzabile.
    if(variants.length){
      const fake=runner(new Map([[lesson.solution,lesson.expectedOutput]]));
      const rejected=await api.verify(lesson.id,lesson.solution,fake.run);
      assert.equal(rejected.accepted,false,'Test alternativi ignorati: '+lesson.id);
      assert.ok(rejected.feedback.checks.some(c=>!c.passed&&c.desc.includes('differenti')));
    }
  }
  const formula=extras.find(l=>l.id===104);
  const withoutParentheses=formula.solution.replace('(costo_kit * quantita)','costo_kit * quantita');
  const fake=runner(new Map([[withoutParentheses,formula.expectedOutput]]));
  const rejected=await api.verify(104,withoutParentheses,fake.run);
  assert.equal(rejected.accepted,false,'Le parentesi matematiche sono obbligatorie');
  assert.ok(rejected.feedback.checks.some(c=>!c.passed&&c.desc.includes('parentesi')));
  console.log('PASS:',validations,'lezioni supplementari,',extraCases,
    'casi aggiuntivi, indizi e regressioni con output preconfezionato.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
