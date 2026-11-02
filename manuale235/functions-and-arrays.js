/* Manuale italiano: lezioni 51–70, con prove native per funzioni e array.
 * Mantiene le consegne del PDF. I casi alternativi non devono essere
 * ottenibili con un semplice print del risultato dell'esempio.
 */
(() => {
  'use strict';
  const data=window.LESSONS_DATA||[], verifier=window.GDHManualVerifier;
  if(data.length!==235||!verifier)throw Error('Catalogo manuale non inizializzato');
  const collection=verifier.expectedCases;
  const stripped=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
  const all=(...regex)=>s=>regex.every(r=>r.test(stripped(s)));
  const define=(n,opts)=>{
    const lesson=data.find(l=>l.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione '+n+' assente');
    if(!Array.isArray(opts.cases)||!opts.cases.length)throw Error('Nessun caso per '+n);
    collection[n]=opts.cases;
    lesson.expectedOutput=opts.expected??opts.cases[0].output??'Risultati delle chiamate a funzione';
    lesson.manualSourceCheck=opts.source||(()=>true);
    lesson.validationReady=true;
  };
  const integers=(values)=>'['+values.join(', ')+']';
  const quoted=values=>'['+values.map(x=>JSON.stringify(x)).join(', ')+']';
  const fizz=(n,variant=false)=>{
    if(n%3===0&&n%7===0)return 'FizzBuzz';
    if(n%3===0)return 'Fizz';
    if(n%7===0)return 'Buzz';
    if(variant&&String(n).includes('3'))return 'Quasi Fizz';
    return String(n);
  };
  const game=(limit,variant=false)=>{
    const rows=['Benvenuto in FizzBuzz!'];
    for(let i=1;i<=limit;i++)rows.push(fizz(i,variant));
    return rows.join('\n');
  };
  const read=/OS\.read_string_from_stdin\s*\(\s*\)/;
  const functionSig=name=>new RegExp('\\bfunc\\s+'+name+'\\s*\\(');
  define(51,{
    cases:[0,1,3,5].map(n=>({name:'Ripetizioni: '+n,stdin:[String(n)],
      output:Array(n).fill('50005000').join('\n')})),
    source:all(functionSig('print_large_number'),
      /\bfor\s+\w+\s+in\s+range\s*\(\s*n\s*\)/,
      /\bprint_large_number\s*\(\s*\)/,read)
  });
  define(52,{
    cases:[[3,5],[-3,7],[0,29],[12,12]].map(([a,b])=>({
      name:'Prodotto di '+a+' e '+b,stdin:[String(a),String(b)],output:String(a*b)
    })),
    source:all(functionSig('print_product'),read,/\bprint_product\s*\(\s*a\s*,\s*b\s*\)/,
      /\bprint\s*\(/,/\*/)
  });
  define(53,{
    cases:[5,-4,0,13].map(n=>({name:'Quadrato di '+n,stdin:[String(n)],
      output:String(n*n)})),
    source:all(/\bfunc\s+square_number\s*\(\s*n\b/,/\breturn\b/,
      /\bsquare_number\s*\(\s*input_num\s*\)/,/\bvar\s+result\b/,/\bprint\s*\(\s*result\s*\)/)
  });
  define(54,{
    cases:[[5,3],[2,11],[0,7]].map(([w,h])=>({
      name:'Area '+w+' × '+h,stdin:[String(w),String(h)],output:'Area: '+w*h
    })),
    source:all(/\bfunc\s+area\s*\(\s*\w+\s*:\s*int\s*,\s*\w+\s*:\s*int\s*\)\s*->\s*int\s*:/,
      /\bfunc\s+show_area\s*\(\s*\w+\s*:\s*int\s*\)\s*->\s*void\s*:/,
      /\bshow_area\s*\(\s*area\s*\(\s*width\s*,\s*height\s*\)\s*\)/)
  });
  define(55,{
    expected:'Godot richiama sigma() e controlla i valori restituiti',
    cases:[{name:'Sigma: zero, uno, cinque e otto',
      calls:[0,1,5,8].map(n=>({method:'sigma',args:[n]})),
      returns:[0,1,15,36]},
    {name:'Sigma con altri parametri',
      calls:[2,7,11].map(n=>({method:'sigma',args:[n]})),
      returns:[3,28,66]}],
    source:s=>all(/\bfunc\s+sigma\s*\(\s*n\s*:\s*int\s*\)/,/\breturn\b/)(s) &&
      !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(stripped(s)) &&
      !/\bprint\s*\(/.test(stripped(s))
  });
  define(56,{
    expected:'Godot richiama is_valid() con più credenziali',
    cases:[{name:'Utenti consentiti e negati',
      calls:[['admin',''],['admin','altro'],['utente','qweasd'],
        ['utente','1234'],['ospite','qweasd'],['Admin','qweasd']]
        .map(args=>({method:'is_valid',args})),
      returns:[true,true,true,false,false,false]},
    {name:'Password e nomi differenti',
      calls:[['utente',''],['admin','qweasd'],['guest',''],
        ['utente','QWEASD']].map(args=>({method:'is_valid',args})),
      returns:[false,true,false,false]}],
    source:s=>all(/\bfunc\s+is_valid\s*\(\s*username\s*:\s*String\s*,\s*password\s*:\s*String\s*\)/)(s) &&
      !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(stripped(s)) &&
      !/\bprint\s*\(/.test(stripped(s))
  });
  define(57,{
    cases:['Ana','Marta','Luca'].map(name=>({
      name:'Saluti per '+name,stdin:[name],
      output:'Ciao, '+name+'!\nBentornato, '+name+'!'
    })),
    source:all(/\bfunc\s+greet\s*\(\s*player_name\b[^,\n]*,\s*greeting\s*(?::\s*String\s*)?=\s*["']Ciao["']/,
      /\bgreet\s*\(\s*player\s*\)/,
      /\bgreet\s*\(\s*player\s*,\s*["']Bentornato["']\s*\)/)
  });
  define(58,{
    expected:'Benvenuto in FizzBuzz!',
    cases:[{name:'Messaggio iniziale',output:'Benvenuto in FizzBuzz!'}],
    source:all(/\bprint\s*\(\s*["']Benvenuto in FizzBuzz!["']\s*\)/)
  });
  define(59,{
    cases:[21,5,7,9,10].map(n=>({
      name:'FizzBuzz di '+n,stdin:[String(n)],
      output:'Benvenuto in FizzBuzz!\n'+fizz(n)
    })),
    source:all(/\bfunc\s+fizzbuzz\s*\(\s*number\s*:\s*int\s*\)\s*->\s*String\s*:/,
      /\breturn\b/,read,/\bprint\s*\(\s*fizzbuzz\s*\(\s*limit\s*\)\s*\)/,
      /%[\s]*3/,/%[\s]*7/)
  });
  define(60,{
    cases:[1,7,14,21].map(n=>({
      name:'FizzBuzz fino a '+n,stdin:[String(n)],output:game(n)
    })),
    source:all(functionSig('fizzbuzz'),
      /\bfor\s+\w+\s+in\s+range\s*\(\s*1\s*,\s*limit\s*\+\s*1\s*\)/,
      /\bprint\s*\(\s*fizzbuzz\s*\(\s*\w+\s*\)\s*\)/)
  });
  define(61,{
    cases:[3,14,23,35].map(n=>({
      name:'FizzBuzz variante fino a '+n,stdin:[String(n)],output:game(n,true)
    })),
    source:all(functionSig('fizzbuzz'),/\bfor\s+\w+\s+in\s+range\s*\(/,
      /["']3["']\s+in\s+str\s*\(\s*number\s*\)/,
      /["']Quasi Fizz["']/)
  });
  define(62,{
    cases:[{name:'Array iniziale',output:quoted(['pane','uova','milk','burro'])+'\n4'}],
    source:all(/\bshopping_list\s*=\s*\[/,/\bshopping_list\.size\s*\(\s*\)/,
      /["']pane["']/,/["']uova["']/,/["']milk["']/,/["']burro["']/)
  });
  define(63,{
    cases:[1,3,6].map(n=>({
      name:'Primi '+n+' elementi',stdin:[String(n)],
      output:['spada','scudo','pozione','mappa','torcia','corda']
        .slice(0,n).join('\n')+'\nUltimo: corda'
    })),
    source:all(/\bfor\s+\w+\s+in\s+range\s*\(/,
      /\binventory\s*\[\s*-1\s*\]/)
  });
  define(64,{
    cases:[{name:'Indice positivo',stdin:['1','Zoe'],
      output:quoted(['Ana','Zoe','Cleo','Dev'])},
    {name:'Ultimo elemento',stdin:['-1','Luca'],
      output:quoted(['Ana','Ben','Cleo','Luca'])},
    {name:'Primo con indice negativo',stdin:['-4','Nina'],
      output:quoted(['Nina','Ben','Cleo','Dev'])}],
    source:all(/\bteam\s*\[\s*index\s*\]\s*=\s*new_player\b/)
  });
  define(65,{
    cases:[
      {name:'Rimuovere scudo',stdin:['arco','scudo'],
        output:quoted(['mappa','spada','pozione','arco'])+'\n4'},
      {name:'Elemento da rimuovere assente',stdin:['corda','inesistente'],
        output:quoted(['mappa','spada','scudo','pozione','corda'])+'\n5'},
      {name:'Rimuovere la spada',stdin:['scudo','spada'],
        output:quoted(['mappa','scudo','pozione','scudo'])+'\n4'}
    ],
    source:all(/\binventory\.append\s*\(\s*new_item\s*\)/,
      /\binventory\.erase\s*\(\s*used_item\s*\)/,
      /\binventory\.insert\s*\(\s*0\s*,\s*["']mappa["']\s*\)/)
  });
  const product=nums=>nums.reduce((a,b)=>a*b,1);
  define(66,{
    cases:[[1,2,3],[-3,4],[6],[2,2,2,2]].map(nums=>({
      name:'Prodotto '+integers(nums),
      stdin:[String(nums.length),...nums.map(String)],output:String(product(nums))
    })),
    source:all(/\bnumbers\b/,/\bfor\b|\bwhile\b/,/\*/)
  });
  define(67,{
    cases:[[1,2,3],[9],[],[-1,4,0,2]].map(nums=>({
      name:'Invertire '+integers(nums),
      stdin:[String(nums.length),...nums.map(String)],
      output:integers([...nums].reverse())
    })),
    source:s=>all(/\bfor\b|\bwhile\b/,/\bappend\s*\(/,/\bnumbers\b/)(s) &&
      !/\.reverse\s*\(/.test(stripped(s))
  });
  define(68,{
    cases:[[70,95,88],[6],[10,40,20,30]].map(nums=>({
      name:'Punteggi '+integers(nums),
      stdin:[String(nums.length),...nums.map(String)],
      output:integers(nums)+'\nMigliore: '+Math.max(...nums)
    })),
    source:all(/\bvar\s+scores\s*:\s*Array\s*\[\s*int\s*\]\s*=\s*\[\s*\]/,
      /\bscores\.append\s*\(/,read,/\bfor\b|\bwhile\b/)
  });
  define(69,{
    cases:[
      ['pinguino','koala','delfino'],
      ['cane','gatto','sole'],
      ['banana','stella','percorso','mela','anfibio']
    ].map(words=>({
      name:'Filtrare parole',stdin:[words.join(',')],
      output:quoted(words.filter(x=>x.length>5))
    })),
    source:all(/\bfor\s+\w+\s+in\s+words\s*:/,
      /\.length\s*\(\s*\)\s*>\s*5\b/,
      /\blong_words\.append\s*\(/)
  });
  define(70,{
    cases:[
      [80,4,99,36,34],
      [50,51,100,60,75],
      [99,98,97],
      [1,49,52,55,105]
    ].map(nums=>({
      name:'Filtrare indici',stdin:[nums.join(',')],
      output:integers(nums.flatMap((num,i)=>(num<50||num%5===0)?[i]:[]))
    })),
    source:all(/\bfor\s+\w+\s+in\s+range\s*\(/,/\b50\b/,/%\s*5/,
      /\bor\b/,/\.append\s*\(/)
  });
  // Mostra input pronti che lo studente può sostituire liberamente.
  const defaults={
    51:['3'],52:['3','5'],53:['5'],54:['5','3'],57:['Ana'],59:['21'],
    60:['7'],61:['14'],63:['3'],64:['1','Zoe'],65:['arco','scudo'],
    66:['3','1','2','3'],67:['3','1','2','3'],
    68:['3','70','95','88'],69:['pinguino,koala,delfino'],
    70:['80,4,99,36,34']
  };
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,...defaults});
  if(!window.GDHManualMigration)throw Error('Metadati migrazione non disponibili');
  window.GDHManualMigration.validated=data.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
