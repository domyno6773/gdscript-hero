/* Lezioni 90–97: sfide su cicli, funzioni, array e stringhe.
 * Esegue tutti i casi attraverso Godot; non assegna XP con un esempio solo.
 */
(() => {
  'use strict';
  const data=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(!v||data.length!==235)throw Error('Manuale non inizializzato');
  const lesson=n=>{
    const found=data.find(x=>x.manualLessonNumber===n);
    if(!found)throw Error('Lezione mancante: '+n);
    return found;
  };
  const noComment=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
  const all=(...patterns)=>source=>patterns.every(re=>re.test(noComment(source)));
  const set=(n,arr,test)=>{
    if(!arr.length)throw Error('Senza casi: '+n);
    const l=lesson(n);
    l.validationReady=true;
    l.manualSourceCheck=test;
    v.expectedCases[n]=arr;
    l.expectedOutput=arr[0].output;
  };
  const patch=(n,code)=>{
    const l=lesson(n);
    l.initialCode=code;l.starterCode=code;
    l.sourceFiles={...l.sourceFiles,'main.gd':code};
  };
  patch(90,[
    'extends Node','',
    'func _ready():',
    '    var n = int(OS.read_string_from_stdin())',
    '    # Stampa la piramide piatta: 1, 3, 5 ... fino a n asterischi.',
    '    pass'
  ].join('\n'));
  const pyramid=n=>Array.from({length:(n+1)/2},(_,i)=>'*'.repeat(i*2+1)).join('\n');
  set(90,[1,5,7,9].map(n=>({name:'Piramide di '+n,
    stdin:[String(n)],output:pyramid(n)})),
  all(/\bfor\b|\bwhile\b/,/\*/,/OS\.read_string_from_stdin\s*\(/));

  patch(91,[
    'extends Node','',
    'func find_occurrences(text, pattern):',
    '    # Conta anche le occorrenze che si sovrappongono.',
    '    pass','','func _ready():',
    '    var text = OS.read_string_from_stdin()',
    '    var pattern = OS.read_string_from_stdin()',
    '    var result = find_occurrences(text, pattern)',
    '    print(result)'
  ].join('\n'));
  const occurrences=(text,pattern)=>{
    const positions=[];
    for(let i=0;i+pattern.length<=text.length;i++)
      if(text.slice(i,i+pattern.length)===pattern)positions.push(i);
    return '['+String(positions.length>0)+', '+positions.length+', ['+
      positions.join(', ')+']]';
  };
  const overlap=[
    ['abababab','aba'],['aaaaa','aa'],['banana','ana'],
    ['abcdef','xyz'],['Godot','Godot']
  ];
  set(91,overlap.map(([text,pattern])=>({name:'Cerca '+pattern,
    stdin:[text,pattern],output:occurrences(text,pattern)})),
  all(/\bfunc\s+find_occurrences\s*\(/,/\breturn\b/,
    /\bfor\b|\bwhile\b/,/\bpattern\b/));

  patch(92,[
    'extends Node','','func _ready():',
    '    var prices: Array[int] = []',
    '    for price in OS.read_string_from_stdin().split(","):',
    '        prices.append(int(price))',
    '    var items = OS.read_string_from_stdin().split(",")',
    '    var budget_per_item = int(OS.read_string_from_stdin())','',
    '    var affordable_items: Array[String] = []',
    '    var cant_afford = 0',
    '    var total_needed = 0','',
    '    # Aggiorna affordable_items, total_needed e cant_afford.','',
    '    print("Può acquistare: ", affordable_items)',
    '    print("Budget totale necessario: ", total_needed)',
    '    print("Acquisto non possibile: ", cant_afford)'
  ].join('\n'));
  const affordable=(prices,items,budget)=>{
    const chosen=prices.flatMap((price,i)=>price<=budget?[items[i]]:[]);
    const sum=prices.reduce((a,price)=>a+(price<=budget?price:0),0);
    return 'Può acquistare: ['+chosen.map(x=>JSON.stringify(x)).join(', ')+']\n'+
      'Budget totale necessario: '+sum+'\nAcquisto non possibile: '+(prices.length-chosen.length);
  };
  const baskets=[
    [[10,25,5,15],['martello','saw','chiodi','brush'],12],
    [[7,14,8],['pane','riso','acqua'],10],
    [[15,16],['x','y'],0],
    [[4,2,3],['a','b','c'],4]
  ];
  set(92,baskets.map(([prices,items,budget])=>({name:'Budget '+budget,
    stdin:[prices.join(','),items.join(','),String(budget)],
    output:affordable(prices,items,budget)})),
    all(/\bfor\b/,/\bbudget_per_item\b/,/\baffordable_items\.append\s*\(/,
      /\btotal_needed\b/,/\bcant_afford\b/));

  const titleCase=s=>s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const players=[['shadow_fox','420'],['night_owl','7'],['leo','123456'],['code_master','90']];
  set(93,players.map(([name,score])=>({
    name:'Giocatore '+name,stdin:[name,score],
    output:[titleCase(name),[...name].reverse().join(''),name.slice(0,3).toUpperCase(),
      score.padStart(6,'0')].join('\n')
  })),all(/\.capitalize\s*\(/,/\.reverse\s*\(/,
    /\.to_upper\s*\(/,/\.lpad\s*\(/));

  const validEmail=s=>(s.split('@').length===2&&!s.startsWith('@')&&!s.includes(' ')&&
    ['.com','.org','.tech'].some(x=>s.toLowerCase().endsWith(x)));
  const mails=[
    'alice@ESEMPIO.TECH','mario@example.com','test@domain.Org','invalid',
    '@esempio.com','a@@b.com','a b@site.com','a@site.net'
  ];
  set(94,mails.map(email=>({name:'Controllo email',
    stdin:[email],output:validEmail(email)?'valido':'non valido'})),
    all(/\bemail\b/,/\bif\b|\bmatch\b/,
      /\.to_lower\s*\(|\.to_upper\s*\(|\.to_lower\s*\(\s*\)/));

  // Il PDF dava come esempio «Godot è divertente?» ma richiedeva
  // «godot-e-divertente», senza indicare la rimozione dell'accento.
  // Rendiamo esplicito il quinto passaggio, conservando l'esempio.
  const slugLesson=lesson(95);
  slugLesson.task=slugLesson.task.replace(
    '4. Rimuovi ogni !, ? e.',
    '4. Rimuovi ogni !, ? e.\n\n5. Sostituisci la lettera «è» con «e», per ottenere lo slug previsto nell’esempio.'
  );
  const slug=s=>s.trim().toLowerCase().replace(/ /g,'-')
    .replace(/[!?.]/g,'').replace(/è/g,'e');
  const titles=['  Godot è divertente?  ','Il mio gioco!','  Un livello semplice.  ',
    'Ciao? No!','Come si fa è facile'];
  set(95,titles.map(title=>({name:'Slug da titolo',
    stdin:[title],output:slug(title)})),
    all(/\.strip_edges\s*\(/,/\.to_lower\s*\(/,
      /\.replace\s*\(/));

  const splitSamples=[
    'red, green,blue',' uno, banana,  casa','ant,cat,dog',
    'scatola, geco, poltrona'
  ];
  const threeLines=text=>{
    const words=text.split(',').map(x=>x.trim());
    const longest=words.reduce((max,x)=>x.length>max.length?x:max,'');
    return words.length+'\n'+words.map(x=>x.toUpperCase()).join(' > ')+'\n'+longest;
  };
  set(96,splitSamples.map(text=>({name:'Parole separate da virgola',
    stdin:[text],output:threeLines(text)})),
    all(/\.split\s*\(/,/\.strip_edges\s*\(/,
      /\.to_upper\s*\(/,/\.join\s*\(/));

  // Corregge il messaggio inglese residuale mantenendo l'esito richiesto.
  const usernameLesson=lesson(97);
  usernameLesson.task=usernameLesson.task.replace(
    /altrimenti stampa bad\./,'altrimenti stampa non valido.'
  );
  const userOk=s=>{
    const name=s.trim().toLowerCase();
    return name.length>=3&&name.length<=16&&!name.includes(' ')&&
      !/^[0-9]/.test(name)&&!/[!?.]/.test(name);
  };
  const usernames=[
    '  Alice42  ','abc','ab','1utente','il mio nome','utente!',
    'NomeValido123456','NomeLunghissimo123','x_y'
  ];
  set(97,usernames.map(raw=>({name:'Convalida nome utente',stdin:[raw],
    output:userOk(raw)?'ok: '+raw.trim().toLowerCase():'non valido'})),
    all(/\.strip_edges\s*\(/,/\.to_lower\s*\(/,
      /\bif\b|\bmatch\b/));
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    90:['5'],91:['abababab','aba'],92:['10,25,5,15','martello,saw,chiodi,brush','12'],
    93:['shadow_fox','420'],94:['alice@ESEMPIO.TECH'],
    95:['  Godot è divertente?  '],96:['red, green,blue'],97:['  Alice42  ']
  });
  window.GDHManualMigration.validated=data.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
