/* Lezioni 168–170: tre sfide finali, con dati di prova diversi,
 * validazione eseguita dal motore Godot e verifiche sui risultati.
 */
(() => {
 'use strict';
 const data=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(data.length!==235||!verify)throw Error('Manuale non pronto');
 const get=n=>{const l=data.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione '+n+' mancante');return l;};
 const patch=(n,s)=>{
   const l=get(n);l.initialCode=s;l.starterCode=s;
   l.sourceFiles={...l.sourceFiles,'main.gd':s};
 };
 const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 const all=(...r)=>s=>r.every(p=>p.test(active(s)));
 const define=(n,cases,check)=>{
   const l=get(n);verify.expectedCases[n]=cases;
   l.manualSourceCheck=check;l.expectedOutput=cases[0].output||'Prova completa';
   l.validationReady=true;
 };

 patch(168,[
   'extends Node','','func _ready():',
   '    var n = int(OS.read_string_from_stdin())',
   '    # Leggi n contatti nel formato nome,email,telefono.',
   '    # Pulisci indirizzo e cifre, filtra dati errati e duplicati.',
   '    # Stampa i contatti conservati e il conteggio finale.',
   '    pass'
 ].join('\n'));
 const contactCases=[
   ['John Doe,JOHN@email.com,123-456-7890',
     'Jane Doe,jane@email.com,123.456.7890',
     'Bob Smith,invalid.email,12345'],
   ['Ada,ADA@example.com,(555) 123-4567',
     'Bia,bia@example.com,555.000.1111',
     'Cia,ada@EXAMPLE.com,9999999999',
     'Dia,dia@example.com,5550001111'],
   ['X,invalid,1234567890','Y,y@email.com,123',
     'Z,z@email.com,1234567890'],
   [],
   ['P,p@example.com,1112223333',
     'Q,q@example.com,1112224444',
     'R,r@example.com,2223334444']
 ];
 const contactsResult=rows=>{
   const out=[],emails=new Set(),phones=new Set();
   for(const line of rows){
     const [name,mail,phone]=line.split(',');
     const email=mail.toLowerCase();
     const digits=phone.replace(/\D/g,'');
     if(!email.includes('@')||!email.includes('.')||email.includes(' ')||
       digits.length!==10||emails.has(email)||phones.has(digits))continue;
     emails.add(email);phones.add(digits);
     out.push(name+' | '+email+' | '+digits);
   }
   out.push('Contatti conservati: '+emails.size+' su '+rows.length);
   return out.join('\n');
 };
 define(168,contactCases.map((rows,i)=>({
   name:'Rubrica ripulita '+(i+1),stdin:[String(rows.length),...rows],
   output:contactsResult(rows)
 })),all(/\bvar\s+n\s*=\s*int\s*\(\s*OS\.read_string_from_stdin\s*\(\s*\)\s*\)/,
   /\bfor\b|\bwhile\b/,/\.to_lower\s*\(\s*\)/,
   /\bOS\.read_string_from_stdin\s*\(/,
   /(?:is_valid_int|>=\s*["']0["']|[0-9]|\.contains)\b/,
   /\bprint\s*\(/));

 patch(169,[
   'extends Node','','func analyze_text(text: String):',
   '    # Scrivi la normalizzazione, il conteggio delle parole,',
   '    # le ripetizioni e i palindromi unici, ordinati.',
   '    pass',
   '',
   'func _ready():',
   '    var text = OS.read_string_from_stdin()',
   '    print(analyze_text(text))'
 ].join('\n'));
 const textInputs=[
   'Anna vede otto. Ada dice ciao ciao a ingegni oggi.',
   'Ciao, CIAO! Mondo. mondo?',
   '',
   'Osso casa osso radar radar testa',
   'A a a',
   'Rosa vento'
 ];
 const parseWords=txt=>{
   const cleaned=txt.toLowerCase().replace(/[.,!?:;"()]/g,'');
   return cleaned.split(/\s+/).filter(Boolean);
 };
 const wordReport=txt=>{
   const words=parseWords(txt),counts=new Map();
   for(const w of words)counts.set(w,(counts.get(w)||0)+1);
   const keys=[...counts.keys()];
   return{
     unique_count:keys.length,
     repeated_words:keys.filter(k=>counts.get(k)>1).sort(),
     palindromes:keys.filter(k=>k===k.split('').reverse().join('')).sort()
   };
 };
 define(169,textInputs.map((txt,i)=>({
   name:'Analisi parole '+i,stdin:[txt],
   object:wordReport(txt),
   output:JSON.stringify(wordReport(txt))
 })),all(/\bfunc\s+analyze_text\s*\(\s*text\s*:\s*String\s*\)/,
   /\.to_lower\s*\(\s*\)/,/\bfor\b|\bwhile\b/,
   /\.sort\s*\(\s*\)|\.sort_custom\s*\(/,
   /\bunique_count\b/,/\brepeated_words\b/,/\bpalindromes\b/,
   /\breturn\b/));

 const last=get(170);
 last.task=last.task.replace('Un record ha tre','Ogni record ha tre');
 patch(170,[
   'extends Node','','func _ready():',
   '    var n = int(OS.read_string_from_stdin())',
   '    # Leggi i record ID;voti separati da virgole;materie.',
   '    # Usa all() per ammettere solo gli studenti con voti > 70.',
   '    # Stampa medie e conteggio delle materie in ordine di apparizione.',
   '    pass'
 ].join('\n'));
 const recordCases=[
   ['S123;88,92,85;Matematica,Scienze,Storia',
     'S124;65,95,80;Matematica,Scienze,Inglese',
     'S125;91,89,92;Matematica,Fisica,Storia'],
   ['A;70,90;Fisica,Storia',
     'B;71,71;Arte,Fisica',
     'C;100,90;Arte,Storia'],
   [],
   ['G1;10,20;Biologia',
     'G2;70,100;Fisica'],
   ['AA;100;Musica',
     'BB;90,80;Musica,Storia',
     'CC;75,75,75;Storia,Informatica'],
   ['X;90,90;A,B',
     'Y;95,75;B,C',
     'Z;70,99;D']
 ];
 const report=rows=>{
   const eligible=[],subjects=new Map();
   for(const line of rows){
     const [id,gradeRaw,subjectRaw]=line.split(';');
     const grades=gradeRaw.split(',').map(Number);
     if(!grades.every(x=>x>70))continue;
     eligible.push(id+': '+(grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2));
     for(const subject of subjectRaw.split(','))
       subjects.set(subject,(subjects.get(subject)||0)+1);
   }
   return ['Studenti idonei: '+eligible.length,...eligible,'Materie:',
     ...[...subjects].map(([subject,count])=>subject+': '+count)].join('\n');
 };
 define(170,recordCases.map((rows,i)=>({
   name:'Trasformazione dati '+i,stdin:[String(rows.length),...rows],
   output:report(rows)
 })),all(/\bOS\.read_string_from_stdin\s*\(/,
   /\.all\s*\(\s*func\s*\(/,/\b70\b/,/\bfor\b|\bwhile\b/,
   /\.split\s*\(\s*["'];["']\s*\)/,
   /\bprint\s*\(/));

 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   168:[String(contactCases[0].length),...contactCases[0]],
   169:[textInputs[0]],
   170:[String(recordCases[0].length),...recordCases[0]]
 });
 window.GDHManualMigration.validated=data.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();