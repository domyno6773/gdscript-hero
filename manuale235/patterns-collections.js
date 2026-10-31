/* Lezioni 101–105: pattern su Dictionary, parser di comandi e prime matrici.
 * Le funzioni che non prevedono _ready() vengono provate con uno script
 * di test aggiunto dal verificatore, non dallo studente.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(lessons.length!==235||!v)throw Error('Catalogo italiano non disponibile');
  const find=n=>{
    const l=lessons.find(x=>x.manualLessonNumber===n);
    if(!l)throw Error('Manca la lezione '+n);
    return l;
  };
  const code=(n,s)=>{
    const l=find(n);l.initialCode=s;l.starterCode=s;
    l.sourceFiles={...l.sourceFiles,'main.gd':s};
  };
  const tests=(n,arr,proof)=>{
    if(!arr.length)throw Error('Casi mancanti per '+n);
    const l=find(n);l.validationReady=true;
    v.expectedCases[n]=arr;l.expectedOutput=arr[0].output;
    l.manualSourceCheck=proof;
  };
  const strip=s=>String(s).split('\n').filter(l=>!/^\s*#/.test(l)).join('\n');
  const all=(...re)=>s=>re.every(x=>x.test(strip(s)));
  const noReady=s=>!/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(strip(s))&&
    !/\bprint\s*\(/.test(strip(s));

  code(101,[
    'extends Node','','func _ready():',
    '    var event = {}',
    '    for pair in OS.read_string_from_stdin().split(","):',
    '        var kv = pair.split("=")',
    '        event[kv[0]] = kv[1]',
    '    # Usa match e i pattern di Dictionary; le prime due forme sono esatte.'
  ].join('\n'));
  const eventResult=text=>{
    const dict={};for(const pair of text.split(',')){
      const kv=pair.split('=');dict[kv[0]]=kv[1];
    }
    const names=Object.keys(dict);
    if(names.length===2&&dict.type==='muovi'&&'dir' in dict)
      return 'Movimento: '+dict.dir;
    if(names.length===2&&dict.type==='attacca'&&'damage' in dict)
      return 'Subisce '+dict.damage+' danni';
    if(dict.type==='cura')return 'Cura';
    if('type' in dict)return 'Evento sconosciuto: '+dict.type;
    return 'Evento non valido';
  };
  const events=[
    'type=muovi,dir=sinistra',
    'type=attacca,damage=30',
    'type=cura',
    'type=cura,potenza=50',
    'type=muovi,dir=alto,speed=2',
    'type=attacca,damage=4,speed=2',
    'type=corri',
    'foo=bar',
    'type=muovi'
  ];
  tests(101,events.map(text=>({name:'Evento '+text,stdin:[text],
    output:eventResult(text)})),
    all(/\bmatch\s+event\s*:/,/\btype\b/,/\bdir\b/,/\bdamage\b/,
      /\.\./,/Event[o]?/));

  code(102,[
    'extends Node','','func _ready():',
    '    var names = ["Alice", "Bob", "Charlie", "Dana"]',
    '    var grades = {"Alice": 85, "Bob": 90, "Charlie": 78}',
    '    var student = OS.read_string_from_stdin()',
    '    var grade = OS.read_string_from_stdin()',
    '    # Controlla l’appartenenza a names e alle chiavi/valori di grades.'
  ].join('\n'));
  const students=[
    ['Dana','85'],['Alice','85'],['Zoe','77'],
    ['Bob','90'],['Charlie','78'],['Dana','91']
  ];
  const groups=new Set(['Alice','Bob','Charlie','Dana']);
  const marked=new Set(['Alice','Bob','Charlie']);
  const vals=new Set(['85','90','78']);
  tests(102,students.map(([student,grade])=>({name:'Studente '+student,
    stdin:[student,grade],
    output:[
      student+(groups.has(student)?' è nella classe.':' non è nella classe.'),
      student+(marked.has(student)?' ha un voto.':' non ha voti.'),
      vals.has(grade)?'Qualcuno ha ottenuto '+grade+'.':'Nessuno ha ottenuto '+grade+'.'
    ].join('\n')
  })),all(/\bnames\b/,/\bgrades\b/,/\bstudent\b/,/\bgrade\b/,
    /\bin\b|\bhas\s*\(/));

  code(103,[
    'extends Node','','func _ready():',
    '    const DIRECTIONS = ["nord", "sud", "est", "ovest"]',
    '    var inventory: Array[String] = []',
    '    # Leggi e normalizza ogni comando fino a esci.',
    '    # Usa match sugli array di parole e conserva l’inventario.'
  ].join('\n'));
  const parseCommands=commands=>{
    const inventory=[],messages=[],dirs=new Set(['nord','sud','est','ovest']);
    for(const input of commands){
      const parts=input.trim().toLowerCase().split(/\s+/).filter(Boolean);
      const [action,argument]=parts;
      if(parts.length===0)messages.push('Digita un comando.');
      else if(parts.length===1&&action==='aiuto')
        messages.push('Comandi: vai, prendi, inventario, esci');
      else if(parts.length===2&&action==='vai')
        messages.push(dirs.has(argument)?'Vai verso '+argument+'.':
          'Non puoi andare verso '+argument+'.');
      else if(parts.length===2&&action==='prendi'){
        if(inventory.includes(argument))messages.push('Possiedi già '+argument+'.');
        else {inventory.push(argument);messages.push('Prendi '+argument+'.');}
      }else if(parts.length===1&&action==='inventario')
        messages.push('Inventario: '+(inventory.length?inventory.join(', '):'vuoto'));
      else if(parts.length===1&&action==='esci'){
        messages.push('Arrivederci!');break;
      }else messages.push('Comando sconosciuto.');
    }
    return messages.join('\n');
  };
  const scripts=[
    ['aiuto','vai nord','vai su','prendi lampada','inventario','esci'],
    ['','inventario','prendi chiave','prendi chiave','inventario','esci'],
    ['vai sud','prendi mappa','prendi pozione','inventario','esci'],
    [' VAI   EST ','prendi  LANterna','inventario','esci'],
    ['xyz','vai','prendi','esci']
  ];
  tests(103,scripts.map((cmd,i)=>({name:'Avventura testuale '+(i+1),
    stdin:cmd,output:parseCommands(cmd)})),
    all(/\bwhile\b/,/\bmatch\b/,/\bDIRECTIONS\b/,
      /\binventory\b/,/\.strip_edges\s*\(/,/\bto_lower\s*\(/,
      /\.split\s*\(/,/\bbreak\b/));

  const map=[
    [1,1,1,1,1],[1,0,2,0,1],[1,0,1,3,1],[1,1,1,1,1]
  ];
  find(104).task=find(104).task.replace('Rows: 4','Righe: 4')
    .replace('Columns: 5','Colonne: 5');
  code(104,[
    'extends Node','','func _ready():',
    '    # Sostituisci l’array vuoto con la mappa del dungeon.',
    '    var level = []',
    '    # Stampa il numero di righe e colonne usando size().',
    '    for row in level:',
    '        print(row)'
  ].join('\n'));
  const mapPrint=row=>'['+row.join(', ')+']';
  tests(104,[{name:'Dungeon 4×5',
    output:'Righe: 4\nColonne: 5\n'+map.map(mapPrint).join('\n')
  }],all(/\bvar\s+level\b/,/\.size\s*\(/,/\bfor\s+row\s+in\s+level\s*:/,
    /\bprint\s*\(/));

  code(105,[
    'func get_tile(grid: Array, row: int, col: int):',
    '    # Restituisci -1 se row o col è fuori dai limiti.',
    '    pass'
  ].join('\n'));
  const grids=[
    [[[1,2,3],[4,5,6]],1,2],
    [[[1,2],[3,4]],2,1],
    [[[1,2],[3,4]],-1,0],
    [[[1,2],[3,4]],1,-1],
    [[[9]],0,0],
    [[[5,6],[7]],1,1]
  ];
  const get=(grid,r,c)=>
    r>=0&&r<grid.length&&c>=0&&c<grid[r].length?grid[r][c]:-1;
  tests(105,grids.map(([grid,row,col])=>({
    name:'Lettura griglia '+row+','+col,
    harness:'func _ready():\n    print(get_tile('+JSON.stringify(grid)+
      ', '+row+', '+col+'))',
    output:String(get(grid,row,col))
  })),s=>all(/\bfunc\s+get_tile\s*\(\s*grid\s*:\s*Array\s*,\s*row\s*:\s*int\s*,\s*col\s*:\s*int\s*\)/,
    /\breturn\b/)(s)&&noReady(s));

  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    101:['type=attacca,damage=30'],
    102:['Dana','85'],
    103:['aiuto','vai nord','vai su','prendi lampada','inventario','esci']
  });
  window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
