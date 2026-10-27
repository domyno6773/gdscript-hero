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

  // Cerca parole in QUALSIASI codice (anche un singolo "func" appena digitato).
  // La spiegazione completa è la stessa del glossario; le parole isolate
  // ricadono su una definizione generale e non richiedono una sintassi completa.
  const inlineBasics={
    extends:{title:'extends',detail:'Indica da quale tipo di nodo o classe parte questo script. Per esempio, Node è un tipo base di elemento della scena.'},
    func:{title:'func',detail:'Introduce una funzione, cioè un gruppo di istruzioni con un nome. Le parentesi possono contenere parametri; il blocco di istruzioni viene scritto sotto.'},
    var:{title:'var',detail:'Dichiara una variabile: uno spazio con un nome per conservare un valore, che potrai cambiare durante il programma.'},
    const:{title:'const',detail:'Dichiara una costante: un valore con un nome che non puoi modificare dopo averlo definito.'},
    signal:{title:'signal',detail:'Dichiara un segnale: un avviso che questo nodo potrà emettere perché altri nodi reagiscano.'},
    class_name:{title:'class_name',detail:'Assegna un nome alla classe dello script così da poterla riconoscere e utilizzare in altre parti del progetto.'},
    class:{title:'class',detail:'Dichiara una classe: un modello che raccoglie dati e funzioni per creare oggetti.'},
    _ready:{title:'_ready()',detail:'È una funzione speciale: Godot la esegue automaticamente quando il nodo entra nella scena, dopo che i suoi figli sono pronti.'},
    _init:{title:'_init()',detail:'È la funzione di inizializzazione, chiamata quando viene creato un oggetto.'},
    print:{title:'print(...)',detail:'Scrive nella console il testo o i valori indicati fra parentesi. Non mostra testo direttamente sulla schermata del gioco.'},
    str:{title:'str(...)',detail:'Converte un valore in testo (String), per esempio per comporre un messaggio.'},
    int:{title:'int',detail:'Rappresenta numeri interi, senza parte decimale. int(...) può convertire un valore in intero.'},
    float:{title:'float',detail:'Rappresenta numeri che possono contenere una parte decimale.'},
    String:{title:'String',detail:'È il tipo usato per rappresentare testo, come nomi e frasi.'},
    bool:{title:'bool',detail:'È il tipo logico: può valere true (vero) oppure false (falso).'},
    Vector2:{title:'Vector2',detail:'È una coppia di numeri, spesso utilizzata per le coordinate X e Y in uno spazio 2D.'},
    Array:{title:'Array',detail:'È una lista ordinata di valori. La prima posizione è identificata dall’indice 0.'},
    Dictionary:{title:'Dictionary',detail:'Contiene valori associati a chiavi, utili per ritrovare dati tramite un nome.'},
    range:{title:'range(...)',detail:'Genera una sequenza di numeri, spesso usata per ripetere istruzioni con for.'},
    abs:{title:'abs(...)',detail:'Restituisce il valore assoluto di un numero, cioè la sua distanza da zero.'},
    min:{title:'min(...)',detail:'Restituisce il minore fra due o più valori.'},
    max:{title:'max(...)',detail:'Restituisce il maggiore fra due o più valori.'},
    clamp:{title:'clamp(...)',detail:'Limita un valore entro un intervallo minimo e massimo.'},
    round:{title:'round(...)',detail:'Arrotonda un numero al valore intero più vicino.'},
    await:{title:'await',detail:'Attende che finisca un’operazione o arrivi un segnale prima di continuare.'},
    return:{title:'return',detail:'Termina l’esecuzione della funzione corrente e, facoltativamente, restituisce un valore.'},
    if:{title:'if',detail:'Verifica una condizione. Se è vera, Godot esegue il blocco di istruzioni rientrato sotto.'},
    elif:{title:'elif',detail:'Permette di controllare una condizione alternativa quando le precedenti non sono vere.'},
    else:{title:'else',detail:'Indica cosa eseguire quando le condizioni precedenti non sono soddisfatte.'},
    for:{title:'for',detail:'Ripete un blocco per ogni elemento di una sequenza o raccolta.'},
    while:{title:'while',detail:'Ripete un blocco finché una condizione resta vera. Attenzione a non creare cicli infiniti.'},
    match:{title:'match',detail:'Confronta un valore con più possibilità ed esegue il blocco corrispondente.'},
    pass:{title:'pass',detail:'Non fa nulla: serve come istruzione provvisoria in un blocco ancora vuoto.'},
    break:{title:'break',detail:'Interrompe immediatamente il ciclo in cui si trova.'},
    continue:{title:'continue',detail:'Passa direttamente all’iterazione successiva di un ciclo.'},
    true:{title:'true',detail:'È il valore logico vero.'},
    false:{title:'false',detail:'È il valore logico falso.'},
    null:{title:'null',detail:'Indica l’assenza di un oggetto o valore.'},
    '@export':{title:'@export',detail:'Espone una variabile all’Inspector di Godot per poterla modificare senza riscrivere lo script.'},
    '@onready':{title:'@onready',detail:'Inizializza una variabile quando il nodo è pronto, spesso per ottenere altri nodi della scena.'},
    connect:{title:'.connect(...)',detail:'Collega un segnale a una funzione che verrà chiamata quando il segnale viene emesso.'},
    emit:{title:'.emit(...)',detail:'Emette un segnale per avvisare gli altri nodi che qualcosa è accaduto.'},
    new:{title:'.new(...)',detail:'Crea una nuova istanza di una classe.'}
  };
  function explainAt(source, offset, {strict=false}={}) {
    const text=String(source||'');
    if(!Number.isSafeInteger(offset)||offset<0||offset>text.length)return null;
    const begin=text.lastIndexOf('\n',Math.max(0,offset-1))+1;
    const endIndex=text.indexOf('\n',offset);
    const end=endIndex<0?text.length:endIndex;
    const line=text.slice(begin,end),column=offset-begin;
    if(column<0||column>line.length)return null;
    let quote=null,comment=-1,quotedStart=-1;
    const quoted=[];
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(quote){
        if(ch==='\\'){i++;continue;}
        if(ch===quote){quoted.push([quotedStart,i+1]);quote=null;}
      }else if(ch==='"'||ch==="'"){quote=ch;quotedStart=i;}
      else if(ch==='#'){comment=i;break;}
    }
    if(quote)quoted.push([quotedStart,line.length]);
    const tokens=[...line.matchAll(/[$@]?[A-Za-z_]\w*|#/g)];
    let token=tokens.find(t=>t.index<=column&&column<t.index+t[0].length);
    if(!strict&&!token&&column>0)token=tokens.find(t=>t.index+t[0].length===column);
    if(!token)return null;
    const word=token[0],pos=token.index;
    if(quoted.some(([a,b])=>pos>=a&&pos<b))return null;
    if(comment>=0&&pos>=comment){
      if(pos!==comment||word!=='#')return null;
      const item=analyze('# nota').find(i=>i.key==='comment');
      return Object.freeze({key:'comment',title:item.title,detail:item.detail,line:text.slice(0,begin).split('\n').length,word,start:begin+pos,end:begin+pos+1});
    }
    const trimmed=line.trimStart();
    const starts=word=>new RegExp('^(?:static\\s+)?'+word+'(?:\\s|\\(|:|$)').test(trimmed);
    let key=null;
    if((word==='extends'||/^\s*extends\s+\w+/.test(line)&&new RegExp('\\b'+word+'\\b').test(line))&&/^extends\b/.test(trimmed))key='extends';
    else if((word==='func'||word==='_ready')&&/^(?:static\s+)?func\s+_ready\s*\(/.test(trimmed))key='ready';
    else if(word==='_init'&&/^(?:static\s+)?func\s+_init\s*\(/.test(trimmed))key='init';
    else if(word==='func'&&starts('func'))key='func';
    else if(word==='var'&&starts('var'))key='var';
    else if(word==='const'&&starts('const'))key='const';
    else if(word==='signal'&&starts('signal'))key='signal';
    else if((word==='class_name'||word==='class')&&starts(word))key=word;
    else if(word[0]==='$')key='nodepath';
    else if(word==='@export'||word==='@onready')key=word;
    else if(['connect','emit','new'].includes(word)&&pos>0&&line.slice(0,pos).trimEnd().endsWith('.'))key=word;
    else if(['if','elif','else','for','while','match','return','pass','break','continue'].includes(word)&&starts(word))key=word;
    else if(word==='await')key=word;
    else if(Object.prototype.hasOwnProperty.call(inlineBasics,word)){
      // Funzioni integrate riconoscibili anche prima di digitare le parentesi.
      if(['print','str','range','abs','min','max','clamp','round'].includes(word)&&
        !(new RegExp('\\b'+word+'\\b').test(line)))return null;
      key=word;
    }
    if(!key)return null;
    const detailed=analyze(line).find(item=>item.key===(key==='if'?'condition':key==='class_name'?'class':key==='@export'?'export':key==='@onready'?'onready':key));
    const basic=inlineBasics[key]||inlineBasics[word];
    const item=detailed||basic;
    if(!item)return null;
    return Object.freeze({
      key,title:item.title,detail:item.detail,word,
      line:text.slice(0,begin).split('\n').length,
      start:begin+pos,end:begin+pos+word.length
    });
  }
  root.GDHCodeGuide=Object.freeze({analyze,render,unseenKeys,explainAt});
})(typeof window!=='undefined'?window:globalThis);
