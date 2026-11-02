'use strict';
const assert=require('assert/strict'),{chromium}=require('playwright');
const host=require('./helpers/browser_host.cjs');
(async()=>{
 const h=await host(),browser=await chromium.launch({channel:'chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1365,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route(/^https:\/\//,r=>r.abort());
  await page.goto(h.url);await host.welcome(page);
  await page.evaluate(()=>{App.state.finishedLessons=[10003];App.ensureUnlockedConsistency();});
  const editor=page.locator('#code-editor');
  const reset=async()=>{page.once('dialog',d=>d.accept());await page.locator('#btn-reset-code').click();};
  const progress=()=>page.evaluate(()=>({xp:App.state.xp,finished:App.state.finishedLessons}));
  const before=await progress();
  // These nine lessons previously reset to a different imported PDF fragment.
  for(const n of [1,2,3,4,5,6,7,8,24]){
   await page.evaluate(id=>App.openLesson(id),10000+n);
   const initial=await editor.inputValue();
   assert.equal(initial,await page.evaluate(id=>LESSONS_DATA.find(l=>l.id===id).initialCode,10000+n));
   await editor.fill(initial.replace(/^ {4}/gm,'')+'\n# tentativo dello studente');
   await reset();assert.equal(await editor.inputValue(),initial,'Ripristino della lezione '+n);
   await reset();assert.equal(await editor.inputValue(),initial,'Secondo ripristino della lezione '+n);
   if(n===3)assert.match(await editor.inputValue(),/^    print\("Ciao!"\)/m);
   if(n===4)assert.match(await editor.inputValue(),/^print\("Pronto!"\)/m,'Il rientro mancante è intenzionale nella lezione 4');
  }
  // Persist the reset rather than the previous attempt, including after reload.
  await page.evaluate(()=>App.openLesson(10003));const comments=await editor.inputValue();
  await editor.fill('extends Node\nfunc _ready():\n    pass');await reset();
  await page.reload();await host.welcome(page);await page.evaluate(()=>App.openLesson(10003));
  assert.equal(await editor.inputValue(),comments,'Ripristino conservato dopo il reload');
  // A review reset must leave the course draft untouched.
  const courseDraft=comments+'\n# bozza indipendente del corso';await editor.fill(courseDraft);
  await page.evaluate(()=>App.openReviewVariant('manual_review_10003'));
  assert.match(await page.locator('#lesson-title').innerText(),/Ripasso:/);
  const reviewInitial=await editor.inputValue();assert.equal(reviewInitial,comments);
  await editor.fill('extends Node\nfunc _ready():\n    pass');await reset();
  assert.equal(await editor.inputValue(),reviewInitial,'Ripristino del ripasso');
  await page.evaluate(()=>App.openLesson(10003));assert.equal(await editor.inputValue(),courseDraft);
  // Reset only the selected script, preserving the other script and stdin.
  await page.evaluate(()=>App.openLesson(10185));
  const first=await page.locator('#view-exercise .file-name').textContent(),initial=await editor.inputValue();
  await editor.fill(initial+'\n# da ripristinare');
  await page.getByRole('tab',{name:'car.gd',exact:true}).click();
  assert.notEqual(first,'car.gd');const other=await editor.inputValue()+'\n# da conservare';await editor.fill(other);
  await page.locator('#manual-stdin-lines').fill('input personale');
  await page.getByRole('tab',{name:first,exact:true}).click();await reset();
  assert.equal(await editor.inputValue(),initial);assert.equal(await page.locator('#manual-stdin-lines').inputValue(),'input personale');
  await page.getByRole('tab',{name:'car.gd',exact:true}).click();assert.equal(await editor.inputValue(),other);
  assert.deepEqual(await progress(),before,'Il ripristino non modifica XP o completamenti');
  // The valid first starter still executes in actual Godot after a reset.
  await page.evaluate(()=>App.openLesson(10001));await reset();await page.locator('#btn-run-code').click();
  await page.waitForFunction(()=>App.state.finishedLessons.includes(10001),null,{timeout:120000});
  assert.equal((await page.locator('#real-output-pre').innerText()).trim(),'Ciao GDScript!');
  assert.deepEqual(errors,[]);
  console.log('PASS reset browser: starter e rientri originali, ripristini ripetuti, reload, ripasso isolato, multifile e Godot reale.');
 }finally{await browser.close();await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
