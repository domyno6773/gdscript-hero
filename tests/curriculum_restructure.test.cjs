'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {w}=require('./helpers/load_course.cjs')();
const lessons=w.LESSONS_DATA,chapters=w.CHAPTERS_DATA,by=id=>lessons.find(l=>l.id===id);
assert.equal(lessons.length,115);assert.equal(new Set(lessons.map(l=>l.id)).size,115);
assert.equal(chapters.length,16);assert.equal(lessons.filter(l=>!l.isQuiz).length,85);
assert.equal(lessons.filter(l=>l.isQuiz).length,30);
assert.equal(by(49).chapterId,3);assert.equal(by(50).chapterId,3);
assert.ok(by(29).chapterId<by(54).chapterId,'Functions precede interactive callbacks');
assert.ok(by(34).chapterId<by(301).chapterId,'Vectors precede real movement');
assert.ok(by(304).chapterId<by(45).chapterId,'A playable goal precedes custom classes');
for(let id=1;id<=60;id++)assert.ok(by(id),'Stable historical lesson ID '+id);
for(let id=101;id<=121;id++)assert.ok(by(id),'Stable supplemental ID '+id);
for(let id=201;id<=230;id++)assert.ok(by(id),'Stable quiz ID '+id);
for(const [i,l] of lessons.entries()){
 assert.equal(l.displayIndex,i+1);
 assert.ok(chapters.some(c=>c.id===l.chapterId));
 if(!l.isQuiz){const tasks=w.LessonPractice.tasksFor(l),count=l.chapterId===1||l.chapterId===10?4:3;assert.equal(tasks.length,count,'Multi-task: '+l.id);const base=tasks.find(t=>t.nativeOriginal);assert.equal(base.key,'base');assert.equal(base.solution,l.solution);assert.equal(new Set(tasks.map(t=>t.key)).size,count);if([301,302,303,304].includes(l.id))assert.ok(tasks.slice(0,3).some(t=>t.nativeGameplay),'Gameplay deve avere pratica fisica: '+l.id);}
}
for(const c of chapters)assert.equal(lessons.filter(l=>l.chapterId===c.id&&l.isConsolidation).length,1);
for(const q of w.GDHChapterQuizzes.sessions)assert.equal(q.chapterId,by(q.id).chapterId);
assert.match(by(56).task,/Allarme Rosso Attivo/);assert.match(by(56).task,/Scudi al 100%/);
assert.ok(w.GDHGameplayLessons.entries.every(l=>l.expectedOutput===''),'Gameplay is observed, not replaced with print');
const merged=w.LessonPractice.mergeProgress({'50':{drillVersion:2,completed:['base'],codes:{base:'my scene'}}},{'50':{drillVersion:2,completed:['p2'],codes:{p2:'older draft'}}});
assert.equal(merged['50'].codes.base,'my scene');assert.equal(merged['50'].codes.p2,'older draft');
console.log('PASS curriculum: 115 unique activities, 16 chapters, prerequisite order and saved IDs.');
