/* Ereditarietà di base 185 e super 186: classi separate e driver
 * main.gd immutabile, verificati sul vero GDScript via runner WASM.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
 if(lessons.length!==235||!verifier)throw Error('Manuale assente');
 const get=n=>{const lesson=lessons.find(x=>x.manualLessonNumber===n);
   if(!lesson)throw Error('Lezione assente '+n);return lesson;};
 const patch=(n,files)=>{
   const l=get(n);l.sourceFiles=files;l.initialCode=files[Object.keys(files)[0]];
   l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
 };
 const main=arr=>['extends Node','','func _ready():',...arr.map(s=>'    '+s)].join('\n');
 const source=s=>String(s).split('\n').filter(l=>!/^\s*#/.test(l)).join('\n');
 const proof=(...rules)=>s=>rules.every(r=>r.test(source(s)));
 const define=(n,cases,p)=>{
   const l=get(n);verifier.expectedCases[n]=cases;
   l.expectedOutput=cases[0].output;l.manualSourceCheck=p;l.validationReady=true;
 };
 patch(185,{
   'vehicle.gd':[
     'class_name Vehicle','extends RefCounted',
     'var brand: String','var model: String',
     'func _init(b: String, m: String) -> void:',
     '    # Memorizza il produttore e il modello.',
     '    pass',
     'func info() -> String:',
     '    # Restituisci "Veicolo: MARCA MODELLO".',
     '    return ""'
   ].join('\n'),
   'car.gd':[
     'class_name Car','extends Vehicle',
     'func honk() -> String:',
     '    # Usa brand e model ereditate dalla classe Vehicle.',
     '    return ""'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ")',
     '    if parts[0] == "auto":',
     '        var car = Car.new(parts[1], parts[2])',
     '        print(car.info())',
     '        print(car.honk())',
     '    else:',
     '        var vehicle = Vehicle.new(parts[1], parts[2])',
     '        print(vehicle.info())'
   ])
 });
 const fleet=[
   ['veicolo Toyota Corolla','auto Honda Civic'],
   [],
   ['auto Alfa Giulia'],
   ['veicolo Volvo XC90','veicolo Fiat Panda'],
   ['auto Kia Rio','auto BMW M3','veicolo Ford Fiesta']
 ];
 define(185,fleet.map((items,i)=>({
   name:'Veicoli '+i,stdin:[String(items.length),...items],
   output:items.flatMap(line=>{
     const [kind,brand,model]=line.split(' ');
     return kind==='auto'?
       ['Veicolo: '+brand+' '+model,brand+' '+model+' fa Bip bip!']:
       ['Veicolo: '+brand+' '+model];
   }).join('\n')
 })),proof(/\bclass_name\s+Vehicle\b/,/\bclass_name\s+Car\b/,
   /\bextends\s+Vehicle\b/,
   /\bfunc\s+_init\s*\(/,/\bfunc\s+info\s*\(/,
   /\bfunc\s+honk\s*\(/,/\bbrand\b/,/\bmodel\b/));
 const l186=get(186);
 l186.task=l186.task.replace(/\bperson NAME AGE\b/g,'persona NAME AGE')
  .replace(/\bemployee NAME AGE JOB\b/g,'dipendente NAME AGE JOB')
  .replace(/\bperson Alice 30\b/g,'persona Alice 30')
  .replace(/\bemployee Bob 35 Developer\b/g,'dipendente Bob 35 Developer');
 patch(186,{
   'person.gd':[
     'class_name Person','extends RefCounted',
     'var person_name: String','var age: int',
     'func _init(n: String, a: int) -> void:',
     '    # Assegna le proprietà.',
     '    pass',
     'func introduce() -> String:',
     '    # Restituisci nome ed età.',
     '    return ""'
   ].join('\n'),
   'employee.gd':[
     'class_name Employee','extends Person',
     'var job: String',
     'func _init(n: String, a: int, j: String) -> void:',
     '    # Chiama il costruttore della classe padre con super(...).',
     '    pass',
     'func introduce() -> String:',
     '    # Aggiungi la professione chiamando super.introduce().',
     '    return ""'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ")',
     '    if parts[0] == "dipendente":',
     '        var employee = Employee.new(parts[1], int(parts[2]), parts[3])',
     '        print(employee.introduce())',
     '    else:',
     '        var person = Person.new(parts[1], int(parts[2]))',
     '        print(person.introduce())'
   ])
 });
 const people=[
   ['persona Alice 30','dipendente Bob 35 Developer'],
   [],
   ['dipendente Ada 28 Artist'],
   ['persona Mario 15','persona Lucia 70'],
   ['dipendente Leo 40 Manager','persona Ema 20','dipendente Gio 33 Designer']
 ];
 define(186,people.map((lines,i)=>({
   name:'Persone '+i,stdin:[String(lines.length),...lines],
   output:lines.map(line=>{
     const [kind,name,age,job]=line.split(' ');
     return 'Ciao, sono '+name+' e ho '+age+' anni'+
       (kind==='dipendente'?'. Lavoro come '+job:'');
   }).join('\n')
 })),proof(/\bclass_name\s+Person\b/,/\bclass_name\s+Employee\b/,
   /\bextends\s+Person\b/,/\bsuper\s*\(\s*n\s*,\s*a\s*\)/,
   /\bsuper\.introduce\s*\(\s*\)/,/\bfunc\s+introduce\s*\(/));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   185:['2','veicolo Toyota Corolla','auto Honda Civic'],
   186:['2','persona Alice 30','dipendente Bob 35 Developer']
 });
 window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();