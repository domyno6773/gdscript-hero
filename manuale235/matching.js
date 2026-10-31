/* Match e pattern, lezioni 98–100: verifica i rami e i limiti.
 * La consegna è mantenuta, con le stringhe dei messaggi interamente in italiano.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(lessons.length!==235||!v)throw Error('Manuale o verificatore assente');
  const find=n=>{
    const l=lessons.find(x=>x.manualLessonNumber===n);
    if(!l)throw Error('Lezione mancante '+n);
    return l;
  };
  const set=(n,tests,check)=>{
    const l=find(n);
    l.validationReady=true;l.manualSourceCheck=check;
    l.expectedOutput=tests[0].output;
    v.expectedCases[n]=tests;
  };
  const comments=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
  const required=(...re)=>s=>re.every(r=>r.test(comments(s)));
  const initial=(n,s)=>{
    const l=find(n);l.initialCode=s;l.starterCode=s;
    l.sourceFiles={...l.sourceFiles,'main.gd':s};
  };
  find(98).task=find(98).task.replace('stampa Correct!','stampa Corretto!')
    .replace('stampa You gave up.','stampa Hai rinunciato.');
  initial(98,[
    'extends Node','','func _ready():',
    '    const SECRET = 42',
    '    var guess = int(OS.read_string_from_stdin())',
    '    # Confronta guess con SECRET, 0 e qualsiasi altro numero usando match.'
  ].join('\n'));
  set(98,[42,0,17,-2,43].map(guess=>({
    name:'Tentativo '+guess,stdin:[String(guess)],
    output:guess===42?'Corretto!':guess===0?'Hai rinunciato.':
      guess+' non è il numero cercato.'
  })),required(/\bmatch\s+guess\s*:/,/\bSECRET\b/,
    /\bvar\s+\w+\s*:/,/\bprint\s*\(/));

  initial(99,[
    'extends Node','','func _ready():',
    '    var age = int(OS.read_string_from_stdin())',
    '    # Confronta age usando match e guardie when.'
  ].join('\n'));
  const ageGroup=n=>{
    if(n>=0&&n<=12)return 'Bambino';
    if(n>=13&&n<=19)return 'Adolescente';
    if(n>=20&&n<=64)return 'Adulto';
    if(n>=65&&n<=120)return 'Anziano';
    return 'Età non valida';
  };
  set(99,[-1,0,12,13,19,20,64,65,120,121].map(age=>({
    name:'Età '+age,stdin:[String(age)],output:ageGroup(age)
  })),required(/\bmatch\s+age\s*:/,/\bwhen\b/,/\bprint\s*\(/));

  find(100).task=find(100).task.replace('Origin','Origine')
    .replace('On the diagonal at','Sulla diagonale in');
  initial(100,[
    'extends Node','','func _ready():',
    '    var parts = OS.read_string_from_stdin().split(",")',
    '    var point = [int(parts[0]), int(parts[1])]',
    '    # Confronta point con i pattern di array nel giusto ordine.'
  ].join('\n'));
  const where=(x,y)=>{
    if(x===0&&y===0)return 'Origine';
    if(x===0)return 'Sull’asse y in y='+y;
    if(y===0)return 'Sull’asse x in x='+x;
    if(x===y)return 'Sulla diagonale in '+x;
    return 'Punto in ('+x+', '+y+')';
  };
  const points=[[0,0],[0,5],[7,0],[3,3],[2,7],[0,-2],[-2,-2]];
  set(100,points.map(([x,y])=>({
    name:'Punto ('+x+', '+y+')',stdin:[x+','+y],output:where(x,y)
  })),required(/\bmatch\s+point\s*:/,/\[/,/\bvar\b|\b_\b/,
    /\bprint\s*\(/));

  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    98:['17'],99:['15'],100:['0,5']
  });
  window.GDHManualMigration.validated=lessons.filter(x=>x.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
