/* Esecuzione didattica dei progetti OOP in Godot WebAssembly.
 * Ogni .gd resta distinto nella bozza; per la verifica il codice delle
 * classi locali viene assemblato in classi GDScript annidate. Ciò permette
 * di usare il compilatore Godot senza modificare il pack WASM, ma NON
 * sostituisce ancora un caricatore nativo di file res:// indipendenti.
 * I casi che non si possono assemblare fedelmente rimangono bloccati.
 */
(() => {
 'use strict';
 const get=n=>(window.LESSONS_DATA||[]).find(x=>x.manualLessonNumber===n);
 const supported=new Set([171,172,173,174,175,176,177,178,179,180]);
 const lineClean=s=>String(s).replace(/\r/g,'').split('\n').map(t=>t.replace(/\t/g,'    '));
 const safe=(files,lesson)=>{
   const expected=Object.keys(lesson.sourceFiles);
   if(Object.keys(files).length!==expected.length)return false;
   return expected.every(f=>
     Object.prototype.hasOwnProperty.call(files,f)&&
     typeof files[f]==='string'&&
     files[f].length<8000&&
     (f!=='main.gd'||files[f]===lesson.sourceFiles[f]));
 };
 const currentFiles=lesson=>{
   const draft=window.GDHManualStudio?.getDraft(lesson);
   if(!draft)return null;
   const files={...draft.files};
   if(window.App?.state?.currentLessonId===lesson.id){
     const selected=draft.selected;
     const editor=document.getElementById('code-editor');
     if(selected&&editor&&selected!=='main.gd')files[selected]=editor.value;
   }
   return files;
 };
 const build=(lesson,files)=>{
   if(!supported.has(lesson?.manualLessonNumber))throw Error('Progetto non ancora supportato');
   if(!files||!safe(files,lesson))throw Error('I file del progetto sono incompleti o main.gd è stato modificato');
   let main=files['main.gd'];
   const mainLines=lineClean(main);
   if(!/^\s*extends Node\s*$/m.test(main))throw Error('La scena principale deve estendere Node');
   const nested=[];
   const names=new Set();
   for(const [filename,script] of Object.entries(files)){
     if(filename==='main.gd')continue;
     const lines=lineClean(script);
     const header=lines.find(s=>/^\s*class_name\s+\w+\s*$/.test(s));
     if(!header)throw Error('Manca class_name in '+filename);
     const className=header.trim().split(/\s+/)[1];
     if(names.has(className))throw Error('Classe duplicata '+className);
     names.add(className);
     if(filename.slice(0,-3).replace(/_/g,'').toLowerCase()!==className.toLowerCase())
       throw Error('Il nome della classe non corrisponde al file '+filename);
     const body=lines.filter(s=>!/^\s*class_name\s+\w+\s*$/.test(s));
     const first=body.find(s=>s.trim()&&!s.trim().startsWith('#'));
     if(!first||!/^extends\s+RefCounted\s*$/.test(first.trim()))
       throw Error('La classe '+className+' deve estendere RefCounted');
     // Ogni classe conserva i propri metodi e proprietà in un namespace
     // distinto; il compilatore nativo risolve i tipi e le istanze.
     nested.push('class '+className+':\n'+body.map(s=>s?'    '+s:'').join('\n'));
   }
   if(!nested.length)throw Error('Non sono presenti classi del progetto');
   let mainBody=mainLines.filter(s=>!/^\s*extends Node\s*$/.test(s)).join('\n');
   const source='extends Node\n\n'+nested.join('\n\n')+'\n\n'+mainBody+'\n';
   if(source.length>9500)throw Error('Progetto troppo lungo');
   return source;
 };
 const supports=lesson=>Boolean(lesson&&supported.has(lesson.manualLessonNumber));
 const compile=lesson=>build(lesson,currentFiles(lesson));
 window.GDHManualProject=Object.freeze({supports,currentFiles,build,compile});
 for(let n of supported){
   const l=get(n);
   if(!l||!l.requiresMultipleFiles)throw Error('Configurazione multi-file incompleta '+n);
 }
})();