/* Lezioni 187–190 del manuale: override, catena di ereditarietà,
 * controlli di tipo e sistema paghe. Le classi di base fornite sono
 * read-only, le classi dell'allievo non contengono la soluzione.
 */
(() => {
 'use strict';
 const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
 if(lessons.length!==235||!v)throw Error('Manuale incompleto');
 const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione '+n+' mancante');return l;};
 const patch=(n,files,locked=['main.gd'])=>{
   const l=get(n);l.sourceFiles=files;l.readOnlyFiles=locked;
   const first=Object.keys(files).find(f=>!locked.includes(f));
   if(!first)throw Error('Nessun file editabile: '+n);
   l.initialCode=files[first];l.starterCode=files[first];
   l.requiresMultipleFiles=true;
 };
 const main=body=>['extends Node','','func _ready():',
   ...body.map(line=>'    '+line)].join('\n');
 const visible=s=>String(s).split('\n')
   .filter(line=>!/^\s*#/.test(line)).join('\n');
 const all=(...patterns)=>s=>patterns.every(re=>re.test(visible(s)));
 const define=(n,cases,check)=>{
   if(cases.length<5)throw Error('Test insufficienti '+n);
   const l=get(n);
   v.expectedCases[n]=cases;
   l.expectedOutput=cases[0].output;
   l.manualSourceCheck=check;
   l.validationReady=true;
 };
 const types=n=>n.toFixed(2);

 // 187 — Shape è materiale didattico fornito, non un compito dello studente.
 const shape=[
   'class_name Shape','extends RefCounted','',
   'var color: String','',
   'func _init(c: String) -> void:',
   '    color = c','',
   'func area() -> float:',
   '    return 0.0','',
   'func describe() -> String:',
   '    return "Questa è una figura %s" % color'
 ].join('\n');
 patch(187,{
   'circle.gd':[
     'class_name Circle','extends Shape','',
     'var radius: int','',
     'func _init(c: String, r: int) -> void:',
     '    super(c)',
     '    radius = r','',
     '# Ridefinisci area() e describe() rispettando le firme della classe Shape.'
   ].join('\n'),
   'square.gd':[
     'class_name Square','extends Shape','',
     'var side: int','',
     'func _init(c: String, s: int) -> void:',
     '    super(c)',
     '    side = s','',
     '# Sovrascrivi area() e describe() come richiesto.'
   ].join('\n'),
   'shape.gd':shape,
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'for i in count:',
     '    var parts = OS.read_string_from_stdin().split(" ")',
     '    var form: Shape',
     '    if parts[0] == "cerchio":',
     '        form = Circle.new(parts[1], int(parts[2]))',
     '    elif parts[0] == "quadrato":',
     '        form = Square.new(parts[1], int(parts[2]))',
     '    else:',
     '        form = Shape.new(parts[1])',
     '    print(form.describe())',
     '    print("Area: %.2f" % form.area())'
   ])
 },['shape.gd','main.gd']);
 const raw187=[
   ['cerchio red 5','forma green'],
   ['quadrato blue 4','cerchio yellow 2'],
   [],
   ['forma violet','quadrato black 0'],
   ['cerchio orange 1','cerchio silver 10','quadrato teal 3'],
   ['forma white']
 ];
 define(187,raw187.map((rows,i)=>({
   name:'Override delle forme '+i,stdin:[String(rows.length),...rows],
   output:rows.flatMap(line=>{
     const [kind,color,value]=line.split(' ');
     if(kind==='cerchio')return [
       'Questo è un '+color+' circle with radius '+value,
       'Area: '+types(Math.PI*Number(value)**2)];
     if(kind==='quadrato')return [
       'Questo è un '+color+' square with side '+value,
       'Area: '+types(Number(value)**2)];
     return ['Questa è una figura '+color,'Area: 0.00'];
   }).join('\n')
 })),src=>all(
   /\bclass_name\s+Circle\b/,/\bclass_name\s+Square\b/,
   /\bextends\s+Shape\b/,/\bfunc\s+area\s*\(\s*\)\s*->\s*float/,
   /\bfunc\s+describe\s*\(\s*\)\s*->\s*String/,
   /\bPI\b/,/\bradius\b/,/\bside\b/)(src)&&
   (visible(src).match(/\bfunc\s+area\s*\(/g)||[]).length>=2&&
   (visible(src).match(/\bfunc\s+describe\s*\(/g)||[]).length>=2);
 const l187=get(187);
 l187.task=l187.task
   .replace(/\bshape COLOR\b/g,'forma COLORE')
   .replace(/\bcircle COLOR RADIUS\b/g,'cerchio COLORE RAGGIO')
   .replace(/\bsquare COLOR SIDE\b/g,'quadrato COLORE LATO')
   .replace(/\bcircle red 5 e shape green\b/g,'cerchio red 5 e forma green');

 // 188 — Character completo e protetto, lo studente implementa due livelli.
 patch(188,{
   'warrior.gd':[
     'class_name Warrior','extends Character','',
     'var strength: int','',
     'func _init(n: String, h: int, s: int) -> void:',
     '    # Usa super(n, h) e salva la forza.',
     '    pass','',
     '# Sovrascrivi describe() e attack().'
   ].join('\n'),
   'knight.gd':[
     'class_name Knight','extends Warrior','',
     'var armor: int','',
     'func _init(n: String, h: int, s: int, a: int) -> void:',
     '    # Usa super(n, h, s) e salva l’armatura.',
     '    pass','',
     '# Sovrascrivi describe() e attack(), richiamando la classe padre.'
   ].join('\n'),
   'character.gd':[
     'class_name Character','extends RefCounted','',
     'var char_name: String','var hp: int','',
     'func _init(n: String, h: int) -> void:',
     '    char_name = n',
     '    hp = h','',
     'func describe() -> String:',
     '    return "%s (%d PS)" % [char_name, hp]','',
     'func attack() -> int:',
     '    return 1'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    var character: Character',
     '    if p[0] == "cavaliere":',
     '        character = Knight.new(p[1], int(p[2]), int(p[3]), int(p[4]))',
     '    elif p[0] == "guerriero":',
     '        character = Warrior.new(p[1], int(p[2]), int(p[3]))',
     '    else:',
     '        character = Character.new(p[1], int(p[2]))',
     '    print(character.describe())',
     '    print("Attacco: %d" % character.attack())'
   ])
 },['character.gd','main.gd']);
 const raw188=[
   ['cavaliere Arthur 120 15 8'],
   ['personaggio Ada 50','guerriero Lia 70 6','cavaliere Bo 90 8 2'],
   [],
   ['guerriero Rey 40 0','cavaliere Nyx 20 10 0'],
   ['personaggio Tom 33'],
   ['cavaliere Era 150 23 12','guerriero Cal 105 11']
 ];
 define(188,raw188.map((rows,i)=>({
   name:'Gerarchia personaggi '+i,stdin:[String(rows.length),...rows],
   output:rows.flatMap(line=>{
     const [kind,name,h,s,a]=line.split(' ');
     const desc=name+' ('+h+' PS)';
     if(kind==='guerriero')return [
       desc+', strength '+s,'Attacco: '+Number(s)];
     if(kind==='cavaliere')return [
       desc+', strength '+s+', armor '+a,'Attacco: '+(Number(s)+5)];
     return [desc,'Attacco: 1'];
   }).join('\n')
 })),src=>all(
   /\bclass_name\s+Warrior\b/,/\bclass_name\s+Knight\b/,
   /\bextends\s+Character\b/,/\bextends\s+Warrior\b/,
   /\bsuper\s*\(\s*n\s*,\s*h\s*\)/,
   /\bsuper\s*\(\s*n\s*,\s*h\s*,\s*s\s*\)/,
   /\bsuper\.describe\s*\(/,/\bsuper\.attack\s*\(/,
   /\bfunc\s+describe\s*\(\s*\)/,/\bfunc\s+attack\s*\(\s*\)/)(src));
 const l188=get(188);
 l188.task=l188.task
   .replace(/\bknight NAME\b/g,'cavaliere NOME')
   .replace(/\bcharacter NAME\b/g,'personaggio NOME')
   .replace(/\bwarrior NAME\b/g,'guerriero NOME')
   .replace(/\bknight Arthur\b/g,'cavaliere Arthur')
   .replace(/\b120 HP\b/g,'120 PS')
   .replace(/\bAttack:\s*20\b/g,'Attacco: 20');

 // 189 — l'ordine degli is è fondamentale (Penguin è anche Bird).
 patch(189,{
   'zoo.gd':[
     'class_name Zoo','extends RefCounted','',
     'static func describe(a: Animal) -> String:',
     '    # Controlla prima Penguin, poi Bird, poi Animal.',
     '    return ""','',
     'static func count_birds(animals: Array[Animal]) -> int:',
     '    # Conta i Bird, includendo anche i Penguin.',
     '    return 0'
   ].join('\n'),
   'animal.gd':[
     'class_name Animal','extends RefCounted','',
     'var animal_name: String','',
     'func _init(n: String) -> void:',
     '    animal_name = n'
   ].join('\n'),
   'bird.gd':[
     'class_name Bird','extends Animal','',
     'var wingspan: int','',
     'func _init(n: String, w: int) -> void:',
     '    super(n)',
     '    wingspan = w'
   ].join('\n'),
   'penguin.gd':[
     'class_name Penguin','extends Bird'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'var animals: Array[Animal] = []',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    if p[0] == "pinguino":',
     '        animals.append(Penguin.new(p[1], int(p[2])))',
     '    elif p[0] == "uccello":',
     '        animals.append(Bird.new(p[1], int(p[2])))',
     '    else:',
     '        animals.append(Animal.new(p[1]))',
     'for a in animals:',
     '    print(Zoo.describe(a))',
     'print("Uccelli: %d" % Zoo.count_birds(animals))'
   ])
 },['animal.gd','bird.gd','penguin.gd','main.gd']);
 const raw189=[
   ['uccello Kiwi 30','pinguino Pingu 60','animale Rex'],
   ['pinguino A 15','pinguino B 25','uccello C 10'],
   [],
   ['animale Milo','animale Zed'],
   ['uccello Sky 100','animale Fox','pinguino Ice 55','uccello Pip 2'],
   ['pinguino Polo 45']
 ];
 define(189,raw189.map((rows,i)=>({
   name:'Zoo '+i,stdin:[String(rows.length),...rows],
   output:[...rows.map(line=>{
     const [kind,name,wingspan]=line.split(' ');
     if(kind==='pinguino')return name+' swims';
     if(kind==='uccello')return name+' flies (wingspan '+wingspan+' cm)';
     return name+' walks';
   }),'Uccelli: '+rows.filter(s=>s.startsWith('uccello ')||s.startsWith('pinguino ')).length].join('\n')
 })),src=>all(
   /\bclass_name\s+Zoo\b/,
   /\bstatic\s+func\s+describe\s*\(\s*\w+\s*:\s*Animal\s*\)/,
   /\bstatic\s+func\s+count_birds\s*\(\s*\w+\s*:\s*Array\s*\[\s*Animal\s*\]\s*\)/,
   /\bis\s+Penguin\b/,/\bis\s+Bird\b/,
   /\breturn\b/)(src));
 const l189=get(189);
 l189.task=l189.task
   .replace(/\banimal NAME\b/g,'animale NOME')
   .replace(/\bbird NAME WINGSPAN\b/g,'uccello NOME APERTURA_ALARE')
   .replace(/\bpenguin NAME WINGSPAN\b/g,'pinguino NOME APERTURA_ALARE')
   .replace(/\bbird Kiwi 30\b/g,'uccello Kiwi 30')
   .replace(/\bpenguin Pingu 60\b/g,'pinguino Pingu 60')
   .replace(/\banimal Rex\b/g,'animale Rex')
   .replace(/\bBirds: 2\b/g,'Uccelli: 2');

 // 190 — cinque file tutti da completare; main.gd fornito non editabile.
 patch(190,{
   'person.gd':[
     'class_name Person','extends RefCounted','',
     '# Dichiara person_name e age.',
     'func _init(n: String, a: int) -> void:',
     '    # Memorizza il nome e l’età.',
     '    pass','',
     'func introduce() -> String:',
     '    # Restituisci "Ciao, sono NAME, AGE anni".',
     '    return ""'
   ].join('\n'),
   'employee.gd':[
     'class_name Employee','extends Person','',
     '# Dichiara employee_id e salary.',
     'func _init(n: String, a: int, id: String, s: int) -> void:',
     '    # Passa i dati alla classe padre con super().',
     '    pass','',
     'func introduce() -> String:',
     '    # Estendi il saluto del genitore con l’ID dipendente.',
     '    return ""','',
     'func monthly_pay() -> float:',
     '    # Calcola la paga mensile.',
     '    return 0.0'
   ].join('\n'),
   'manager.gd':[
     'class_name Manager','extends Employee','',
     '# Dichiara department.',
     'func _init(n: String, a: int, id: String, s: int, d: String) -> void:',
     '    # Inizializza i valori ereditati e il reparto.',
     '    pass','',
     'func monthly_pay() -> float:',
     '    # Paga del genitore maggiorata del 20%.',
     '    return 0.0','',
     'func manage_team() -> String:',
     '    return ""'
   ].join('\n'),
   'engineer.gd':[
     'class_name Engineer','extends Employee','',
     '# Dichiara language.',
     'func _init(n: String, a: int, id: String, s: int, l: String) -> void:',
     '    # Inizializza i dati del genitore e il linguaggio.',
     '    pass','',
     'func code() -> String:',
     '    return ""'
   ].join('\n'),
   'payroll.gd':[
     'class_name Payroll','extends RefCounted','',
     'static func role(p: Person) -> String:',
     '    # Riconosci la classe più specifica: Manager, Engineer, Employee o Person.',
     '    return ""','',
     'static func total_monthly(people: Array[Person]) -> float:',
     '    # Somma solo le paghe degli Employee (e delle sottoclassi).',
     '    return 0.0'
   ].join('\n'),
   'main.gd':main([
     'var count = int(OS.read_string_from_stdin())',
     'var people: Array[Person] = []',
     'for i in count:',
     '    var p = OS.read_string_from_stdin().split(" ")',
     '    if p[0] == "manager":',
     '        people.append(Manager.new(p[1], int(p[2]), p[3], int(p[4]), p[5]))',
     '    elif p[0] == "engineer":',
     '        people.append(Engineer.new(p[1], int(p[2]), p[3], int(p[4]), p[5]))',
     '    elif p[0] == "employee":',
     '        people.append(Employee.new(p[1], int(p[2]), p[3], int(p[4])))',
     '    else:',
     '        people.append(Person.new(p[1], int(p[2])))',
     'for person in people:',
     '    print("[%s] %s" % [Payroll.role(person), person.introduce()])',
     '    if person is Employee:',
     '        print("Stipendio mensile: %.2f" % (person as Employee).monthly_pay())',
     '    if person is Manager:',
     '        print((person as Manager).manage_team())',
     '    elif person is Engineer:',
     '        print((person as Engineer).code())',
     'print("Totale mensile degli stipendi: %.2f" % Payroll.total_monthly(people))'
   ])
 });
 const raw190=[
   ['employee Alice 35 E123 60000','manager Bob 45 M54 85000 Marketing'],
   [],
   ['person Anna 21','engineer Liam 29 E98 72000 Godot'],
   ['manager Clara 38 M1 120000 Rete','engineer Teo 25 E2 48000 Python',
    'employee Eva 40 E3 36000'],
   ['person Piero 50','person Lia 18'],
   ['engineer Vic 32 A7 60000 Rust','manager Zoe 28 X4 45000 Design']
 ];
 const payrollOutput=rows=>{
   let sum=0,out=[];
   for(const line of rows){
     const [role,name,age,id,salaryStr,detail]=line.split(' ');
     const emp=role!=='person',salary=Number(salaryStr||0);
     const job=role==='manager'?'Manager':role==='engineer'?'Engineer':
       role==='employee'?'Employee':'Person';
     let introduction='Ciao, sono '+name+', '+age+' anni';
     if(emp)introduction+='. My employee ID is '+id+'.';
     out.push('['+job+'] '+introduction);
     if(emp){
       const pay=salary/12*(role==='manager'?1.2:1);
       sum+=pay;
       out.push('Stipendio mensile: '+types(pay));
     }
     if(role==='manager')out.push('Managing the '+detail+' department.');
     if(role==='engineer')out.push('Coding in '+detail+'.');
   }
   out.push('Totale mensile degli stipendi: '+types(sum));
   return out.join('\n');
 };
 define(190,raw190.map((rows,i)=>({
   name:'Gestore stipendi '+i,
   stdin:[String(rows.length),...rows],
   output:payrollOutput(rows)
 })),src=>all(
   /\bclass_name\s+Person\b/,/\bclass_name\s+Employee\b/,
   /\bclass_name\s+Manager\b/,/\bclass_name\s+Engineer\b/,
   /\bclass_name\s+Payroll\b/,
   /\bextends\s+Person\b/,/\bextends\s+Employee\b/,
   /\bsuper\s*\(/,/\bsuper\.introduce\s*\(/,
   /\bsuper\.monthly_pay\s*\(/,
   /\bstatic\s+func\s+role\s*\(/,
   /\bstatic\s+func\s+total_monthly\s*\(/,
   /\bis\s+Manager\b/,/\bis\s+Engineer\b/,/\bis\s+Employee\b/)(src));
 const l190=get(190);
 l190.task=l190.task.replace(
   /Gestisce il reparto marketing\./g,'Managing the Marketing department.');
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   187:['2','cerchio red 5','forma green'],
   188:['1','cavaliere Arthur 120 15 8'],
   189:['3','uccello Kiwi 30','pinguino Pingu 60','animale Rex'],
   190:['2','employee Alice 35 E123 60000','manager Bob 45 M54 85000 Marketing']
 });
 window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();