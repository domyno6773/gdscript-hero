/* Manuale 235: 191 ripasso override, 192 duck typing.
 * Compilazione delle classi con Godot WebAssembly, verifiche su
 * diversi input e file di supporto del corso protetti.
 */
(() => {
'use strict';
const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
if(lessons.length!==235||!v)throw Error('Catalogo manuale assente');
const get=n=>{const x=lessons.find(l=>l.manualLessonNumber===n);if(!x)throw Error('Lezione '+n+' assente');return x;};
const patch=(n,files,locked)=>{
 const l=get(n);l.sourceFiles=files;l.readOnlyFiles=locked;
 const editable=Object.keys(files).find(p=>!locked.includes(p));
 if(!editable)throw Error('Progetto privo di file modificabili '+n);
 l.initialCode=files[editable];l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const main=arr=>['extends Node','','func _ready():',...arr.map(s=>'    '+s)].join('\n');
const live=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
const proof=(...patterns)=>s=>patterns.every(p=>p.test(live(s)));
const define=(n,cases,check)=>{
 if(cases.length<5)throw Error('Casi insufficienti: '+n);
 const l=get(n);v.expectedCases[n]=cases;l.manualSourceCheck=check;
 l.validationReady=true;l.expectedOutput=cases[0].output;
};
patch(191,{
 'vehicle.gd':[
  'class_name Vehicle','extends RefCounted','',
  'var brand: String','',
  'func _init(b: String) -> void:',
  '    brand = b','',
  'func wheels() -> int:',
  '    return 0','',
  'func sound() -> String:',
  '    return "..."','',
  'func describe() -> String:',
  '    # Chiama wheels() e sound() per il polimorfismo.',
  '    return ""'
 ].join('\n'),
 'car.gd':[
  'class_name Car','extends Vehicle','',
  '# Sovrascrivi wheels() con 4 e sound() con "Vroom".'
 ].join('\n'),
 'motorcycle.gd':[
  'class_name Motorcycle','extends Vehicle','',
  '# Sovrascrivi wheels() con 2 e sound() con "Brrm".'
 ].join('\n'),
 'truck.gd':[
  'class_name Truck','extends Vehicle','',
  'var trailers: int','',
  'func _init(b: String, t: int) -> void:',
  '    super(b)',
  '    trailers = t','',
  '# Sovrascrivi wheels() con 6 + 4 per rimorchio, sound() con "Honk".'
 ].join('\n'),
 'main.gd':main([
  'var count = int(OS.read_string_from_stdin())',
  'var vehicles: Array[Vehicle] = []',
  'for i in count:',
  '    var p = OS.read_string_from_stdin().split(" ")',
  '    if p[0] == "auto":',
  '        vehicles.append(Car.new(p[1]))',
  '    elif p[0] == "moto":',
  '        vehicles.append(Motorcycle.new(p[1]))',
  '    elif p[0] == "camion":',
  '        vehicles.append(Truck.new(p[1], int(p[2])))',
  '    else:',
  '        vehicles.append(Vehicle.new(p[1]))',
  'var total = 0',
  'for vehicle in vehicles:',
  '    print(vehicle.describe())',
  '    total += vehicle.wheels()',
  'print("Ruote totali: %d" % total)'
 ])
},['main.gd']);
const vehicles=[
 ['auto Toyota','camion Volvo 2'],
 ['moto Ducati','auto Fiat','veicolo Saab'],
 [],
 ['camion Iveco 0','camion Scania 3','moto Yamaha'],
 ['veicolo Opel'],
 ['auto BMW','moto Aprilia','camion MAN 1','veicolo Honda','auto Kia']
];
const wheels={auto:4,moto:2,veicolo:0};
const noise={auto:'Vroom',moto:'Brrm',veicolo:'...',camion:'Honk'};
define(191,vehicles.map((rows,i)=>{
 let total=0;
 const out=rows.map(line=>{
   const [kind,brand,trailerRaw]=line.split(' ');
   const n=kind==='camion'?6+4*Number(trailerRaw):(wheels[kind]??0);
   total+=n;
   return brand+': '+n+' ruote, '+noise[kind];
 });
 out.push('Ruote totali: '+total);
 return{name:'Garage polimorfico '+(i+1),stdin:[String(rows.length),...rows],
  output:out.join('\n')};
}),s=>{
 const code=live(s);
 return proof(/\bclass_name\s+Vehicle\b/,/\bclass_name\s+Car\b/,
  /\bclass_name\s+Motorcycle\b/,/\bclass_name\s+Truck\b/,
  /\bfunc\s+describe\s*\(\s*\)\s*->\s*String/,
  /\breturn\b/)(s)&&
  (code.match(/\bfunc\s+wheels\s*\(\s*\)\s*->\s*int/g)||[]).length>=4&&
  (code.match(/\bfunc\s+sound\s*\(\s*\)\s*->\s*String/g)||[]).length>=4;
});
const l191=get(191);
l191.task=l191.task
 .replace(/\bruote\(\)/g,'wheels()')
 .replace(/\bcar BRAND\b/g,'auto MARCA')
 .replace(/\bmotorcycle BRAND\b/g,'moto MARCA')
 .replace(/\btruck BRAND TRAILERS\b/g,'camion MARCA RIMORCHI')
 .replace(/\bvehicle BRAND\b/g,'veicolo MARCA')
 .replace(/\bcar Toyota\b/g,'auto Toyota')
 .replace(/\btruck Volvo 2\b/g,'camion Volvo 2');

patch(192,{
 'crate.gd':[
   'class_name Crate','extends RefCounted','',
   '# Dichiara broken, inizialmente false.',
   '# Implementa take_damage(amount) e status().'
 ].join('\n'),
 'explosion.gd':[
   'class_name Explosion','extends RefCounted','',
   'static func hit_all(things: Array, amount: int) -> int:',
   '    # Colpisci solo gli oggetti che rispondono a take_damage.',
   '    return 0'
 ].join('\n'),
 'player.gd':[
   'class_name Player','extends RefCounted','',
   'var hp: int = 100','',
   'func take_damage(amount: int) -> void:',
   '    hp -= amount',
   '    if hp < 0:',
   '        hp = 0','',
   'func status() -> String:',
   '    return "Giocatore: %d HP" % hp'
 ].join('\n'),
 'rock.gd':[
   'class_name Rock','extends RefCounted','',
   'func status() -> String:',
   '    return "Roccia: solida"'
 ].join('\n'),
 'main.gd':main([
   'var things = []',
   'for word in OS.read_string_from_stdin().split(" ", false):',
   '    if word == "player":',
   '        things.append(Player.new())',
   '    elif word == "crate":',
   '        things.append(Crate.new())',
   '    else:',
   '        things.append(Rock.new())',
   'var count = int(OS.read_string_from_stdin())',
   'for i in count:',
   '    var hits = Explosion.hit_all(things, int(OS.read_string_from_stdin()))',
   '    print("L\\x27esplosione %d ha colpito %d oggetti" % [i + 1, hits])',
   'for thing in things:',
   '    print(thing.status())'
 ])
},['player.gd','rock.gd','main.gd']);
const duck=[
 {objects:['player','crate','rock'],damage:[5,20]},
 {objects:['crate','rock','player','crate'],damage:[9,10]},
 {objects:['rock','rock'],damage:[50,4]},
 {objects:['player'],damage:[30,80,6]},
 {objects:['crate'],damage:[]},
 {objects:['crate','player','rock','player'],damage:[0,10,100]}
];
define(192,duck.map(({objects,damage},i)=>{
 const hits=objects.filter(x=>x!=='rock').length;
 const sum=damage.reduce((a,b)=>a+b,0);
 const out=damage.map((_,j)=>"L'esplosione "+(j+1)+' ha colpito '+hits+' oggetti');
 for(const thing of objects){
   if(thing==='rock')out.push('Roccia: solida');
   if(thing==='player')out.push('Giocatore: '+Math.max(0,100-sum)+' HP');
   if(thing==='crate')out.push('Cassa: '+(damage.some(n=>n>=10)?'distrutta':'intatta'));
 }
 return{name:'Danni per duck typing '+(i+1),
  stdin:[objects.join(' '),String(damage.length),...damage.map(String)],
  output:out.join('\n')};
}),s=>proof(
 /\bclass_name\s+Crate\b/,/\bclass_name\s+Explosion\b/,
 /\bvar\s+broken\s*:\s*bool\s*=\s*false\b/,
 /\bfunc\s+take_damage\s*\(/,/\bfunc\s+status\s*\(/,
 /\bstatic\s+func\s+hit_all\s*\(/,
 /\.has_method\s*\(\s*["']take_damage["']\s*\)/,
 /\.call\s*\(\s*["']take_damage["']/,
 /\breturn\b/)(s));
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 191:['2','auto Toyota','camion Volvo 2'],
 192:['player crate rock','2','5','20']});
window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();