'use strict';
// A lesson can become an editable, exportable project without replacing a learner's work.
(() => {
 const A=window.App,M=window.GDHSceneModel;
 if(!A||!M)return;
 function lesson(){return window.LESSONS_DATA.find(l=>l.id===A.state.currentLessonId);}
 function copyToLaboratory(){
   const source=lesson();if(!source?.initialNodes?.length)return;
   A.saveCurrentPracticeCode();
   const code=document.getElementById('code-editor').value;
   const nodes=M.normalize([{name:'Main',type:'Node2D',parent:null},...source.initialNodes.map((n,i)=>({
     ...n,parent:n.parent||'Main',position:n.position||(n.parent?{x:0,y:0}:{x:24,y:24+i*56})
   }))]);
   A.getActiveSandboxProject(); // Initialize legacy saved projects if needed.
   let project=A.state.sandbox.projects.find(p=>p.lessonSource===source.id&&p.code===code&&JSON.stringify(p.nodes)===JSON.stringify(nodes));
   if(!project){project={id:'lesson_'+source.id+'_'+Date.now(),name:source.title.replace(/^\d+\.\s*/,''),lessonSource:source.id,code,nodes,updatedAt:new Date().toISOString()};A.state.sandbox.projects.push(project);}
   A.state.sandbox.activeProjectId=project.id;A.saveStorage();A.openPracticeView();
   document.getElementById('course-lab-return').hidden=false;
 }
 function renderTransfer(){
   document.getElementById('course-lab-transfer')?.remove();
   if(!lesson()?.initialNodes?.length)return;
   const area=document.createElement('div');area.id='course-lab-transfer';area.className='course-lab-transfer';
   const note=document.createElement('p');note.textContent='Porta il tuo codice in una scena modificabile: prova i clic, osserva i timer e importa il progetto in Godot sul tuo computer.';
   const button=document.createElement('button');button.type='button';button.className='scene-action';button.textContent='Apri una copia nel laboratorio';button.onclick=copyToLaboratory;
   area.append(note,button);document.getElementById('lesson-task')?.after(area);
 }
 const open=A.openLesson.bind(A);
 A.openLesson=function(id){const result=open(id);renderTransfer();return result;};
 const build=window.GDScriptRuntime.buildScene.bind(window.GDScriptRuntime);
 window.GDScriptRuntime.buildScene=function(source){
   if(!window.GDHGameplayLessons.has(source?.id))return build(source);
   return A.buildSceneFromNodes(window.GDHGameplayLessons.sceneNodes(source));
 };
 window.addEventListener('DOMContentLoaded',()=>{
   const back=document.createElement('button');back.id='course-lab-return';back.className='scene-action';back.type='button';back.textContent='Torna alla lezione';back.hidden=true;
   back.onclick=()=>{const id=A.getActiveSandboxProject().lessonSource;if(id)A.openLesson(id);};document.getElementById('btn-sandbox-help').before(back);
   const load=A.loadActiveSandboxProject.bind(A);A.loadActiveSandboxProject=function(){const result=load();back.hidden=!A.getActiveSandboxProject().lessonSource;return result;};
 });
})();
