/* Lezioni 71–76 del manuale italiano: stringhe e sequenze.
 * Output dinamici e casi limite verificati nel vero motore Godot.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[];
  const base=window.GDHManualVerifier;
  if(lessons.length!==235||!base)throw Error('Manuale non inizializzato');
  const array=xs=>'['+xs.map(x=>typeof x==='string'?JSON.stringify(x):String(x)).join(', ')+']';
  const noComments=s=>String(s).split('\n').filter(x=>!/^\s*#/.test(x)).join('\n');
  const structural=(...rules)=>s=>rules.every(rule=>rule.test(noComments(s)));
  const set=(n,cases,requirement)=>{
    const lesson=lessons.find(x=>x.manualLessonNumber===n);
    if(!lesson)throw Error('Lezione '+n+' inesistente');
    if(!cases.length||cases.some(c=>!Array.isArray(c.stdin)||typeof c.output!=='string'))
      throw Error('Casi non validi per lezione '+n);
    base.expectedCases[n]=cases;
    lesson.expectedOutput=cases[0].output;
    lesson.manualSourceCheck=requirement;
    lesson.validationReady=true;
  };
  const countP=s=>(s.match(/p/gi)||[]).length;
  const examples71=['Happy people play ping pong','PPPppp','Nessuna','Pippo'];
  set(71,examples71.map(line=>({name:'Testo con p/P',stdin:[line],output:String(countP(line))})),
    structural(/OS\.read_string_from_stdin\s*\(/,
      /\bfor\b|\bwhile\b|\.count\s*\(/,
      /["']p["']|["']P["']/));
  const samples72=[
    ['Ciao world godot','-'],
    ['   uno   due    tre  ',' / '],
    ['solo','*'],
    ['a  b  c','']
  ];
  set(72,samples72.map(([text,joiner])=>({name:'Separatore e spazi',
    stdin:[text,joiner],output:text.trim().split(/\s+/).filter(Boolean).join(joiner)})),
    structural(/\btext\b/,/\bseparator\b/,/\.split\s*\(/,
      /\.join\s*\(/,/\bfor\b|\bfilter\b|\bstrip_edges\b/));
  const centered=a=>{
    if(a.length%2===0)return a.slice(a.length/2-1,a.length/2+1);
    const mid=Math.floor(a.length/2);return a.slice(Math.max(0,mid-1),mid+2);
  };
  const samples73=[
    ['mela','banana','arancia','grape'],
    ['a','b','c','d','e'],
    ['solo'],
    ['x','y'],
    ['a','b','c','d','e','f']
  ];
  set(73,samples73.map(xs=>({name:'Elementi centrali '+xs.length,
    stdin:[xs.join(',')],output:array(centered(xs))})),
    structural(/\.slice\s*\(/,/\bitems\b/,/\.size\s*\(\s*\)|\.length\s*\(\s*\)/));
  const samples74=[
    [[1,2,3],2],
    [[4,5],0],
    [[7],3],
    [[-3,4],1]
  ];
  set(74,samples74.map(([nums,n])=>({name:'Ripetizioni '+n,
    stdin:[nums.join(','),String(n)],
    output:array(Array.from({length:n},()=>[...nums,...nums]).flat())})),
    structural(/\bnumbers\s*\+\s*numbers\b/,/\bpattern\b/,
      /\bfor\b|\bwhile\b/,/\brepeats\b/));
  const samples75=[
    [['1','2','3','4','5'],['2','4','6']],
    [['a','b','a','c'],['b']],
    [['x','y'],['x','y']],
    [['A','a','B'],['a']]
  ];
  set(75,samples75.map(([first,second])=>({name:'Appartenenza e duplicati',
    stdin:[first.join(','),second.join(',')],
    output:array(first.filter(value=>!second.includes(value)))})),
    structural(/\bfor\b/,/\bin\b/,/\bfirst\b/,/\bsecond\b/,/\.append\s*\(/));
  const samples76=[[5,3,9,1],[5,5,1],[0,-2,9,3],[7]];
  set(76,samples76.map(nums=>({
    name:'Ordinamento di '+nums.join(','),
    stdin:[nums.join(',')],
    output:'Original: '+array(nums)+'\nAscending: '+array([...nums].sort((a,b)=>a-b))+
      '\nDescending: '+array([...nums].sort((a,b)=>b-a))
  })),
  structural(/\.sort\s*\(|\.sort_custom\s*\(/,
    /\.reverse\s*\(|\.sort_custom\s*\(/,/\bnumbers\b/));
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    71:['Happy people play ping pong'],72:['Ciao world godot','-'],
    73:['mela,banana,arancia,grape'],74:['1,2,3','2'],
    75:['1,2,3,4,5','2,4,6'],76:['5,3,9,1']
  });
  window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
