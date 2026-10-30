'use strict';
/* Final-course reading contract for the 152 individual, already native-tested drills.
 * Improves instructions without changing code, keys, reference solutions or graders.
 */
(function(root){
 const original=root.GDHIndividualPractice;
 if(!original)throw Error('Load the original individual practice catalog first');
 const esc=x=>String(x).replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[c]);
 const taskDetails=task=>{
  const input=task.behaviorInputs?.[0];
  if(!input||input.kind!=='var')return task;
  const name=input.name;
  const decl=task.initialCode.split(/\r?\n/).find(line=>new RegExp('^\\s*var\\s+'+name+'\\s*=').test(line))?.trim();
  if(!decl)throw Error('Missing visible input data for '+task.title);
  const expected=String(task.expectedOutput||'').trimEnd();
  if(!expected)throw Error('Missing expected result for '+task.title);
  const output=expected.split('\n').map(line=>'<code>'+esc(line)+'</code>').join(' &rarr; ');
  return {...task,task:
    '<p><strong>'+esc(task.title)+'.</strong> '+task.task.replace(/^<p>|<\/p>$/g,'')+'</p>'+
    '<p><strong>Da dove partire:</strong> in <code>_ready()</code> trovi gia <code>'+esc(decl)+
    '</code>. Conserva questa variabile e completa soltanto il codice mancante.</p>'+
    '<p><strong>Cosa osservare:</strong> il risultato in console, in ordine di riga, deve essere '+output+'.</p>'+
    '<p><strong>Come viene verificato:</strong> Godot eseguira il tuo programma anche cambiando il valore iniziale di <code>'+
    esc(name)+'</code>. Usa il dato realmente ricevuto: non stampare direttamente il risultato di esempio.</p>'
  };
 };
 const tasksFor=lesson=>original.tasksFor(lesson).map(taskDetails);
 root.GDHIndividualPractice=Object.freeze({...original,tasksFor});
 root.GDHPracticeInstructionVersion=4;
})(typeof window!=='undefined'?window:globalThis);
