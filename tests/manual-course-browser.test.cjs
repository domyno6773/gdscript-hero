'use strict';
const assert=require('assert/strict'),{chromium}=require('playwright');
const host=require('./helpers/browser_host.cjs');
const solutions=require('../manuale235/solutions.json');
(async()=>{
 const h=await host(),browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https:\/\//,r=>r.abort());
  await page.goto(h.url);await page.waitForFunction(()=>window.GDHGodot&&window.GDHManualStudio);
  await host.welcome(page);
  for(let n=1;n<=235;n++){
   const result=await page.evaluate(async({n,solved})=>{
    App.openLesson(10000+n);
    const l=LESSONS_DATA[n-1],draft=GDHManualStudio.getDraft(l);
    Object.assign(draft.files,solved);
    const editor=document.getElementById('code-editor');editor.value=draft.files[draft.selected];
    const r=await GDHGodot.verifyLesson(l.id,editor.value);
    return {accepted:r.accepted,nativeMultifile:r.original?.reply?.nativeMultifile,entry:r.original?.reply?.projectEntry,checks:r.feedback?.checks?.filter(c=>!c.passed)};
   },{n,solved:solutions[n]});
   assert.equal(result.accepted,true,'Lezione '+n+': '+JSON.stringify(result));
   if(n>=171){assert.equal(result.nativeMultifile,true);assert.match(result.entry,/main\.gd$/);}
   if(n%25===0)console.log('Godot WASM: '+n+'/235');
  }
  // Reject real behavioral mistakes, preserving valid syntax and support files.
  for(const [n,file,from,to] of require('./helpers/manual-finale-mutations.cjs')){
   const accepted=await page.evaluate(async({n,file,from,to})=>{
    App.openLesson(10000+n);const l=LESSONS_DATA[n-1],d=GDHManualStudio.getDraft(l);
    d.files[file]=d.files[file].replace(from,to);
    document.getElementById('code-editor').value=d.files[d.selected];
    return (await GDHGodot.verifyLesson(l.id,document.getElementById('code-editor').value)).accepted;
   },{n,file,from,to});
   assert.equal(accepted,false,'Mutazione accettata '+n);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS browser: 235 soluzioni, progetti nativi, 15 mutazioni respinte.');
 }finally{await browser.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
