/* Percorsi multi-compito in tutti i 15 capitoli. Le verifiche eseguono
   soltanto Godot WebAssembly isolato: JavaScript controlla output e requisiti. */
(function(root){
  'use strict';
  const mk=(key,title,task,initialCode,solution,expectedOutput,requirements={},hints=[])=>({
    key,title,task,initialCode,solution,expectedOutput,requirements,
    hints:[
      {level:1,type:'concept',label:'Ragiona',text:hints[0]||'Rileggi la consegna e identifica cosa deve comparire nella console.'},
      {level:2,type:'structure',label:'Struttura',text:hints[1]||'Scrivi le istruzioni all’interno di _ready(), rispettando l’indentazione.'},
      {level:3,type:'example',label:'Esempio simile',text:hints[2]||'Prova prima una stampa più semplice, poi adatta il messaggio richiesto.'}
    ]
  });
  const custom={
    1:[
      mk('p2','Due messaggi',
        '<p>Scrivi <strong>due chiamate a <code>print()</code></strong> in <code>_ready()</code>: la prima deve mostrare <code>Pronto!</code>, la seconda <code>Si parte!</code>. Ogni messaggio va su una riga diversa.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    print("Pronto!")\n    print("Si parte!")\n',
        'Pronto!\nSi parte!',{minPrints:2},
        ['Ogni print() produce una riga di console.','Inserisci due print() indentati sotto _ready().','Un esempio: print("Uno") seguito da print("Due").']),
      mk('p3','Ripara una stampa',
        '<p>Il programma contiene una <strong>parentesi mancante</strong>. Correggi la riga affinché Godot stampi <code>Porta aperta</code> senza errori.</p>',
        'func _ready():\n    print("Porta aperta"\n',
        'func _ready():\n    print("Porta aperta")\n',
        'Porta aperta',{},
        ['Osserva come si chiude una chiamata a funzione.','print() deve avere una parentesi aperta e una chiusa.','Esempio: print("Messaggio").']),
      mk('p4','Tre righe in autonomia',
        '<p>Partendo dal blocco vuoto, stampa nell’ordine <code>Benvenuto!</code>, <code>Buona avventura!</code> e <code>Fine messaggio</code>. Usa <strong>tre chiamate distinte</strong> a <code>print()</code>.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    print("Benvenuto!")\n    print("Buona avventura!")\n    print("Fine messaggio")\n',
        'Benvenuto!\nBuona avventura!\nFine messaggio',{minPrints:3},
        ['La console deve avere tre righe, nell’ordine indicato.','Usa tre istruzioni print() con testo tra virgolette.','Esempio: print("Inizio"), print("Centro"), print("Fine").'])
    ],
    2:[
      mk('p2','Commenta una istruzione',
        '<p>Il programma stampa già <code>Porta aperta</code>. Aggiungi <strong>prima della stampa</strong> un commento che spieghi cosa accade. Non modificare il messaggio.</p>',
        'func _ready():\n    print("Porta aperta")\n',
        'func _ready():\n    # Comunica l’apertura della porta\n    print("Porta aperta")\n',
        'Porta aperta',{commentBeforePrint:true},
        ['Un commento serve a spiegare il codice, non appare in console.','Scrivi una riga che inizia con # prima di print().','Esempio: # Avvia il sistema, seguito da print("Avvio").']),
      mk('p3','Disattiva il debug',
        '<p>La console non deve più mostrare <code>Debug</code>. <strong>Commenta</strong> quella chiamata a <code>print()</code> senza cancellarla, lasciando soltanto <code>Avvio</code> nell’output.</p>',
        'func _ready():\n    print("Debug")\n    print("Avvio")\n',
        'func _ready():\n    # print("Debug")\n    print("Avvio")\n',
        'Avvio',{commentedText:'print("Debug")'},
        ['Un commento può disattivare temporaneamente una riga.','Inserisci # davanti a print("Debug"), lasciando la riga nel file.','Esempio: # print("Test") non viene eseguito.']),
      mk('p4','Documenta un avvio',
        '<p>Scrivi <strong>un commento descrittivo prima delle stampe</strong>, poi mostra nell’ordine <code>Inventario caricato</code> e <code>Gioco pronto</code> con due <code>print()</code>.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    # Prepara la partita\n    print("Inventario caricato")\n    print("Gioco pronto")\n',
        'Inventario caricato\nGioco pronto',{commentBeforePrint:true,minPrints:2},
        ['I commenti chiariscono l’intenzione delle istruzioni.','Scrivi # ... e poi due print() sulla riga successiva.','Esempio: # Carica scena seguito da print("Scena pronta").'])
    ],
    3:[
      mk('p2','Stampa un punteggio',
        '<p>Stampa <code>Punti</code> e sulla riga successiva il <strong>numero intero 7 senza virgolette</strong>.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    print("Punti")\n    print(7)\n',
        'Punti\n7',{minPrints:2,numericPrints:[7]},
        ['Testo e numeri sono tipi diversi.','Il testo va tra virgolette, il numero no.','Esempio: print("Livello") e print(2).']),
      mk('p3','Correggi il tipo',
        '<p>Il programma mostra già <code>Vite</code> e <code>3</code>, ma il secondo valore è una <strong>stringa</strong>. Modificalo affinché il numero <code>3</code> venga passato a <code>print()</code> come intero, non come testo.</p>',
        'func _ready():\n    print("Vite")\n    print("3")\n',
        'func _ready():\n    print("Vite")\n    print(3)\n',
        'Vite\n3',{minPrints:2,numericPrints:[3]},
        ['La console può sembrare identica anche con tipi diversi.','Togli le virgolette dal valore numerico.','print(5) passa un numero, print("5") passa testo.']),
      mk('p4','Report numerico',
        '<p>Prepara un report di quattro righe: <code>Monete</code>, il <strong>numero 12</strong>, <code>Chiavi</code>, il <strong>numero 2</strong>. Usa quattro <code>print()</code>, senza virgolette sui numeri.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    print("Monete")\n    print(12)\n    print("Chiavi")\n    print(2)\n',
        'Monete\n12\nChiavi\n2',{minPrints:4,numericPrints:[12,2]},
        ['Alterna etichette di testo e valori numerici.','Servono quattro print() e i due numeri senza virgolette.','Esempio: print("Vite") seguito da print(3).'])
    ],
    4:[
      mk('p1','Attiva la radio',
        '<p>Completa il terminale radio mantenendo le righe iniziale e finale. Inserisci al centro <code>Segnale: OK</code>, così la console mostrerà le <strong>tre righe nell’ordine indicato</strong>.</p>',
        'extends Node\n\nfunc _ready():\n    print("=== RADIO ===")\n    \n    print("=== FINE ===")\n',
        'extends Node\n\nfunc _ready():\n    print("=== RADIO ===")\n    print("Segnale: OK")\n    print("=== FINE ===")\n',
        '=== RADIO ===\nSegnale: OK\n=== FINE ===',{minPrints:3},
        ['Il messaggio nuovo va fra i due delimitatori.','Inserisci un print() tra le due righe già presenti.','Esempio: print("=== INIZIO ==="), print("Test"), print("=== FINE ===").']),
      mk('p2','Batteria con argomenti multipli',
        '<p>Stampa <code>Batteria: 75%</code> usando <strong>un solo <code>print()</code> con tre argomenti</strong>: il testo <code>"Batteria: "</code>, il numero <code>75</code> e il simbolo <code>"%"</code>.</p>',
        'func _ready():\n    pass\n',
        'func _ready():\n    print("Batteria: ", 75, "%")\n',
        'Batteria: 75%',{minPrints:1,multiArgs:true,numericArgument:75},
        ['print() può ricevere più valori separati da virgole.','Metti testo, numero e simbolo % nella stessa chiamata.','Esempio: print("Vite: ", 3, " disponibili").']),
      mk('p3','Rapporto della navetta',
        '<p>Prepara il rapporto finale tra i delimitatori già presenti. Inserisci <code>Motore: OK</code> e <code>Batteria: 80%</code>, stampando la batteria con <strong>tre argomenti</strong> nella stessa chiamata.</p>',
        'extends Node\n\nfunc _ready():\n    print("=== RAPPORTO ===")\n    \n    print("=== FINE RAPPORTO ===")\n',
        'extends Node\n\nfunc _ready():\n    print("=== RAPPORTO ===")\n    print("Motore: OK")\n    print("Batteria: ", 80, "%")\n    print("=== FINE RAPPORTO ===")\n',
        '=== RAPPORTO ===\nMotore: OK\nBatteria: 80%\n=== FINE RAPPORTO ===',{minPrints:4,multiArgs:true,numericArgument:80},
        ['Il rapporto deve avere quattro righe.','Aggiungi le due istruzioni prima della stampa finale.','Esempio: print("Energia: ", 50, "%") usa tre argomenti.'])
    ]
  };
  // Esercizio 101, aggiunto successivamente nel Capitolo 1: era escluso
  // dal pilota e non aveva il percorso multi-compito.
  custom[101]=[
    mk('p2','L’ordine degli eventi',
      '<p>Godot esegue le istruzioni di <code>_ready()</code> nell’ordine. Completa il codice con due messaggi distinti: prima <code>Collegamento avviato</code>, poi <code>Collegamento pronto</code>.</p>',
      'extends Node\n\nfunc _ready():\n    # Scrivi i due passaggi in ordine\n    pass\n',
      'extends Node\n\nfunc _ready():\n    print("Collegamento avviato")\n    print("Collegamento pronto")\n',
      'Collegamento avviato\nCollegamento pronto',{minPrints:2},
      ['_ready() contiene il codice che parte quando il nodo è pronto.','Usa due print() nello stesso blocco.','L’ordine nel codice determina quello della console.']),
    mk('p3','Ripara l’indentazione',
      '<p>Lo script contiene una chiamata <code>print()</code> fuori dal blocco della funzione. Spostala dentro <code>_ready()</code> per visualizzare <code>Motore attivo</code>.</p>',
      'extends Node\n\nfunc _ready():\n    pass\nprint("Motore attivo")\n',
      'extends Node\n\nfunc _ready():\n    print("Motore attivo")\n',
      'Motore attivo',{},
      ['Una istruzione non può trovarsi a livello globale.','Le istruzioni della funzione sono indentate.','Sposta print() dopo la dichiarazione di _ready().']),
    mk('p4','Sequenza di diagnostica',
      '<p>Completa la diagnostica con tre righe: <code>Avvio</code>, <code>Controllo</code>, <code>Completato</code>. Usa tre istruzioni di stampa separate in <code>_ready()</code>.</p>',
      'extends Node\n\nfunc _ready():\n    # Completa la diagnostica\n    pass\n',
      'extends Node\n\nfunc _ready():\n    print("Avvio")\n    print("Controllo")\n    print("Completato")\n',
      'Avvio\nControllo\nCompletato',{minPrints:3},
      ['Ogni print() crea una riga.','Scrivi tre stampe nel blocco di _ready().','Controlla anche l’ordine dei messaggi.'])
  ];
  const extraFor=lesson=>custom[lesson?.id] ||
    root.GDHPracticeCatalog?.tasksFor(lesson) || [];
  const enabled=id=>Boolean(custom[id]||
    (root.LESSONS_DATA||[]).some(l=>l.id===id && !l.isQuiz && l.chapterId>=2 && l.chapterId<=15));
  const tasksFor=lesson=>{
    if(!lesson||!enabled(lesson.id)||lesson.isQuiz)return [];
    const extra=extraFor(lesson);
    if(extra.length!==3)throw Error('Compiti didattici mancanti per la lezione '+lesson.id);
    const original={
      key:'base',title:lesson.isMastery?'Diagnostica finale':'Prima applicazione',
      task:lesson.task,initialCode:lesson.initialCode,solution:lesson.solution,
      expectedOutput:lesson.expectedOutput,hints:lesson.hints,nativeOriginal:true
    };
    return lesson.isMastery?[...extra,original]:[original,...extra];
  };
  const getTask=(id,key)=>{
    const lesson=(root.LESSONS_DATA||[]).find(l=>l.id===id);
    return tasksFor(lesson).find(t=>t.key===key)||null;
  };
  const grade=(task,code,output)=>{
    const expected=String(task.expectedOutput||'').split('\n');
    const actual=String(output||'').trimEnd().split(/\r?\n/).filter(Boolean);
    const checks=[{desc:'Output Godot corretto e nell’ordine richiesto',
      passed:actual.length===expected.length&&actual.every((line,i)=>line===expected[i]),
      diff:actual.join('\n')===expected.join('\n')?null:
        'Atteso:\n'+expected.join('\n')+'\nOttenuto:\n'+(actual.join('\n')||'(nessun output)')}];
    const req=task.requirements||{};
    const source=String(code||'');
    const ready=source.match(/^\s*func\s+_ready\s*\([^)]*\)\s*:\s*\n((?:[ \t]+[^\n]*(?:\n|$)|\s*\n)*)/m)?.[1]||'';
    const active=ready.split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
    const masked=active.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'""');
    const count=(masked.match(/\bprint\s*\(/g)||[]).length;
    if(req.minPrints)checks.push({desc:'Numero di chiamate print() richiesto',
      passed:count>=req.minPrints});
    if(req.commentBeforePrint){
      const firstPrint=ready.search(/^\s*print\s*\(/m);
      const has=firstPrint>=0&&ready.slice(0,firstPrint).split('\n')
        .some(line=>/^\s*#\s*\S/.test(line));
      checks.push({desc:'Commento scritto prima delle stampe',passed:has});
    }
    if(req.commentedText){
      const commented=ready.split('\n').some(line=>
        /^\s*#/.test(line)&&line.includes(req.commentedText));
      checks.push({desc:'Istruzione di debug conservata come commento',passed:commented});
    }
    for(const n of req.numericPrints||[]){
      const found=new RegExp('\\bprint\\s*\\(\\s*'+n+'\\s*\\)').test(masked);
      checks.push({desc:'Il valore '+n+' è stampato come numero, non come stringa',passed:found});
    }
    if(req.multiArgs){
      const calls=active.match(/\bprint\s*\([^\n)]*\)/g)||[];
      const multi=calls.some(call=>(call.match(/,/g)||[]).length>=2);
      checks.push({desc:'Stampa con più argomenti separati da virgole',passed:multi});
    }
    if(req.numericArgument!==undefined){
      const calls=active.match(/\bprint\s*\([^\n)]*\)/g)||[];
      const numeric=calls.some(call=>new RegExp(',\\s*'+req.numericArgument+'\\s*,').test(call));
      checks.push({desc:'Numero '+req.numericArgument+' passato come argomento numerico',passed:numeric});
    }
    // Controlla il costrutto didattico nella sorgente originale, togliendo i
    // commenti: un commento che cita "if" o "append" non supera la prova.
    const executable=source.replace(/#[^\n]*/g,'');
    for(const pattern of req.mustUse||[]){
      const valid=new RegExp(pattern).test(executable);
      checks.push({desc:'Costrutto GDScript previsto dalla consegna',passed:valid,
        diff:valid?null:'Il codice produce l’output, ma manca un costrutto richiesto: rileggi la consegna e gli indizi.'});
    }
    return checks;
  };
  const mergeProgress=(left,right)=>{
    const merged={...left};
    for(const [id,incoming] of Object.entries(right||{})){
      if(!enabled(Number(id))||!incoming||typeof incoming!=='object')continue;
      const existing=merged[id]||{};
      const lesson=(root.LESSONS_DATA||[]).find(l=>l.id===Number(id));
      const keys=new Set(tasksFor(lesson).map(t=>t.key));
      const completed=[...new Set([...(existing.completed||[]),...(incoming.completed||[])])]
        .filter(key=>keys.has(key));
      const codes={...(existing.codes||{}),...(incoming.codes||{})};
      const next=tasksFor(lesson).findIndex(t=>!completed.includes(t.key));
      const activeIndex=next===-1?tasksFor(lesson).length-1:next;
      merged[id]={completed,codes,activeIndex};
    }
    return merged;
  };
  root.LessonPractice=Object.freeze({enabled,tasksFor,getTask,grade,mergeProgress});
})(typeof window!=='undefined'?window:globalThis);
