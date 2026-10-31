/* Ramo di migrazione: il catalogo del PDF è completo, ma la pubblicazione è bloccata
 * finché ogni esercizio non dispone di una verifica reale e, quando necessario,
 * di input da tastiera e progetto Godot multi-file.
 */
(() => {
  'use strict';
  const raw = window.GDHManualCourse;
  if (!Array.isArray(raw) || raw.length !== 235 || raw.some((x, i) => x.id !== i + 1))
    throw new Error('Il manuale revisionato non contiene 235 lezioni in ordine.');

  const chapters = [
    'Introduzione','Variabili Parte 1','Variabili Parte 2','Operatori Parte 1',
    'Operatori - Parte 2','Strutture decisionali','Input/Output di base',
    'Calcolatore per dividere il conto','Cicli','Funzioni','FizzBuzz con una variante',
    'Nozioni di base sugli array','Iterare sugli array','Array: approfondimenti',
    'Dizionari','Registro giornaliero delle spese','Sfide finali',
    'Stringhe in dettaglio','Decisioni avanzate','Array multidimensionali',
    'Dizionari - Parte 2','Applicazione Rubrica','Insiemi con i dizionari',
    'Enumerazioni','Gestione dei registri degli studenti',
    'Aggregazione avanzata dei dati','Funzioni avanzate','Funzioni di ordine superiore',
    'Gestione di base degli errori','Sistema di gestione dell’inventario','Le sfide finali',
    'Fondamenti della programmazione orientata agli oggetti','Proprietà delle classi',
    'Ereditarietà','Polimorfismo','Incapsulamento','Metodi speciali','Segnali',
    'Concetti avanzati di OOP','Modelli di progettazione, parte 1',
    'Pattern di progettazione, parte 2','Progetto: Gestione della biblioteca','Sfide finali'
  ];
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const paragraphs=s=>String(s||'').split(/\n\s*\n/).filter(Boolean)
    .map(p=>'<p>'+esc(p.trim()).replace(/\n/g,'<span> </span>')+'</p>').join('');
  // Conserva i nomi dei file originari: una semplice textarea non può sostituire
  // i progetti multi-file previsti dai capitoli avanzati.
  const splitFiles=source=>{
    const files={};let name=null,lines=[];
    const flush=()=>{if(name)files[name]=lines.join('\n').replace(/\s+$/,'');};
    for(const line of String(source).split('\n')){
      const m=/^\s*([A-Za-z_][\w-]*\.gd)\s*$/.exec(line);
      if(m){flush();name=m[1];lines=[];}
      else if(name)lines.push(line);
    }
    flush();
    // Rimuove il margine del PDF: 2 spazi per i top-level, 8 per ogni blocco.
    for (const [name, source] of Object.entries(files)) {
      const lines=source.split('\n');
      const fromPdf=lines.some(line=>/^ {2}(?:extends |class_name |@abstract|func |static func )/.test(line));
      if(!fromPdf)continue;
      files[name]=lines.map(line=>{
        if(!line.trim())return '';
        const margin=(line.match(/^ */)||[''])[0].length;
        if(margin<2)return line;
        return ' '.repeat(Math.max(0,Math.round((margin-2)/8)*4))+line.slice(margin);
      }).join('\n');
    }
    return files;
  };
  const starters={
    1:'extends Node\n\nfunc _ready():\n    print("Ciao GDScript!")\n',
    2:'extends Node\n\nfunc _ready():\n    # Scrivi il tuo messaggio tra le virgolette\n    print("")\n',
    3:'extends Node\n\nfunc _ready():\n    print("Ciao!")\n    print("Arrivederci!")\n',
    4:'extends Node\n\nfunc _ready()\nprint("Pronto!")\nprint("Si parte!")\n',
    5:'extends Node\n\nfunc _ready():\n    # Crea qui le variabili coins e speed\n    print("coins = ", coins)\n    print("speed = ", speed)\n',
    6: `extends Node\n\nfunc _ready():\n    # Crea qui la variabile coddy\n    print('coddy = "', coddy, '"')\n`,
    7:'extends Node\n\nfunc _ready():\n    # Crea qui le variabili is_alive e has_key\n    print("is_alive = ", is_alive)\n    print("has_key = ", has_key)\n',
    8:'extends Node\n\nfunc _ready():\n    # Crea la variabile weapon con il valore null\n    print("weapon = ", weapon)\n    # Memorizza "Spada" in weapon\n    print("weapon = ", weapon)\n'
  };
  const expected={
    1:'Ciao GDScript!',2:'Ciao mondo!',3:'Ciao!',4:'Pronto!\nSi parte!',
    5:'coins = 25\nspeed = 3.5',6:'coddy = "Sto imparando a programmare con GDScript!"',
    7:'is_alive = true\nhas_key = false',8:'weapon = <null>\nweapon = Spada'
  };
  const proof={
    1:s=>/print\s*\(\s*["']Ciao GDScript!["']\s*\)/.test(s),
    2:s=>/print\s*\(\s*["']Ciao mondo!["']\s*\)/.test(s),
    3:s=>/^\s*#\s*print\s*\(\s*["']Arrivederci!["']\s*\)/m.test(s),
    4:s=>/func\s+_ready\s*\(\s*\)\s*:/.test(s)&&
      /^\s+print\s*\(\s*["']Pronto!["']\s*\)/m.test(s)&&
      /^\s+print\s*\(\s*["']Si parte!["']\s*\)/m.test(s),
    5:s=>/\bvar\s+coins(?:\s*:\s*int)?\s*(?::=|=)\s*25\b/.test(s)&&
      /\bvar\s+speed(?:\s*:\s*float)?\s*(?::=|=)\s*3\.5\b/.test(s),
    6:s=>/\bvar\s+coddy(?:\s*:\s*String)?\s*(?::=|=)\s*["']Sto imparando a programmare con GDScript!["']/.test(s),
    7:s=>/\bvar\s+is_alive(?:\s*:\s*bool)?\s*(?::=|=)\s*true\b/.test(s)&&
      /\bvar\s+has_key(?:\s*:\s*bool)?\s*(?::=|=)\s*false\b/.test(s),
    8:s=>/\bvar\s+weapon\s*=\s*null\b/.test(s)&&/\bweapon\s*=\s*["']Spada["']/.test(s)
  };
  const validate=(id)=>async result=>{
    if(!proof[id])return [{desc:'Validatore didattico non ancora pronto',passed:false,
      diff:'L’attività esiste nel manuale ma necessita di test specifici prima della pubblicazione.'}];
    const source=String(result?.code||'');
    const actual=(result?.logs||[]).map(x=>String(x).trim()).join('\n').trim();
    return [
      {desc:'Esecuzione nel motore Godot',passed:result?.success===true,
        diff:result?.success?null:(result?.error||'Il codice non si avvia')},
      {desc:'Istruzioni richieste dalla consegna',passed:proof[id](source),
        diff:proof[id](source)?null:'Controlla le operazioni richieste dalla consegna'},
      {desc:'Risultato previsto',passed:actual===expected[id],
        diff:actual===expected[id]?null:'Atteso:\n'+expected[id]+'\nRicevuto:\n'+actual}
    ];
  };
  const result=raw.map(item=>{
    const files=splitFiles(item.files),n=item.id;
    // La revisione editoriale aveva tradotto per errore questo identificatore:
    // la consegna parla di coins_each e il codice deve utilizzare lo stesso nome.
    if(n===16&&files['main.gd'])
      files['main.gd']=files['main.gd'].replace(/\bmonete_each\b/g,'coins_each');
    const starter=starters[n]??files['main.gd']??'';
    return {
      id:10000+n, manualLessonNumber:n, displayIndex:n,
      title:n+'. '+item.title, chapterId:item.chapterId,
      conceptId:'manual_chapter_'+item.chapterId,
      conceptTags:['manual_235','chapter_'+item.chapterId],
      icon:'', xp:50,isMastery:false,isQuiz:false,practiceMode:'focused',
      theory:paragraphs(item.theory),task:paragraphs(item.exercise),
      initialCode:starter,starterCode:starter,solution:'',
      expectedOutput:expected[n]||'',
      hints:[{level:1,type:'concept',label:'Rileggi la consegna',
        text:'Segui la consegna del manuale e completa solo le parti lasciate allo studente.'}],
      sourceFiles:files,requiresMultipleFiles:Object.keys(files).length>1,
      requiresStdin:/OS\.read_string_from_stdin\(\)/.test(item.files)||
        /\b(?:input|leggi|leggere|acquisisci)\b/i.test(item.exercise),
      validationReady:Boolean(proof[n]),validate:validate(n)
    };
  });
  CHAPTERS_DATA.splice(0,CHAPTERS_DATA.length,...chapters.map((title,i)=>{
    const part=i<17?'Fondamenti':i<31?'Logica e flusso':'Programmazione orientata agli oggetti';
    return{id:i+1,title:'Capitolo '+(i+1)+': '+title,badge:'CAPITOLO '+(i+1),
      desc:part+' • Programma del manuale GDScript',icon:''};
  }));
  LESSONS_DATA.splice(0,LESSONS_DATA.length,...result);
  if(typeof CONCEPTS_CATALOG!=='undefined'){
    Object.keys(CONCEPTS_CATALOG).forEach(k=>delete CONCEPTS_CATALOG[k]);
    chapters.forEach((name,i)=>{
      const id='manual_chapter_'+(i+1);
      CONCEPTS_CATALOG[id]={id,name,chapterId:i+1,desc:'Lezioni e prove del manuale revisionato.'};
    });
  }
  window.LESSONS_DATA=LESSONS_DATA;
  window.CHAPTERS_DATA=CHAPTERS_DATA;
  window.GDHManualMigration={
    total:result.length,chapters:chapters.length,
    validated:result.filter(x=>x.validationReady).length,
    needsInput:result.filter(x=>x.requiresStdin).length,
    needsMultifile:result.filter(x=>x.requiresMultipleFiles).length,
    readyForRelease:false
  };
})();
