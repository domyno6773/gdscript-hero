'use strict';
// Arena Classificata — anteprima didattica libera.
// Le prove demo vengono eseguite dal vero Godot WebAssembly locale: la risposta
// nel browser NON e' un risultato verificato e NON accredita XP o punti ufficiali.
const CompetitionArena=(()=>{
 const DEMOS=Object.freeze([
  {
   id:'demo_doppio',title:'Raddoppia il valore',difficulty:'Base',points:100,
   topics:'Funzioni, parametri, return',method:'raddoppia',
   task:'Implementa raddoppia(valore) in modo da restituire il doppio del numero ricevuto. Gestisci anche zero e numeri negativi.',
   initial:'extends Node\n\nfunc raddoppia(valore: int) -> int:\n    # Restituisci il doppio di valore\n    return 0\n',
   cases:[{args:[7],expected:14,points:34,desc:'Gestione di un valore positivo'},
          {args:[0],expected:0,points:33,desc:'Gestione dello zero'},
          {args:[-3],expected:-6,points:33,desc:'Gestione di un valore negativo'}]
  },
  {
   id:'demo_salute',title:'Salute del personaggio',difficulty:'Intermedia',points:150,
   topics:'Funzioni, condizioni, limiti',method:'salute_dopo_danno',
   task:'Crea salute_dopo_danno(salute, danno): sottrai il danno dalla salute senza permettere risultati inferiori a zero.',
   initial:'extends Node\n\nfunc salute_dopo_danno(salute: int, danno: int) -> int:\n    # Impedisci che il risultato diventi negativo\n    return salute\n',
   cases:[{args:[100,25],expected:75,points:50,desc:'Danno ordinario'},
          {args:[20,100],expected:0,points:50,desc:'Danno maggiore della salute'},
          {args:[0,5],expected:0,points:50,desc:'Salute gia\' azzerata'}]
  },
  {
   id:'demo_nemico',title:'Decisioni di un nemico',difficulty:'Avanzata',points:250,
   topics:'Condizioni multiple, priorita, String',method:'decidi_azione',
   task:'Implementa decidi_azione(distanza, salute). Se la salute e\' zero o meno, restituisci "KO". Se il nemico e\' vicino (distanza < 5) e ha meno di 30 HP, restituisci "FUGA". Se e\' vicino con almeno 30 HP, restituisci "ATTACCO". Altrimenti restituisci "ATTESA".',
   initial:'extends Node\n\nfunc decidi_azione(distanza: int, salute: int) -> String:\n    # Valuta le condizioni nell\'ordine corretto\n    return "ATTESA"\n',
   cases:[{args:[3,0],expected:'KO',points:60,desc:'Nemico fuori combattimento'},
          {args:[2,20],expected:'FUGA',points:60,desc:'Nemico ferito e vicino'},
          {args:[4,80],expected:'ATTACCO',points:65,desc:'Nemico vicino e in salute'},
          {args:[7,80],expected:'ATTESA',points:65,desc:'Nemico lontano'}]
  }
 ]);
 let current=DEMOS[0].id, busy=false;
 const el=id=>document.getElementById(id);
 const active=()=>DEMOS.find(d=>d.id===current)||DEMOS[0];
 const node=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;};
 const gradeReply=(challenge,reply,stderr='')=>{
  const calls=Array.isArray(reply?.methodCalls)?reply.methodCalls:[];
  const executed=reply?.status==='executed' && !String(stderr||'').trim();
  const checks=challenge.cases.map((c,i)=>{
   const call=calls[i];
   const passed=!!(executed && call && call.method===challenge.method &&
     call.status==='executed' && call.value===c.expected);
   return {desc:c.desc,passed,points:passed?c.points:0,max:c.points};
  });
  return {checks,points:checks.reduce((s,c)=>s+c.points,0),max:challenge.points,
   error:executed?'':String(stderr||reply?.message||'Il codice non e\' stato eseguito correttamente.').slice(0,700)};
 };
 function select(id) {
  if(busy)return;
  const challenge=DEMOS.find(x=>x.id===id);
  if(!challenge)return;
  current=challenge.id;
  const title=el('competition-current-title'),task=el('competition-current-task'),
        editor=el('competition-code-editor'),meta=el('competition-current-meta'),results=el('competition-results');
  if(title)title.textContent=challenge.title;
  if(task)task.textContent=challenge.task;
  if(meta)meta.textContent=challenge.difficulty+' · '+challenge.topics+' · Massimo '+challenge.points+' punti dimostrativi';
  if(editor)editor.value=challenge.initial;
  if(results)results.textContent='Scrivi il codice e seleziona “Verifica con Godot”. Nessuna ricompensa viene registrata.';
  renderTabs();
 }
 function renderTabs(){
  const root=el('competition-challenge-list');if(!root)return;
  root.replaceChildren();
  for(const challenge of DEMOS){
   const btn=node('button','competition-demo-tab'+(challenge.id===current?' active':''));btn.type='button';
   btn.setAttribute('aria-pressed',String(challenge.id===current));
   btn.append(node('span','competition-tab-name',challenge.title),node('span','competition-tab-meta',challenge.difficulty+' · '+challenge.points+' pt'));
   btn.addEventListener('click',()=>select(challenge.id));root.append(btn);
  }
 }
 function renderResult(result){
  const root=el('competition-results');if(!root)return;
  root.replaceChildren();
  const summary=node('div','competition-result-summary','Risultato di allenamento: '+result.points+' / '+result.max+' pt');
  root.append(summary);
  if(result.error)root.append(node('p','competition-error',result.error));
  for(const item of result.checks){
   const row=node('div','competition-check'+(item.passed?' passed':' failed'));
   row.append(node('span','competition-check-label',(item.passed?'Superato: ':'Da migliorare: ')+item.desc),
    node('strong','competition-check-score',item.points+' / '+item.max));
   root.append(row);
  }
  root.append(node('p','competition-result-note','Questa e\' una prova locale. I test delle vere sfide classificate saranno riservati al server.'));
 }
 async function run(){
  if(busy)return;
  const challenge=active(),editor=el('competition-code-editor'),btn=el('competition-run');
  if(!editor||!btn)return;
  const code=editor.value;
  if(!code.trim() || code.length>10000){
   const results=el('competition-results');if(results)results.textContent='Scrivi fino a 10.000 caratteri di GDScript.';
   return;
  }
  busy=true;btn.disabled=true;btn.textContent='Godot sta verificando...';
  if(el('competition-results'))el('competition-results').textContent='Esecuzione del motore Godot in corso...';
  try{
   if(!window.GDHGodot?.runNative)throw Error('Motore Godot non disponibile');
   const calls=challenge.cases.map(c=>({method:challenge.method,args:c.args}));
   const native=await window.GDHGodot.runNative(code,{calls});
   if(current===challenge.id && el('competition-code-editor')?.value===code)
    renderResult(gradeReply(challenge,native.reply,native.stderr));
  } catch(error){
   if(current===challenge.id && el('competition-results'))
    el('competition-results').textContent='Errore Godot: '+String(error?.message||error).slice(0,350);
  } finally{busy=false;btn.disabled=false;btn.textContent='Verifica con Godot';}
 }
 function download(){
  const editor=el('competition-code-editor');if(!editor)return;
  const content=editor.value;
  if(window.App?.downloadFile)window.App.downloadFile(active().id+'.gd',content,'text/plain');
 }
 return Object.freeze({DEMOS,select,run,download,get activeId(){return current;},gradeReply});
})();
if(typeof window!=='undefined')window.CompetitionArena=CompetitionArena;
if(typeof module!=='undefined'&&module.exports)module.exports=CompetitionArena;
