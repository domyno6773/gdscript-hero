'use strict';
(()=>{
 const lab=window.GDHLessonLab,select=document.getElementById('lesson');
 if(!lab)throw new Error('Fixture lezioni mancante');
 lab.lessons.forEach(lesson=>{
   const option=document.createElement('option');option.value=String(lesson.id);
   option.textContent=lesson.title;select.append(option);
 });
 const load=()=>{
   const lesson=lab.get(Number(select.value));
   document.getElementById('code').value=lesson.initialCode;
   document.getElementById('description').textContent=lesson.task;
   document.getElementById('grade').textContent='';
   document.getElementById('warning').textContent=lesson.id===6
     ? 'Audit: il codice iniziale originale della lezione 6 non coincide con la consegna; questo laboratorio non modifica i dati ufficiali.'
     : lesson.id===4
     ? 'Audit: il corso mostra Energia: 100 % mentre il vero Godot stampa Energia: 100%. Qui prevale il comportamento nativo.'
     : '';
 };
 select.addEventListener('change',load);
 document.getElementById('solution').addEventListener('click',()=>{
   document.getElementById('code').value=lab.get(Number(select.value)).solution;
 });
 load();
})();
