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
   const notes={
     39:'Audit: lo starter parla di verifica protetta con if, mentre la consegna richiede forziere.has() e due variabili. Il contenuto pubblico è rimasto invariato.',
     57:'Prova automatica: Godot avvia davvero Timer, ma il test invia timeout manualmente per non aspettare 2,5 secondi. Non è un test del tempo reale trascorso.',
     58:'Il vero Godot stampa il colore come componenti RGBA: (0.1333, 0.7725, 0.3686, 1.0). Il corso pubblico mostra invece #22c55e, formato differente.'
   };
   document.getElementById('warning').textContent=notes[lesson.id] || (lesson.id===6
     ? 'Audit: il codice iniziale originale della lezione 6 non coincide con la consegna; questo laboratorio non modifica i dati ufficiali.'
     : lesson.id===4
     ? 'Audit: il corso mostra Energia: 100 % mentre il vero Godot stampa Energia: 100%. Qui prevale il comportamento nativo.'
     : '');
 };
 select.addEventListener('change',load);
 document.getElementById('solution').addEventListener('click',()=>{
   document.getElementById('code').value=lab.get(Number(select.value)).solution;
 });
 load();
})();
