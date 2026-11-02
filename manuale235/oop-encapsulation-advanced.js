/* Lezioni 196–200: incapsulamento, proprietà e registro scolastico.
 * Ogni attività usa Godot WebAssembly 4.5.1 con più input reali;
 * main.gd è fornito e resta di sola lettura.
 */
(() => {
'use strict';
const allLessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
if(allLessons.length!==235||!verifier)throw Error('Manuale 235 mancante');
const byNumber=n=>{const l=allLessons.find(x=>x.manualLessonNumber===n);
 if(!l)throw Error('Lezione mancante '+n);return l;};
const setup=(n,files)=>{
 const l=byNumber(n);
 l.sourceFiles=files;l.readOnlyFiles=['main.gd'];
 l.initialCode=files[Object.keys(files).find(name=>name!=='main.gd')];
 l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const main=lines=>['extends Node','','func _ready():',
 ...lines.map(line=>'    '+line)].join('\n');
const codeOnly=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
const includes=(...patterns)=>s=>patterns.every(pattern=>pattern.test(codeOnly(s)));
const activate=(n,cases,check)=>{
 if(cases.length<5)throw Error('Pochi test per '+n);
 const l=byNumber(n);l.manualSourceCheck=check;verifier.expectedCases[n]=cases;
 l.expectedOutput=cases[0].output;l.validationReady=true;
};

// 196: _xp e _level sono privati per convenzione, il livello viene
// calcolato dopo ogni variazione, compresi salti di più livelli.
setup(196,{
 'hero.gd':[
  'class_name Hero','extends RefCounted','',
  'var hero_name: String',
  '# Aggiungi _xp: int = 0 e _level: int = 1.','',
  'func _init(new_name: String) -> void:',
  '    hero_name = new_name','',
  'func gain_xp(amount: int) -> bool:',
  '    # Somma i PE, chiama _update_level e confronta il livello precedente.',
  '    return false','',
  'func get_xp() -> int:',
  '    return 0','',
  'func get_level() -> int:',
  '    return 0','',
  '# Scrivi _update_level(): 1 + divisione intera di _xp per 100.'
 ].join('\n'),
 'main.gd':main([
  'var hero = Hero.new(OS.read_string_from_stdin())',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var amount = int(OS.read_string_from_stdin())',
  '    if hero.gain_xp(amount):',
  '        print("Nuovo livello! %s ora è al livello %d" % [hero.hero_name, hero.get_level()])',
  '    print("%s: %d PE, livello %d" % [hero.hero_name, hero.get_xp(), hero.get_level()])'
 ])
});
const heroScenarios=[
 ['Ada',[40,70,250]],
 ['Leo',[]],
 ['Mia',[0,99,1,0,101]],
 ['Teo',[100,100,100]],
 ['Lia',[350,0,49,1]],
 ['Bo',[25,25,25,25,75]]
];
activate(196,heroScenarios.map(([name,values],i)=>{
 let xp=0,level=1,output=[];
 for(const value of values){
  const old=level;xp+=value;level=1+Math.trunc(xp/100);
  if(level>old)output.push('Nuovo livello! '+name+' ora è al livello '+level);
  output.push(name+': '+xp+' PE, livello '+level);
 }
 return{name:'Progressione eroe '+(i+1),stdin:[name,String(values.length),...values.map(String)],
  output:output.join('\n')};
}),includes(
 /\bclass_name\s+Hero\b/,/\bvar\s+_xp\s*:\s*int\s*=\s*0\b/,
 /\bvar\s+_level\s*:\s*int\s*=\s*1\b/,/\bfunc\s+_update_level\s*\(/,
 /\bfunc\s+gain_xp\s*\(/,/\bfunc\s+get_xp\s*\(/,
 /\bfunc\s+get_level\s*\(/,/_update_level\s*\(\s*\)/,
 /\breturn\b/));

// 197: il PDF mescola il valore iniziale "spento" e "off".
// Il testo originale richiede off e i valori heat/cool/off.
setup(197,{
 'thermostat.gd':[
  'class_name Thermostat','extends RefCounted','',
  'var last_error: String = ""','',
  'var target: int = 20:',
  '    set(value):',
  '        # Accetta soltanto 10..30, altrimenti conserva il vecchio valore.',
  '        pass','',
  'var mode: String = "off":',
  '    set(value):',
  '        # Accetta soltanto heat, cool e off.',
  '        pass','',
  'func _init(start_target: int) -> void:',
  '    # L’assegnazione usa necessariamente il setter.',
  '    pass'
 ].join('\n'),
 'main.gd':[
  'extends Node','',
  'func _ready():',
  '    var thermostat = Thermostat.new(int(OS.read_string_from_stdin()))',
  '    report(thermostat)',
  '    var count = int(OS.read_string_from_stdin())',
  '    for i in count:',
  '        var parts = OS.read_string_from_stdin().split(" ")',
  '        if parts[0] == "target":',
  '            thermostat.target = int(parts[1])',
  '        else:',
  '            thermostat.mode = parts[1]',
  '        report(thermostat)','',
  'func report(thermostat: Thermostat) -> void:',
  '    if thermostat.last_error != "":',
  '        print("Rifiutato: " + thermostat.last_error)',
  '    print("Bersaglio %d, modalità %s" % [thermostat.target, thermostat.mode])'
 ].join('\n')
});
const thermostatCases=[
 {start:22,commands:['target 35','mode cool']},
 {start:5,commands:['target 30','target 9','mode heat']},
 {start:30,commands:['mode turbo','mode off','target 10']},
 {start:20,commands:[]},
 {start:11,commands:['mode cool','mode hot','target 25','target 31']},
 {start:35,commands:['mode heat','target 15','mode off']}
];
const thermostatRun=(start,commands)=>{
 let target=20,mode='off',error='';
 const setTarget=n=>{
   if(n>=10&&n<=30){target=n;error='';}
   else error='Target must be between 10 and 30';
 };
 const setMode=value=>{
   if(['heat','cool','off'].includes(value)){mode=value;error='';}
   else error='Sconosciuto mode: '+value;
 };
 const output=[];const report=()=>{
   if(error)output.push('Rifiutato: '+error);
   output.push('Bersaglio '+target+', modalità '+mode);
 };
 setTarget(start);report();
 for(const command of commands){
  const [kind,value]=command.split(' ');
  if(kind==='target')setTarget(Number(value));else setMode(value);
  report();
 }
 return output.join('\n');
};
activate(197,thermostatCases.map(({start,commands},i)=>({
 name:'Termostato '+(i+1),stdin:[String(start),String(commands.length),...commands],
 output:thermostatRun(start,commands)
})),s=>{
 const src=codeOnly(s);
 return includes(/\bclass_name\s+Thermostat\b/,
  /\bvar\s+target\s*:\s*int\s*=\s*20\s*:/,
  /\bvar\s+mode\s*:\s*String\s*=\s*["']off["']\s*:/,
  /\blast_error\b/,/\bfunc\s+_init\s*\(/)(s)&&
  (src.match(/\bset\s*\(\s*value\s*\)/g)||[]).length>=2&&
  /heat/.test(src)&&/cool/.test(src)&&/off/.test(src);
});
const thermo=byNumber(197);
thermo.task=thermo.task.replace('mode (inizia da off )','mode (inizia da off )');

// 198: get_titles deve restituire una COPIA, non la lista privata.
// Le operazioni rispettano anche l'ordine e titoli con spazi.
setup(198,{
 'playlist.gd':[
  'class_name Playlist','extends RefCounted','',
  'var _songs: Array[String] = []','',
  'func add(title: String) -> bool:',
  '    # Se esiste già, restituisci false e lascia invariata la lista.',
  '    return false','',
  'func remove(title: String) -> bool:',
  '    return false','',
  'func count() -> int:',
  '    return 0','',
  'func get_titles() -> Array[String]:',
  '    # ATTENZIONE: il chiamante modifica l’Array che restituisci.',
  '    return []'
 ].join('\n'),
 'main.gd':main([
  'var playlist = Playlist.new()',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ", true, 1)',
  '    var title = parts[1]',
  '    if parts[0] == "aggiungi":',
  '        if playlist.add(title):',
  '            print("Aggiunto: " + title)',
  '        else:',
  '            print("Già presente nella playlist: " + title)',
  '    elif playlist.remove(title):',
  '        print("Rimosso: " + title)',
  '    else:',
  '        print("Non trovato: " + title)',
  'var titles = playlist.get_titles()',
  'titles.append("Intruder")',
  'titles.reverse()',
  'print("Brani: %d" % playlist.count())',
  'print(", ".join(playlist.get_titles()))'
 ])
});
const playlistCases=[
 ['aggiungi Blue Sky','aggiungi Rain','aggiungi Blue Sky'],
 ['aggiungi A','aggiungi B','rimuovi A','aggiungi A'],
 [],
 ['rimuovi Never','aggiungi Blue','rimuovi Blue','rimuovi Blue'],
 ['aggiungi One More Time','aggiungi Second Song','aggiungi Third','rimuovi Second Song'],
 ['aggiungi Alpha','aggiungi Beta','aggiungi Gamma','rimuovi Alpha','aggiungi Delta']
];
const simulatePlaylist=commands=>{
 const items=[],output=[];
 for(const line of commands){
  const sep=line.indexOf(' '),cmd=line.slice(0,sep),title=line.slice(sep+1);
  if(cmd==='aggiungi'){
   if(items.includes(title))output.push('Già presente nella playlist: '+title);
   else{items.push(title);output.push('Aggiunto: '+title);}
  }else{
   const i=items.indexOf(title);
   if(i<0)output.push('Non trovato: '+title);
   else{items.splice(i,1);output.push('Rimosso: '+title);}
  }
 }
 output.push('Brani: '+items.length);
 output.push(items.join(', '));
 return output.join('\n');
};
activate(198,playlistCases.map((commands,i)=>({
 name:'Playlist privata '+(i+1),stdin:[String(commands.length),...commands],
 output:simulatePlaylist(commands)
})),includes(/\bclass_name\s+Playlist\b/,
 /\bvar\s+_songs\s*:\s*Array\s*\[\s*String\s*\]/,
 /\bfunc\s+add\s*\(/,/\bfunc\s+remove\s*\(/,
 /\bfunc\s+count\s*\(/,/\bfunc\s+get_titles\s*\(/,
 /\.duplicate\s*\(/));
const pl=byNumber(198);
pl.task=pl.task.replace(/\badd Blue Sky\b/g,'aggiungi Blue Sky')
 .replace(/\badd Rain\b/g,'aggiungi Rain')
 .replace(/\bremove Blue Sky\b/g,'rimuovi Blue Sky')
 .replace(/\bSongs: 2\b/g,'Brani: 2')
 .replace(/comando per riga \( add Blue Sky o remove Blue Sky \)/,
  'comando per riga (aggiungi Blue Sky o rimuovi Blue Sky)');

// 199: i getter calcolano i dati ad ogni accesso e non devono lasciare
// che la scrittura esterna cambi id e importi.
setup(199,{
 'order.gd':[
  'class_name Order','extends RefCounted','',
  'var _id: int','var _line_totals: Array[int] = []','',
  '# Aggiungi i blocchi get: a ciascuna delle quattro proprietà.',
  'var order_id: int',
  'var subtotal: int',
  'var shipping: int',
  'var total: int','',
  'func _init(id: int) -> void:',
  '    _id = id','',
  'func add_item(price: int, quantity: int) -> void:',
  '    _line_totals.append(price * quantity)'
 ].join('\n'),
 'main.gd':main([
  'var order = Order.new(int(OS.read_string_from_stdin()))',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    order.add_item(int(parts[0]), int(parts[1]))',
  '    print("Subtotale %d, spedizione %d, totale %d" % [order.subtotal, order.shipping, order.total])',
  '# La prova tenta di cambiare i valori pubblici: i getter devono proteggere il calcolo.',
  'order.order_id = 0',
  'order.subtotal = 0',
  'order.shipping = 0',
  'order.total = 0',
  'print("Ordine n. %d: %d" % [order.order_id, order.total])'
 ])
});
const orders=[
 {id:7,items:[[12,2],[30,1]]},
 {id:1,items:[]},
 {id:99,items:[[10,5],[1,1]]},
 {id:4,items:[[0,3],[49,1]]},
 {id:35,items:[[11,4],[5,1],[1,2]]},
 {id:100,items:[[50,1],[40,0]]}
];
activate(199,orders.map(({id,items},i)=>{
 let subtotal=0,lines=[];
 for(const [price,q] of items){
  subtotal+=price*q;const ship=subtotal>=50?0:5;
  lines.push('Subtotale '+subtotal+', spedizione '+ship+', totale '+(subtotal+ship));
 }
 lines.push('Ordine n. '+id+': '+(subtotal+(subtotal>=50?0:5)));
 return{name:'Ordine '+(i+1),stdin:[String(id),String(items.length),...items.map(x=>x.join(' '))],
  output:lines.join('\n')};
}),s=>{
 const source=codeOnly(s);
 return includes(/\bclass_name\s+Order\b/,
 /\bvar\s+order_id\s*:\s*int\s*:/,
 /\bvar\s+subtotal\s*:\s*int\s*:/,
 /\bvar\s+shipping\s*:\s*int\s*:/,
 /\bvar\s+total\s*:\s*int\s*:/,
 /\b_line_totals\b/,/\b_id\b/)(s)&&
 (source.match(/\bget\s*:/g)||[]).length>=4;
});
const order=byNumber(199);
order.task=order.task.replace('Order #7: 54','Ordine n. 7: 54');

// 200: registro degli studenti. Nel PDF la sezione main.gd è tagliata
// e combina "rename" e "rinomina", "remove" e "rimuovi":
// il driver viene ricostruito con i comandi IT della consegna.
setup(200,{
 'student.gd':[
  'class_name Student','extends RefCounted','',
  'var last_error: String = ""',
  '# Dichiara i campi privati _id e _grades.',
  'var student_id: int:',
  '    get:',
  '        return 0',
  'var student_name: String = "":',
  '    set(value):',
  '        # Accetta nomi di almeno due caratteri e aggiorna last_error.',
  '        pass',
  'var average: float:',
  '    get:',
  '        # Media dei voti in _grades, oppure 0.0 quando vuoto.',
  '        return 0.0','',
  'func _init(id: int, new_name: String) -> void:',
  '    # Salva l’ID e assegna il nome attraverso il setter.',
  '    pass','',
  'func add_grade(course: String, grade: int) -> bool:',
  '    return false','',
  'func course_count() -> int:',
  '    return 0'
 ].join('\n'),
 'student_registry.gd':[
  'class_name StudentRegistry','extends RefCounted','',
  '# Dichiara il Dictionary privato degli studenti.',
  'func add_student(student: Student) -> bool:',
  '    return false','',
  'func remove_student(id: int) -> bool:',
  '    return false','',
  'func get_student(id: int) -> Student:',
  '    return null','',
  'func top_student() -> Student:',
  '    # In caso di pareggio vince chi è stato inserito per primo.',
  '    return null','',
  'func get_ids() -> Array:',
  '    # Restituisci gli ID nell’ordine di inserimento.',
  '    return []'
 ].join('\n'),
 'main.gd':[
  'extends Node','',
  'func _ready():',
  '    var registry = StudentRegistry.new()',
  '    var count = int(OS.read_string_from_stdin())',
  '    for i in count:',
  '        var parts = OS.read_string_from_stdin().split(" ", true, 2)',
  '        var command = parts[0]',
  '        if command == "migliori":',
  '            var best = registry.top_student()',
  '            if best == null:',
  '                print("Migliore: nessuno")',
  '            else:',
  '                print("Migliore: %s (%.2f)" % [best.student_name, best.average])',
  '            continue',
  '        if command == "elenca":',
  '            for listed_id in registry.get_ids():',
  '                print_student(registry.get_student(listed_id))',
  '            continue',
  '        var id = int(parts[1])',
  '        if command == "aggiungi":',
  '            var student = Student.new(id, parts[2])',
  '            if student.last_error != "":',
  '                print("Rifiutato: " + student.last_error)',
  '            elif registry.add_student(student):',
  '                print("Aggiunto %s (%d)" % [student.student_name, id])',
  '            else:',
  '                print("ID duplicato: %d" % id)',
  '            continue',
  '        if command == "rimuovi":',
  '            if registry.remove_student(id):',
  '                print("Rimosso %d" % id)',
  '            else:',
  '                print("Nessuno studente %d" % id)',
  '            continue',
  '        var student = registry.get_student(id)',
  '        if student == null:',
  '            print("Nessuno studente %d" % id)',
  '        elif command == "voto":',
  '            var grade_parts = parts[2].split(" ")',
  '            if student.add_grade(grade_parts[0], int(grade_parts[1])):',
  '                print("%s: %s = %s" % [student.student_name, grade_parts[0], grade_parts[1]])',
  '            else:',
  '                print("Voto non valido: " + grade_parts[1])',
  '        elif command == "rinomina":',
  '            student.student_name = parts[2]',
  '            if student.last_error != "":',
  '                print("Rifiutato: " + student.last_error)',
  '            else:',
  '                print("Rinominato in " + student.student_name)',
  '        elif command == "manometti":',
  '            student.student_id = 0',
  '            student.average = 100.0',
  '            print_student(student)',
  '        else:',
  '            print_student(student)','',
  'func print_student(student: Student) -> void:',
  '    print("ID: %d, Nome: %s, Corsi: %d, Media: %.2f" % [',
  '        student.student_id, student.student_name, student.course_count(), student.average])'
 ].join('\n')
});
const studentCases=[
 ['aggiungi 1001 Alice Smith','aggiungi 1002 Bob','voto 1001 Matematica 90',
  'voto 1001 Arte 85','voto 1002 Matematica 95','voto 1002 Arte 120',
  'rinomina 1002 B','mostra 1002','migliori','elenca'],
 [],
 ['migliori','elenca','aggiungi 1 A','aggiungi 1 Ada','aggiungi 1 Bob',
  'migliori','mostra 1'],
 ['aggiungi 1 Mia','aggiungi 2 Leo','voto 1 Mat 80','voto 2 Mat 80',
  'migliori','rimuovi 1','migliori','elenca'],
 ['aggiungi 7 Emma','voto 7 A 30','voto 7 A 90','voto 7 B -1',
  'manometti 7','mostra 7','rinomina 7 Alessia','elenca'],
 ['rimuovi 5','voto 5 Mat 70','aggiungi 5 Ira','voto 5 Mat 101',
  'voto 5 Mat 0','mostra 5','rimuovi 5','migliori','elenca']
];
const simulateStudents=commands=>{
 const records=new Map(),out=[];
 const avg=r=>{
  const scores=[...r.grades.values()];
  return scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;
 };
 const display=r=>'ID: '+r.id+', Nome: '+r.name+', Corsi: '+r.grades.size+
  ', Media: '+avg(r).toFixed(2);
 for(const line of commands){
  const [action,idRaw,...more]=line.split(' '),id=Number(idRaw),remainder=more.join(' ');
  if(action==='migliori'){
   let best=null;
   for(const r of records.values())if(!best||avg(r)>avg(best))best=r;
   out.push(best?'Migliore: '+best.name+' ('+avg(best).toFixed(2)+')':'Migliore: nessuno');
   continue;
  }
  if(action==='elenca'){for(const r of records.values())out.push(display(r));continue;}
  if(action==='aggiungi'){
   if(remainder.length<2){out.push('Rifiutato: Il nome deve contenere almeno 2 caratteri');continue;}
   if(records.has(id))out.push('ID duplicato: '+id);
   else{records.set(id,{id,name:remainder,grades:new Map()});out.push('Aggiunto '+remainder+' ('+id+')');}
   continue;
  }
  if(action==='rimuovi'){
   if(records.delete(id))out.push('Rimosso '+id);
   else out.push('Nessuno studente '+id);
   continue;
  }
  const r=records.get(id);
  if(!r){out.push('Nessuno studente '+id);continue;}
  if(action==='voto'){
   const [course,scoreText]=more,grade=Number(scoreText);
   if(grade>=0&&grade<=100){
    r.grades.set(course,grade);
    out.push(r.name+': '+course+' = '+scoreText);
   }else out.push('Voto non valido: '+scoreText);
  }else if(action==='rinomina'){
   if(remainder.length<2)out.push('Rifiutato: Il nome deve contenere almeno 2 caratteri');
   else{r.name=remainder;out.push('Rinominato in '+r.name);}
  }else{
   out.push(display(r));
  }
 }
 return out.join('\n');
};
activate(200,studentCases.map((commands,i)=>({
 name:'Registro completo '+(i+1),stdin:[String(commands.length),...commands],
 output:simulateStudents(commands)
})),s=>{
 const src=codeOnly(s);
 return includes(
  /\bclass_name\s+Student\b/,/\bclass_name\s+StudentRegistry\b/,
  /\bvar\s+student_id\s*:\s*int\s*:/,
  /\bvar\s+student_name\s*:\s*String\s*=\s*["']{2}\s*:/,
  /\bvar\s+average\s*:\s*float\s*:/,
  /\bfunc\s+add_grade\s*\(/,/\bfunc\s+course_count\s*\(/,
  /\bfunc\s+add_student\s*\(/,/\bfunc\s+remove_student\s*\(/,
  /\bfunc\s+get_student\s*\(/,/\bfunc\s+top_student\s*\(/,
  /\bfunc\s+get_ids\s*\(/,/\breturn\b/)(s)&&
 (src.match(/\bget\s*:/g)||[]).length>=2&&
 /set\s*\(\s*value\s*\)/.test(src)&&
 /Dictionary/.test(src);
});
const registry=byNumber(200);
registry.task=registry.task.replace(/add ID NOME/g,'aggiungi ID NOME')
 .replace(/remove ID/g,'rimuovi ID').replace(/show ID/g,'mostra ID')
 .replace(/top e list/g,'migliori ed elenca')
 .replace('Riepilogo - Sistema di gestione dei dati degli\n studenti',
 'Riepilogo - Sistema di gestione dei dati degli studenti');
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 196:['Ada','3','40','70','250'],
 197:['22','2','target 35','mode cool'],
 198:['3','aggiungi Blue Sky','aggiungi Rain','aggiungi Blue Sky'],
 199:['7','2','12 2','30 1'],
 200:['10',...studentCases[0]]
});
window.GDHManualMigration.validated=allLessons.filter(x=>x.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();
