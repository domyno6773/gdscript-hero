/* Manuale italiano, lezioni 111–115: dizionari annidati, array di dizionari,
 * impostazioni, copie profonde e conteggio di frequenze.
 * Casi alternativi eseguiti da Godot nativo.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],check=window.GDHManualVerifier;
  if(lessons.length!==235||!check)throw Error('Catalogo manuale non caricato');
  const lesson=n=>{
    const l=lessons.find(x=>x.manualLessonNumber===n);
    if(!l)throw Error('Lezione mancante '+n);
    return l;
  };
  const patch=(n,code)=>{
    const l=lesson(n);
    l.initialCode=code;l.starterCode=code;
    l.sourceFiles={...l.sourceFiles,'main.gd':code};
  };
  const active=s=>String(s).split('\n').filter(line=>!/^\s*#/.test(line)).join('\n');
  const requireAll=(...rules)=>code=>rules.every(rule=>rule.test(active(code)));
  const define=(n,tests,sourceCheck)=>{
    if(!tests.length)throw Error('Senza prove: '+n);
    const l=lesson(n);
    check.expectedCases[n]=tests;
    l.manualSourceCheck=sourceCheck;
    l.expectedOutput=tests[0].output||'Controllo dei dizionari';
    l.validationReady=true;
  };

  const l111=lesson(111);
  l111.task=l111.task.replace('department/item','reparto/articolo')
    .replace('fruits/apples,meat/beef,fruits/kiwis,candy/gum',
      'frutta/mele,carne/manzo,frutta/kiwi,dolci/gomme')
    .replaceAll('fruits/apples','frutta/mele')
    .replaceAll('meat/beef','carne/manzo')
    .replaceAll('fruits/kiwis','frutta/kiwi')
    .replaceAll('candy/gum','dolci/gomme');
  patch(111,[
    'extends Node','','func _ready():',
    '    var inventory = {',
    '        "frutta": {"mele": 12, "banane": 4},',
    '        "carne": {"manzo": 7, "pollo": 5},',
    '        "latticini": {"latte": 9, "formaggio": 2}',
    '    }',
    '    var lookups = OS.read_string_from_stdin().split(",")',
    '    # Stampa ogni consultazione con la quantità o «mancante».',
    '    # Infine calcola e stampa il totale di tutte le quantità.'
  ].join('\n'));
  const inv={
    frutta:{mele:12,banane:4},carne:{manzo:7,pollo:5},
    latticini:{latte:9,formaggio:2}
  };
  const queries=[
    ['frutta/mele','carne/manzo','frutta/kiwi','dolci/gomme'],
    ['latticini/latte','frutta/banane'],
    ['carne/pollo','carne/mele','no/niente'],
    ['frutta/mele']
  ];
  const total=Object.values(inv).flatMap(obj=>Object.values(obj))
    .reduce((a,n)=>a+n,0);
  define(111,queries.map(q=>({
    name:'Consultazione reparti',stdin:[q.join(',')],
    output:[...q.map(query=>{
      const [dept,item]=query.split('/');
      return query+': '+(Object.hasOwn(inv[dept]||{},item)?inv[dept][item]:'mancante');
    }),'Totale inventario: '+total].join('\n')
  })),requireAll(/\binventory\b/,/\blookups\b/,/\bfor\b|\bwhile\b/,
    /\bprint\s*\(/,/\b39\b|\btotal\b/));

  const l112=lesson(112);
  // L'esempio nel PDF era rimasto troncato durante l'impaginazione: lo
  // ricostruiamo senza cambiare l'obiettivo didattico della lezione.
  l112.task='<p>Crea una classifica. Lo script legge un numero intero n e poi n righe, ciascuna con un nome e un punteggio separati da virgola (per esempio Mia,95).</p>'+
    '<p>Per ogni riga aggiungi a players un dizionario con le chiavi tecniche "name" e "score", conservando il punteggio come int. Poi stampa players.</p>'+
    '<p>Stampa infine Migliore: seguito dal nome del giocatore con il punteggio più alto e il punteggio tra parentesi. In caso di parità, scegli il primo giocatore incontrato.</p>'+
    '<p>Esempio di input: 3, Mia,95, Leo,80, Ana,97 (una voce per riga).</p>'+
    '<p>Risultato atteso:</p>'+
    '<p>[{ "name": "Mia", "score": 95 }, { "name": "Leo", "score": 80 }, { "name": "Ana", "score": 97 }]<span> </span>Migliore: Ana (97)</p>';
  const start112=['extends Node','','func _ready():',
    '    var n = int(OS.read_string_from_stdin())',
    '    var players = []',
    '    # Leggi n giocatori in dizionari con "name" e "score".',
    '    # Stampa players e il giocatore col punteggio più alto.'
  ].join('\n');
  patch(112,start112);
  const rosters=[
    [['Mia',95],['Leo',80],['Ana',97]],
    [['Pia',80],['Luca',80],['Zoe',51]],
    [['Sol',0]],
    [['Tim',-5],['Ada',-2],['Ray',-9]]
  ];
  const l112test=rosters.map(players=>{
    const best=players.reduce((a,b)=>b[1]>a[1]?b:a);
    return {name:'Classifica di '+players.length+' giocatori',
      stdin:[String(players.length),...players.map(([name,score])=>name+','+score)],
      linesSpec:[
        {object:players.map(([name,score])=>({name,score}))},
        'Migliore: '+best[0]+' ('+best[1]+')'
      ]};
  });
  define(112,l112test,requireAll(/\bplayers\.append\s*\(/,
    /\bfor\b|\bwhile\b/,/\bname\b/,/\bscore\b/,
    /\bprint\s*\(\s*players\s*\)/));

  const l113=lesson(113);
  // Il documento mescolava il default "normal/off" con "normale/spento"
  // già presente nel codice iniziale. L'esercizio usa i valori dello starter.
  l113.task=l113.task
    .replace('"subtitles": "off"','"subtitles": "spento"')
    .replace('"difficulty": "normal"','"difficulty": "normale"');
  patch(113,[
    'extends Node','','func _ready():',
    '    var defaults = {"difficulty": "normale", "volume": "5",',
    '        "subtitles": "spento", "language": "en"}',
    '    var saved = {}',
    '    for pair in OS.read_string_from_stdin().split(",", false):',
    '        var parts = pair.split("=")',
    '        saved[parts[0]] = parts[1]',
    '    # Aggiungi solo le chiavi mancanti a saved.',
    '    # Non modificare defaults. Stampa saved e defaults.'
  ].join('\n'));
  const defaults={difficulty:'normale',volume:'5',subtitles:'spento',language:'en'};
  const inputs=['difficulty=hard,volume=8','',
    'subtitles=on,language=it','difficulty=easy,language=jp'];
  define(113,inputs.map(input=>{
    const current={};
    if(input)for(const kv of input.split(',')){
      const [key,value]=kv.split('=');current[key]=value;
    }
    return {name:'Impostazioni salvate '+(input||'(vuote)'),
      stdin:[input],
      linesSpec:[{object:{...defaults,...current}},{object:defaults}]};
  }),requireAll(/\bdefaults\b/,/\bsaved\b/,
    /\bfor\b|\bwhile\b/,/\.has\s*\(|\bin\s+saved\b/,
    /\bprint\s*\(\s*saved\s*\)/,/\bprint\s*\(\s*defaults\s*\)/));

  const l114=lesson(114);
  patch(114,[
    'extends Node','','func _ready():',
    '    var template = {"type": "slime",',
    '        "statistiche": {"hp": 30, "speed": 2}, "loot": ["gel"]}',
    '    var n = int(OS.read_string_from_stdin())',
    '    var bonus = int(OS.read_string_from_stdin())',
    '    # Genera n nemici con copie profonde del modello.',
    '    # Alla fine stampa Template: seguito dal modello invariato.'
  ].join('\n'));
  const baseline={type:'slime',statistiche:{hp:30,speed:2},loot:['gel']};
  const waves=[[2,10],[1,5],[3,0],[2,7]];
  define(114,waves.map(([count,bonus])=>{
    const descriptions=[];
    for(let i=0;i<count;i++){
      descriptions.push({object:{
        type:'slime',statistiche:{hp:30+bonus*(i+1),speed:2},
        loot:i===count-1?['gel','crown']:['gel'],id:i+1
      }});
    }
    descriptions.push({prefix:'Template: ',object:baseline});
    return {
      name:'Ondata '+count+' nemici, bonus '+bonus,
      stdin:[String(count),String(bonus)],linesSpec:descriptions
    };
  }),requireAll(/\btemplate\.duplicate\s*\(\s*true\s*\)/,
    /\bfor\b|\bwhile\b/,/\bstatistiche\b/,/\bhp\b/,
    /\.append\s*\(\s*["']crown["']\s*\)/,
    /\bprint\s*\(/));

  patch(115,[
    'func frequency_counter(data_list: Array):',
    '    # Restituisci un Dictionary: elemento → numero di occorrenze.',
    '    pass'
  ].join('\n'));
  const samples=[
    [1,2,2,3,3,3],['mela','pera','mela'],
    [],[9,9,9,9],['a','b','c','b'],[0,-1,0,2]
  ];
  const countEntries=a=>{
    const o={};
    for(const item of a)o[String(item)]=(o[String(item)]||0)+1;
    return o;
  };
  define(115,samples.map(input=>({
    name:'Conteggio '+JSON.stringify(input),
    harness:'func _ready():\n    print(JSON.stringify(frequency_counter('+JSON.stringify(input)+')))',
    linesSpec:[{object:countEntries(input)}]
  })),source=>requireAll(/\bfunc\s+frequency_counter\s*\(\s*data_list\s*:\s*Array\s*\)/,
    /\bfor\b|\bwhile\b/,/\breturn\b/)(source)&&
    !/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(active(source))&&
    !/\bprint\s*\(/.test(active(source)));

  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    111:['frutta/mele,carne/manzo,frutta/kiwi,dolci/gomme'],
    112:['3','Mia,95','Leo,80','Ana,97'],
    113:['difficulty=hard,volume=8'],
    114:['2','10']
  });
  window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
