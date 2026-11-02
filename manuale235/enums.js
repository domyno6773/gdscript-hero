/* Lezioni 129–133: enumerazioni e loro impiego nei programmi.
 * Godot esegue scenari indipendenti per ogni lezione. Nessun dato atteso
 * è iniettato nel codice dello studente; si provano input alternativi.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[];
  const verifier=window.GDHManualVerifier;
  if(lessons.length!==235||!verifier)throw Error('Catalogo 235 non pronto');
  const get=n=>{
    const lesson=lessons.find(item=>item.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione mancante: '+n);
    return lesson;
  };
  const patch=(n,code)=>{
    const lesson=get(n);
    lesson.initialCode=code;
    lesson.starterCode=code;
    lesson.sourceFiles={...lesson.sourceFiles,'main.gd':code};
  };
  const active=code=>String(code).split('\n')
    .filter(line=>!/^\s*#/.test(line)).join('\n');
  const has=(...patterns)=>code=>patterns.every(re=>re.test(active(code)));
  const define=(n,cases,rule)=>{
    if(!cases.length)throw Error('Scenari assenti: '+n);
    const lesson=get(n);
    verifier.expectedCases[n]=cases;
    lesson.expectedOutput=cases[0].output;
    lesson.manualSourceCheck=rule;
    lesson.validationReady=true;
  };

  patch(129,[
    'extends Node',
    '',
    '# Dichiara qui enum Weather con SUNNY, CLOUDY, RAINY e SNOWY.',
    '',
    'func _ready():',
    '    var weather = int(OS.read_string_from_stdin())',
    '    # Confronta weather con Weather.SUNNY, Weather.CLOUDY,',
    '    # Weather.RAINY e Weather.SNOWY e stampa il consiglio.',
    '    pass'
  ].join('\n'));
  const weatherOutputs=[
    'Wear sunglasses','Porta una giacca',
    'Take an umbrella','Costruisci un pupazzo di neve'
  ];
  define(129,weatherOutputs.map((output,value)=>({
    name:'Meteo '+value,stdin:[String(value)],output
  })),has(/\benum\s+Weather\s*\{[^}]*\bSUNNY\b[^}]*\bCLOUDY\b[^}]*\bRAINY\b[^}]*\bSNOWY\b[^}]*\}/s,
    /Weather\.(?:SUNNY|CLOUDY|RAINY|SNOWY)/,/\bprint\s*\(/,
    /\bmatch\b|\bif\b/));

  patch(130,[
    'extends Node',
    '',
    '# Dichiara Difficulty: EASY = 1, NORMAL, HARD, NIGHTMARE = 10.',
    '',
    'func _ready():',
    '    var base_damage = int(OS.read_string_from_stdin())',
    '    # Stampa il danno per ciascuna opzione dell’enum.',
    '    pass'
  ].join('\n'));
  define(130,[0,1,12,37,-3].map(value=>({
    name:'Danno base '+value,stdin:[String(value)],
    output:['EASY: '+value,'NORMAL: '+value*2,'HARD: '+value*3,
      'NIGHTMARE: '+value*10].join('\n')
  })),has(/\benum\s+Difficulty\s*\{[^}]*\bEASY\s*=\s*1\s*,\s*NORMAL\s*,\s*HARD\s*,\s*NIGHTMARE\s*=\s*10\s*\}/s,
    /Difficulty\.EASY/,/Difficulty\.NORMAL/,
    /Difficulty\.HARD/,/Difficulty\.NIGHTMARE/,
    /\bbase_damage\b/,/\bprint\s*\(/));

  // Il PDF definiva le costanti inglesi dell'enum ma chiedeva in input
  // i nomi italiani dei giorni. Manteniamo entrambi: traduzione esplicita.
  const days=[
    ['LUNEDÌ','MONDAY'],['MARTEDÌ','TUESDAY'],
    ['MERCOLEDÌ','WEDNESDAY'],['GIOVEDÌ','THURSDAY'],
    ['VENERDÌ','FRIDAY'],['SABATO','SATURDAY'],['DOMENICA','SUNDAY']
  ];
  const lesson131=get(131);
  lesson131.task=lesson131.task
    .replace('da LUNEDÌ a SUNDAY','da MONDAY a SUNDAY, corrispondente ai giorni italiani da LUNEDÌ a DOMENICA')
    .replace('il nome, has the value e il valore','il nome, la dicitura «ha valore» e il valore')
    .replace('In, il numero, giorni:', '«Tra», il numero, «giorni:»');
  patch(131,[
    'extends Node',
    '',
    'enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }',
    '',
    'func _ready():',
    '    var day_name = OS.read_string_from_stdin()',
    '    var days = int(OS.read_string_from_stdin())',
    '    # Associa i nomi italiani alle costanti Day e viceversa.',
    '    # Mostra il valore dell’enum e il giorno dopo days giorni.',
    '    pass'
  ].join('\n'));
  const dayCases=[[4,3],[0,0],[6,1],[2,7],[1,15],[5,100],[3,2]];
  define(131,dayCases.map(([start,elapsed])=>({
    name:days[start][0]+' più '+elapsed+' giorni',
    stdin:[days[start][0],String(elapsed)],
    output:days[start][0]+' ha valore '+start+'\nTra '+elapsed+
      ' giorni: '+days[(start+elapsed)%7][0]
  })),has(/\benum\s+Day\s*\{[^}]*\bMONDAY\b[^}]*\bTUESDAY\b[^}]*\bWEDNESDAY\b[^}]*\bTHURSDAY\b[^}]*\bFRIDAY\b[^}]*\bSATURDAY\b[^}]*\bSUNDAY\b[^}]*\}/s,
    /Day\.(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)/,
    /\bday_name\b/,/\bdays\b/,/%\s*7/,/\bprint\s*\(/));

  patch(132,[
    'extends Node',
    '',
    'enum State { IDLE, WALK, RUN, JUMP, FALL }',
    '',
    'func describe(state: State):',
    '    # Restituisci "Fermo", "In movimento" o "In aria".',
    '    # Raggruppa WALK/RUN e JUMP/FALL nei rispettivi match.',
    '    pass',
    '',
    'func _ready():',
    '    var names = OS.read_string_from_stdin().split(" ", false)',
    '    for state_name in names:',
    '        print(state_name, ": ", describe(State[state_name]))'
  ].join('\n'));
  const stateLabels={
    IDLE:'Fermo',WALK:'In movimento',RUN:'In movimento',
    JUMP:'In aria',FALL:'In aria'
  };
  const states=[
    ['IDLE','RUN','FALL'],['WALK','JUMP','IDLE'],
    ['IDLE','WALK','RUN','JUMP','FALL'],
    ['FALL','FALL','RUN']
  ];
  define(132,states.map(names=>({
    name:'Stati '+names.join(', '),stdin:[names.join(' ')],
    output:names.map(name=>name+': '+stateLabels[name]).join('\n')
  })),has(/\benum\s+State\s*\{[^}]*\bIDLE\b[^}]*\bWALK\b[^}]*\bRUN\b[^}]*\bJUMP\b[^}]*\bFALL\b[^}]*\}/s,
    /\bfunc\s+describe\s*\(\s*state\s*:\s*State\s*\)/,
    /\bmatch\s+state\s*:/,
    /State\.WALK\s*,\s*State\.RUN\s*:/,
    /State\.JUMP\s*,\s*State\.FALL\s*:/,/\breturn\b/));

  patch(133,[
    'extends Node',
    '',
    '# Dichiara enum TrafficLight con RED, YELLOW e GREEN.',
    '',
    '# Scrivi get_driver_action(light), get_wait_time(light)',
    '# e get_next_light(light), ciascuna usando match.',
    '',
    'func _ready():',
    '    var first = OS.read_string_from_stdin()',
    '    var count = int(OS.read_string_from_stdin())',
    '    # Stampa per count volte colore, azione e attesa.',
    '    # Avanza al colore successivo; infine stampa il totale.',
    '    pass'
  ].join('\n'));
  const signals={
    RED:{label:'ROSSO',action:'Fermati',wait:30,next:'GREEN'},
    GREEN:{label:'VERDE',action:'Procedi',wait:25,next:'YELLOW'},
    YELLOW:{label:'GIALLO',action:'Attenzione',wait:3,next:'RED'}
  };
  const lightRuns=[['RED',4],['GREEN',1],['YELLOW',5],
    ['RED',2],['GREEN',6],['YELLOW',2]];
  define(133,lightRuns.map(([first,count])=>{
    let light=first,total=0;
    const output=[];
    for(let i=0;i<count;i++){
      const current=signals[light];total+=current.wait;
      output.push(current.label+': '+current.action+' per '+current.wait+' secondi');
      light=current.next;
    }
    output.push('Attesa totale: '+total+' secondi');
    return{name:'Semaforo '+first+' per '+count+' passaggi',
      stdin:[first,String(count)],output:output.join('\n')};
  }),source=>{
    const code=active(source);
    return has(/\benum\s+TrafficLight\s*\{[^}]*\bRED\b[^}]*\bYELLOW\b[^}]*\bGREEN\b[^}]*\}/s,
      /\bfunc\s+get_driver_action\s*\(\s*light\s*\)/,
      /\bfunc\s+get_wait_time\s*\(\s*light\s*\)/,
      /\bfunc\s+get_next_light\s*\(\s*light\s*\)/,
      /TrafficLight\.(?:RED|YELLOW|GREEN)/,
      /\breturn\b/,/\bprint\s*\(/)(source)&&
      (code.match(/\bmatch\s+light\s*:/g)||[]).length>=3;
  });
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    129:['2'],130:['12'],131:['VENERDÌ','3'],
    132:['IDLE RUN FALL'],133:['RED','4']
  });
  window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
