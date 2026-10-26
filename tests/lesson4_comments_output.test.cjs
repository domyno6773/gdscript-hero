'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const lessonsJs=fs.readFileSync(path.join(root,'lessons.js'),'utf8');
const fixtureJs=fs.readFileSync(path.join(root,'native/lesson-fixtures.js'),'utf8');
const nativeJs=fs.readFileSync(path.join(root,'native/lesson-validation.js'),'utf8');
const legacyCtx={};
vm.runInNewContext(lessonsJs+'\nthis.__lessons=LESSONS_DATA',legacyCtx);
const four=legacyCtx.__lessons.find(x=>x.id===4);
assert.ok(four);
const nativeCtx={window:{}};
vm.runInNewContext(fixtureJs,nativeCtx);
vm.runInNewContext(nativeJs,nativeCtx);
const grader=nativeCtx.window.GDHLessonLab;
const wanted=['=== AVVIO SISTEMA ===','Sistema: Godot OS','Energia: 100%','=== DIAGNOSTICA COMPLETATA ==='];
const programNoSpecificComment=[
 'extends Node','func _ready():','    print("=== AVVIO SISTEMA ===")',
 '    # Commento extra scritto dallo studente','    # Mantieni i commenti iniziali',
 '    print("Sistema: Godot OS")','    print("Energia: 100%")',
 '    print("=== DIAGNOSTICA COMPLETATA ===")'].join('\n');
const programNoComment=[
 'extends Node','func _ready():','    print("=== AVVIO SISTEMA ===")',
 '    print("Sistema: Godot OS")','    print("Energia: ", 100, "%")',
 '    print("=== DIAGNOSTICA COMPLETATA ===")'].join('\n');
(async()=>{
 for(const [label,code] of [['custom-comment',programNoSpecificComment],
                            ['no-comment',programNoComment],
                            ['starter-extra-comments',four.initialCode+'\n# Additional note']]){
  const stdout=wanted.join('\n');
  const n=grader.grade(4,code,{status:'executed',locals:{}},stdout,'',{});
  assert.equal(n.verdict,'accepted','Native rejection: '+label+': '+JSON.stringify(n));
  assert.equal(n.passed,true);
  const result=await four.validate({success:true,code,logs:wanted});
  assert.ok(result.every(x=>x.passed),'Legacy rejection: '+label+': '+JSON.stringify(result));
 }
 const legacySpacing=await four.validate({success:true,code:programNoComment,
  logs:[wanted[0],wanted[1],'Energia: 100 %',wanted[3]]});
 assert.ok(legacySpacing.every(x=>x.passed),'Legacy print() spacing should not reject output');
 const wrong=[wanted[0],wanted[1],'Energia: 50%',wanted[3]];
 const nBad=grader.grade(4,programNoSpecificComment,{status:'executed'},wrong.join('\n'),'',{});
 assert.equal(nBad.passed,false);
 assert.equal(nBad.verdict,'requirements_not_met');
 assert.ok(nBad.checks.some(x=>!x.passed&&/Output atteso:/.test(x.diff)&&
   /Energia: 50%/.test(x.diff)),'Native diff must say what was printed');
 const lBad=await four.validate({success:true,code:programNoComment,logs:wrong});
 assert.ok(lBad.some(x=>!x.passed&&/Output atteso:/.test(x.diff)&&
   /Energia: 50%/.test(x.diff)),'Legacy diff must say what was printed');
 console.log('LESSON_4_COMMENTS_OUTPUT_PASS native_and_legacy');
})().catch(e=>{console.error(e);process.exitCode=1;});
