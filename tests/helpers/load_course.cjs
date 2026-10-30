'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
// Public curriculum tests share the actual index.html manifest. Individual module
// unit tests may still load isolated fixtures explicitly.
module.exports=function loadCourse(v4=true){
 const w={},listeners={};
 const ctx=vm.createContext({window:w,console,Date,document:{addEventListener:(event,fn)=>listeners[event]=fn}});
 const files=[];
 for(const [,f] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)){
  if(f==='code-guide.js')break;
  if(!/^(lessons|lesson_practice|practice-behavior|curriculum_|practice_catalog|chapter_quizzes|quiz_prerequisites|gameplay_lessons|course_capstone)/.test(f))continue;
  if(!v4&&['curriculum_guidance.js','quiz_prerequisites_v4.js','curriculum_compass.js','course_capstone.js'].includes(f))continue;
  vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});files.push(f);
 }
 return {w,ctx,listeners,files};
};
