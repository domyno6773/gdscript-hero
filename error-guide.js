'use strict';
/* Debug didattico: usa gli errori realmente restituiti da Godot.
 * Non esegue GDScript, non assegna XP e non inventa righe o soluzioni.
 */
(function(root){
  const cut=(value,max=480)=>String(value??'').trim().slice(0,max);
  const lineOf=(message,source)=>{
    const count=String(source||'').split('\n').length;
    const patterns=[
      /res:\/\/[^\s():]*\.gd:(\d+)(?::\d+)?/i,
      /(?:at:|in:)\s*[^\n]*?\b(?:line|riga)\s*(\d+)/i,
      /\b(?:line|riga)\s*(\d+)\b/i,
      /(?:script|gdscript)[^\n]*?:(\d+):(?:\d+)?/i
    ];
    for(const pattern of patterns){
      const m=String(message||'').match(pattern);
      if(m){
        const n=Number(m[1]);
        if(Number.isSafeInteger(n)&&n>=1&&n<=count)return n;
      }
    }
    return null;
  };
  const advice=[
    {pattern:/expected\s*["']?:["']?|expected.*colon|missing.*colon/i,
      title:'Manca un separatore del blocco',why:'Godot si aspetta i due punti per iniziare un blocco di istruzioni.',
      hint:'Controlla la fine della condizione o della dichiarazione di funzione e il rientro della riga seguente.'},
    {pattern:/indent|unindent|tabs and spaces|mixed tabs|expected.*indented/i,
      title:'Rientro del codice da controllare',why:'Godot utilizza l’indentazione per riconoscere quali istruzioni appartengono a un blocco.',
      hint:'Confronta l’allineamento con la riga che apre il blocco. Evita di mescolare tabulazioni e spazi.'},
    {pattern:/unterminated string|unclosed string|expected closing.*quote|string not terminated/i,
      title:'Stringa non chiusa',why:'Una stringa deve avere le virgolette di apertura e chiusura.',
      hint:'Rileggi i testi fra virgolette e controlla anche i caratteri di escape.'},
    {pattern:/identifier.*(not declared|not found)|unknown identifier|not declared in the current scope|undeclared identifier/i,
      title:'Nome non riconosciuto',why:'Il codice usa un identificatore che Godot non riesce a trovare in questo ambito.',
      hint:'Controlla maiuscole e minuscole, eventuali errori di battitura e il punto in cui hai dichiarato la variabile.'},
    {pattern:/invalid operands|invalid operator|cannot (?:convert|assign)|type mismatch|cannot be assigned/i,
      title:'Tipi o operazione incompatibili',why:'L’operazione usa valori o tipi che Godot non riesce a combinare in questo modo.',
      hint:'Controlla il tipo dei due valori e valuta se devi convertirne uno esplicitamente.'},
    {pattern:/invalid (?:get|set)|nil|null instance|nonexistent function|invalid call/i,
      title:'Accesso o chiamata non valida',why:'Lo script sta provando a leggere una proprietà o chiamare una funzione su un valore non adatto.',
      hint:'Verifica che l’oggetto esista e che il nome della proprietà o funzione sia corretto.'},
    {pattern:/expected.*\)|expected.*\]|expected.*\}/i,
      title:'Parentesi da controllare',why:'Godot si aspetta un carattere di chiusura.',
      hint:'Conta le parentesi aperte e chiuse nell’espressione indicata.'}
  ];
  function diagnose({source='',error='',failedTest=null,verdict='' }={}){
    const raw=cut(error,1600);
    const failure=cut(failedTest?.diff || failedTest?.desc || '',800);
    if(!raw&&!failure)return null;
    const isEngineProblem=Boolean(raw);
    const line=isEngineProblem?lineOf(raw,source):null;
    const match=isEngineProblem?advice.find(a=>a.pattern.test(raw)):null;
    let title,why,hint,kind;
    if(isEngineProblem){
      kind='engine';
      title=match?.title || (verdict==='timeout'?'Tempo di esecuzione esaurito':'Godot ha segnalato un errore');
      why=match?.why || (verdict==='timeout'
        ?'L’esecuzione è durata più del tempo disponibile. Non significa necessariamente che la soluzione sia sbagliata.'
        :'Lo script non è stato eseguito correttamente dal motore Godot.');
      hint=match?.hint || (verdict==='timeout'
        ?'Verifica se un ciclo può terminare. Se il codice dovrebbe concludersi rapidamente, riprova.'
        :'Leggi il messaggio tecnico e controlla la sintassi o gli oggetti utilizzati.');
    }else{
      kind='requirement';
      title='Risultato diverso da quello richiesto';
      why='Godot ha eseguito il codice, ma almeno un requisito dell’esercizio non è stato soddisfatto.';
      hint='Confronta la consegna con il risultato ottenuto: valori, ordine delle operazioni e output prodotto.';
    }
    return Object.freeze({
      kind,title,why,hint,line,raw:isEngineProblem?raw:'',
      requirement:failure,
      exact:line!==null
    });
  }
  function clear(container){
    const host=typeof container==='string'?document.querySelector(container):container;
    if(!host)return;
    host.querySelectorAll(':scope > .gdh-debug-panel').forEach(node=>node.remove());
  }
  function render(container,diagnosis,onLine){
    const host=typeof container==='string'?document.querySelector(container):container;
    if(!host)return;
    clear(host);
    if(!diagnosis)return;
    const card=document.createElement('section');
    card.className='gdh-debug-panel';
    card.dataset.kind=diagnosis.kind;
    card.setAttribute('aria-label','Debugger didattico');
    const top=document.createElement('div');top.className='gdh-debug-top';
    const tag=document.createElement('span');tag.className='gdh-debug-tag';
    tag.textContent=diagnosis.kind==='engine'?'ERRORE GODOT':'REQUISITO';
    const heading=document.createElement('strong');heading.textContent=diagnosis.title;
    top.append(tag,heading);
    card.append(top);
    const explain=document.createElement('p');explain.className='gdh-debug-explanation';
    explain.textContent=diagnosis.why;card.append(explain);
    if(diagnosis.line!==null && typeof onLine==='function'){
      const jump=document.createElement('button');jump.type='button';
      jump.className='gdh-debug-jump';
      jump.textContent='Vai alla riga '+diagnosis.line;
      jump.addEventListener('click',()=>onLine(diagnosis.line));
      card.append(jump);
    }else if(diagnosis.kind==='engine'){
      const label=document.createElement('small');
      label.className='gdh-debug-location';
      label.textContent='Godot non ha indicato una riga precisa.';
      card.append(label);
    }
    const box=document.createElement('div');box.className='gdh-debug-hint';
    const hintTitle=document.createElement('strong');hintTitle.textContent='Indizio per correggerlo';
    const hint=document.createElement('p');hint.textContent=diagnosis.hint;
    box.append(hintTitle,hint);card.append(box);
    if(diagnosis.requirement){
      const why=document.createElement('p');why.className='gdh-debug-requirement';
      why.textContent=diagnosis.requirement;card.append(why);
    }
    if(diagnosis.raw){
      const details=document.createElement('details');details.className='gdh-debug-technical';
      const summary=document.createElement('summary');summary.textContent='Messaggio originale di Godot';
      const pre=document.createElement('pre');pre.textContent=diagnosis.raw;
      details.append(summary,pre);card.append(details);
    }
    host.append(card);
    return card;
  }
  function jump(editor,line){
    if(!editor||!Number.isSafeInteger(line)||line<1)return;
    const rows=editor.value.split('\n');
    if(line>rows.length)return;
    const offset=rows.slice(0,line-1).reduce((sum,row)=>sum+row.length+1,0);
    editor.focus({preventScroll:true});
    editor.setSelectionRange(offset,offset+rows[line-1].length);
    const style=getComputedStyle(editor);
    const step=parseFloat(style.lineHeight)||22;
    editor.scrollTop=Math.max(0,(line-3)*step);
  }
  root.GDHErrorGuide=Object.freeze({diagnose,render,clear,jump});
})(typeof window!=='undefined'?window:globalThis);
