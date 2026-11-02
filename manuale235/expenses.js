/* Modulo del manuale, lezioni 82–89: inventario e registro spese.
 * I frammenti iniziali seguono esattamente il punto del progetto in cui
 * lo studente arriva: non anticipano la soluzione della lezione corrente.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(lessons.length!==235||!v)throw Error('Catalogo del manuale non caricato');
  const lesson=n=>{
    const result=lessons.find(x=>x.manualLessonNumber===n);
    if(!result)throw Error('Lezione mancante '+n);
    return result;
  };
  const patchStarter=(n,source)=>{
    const l=lesson(n);
    l.initialCode=source;
    l.starterCode=source;
    l.sourceFiles={...l.sourceFiles,'main.gd':source};
  };
  // Nel PDF italiano sono rimasti un valore inglese, due intestazioni in
  // inglese e il refuso «bombee». Uniformiamo le stringhe visibili dello
  // stesso esercizio ai dati già presenti nello script («freccia»).
  const inventory=lesson(82);
  inventory.task=inventory.task
    .replace(/\barrow\b/g,'freccia')
    .replace(/\bUsed\b/g,'Usato')
    .replace(/\bItems:/g,'Articoli:')
    .replace(/\bbombee\b/g,'bomba')
    .replace(/\bbomb\b/g,'bomba');
  const inventoryCode=[
    'extends Node','',
    'func _ready():',
    '    var item = OS.read_string_from_stdin()',
    '    var amount = int(OS.read_string_from_stdin())',
    '    var used = OS.read_string_from_stdin()','',
    '    var inventory = {"pozione": 2, "freccia": 10}',
    '    # Aggiorna l’inventario, gestisci l’uso e stampa il riepilogo.'
  ].join('\n');
  patchStarter(82,inventoryCode);
  const getCode=n=>lesson(n).initialCode;
  const welcome='Benvenuto nel registro giornaliero delle spese!';
  const menu=[
    welcome,'','Menu:',
    '1. Aggiungi una nuova spesa',
    '2. Visualizza tutte le spese',
    '3. Calcola totale e media delle spese',
    '4. Cancella tutte le spese',
    '5. Esci'
  ].join('\n');
  const shutdown='Chiusura del registro delle spese. Arrivederci!';
  const added='Spesa aggiunta correttamente!';
  const empty='Nessuna spesa registrata.';
  const cleared='Tutte le spese sono state cancellate.';
  const invalid='Scelta non valida. Riprova.';
  const linesForMenu=[
    '    print("'+welcome+'")',
    '    print("\\nMenu:")',
    '    print("1. Aggiungi una nuova spesa")',
    '    print("2. Visualizza tutte le spese")',
    '    print("3. Calcola totale e media delle spese")',
    '    print("4. Cancella tutte le spese")',
    '    print("5. Esci")'
  ];
  const printExpense=[
    '        elif choice == "2":',
    '            if expenses.is_empty():',
    '                print("'+empty+'")',
    '            else:',
    '                print("Le tue spese:")',
    '                for i in range(expenses.size()):',
    '                    print(i + 1, ". ", expenses[i])'
  ];
  const totalExpense=[
    '        elif choice == "3":',
    '            if expenses.is_empty():',
    '                print("'+empty+'")',
    '            else:',
    '                var total = 0.0',
    '                for expense in expenses:',
    '                    total += expense',
    '                var average = total / expenses.size()',
    '                print("Totale delle spese: ", total)',
    '                print("Spesa media: ", average)'
  ];
  const clearExpense=[
    '        elif choice == "4":',
    '            expenses.clear()',
    '            print("'+cleared+'")'
  ];
  const makeStarter=n=>{
    if(n===83){
      return ['extends Node','','func _ready():',
        '    # Stampa il benvenuto, una riga vuota e il menu a cinque voci.',
        '    pass'].join('\n');
    }
    const src=['extends Node','','func _ready():',...linesForMenu];
    if(n===84){
      src.push('    # Aggiungi qui il ciclo while, la lettura e il controllo per uscire.');
      return src.join('\n');
    }
    if(n>=86)src.push('','    var expenses: Array[float] = []');
    src.push('','    while true:',
      '        var choice = OS.read_string_from_stdin()');
    if(n===85){
      src.push('        # Aggiungi il ramo per la scelta 1 e l’array expenses.',
        '        if choice == "5":',
        '            print("'+shutdown+'")',
        '            break');
      return src.join('\n');
    }
    src.push(
      '        if choice == "1":',
      '            var amount = float(OS.read_string_from_stdin())',
      '            expenses.append(amount)',
      '            print("'+added+'")'
    );
    if(n>=87)src.push(...printExpense);
    if(n>=88)src.push(...totalExpense);
    if(n>=89)src.push(...clearExpense);
    src.push('        # Completa il caso previsto da questa lezione.',
      '        elif choice == "5":',
      '            print("'+shutdown+'")',
      '            break');
    return src.join('\n');
  };
  for(let n=83;n<=89;n++)patchStarter(n,makeStarter(n));
  const outputMenu=(...messages)=>[menu,...messages].join('\n');
  const cases=v.expectedCases;
  const noComments=s=>String(s).split('\n').filter(l=>!/^\s*#/.test(l)).join('\n');
  const proof=(...rules)=>src=>rules.every(r=>r.test(noComments(src)));
  const inputRead=/OS\.read_string_from_stdin\s*\(\s*\)/;
  const define=(n,scenarios,sourceCheck)=>{
    if(!Array.isArray(scenarios)||!scenarios.length)throw Error('Scenari mancanti per '+n);
    const l=lesson(n);
    l.expectedOutput=scenarios[0].output||'';
    l.manualSourceCheck=sourceCheck;
    l.validationReady=true;
    cases[n]=scenarios.map(c=>({...c,preserveEmptyLines:true}));
  };
  const makeInventory=(item,amount,used)=>{
    const items=new Map([['pozione',2],['freccia',10]]);
    items.set(item,(items.get(item)||0)+amount);
    const messages=[];
    if(items.has(used)){
      items.set(used,items.get(used)-1);
      if(items.get(used)===0)items.delete(used);
      messages.push('Usato '+used);
    }else messages.push('Non possiedi '+used);
    messages.push('Articoli: '+items.size);
    for(const [key,value] of items)messages.push(key+': '+value);
    return messages.join('\n');
  };
  const inventoryTests=[
    ['freccia',5,'pozione'],
    ['gem',3,'bomba'],
    ['gem',1,'gem'],
    ['freccia',0,'freccia'],
    ['pozione',1,'pozione'],
    ['arco',4,'mappa']
  ];
  define(82,inventoryTests.map(([item,amount,used])=>({
    name:'Raccolta e uso: '+item+' / '+used,
    stdin:[item,String(amount),used],output:makeInventory(item,amount,used)
  })),proof(/\binventory\b/,/\bamount\b/,/\bused\b/,
    /(?:\binventory\s*\[|\binventory\.get\s*\()/,
    /(?:\binventory\.has\s*\(|\bused\s+in\s+inventory\b)/,
    /\binventory\.erase\s*\(/,/\bprint\s*\(/));
  define(83,[{
    name:'Messaggio e menu completo',stdin:[],output:menu
  }],proof(/print\s*\(\s*["']Benvenuto nel registro giornaliero delle spese!["']\s*\)/,
    /\\nMenu:/,/\bprint\s*\(/));
  define(84,[
    {name:'Uscita immediata',stdin:['5'],output:outputMenu(shutdown)},
    {name:'Ignora scelte diverse',stdin:['2','9','5'],output:outputMenu(shutdown)}
  ],proof(/\bwhile\s+true\s*:/,inputRead,
    /\bif\s+choice\s*==\s*["']5["']\s*:/,/\bbreak\b/));
  define(85,[
    {name:'Una spesa',stdin:['1','12.5','5'],output:outputMenu(added,shutdown)},
    {name:'Due spese',stdin:['1','10','1','20','5'],
      output:outputMenu(added,added,shutdown)},
    {name:'Senza spese',stdin:['5'],output:outputMenu(shutdown)}
  ],proof(/var\s+expenses\s*:\s*Array\s*\[\s*float\s*\]\s*=\s*\[\s*\]/,
    /\bwhile\s+true\s*:/,/\bif\s+choice\s*==\s*["']1["']\s*:/,
    /\bexpenses\.append\s*\(/,/\belif\s+choice\s*==\s*["']5["']\s*:/));
  define(86,[
    {name:'Spese non ancora registrate',stdin:['2','5'],
      output:outputMenu(empty,shutdown)},
    {name:'Visualizza una spesa',stdin:['1','23.1','2','5'],
      output:outputMenu(added,'Le tue spese:','1. 23.1',shutdown)},
    {name:'Visualizza più spese',stdin:['1','23.1','1','35.5','2','5'],
      output:outputMenu(added,added,'Le tue spese:','1. 23.1','2. 35.5',shutdown)}
  ],proof(/\bexpenses\.is_empty\s*\(\s*\)/,
    /\belif\s+choice\s*==\s*["']2["']\s*:/,
    /\bfor\s+\w+\s+in\s+range\s*\(\s*expenses\.size\s*\(\s*\)\s*\)/,
    /\bprint\s*\(/));
  define(87,[
    {name:'Totale senza spese',stdin:['3','5'],
      output:outputMenu(empty,shutdown)},
    {name:'Totale e media',stdin:['1','100','1','200','1','300','3','5'],
      output:outputMenu(added,added,added,'Totale delle spese: 600.0',
        'Spesa media: 200.0',shutdown)},
    {name:'Media con decimali',stdin:['1','6.5','1','2.5','3','5'],
      output:outputMenu(added,added,'Totale delle spese: 9.0',
        'Spesa media: 4.5',shutdown)}
  ],proof(/\belif\s+choice\s*==\s*["']3["']\s*:/,
    /\bexpenses\.is_empty\s*\(/,/\bfor\s+\w+\s+in\s+expenses\s*:/,
    /\baverage\b/,/\btotal\b/));
  define(88,[
    {name:'Cancella e consulta',stdin:['1','10','4','2','3','5'],
      output:outputMenu(added,cleared,empty,empty,shutdown)},
    {name:'Cancella più volte',stdin:['4','4','5'],
      output:outputMenu(cleared,cleared,shutdown)},
    {name:'Nuova spesa dopo cancellazione',stdin:['1','20','4','1','8','3','5'],
      output:outputMenu(added,cleared,added,'Totale delle spese: 8.0',
        'Spesa media: 8.0',shutdown)}
  ],proof(/\belif\s+choice\s*==\s*["']4["']\s*:/,
    /\bexpenses\.clear\s*\(\s*\)/,
    /\bprint\s*\(\s*["']Tutte le spese sono state cancellate\./));
  define(89,[
    {name:'Scelta non riconosciuta',stdin:['x','5'],
      output:outputMenu(invalid,shutdown)},
    {name:'Più scelte non valide',stdin:['0','9','abc','5'],
      output:outputMenu(invalid,invalid,invalid,shutdown)},
    {name:'Dopo un errore, azione valida',stdin:['8','1','12','3','5'],
      output:outputMenu(invalid,added,'Totale delle spese: 12.0',
        'Spesa media: 12.0',shutdown)}
  ],proof(/\belse\s*:/,/\bprint\s*\(\s*["']Scelta non valida\. Riprova\./,
    /\bwhile\s+true\s*:/));
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    82:['freccia','5','pozione'],
    84:['5'],85:['1','12.5','5'],86:['1','23.1','2','5'],
    87:['1','100','1','200','1','300','3','5'],
    88:['1','10','4','2','3','5'],
    89:['0','9','5']
  });
  window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
