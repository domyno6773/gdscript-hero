/* Manuale 206–210: segnali, salute e composizione.
 * I file di partenza sono incompleti; le soluzioni sono soltanto nei test.
 */
(()=>{
'use strict';
const ls=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
const lesson=n=>ls.find(l=>l.manualLessonNumber===n);
const main=lines=>['extends Node','','func _ready():',...lines.map(x=>'    '+x)].join('\n');
function prepare(n,files,locked=['main.gd']){
 const l=lesson(n);if(!l)throw Error('Lezione mancante '+n);
 l.sourceFiles=files;l.readOnlyFiles=locked;
 l.initialCode=files[Object.keys(files).find(k=>!locked.includes(k))];
 l.starterCode=l.initialCode;l.requiresMultipleFiles=true;
}
const check=(...re)=>src=>re.every(r=>r.test(String(src).replace(/^\s*#.*$/gm,'')));
function activate(n,sets,sourceCheck){
 const l=lesson(n);v.expectedCases[n]=sets;
 l.manualSourceCheck=sourceCheck;l.expectedOutput=sets[0].output;
 l.validationReady=true;
}
const cases=(a,simulate)=>a.map((item,i)=>({name:'Scenario '+(i+1),stdin:item.input,output:simulate(item)}));
const it=n=>String(n);
prepare(206,{
 'bomb.gd':[
 'class_name Bomb','extends RefCounted','',
 '# Dichiara i segnali beeped ed exploded.','var fuse: int','',
 'func _init(start_fuse: int) -> void:',
 '    fuse = start_fuse','',
 'func tick() -> void:',
 '    # Non emettere nulla quando fuse è già 0.',
 '    pass'].join('\n'),
 'main.gd':[
 'extends Node','','func _ready():',
 '    var bomb = Bomb.new(int(OS.read_string_from_stdin()))',
 '    bomb.connect("beeped", _on_beeped)',
 '    bomb.connect("exploded", _on_exploded)',
 '    var ticks = int(OS.read_string_from_stdin())',
 '    for i in ticks:',
 '        bomb.tick()',
 '    print("Miccia: ", bomb.fuse)','',
 'func _on_beeped() -> void:',
 '    print("Beep")','',
 'func _on_exploded() -> void:',
 '    print("BOOM!")'].join('\n')
});
const bombScenarios=[[3,5],[1,1],[0,4],[5,2],[2,7],[10,0]].map(([fuse,ticks])=>({input:[it(fuse),it(ticks)],fuse,ticks}));
activate(206,cases(bombScenarios,({fuse,ticks})=>{
 const output=[];for(let i=0;i<ticks&&fuse>0;i++){fuse--;output.push(fuse>0?'Beep':'BOOM!');}
 return [...output,'Miccia: '+fuse].join('\n');
}),check(/\bsignal\s+beeped\b/,/\bsignal\s+exploded\b/,/\bfunc\s+tick\s*\(/,/beeped\.emit\s*\(/,/exploded\.emit\s*\(/));
lesson(206).task=lesson(206).task.replace(/Fuse: 0/g,'Miccia: 0');

prepare(207,{
 'score_board.gd':[
 'class_name ScoreBoard','extends RefCounted','',
 'var points: int = 0','',
 'func watch(target: Target) -> void:',
 '    # Connetti il segnale una sola volta.',
 '    pass','',
 'func ignore(target: Target) -> void:',
 '    # Scollega solo se era connesso.',
 '    pass','',
 'func _on_target_hit() -> void:',
 '    # Aggiungi dieci punti e stampa il punteggio.',
 '    pass'].join('\n'),
 'target.gd':[
 'class_name Target','extends RefCounted','',
 'signal hit','',
 'func shoot() -> void:',
 '    hit.emit()'].join('\n'),
 'main.gd':main([
 'var board = ScoreBoard.new()',
 'var targets: Array[Target] = []',
 'for i in int(OS.read_string_from_stdin()):',
 '    targets.append(Target.new())',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    var target = targets[int(parts[1])]',
 '    if parts[0] == "osserva":',
 '        board.watch(target)',
 '    elif parts[0] == "ignora":',
 '        board.ignore(target)',
 '    else:',
 '        print("Bersaglio colpito ", parts[1])',
 '        target.shoot()',
 'print("Punteggio finale: ", board.points)'
 ])
},['target.gd','main.gd']);
const targets=[
 {n:2,cmd:['osserva 0','colpisci 0','colpisci 1','osserva 1','osserva 1','colpisci 1','ignora 0','colpisci 0']},
 {n:1,cmd:['colpisci 0','osserva 0','colpisci 0','ignora 0','ignora 0','colpisci 0']},
 {n:2,cmd:['osserva 1','osserva 0','colpisci 0','colpisci 1','colpisci 1']},
 {n:3,cmd:[]},
 {n:2,cmd:['osserva 0','ignora 0','osserva 0','colpisci 0']},
 {n:1,cmd:['osserva 0','osserva 0','colpisci 0','colpisci 0']}
];
activate(207,cases(targets.map(x=>({...x,input:[it(x.n),it(x.cmd.length),...x.cmd]})),({cmd})=>{
 let points=0;const observed=new Set(),out=[];
 for(const line of cmd){const [command,target]=line.split(' ');
 if(command==='osserva')observed.add(target);
 else if(command==='ignora')observed.delete(target);
 else{out.push('Bersaglio colpito '+target);if(observed.has(target)){points+=10;out.push('Hit! Punteggio: '+points);}}}
 return [...out,'Punteggio finale: '+points].join('\n');
}),check(/\bfunc\s+watch\s*\(/,/\bfunc\s+ignore\s*\(/,/\bfunc\s+_on_target_hit\s*\(/,/\.connect\s*\(/,/\.disconnect\s*\(/,/\.is_connected\s*\(/,/\bpoints\s*\+=\s*10\b/));
lesson(207).task=lesson(207).task.replace(/watch 0/g,'osserva 0').replace(/watch 1/g,'osserva 1').replace(/ignore 0/g,'ignora 0').replace(/shoot 0/g,'colpisci 0').replace(/shoot 1/g,'colpisci 1');

prepare(208,{
 'wallet.gd':[
 'class_name Wallet','extends RefCounted','',
 '# Dichiara i segnali con gli argomenti richiesti.',
 'signal balance_changed',
 'signal purchase_failed','',
 'var balance: int = 0','',
 'func add(amount: int) -> void:',
 '    pass','',
 'func buy(price: int) -> void:',
 '    pass'
 ].join('\n'),
 'main.gd':[
 'extends Node','','func _ready():',
 '    var wallet = Wallet.new()',
 '    wallet.balance_changed.connect(_on_balance_changed)',
 '    wallet.purchase_failed.connect(_on_purchase_failed)',
 '    var count = int(OS.read_string_from_stdin())',
 '    for i in count:',
 '        var parts = OS.read_string_from_stdin().split(" ")',
 '        if parts[0] == "aggiungi":',
 '            wallet.add(int(parts[1]))',
 '        else:',
 '            wallet.buy(int(parts[1]))',
 '    print("Monete rimaste: ", wallet.balance)','',
 'func _on_balance_changed(old_balance: int, new_balance: int) -> void:',
 '    print("Saldo: %d -> %d" % [old_balance, new_balance])','',
 'func _on_purchase_failed(price: int, missing: int) -> void:',
 '    print("Impossibile acquistare per %d: mancano %d monete" % [price, missing])'
 ].join('\n')
});
const wallets=[
 ['aggiungi 20','compra 15','compra 10','aggiungi 5','compra 10'],
 [],['compra 5'],['aggiungi 100','compra 30','compra 70'],
 ['aggiungi 0','compra 0'],['aggiungi 12','compra 20','compra 12']
];
activate(208,cases(wallets.map(cmd=>({input:[it(cmd.length),...cmd],cmd})),({cmd})=>{
 let balance=0;const out=[];
 for(const line of cmd){const [word,str]=line.split(' '),amount=Number(str);
 if(word==='aggiungi'){const previous=balance;balance+=amount;out.push('Saldo: '+previous+' -> '+balance);}
 else if(balance>=amount){const previous=balance;balance-=amount;out.push('Saldo: '+previous+' -> '+balance);}
 else out.push('Impossibile acquistare per '+amount+': mancano '+(amount-balance)+' monete');}
 return [...out,'Monete rimaste: '+balance].join('\n');
}),check(/signal\s+balance_changed\s*\(\s*\w+\s*:\s*int\s*,\s*\w+\s*:\s*int\s*\)/,
 /signal\s+purchase_failed\s*\(\s*\w+\s*:\s*int\s*,\s*\w+\s*:\s*int\s*\)/,
 /balance_changed\.emit\s*\(/,/purchase_failed\.emit\s*\(/));
lesson(208).task=lesson(208).task.replace(/add 20/g,'aggiungi 20').replace(/add 5/g,'aggiungi 5').replace(/buy 15/g,'compra 15').replace(/buy 10/g,'compra 10');

prepare(209,{
 'health.gd':[
 'class_name Health','extends RefCounted','',
 '# Dichiara damaged(amount, hp), healed(amount, hp) e died.',
 'var max_hp: int','var hp: int','',
 'func _init(start_hp: int) -> void:',
 '    max_hp = start_hp',
 '    hp = start_hp','',
 'func take_damage(amount: int) -> void:',
 '    pass','',
 'func heal(amount: int) -> void:',
 '    pass'
 ].join('\n'),
 'health_bar.gd':[
 'class_name HealthBar','extends RefCounted','',
 '# Memorizza il massimo, non l’oggetto Health.',
 'func watch(health: Health) -> void:',
 '    # Collega i tre segnali ai callback.',
 '    pass',
 '# Implementa i callback per i danni, le cure e la morte.'
 ].join('\n'),
 'main.gd':main([
 'var health = Health.new(int(OS.read_string_from_stdin()))',
 'var bar = HealthBar.new()',
 'bar.watch(health)',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    if parts[0] == "danno":',
 '        health.take_damage(int(parts[1]))',
 '    elif parts[0] == "cura":',
 '        health.heal(int(parts[1]))',
 'print("Salute finale: ", health.hp)'
 ])
});
const healthScenarios=[
 {max:20,cmd:['danno 8','cura 5','cura 10','danno 30','cura 5']},
 {max:10,cmd:['danno 10','danno 3','cura 3']},
 {max:30,cmd:['cura 20','danno 5','cura 5']},
 {max:100,cmd:[]},
 {max:1,cmd:['danno 1','danno 1']},
 {max:25,cmd:['danno 8','cura 2','danno 12','cura 100']}
];
activate(209,cases(healthScenarios.map(x=>({...x,input:[it(x.max),it(x.cmd.length),...x.cmd]})),({max,cmd})=>{
 let hp=max;const out=[];
 for(const line of cmd){const [op,n]=line.split(' '),old=hp,amount=Number(n);
 if(hp===0||amount<=0)continue;
 if(op==='danno'){hp=Math.max(0,hp-amount);if(old!==hp){out.push('-'+(old-hp)+' HP ['+hp+'/'+max+']');if(hp===0)out.push('Partita terminata');}}
 else{hp=Math.min(max,hp+amount);if(old!==hp)out.push('+'+(hp-old)+' HP ['+hp+'/'+max+']');}}
 return [...out,'Salute finale: '+hp].join('\n');
}),check(/signal\s+damaged\s*\(/,/signal\s+healed\s*\(/,/\bsignal\s+died\b/,
 /damaged\.emit\s*\(/,/healed\.emit\s*\(/,/died\.emit\s*\(/,
 /damaged\.connect\s*\(/,/healed\.connect\s*\(/,/died\.connect\s*\(/));

prepare(210,{
 'weapon.gd':[
 'class_name Weapon','extends RefCounted','',
 'var weapon_name: String','var damage: int','',
 'func _init(new_name: String, new_damage: int) -> void:',
 '    # Memorizza il nome e il danno.',
 '    pass'
 ].join('\n'),
 'knight.gd':[
 'class_name Knight','extends RefCounted','',
 'var knight_name: String',
 '# Dichiara un campo Weapon (inizialmente null).','',
 'func _init(new_name: String) -> void:',
 '    knight_name = new_name','',
 'func equip(new_weapon: Weapon) -> void:',
 '    pass','',
 'func drop() -> void:',
 '    pass','',
 'func attack() -> String:',
 '    return ""'
 ].join('\n'),
 'main.gd':main([
 'var knight = Knight.new(OS.read_string_from_stdin())',
 'var count = int(OS.read_string_from_stdin())',
 'for i in count:',
 '    var parts = OS.read_string_from_stdin().split(" ")',
 '    if parts[0] == "equipaggia":',
 '        knight.equip(Weapon.new(parts[1], int(parts[2])))',
 '        print("Equipaggiato ", parts[1])',
 '    elif parts[0] == "lascia":',
 '        knight.drop()',
 '        print("Arma lasciata a terra")',
 '    else:',
 '        print(knight.attack())'
 ])
});
const knights=[
 {name:'Ada',cmd:['attacca','equipaggia Spada 7','attacca','equipaggia Axe 12','attacca','lascia','attacca']},
 {name:'Leo',cmd:['attacca']},
 {name:'Zoe',cmd:['equipaggia Lancia 8','attacca','lascia','attacca']},
 {name:'Kai',cmd:[]},
 {name:'Bo',cmd:['equipaggia Arco 4','equipaggia Lama 9','attacca']},
 {name:'Tia',cmd:['lascia','attacca','equipaggia Martello 0','attacca']}
];
activate(210,cases(knights.map(x=>({...x,input:[x.name,it(x.cmd.length),...x.cmd]})),({name,cmd})=>{
 let weapon=null;const out=[];
 for(const line of cmd){const [op,item,dmg]=line.split(' ');
 if(op==='equipaggia'){weapon={name:item,damage:dmg};out.push('Equipaggiato '+item);}
 else if(op==='lascia'){weapon=null;out.push('Arma lasciata a terra');}
 else out.push(weapon?name+' attacca con '+weapon.name+' per '+weapon.damage+' danni':name+' non ha armi');}
 return out.join('\n');
}),check(/\bclass_name\s+Weapon\b/,/\bclass_name\s+Knight\b/,
 /\bfunc\s+equip\s*\(/,/\bfunc\s+drop\s*\(/,/\bfunc\s+attack\s*\(/,
 /\bweapon_name\b/,/\bdamage\b/));
lesson(210).task=lesson(210).task.replace(/for (\d+) danni/g,'per $1 danni').replace(/equip Spada 7/g,'equipaggia Spada 7').replace(/equip Axe 12/g,'equipaggia Axe 12').replace(/attack/g,'attacca').replace(/drop/g,'lascia');
window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 206:['3','5'],207:['2','8',...targets[0].cmd],208:[it(wallets[0].length),...wallets[0]],
 209:['20',it(healthScenarios[0].cmd.length),...healthScenarios[0].cmd],
 210:['Ada',it(knights[0].cmd.length),...knights[0].cmd]});
window.GDHManualMigration.validated=ls.filter(x=>x.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();