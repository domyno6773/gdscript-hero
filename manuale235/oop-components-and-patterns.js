/* Manuale 211–215. Classi interne, Node compositi, enumerazioni e Facade.
 * Le consegne sono in italiano; i driver hanno input/output completi
 * e vengono sempre verificati dal Godot Web reale con casi alternativi.
 */
(()=>{
'use strict';
const lessons=window.LESSONS_DATA||[],verifier=window.GDHManualVerifier;
if(lessons.length!==235||!verifier)throw Error('Manuale 235 non disponibile');
const get=n=>{const l=lessons.find(x=>x.manualLessonNumber===n);if(!l)throw Error('Lezione mancante '+n);return l;};
const provided=arr=>['extends Node','','func _ready():',...arr.map(x=>'    '+x)].join('\n');
const setup=(n,files,locked=['main.gd'])=>{
 const lesson=get(n);
 lesson.sourceFiles=files;lesson.readOnlyFiles=locked;
 const first=Object.keys(files).find(name=>!locked.includes(name));
 if(!first)throw Error('Nessun file modificabile '+n);
 lesson.initialCode=files[first];lesson.starterCode=lesson.initialCode;
 lesson.requiresMultipleFiles=true;
};
const active=s=>String(s).replace(/^\s*#.*$/gm,'');
const proof=(...requirements)=>s=>requirements.every(rx=>rx.test(active(s)));
const activate=(n,inputs,simulate,check)=>{
 if(inputs.length<5)throw Error('Prove insufficienti '+n);
 const l=get(n);
 verifier.expectedCases[n]=inputs.map((input,i)=>({
   name:'Scenario '+(i+1),stdin:input,output:simulate(input)
 }));
 l.manualSourceCheck=check;l.expectedOutput=verifier.expectedCases[n][0].output;
 l.validationReady=true;
};
const bool=b=>b?'true':'false';

// 211 — Classi interne e array fortemente tipizzato.
setup(211,{
 'leaderboard.gd':[
  'class_name Leaderboard','extends RefCounted','',
  '# Scrivi qui la classe interna Entry con _init e _to_string.','',
  '# Memorizza le voci come Array[Entry] per conservare l’ordine.',
  'var entries = []','',
  'func submit(player: String, score: int) -> void:',
  '    # Aggiorna soltanto se il punteggio migliora.',
  '    pass','',
  'func best():',
  '    # Restituisci la voce migliore; in parità, la prima.',
  '    return null'
 ].join('\n'),
 'main.gd':provided([
  'var board = Leaderboard.new()',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    board.submit(parts[0], int(parts[1]))',
  'for entry in board.entries:',
  '    print(entry)',
  'print("Migliore: ", board.best())'
 ])
});
const leaders=[
 ['Ada 120','Bo 90','Ada 80','Bo 150','Cy 150'],
 ['Solo 5'],
 ['A -10','B -5','A 0','B -15'],
 ['X 0','Y 0','Z 0'],
 ['Nora 20','Eli 19','Nora 21','Eli 30','Nora 30'],
 ['P 100','P 120','P 40','Q 140']
];
activate(211,leaders.map(rows=>[String(rows.length),...rows]),input=>{
 const scores=new Map();
 for(const row of input.slice(1)){
  const [name,pointsRaw]=row.split(' '),points=Number(pointsRaw);
  if(!scores.has(name)||scores.get(name)<points)scores.set(name,points);
 }
 const lines=[...scores.entries()].map(([name,score])=>name+': '+score);
 let bestName=null,bestScore=-Infinity;
 for(const [name,score] of scores)if(score>bestScore){bestScore=score;bestName=name;}
 lines.push('Migliore: '+bestName+': '+bestScore);
 return lines.join('\n');
},s=>proof(/\bclass_name\s+Leaderboard\b/,/\bclass\s+Entry\s*:/,
 /\bvar\s+entries\s*:\s*Array\s*\[\s*Entry\s*\]/,
 /\bfunc\s+submit\s*\(/,/\bfunc\s+best\s*\(/,
 /\bfunc\s+_to_string\s*\(/)(s));

// 212 — Tutti i componenti sono veri nodi della scena.
setup(212,{
 'part.gd':[
  'class_name Part','extends Node','',
  'var power: int','',
  'func _init(part_name: String, new_power: int) -> void:',
  '    # Imposta name e power.',
  '    pass','',
  '# Scrivi _ready(), che annuncia il collegamento.'
 ].join('\n'),
 'robot.gd':[
  'class_name Robot','extends Node','',
  'func add_part(part_name: String, power: int) -> void:',
  '    # Un nome già utilizzato non crea un altro nodo.',
  '    pass','',
  'func total_power() -> int:',
  '    # Somma la potenza dei figli Part.',
  '    return 0'
 ].join('\n'),
 'main.gd':provided([
  'var robot = Robot.new()',
  'add_child(robot)',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    if parts[0] == "aggiungi":',
  '        robot.add_part(parts[1], int(parts[2]))',
  '    else:',
  '        print("Potenza totale: ", robot.total_power())',
  'print("Parti: ", robot.get_child_count())'
 ])
});
const robots=[
 ['aggiungi Laser 5','aggiungi Wheels 2','potenza','aggiungi Laser 9','aggiungi Arm 3','potenza'],
 ['potenza'],
 ['aggiungi A 0','aggiungi A 10','potenza'],
 ['aggiungi X 10','aggiungi Y 4','aggiungi Z 1','potenza'],
 ['aggiungi Wheel 7','potenza','aggiungi Wing 5','potenza'],
 ['aggiungi Core 3','aggiungi Core 3','aggiungi Jet 12','potenza']
];
activate(212,robots.map(rows=>[String(rows.length),...rows]),input=>{
 const parts=new Map(),lines=[];
 for(const row of input.slice(1)){
  const [action,name,power]=row.split(' ');
  if(action==='aggiungi'){
   if(parts.has(name))lines.push(name+' è già collegato');
   else{parts.set(name,Number(power));lines.push(name+' attached');}
  }else lines.push('Potenza totale: '+[...parts.values()].reduce((a,b)=>a+b,0));
 }
 lines.push('Parti: '+parts.size);
 return lines.join('\n');
},s=>proof(/\bclass_name\s+Robot\b/,/\bclass_name\s+Part\b/,
 /\bextends\s+Node\b/,/\bfunc\s+add_part\s*\(/,
 /\bfunc\s+total_power\s*\(/,/\bfunc\s+_ready\s*\(/,
 /\badd_child\s*\(/,/\bget_children\s*\(/)(s));

// 213 — Un nodo viene rimosso dall'albero immediatamente alla sconfitta.
setup(213,{
 'wave.gd':[
  'class_name Wave','extends Node','',
  'func spawn(enemy_name: String, hp: int) -> void:',
  '    # Crea Enemy soltanto se non è già presente.',
  '    pass','',
  'func hit(enemy_name: String, damage: int) -> void:',
  '    # Gli HP a zero eliminano subito il nodo figlio.',
  '    pass','',
  'func alive() -> int:',
  '    return 0'
 ].join('\n'),
 'enemy.gd':[
  'class_name Enemy','extends Node','',
  'var hp: int','',
  'func _init(enemy_name: String, start_hp: int) -> void:',
  '    name = enemy_name',
  '    hp = start_hp'
 ].join('\n'),
 'main.gd':provided([
  'var wave = Wave.new()',
  'add_child(wave)',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    if parts[0] == "genera":',
  '        wave.spawn(parts[1], int(parts[2]))',
  '    elif parts[0] == "colpisci":',
  '        wave.hit(parts[1], int(parts[2]))',
  '    else:',
  '        print("Nemici: ", wave.alive())',
  'print("Nemici rimasti: ", wave.alive())'
 ])
},['enemy.gd','main.gd']);
const waves=[
 ['genera Goblin 5','genera Orc 12','colpisci Goblin 6','conta','colpisci Goblin 1','genera Orc 3','colpisci Orc 4'],
 ['conta','colpisci Ghost 5'],
 ['genera Slime 2','colpisci Slime 1','colpisci Slime 1','conta'],
 ['genera A 1','genera B 2','genera A 10','colpisci B 2','genera B 5','conta'],
 ['genera Z 10','colpisci Z 0','colpisci Z 3','conta'],
 ['genera X 4','colpisci X 8','genera X 9','colpisci X 3','conta']
];
activate(213,waves.map(rows=>[String(rows.length),...rows]),input=>{
 const activeEnemies=new Map(),out=[];
 for(const line of input.slice(1)){
  const [op,name,valueRaw]=line.split(' '),n=Number(valueRaw);
  if(op==='genera'){
   if(activeEnemies.has(name))out.push(name+' è già presente');
   else activeEnemies.set(name,n);
  }else if(op==='colpisci'){
   if(!activeEnemies.has(name))out.push('Nessun '+name+' presente');
   else{
    const hp=activeEnemies.get(name)-n;
    if(hp<=0){activeEnemies.delete(name);out.push(name+' defeated');}
    else{activeEnemies.set(name,hp);out.push(name+' ha '+hp+' PS');}
   }
  }else out.push('Nemici: '+activeEnemies.size);
 }
 out.push('Nemici rimasti: '+activeEnemies.size);
 return out.join('\n');
},s=>proof(/\bclass_name\s+Wave\b/,/\bclass_name\s+Enemy\b/,
 /\bfunc\s+spawn\s*\(/,/\bfunc\s+hit\s*\(/,/\bfunc\s+alive\s*\(/,
 /\badd_child\s*\(/,/\bremove_child\s*\(/,/\bqueue_free\s*\(/)(s));
const l213=get(213);
l213.task=l213.task.replace(/Orco ha 8 PS/g,'Orc ha 8 PS')
 .replace(/No Orc here/g,'Nessun Orc presente')
 .replace(/No Orc/g,'Nessun Orc')
 .replace(/spawn Goblin 5/g,'genera Goblin 5')
 .replace(/hit Goblin 6/g,'colpisci Goblin 6')
 .replace(/\bcount\b/g,'conta');

// 214 — Enum dentro Potion, tutte le tipologie sono riassunte anche se vuote.
setup(214,{
 'potion.gd':[
  'class_name Potion','extends RefCounted','',
  '# Definisci enum Kind { HEAL, MANA, POISON }.','',
  '# Usa Kind come tipo della proprietà kind.',
  'var kind: int',
  'var strength: int','',
  'func _init(potion_kind: int, potion_strength: int) -> void:',
  '    kind = potion_kind',
  '    strength = potion_strength','',
  'static func from_text(text: String, potion_strength: int) -> Potion:',
  '    return null','',
  'func describe() -> String:',
  '    return ""'
 ].join('\n'),
 'belt.gd':[
  'class_name Belt','extends RefCounted','',
  'var potions: Array[Potion] = []','',
  'func add(potion: Potion) -> void:',
  '    potions.append(potion)','',
  'func summary() -> Array[String]:',
  '    var lines: Array[String] = []',
  '    # Una riga per ciascuno dei tre tipi di pozione.',
  '    return lines'
 ].join('\n'),
 'main.gd':provided([
  'var belt = Belt.new()',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    var potion = Potion.from_text(parts[0], int(parts[1]))',
  '    belt.add(potion)',
  '    print("Aggiunto ", potion.describe())',
  'for line in belt.summary():',
  '    print(line)'
 ])
});
const potions=[
 ['HEAL 20','POISON 5','HEAL 15'],
 [],
 ['MANA 15'],
 ['HEAL 0','MANA 0','POISON 0'],
 ['POISON 3','MANA 7','MANA 12','HEAL 8'],
 ['HEAL 99','HEAL 1','POISON 4','POISON 10']
];
activate(214,potions.map(rows=>[String(rows.length),...rows]),input=>{
 const counts=new Map([['HEAL',[0,0]],['MANA',[0,0]],['POISON',[0,0]]]),out=[];
 for(const row of input.slice(1)){
  const [kind,powerRaw]=row.split(' '),n=Number(powerRaw),item=counts.get(kind);
  item[0]++;item[1]+=n;
  out.push('Aggiunto '+kind+' pozione: '+(kind==='POISON'?'-':'+')+n+
   (kind==='MANA'?' MP':' HP'));
 }
 for(const [kind,[count,total]] of counts)
  out.push(kind+': '+count+' ('+total+' totali)');
 return out.join('\n');
},s=>proof(/\bclass_name\s+Potion\b/,/\bclass_name\s+Belt\b/,
 /\benum\s+Kind\s*\{/,/\bvar\s+kind\s*:\s*Kind\b/,
 /\bstatic\s+func\s+from_text\s*\(/,
 /\bfunc\s+describe\s*\(/,/\bfunc\s+summary\s*\(/)(s));
get(214).task=get(214).task.replace(/\bin pozione\.gd\b/g,'in potion.gd');

// 215 — Facade centralizza l'ordine delle chiamate ai tre sottosistemi.
setup(215,{
 'game_facade.gd':[
  'class_name GameFacade','extends RefCounted','',
  '# Crea MusicPlayer, LevelMap e Hud come variabili membro.','',
  'func start_level(number: int, hearts: int) -> void:',
  '    # Prima musica, poi mappa, poi HUD.',
  '    pass','',
  'func quit_level() -> void:',
  '    # Prima nascondi l’HUD, poi ferma la musica.',
  '    pass'
 ].join('\n'),
 'music_player.gd':[
  'class_name MusicPlayer','extends RefCounted','',
  'func play(track: String) -> void:',
  '    print("Musica: riproduzione di ", track)','',
  'func stop() -> void:',
  '    print("Musica: interrotta")'
 ].join('\n'),
 'level_map.gd':[
  'class_name LevelMap','extends RefCounted','',
  'func load_map(number: int) -> void:',
  '    print("Mappa: livello ", number, " caricata")'
 ].join('\n'),
 'hud.gd':[
  'class_name Hud','extends RefCounted','',
  'func show_hearts(hearts: int) -> void:',
  '    print("HUD: cuori ", hearts)','',
  'func hide() -> void:',
  '    print("HUD: nascosto")'
 ].join('\n'),
 'main.gd':provided([
  'var game = GameFacade.new()',
  'var count = int(OS.read_string_from_stdin())',
  'for i in count:',
  '    var parts = OS.read_string_from_stdin().split(" ")',
  '    if parts[0] == "inizia":',
  '        game.start_level(int(parts[1]), int(parts[2]))',
  '    elif parts[0] == "esci":',
  '        game.quit_level()'
 ])
},['music_player.gd','level_map.gd','hud.gd','main.gd']);
const facades=[
 ['inizia 5 2','esci'],
 [],
 ['inizia 1 3','inizia 2 1','esci'],
 ['esci','inizia 10 4'],
 ['inizia 15 9','esci','inizia 20 2'],
 ['inizia 4 0','esci','esci']
];
activate(215,facades.map(rows=>[String(rows.length),...rows]),input=>{
 const out=[];
 for(const row of input.slice(1)){
  const [action,level,hearts]=row.split(' ');
  if(action==='inizia'){
   const music=Number(level)%5===0?'boss.ogg':'level_'+level+'.ogg';
   out.push('Musica: riproduzione di '+music,
    'Mappa: livello '+level+' caricata','HUD: cuori '+hearts);
  }else out.push('HUD: nascosto','Musica: interrotta');
 }
 return out.join('\n');
},s=>proof(/\bclass_name\s+GameFacade\b/,
 /\bMusicPlayer\.new\s*\(/,/\bLevelMap\.new\s*\(/,/\bHud\.new\s*\(/,
 /\bfunc\s+start_level\s*\(/,/\bfunc\s+quit_level\s*\(/,
 /\.play\s*\(/,/\.load_map\s*\(/,/\.show_hearts\s*\(/,/\.hide\s*\(/,/\.stop\s*\(/)(s));
const l215=get(215);
l215.task=l215.task.replace(/start NUMERO CUORI/g,'inizia NUMERO CUORI')
 .replace(/\bquit\b/g,'esci').replace(/start 5 2/g,'inizia 5 2');

window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
 211:['5',...leaders[0]],212:[String(robots[0].length),...robots[0]],
 213:[String(waves[0].length),...waves[0]],
 214:[String(potions[0].length),...potions[0]],
 215:[String(facades[0].length),...facades[0]]});
window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
window.GDHManualMigration.readyForRelease=false;
})();
