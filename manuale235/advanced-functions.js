/* Migrazione 145-151: funzioni, lambda, ordinamenti e ricorsione.
 * I test richiamano le funzioni nel Godot reale usando dati alternativi.
 * Non aggiungono _ready() al codice che il manuale vuole solo-funzione:
 * il relativo harness temporaneo appartiene esclusivamente ai test.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
  if(lessons.length!==235||!verify)throw Error('Manuale 235 non caricato');
  const get=n=>{
    const lesson=lessons.find(x=>x.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione '+n+' mancante');
    return lesson;
  };
  const patch=(n,code)=>{
    const lesson=get(n);
    lesson.initialCode=code;
    lesson.starterCode=code;
    lesson.sourceFiles={...lesson.sourceFiles,'main.gd':code};
  };
  const active=code=>String(code).split('\n')
    .filter(line=>!/^\s*#/.test(line)).join('\n');
  const has=(...patterns)=>src=>patterns.every(re=>re.test(active(src)));
  const fnOnly=(...rules)=>src=>has(...rules)(src)&&
    !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(active(src))&&
    !/\bprint\s*\(/.test(active(src));
  const define=(n,cases,rule)=>{
    if(cases.length<3)throw Error('Troppi pochi scenari per '+n);
    const lesson=get(n);
    verify.expectedCases[n]=cases;
    lesson.manualSourceCheck=rule;
    lesson.expectedOutput=cases[0].output||'Prova automatica della funzione';
    lesson.validationReady=true;
  };
  const literal=x=>JSON.stringify(x);
  const printCall=(name,args)=>'func _ready():\n    print('+name+'('+args.map(literal).join(', ')+'))';
  const toArray=a=>'['+a.map(v=>Array.isArray(v)?toArray(v):literal(v)).join(', ')+']';

  patch(145,[
    'extends Node',
    '',
    'func _ready():',
    '    # Chiama get_student_info() una volta e memorizza il risultato.',
    '    # Assegna gli elementi a student_name, student_age e student_major.',
    '    # Stampa i tre valori su righe separate.',
    '    pass',
    '',
    '# Implementa qui get_student_info() -> Array.'
  ].join('\n'));
  define(145,[
    {name:'Nome, età e specializzazione',output:'Bob\n20\nComputer Scienze'},
    {name:'Controllo della stessa funzione',output:'Bob\n20\nComputer Scienze'},
    {name:'Riutilizzo del valore restituito',output:'Bob\n20\nComputer Scienze'}
  ],src=>has(
    /\bfunc\s+get_student_info\s*\(\s*\)\s*->\s*Array\s*:/,
    /\bget_student_info\s*\(\s*\)/,
    /\bstudent_name\b/,/\bstudent_age\b/,/\bstudent_major\b/,
    /\breturn\b/,/\bprint\s*\(/)(src)&&
    !/^\s*(?:var\s+)?(?:student_name|student_age|student_major)\s*=\s*(?:"Bob"|20|"Computer Scienze")/m.test(active(src)));

  patch(146,[
    'extends Node','','func _ready():',
    '    var a = int(OS.read_string_from_stdin())',
    '    var b = int(OS.read_string_from_stdin())',
    '    var c = int(OS.read_string_from_stdin())',
    '    # Dichiara la lambda multiply con tre parametri e il loro prodotto.',
    '    # Stampane il risultato chiamandola con a, b, c.',
    '    pass'
  ].join('\n'));
  const triples=[[2,3,4],[0,5,9],[-2,3,4],[-3,-2,7],[9,1,1]];
  define(146,triples.map(([a,b,c])=>({
    name:'Prodotto '+[a,b,c].join(' × '),
    stdin:[String(a),String(b),String(c)],
    output:String(a*b*c)
  })),has(/\bvar\s+multiply\s*=\s*func\s*\(\s*x\s*,\s*y\s*,\s*z\s*\)/,
    /\bx\s*\*\s*y\s*\*\s*z\b|\b[x-z]\s*\*\s*[x-z]\s*\*\s*[x-z]\b/,
    /\bmultiply(?:\s*\(|\.call\s*\()/,/\bprint\s*\(/));

  patch(147,[
    'extends Node','','func _ready():',
    '    var number = int(OS.read_string_from_stdin())',
    '    # Dichiara la lambda categorize_number e stampane il risultato.',
    '    pass'
  ].join('\n'));
  define(147,[-19,-1,0,1,10,990].map(number=>({
    name:'Categoria del numero '+number,stdin:[String(number)],
    output:number<0?'Negative':number>0?'Positive':'Zero'
  })),has(/\bvar\s+categorize_number\s*=\s*func\s*\(/,
    /\bnumber\b/,/\bPositive\b/,/\bNegative\b/,/\bZero\b/,
    /\bcategorize_number(?:\s*\(|\.call\s*\()/,/\bprint\s*\(/));

  patch(148,[
    'func sort_pairs(data: Array):',
    '    # Ordina data con sort_custom() e una lambda.',
    '    # Usa il numero; in caso di parità confronta i nomi.',
    '    # Restituisci l’array ordinato.',
    '    pass'
  ].join('\n'));
  const pairs=[
    [['Alice',25],['Bob',30],['Charlie',20]],
    [['Zoe',10],['Ada',10],['Mia',10],['Eva',5]],
    [['A',-5],['B',0],['C',-10]],
    [['uno',100]],
    [],
    [['carlo',4],['anna',2],['bruno',4]]
  ];
  const sortedPairs=a=>[...a].sort((x,y)=>x[1]-y[1]||
    (x[0]<y[0]?-1:x[0]>y[0]?1:0));
  define(148,pairs.map(a=>({
    name:'Ordinamento '+a.length+' coppie',
    harness:printCall('sort_pairs',[a]),
    output:toArray(sortedPairs(a))
  })),fnOnly(/\bfunc\s+sort_pairs\s*\(\s*data\s*:\s*Array\s*\)/,
    /\.sort_custom\s*\(\s*func\s*\(/,/\breturn\s+data\b/,
    /a\s*\[\s*1\s*\]/,/b\s*\[\s*1\s*\]/));

  patch(149,[
    'extends Node','','func _ready():',
    '    var n = int(OS.read_string_from_stdin())',
    '    count_down(n)',
    '',
    '# Scrivi count_down(n): stampa n e richiamati con n - 1 fino a 0.'
  ].join('\n'));
  define(149,[0,1,3,6,10].map(n=>({
    name:'Conto alla rovescia da '+n,stdin:[String(n)],
    output:Array.from({length:n+1},(_,i)=>String(n-i)).join('\n')
  })),src=>{
    const code=active(src);
    return has(/\bfunc\s+count_down\s*\(\s*n\s*\)\s*:/,
      /\bprint\s*\(\s*n\s*\)/,/\bcount_down\s*\(\s*n\s*-\s*1\s*\)/)(src)&&
      !/\b(?:for|while)\b/.test(code);
  });

  patch(150,[
    'func fibonacci(n: int):',
    '    # fibonacci(1) = 0; fibonacci(2) = 1.',
    '    # Richiama fibonacci(n - 1) e fibonacci(n - 2) per n > 2.',
    '    pass'
  ].join('\n'));
  const fib=n=>{
    if(n===1)return 0;
    if(n===2)return 1;
    let a=0,b=1;
    for(let i=3;i<=n;i++){const next=a+b;a=b;b=next;}
    return b;
  };
  define(150,[1,2,3,4,6,8,10].map(n=>({
    name:'Fibonacci '+n,harness:printCall('fibonacci',[n]),
    output:String(fib(n))
  })),fnOnly(/\bfunc\s+fibonacci\s*\(\s*n\s*:\s*int\s*\)/,
    /\bfibonacci\s*\(\s*n\s*-\s*1\s*\)/,
    /\bfibonacci\s*\(\s*n\s*-\s*2\s*\)/,/\breturn\b/));

  patch(151,[
    'func sum_nested(nested_array: Array):',
    '    var total = 0',
    '    for element in nested_array:',
    '        if element is Array:',
    '            # Somma ricorsivamente questo array interno.',
    '            pass',
    '        else:',
    '            # Aggiungi element a total.',
    '            pass',
    '    return total'
  ].join('\n'));
  const nested=[
    [1,[2,3],[4,[5,6]],7],
    [],
    [0,-3,[1,[2,[-2]]],8],
    [[[]],[],[[4]]],
    [1,2,3],
    [[10,[20]],[[30],40]]
  ];
  const deepSum=a=>a.reduce((sum,item)=>sum+
    (Array.isArray(item)?deepSum(item):item),0);
  define(151,nested.map(items=>({
    name:'Somma annidata '+JSON.stringify(items),
    harness:printCall('sum_nested',[items]),output:String(deepSum(items))
  })),fnOnly(/\bfunc\s+sum_nested\s*\(\s*nested_array\s*:\s*Array\s*\)/,
    /\belement\s+is\s+Array\b/,/\bsum_nested\s*\(\s*element\s*\)/,
    /\bfor\s+element\s+in\s+nested_array\b/,/\breturn\s+total\b/));

  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    146:['2','3','4'],147:['10'],149:['3']
  });
  window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();