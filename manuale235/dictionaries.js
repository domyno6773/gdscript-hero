/* Dizionari 77–81: contenuti e comportamento del manuale, con input variati.
 * I Dictionary sono confrontati per chiavi/valori, non per ordine testuale.
 */
(() => {
  'use strict';
  const lessons=window.LESSONS_DATA||[],v=window.GDHManualVerifier;
  if(lessons.length!==235||!v)throw Error('Lezioni o verificatore non inizializzati');
  const sourceWithoutComments=s=>String(s).split('\n').filter(l=>!/^\s*#/.test(l)).join('\n');
  const all=(...re)=>s=>re.every(rule=>rule.test(sourceWithoutComments(s)));
  const add=(number,cases,proof)=>{
    const lesson=lessons.find(x=>x.manualLessonNumber===number);
    if(!lesson||!cases.length)throw Error('Lezione o casi non disponibili: '+number);
    v.expectedCases[number]=cases;
    lesson.manualSourceCheck=proof;
    lesson.expectedOutput=cases[0].output??JSON.stringify(cases[0].object);
    lesson.validationReady=true;
  };
  add(77,[
    {name:'Eroe guaritore',stdin:['Mia','Guaritore','3'],
      object:{name:'Mia',role:'Guaritore',level:3}},
    {name:'Eroe diverso',stdin:['Luca','Mago','12'],
      object:{name:'Luca',role:'Mago',level:12}},
    {name:'Livello zero',stdin:['Ana','Esploratrice','0'],
      object:{name:'Ana',role:'Esploratrice',level:0}}
  ],all(/\bvar\s+hero\b/,/["']name["']\s*:/,/["']role["']\s*:/,
    /["']level["']\s*:/,/\bprint\s*\(\s*hero\s*\)/));
  add(78,[
    {name:'Ricerca prezzo',stdin:['Potion','2.5','15','price'],output:'2.5'},
    {name:'Chiave assente',stdin:['Bow','30.75','7','color'],output:'Non trovato'},
    {name:'Ricerca quantità',stdin:['Elisir','5.5','12','stock'],output:'12'},
    {name:'Ricerca nome',stdin:['Pozione','15','2','name'],output:'Pozione'}
  ],all(/\bvar\s+item\b/,/["']name["']\s*:/,/["']price["']\s*:/,
    /["']stock["']\s*:/,/\.get\s*\(|\.has\s*\(|\bin\s+item\b/));
  const examples79=[
    ['Mia',4,5,'guild','Falcons'],
    ['Dario',1,8,'rank','Capitano'],
    ['Zoe',99,100,'skill','magia']
  ];
  add(79,examples79.map(([name,start,after,key,value])=>({
    name:'Aggiornamento di '+name,
    stdin:[name,String(start),String(after),key+':'+value],
    prefix:name,object:{level:after,[key]:value}
  })),all(/\bplayer\s*\[\s*["']level["']\s*\]\s*=\s*new_level\b/,
    /\bpair\.split\s*\(\s*["']:["']\s*\)/,
    /\bplayer\.erase\s*\(\s*["']name["']\s*\)/));
  const examples80=[
    [['name:Mia','hp:100','class:Mago'],'hp'],
    [['a:1','b:2'],'c'],
    [['level:7'],'level']
  ];
  add(80,examples80.map(([pairs,key])=>{
    const obj=Object.fromEntries(pairs.map(s=>s.split(':')));
    const content=[...Object.keys(obj),'---',...Object.values(obj),'---',
      String(pairs.length),'---','false','---',String(Object.hasOwn(obj,key))].join('\n');
    return {name:'Chiavi, valori e appartenenza',stdin:[pairs.join(','),key],output:content};
  }),all(/\binfo\.keys\s*\(\s*\)/,/\binfo\.values\s*\(\s*\)/,
    /\binfo\.size\s*\(\s*\)/,/\binfo\.is_empty\s*\(\s*\)/,
    /\binfo\.has\s*\(\s*key\s*\)/));
  const samples81=[
    ['gold','gem','gold','pozione','gold'],
    ['mappa','corda','mappa'],
    ['chiave'],
    ['x','y','z','y','x','z']
  ];
  add(81,samples81.map(items=>{
    const counts={};
    for(const value of items)counts[value]=(counts[value]||0)+1;
    return {name:'Frequenza bottino',stdin:[items.join(',')],
      output:Object.entries(counts).map(([key,val])=>key+': '+val).join('\n')};
  }),all(/\bcounts\b/,/\bfor\b/,/\bprint\b/,
    /\bget\s*\(|\.has\s*\(|\bin\s+counts\b/));
  window.GDHManualExamples=Object.freeze({...window.GDHManualExamples,
    77:['Mia','Guaritore','3'],78:['Potion','2.5','15','price'],
    79:['Mia','4','5','guild:Falcons'],
    80:['name:Mia,hp:100,class:Mago','hp'],
    81:['gold,gem,gold,pozione,gold']
  });
  window.GDHManualMigration.validated=lessons.filter(l=>l.validationReady).length;
  window.GDHManualMigration.readyForRelease=false;
})();
