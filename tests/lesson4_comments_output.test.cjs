'use strict';
const assert = require('node:assert/strict');
global.window = {};
require('../lessons.js');
require('../native/lesson-fixtures.js');
require('../native/lesson-validation.js');
const lesson = window.LESSONS_DATA.find(x=>x.id===4);
const grade = window.GDHLessonLab.grade;
const wanted = ['=== AVVIO SISTEMA ===','Sistema: Godot OS','Energia: 100%','=== DIAGNOSTICA COMPLETATA ==='];
const code = ['extends Node','func _ready():','    # Un commento qualunque','    print("=== AVVIO SISTEMA ===")','    print("Sistema: Godot OS")','    print("Energia: 100%")','    print("=== DIAGNOSTICA COMPLETATA ===")'].join('\n');
(async()=>{
  for(const source of [code,code.replace('    # Un commento qualunque\n',''),lesson.initialCode]){
    const native = grade(4,source,{status:'executed'},wanted.join('\n'),'',{});
    assert.equal(native.verdict,'accepted');
    assert.equal(native.passed,true);
    const legacy = await lesson.validate({success:true,code:source,logs:wanted});
    assert.ok(legacy.every(x=>x.passed));
  }
  const withSpace=await lesson.validate({success:true,code,logs:[wanted[0],wanted[1],'Energia: 100 %',wanted[3]]});
  assert.ok(withSpace.every(x=>x.passed));
  const wrong=[wanted[0],wanted[1],'Energia: 50%',wanted[3]];
  const rejected=grade(4,code,{status:'executed'},wrong.join('\n'),'',{});
  assert.equal(rejected.verdict,'requirements_not_met');
  assert.match(rejected.checks.find(x=>!x.passed).diff,/Energia: 50%/);
  const legacyBad=await lesson.validate({success:true,code,logs:wrong});
  assert.ok(legacyBad.some(x=>!x.passed&&x.diff.includes('Energia: 50%')));
  console.log('LESSON_4_COMMENTS_OUTPUT_PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
