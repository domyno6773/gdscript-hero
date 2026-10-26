'use strict';
// Fail CI whenever the standalone experimental lesson snapshot drifts from
// the actual course. This does not edit lessons.js or the public website.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../..');
function load(relativePath,variable){
  const filename=path.join(root,relativePath);
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(filename,'utf8'),context,{filename,timeout:5000});
  const lessons=context.window[variable];
  assert.ok(Array.isArray(lessons),relativePath+' must export '+variable);
  return JSON.parse(JSON.stringify(lessons)); // normalize across vm realms
}
const live=load('lessons.js','LESSONS_DATA');
const snapshot=load('spikes/godot-web/host/lesson-fixtures.js','GDHLessonFixtures');
assert.equal(live.length,60,'Course lesson count changed; review native coverage');
assert.equal(snapshot.length,60,'Fixture count changed; update native test coverage');
for(let id=1;id<=60;id++){
  const l=live.find(x=>x.id===id),s=snapshot.find(x=>x.id===id);
  assert.ok(l&&s,'Missing or duplicated lesson '+id);
  for(const field of ['title','initialCode','solution','expectedOutput']){
    assert.equal(s[field],l[field],'Native fixture '+id+' diverged from lessons.js: '+field);
  }
  assert.ok(Array.isArray(s.locals),'Missing local capture policy at '+id);
  assert.ok(Array.isArray(s.properties),'Missing property capture policy at '+id);
}
console.log('NATIVE_FIXTURE_PARITY_PASS 60/60 lesson source, starter, solution and output');
