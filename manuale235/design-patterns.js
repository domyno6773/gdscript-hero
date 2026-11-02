/* Manuale 216–220: Singleton, Factory, Observer, Strategy e Command.
 * Driver protetti e sei sequenze per ciascuna consegna del manuale.
 */
(()=>{
'use strict';
const lessons=window.LESSONS_DATA, verifier=window.GDHManualVerifier;
const get=n=>lessons.find(l=>l.manualLessonNumber===n);
const code=lines=>lines.join('\n');
const main=lines=>code(['extends Node','','func _ready():',...lines.map(l=>'    '+l)]);
const setup=(n,files,locked=['main.gd'])=>{
 const l=get(n);l.sourceFiles=files;l.readOnlyFiles=locked;
 l.initialCode=files[Object.keys(files).find(f=>!locked.includes(f))];
 l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
};
const activate=(n,inputs,simulate,...requirements)=>{
 const l=get(n);
 verifier.expectedCases[n]=inputs.map((stdin,i)=>({name:'Scenario '+(i+1),stdin,output:simulate(stdin)}));
 l.manualSourceCheck=s=>requirements.every(rx=>rx.test(String(s).replace(/^\s*#.*$/gm,'')));
 l.expectedOutput=verifier.expectedCases[n][0].output;l.validationReady=true;
};
const counted=rows=>[String(rows.length),...rows];
setup(216,{
 'score_manager.gd':code(['class_name ScoreManager','extends RefCounted','',
 '# Dichiara la variabile statica che conserva l’unica istanza.','var score = 0','',
 'static func get_instance() -> ScoreManager:','    return ScoreManager.new()','',
 'func add_points(points: int) -> void:','    pass']),
 'coin.gd':code(['class_name Coin','extends RefCounted','var value: int',
 'func _init(coin_value: int) -> void:','    value = coin_value',
 'func collect() -> void:','    pass']),
 'main.gd':main(['var count = int(OS.read_string_from_stdin())','for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")','    if parts[0] == "moneta":',
 '        Coin.new(int(parts[1])).collect()','    elif parts[0] == "bonus":',
 '        ScoreManager.get_instance().add_points(int(parts[1]))',
 '    print("Punteggio: %d" % ScoreManager.get_instance().score)',
 'print("Stesso oggetto: %s" % (ScoreManager.get_instance() == ScoreManager.get_instance()))'])
});
activate(216,[['moneta 5','bonus 20'],[],['bonus 0','moneta 0'],
 ['moneta 7','moneta 3','bonus -4','moneta 8'],['bonus -10','bonus 2'],
 ['moneta 100','bonus 1','moneta 25','bonus 9']].map(counted),input=>{
 let score=0;const out=['Gestore punteggio creato'];
 for(const row of input.slice(1)){score+=Number(row.split(' ')[1]);out.push('Punteggio: '+score);}
 return [...out,'Stesso oggetto: true'].join('\n');
},/\bstatic\s+var\s+\w+/,/\bstatic\s+func\s+get_instance\s*\(/,
 /\bfunc\s+add_points\s*\(/,/\bfunc\s+collect\s*\(/,/ScoreManager\.get_instance\s*\(/);
get(216).task=get(216).task.replace(/Score(?:\s|<span> <\/span>)+manager created/g,'Gestore punteggio creato').replace(/\bcoin VALUE/g,'moneta VALORE').replace(/coin 5/g,'moneta 5');

setup(217,{
 'enemy_factory.gd':code(['class_name EnemyFactory','extends RefCounted',
 'static func create(kind: String, level: int) -> Enemy:','    return null']),
 'orc.gd':code(['class_name Orc','extends Enemy','func _init(level: int) -> void:','    super("", 0, 0)']),
 'enemy.gd':code(['class_name Enemy','extends RefCounted','var enemy_name: String','var hp: int','var damage: int',
 'func _init(n: String, h: int, d: int) -> void:','    enemy_name = n','    hp = h','    damage = d',
 'func describe() -> String:','    return "%s: %d PS, %d danni" % [enemy_name, hp, damage]']),
 'goblin.gd':code(['class_name Goblin','extends Enemy','func _init(level: int) -> void:','    super("Goblin", 10 * level, 2 * level)']),
 'main.gd':main(['var spawned = 0','var count = int(OS.read_string_from_stdin())','for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")','    var enemy = EnemyFactory.create(parts[0], int(parts[1]))',
 '    if enemy == null:','        print("Nemico sconosciuto: ", parts[0])','    else:',
 '        spawned += 1','        print(enemy.describe())','print("Generato: ", spawned)'])
},['enemy.gd','goblin.gd','main.gd']);
activate(217,[['goblin 2','Orc 3','slime 1'],[],['ORC 1','GoBlIn 5'],
 ['ghost 2','SLIME 4'],['orc 0','goblin 0'],['goblin 9','orc 7','orc 2','Goblin 1']].map(counted),input=>{
 let count=0;const out=[];
 for(const row of input.slice(1)){
  const [kind,raw]=row.split(' '),n=Number(raw),k=kind.toLowerCase();
  if(k==='orc'||k==='goblin'){count++;out.push(k==='orc'?`Orc: ${25*n} PS, ${4+n} danni`:`Goblin: ${10*n} PS, ${2*n} danni`);}
  else out.push('Nemico sconosciuto: '+kind);
 }return [...out,'Generato: '+count].join('\n');
},/\bstatic\s+func\s+create\s*\(/,/\bGoblin\.new\s*\(/,/\bOrc\.new\s*\(/,/\bsuper\s*\(/);

setup(218,{
 'weather_station.gd':code(['class_name WeatherStation','extends RefCounted',
 '# Dichiara temperature_changed(value: float).','var temperature = 0.0',
 'func attach(display: WeatherDisplay) -> void:','    pass',
 'func detach(display: WeatherDisplay) -> void:','    pass',
 'func set_temperature(value: float) -> void:','    pass']),
 'weather_display.gd':code(['class_name WeatherDisplay','extends RefCounted','var display_name: String',
 'func _init(n: String) -> void:','    display_name = n',
 'func on_temperature_changed(value: float) -> void:','    pass']),
 'main.gd':main(['var station = WeatherStation.new()','var displays = {}',
 'for display_name in OS.read_string_from_stdin().split(" "):','    displays[display_name] = WeatherDisplay.new(display_name)',
 'var count = int(OS.read_string_from_stdin())','for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")','    match parts[0]:',
 '        "collega":','            station.attach(displays[parts[1]])',
 '        "scollega":','            station.detach(displays[parts[1]])',
 '        "temp":','            station.set_temperature(float(parts[1]))',
 'print("Temperatura finale: %.1f" % station.temperature)'])
});
const weather=[['Telefono Tablet',['collega Telefono','collega Tablet','temp 21.5','scollega Telefono','temp 19']],
 ['A B',[]],['A B',['scollega A','collega A','collega A','temp 0','scollega A','scollega A','temp -8.5']],
 ['A B C',['collega C','collega A','temp -2','scollega C','collega C','temp 12.5']],
 ['Monitor',['temp 40','collega Monitor','temp 40','temp 40']],
 ['Uno Due',['collega Uno','collega Due','scollega Uno','scollega Due','temp 100']]];
activate(218,weather.map(([names,rows])=>[names,...counted(rows)]),input=>{
 const attached=new Set(),out=[];let temperature=0;
 for(const row of input.slice(2)){
  const [op,arg]=row.split(' ');
  if(op==='collega')attached.add(arg);else if(op==='scollega')attached.delete(arg);
  else{temperature=Number(arg);for(const name of attached)out.push(name+': '+temperature.toFixed(1)+' C');}
 }return [...out,'Temperatura finale: '+temperature.toFixed(1)].join('\n');
},/\bsignal\s+temperature_changed\b/,/\.connect\s*\(/,/\.disconnect\s*\(/,/\b(?:emit_signal\s*\(|temperature_changed\.emit\s*\()/);
get(218).task=get(218).task.replace(/attach NAME/g,'collega NOME').replace(/detach NAME/g,'scollega NOME')
 .replace(/Phone/g,'Telefono').replace(/attach Telefono/g,'collega Telefono').replace(/attach Tablet/g,'collega Tablet').replace(/detach Telefono/g,'scollega Telefono');

setup(219,{
 'cart.gd':code(['class_name Cart','extends RefCounted','var prices: Array[int] = []','var discount: Discount = Discount.new()',
 'func add_item(price: int) -> void:','    prices.append(price)',
 'func set_discount(new_discount: Discount) -> void:','    pass','func checkout() -> String:','    return ""']),
 'percent_off.gd':code(['class_name PercentOff','extends Discount','var percent: int',
 'func _init(p: int) -> void:','    percent = p','# Sovrascrivi apply(total) e label().']),
 'fixed_off.gd':code(['class_name FixedOff','extends Discount','var amount: int',
 'func _init(a: int) -> void:','    amount = a','# Sovrascrivi apply(total) e label().']),
 'discount.gd':code(['class_name Discount','extends RefCounted','func apply(total: int) -> int:','    return total',
 'func label() -> String:','    return "nessuno sconto"']),
 'main.gd':main(['var cart = Cart.new()','for price in OS.read_string_from_stdin().split(" "):',
 '    cart.add_item(int(price))','var count = int(OS.read_string_from_stdin())','for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")','    if parts[0] == "percentuale":',
 '        cart.set_discount(PercentOff.new(int(parts[1])))','    elif parts[0] == "fisso":',
 '        cart.set_discount(FixedOff.new(int(parts[1])))','    else:',
 '        cart.set_discount(Discount.new())','    print(cart.checkout())'])
},['discount.gd','main.gd']);
const carts=[['50 30 40',['percentuale 10','fisso 30','nessuno']],
 ['7 8',['percentuale 33','fisso 20','percentuale 0','nessuno']],
 ['0',['fisso 5','percentuale 100','nessuno']],['99',['percentuale 25','percentuale 100','fisso 99']],
 ['4 6 13',['fisso 3','percentuale 50','fisso 0','nessuno']],['1 2',[]]];
activate(219,carts.map(([prices,rows])=>[prices,...counted(rows)]),input=>{
 const total=input[0].split(' ').reduce((sum,n)=>sum+Number(n),0);
 return input.slice(2).map(row=>{
  const [kind,raw]=row.split(' '),n=Number(raw);
  const label=kind==='percentuale'?'sconto '+n+'%':kind==='fisso'?'sconto '+n:'nessuno sconto';
  const price=kind==='percentuale'?total-Math.trunc(total*n/100):kind==='fisso'?Math.max(0,total-n):total;
  return `Subtotale ${total}, ${label}, da pagare ${price}`;
 }).join('\n');
},/\bfunc\s+set_discount\s*\(/,/\bfunc\s+checkout\s*\(/,/\bextends\s+Discount\b/,
 /discount\.apply\s*\(/,/discount\.label\s*\(/);
get(219).task=get(219).task.replace(/\bpercent(?:\s|<span> <\/span>)+N/g,'percentuale N').replace(/\bfixed\s+N/g,'fisso N')
 .replace(/percent 10/g,'percentuale 10').replace(/fixed 30/g,'fisso 30').replace(/\bnone\b/g,'nessuno');

setup(220,{
 'move_command.gd':code(['class_name MoveCommand','extends Command','var hero: Hero','var dx: int','var dy: int',
 'func _init(target: Hero, step_x: int, step_y: int) -> void:','    pass',
 'func execute() -> void:','    pass','func undo() -> void:','    pass']),
 'command_history.gd':code(['class_name CommandHistory','extends RefCounted','var done: Array[Command] = []',
 'func run(command: Command) -> void:','    pass','func undo_last() -> bool:','    return false']),
 'command.gd':code(['@abstract','class_name Command','extends RefCounted','@abstract func execute() -> void','@abstract func undo() -> void']),
 'hero.gd':code(['class_name Hero','extends RefCounted','var x = 0','var y = 0',
 'func position_text() -> String:','    return "(%d, %d)" % [x, y]']),
 'main.gd':main(['var hero = Hero.new()','var history = CommandHistory.new()',
 'var steps = {"su": [0, -1], "giu": [0, 1], "sinistra": [-1, 0], "destra": [1, 0]}',
 'var count = int(OS.read_string_from_stdin())','for i in count:','    var action = OS.read_string_from_stdin()',
 '    if action == "annulla":','        if history.undo_last():',
 '            print("annulla -> ", hero.position_text())','        else:',
 '            print("Nessuna operazione da annullare")','    else:',
 '        var step: Array = steps[action]','        history.run(MoveCommand.new(hero, step[0], step[1]))',
 '        print(action, " -> ", hero.position_text())'])
},['command.gd','hero.gd','main.gd']);
activate(220,[['destra','su','annulla','annulla','annulla'],[],['annulla','annulla'],
 ['sinistra','giu','destra','su','annulla','annulla'],
 ['destra','destra','annulla','su','annulla','annulla','annulla'],
 ['giu','giu','sinistra','annulla','annulla','annulla','destra']].map(counted),input=>{
 let x=0,y=0;const history=[],out=[],steps={su:[0,-1],giu:[0,1],sinistra:[-1,0],destra:[1,0]};
 for(const action of input.slice(1)){
  if(action==='annulla'){
   if(!history.length){out.push('Nessuna operazione da annullare');continue;}
   const [dx,dy]=history.pop();x-=dx;y-=dy;
  }else{const [dx,dy]=steps[action];history.push([dx,dy]);x+=dx;y+=dy;}
  out.push(`${action} -> (${x}, ${y})`);
 }return out.join('\n');
},/\bextends\s+Command\b/,/\bfunc\s+execute\s*\(/,/\bfunc\s+undo\s*\(/,
 /\bfunc\s+run\s*\(/,/\bfunc\s+undo_last\s*\(/,/\.execute\s*\(/,/\.undo\s*\(/);
// Conserva i nomi dei metodi, traduce soltanto i comandi dell'utente.
get(220).task=get(220).task.replace(/\bup\b/g,'su').replace(/\bdown\b/g,'giu').replace(/\bleft\b/g,'sinistra')
 .replace(/\bright\b/g,'destra').replace(/\bundo(?=\s*(?:\)|,|->|-&gt;|l'output))/g,'annulla');
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 ...Object.fromEntries([216,217,218,219,220].map(n=>[n,verifier.expectedCases[n][0].stdin]))});
window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();
