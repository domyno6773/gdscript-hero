/* Lezioni 123–128: insiemi tramite Dictionary e filtraggio duplicati.
 * Mantiene l'ordine della prima comparsa, come richiede il manuale.
 */
(() => {
 'use strict';
 const data=window.LESSONS_DATA||[],verify=window.GDHManualVerifier;
 if(data.length!==235||!verify)throw Error('Manuale 235 non pronto');
 const lesson=n=>{
   const l=data.find(x=>x.manualLessonNumber===n);
   if(!l)throw Error('Lezione '+n+' mancante');
   return l;
 };
 const patch=(n,source)=>{
   const l=lesson(n);l.initialCode=source;l.starterCode=source;
   l.sourceFiles={...l.sourceFiles,'main.gd':source};
 };
 const active=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
 const proof=(...re)=>src=>re.every(p=>p.test(active(src)));
 const define=(n,cases,rules)=>{
   const l=lesson(n);
   verify.expectedCases[n]=cases;
   l.manualSourceCheck=rules;
   l.expectedOutput=cases[0].output||'Risultato di verifica';
   l.validationReady=true;
 };
 const array=a=>'['+a.map(x=>typeof x==='string'?JSON.stringify(x):String(x)).join(', ')+']';
 const distinct=a=>a.filter((value,i)=>a.indexOf(value)===i);

 const medals=lesson(123);
 medals.task=medals.task.replace('Unique badges:', 'Medaglie diverse:');
 patch(123,[
   'extends Node','','func _ready():',
   '    var badges = {}',
   '    for i in range(4):',
   '        var badge = OS.read_string_from_stdin()',
   '        # Inserisci badge nel dizionario usato come insieme.',
   '        pass',
   '    # Stampa numero di medaglie diverse e membri in ordine.'
 ].join('\n'));
 const medalSamples=[
   ['Sniper','Medic','Sniper','Builder'],
   ['Medic','Medic','Medic','Medic'],
   ['A','B','C','D'],
   ['X','Y','X','Y']
 ];
 define(123,medalSamples.map(m=>({
   name:'Medaglie di quattro partite',stdin:m,
   output:'Medaglie diverse: '+distinct(m).length+'\n'+array(distinct(m))
 })),proof(/\bbadges\b/,/\bfor\b/,/\bbadge\b/,/\.keys\s*\(\s*\)/,
   /\.size\s*\(\s*\)/));

 patch(124,[
   'extends Node','','func _ready():',
   '    var guest_list = OS.read_string_from_stdin().split(" ", false)',
   '    var arrivals = OS.read_string_from_stdin().split(" ", false)',
   '    var guests = {}',
   '    # Crea l’insieme degli ospiti e controlla chi arriva.'
 ].join('\n'));
 const guestSamples=[
   [['mia','leo','ana','mia'],['mia','sam','ana']],
   [['luca','marta'],['luca','luca','otto']],
   [['a','b','c','a'],['x','b','a']],
   [['uno'],['uno']]
 ];
 define(124,guestSamples.map(([known,arrivals])=>({
   name:'Ingressi degli ospiti',stdin:[known.join(' '),arrivals.join(' ')],
   output:[
     'Ospiti nell’elenco: '+distinct(known).length,
     ...arrivals.map(name=>name+': '+
       (known.includes(name)?'benvenuto':'non presente nell’elenco'))
   ].join('\n')
 })),proof(/\bguests\b/,/\bguest_list\b/,/\barrivals\b/,
   /\bfor\b/,/\bin\s+guests\b|\.has\s*\(/));

 const book=lesson(125);
 book.task=book.task.replace(/Nessun(?:<[^>]*>|\s)+ARTICOLO\s+da(?:<[^>]*>|\s)+rimuovi\./g,
   'Nessuna ARTICOLO da rimuovere.');
 patch(125,[
   'extends Node','','func _ready():',
   '    var inventory = {}',
   '    while true:',
   '        var command = OS.read_string_from_stdin()',
   '        if command == "fine":',
   '            break',
   '        var parts = command.split(" ")',
   '        var action = parts[0]',
   '        var item = parts[1]',
   '        # Aggiorna inventory come insieme e stampa il risultato.',
   '    # Stampa gli oggetti rimasti, nell’ordine di inserimento.'
 ].join('\n'));
 const commands=[
   ['aggiungi torcia','aggiungi corda','aggiungi torcia',
     'rimuovi mappa','rimuovi corda','fine'],
   ['aggiungi mappa','aggiungi corda','rimuovi mappa','aggiungi mappa','fine'],
   ['rimuovi torcia','fine'],
   ['aggiungi palla','aggiungi palla','rimuovi palla','fine']
 ];
 const inventoryResult=cmd=>{
   const current=[],out=[];
   for(const line of cmd){
     if(line==='fine')break;
     const [action,item]=line.split(' ');
     if(action==='aggiungi'){
       if(current.includes(item))out.push('Già presente '+item);
       else {current.push(item);out.push('Aggiunto '+item);}
     }else if(action==='rimuovi'){
       const pos=current.indexOf(item);
       if(pos<0)out.push('Nessuna '+item+' da rimuovere');
       else {current.splice(pos,1);out.push('Rimosso '+item);}
     }
   }
   out.push('Inventario: '+(current.length?current.join(', '):'vuoto'));
   return out.join('\n');
 };
 define(125,commands.map(lines=>({
   name:'Aggiunte e rimozioni',stdin:lines,output:inventoryResult(lines)
 })),proof(/\binventory\b/,/\bwhile\s+true\s*:/,
   /\baction\b/,/\bitem\b/,/\.erase\s*\(/,/\binventory\.keys\s*\(/));

 const skillSamples=[
   [['salto','scatto'],['scatto','nuoto']],
   [['corsa','salto'],['volo']],
   [['A','B','C'],['B','A','C']],
   [['uno'],['uno']]
 ];
 const uniqueUnion=(a,b)=>distinct([...a,...b]);
 const common=(a,b)=>distinct(a).filter(v=>b.includes(v));
 const left=(a,b)=>distinct(a).filter(v=>!b.includes(v));
 const skills=(n,src)=>{
   patch(n,[
     'extends Node','','func _ready():',
     '    var first = {}',
     '    for skill in OS.read_string_from_stdin().split(" ", false):',
     '        first[skill] = true',
     '    var second = {}',
     '    for skill in OS.read_string_from_stdin().split(" ", false):',
     '        second[skill] = true',
     '    # Calcola le operazioni sugli insiemi e stampa i risultati.'
   ].join('\n').replaceAll('first',n===126?'first':'needed')
     .replaceAll('second',n===126?'second':'packed'));
 };
 skills(126);
 define(126,skillSamples.map(([a,b])=>({
   name:'Abilità condivise',stdin:[a.join(' '),b.join(' ')],
   output:'Tutte le abilità: '+uniqueUnion(a,b).join(', ')+
     '\nAbilità condivise: '+(common(a,b).join(', ')||'nessuna')
 })),proof(/\bfirst\b/,/\bsecond\b/,/\bfor\b/,
   /\.has\s*\(|\bin\s+second\b/,/\bprint\s*\(/));
 skills(127);
 const packing=[
   [['corda','torcia','mappa'],['torcia','mela']],
   [['carta','penna'],['carta','penna']],
   [['a'],['x','a','y']],
   [['uno','due','tre'],['quattro']]
 ];
 define(127,packing.map(([needed,packed])=>({
   name:'Confronto tra necessario e valigia',
   stdin:[needed.join(' '),packed.join(' ')],
   output:'Mancano: '+(left(needed,packed).join(', ')||'nessuno')+
     '\nExtra: '+(left(packed,needed).join(', ')||'nessuno')
 })),proof(/\bneeded\b/,/\bpacked\b/,/\bfor\b/,
   /\.has\s*\(|\bin\s+packed\b|\bin\s+needed\b/,/\bprint\s*\(/));

 patch(128,[
   'func remove_duplicates(numbers: Array[int]) -> Array[int]:',
   '    # Usa un Dictionary per ricordare i numeri già visti.',
   '    pass'
 ].join('\n'));
 const cases=[
   [1,2,2,3,4,4,5],[5,4,5,3,4],
   [],[3,3,3],[-1,0,-1,1,0], [0,7,8,9]
 ];
 define(128,cases.map(xs=>({
   name:'Rimuovi duplicati da '+array(xs),
   harness:'func _ready():\n    print(remove_duplicates('+array(xs)+'))',
   output:array(distinct(xs))
 })),src=>proof(/\bfunc\s+remove_duplicates\s*\(\s*numbers\s*:\s*Array\s*\[\s*int\s*\]\s*\)\s*->\s*Array\s*\[\s*int\s*\]/,
   /\bfor\b/,/\breturn\b/,/\.has\s*\(|\bin\s+seen\b|\bin\s+used\b/)(src)&&
   !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(active(src)));
 window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
   123:['Sniper','Medic','Sniper','Builder'],
   124:['mia leo ana mia','mia sam ana'],
   125:commands[0],126:['salto scatto','scatto nuoto'],
   127:['corda torcia mappa','torcia mela']
 });
 window.GDHManualMigration.validated=data.filter(x=>x.validationReady).length;
 window.GDHManualMigration.readyForRelease=false;
})();
