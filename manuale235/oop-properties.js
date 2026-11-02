/* Lezioni 176-180: proprietà, costruttori, metodi e stato statico.
 * main.gd è sempre fornito e bloccato; per le attività con due classi
 * l'alunno modifica due schede separate.
 */
(() => {
'use strict';
const lessons=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
if(lessons.length!==235||!verify)throw Error('Manuale 235 mancante');
const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Lezione mancante '+n);return l;};
const patch=(n,files)=>{
 const l=get(n);l.sourceFiles=files;l.initialCode=files[Object.keys(files)[0]];
 l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const ready=body=>['extends Node','','func _ready():',...body.map(s=>'    '+s)].join('\n');
const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
const rules=(...arr)=>s=>arr.every(re=>re.test(active(s)));
const define=(n,cases,proof)=>{const l=get(n);verify.expectedCases[n]=cases;l.manualSourceCheck=proof;
 l.expectedOutput=cases[0].output;l.validationReady=true;};
patch(176,{
 'player.gd':[
 'class_name Player','extends RefCounted','',
 '# Dichiara player_name, level, hp, inventory con i valori iniziali del manuale.','',
 'func describe() -> String:',
 '    # Restituisci la descrizione delle proprietà correnti.',
 '    return ""'].join('\n'),
 'main.gd':ready([
 'var hero = Player.new()',
 'hero.player_name = OS.read_string_from_stdin()',
 'var guest = Player.new()',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    match parts[0]:',
 '        "colpisci":',
 '            hero.hp -= int(parts[1])',
 '        "item":',
 '            hero.inventory.append(parts[1])',
 '        "level":',
 '            hero.level += 1',
 'print(hero.describe())',
 'print(guest.describe())'])
});
const gameCases=[
 ['Ada',['colpisci 30','item spada','level','item scudo']],
 ['Lia',[]],
 ['Pippo',['level','level','colpisci 20']],
 ['Ari',['item mappa','item chiave']],
 ['Lu',['colpisci 100','level']]
];
define(176,gameCases.map(([name,ops],i)=>{
 let hp=100,level=1,items=[];
 for(const op of ops){const [verb,value]=op.split(' ');
 if(verb==='colpisci')hp-=Number(value);
 if(verb==='level')level++;
 if(verb==='item')items.push(value);}
 return{name:'Proprietà Player '+i,stdin:[name,String(ops.length),...ops],
 output:[name+' (livello '+level+', '+hp+' PS): '+(items.join(', ')||'nessun oggetto'),
 'Eroe (livello 1, 100 PS): nessun oggetto'].join('\n')};
}),rules(/\bclass_name\s+Player\b/,
 /\bvar\s+player_name\s*:\s*String\s*=\s*["']Eroe["']/,
 /\bvar\s+level\s*:\s*int\s*=\s*1\b/,
 /\bvar\s+hp\s*:\s*int\s*=\s*100\b/,
 /\bvar\s+inventory\s*:\s*Array\s*\[\s*String\s*\]/,
 /\bfunc\s+describe\s*\(\s*\)/,/\breturn\b/));
patch(177,{
 'book.gd':[
 'class_name Book','extends RefCounted','',
 'var title: String','var author: String','var pages: int','',
 'func _init(book_title: String, book_author: String, page_count: int) -> void:',
 '    # Usa i tre parametri per inizializzare il libro.',
 '    pass','',
 'func describe() -> String:',
 '    # Restituisci il titolo tra apici singoli, autore e pagine.',
 '    return ""'].join('\n'),
 'main.gd':ready([
 'var count = int(OS.read_string_from_stdin())',
 'var total = 0',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(";")',
 '    var book = Book.new(parts[0], parts[1], int(parts[2]))',
 '    print(book.describe())',
 '    total += book.pages',
 'print("Pagine totali: %d" % total)'])
});
const books=[
 ['Dune;Frank Herbert;412'],
 [],
 ['Il nome della rosa;Umberto Eco;500','1984;George Orwell;328'],
 ['A;Autore A;1','B;Autore B;10','C;Autore C;100'],
 ['Solaris;Stanislaw Lem;204']
];
define(177,books.map((a,i)=>({
 name:'Libreria '+i,stdin:[String(a.length),...a],
 output:[...a.map(line=>{const [t,author,p]=line.split(';');return "'"+t+"' di "+author+', '+p+' pagine';}),
 'Pagine totali: '+a.reduce((sum,l)=>sum+Number(l.split(';')[2]),0)].join('\n')
})),rules(/\bclass_name\s+Book\b/,/\bfunc\s+_init\s*\(/,
 /\bfunc\s+describe\s*\(/,/\btitle\s*=\s*book_title\b/,
 /\bauthor\s*=\s*book_author\b/,/\bpages\s*=\s*page_count\b/,/\breturn\b/));
patch(178,{
 'calculator.gd':[
 'class_name Calculator','extends RefCounted','',
 '# Dichiara result: float = 0.0.',
 'func add(number: float) -> float:',
 '    return 0.0',
 'func subtract(number: float) -> float:',
 '    return 0.0',
 'func multiply(number: float) -> float:',
 '    return 0.0',
 'func divide(number: float) -> float:',
 '    # Gestisci il divisore zero senza modificare result.',
 '    return 0.0',
 'func clear() -> float:',
 '    return 0.0',
 'func get_result() -> float:',
 '    return 0.0'].join('\n'),
 'main.gd':ready([
 'var calc = Calculator.new()',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    var value = 0.0',
 '    match parts[0]:',
 '        "aggiungi":',
 '            value = calc.add(float(parts[1]))',
 '        "sottrai":',
 '            value = calc.subtract(float(parts[1]))',
 '        "moltiplica":',
 '            value = calc.multiply(float(parts[1]))',
 '        "dividi":',
 '            value = calc.divide(float(parts[1]))',
 '        "cancella":',
 '            value = calc.clear()',
 '    print("%s -> %s" % [parts[0], value])',
 'print("Risultato finale: %s" % calc.get_result())'])
});
const operations=[
 ['aggiungi 5','moltiplica 3','sottrai 2','dividi 0','dividi 2'],
 ['aggiungi 10','dividi 4','cancella','aggiungi 9'],
 [],
 ['aggiungi 6','dividi 2','moltiplica 10','sottrai 1'],
 ['aggiungi -2','aggiungi 3','dividi 0','cancella']
];
const decimal=n=>Number.isInteger(n)?n.toFixed(1):String(Number(n.toFixed(5)));
define(178,operations.map((steps,i)=>{
 let value=0,lines=[];
 for(const op of steps){const [command,num]=op.split(' '),x=Number(num);
 if(command==='aggiungi')value+=x;
 if(command==='sottrai')value-=x;
 if(command==='moltiplica')value*=x;
 if(command==='dividi'){
   if(x===0)lines.push('Errore: divisione per zero');
   else value/=x;
 }
 if(command==='cancella')value=0;
 lines.push(command+' -> '+decimal(value));}
 lines.push('Risultato finale: '+decimal(value));
 return{name:'Operazioni '+i,stdin:[String(steps.length),...steps],output:lines.join('\n')};
}),rules(/\bclass_name\s+Calculator\b/,
 /\bvar\s+result\s*:\s*float\s*=\s*0(?:\.0)?\b/,
 /\bfunc\s+add\s*\(/,/\bfunc\s+subtract\s*\(/,
 /\bfunc\s+multiply\s*\(/,/\bfunc\s+divide\s*\(/,
 /\bfunc\s+clear\s*\(/,/\bfunc\s+get_result\s*\(/,
 /\bresult\b/,/\breturn\b/));
patch(179,{
 'bank_account.gd':[
 'class_name BankAccount','extends RefCounted','',
 '# Dichiara interest_percent e account_count come static var int.',
 'var holder: String','var balance: int','',
 'func _init(account_holder: String, start_balance: int) -> void:',
 '    holder = account_holder',
 '    balance = start_balance',
 '    # Incrementa account_count.',
 'func describe() -> String:',
 '    # Stampa holder, balance e il tasso condiviso.',
 '    return ""'].join('\n'),
 'main.gd':ready([
 'var accounts: Array[BankAccount] = []',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    accounts.append(BankAccount.new(parts[0], int(parts[1])))',
 'print("Conti aperti: %d" % BankAccount.account_count)',
 'for account in accounts:',
 '    print(account.describe())',
 'BankAccount.interest_percent = int(OS.read_string_from_stdin())',
 'print("Dopo la modifica del tasso:")',
 'for account in accounts:',
 '    print(account.describe())'])
});
const accountCases=[
 {entries:['Alice 1000','Bob 2000'],newRate:3},
 {entries:[],newRate:8},
 {entries:['Ada 15'],newRate:0},
 {entries:['A 1','B 2','C 3'],newRate:7},
 {entries:['X 0','Y 42'],newRate:10}
];
define(179,accountCases.map(({entries,newRate},i)=>{
 const desc=(rate)=>entries.map(x=>{
 const [name,balance]=x.split(' ');return name+': $'+balance+' at '+rate+'%';});
 return{name:'Conti statici '+i,stdin:[String(entries.length),...entries,String(newRate)],
 output:['Conti aperti: '+entries.length,...desc(2),
 'Dopo la modifica del tasso:',...desc(newRate)].join('\n')};
}),rules(/\bclass_name\s+BankAccount\b/,
 /\bstatic\s+var\s+interest_percent\s*:\s*int\s*=\s*2\b/,
 /\bstatic\s+var\s+account_count\s*:\s*int\s*=\s*0\b/,
 /\bfunc\s+_init\s*\(/,/\baccount_count\b/,/\bfunc\s+describe\s*\(/));
patch(180,{
 'grader.gd':[
 'class_name Grader','extends RefCounted','',
 'static func letter(points: int) -> String:',
 '    # A (90), B (80), C (70), D (60), F.',
 '    return ""',
 'static func is_passing(points: int) -> bool:',
 '    # Almeno 60 punti.',
 '    return false'].join('\n'),
 'student.gd':[
 'class_name Student','extends RefCounted','',
 'var student_name: String','var score: int','',
 'func _init(new_name: String, new_score: int) -> void:',
 '    student_name = new_name',
 '    score = new_score',
 'static func from_line(line: String) -> Student:',
 '    # Crea un nuovo studente a partire da "Nome 91".',
 '    return Student.new("", 0)',
 'func report() -> String:',
 '    # Usa Grader.letter(score) e Grader.is_passing(score).',
 '    return ""'].join('\n'),
 'main.gd':ready([
 'var count = int(OS.read_string_from_stdin())',
 'var passed = 0',
 'for i in count:',
 '    var student = Student.from_line(OS.read_string_from_stdin())',
 '    print(student.report())',
 '    if Grader.is_passing(student.score):',
 '        passed += 1',
 'print("Promossi: %d su %d" % [passed, count])'])
});
const marks=[
 ['Ada 91','Bo 42','Cy 75'],
 [],
 ['L 59','M 60','N 69'],
 ['A 70','B 80','C 90','D 100'],
 ['X 0','Y 85','Z 99']
];
const grade=n=>n>=90?'A':n>=80?'B':n>=70?'C':n>=60?'D':'F';
define(180,marks.map((a,i)=>{
 let passed=0;
 const out=a.map(s=>{
 const [name,raw]=s.split(' '),score=Number(raw);
 if(score>=60)passed++;
 return name+': '+score+' ('+grade(score)+'), '+(score>=60?'promosso':'non promosso');
 });
 return{name:'Valutazione classi '+i,stdin:[String(a.length),...a],
 output:[...out,'Promossi: '+passed+' su '+a.length].join('\n')};
}),files=>{
 const source=typeof files==='string'?files:
 Object.values(files).join('\n');
 return rules(/\bclass_name\s+Grader\b/,
 /\bclass_name\s+Student\b/,/\bstatic\s+func\s+letter\s*\(/,
 /\bstatic\s+func\s+is_passing\s*\(/,
 /\bstatic\s+func\s+from_line\s*\(/,
 /\bfunc\s+report\s*\(/,/\bGrader\.letter\s*\(/)(source);
});
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 176:['Ada','4','colpisci 30','item spada','level','item scudo'],
 177:['1','Dune;Frank Herbert;412'],
 178:['5','aggiungi 5','moltiplica 3','sottrai 2','dividi 0','dividi 2'],
 179:['2','Alice 1000','Bob 2000','3'],
 180:['3','Ada 91','Bo 42','Cy 75']});
window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();