'use strict';
/* Glossario contestuale del codice: non esegue GDScript e non fornisce soluzioni.
 * Spiega esclusivamente costruzioni riconoscibili nelle righe visualizzate.
 * Usa DOM textContent: il codice dello studente non diventa mai HTML.
 */
(function(root){
  const rules=[
    {
      key:'extends',match:/^extends\s+([A-Za-z_]\w*)\b/,
      explain:m=>({
        title:'extends '+m[1],
        detail:m[1]==='Node'
          ? 'Questo script nasce da Node, il tipo base dei nodi di Godot. Un nodo è un elemento della scena a cui puoi assegnare funzioni e comportamenti. Non è una stampa e non appare nella console.'
          : m[1]==='Node2D'
            ? 'Questo script nasce da Node2D: un nodo che può avere posizione, rotazione e dimensione in una scena 2D.'
            : 'Questo script eredita le caratteristiche del tipo '+m[1]+'. "extends" indica che il tuo script parte da quel tipo di nodo o classe.'
      })
    },
    {key:'ready',match:/^(?:static\s+)?func\s+_ready\s*\(/,
      title:'func _ready()',
      detail:'func dichiara una funzione, cioè un gruppo di istruzioni. _ready() è speciale: Godot la chiama automaticamente quando il nodo entra nella scena. I due punti : iniziano il blocco; le righe rientrate sotto fanno parte della funzione.'},
    {key:'func',match:/^(?:static\s+)?func\s+([A-Za-z_]\w*)\s*\(/,
      explain:m=>({title:'func '+m[1]+'(...)',detail:'Qui si definisce una funzione chiamata '+m[1]+'. Il codice rientrato sotto appartiene alla funzione, che può ricevere valori nelle parentesi e viene eseguita quando è chiamata.'})},
    {key:'comment',match:/^#/,
      title:'Commenti #',
      detail:'Tutto ciò che segue # fino a fine riga è una nota per le persone: Godot non la esegue. Nei commenti possono esserci indicazioni della consegna, quindi leggili comunque.'},
    {key:'pass',match:/^pass(?:\s|$)/,
      title:'pass',
      detail:'È un’istruzione che non fa niente. Si usa per lasciare temporaneamente vuoto un blocco senza causare errori. Se l’esercizio ti chiede di completarlo, scriverai le istruzioni necessarie al suo posto.'},
    {key:'print',match:/\bprint\s*\(/,
      title:'print(...)',
      detail:'Scrive nella console il testo o i valori messi tra parentesi. Le virgolette racchiudono il testo; valori separati da virgole vengono stampati nella stessa riga. Non disegna nulla sullo schermo del gioco.'},
    {key:'const',match:/^const\s+([A-Za-z_]\w*)/,
      explain:m=>({title:'const '+m[1],detail:'Definisce un valore con nome '+m[1]+' che non deve cambiare durante l’esecuzione, per esempio un limite massimo.'})},
    {key:'var',match:/^var\s+([A-Za-z_]\w*)/,
      explain:m=>({title:'var '+m[1],detail:'Crea una variabile chiamata '+m[1]+': una casella con un nome che può conservare un testo, un numero, un oggetto o un altro valore. Con = le assegni un valore iniziale.'})},
    {key:'type',match:/^(?:var|const)\s+[A-Za-z_]\w*\s*:\s*(?:int|float|String|bool|Vector2|Array|Dictionary)\b/,
      title:'Tipo della variabile (:)',
      detail:'Il nome dopo i due punti specifica il tipo di valore che la variabile può contenere, come int (intero), float (decimale), bool (vero/falso) o String (testo).'},
    {key:'signal',match:/^signal\s+([A-Za-z_]\w*)/,
      explain:m=>({title:'signal '+m[1],detail:'Definisce un segnale, cioè un avviso che il nodo può emettere quando succede qualcosa. Altri nodi possono collegarsi per reagire a quell’avviso.'})},
    {key:'class',match:/^(?:class_name|class)\s+([A-Za-z_]\w*)/,
      explain:m=>({title:'Classe '+m[1],detail:'Definisce un tipo di oggetto con caratteristiche e comportamenti propri. È come un modello da cui creare oggetti.'})},
    {key:'init',match:/\bfunc\s+_init\s*\(/,
      title:'_init(...)',detail:'È la funzione chiamata quando viene creato un nuovo oggetto. Può ricevere valori iniziali per prepararlo.'},
    {key:'condition',match:/^if\s+.+:\s*(?:#.*)?$/,
      title:'if (condizione)',detail:'Esegue il blocco rientrato soltanto se la condizione risulta vera. I due punti aprono il blocco da eseguire.'},
    {key:'elif',match:/^elif\b/,title:'elif',
      detail:'È un’altra condizione da controllare se quelle precedenti sono false. Permette più alternative nella stessa decisione.'},
    {key:'else',match:/^else\s*:/,title:'else',
      detail:'Contiene il blocco alternativo, eseguito quando le condizioni precedenti non sono soddisfatte.'},
    {key:'for',match:/^for\s+/,title:'for',
      detail:'Ripete il blocco rientrato per ogni elemento di una raccolta oppure per ogni numero prodotto da range(...).'},
    {key:'while',match:/^while\s+/,title:'while',
      detail:'Ripete il blocco di istruzioni finché la condizione è vera. Se resta sempre vera, il ciclo potrebbe non finire.'},
    {key:'match',match:/^match\s+/,title:'match',
      detail:'Confronta un valore con diversi casi possibili e segue il blocco del caso che corrisponde.'},
    {key:'return',match:/^return\b/,title:'return',
      detail:'Termina la funzione corrente. Se dopo return c’è un valore, lo restituisce al codice che ha chiamato la funzione.'},
    {key:'break',match:/^break\b/,title:'break',
      detail:'Interrompe subito il ciclo in cui si trova, anche se ci sarebbero altre ripetizioni.'},
    {key:'continue',match:/^continue\b/,title:'continue',
      detail:'Salta il resto dell’iterazione corrente del ciclo e passa a quella successiva.'},
    {key:'nodepath',match:/\$[A-Za-z_]\w*/,
      title:'$NomeNodo',detail:'Il simbolo $ permette di trovare un nodo della scena tramite il suo percorso o nome. Per esempio $Label indica un nodo chiamato Label, non una variabile.'},
    {key:'connect',match:/\.connect\s*\(/,
      title:'.connect(...)',detail:'Collega un segnale a una funzione: quando il segnale viene emesso, Godot esegue la funzione collegata.'},
    {key:'emit',match:/\.emit\s*\(/,
      title:'.emit(...)',detail:'Emette un segnale. In questo modo il nodo avvisa gli altri oggetti che qualcosa è successo.'},
    {key:'await',match:/\bawait\b/,title:'await',
      detail:'Mette in attesa questa parte di codice finché non finisce un’operazione o non arriva un segnale.'},
    {key:'new',match:/\.new\s*\(/,
      title:'.new(...)',detail:'Crea un nuovo oggetto a partire da una classe.'},
    {key:'vector',match:/\bVector2\s*\(/,title:'Vector2(x, y)',
      detail:'Rappresenta una coppia di numeri, spesso usata come coordinate X e Y per posizione o movimento in 2D.'},
    {key:'array',match:/=\s*\[/,title:'Array [ ... ]',
      detail:'Le parentesi quadre creano una lista ordinata di valori. Il primo elemento si trova alla posizione 0.'},
    {key:'dictionary',match:/=\s*\{/,title:'Dictionary { ... }',
      detail:'Le parentesi graffe creano una raccolta di coppie chiave-valore: ogni chiave serve per ritrovare il suo valore.'},
    {key:'boolean',match:/\b(?:true|false)\b/,title:'true / false',
      detail:'Sono valori logici: true significa vero e false significa falso. Si usano per rappresentare stati e condizioni.'},
    {key:'range',match:/\brange\s*\(/,title:'range(...)',
      detail:'Produce una sequenza di numeri, utile per ripetere istruzioni in un ciclo for.'},
    {key:'property',match:/\.[A-Za-z_]\w*\s*=/,
      title:'Proprietà di un oggetto',
      detail:'Il punto . permette di accedere a una proprietà di un oggetto o nodo, come .text. L’uguale = modifica il suo valore.'},
    {key:'assignment',match:/^[A-Za-z_]\w*\s*(?:\+|-|\*|\/)?=/,
      title:'Assegnazione (=)',detail:'L’uguale = salva un valore in una variabile già esistente. Con += o -= il valore viene aumentato o diminuito.'},
    {key:'export',match:/^@export\b/,title:'@export',
      detail:'Rende una variabile modificabile dall’Inspector di Godot, senza dover cambiare lo script.'},
    {key:'onready',match:/^@onready\b/,title:'@onready',
      detail:'Prepara il valore di una variabile quando il nodo è pronto, spesso per trovare altri nodi della scena.'}
  ];
  const ruleByKey=new Map(rules.map(r=>[r.key,r]));
  function analyze(source){
    const found=new Map();
    const lines=String(source||'').replace(/\r\n/g,'\n').split('\n');
    lines.forEach((original,i)=>{
      const line=original.trim();
      if(!line)return;
      // Nei commenti non cercare parole chiave che non sono codice eseguibile.
      if(line.startsWith('#')){
        add(rules.find(r=>r.key==='comment'),line,i+1);
        return;
      }
      // Riconosci anche più costrutti sulla stessa riga, es. var x = [1,2].
      for(const rule of rules){
        // Non leggere "func _ready" come una normale funzione.
        if(rule.key==='func' && /^func\s+_ready\s*\(/.test(line))continue;
        const m=line.match(rule.match);
        if(m)add(rule,m,i+1);
      }
    });
    function add(rule,m,line){
      if(!rule)return;
      const parsed=rule.explain?rule.explain(m):{title:rule.title,detail:rule.detail};
      if(!found.has(rule.key))found.set(rule.key,{key:rule.key,...parsed,lines:[]});
      const item=found.get(rule.key);
      if(!item.lines.includes(line))item.lines.push(line);
    }
    return [...found.values()].sort((a,b)=>a.lines[0]-b.lines[0]);
  }
  function unseenKeys(lessonId,allLessons){
    const seen=new Set();
    for(const lesson of (allLessons||[])){
      if(typeof lesson.id!=='number'||lesson.id>=lessonId)continue;
      for(const concept of analyze(lesson.initialCode||''))seen.add(concept.key);
    }
    return seen;
  }
  function render(container,source,{expanded=false,newKeys=[]}={}){
    const host=typeof container==='string'?document.querySelector(container):container;
    if(!host)return;
    const items=analyze(source);
    let details=host.querySelector(':scope > .gdh-code-guide');
    let wasOpen=details?details.open:expanded;
    if(!details){
      details=document.createElement('details');
      details.className='gdh-code-guide';
      const summary=document.createElement('summary');
      summary.textContent='Comprendi il codice';
      const intro=document.createElement('p');
      intro.className='gdh-code-guide-intro';
      intro.textContent='Qui trovi il significato delle istruzioni già visibili nell’editor. Non sono soluzioni della sfida.';
      const content=document.createElement('div');
      content.className='gdh-code-guide-items';
      details.append(summary,intro,content);
      host.replaceChildren(details);
    }
    details.open=wasOpen;
    const content=details.querySelector('.gdh-code-guide-items');
    content.replaceChildren();
    if(!items.length){
      const empty=document.createElement('p');
      empty.className='gdh-code-guide-empty';
      empty.textContent='Qui compariranno le spiegazioni quando ci saranno istruzioni riconoscibili nel codice.';
      content.append(empty);
      return;
    }
    for(const item of items){
      const entry=document.createElement('div');
      entry.className='gdh-code-guide-entry';
      const top=document.createElement('div');
      top.className='gdh-code-guide-entry-top';
      const title=document.createElement('strong');
      title.textContent=item.title;
      top.append(title);
      if(newKeys.includes(item.key)){
        const tag=document.createElement('span');
        tag.className='gdh-code-guide-new';
        tag.textContent='Nuovo';
        top.append(tag);
      }
      const explanation=document.createElement('p');
      explanation.textContent=item.detail;
      const jump=document.createElement('button');
      jump.type='button';
      jump.className='gdh-code-guide-jump';
      jump.dataset.line=String(item.lines[0]);
      jump.textContent=item.lines.length===1
        ? 'Riga '+item.lines[0] : 'Righe '+item.lines.slice(0,5).join(', ')+(item.lines.length>5?'…':'');
      entry.append(top,explanation,jump);
      content.append(entry);
    }
  }
  root.GDHCodeGuide=Object.freeze({analyze,render,unseenKeys});
})(typeof window!=='undefined'?window:globalThis);
