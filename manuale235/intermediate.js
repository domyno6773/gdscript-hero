/* Esercizi 31–50: input reale, formattazione, calcoli e cicli.
 * Ogni variante viene eseguita nel runner Godot via GDHManualVerifier.
 */
(() => {
  'use strict';
  const course=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(!v||course.length!==235)throw Error('Corso italiano o verificatore non caricato');
  const cases=v.expectedCases;
  const set=(n,spec)=>{
    const lesson=course.find(l=>l.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione assente: '+n);
    if(spec.expected!==undefined)lesson.expectedOutput=spec.expected;
    if(spec.cases)cases[n]=spec.cases;
    if(spec.source)lesson.manualSourceCheck=spec.source;
    if(spec.validate)lesson.validate=spec.validate;
    lesson.validationReady=true;
  };
  const staticCheck=(output,rules)=>async result=>{
    const source=String(result.code||'').split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
    const actual=(result.logs||[]).join('\n').trimEnd();
    const structure=rules.every(re=>re.test(source));
    return [
      {desc:'Esecuzione nel motore Godot',passed:result.success===true,diff:result.error||null},
      {desc:'Istruzioni richieste',passed:structure,diff:structure?null:'Controlla le istruzioni richieste dalla consegna.'},
      {desc:'Output previsto',passed:actual===output,
        diff:actual===output?null:'Atteso:\n'+output+'\nRicevuto:\n'+actual}
    ];
  };
  const structural=(...re)=>source=>re.every(pattern=>pattern.test(String(source).split('\n')
    .filter(line=>!/^\s*#/.test(line)).join('\n')));
  set(31,{expected:'Amo GDScript\nCreiamo videogiochi!',
    validate:staticCheck('Amo GDScript\nCreiamo videogiochi!',[
      /print\s*\(\s*["']Amo GDScript["']\s*\)/,
      /print\s*\(\s*["']Creiamo videogiochi!["']\s*\)/
    ])});
  set(32,{expected:'Giocatore: Ada\nAda ha raggiunto il livello 7 con 250 monete',
    cases:[
      {name:'Scheda iniziale',output:'Giocatore: Ada\nAda ha raggiunto il livello 7 con 250 monete'},
      {name:'Variabili diverse',seeds:{player_name:'Luca',player_level:9,player_coins:80},
        output:'Giocatore: Luca\nLuca ha raggiunto il livello 9 con 80 monete'}
    ],
    source:structural(/\bplayer_name\b/,/\bplayer_level\b/,/\bplayer_coins\b/,
      /print\s*\(/)
  });
  set(33,{expected:'Articolo: Pozione curativa x3, totale: $7.50',
    cases:[
      {name:'Prezzo iniziale',output:'Articolo: Pozione curativa x3, totale: $7.50'},
      {name:'Nuovo articolo e prezzo',seeds:{item_name:'Elisir',price:1.25,quantity:2},
        output:'Articolo: Elisir x2, totale: $2.50'}
    ],
    source:structural(/%.2f|%\d*\.2f/,/\bitem_name\b/,/\bprice\s*\*\s*quantity\b/,
      /print\([^)]*%/)
  });
  set(34,{expected:'Ciao, Ada',
    cases:[
      {name:'Nome Ada',stdin:['Ada'],output:'Ciao, Ada'},
      {name:'Altro giocatore',stdin:['Marta'],output:'Ciao, Marta'},
      {name:'Nome composto',stdin:['Anna Maria'],output:'Ciao, Anna Maria'}
    ],
    source:structural(/\bOS\.read_string_from_stdin\s*\(/,/print\s*\(/)
  });
  set(35,{expected:'9.0',
    cases:[
      {name:'Prodotto decimale',stdin:['2','4.5'],output:'9.0'},
      {name:'Prodotto intero come float',stdin:['14','5'],output:'70.0'},
      {name:'Prodotto con segno',stdin:['-3','2'],output:'-6.0'}
    ],
    source:structural(/\bfloat\s*\(\s*OS\.read_string_from_stdin\s*\(\s*\)\s*\)/,/\*/)
  });
  set(36,{expected:'Mancano 95 anni ai 120',
    cases:[
      {name:'Età 25',stdin:['25'],output:'Mancano 95 anni ai 120'},
      {name:'Età 100',stdin:['100'],output:'Mancano 20 anni ai 120'},
      {name:'Età 120',stdin:['120'],output:'Mancano 0 anni ai 120'}
    ],
    source:structural(/OS\.read_string_from_stdin\s*\(/,/\b120\b/,/\bprint\s*\(/)
  });
  set(37,{expected:'T',
    cases:[
      {name:'Uno significa vero',stdin:['1'],output:'T'},
      {name:'Zero significa falso',stdin:['0'],output:'F'},
      {name:'Altro numero significa falso',stdin:['2'],output:'F'}
    ],
    source:structural(/OS\.read_string_from_stdin\s*\(/,/\bif\b/)
  });
  set(38,{expected:'Calcolatore per dividere il conto',
    validate:staticCheck('Calcolatore per dividere il conto',[
      /print\s*\(\s*["']Calcolatore per dividere il conto["']\s*\)/
    ])});
  set(39,{expected:'Calcolatore per dividere il conto',
    validate:staticCheck('Calcolatore per dividere il conto',[
      /\bvar\s+bill_amount\b[^=\n]*=\s*float\s*\(\s*OS\.read_string_from_stdin\s*\(\s*\)\s*\)/,
      /\bvar\s+tip_percentage\b[^=\n]*=\s*float\s*\(\s*OS\.read_string_from_stdin\s*\(\s*\)\s*\)/,
      /print\s*\(\s*["']Calcolatore per dividere il conto["']\s*\)/
    ])});
  set(40,{expected:'Calcolatore per dividere il conto\n70.087',
    cases:[
      {name:'Conto con decimali',stdin:['64.3','9.0'],output:'Calcolatore per dividere il conto\n70.087'},
      {name:'Conto semplice',stdin:['100','5'],output:'Calcolatore per dividere il conto\n105.0'}
    ],
    source:structural(/\bvar\s+tip_amount\b/,/\btip_percentage\s*\/\s*100\b/,
      /\bbill_amount\b/,/\bvar\s+total_amount\b/,/\bprint\s*\(\s*total_amount\s*\)/)
  });
  set(41,{expected:'Calcolatore per dividere il conto\n70.087\n35.0435',
    cases:[
      {name:'Due persone',stdin:['64.3','9.0','2'],
        output:'Calcolatore per dividere il conto\n70.087\n35.0435'},
      {name:'Quattro persone',stdin:['100','5','4'],
        output:'Calcolatore per dividere il conto\n105.0\n26.25'}
    ],
    source:structural(/\bvar\s+num_people\b[^=\n]*=\s*int\s*\(\s*OS\.read_string_from_stdin\s*\(\s*\)\s*\)/,
      /\bamount_per_person\b[^=\n]*=\s*total_amount\s*\/\s*num_people\b/,
      /\bprint\s*\(\s*total_amount\s*\)/,/\bprint\s*\(\s*amount_per_person\s*\)/)
  });
  set(42,{expected:'Calcolatore per dividere il conto\nTotale (mancia inclusa): $105.00\nOgni persona paga: $52.50',
    cases:[
      {name:'Importi formattati',stdin:['100','5','2'],
        output:'Calcolatore per dividere il conto\nTotale (mancia inclusa): $105.00\nOgni persona paga: $52.50'},
      {name:'Arrotondamento decimale',stdin:['64.3','9','2'],
        output:'Calcolatore per dividere il conto\nTotale (mancia inclusa): $70.09\nOgni persona paga: $35.04'}
    ],
    source:structural(/%\.2f/,/\btotal_amount\b/,/\bamount_per_person\b/)
  });
  set(43,{expected:'Ciao, sviluppatore: 3\nCiao, sviluppatore: 4\nCiao, sviluppatore: 5\nCiao, sviluppatore: 6',
    cases:[
      {name:'Da 3 a 6',stdin:['6'],output:'Ciao, sviluppatore: 3\nCiao, sviluppatore: 4\nCiao, sviluppatore: 5\nCiao, sviluppatore: 6'},
      {name:'Un solo valore',stdin:['3'],output:'Ciao, sviluppatore: 3'},
      {name:'Intervallo vuoto',stdin:['2'],output:''}
    ],
    source:structural(/\bfor\s+\w+\s+in\s+range\s*\(/,/OS\.read_string_from_stdin\s*\(/)
  });
  set(44,{expected:'1.875',
    cases:[
      {name:'Più iterazioni',stdin:['15'],output:'1.875'},
      {name:'Già sotto la soglia',stdin:['2'],output:'2.0'},
      {name:'Soglia esatta',stdin:['3.5'],output:'1.75'}
    ],
    source:structural(/\bwhile\s+/,/\bnumber\s*\/=\s*2|number\s*=\s*number\s*\/\s*2/,/\b3\.5\b/)
  });
  set(45,{expected:'1\n2\n3\n4\n5',
    validate:staticCheck('1\n2\n3\n4\n5',[/\bfor\s+i\s+in\s+range\s*\(\s*1\s*,\s*11\s*\)/,
      /\bif\b/,/\bbreak\b/])});
  set(46,{expected:'2\n4\n6\n8\n10\n12\n14\n16\n18\n20',
    validate:staticCheck('2\n4\n6\n8\n10\n12\n14\n16\n18\n20',[
      /\bfor\s+i\s+in\s+range\s*\(\s*1\s*,\s*21\s*\)/,
      /\bif\b/,/\bcontinue\b/])});
  set(47,{expected:'120',
    cases:[
      {name:'Fattoriale 5',stdin:['5'],output:'120'},
      {name:'Fattoriale 0',stdin:['0'],output:'1'},
      {name:'Fattoriale 1',stdin:['1'],output:'1'},
      {name:'Fattoriale 7',stdin:['7'],output:'5040'}
    ],
    source:structural(/OS\.read_string_from_stdin\s*\(/,/\bfor\b|\bwhile\b/,/\*/)
  });
  set(48,{expected:'1\n3\n5\n7\n9',
    cases:[
      {name:'Passo positivo',stdin:['1','10','2'],output:'1\n3\n5\n7\n9'},
      {name:'Passo negativo',stdin:['10','0','-3'],output:'10\n7\n4\n1'},
      {name:'Passo unitario',stdin:['1','4','1'],output:'1\n2\n3'}
    ],
    source:structural(/\bfor\s+\w+\s+in\s+range\s*\(\s*start\s*,\s*end\s*,\s*step\s*\)/)
  });
  set(49,{expected:'****\n****\n****',
    cases:[
      {name:'Tre righe e quattro colonne',stdin:['3','4'],output:'****\n****\n****'},
      {name:'Una riga due colonne',stdin:['1','2'],output:'**'},
      {name:'Due righe tre colonne',stdin:['2','3'],output:'***\n***'}
    ],
    source:source=>(String(source).match(/\bfor\s+\w+\s+in\s+range\s*\(/g)||[]).length>=2
  });
  set(50,{expected:'12',
    cases:[
      {name:'Tre numeri',stdin:['3','1','5','6'],output:'12'},
      {name:'Elenco vuoto',stdin:['0'],output:'0'},
      {name:'Numeri con segno',stdin:['4','-1','8','0','3'],output:'10'}
    ],
    source:structural(/OS\.read_string_from_stdin\s*\(/,/\bfor\b|\bwhile\b/,/\b0\b/)
  });
  window.GDHManualExamples=Object.freeze({
    ...window.GDHManualExamples,
    34:['Ada'],35:['2','4.5'],36:['25'],37:['1'],
    39:['64.3','9.0'],40:['64.3','9.0'],41:['64.3','9.0','2'],
    42:['100','5','2'],43:['6'],44:['15'],47:['5'],
    48:['1','10','2'],49:['3','4'],50:['3','1','5','6']
  });
  window.GDHManualMigration.validated=course.filter(l=>l.validationReady).length;
})();
