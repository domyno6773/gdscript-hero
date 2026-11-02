/* Lezioni 106–110: griglie 2D, array frastagliati, tris.
 * Le funzioni pure sono chiamate da Godot senza richiedere _ready().
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(lessons.length!==235||!v)throw Error('Catalogo manuale assente');
  const item=n=>{
    const l=lessons.find(x=>x.manualLessonNumber===n);
    if(!l)throw Error('Lezione mancante '+n);
    return l;
  };
  const edit=(n,source)=>{
    const l=item(n);l.initialCode=source;l.starterCode=source;
    l.sourceFiles={...l.sourceFiles,'main.gd':source};
  };
  const set=(n,cases,proof)=>{
    const l=item(n);if(!cases.length)throw Error('Casi vuoti '+n);
    l.validationReady=true;l.expectedOutput=cases[0].output||'Valori di ritorno';
    l.manualSourceCheck=proof;v.expectedCases[n]=cases;
  };
  const noComment=s=>String(s).split('\n').filter(t=>!/^\s*#/.test(t)).join('\n');
  const rules=(...re)=>s=>re.every(r=>r.test(noComment(s)));
  const noReady=s=>!/^\s*(?:extends\s+|func\s+_ready\s*\()/m.test(noComment(s));
  const noPrint=s=>!/\bprint\s*\(/.test(noComment(s));

  edit(106,[
    'extends Node','','func _ready():',
    '    var rows = int(OS.read_string_from_stdin())',
    '    var cols = int(OS.read_string_from_stdin())',
    '    var player_row = int(OS.read_string_from_stdin())',
    '    var player_col = int(OS.read_string_from_stdin())',
    '    var grid = []','',
    '    # Costruisci un nuovo array per ogni riga con cicli annidati.',
    '    # Posiziona P e stampa la mappa senza spazi.'
  ].join('\n'));
  const draw=(rows,cols,pr,pc)=>{
    const out=[];
    for(let i=0;i<rows;i++){
      let line='';
      for(let j=0;j<cols;j++)line+=(i===pr&&j===pc?'P':'.');
      out.push(line);
    }
    return out.join('\n');
  };
  const maps=[[3,4,1,2],[1,1,0,0],[2,3,0,1],[3,2,2,0]];
  set(106,maps.map(([r,c,pr,pc])=>({
    name:'Mappa '+r+' × '+c,
    stdin:[r,c,pr,pc].map(String),output:draw(r,c,pr,pc)
  })),s=>rules(/\bgrid\b/,/\bplayer_row\b/,/\bplayer_col\b/,
    /(?:\bfor\b|\bwhile\b)/,/\.append\s*\(/,/\.print\b|\bprint\s*\(/)(s) &&
    (noComment(s).match(/\bfor\s+\w+\s+in\s+range\s*\(/g)||[]).length>=2);

  edit(107,[
    'func grid_stats(grid: Array):',
    '    # Restituisci [somma delle celle, valore massimo, celle pari].',
    '    pass'
  ].join('\n'));
  const gridExamples=[
    [[1,2],[3,4]],
    [[-1,-2],[-3,-4]],
    [[7]],
    [[0,0,2],[-2,9,1]],
    [[10,5,8]]
  ];
  const gridStats=g=>{
    const nums=g.flat();return [
      nums.reduce((a,b)=>a+b,0),
      Math.max(...nums),
      nums.filter(x=>x%2===0).length
    ];
  };
  set(107,gridExamples.map(grid=>({
    name:'Statistiche della griglia',
    harness:'func _ready():\n    print(JSON.stringify(grid_stats('+JSON.stringify(grid)+')))',
    output:JSON.stringify(gridStats(grid))
  })),s=>rules(/\bfunc\s+grid_stats\s*\(\s*grid\s*:\s*Array\s*\)/,
    /\breturn\b/,/\bfor\b|\bwhile\b/,/%\s*2/)(s)&&noReady(s)&&noPrint(s));

  edit(108,[
    'func make_triangle(n: int):',
    '    # Restituisci un array frastagliato di n righe.',
    '    pass'
  ].join('\n'));
  const triangle=n=>{
    const out=[];
    for(let row=1;row<=n;row++){
      const cells=[];
      for(let col=1;col<=row;col++)cells.push(row*col);
      out.push(cells);
    }
    return out;
  };
  const triangles=[0,1,3,5];
  set(108,[{
    name:'Triangoli di dimensioni differenti',
    calls:triangles.map(n=>({method:'make_triangle',args:[n]})),
    returns:triangles.map(triangle),
    output:''
  }],s=>rules(/\bfunc\s+make_triangle\s*\(\s*n\s*:\s*int\s*\)/,
    /\bfor\b|\bwhile\b/,/\.append\s*\(/,/\breturn\b/)(s)&&noReady(s)&&noPrint(s));

  const patternsLesson=item(109);
  const translations={
    'Main diagonal':'Diagonale principale',
    'Anti-diagonal':'Diagonale secondaria',
    'Top row':'Prima riga',
    'Bottom row':'Ultima riga',
    'Left column':'Prima colonna',
    'Right column':'Ultima colonna'
  };
  for(const [english,italian] of Object.entries(translations))
    patternsLesson.task=patternsLesson.task.replaceAll(english,italian);
  edit(109,[
    'func print_patterns(grid: Array):',
    '    # Stampa le sei sequenze richieste, nell’ordine della consegna.',
    '    pass'
  ].join('\n'));
  const sequenceResult=g=>{
    const n=g.length,main=[],second=[],left=[],right=[];
    for(let i=0;i<n;i++){
      main.push(g[i][i]);second.push(g[i][n-1-i]);
      left.push(g[i][0]);right.push(g[i][n-1]);
    }
    return [
      'Diagonale principale: '+main.join(' '),
      'Diagonale secondaria: '+second.join(' '),
      'Prima riga: '+g[0].join(' '),
      'Ultima riga: '+g[n-1].join(' '),
      'Prima colonna: '+left.join(' '),
      'Ultima colonna: '+right.join(' ')
    ].join('\n');
  };
  const squareGrids=[
    [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],
    [[5,6],[7,8]],
    [[42]],
    [[1,0,7],[2,3,4],[9,5,6]]
  ];
  set(109,squareGrids.map(grid=>({
    name:'Righe, colonne e diagonali '+grid.length,
    harness:'func _ready():\n    print_patterns('+JSON.stringify(grid)+')',
    output:sequenceResult(grid)
  })),s=>rules(/\bfunc\s+print_patterns\s*\(\s*grid\s*:\s*Array\s*\)/,
    /\bfor\b|\bwhile\b/,/\bprint\s*\(/)(s)&&noReady(s));

  edit(110,[
    'extends Node','','func _ready():',
    '    var board = []',
    '    # Leggi tre righe e memorizza ogni casella come stringa.',
    '    # Controlla righe, colonne, diagonali e pareggio.'
  ].join('\n'));
  const ticTacToe=rows=>{
    const b=rows.map(r=>r.split(''));const combos=[];
    for(let i=0;i<3;i++){
      combos.push([b[i][0],b[i][1],b[i][2]]);
      combos.push([b[0][i],b[1][i],b[2][i]]);
    }
    combos.push([b[0][0],b[1][1],b[2][2]]);
    combos.push([b[0][2],b[1][1],b[2][0]]);
    for(const cells of combos)
      if(cells[0]!=='.'&&cells.every(x=>x===cells[0]))
        return 'Vince '+cells[0];
    return rows.join('').includes('.')?'Continua a giocare':'Pareggio';
  };
  const boards=[
    ['XO.','XO.','.OX'],
    ['XXX','O.O','..O'],
    ['XO.','XO.','X..'],
    ['X.O','.X.','O.X'],
    ['O.X','.O.','X.O'],
    ['XOX','XXO','OXO'],
    ['X..','...','..O']
  ];
  set(110,boards.map(rows=>({
    name:'Partita di tris',stdin:rows,output:ticTacToe(rows)
  })),rules(/\bboard\b/,/OS\.read_string_from_stdin\s*\(/,
    /\bfor\b|\bwhile\b/,/\bprint\s*\(/));

  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    106:['3','4','1','2'],110:['XO.','XO.','.OX']
  });
  window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
