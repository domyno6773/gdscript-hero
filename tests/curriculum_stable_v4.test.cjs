'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const load=require('./helpers/load_course.cjs');
const baseline=load(false).w,{w,listeners}=load(true);
const plain=x=>JSON.parse(JSON.stringify(x));
assert.deepEqual(plain(w.LESSONS_DATA.map(l=>l.id)),plain(baseline.LESSONS_DATA.map(l=>l.id)));
assert.equal(w.GDHCourseContract.chapters.length,16);
assert.equal(w.GDHCourseContract.lessonIds.length,85);
assert.equal(w.GDHChapterQuizzes.sessions.length,30);
let tasks=0,clarified=0;
for(const l of w.LESSONS_DATA.filter(l=>!l.isQuiz)){
 assert.ok(l.learningGoal&&l.learningPrerequisites&&l.learningProject,'Missing goal '+l.id);
 assert.match(l.theory,/Prima di iniziare:/);
 const old=baseline.LESSONS_DATA.find(x=>x.id===l.id);
 const actual=w.LessonPractice.tasksFor(l),previous=baseline.LessonPractice.tasksFor(old);
 tasks+=actual.length;
 assert.deepEqual(plain(actual.map(t=>t.key)),plain(previous.map(t=>t.key)));
 for(const [i,t] of actual.entries()){
  // Instructions may change; all execution and persistence contracts must survive.
  for(const key of ['initialCode','solution','expectedOutput','requirements','behaviorInputs','nativeOriginal'])
   assert.deepEqual(plain(t[key]??null),plain(previous[i][key]??null),l.id+'/'+t.key+'/'+key);
  if(t.behaviorInputs?.[0]?.kind==='var'&&!t.nativeOriginal){
   assert.match(t.task,/Da dove partire:/);assert.match(t.task,/Cosa osservare:/);clarified++;
  }
 }
}
assert.equal(tasks,264);assert.equal(clarified,152);
const by=id=>w.LESSONS_DATA.find(l=>l.id===id);
for(const [id,apis] of [[49,['get_class()','is_inside_tree()']],[50,['Label.new()','add_child']],[119,['get_child_count()','has_node']],[54,['pressed.emit()']],[114,['length()','is_equal_approx']],[302,['Input.get_axis']]])
 for(const api of apis)assert.ok(by(id).theory.includes(api),'Explain API before practice: '+id+'/'+api);
// Check every assessed answer and code fragment against the actual learner order.
// Wrong alternatives can mention unknown syntax; solving must not require it.
const concepts=[
 [/\b(?:true|false|bool)\b/,9], [/:=/,103], [/\belif\b/,105],
 [/\bif\b/,19], [/\breturn\b/,31], [/\.append\(/,23], [/\.size\(/,23],
 [/\.erase\(/,107], [/\.has\(/,107], [/\bwhile\b/,27], [/\bbreak\b/,109],
 [/\bcontinue\b/,110], [/\.get\(/,115], [/get_node_or_null\(/,119],
 [/add_child\(/,119], [/\.normalized\(/,114], [/\.distance_to\(/,113]
];
for(const quiz of w.GDHChapterQuizzes.sessions){
 const old=baseline.GDHChapterQuizzes.sessions.find(q=>q.id===quiz.id);
 assert.deepEqual(plain(quiz.questions.map(q=>[q.id,q.type,q.correct])),plain(old.questions.map(q=>[q.id,q.type,q.correct])));
 for(const q of quiz.questions){
  const assessed=[q.prompt,q.code||'',...q.correct.map(i=>q.options[i])].join('\n');
  for(const [pattern,intro] of concepts)if(pattern.test(assessed))
   assert.ok(by(intro).displayIndex<by(quiz.id).displayIndex,'Premature '+pattern+' in quiz '+quiz.id+'/'+q.id);
 }
}
// Exercise the actual project creation callback twice; existing drafts/progress survive.
const projects=[{id:'old',code:'my saved work',nodes:[]}];let current=projects[0];
w.App={switchView:v=>assert.equal(v,'view-practice'),createSandboxProject:name=>{current={id:projects.length,name};projects.push(current);},getActiveSandboxProject:()=>current,saveStorage(){},loadActiveSandboxProject(){}};
listeners.click({target:{closest:()=>true}});w.GDHCourseCapstone.create();
assert.equal(projects.length,3);assert.equal(projects[0].code,'my saved work');
assert.equal(projects[1].code,w.GDHCourseCapstone.starter);
assert.notEqual(projects[1].nodes,projects[2].nodes);
assert.ok(by(48).theory.includes('gdh-start-final-project'));
console.log('PASS v4: 115 stable IDs, 264 unchanged task contracts, 152 clear instructions, all 90 quiz prerequisites, safe capstone copies.');
