/* Lezioni 152–157: map, filter, reduce, any, all.
 * Gli esempi multi-input e i controlli di sorgente mirano a distinguere
 * le operazioni sugli array dalla semplice stampa di un risultato fisso.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(lessons.length!==235||!verify)throw Error('Catalogo del manuale assente');
 const get=n=>{
   const lesson=lessons.find(x=>x.manualLessonNumber===n);
   if(!lesson)throw Error('Lezione mancante '+n);
   return lesson;
 };
 const patch=(n,code)=>{
   const lesson=get(n);
   lesson.initialCode=code;lesson.starterCode=code;
   lesson.sourceFiles={...lesson.sourceFiles,'main.gd':code};
 };
 const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 const rules=(...patterns)=>s=>patterns.every(p=>p.test(active(s)));
 const noReady=s=>!/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(active(s))&&
   !/\bprint\s*\(/.test(active(s));
 const define=(n,cases,proof)=>{
   if(cases.length<4)throw Error('Servono dati alternativi per '+n);
   const l=get(n);
   verify.expectedCases[n]=cases;
   l.expectedOutput=cases[0].output||'Verifica funzione GDScript';
   l.manualSourceCheck=proof;l.validationReady=true;
 };
 const fmt=v=>Array.isArray(v)?'['+v.map(fmt).join(', ')+']':
   typeof v==='string'?JSON.stringify(v):String(v);
 const typedHarness=(type,values,call)=>[
   'func _ready():',
   '    var samples: Array['+type+'] = '+fmt(values),
   '    print('+call+'(samples))'
 ].join('\n');

 patch(152,[
   'func convert_to_uppercase(strings: Array[String]):',
   '    # Restituisci un nuovo array usando map() e una lambda.',
   '    # Non usare cicli.',
   '    pass'
 ].join('\n'));
 const upper=[
   ['ciao','mondo'],['Godot','GDScript','io'],
   [],['abc','ABC','aBc'],['uno','due','tre']
 ];
 define(152,upper.map(a=>({
   name:'Maiuscolo: '+a.length+' stringhe',
   harness:typedHarness('String',a,'convert_to_uppercase'),
   output:fmt(a.map(s=>s.toUpperCase()))
 })),s=>rules(/\bfunc\s+convert_to_uppercase\s*\(\s*strings\s*:\s*Array\s*\[\s*String\s*\]\s*\)/,
   /\.map\s*\(\s*func\s*\(/,/\.to_upper\s*\(\s*\)/,/\breturn\b/)(s)&&
   !/\b(?:for|while)\b/.test(active(s))&&noReady(s));

 patch(153,[
   'func get_long_strings(strings: Array[String]):',
   '    # Restituisci le stringhe con più di 5 caratteri usando',
   '    # filter() e una lambda, senza cicli.',
   '    pass'
 ].join('\n'));
 const longWords=[
   ['mela','banana','ciliegia','fico'],
   ['abcdef','abcde','abcdefg'],
   [],['uno','due','tre'],['elefante','banana','elefante']
 ];
 define(153,longWords.map(a=>({
   name:'Filtro parole: '+a.length+' stringhe',
   harness:typedHarness('String',a,'get_long_strings'),
   output:fmt(a.filter(s=>s.length>5))
 })),s=>rules(/\bfunc\s+get_long_strings\s*\(\s*strings\s*:\s*Array\s*\[\s*String\s*\]\s*\)/,
   /\.filter\s*\(\s*func\s*\(/,/\b(?:length|len)\s*\(/,/\breturn\b/)(s)&&
   !/\b(?:for|while)\b/.test(active(s))&&noReady(s));

 const convertStarter=[
   'extends Node','','func _ready():',
   '    var numbers = []',
   '    for part in OS.read_string_from_stdin().split(","):',
   '        numbers.append(int(part))'
 ];
 patch(154,[
   ...convertStarter,
   '    # Usa reduce() tre volte: somma, prodotto, massimo.',
   '    # Per il massimo scrivi un confronto nella lambda, senza max().'
 ].join('\n'));
 const reductions=[
   [3,7,2,8,4],[2,2,2],[-4,-2,-9],[-2,3,4],
   [5],[0,100,2]
 ];
 define(154,reductions.map(xs=>({
   name:'Riduzione '+xs.join(','),
   stdin:[xs.join(',')],
   output:[xs.reduce((a,b)=>a+b,0),xs.reduce((a,b)=>a*b,1),
     Math.max(...xs)].join('\n')
 })),s=>rules(/\.reduce\s*\(/,/\bfunc\s*\(/,
   /\bnumbers\b/,/\bprint\s*\(/)(s)&&
   (active(s).match(/\.reduce\s*\(/g)||[]).length>=3&&
   !/\bmax\s*\(/.test(active(s)));

 patch(155,[
   ...convertStarter,
   '    # Stampa se almeno un punteggio è 100 usando any().',
   '    # Stampa se tutti i punteggi sono >= 50 usando all().'
 ].join('\n'));
 const scores=[
   [100,75,40],[100,80,55],[50,50,50],[0,99,70],
   [49,70,60],[100],[10,20,30]
 ];
 define(155,scores.map(xs=>({
   name:'Voti '+xs.join(','),
   stdin:[xs.join(',')],
   output:'Almeno uno perfetto: '+String(xs.some(x=>x===100))+
     '\nTutti promossi: '+String(xs.every(x=>x>=50))
 })),rules(/\.any\s*\(\s*func\s*\(/,/\.all\s*\(\s*func\s*\(/,
   /\bnumbers\b/,/\bprint\s*\(/,/\b100\b/,/\b50\b/));

 patch(156,[
   'func clean_email_list(emails: Array[String]):',
   '    # Pulisci con map(): strip_edges() e to_lower().',
   '    # Conserva con filter() solo le stringhe con un unico @',
   '    # che abbia almeno un carattere prima e dopo.',
   '    pass'
 ].join('\n'));
 const emailLists=[
   ['Test@EXAMPLE.com',' invalid.email',' space@email.com '],
   ['  ABC@X  ','a@@b','@start','end@','   '],
   [],['ONE@two','one@two','  hello@world '],
   ['mail@dominio','bad@@example',' x@y ']
 ];
 const clean=emails=>emails.map(x=>x.trim().toLowerCase())
   .filter(x=>x.indexOf('@')>0&&x.indexOf('@')===x.lastIndexOf('@')&&
     x.indexOf('@')<x.length-1);
 define(156,emailLists.map(emails=>({
   name:'Pulizia di '+emails.length+' email',
   harness:typedHarness('String',emails,'clean_email_list'),
   output:fmt(clean(emails))
 })),s=>rules(/\bfunc\s+clean_email_list\s*\(\s*emails\s*:\s*Array\s*\[\s*String\s*\]\s*\)/,
   /\.map\s*\(\s*func\s*\(/,/\.filter\s*\(\s*func\s*\(/,
   /\.to_lower\s*\(\s*\)/,/\.strip_edges\s*\(\s*\)/,
   /\breturn\b/)(s)&&
   !/\b(?:for|while)\b/.test(active(s))&&noReady(s));

 patch(157,[
   'func process_numbers(numbers: Array[int]):',
   '    # Con filter() conserva solo i valori positivi.',
   '    # Con map() raddoppia i pari e triplica i dispari.',
   '    pass'
 ].join('\n'));
 const numberLists=[
   [-4,0,5,2,8,-3,7],
   [],[0,-1,-2],
   [1,2,3,4,5,6],
   [10,10,11,-8],[100,101,-100,0]
 ];
 define(157,numberLists.map(numbers=>({
   name:'Trasformazione di '+numbers.length+' numeri',
   harness:typedHarness('int',numbers,'process_numbers'),
   output:fmt(numbers.filter(x=>x>0).map(x=>x%2===0?x*2:x*3))
 })),s=>rules(/\bfunc\s+process_numbers\s*\(\s*numbers\s*:\s*Array\s*\[\s*int\s*\]\s*\)/,
   /\.filter\s*\(\s*func\s*\(/,/\.map\s*\(\s*func\s*\(/,
   /%\s*2\b/,/\breturn\b/)(s)&&
   !/\b(?:for|while)\b/.test(active(s))&&noReady(s));

 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   154:['3,7,2,8,4'],155:['100,75,40']
 });
 window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();