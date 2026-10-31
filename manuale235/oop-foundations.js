/* Lezioni 171–175: fondamenti OOP con file classe separati.
 * main.gd è un test driver immutabile; tutte le prove lo eseguono
 * con classi elaborate da Godot WebAssembly e input differenti.
 */
(() => {
 'use strict';
 const allLessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
 if(allLessons.length!==235||!verifier)throw Error('Catalogo incompleto');
 const get=n=>{const l=allLessons.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione OOP mancante: '+n);return l;};
 const replace=(n,files)=>{
   const l=get(n);
   l.sourceFiles=files;
   const names=Object.keys(files).filter(n=>n!=='main.gd');
   l.initialCode=files[names[0]];
   l.starterCode=l.initialCode;
   l.requiresMultipleFiles=true;
 };
 const clean=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
 const matches=(...re)=>s=>re.every(p=>p.test(clean(s)));
 const define=(n,cases,proof)=>{
   const l=get(n);
   verifier.expectedCases[n]=cases;
   l.manualSourceCheck=proof;
   l.expectedOutput=cases[0].output;
   l.validationReady=true;
 };
 const mainReady=body=>[
   'extends Node','','func _ready():',
   ...body.map(s=>'    '+s)
 ].join('\n');
 const read='String(JavaScriptBridge.eval("window.__gdhManualReadStdin()"))';
 const lines171=[
   'var count = int(OS.read_string_from_stdin())',
   'for i in count:',
   '    print(Greeter.greet(OS.read_string_from_stdin()))'
 ];
 replace(171,{
   'greeter.gd':[
     'class_name Greeter','extends RefCounted','',
     'static func greet(player_name: String) -> String:',
     '    # Scrivi qui il saluto, includendo il caso del nome vuoto.',
     '    return ""'
   ].join('\n'),
   'main.gd':mainReady(lines171)
 });
 const greet=n=>n===''?'Ciao, friend!':'Ciao, '+n+'!';
 const names=[['Ada',''],['Luca','Mara','Giulia'],[''],[],['Omar','Nina']];
 define(171,names.map((a,i)=>({
   name:'Saluti '+(i+1),stdin:[String(a.length),...a],
   output:a.map(greet).join('\n')
 })),matches(/\bclass_name\s+Greeter\b/,/\bextends\s+RefCounted\b/,
   /\bstatic\s+func\s+greet\s*\(\s*player_name\s*:\s*String\s*\)/,
   /\breturn\b/,/\bplayer_name\b/));

 replace(172,{
   'car.gd':[
     '# Crea una classe globale Car che estende RefCounted.',
     '# Definisci brand come String con valore "Generic".',
     '# Definisci ruote come int con valore 4.'
   ].join('\n'),
   'main.gd':mainReady([
     'var count = int(OS.read_string_from_stdin())',
     'var garage: Array[Car] = []',
     'for i in count:',
     '    garage.append(Car.new())',
     'var total = 0',
     'for car in garage:',
     '    total += car.ruote',
     'print("Auto: %d" % garage.size())',
     'print("Ruote: %d" % total)',
     'if count > 0:',
     '    garage[0].brand = OS.read_string_from_stdin()',
     '    print("Prima auto: %s" % garage[0].brand)',
     '    print("Ultima auto: %s" % garage[-1].brand)'
   ])
 });
 const garage=[{n:3,brand:'Tesla'},{n:1,brand:'Fiat'},{n:0},
   {n:4,brand:'Honda'},{n:2,brand:'Alfa'}];
 define(172,garage.map(({n,brand},i)=>({
   name:'Garage '+(i+1),stdin:n>0?[String(n),brand]:['0'],
   output:['Auto: '+n,'Ruote: '+4*n,
     ...(n>0?['Prima auto: '+brand,'Ultima auto: '+(n===1?brand:'Generic')]:[])].join('\n')
 })),matches(/\bclass_name\s+Car\b/,/\bextends\s+RefCounted\b/,
   /\bvar\s+brand\s*:\s*String\s*=\s*["']Generic["']/,
   /\bvar\s+ruote\s*:\s*int\s*=\s*4\b/));

 replace(173,{
   'student.gd':[
     'class_name Student','extends RefCounted','',
     '# Dichiara SCHOOL = "Godot High School" e le proprietà.',
     '# student_name: String, grade: String = "N/A".'
   ].join('\n'),
   'main.gd':mainReady([
     'var count = int(OS.read_string_from_stdin())',
     'var students: Array[Student] = []',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ", false)',
     '    var student = Student.new()',
     '    student.student_name = parts[0]',
     '    if parts.size() > 1:',
     '        student.grade = parts[1]',
     '    students.append(student)',
     'print("Scuola: %s" % Student.SCHOOL)',
     'for student in students:',
     '    print("%s ha il voto %s" % [student.student_name, student.grade])'
   ])
 });
 const studentInputs=[['Alice A','Bob'],[],['Anna B'],['Leo C','Eva B','Tom'],['Uno','Due D']];
 define(173,studentInputs.map((a,i)=>({
   name:'Registro '+(i+1),stdin:[String(a.length),...a],
   output:['Scuola: Godot High School',
     ...a.map(s=>{
       const [name,grade]=s.split(' ');
       return name+' ha il voto '+(grade||'N/A');
     })].join('\n')
 })),matches(/\bclass_name\s+Student\b/,/\bextends\s+RefCounted\b/,
   /\bconst\s+SCHOOL\s*=\s*["']Godot High School["']/,
   /\bvar\s+student_name\s*:\s*String\b/,
   /\bvar\s+grade\s*:\s*String\s*=\s*["']N\/A["']/));

 replace(174,{
   'car.gd':[
     'class_name Car','extends RefCounted','',
     'var year: int = 0','var make: String = ""','var model: String = ""','',
     'func set_info(year: int, make: String, model: String) -> void:',
     '    # Assegna i valori alle proprietà usando self.',
     '    pass','',
     'func describe() -> String:',
     '    # Restituisci il modello completo con il formato richiesto.',
     '    return ""'
   ].join('\n'),
   'main.gd':mainReady([
     'var count = int(OS.read_string_from_stdin())',
     'var cars: Array[Car] = []',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ")',
     '    var car = Car.new()',
     '    car.set_info(int(parts[0]), parts[1], parts[2])',
     '    cars.append(car)',
     'for car in cars:',
     '    print(car.describe())'
   ])
 });
 const cars=[
   ['2020 Toyota Corolla'],[],
   ['1999 Fiat Panda','2025 Tesla Model3'],
   ['2015 Ford Focus'],
   ['2000 Honda Civic','2001 Honda Jazz','2022 Alfa Giulia']
 ];
 define(174,cars.map((a,i)=>({
   name:'Schede auto '+(i+1),stdin:[String(a.length),...a],
   output:a.map(s=>'Questa auto è una '+s).join('\n')
 })),matches(/\bclass_name\s+Car\b/,
   /\bfunc\s+set_info\s*\(/,/\bfunc\s+describe\s*\(/,
   /\bself\.year\s*=\s*year\b/,/\bself\.make\s*=\s*make\b/,
   /\bself\.model\s*=\s*model\b/,
   /\breturn\b/));

 replace(175,{
   'bank_account.gd':[
     'class_name BankAccount','extends RefCounted','',
     'var balance: int = 0','',
     'func deposit(amount: int) -> void:',
     '    # Aggiungi amount al saldo.',
     '    pass','',
     'func withdraw(amount: int) -> bool:',
     '    # Restituisci false senza modificare il saldo se insufficiente.',
     '    return false','',
     'func get_balance() -> int:',
     '    # Restituisci il saldo.',
     '    return 0'
   ].join('\n'),
   'main.gd':mainReady([
     'var account = BankAccount.new()',
     'var count = int(OS.read_string_from_stdin())',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ")',
     '    var amount = int(parts[1])',
     '    if parts[0] == "deposita":',
     '        account.deposit(amount)',
     '        print("Depositati %d" % amount)',
     '    elif account.withdraw(amount):',
     '        print("Prelevati %d" % amount)',
     '    else:',
     '        print("Denaro insufficiente per %d" % amount)',
     'print("Saldo attuale: %d $" % account.get_balance())'
   ])
 });
 const transactions=[
   ['deposita 50','preleva 80'],
   ['deposita 100','preleva 35','preleva 65'],
   [],
   ['preleva 1','deposita 10','preleva 4'],
   ['deposita 20','deposita 7','preleva 3','preleva 200']
 ];
 const bankOutput=a=>{
   let balance=0,out=[];
   for(const entry of a){
     const [verb,amountStr]=entry.split(' '),amount=Number(amountStr);
     if(verb==='deposita'){balance+=amount;out.push('Depositati '+amount);}
     else if(balance>=amount){balance-=amount;out.push('Prelevati '+amount);}
     else out.push('Denaro insufficiente per '+amount);
   }
   return [...out,'Saldo attuale: '+balance+' $'].join('\n');
 };
 define(175,transactions.map((a,i)=>({
   name:'Operazioni bancarie '+(i+1),stdin:[String(a.length),...a],
   output:bankOutput(a)
 })),matches(/\bclass_name\s+BankAccount\b/,
   /\bfunc\s+deposit\s*\(/,/\bfunc\s+withdraw\s*\(/,
   /\bfunc\s+get_balance\s*\(/,
   /\bbalance\s*\+=\s*amount\b|\bbalance\s*=\s*balance\s*\+\s*amount\b/,
   /\breturn\s+(?:true|false|balance)\b/));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   171:['2','Ada',''],172:['3','Tesla'],173:['2','Alice A','Bob'],
   174:['1','2020 Toyota Corolla'],175:['2','deposita 50','preleva 80']
 });
 window.GDHManualMigration.validated=allLessons.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();