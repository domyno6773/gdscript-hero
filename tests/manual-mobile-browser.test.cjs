'use strict';
const assert=require('assert/strict'),fs=require('fs'),{chromium,webkit}=require('playwright');
const host=require('./helpers/browser_host.cjs'),solutions=require('../manuale235/solutions.json');
(async()=>{
 const h=await host();
 try{
  for(const [name,engine,width] of [['chrome-small',chromium,360],['chrome-phone',chromium,390],['chrome-tablet',chromium,820],['safari-phone',webkit,390]]){
   const browser=await engine.launch({...(engine===chromium?{channel:'chrome',args:['--no-sandbox']}:{})});
   let page;
   try{
    const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,locale:'it-IT'});
    page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
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
    await page.locator('#btn-tab-instructions').click();
    await page.locator('#manual-stdin-lines').fill('1\nAda');
    await page.locator('#btn-tab-code').click();
    await page.getByRole('tab',{name:'main.gd',exact:true}).click();
    assert.equal(await page.locator('#view-exercise .file-name').textContent(),'main.gd');
    assert.equal(await page.locator('#code-editor').getAttribute('readonly'),'');
    await page.getByRole('tab',{name:'greeter.gd',exact:true}).click();
    assert.equal(await page.locator('#view-exercise .file-name').textContent(),'greeter.gd');
    assert.equal(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>App.saveStorage());
    await page.reload();await page.waitForFunction(()=>window.GDHManualStudio);await host.welcome(page);
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    assert.equal(await page.locator('#code-editor').inputValue(),edited,'Bozza persa al reload');
    await page.locator('#btn-tab-instructions').click();
    assert.equal(await page.locator('#manual-stdin-lines').inputValue(),'1\nAda');
    await page.locator('.manual-preview-btn').click();
    await page.waitForFunction(()=>!document.querySelector('.manual-preview-btn')?.disabled,null,{timeout:120000});
    assert.match(await page.locator('#real-output-pre').textContent(),/Ciao, Ada!/);
    assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(10171)),false,'Anteprima assegna completamento');
    await page.locator('#btn-tab-code').click();

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
    await page.evaluate(()=>App.refreshBackupExportInfo());
    assert.match(await page.locator('#export-stat-summary').textContent(),/\/235 lezioni completate/);
    const restored=structuredClone(saved.data);
    restored.manualDrafts[10171].files['greeter.gd']+='\n# ricevuto dal backup';
    await page.evaluate(data=>App.applyImportedState(data,false),restored);
    assert.equal(await page.locator('#code-editor').inputValue(),restored.manualDrafts[10171].files['greeter.gd'],'Il vecchio editor sovrascrive il backup importato');
    assert.equal(await page.evaluate(()=>App.getSavePayload().manualDrafts[10171].files['greeter.gd']),restored.manualDrafts[10171].files['greeter.gd']);
    await page.evaluate(data=>App.applyImportedState(data,false),saved.data);
    assert.equal(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>{App.switchSaveOwner({id:'audit-account',isGuest:false});App.openLesson(10171)});
    assert.notEqual(await page.locator('#code-editor').inputValue(),edited,'Bozza di un altro account');
    await page.evaluate(()=>{App.switchSaveOwner({isGuest:true});App.openLesson(10171)});
    assert.equal(await page.locator('#code-editor').inputValue(),edited);
    await page.evaluate(()=>App.openLesson(10171));await page.locator('#btn-tab-code').click();
    page.once('dialog',d=>d.accept());
    await page.locator('#btn-mobile-reset-code:visible, #btn-reset-code:visible').first().click();
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
    // The first lesson has the same ID in a fresh account: stale editor text
    // must not be saved into that account before its first lesson is opened.
    await page.evaluate(()=>App.openLesson(10001));await page.locator('#btn-tab-code').click();
    const firstDraft=await page.locator('#code-editor').inputValue()+'\n# proprietario ospite';
    await page.locator('#code-editor').fill(firstDraft);
    await page.evaluate(()=>App.switchSaveOwner({id:'audit-account-first',isGuest:false}));
    assert.equal(await page.evaluate(()=>Object.values(App.state.manualDrafts).some(d=>Object.values(d.files||{}).some(s=>s.includes('proprietario ospite')))),false,'Bozza della prima lezione passata al nuovo account');
    await page.evaluate(()=>{App.switchSaveOwner({isGuest:true});App.openLesson(10001)});await page.locator('#btn-tab-code').click();
    assert.equal(await page.locator('#code-editor').inputValue(),firstDraft);
    assert.equal(await page.evaluate(()=>App.state.achievementRewardsV1.first_blood),25);
    await page.evaluate(()=>App.resetAllData());
    assert.deepEqual(await page.evaluate(()=>({xp:App.state.xp,finished:App.state.finishedLessons,drafts:App.state.manualDrafts,rewards:App.state.lessonRewardsV1,achievements:App.state.achievementRewardsV1,reviews:App.state.reviewProgress.completedVariants,current:App.state.currentLessonId})),{xp:0,finished:[],drafts:{},rewards:{},achievements:{},reviews:[],current:10001});
    await page.reload();await page.waitForFunction(()=>window.GDHManualStudio);await host.welcome(page);
    assert.equal(await page.evaluate(()=>App.state.xp),0,'Il reset non persiste al reload');
    await page.evaluate(()=>{App.openLesson(10171);ConfettiFX.particles=[]});await page.locator('#btn-tab-code').click();
    assert.deepEqual(errors,[]);
    fs.mkdirSync('test-artifacts',{recursive:true});await page.screenshot({path:'test-artifacts/'+name+'.png',fullPage:true});
    console.log('PASS mobile '+name+': schede, Godot, XP, reload, backup e isolamento account.');
   }catch(error){
    fs.mkdirSync('test-artifacts',{recursive:true});
    if(page)await page.screenshot({path:'test-artifacts/'+name+'-failure.png',fullPage:true}).catch(()=>{});
    throw error;
   }finally{await browser.close();}
  }
 }finally{await h.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
