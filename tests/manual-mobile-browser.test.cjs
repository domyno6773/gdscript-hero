'use strict';
const assert=require('assert/strict'),fs=require('fs'),{chromium,webkit}=require('playwright');
const host=require('./helpers/browser_host.cjs'),solutions=require('../manuale235/solutions.json');
(async()=>{
 const h=await host();
 try{
  for(const [name,engine,width] of [['chrome-small',chromium,360],['chrome-phone',chromium,390],['chrome-tablet',chromium,820],['safari-phone',webkit,390]]){
   const browser=await engine.launch({...(engine===chromium?{channel:'chrome',args:['--no-sandbox']}:{})});
   try{
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,locale:'it-IT'});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route(/^https:\/\//,r=>r.abort());
    await page.goto(h.url);await page.waitForFunction(()=>window.App&&window.GDHManualStudio);
    await host.welcome(page);
    // Code tab must react to an actual tap, including after navigating back.
    await page.evaluate(()=>{App.state.devAllUnlocked=false;App.ensureUnlockedConsistency();App.openLesson(10001)});
    await page.locator('#btn-tab-code').click();
    assert.ok(await page.locator('#code-editor').isVisible());
    await page.locator('#btn-run-code').click();
    await page.waitForFunction(()=>App.state.finishedLessons.includes(10001),null,{timeout:120000});
    await page.locator('#success-modal').waitFor({state:'visible'});await page.locator('#btn-modal-stay').click();
    const xp=await page.evaluate(()=>App.state.xp);
    await page.locator('#btn-run-code').click();await page.waitForFunction(()=>!App.isValidating);
    await page.locator('#success-modal').waitFor({state:'visible'});await page.locator('#btn-modal-stay').click();
    assert.equal(await page.evaluate(()=>App.state.xp),xp,'XP duplicati');
    await page.evaluate(()=>App.openLesson(10002));await page.locator('#btn-tab-code').click();
    await page.locator('#btn-run-code').click();await page.waitForFunction(()=>!App.isValidating);
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10002)),false,'Starter promosso');
    // Multifile edit, protected driver, independent file selection and reload.
    await page.evaluate(()=>{App.state.devAllUnlocked=true;App.ensureUnlockedConsistency();App.openLesson(10171)});
    await page.locator('#btn-tab-code').click();
    const edited=solutions[171]['greeter.gd']+'\n# bozza mobile';
    await page.locator('#code-editor').fill(edited);
    await page.getByRole('tab',{name:'main.gd',exact:true}).click();
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    await page.getByRole('tab',{name:'greeter.gd',exact:true}).click();
    assert.equal(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>App.saveStorage());
    await page.reload();await page.waitForFunction(()=>window.GDHManualStudio);await host.welcome(page);
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    assert.equal(await page.locator('#code-editor').inputValue(),edited,'Bozza persa al reload');
    await page.locator('#btn-run-code').click();await page.waitForFunction(()=>App.state.finishedLessons.includes(10171),null,{timeout:120000});
    await page.locator('#success-modal').waitFor({state:'visible'});await page.locator('#btn-modal-stay').click();
    const overflow=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,width:innerWidth,editor:document.querySelector('#view-exercise .editor-wrapper').getBoundingClientRect().right}));
    assert.ok(overflow.doc<=width+2,JSON.stringify(overflow));assert.ok(overflow.editor<=width+2,JSON.stringify(overflow));
    for(const n of [200,234,235]){
      await page.evaluate(n=>App.openLesson(10000+n),n);await page.locator('#btn-tab-code').click();
      const bounds=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,width:innerWidth,tabs:document.querySelector('.manual-file-bar')?.getBoundingClientRect().right}));
      assert.ok(bounds.doc<=width+2&&bounds.tabs<=width+2,'Schede progetto '+n+': '+JSON.stringify(bounds));
    }
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    // Backup includes every file; account switches must never reuse cached drafts.
    const saved=await page.evaluate(()=>AuthManager.createBackupPayload(App.getSavePayload()));
    assert.equal(saved.data.manualDrafts[10171].files['greeter.gd'],edited);
    await page.evaluate(()=>{App.switchSaveOwner({id:'audit-account',isGuest:false});App.openLesson(10171)});
    assert.notEqual(await page.locator('#code-editor').inputValue(),edited,'Bozza di un altro account');
    await page.evaluate(()=>{App.switchSaveOwner({isGuest:true});App.openLesson(10171)});
    assert.equal(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    page.once('dialog',d=>d.accept());
    await page.locator('#btn-reset-code').click();
    assert.notEqual(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>GDHManualStudio.showSolution(LESSONS_DATA[170]));
    assert.match(await page.locator('#code-editor').inputValue(),/static func greet/);
    assert.ok((await page.locator('#code-editor').inputValue()).includes('return "Ciao, %s!"'));
    const courseDraft=await page.locator('#code-editor').inputValue();
    await page.evaluate(()=>App.openReviewVariant('manual_review_10171'));await page.locator('#btn-tab-code').click();
    await page.locator('#code-editor').fill(solutions[171]['greeter.gd']);
    const reviewXp=await page.evaluate(()=>App.state.xp);
    await page.locator('#btn-run-code').click();await page.waitForFunction(()=>App.state.reviewProgress.completedVariants.includes('manual_review_10171'),null,{timeout:120000});
    await page.locator('#success-modal').waitFor({state:'visible'});await page.locator('#btn-modal-stay').click();
    const paidXp=await page.evaluate(()=>App.state.xp);
    assert.ok(paidXp>=reviewXp+5);
    await page.locator('#btn-run-code').click();await page.waitForFunction(()=>!App.isValidating);
    await page.locator('#success-modal').waitFor({state:'visible'});await page.locator('#btn-modal-stay').click();
    assert.equal(await page.evaluate(()=>App.state.xp),paidXp,'XP ripasso duplicati');
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    assert.equal(await page.locator('#code-editor').inputValue(),courseDraft,'Il ripasso sovrascrive la bozza del corso');
    assert.deepEqual(errors,[]);
    fs.mkdirSync('test-artifacts',{recursive:true});await page.screenshot({path:'test-artifacts/'+name+'.png',fullPage:true});
    console.log('PASS mobile '+name+': schede, Godot, XP, reload, backup e isolamento account.');
   }finally{await browser.close();}
  }
 }finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
