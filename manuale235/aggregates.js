/* Lezioni 141–144: aggregazioni, min/max e ordinamenti.
 * Si verifica anche l'ordine di inserimento delle chiavi nel dizionario.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(lessons.length!==235||!verify)throw Error('Manuale 235 assente');
 const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione '+n+' mancante');return l;};
 const patch=(n,source)=>{const l=get(n);l.initialCode=source;
   l.starterCode=source;l.sourceFiles={...l.sourceFiles,'main.gd':source};};
 const clean=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
 const proof=(...rules)=>s=>rules.every(r=>r.test(clean(s)));
 const define=(n,cases,check)=>{
   const l=get(n);
   verify.expectedCases[n]=cases;l.expectedOutput=cases[0].output||'Verifica in Godot';
   l.manualSourceCheck=check;l.validationReady=true;
 };
 const formatArray=a=>'['+a.map(x=>typeof x==='string'?JSON.stringify(x):String(x)).join(', ')+']';
 patch(141,[
   'extends Node','','func _ready():',
   '    var sales = OS.read_string_from_stdin().split(" ", false)',
   '    var starting_cash = int(OS.read_string_from_stdin())',
   '    # Somma ogni vendita, se presente, e stampa il totale.',
   '    pass'
 ].join('\n'));
 const sales=[
   [[100,200,150,300],50],[[],50],[[-5,10,0],20],
   [[1,2,3,4,5],-10],[[0,0,0],0]
 ];
 define(141,sales.map(([sold,cash])=>({
   name:'Cassa con '+sold.length+' vendite',
   stdin:[sold.join(' '),String(cash)],
   output:'Totale: '+(sold.reduce((a,b)=>a+b,cash))
 })),proof(/\bsales\b/,/\bstarting_cash\b/,/\bfor\b|\bwhile\b/,
   /\bint\s*\(/,/\bprint\s*\(/));

 const l142=get(142);
 l142.task=l142.task.replace('usando min() e max()',
     'usando min() e max() sui numeri e String.casecmp_to() sulle parole')
   .replaceAll('Smallest word:','Parola più piccola:')
   .replaceAll('Largest word:','Parola più grande:');
 patch(142,[
   'extends Node','','func _ready():',
   '    var number_texts = OS.read_string_from_stdin().split(" ", false)',
   '    var words = Array(OS.read_string_from_stdin().split(" ", false))',
   '    # Usa min/max per i numeri, String.casecmp_to() per le parole.',
   '    pass'
 ].join('\n'));
 const extrema=[
   [[42,17,23,56,9,34],['kiwi','apple','banana','cherry','date']],
   [[10,2,100],['zebra','albero','mela']],
   [[-4,-1,-10],['uno','due','tre']],
   [[7],['singola']]
 ];
 define(142,extrema.map(([nums,words])=>({
   name:'Minimi e massimi '+nums.length+' numeri',
   stdin:[nums.join(' '),words.join(' ')],
   output:['Numero più piccolo: '+Math.min(...nums),
     'Numero più grande: '+Math.max(...nums),
     'Parola più piccola: '+[...words].sort()[0],
     'Parola più grande: '+[...words].sort().at(-1)].join('\n')
 })),proof(/\bnumber_texts\b/,/\bwords\b/,/\bint\s*\(/,
   /\bmin\s*\(/,/\bmax\s*\(/,/\bprint\s*\(/));

 const l143=get(143);
 l143.task=[
   '<p>Lo script legge due righe: numeri interi separati da spazi e parole separate da spazi. Gli array ',
   '<code>numbers</code> e <code>words</code> sono già predisposti.</p>',
   '<p>Scrivi la funzione <code>by_length(a: String, b: String) -&gt; bool</code>:',
   'le parole più corte vengono prima e quelle di pari lunghezza sono in ordine alfabetico.</p>',
   '<p>Stampa quattro righe: numeri crescenti, numeri decrescenti, parole in ordine alfabetico ',
   'con <code>sort()</code>, parole ordinate per lunghezza con <code>sort_custom(by_length)</code>.</p>',
   '<p>Per i numeri <code>5 3 8 1 2</code> e le parole <code>elephant cat dolphin bee</code>:</p>',
   '<p>Ascending: [1, 2, 3, 5, 8]</p>',
   '<p>Descending: [8, 5, 3, 2, 1]</p>',
   '<p>Alphabetical: ["bee", "cat", "dolphin", "elephant"]</p>',
   '<p>Per lunghezza: ["bee", "cat", "dolphin", "elephant"]</p>'
 ].join(' ');
 patch(143,[
   'extends Node',
   '',
   '# Scrivi qui by_length(a: String, b: String) -> bool.',
   '',
   'func _ready():',
   '    var numbers: Array[int] = []',
   '    for text in OS.read_string_from_stdin().split(" ", false):',
   '        numbers.append(int(text))',
   '    var words = Array(OS.read_string_from_stdin().split(" ", false))',
   '    # Stampa i quattro ordinamenti richiesti usando sort e sort_custom.',
   '    pass'
 ].join('\n'));
 const data=[
   [[5,3,8,1,2],['elephant','cat','dolphin','bee']],
   [[2,-2,20,3],['dog','ant','ox','cat']],
   [[9,1,5,1],['e','bb','aaa','z']],
   [[0],['only']]
 ];
 define(143,data.map(([numbers,words])=>{
   const asc=[...numbers].sort((a,b)=>a-b),alphabetical=[...words].sort();
   const byLength=[...words].sort((a,b)=>a.length-b.length||(a<b?-1:a>b?1:0));
   return {
     name:'Ordinamenti alternativi',stdin:[numbers.join(' '),words.join(' ')],
     output:['Ascending: '+formatArray(asc),'Descending: '+formatArray([...asc].reverse()),
       'Alphabetical: '+formatArray(alphabetical),
       'Per lunghezza: '+formatArray(byLength)].join('\n')
   };
 }),proof(/\bfunc\s+by_length\s*\(\s*a\s*:\s*String\s*,\s*b\s*:\s*String\s*\)/,
   /\bsort\s*\(/,/\bsort_custom\s*\(\s*by_length\s*\)/,
   /\breturn\b/,/\bwords\b/,/\bnumbers\b/));

 patch(144,[
   'func dictionary_sorter(data: Dictionary):',
   '    # Crea e restituisci un nuovo Dictionary ordinato per valore.',
   '    # Non modificare data; in ogni test i valori sono tutti distinti.',
   '    pass'
 ].join('\n'));
 const dictionaries=[
   {a:3,b:1,c:2},{a:-2,b:10,c:-15,d:0},
   {uno:8},{z:5,x:9,a:3,b:7}
 ];
 define(144,dictionaries.map(data=>{
   const ordered=Object.fromEntries(Object.entries(data)
     .sort((a,b)=>a[1]-b[1]));
   const output=JSON.stringify(ordered);
   return{
     name:'Ordine per valore '+Object.keys(data).length+' chiavi',
     harness:'func _ready():\n    print(dictionary_sorter('+JSON.stringify(data)+'))',
     orderedKeys:Object.keys(ordered),object:ordered,output
   };
 }),s=>proof(/\bfunc\s+dictionary_sorter\s*\(\s*data\s*:\s*Dictionary\s*\)/,
   /\.sort\s*\(|\.sort_custom\s*\(/,/\bfor\b|\bwhile\b/,/\breturn\b/)(s)&&
   !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(clean(s))&&
   !/\bprint\s*\(/.test(clean(s)));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   141:['100 200 150 300','50'],
   142:['42 17 23 56 9 34','kiwi apple banana cherry date'],
   143:['5 3 8 1 2','elephant cat dolphin bee']
 });
 window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();
