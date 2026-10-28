'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm','.pck':'application/octet-stream'};
const server=http.createServer((req,res)=>{
 const requested=decodeURIComponent((req.url||'/').split('?')[0]);
 const file=path.resolve(root,requested==='/'?'index.html':requested.replace(/^\/+/,''));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,bytes)=>{
  if(error){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(bytes);
 });
});
async function viewIs(page,name){
 const active=await page.evaluate(()=>[...document.querySelectorAll('.view-container:not(.hidden)')].map(e=>e.id));
 assert.deepEqual(active,['view-'+name],'Section '+name+' not active: '+active.join(','));
}
async function testGodotEditorExtras(page,selector){
 const editor=page.locator(selector);
 await editor.fill('func demo():\n    if true:\n        print("ok")\n\nfunc other():\n    pass');
 const base=await editor.inputValue();
 const syntax=selector==='#code-editor'?'#gdscript-highlight':'#sandbox-gdscript-highlight';
 assert.ok(await page.locator(syntax+' .gdh-indent-unit').count()>=2,
   'Godot indentation marks missing in '+selector);
 // Nested whitespace must render tab-stop markers from the LEFT.
 const tabMarkers=await page.evaluate(s=>{
   const marks=[...document.querySelectorAll(s+' .gdh-indent-unit')];
   const a=marks[1]?.getBoundingClientRect(),b=marks[2]?.getBoundingClientRect();
   return {count:marks.length,content:marks[1]&&getComputedStyle(marks[1],'::before').content,
     left:a?.left,next:b?.left,width:a?.width};
 },syntax);
 assert.ok(tabMarkers.count>=3 && tabMarkers.content==='""',
   'Indent guides must be SVG rather than font-based text: '+JSON.stringify(tabMarkers));
 assert.ok(Math.abs(tabMarkers.next-tabMarkers.left-tabMarkers.width)<2,
   'Nested markers should be placed at consecutive tab stops: '+JSON.stringify(tabMarkers));
 await editor.evaluate(el=>{el.focus();const p=el.value.indexOf('    if')+4;el.setSelectionRange(p,p)});
 await editor.press('Backspace');
 assert.ok((await editor.inputValue()).includes('\nif true:\n'),
   'Backspace must remove an entire indentation stop in '+selector);
 await editor.fill('    ');
 await editor.evaluate(el=>{el.focus();el.setSelectionRange(4,4)});
 await editor.press('Backspace');
 assert.equal(await editor.inputValue(),'','Backspace must delete four spaces together');
 await editor.press('Tab');
 assert.equal(await editor.inputValue(),'    ','Tab must insert a full indent');
 await editor.press('Shift+Tab');
 assert.equal(await editor.inputValue(),'','Shift+Tab must remove one indent');
 await editor.fill(base);
 const gutter=selector==='#code-editor'?'#view-exercise .gdscript-edit-stack > .gdh-fold-gutter':
   '#view-practice .sandbox-editor-col .gdscript-edit-stack > .gdh-fold-gutter';
 await page.waitForFunction(s=>document.querySelector(s)?.querySelector('button'),gutter);
 // The folding arrow must be to the RIGHT of the number column, never inside it.
 const gutterPosition=await page.evaluate(id=>{
   const input=document.getElementById(id);
   const container=input.closest('.editor-wrapper');
   const numbers=container.querySelector('.line-numbers').getBoundingClientRect();
   const controls=container.querySelector('.gdscript-edit-stack > .gdh-fold-gutter').getBoundingClientRect();
   return {numberRight:numbers.right,controlLeft:controls.left};
 },selector.slice(1));
 assert.ok(gutterPosition.controlLeft >= gutterPosition.numberRight - 2,
   'Fold control overlaps line numbers: '+JSON.stringify(gutterPosition));
 if(selector==='#code-editor' && await page.evaluate(()=>innerWidth<=820)){
   await page.locator('#view-exercise .editor-wrapper').evaluate(el=>
     el.scrollIntoView({block:'center',behavior:'instant'}));
 }
 const measure=async()=>page.evaluate(id=>{
   const host=document.getElementById(id).closest('.editor-wrapper');
   const overlay=host.querySelector('.gdh-fold-preview');
   const rect=host.getBoundingClientRect();
   const header=host.previousElementSibling?.getBoundingClientRect();
   return {height:rect.height,top:rect.top,bottom:rect.bottom,
     left:rect.left,width:rect.width,headerBottom:header?.bottom,
     previewHeight:overlay?.getBoundingClientRect().height};
 },selector.slice(1));
 const fullSize=await measure();
 const first=page.locator(gutter+' button[aria-label="Comprimi blocco dalla riga 1"]');
 assert.equal(await first.getAttribute('aria-expanded'),'true','Open blocks need a DOWN arrow');
 await first.click();
 const preview=selector==='#code-editor'?'#view-exercise .editor-wrapper .gdh-fold-preview':
   '#view-practice .sandbox-editor-col .editor-wrapper .gdh-fold-preview';
 assert.ok(await page.locator(preview).isVisible(),'Fold preview must become visible');
 // No underlying line numbers or syntax layer may bleed through the folded
 // presentation. In particular, a folded 2-line function must not leave
 // ghost indent symbols in the old editor (reported on desktop/iOS).
 const foldedVisibility=await page.evaluate(id=>{
   const host=document.getElementById(id).closest('.editor-wrapper');
   const oldNumbers=host.querySelector('.line-numbers');
   const oldEditor=host.querySelector('.gdscript-edit-stack');
   const overlay=host.querySelector('.gdh-fold-preview');
   const style=getComputedStyle(overlay);
   return {foldClass:host.classList.contains('gdh-is-folded'),
     nums:getComputedStyle(oldNumbers).visibility,
     editor:getComputedStyle(oldEditor).visibility,
     overlay:style.visibility,opacity:style.opacity,zIndex:style.zIndex};
 },selector.slice(1));
 assert.ok(foldedVisibility.foldClass && foldedVisibility.nums==='hidden' &&
   foldedVisibility.editor==='hidden' && foldedVisibility.overlay==='visible',
   'Fold mode is drawing two code surfaces: '+JSON.stringify(foldedVisibility));
 const foldedSize=await measure();
 assert.ok(Math.abs(foldedSize.height-fullSize.height)<1.1 &&
   Math.abs(foldedSize.top-fullSize.top)<1.1 &&
   Math.abs(foldedSize.bottom-fullSize.bottom)<1.1 &&
   Math.abs(foldedSize.left-fullSize.left)<1.1 &&
   Math.abs(foldedSize.width-fullSize.width)<1.1 &&
   Math.abs(foldedSize.headerBottom-fullSize.headerBottom)<1.1 &&
   Math.abs(foldedSize.previewHeight-fullSize.height)<1.1,
   'Code panel/header must never move or shrink while folding: '+JSON.stringify({fullSize,foldedSize}));
 // The folded view has fewer visible lines, but the number-column border
 // must reach the BOTTOM of the editor (not stop at the final code row).
 const separator=await page.evaluate(id=>{
   const host=document.getElementById(id).closest('.editor-wrapper');
   const overlay=host.querySelector('.gdh-fold-preview');
   const numberColumn=host.querySelector('.line-numbers');
   const rule=getComputedStyle(overlay,'::before');
   const rect=overlay.getBoundingClientRect();
   const lastRow=[...overlay.querySelectorAll('.gdh-fold-preview-row')].at(-1).getBoundingClientRect();
   return {display:rule.display,position:rule.position,
     lineHeight:parseFloat(rule.height),lineX:parseFloat(rule.left),
     lineColor:rule.backgroundColor,originalColor:getComputedStyle(numberColumn).borderRightColor,
     numberWidth:numberColumn.getBoundingClientRect().width,
     viewportHeight:rect.height,unusedSpace:rect.bottom-lastRow.bottom};
 },selector.slice(1));
 assert.ok(separator.unusedSpace>15,'Regression needs empty editor space below folded lines: '+JSON.stringify(separator));
 assert.ok(separator.display!=='none' && separator.position==='absolute' &&
   Math.abs(separator.lineHeight-separator.viewportHeight)<1.1 &&
   Math.abs(separator.lineX-(separator.numberWidth-1))<1.1 &&
   separator.lineColor===separator.originalColor,
   'Folded line-number separator must fill the viewport and align with the original gutter: '+JSON.stringify(separator));
 assert.ok((await page.locator(preview).textContent()).includes('righe nascoste'),
   'Fold preview needs the hidden line count');
 assert.equal(await page.locator(preview+' .gdh-fold-preview-row').count(),4,
   'Closing first function must preserve the separator, next function and its body');
 assert.ok((await page.locator(preview).textContent()).includes('func other():'),
   'Adjacent function must remain visible');
 assert.ok(!(await page.locator(preview).textContent()).includes('print("ok")'),
   'Only selected function body should be hidden');
 assert.equal(await page.locator(preview+' .gdh-fold-arrow.collapsed').first().getAttribute('aria-expanded'),
   'false','Closed blocks need a RIGHT arrow');
 assert.equal(await editor.inputValue(),base,'Folding must never change canonical source');
 await page.locator(preview+' .gdh-fold-arrow.collapsed').first().click();
 assert.ok(await page.locator(preview).isHidden(),'Expanding must restore the whole editable view');
 assert.equal(await page.evaluate(id=>{
   const host=document.getElementById(id).closest('.editor-wrapper');
   return getComputedStyle(host.querySelector('.gdscript-edit-stack')).visibility;
 },selector.slice(1)),'visible','Expanded code must become visible again');
 assert.equal(await editor.inputValue(),base);
 // Nested if: folding this inner block must retain its parent and next function.
 await page.locator(gutter+' button[aria-label="Comprimi blocco dalla riga 2"]').click();
 assert.ok((await page.locator(preview).textContent()).includes('func demo():'));
 assert.ok((await page.locator(preview).textContent()).includes('func other():'));
 assert.ok(!(await page.locator(preview).textContent()).includes('print("ok")'));
 await page.locator(preview+' .gdh-fold-arrow.collapsed').first().click();
 assert.ok(await page.locator(preview).isHidden());
 assert.equal(await editor.inputValue(),base);
 // Simula il ripristino da salvataggio: assegnazione .value senza input event.
 // È il percorso usato da Sandbox e dalle lezioni quando si cambia sezione.
 const restored='extends Node2D\\n\\nfunc _ready():\\n    print("ok")\\n\\n# Nota indipendente\\nfunc next():\\n    pass\\n\\nvar after = 1'.replaceAll('\\n','\n');
 await editor.evaluate((el,source)=>{
   el.value=source;
   if(el.id==='sandbox-code-editor')App.updateSandboxLineNumbers();
   else App.updateLineNumbers();
 },restored);
 const sourceLayer=selector==='#code-editor'?'#gdscript-syntax-layer':'#sandbox-gdscript-syntax-layer';
 assert.ok((await page.locator(sourceLayer).textContent()).includes('func _ready():'),
   'Restored code is missing from the normal visible syntax layer');
 assert.ok(await page.locator(preview).isHidden(),'Restored code must begin fully expanded');
 const boundaries=await page.evaluate(code=>[...GDHEditorUX.ranges(code)],restored);
 assert.deepEqual(boundaries,[[2,3],[6,7]],
   'Fold boundaries must exclude trailing blank lines and unrelated comments');
 const foldFirst=page.locator(gutter+' button[aria-label="Comprimi blocco dalla riga 3"]');
 await foldFirst.click();
 assert.ok(await page.locator(preview).isVisible());
 const visible=await page.locator(preview).textContent();
 assert.ok(visible.includes('func next():'),'The next function was hidden by unrelated fold');
 assert.ok(visible.includes('# Nota indipendente'),'Dedented comment was hidden by unrelated fold');
 assert.ok(visible.includes('var after = 1'),'Code after both functions was hidden');
 assert.ok(!visible.includes('print("ok")'),'Selected function body was not hidden');
 assert.equal(await page.locator(preview+' .gdh-fold-preview-row').count(),9,
   'Only one function-body line must disappear from a 10-line script');
 await page.locator(preview+' .gdh-fold-arrow.collapsed').first().click();
 assert.ok(await page.locator(preview).isHidden());
 assert.ok((await page.locator(sourceLayer).textContent()).includes('print("ok")'),
   'Expanding showed an empty editor after restoring a saved project');
 assert.equal(await editor.inputValue(),restored,'Folding changed the real GDScript text');
}

async function testAllLessonCodeSamplesFit(page,width){
 // Check the ACTUAL rendered sample markup in every lesson, not just the
 // comment example from lesson 2. Keep this read-only for student progress.
 const result=await page.evaluate(()=>{
   const previousLesson=App.state.currentLessonId;
   const previousXP=App.state.xp;
   const errors=[];
   let sampleCount=0,lessonCount=0;
   try{
     for(const lesson of LESSONS_DATA){
       App.openLesson(lesson.id);
       lessonCount++;
       const blocks=[...document.querySelectorAll(
         '#view-exercise .lesson-content .code-preview, #view-exercise .lesson-content pre')];
       for(const block of blocks){
         // Locked/closed hints have display:none; geometry is undefined until
         // users expand them, so do not treat them as overflowing examples.
         if(!block.getClientRects().length)continue;
         sampleCount++;
         const r=block.getBoundingClientRect(),parent=block.parentElement.getBoundingClientRect();
         const style=getComputedStyle(block);
         if(r.width<=0||r.right>parent.right+1.5||r.left<parent.left-1.5||
           block.scrollWidth>block.clientWidth+2){
           errors.push({lesson:lesson.id,type:'box',tag:block.tagName,
             cls:block.className,width:r.width,scrollWidth:block.scrollWidth,
             clientWidth:block.clientWidth,parentRight:parent.right,right:r.right});
         }
         if(block.tagName!=='PRE')continue;
         if(style.whiteSpace!=='pre-wrap'){
           errors.push({lesson:lesson.id,type:'white-space',value:style.whiteSpace});
         }
         // Scroll extent and element geometry test the real available width.
         // Native Range rectangles include nonpainted line-break advances, so
         // they can incorrectly report a few pixels of "overflow" at wraps.
       }
     }
   }finally{
     App.openLesson(previousLesson);
   }
   return {lessonCount,sampleCount,errors:errors.slice(0,20),totalErrors:errors.length,
     xpUnchanged:App.state.xp===previousXP};
 });
 assert.equal(result.lessonCount,60,'The visual regression must scan all 60 lessons');
 assert.ok(result.sampleCount>=38,'Expected both lesson sample types: '+JSON.stringify(result));
 assert.ok(result.xpUnchanged,'Inspecting samples unexpectedly changed student XP');
 assert.equal(result.totalErrors,0,'Lesson examples escape their boundaries at '+width+'px: '+JSON.stringify(result));
}

async function testSmartIndent(page,selector) {
 const editor=page.locator(selector);
 const cases=[
  ['if health > 0:', 'if health > 0:\n    '],
  ['    if is_alive: # condizione', '    if is_alive: # condizione\n        '],
  ['func heal(amount):', 'func heal(amount):\n    '],
  ['    for enemy in enemies:', '    for enemy in enemies:\n        '],
  ['else:', 'else:\n    '],
  ['match action:', 'match action:\n    '],
  ['match action:\n    1:', 'match action:\n    1:\n        '],
  ['match action:\n    "pronto":', 'match action:\n    "pronto":\n        '],
  ['        print("ok")', '        print("ok")\n        '],
  ['var title = "if ok:"', 'var title = "if ok:"\n'],
  ['# if enabled:', '# if enabled:\n'],
  ['if ok:\n    while alive:', 'if ok:\n    while alive:\n        ']
 ];
 for(const [source,expected] of cases){
   await editor.fill(source);
   await editor.press('Enter');
   assert.equal(await editor.inputValue(),expected,
     'Incorrect smart indentation in '+selector+' for '+JSON.stringify(source));
   assert.equal(await editor.evaluate(e=>e.selectionStart),expected.length,
     'Caret misplaced after autoindent in '+selector);
 }
 await editor.fill('    if enabled:__SELEZIONE__');
 await editor.evaluate(e=>{
   const start=e.value.indexOf('__SELEZIONE__');
   e.setSelectionRange(start,e.value.length);
 });
 await editor.press('Enter');
 assert.equal(await editor.inputValue(),'    if enabled:\n        ',
   'Enter should replace selection and indent branch in '+selector);
}
async function testNavigationPersistence(page,width){
 const reload=async(name)=>{
   await page.reload({waitUntil:'load'});
   await page.waitForFunction(()=>!!window.App?.state?.sandbox);
   await viewIs(page,name);
 };
 await page.evaluate(()=>App.openPracticeView());
 const sandbox=await page.evaluate(()=>({
   id:App.getActiveSandboxProject()?.id,code:document.getElementById('sandbox-code-editor').value
 }));
 await reload('practice');
 assert.deepEqual(await page.evaluate(()=>({
   id:App.getActiveSandboxProject()?.id,code:document.getElementById('sandbox-code-editor').value
 })),sandbox,'Sandbox project or code not restored');

 await page.evaluate(()=>{App.showReviewView();App.setReviewTab('all');});
 await reload('review');
 assert.ok(await page.locator('#tab-review-all').evaluate(el=>el.classList.contains('active')),
   'Review All tab not restored');

 await page.evaluate(()=>App.openReviewVariant('rev_variables_01'));
 if(width<821)await page.locator('#btn-tab-code').click();
 const reviewDraft='extends Node\n\nfunc _ready():\n    print("RIPASSO_BOZZA")';
 await page.locator('#code-editor').fill(reviewDraft);
 await reload('exercise');
 assert.equal(await page.evaluate(()=>App.currentReviewVariant?.id),'rev_variables_01',
   'Wrong review variant after reload');
 assert.equal(await page.locator('#code-editor').inputValue(),reviewDraft,
   'Review draft lost on reload');
 await reload('exercise');
 assert.equal(await page.locator('#code-editor').inputValue(),reviewDraft,
   'Review draft lost on second consecutive reload');
 assert.equal(await page.evaluate(()=>App.isReviewMode),true);
 if(width<821)assert.ok(await page.locator('#exercise-workspace-grid')
   .evaluate(el=>el.classList.contains('show-code')),'Mobile code tab lost on reload');

 await page.evaluate(()=>App.openLesson(1));
 if(width<821)await page.locator('#btn-tab-code').click();
 const exerciseDraft='extends Node\n\nfunc _ready():\n    print("LEZIONE_BOZZA")';
 await page.locator('#code-editor').fill(exerciseDraft);
 await reload('exercise');
 assert.equal(await page.evaluate(()=>App.state.currentLessonId),1);
 assert.equal(await page.evaluate(()=>App.isReviewMode),false);
 assert.equal(await page.locator('#code-editor').inputValue(),exerciseDraft,'Lesson draft lost');
 if(width<821)assert.ok(await page.locator('#exercise-workspace-grid')
   .evaluate(el=>el.classList.contains('show-code')),'Lesson code tab lost');

 await page.evaluate(()=>App.showStatsView());
 await reload('stats');
 await page.evaluate(()=>App.openProjectsView());
 await reload('projects');
 await page.evaluate(()=>App.showRoadmap());
 await reload('roadmap');

 // Corrupt/obsolete position data must never prevent the page loading.
 await page.evaluate(()=>sessionStorage.setItem('gdscript_hero_position_v1',
   JSON.stringify({version:1,view:'view-hack'})));
 await reload('roadmap');
 // Delete the temporary lesson draft to leave the existing browser tests unchanged.
 await page.evaluate(()=>{
   delete App.state.userCode[1];
   App.saveStorage();
   sessionStorage.removeItem('gdscript_hero_review_draft_v1');
 });
}
async function testResponsiveLayout(page,initialWidth) {
  const presets=[1440,1366,1280,1180,1024,900,820,768,390];
  const views=[
    ['roadmap',()=>App.showRoadmap(),'.roadmap-layout-container'],
    ['exercise',()=>App.openLesson(1),'#view-exercise .workspace-grid'],
    ['practice',()=>App.openPracticeView(),'#view-practice .sandbox-workspace-grid'],
    ['projects',()=>App.openProjectsView(),'#view-projects .projects-grid'],
    ['review',()=>App.showReviewView(),'.review-view-inner'],
    ['stats',()=>App.showStatsView(),'.stats-view-inner']
  ];
  for(const width of presets){
    await page.setViewportSize({width,height:844});
    for(const [view,_open,selector] of views){
      await page.evaluate(name=>{
        if(name==='roadmap')App.showRoadmap();
        if(name==='exercise')App.openLesson(1);
        if(name==='practice')App.openPracticeView();
        if(name==='projects')App.openProjectsView();
        if(name==='review')App.showReviewView();
        if(name==='stats')App.showStatsView();
      },view);
      const measures=await page.evaluate(selector=>{
        const W=document.documentElement.clientWidth;
        const targets=['.navbar','.navbar .nav-left','.navbar .nav-center',
          '.navbar .nav-right',selector];
        const positions=targets.map(s=>{
          const el=document.querySelector(s);
          if(!el || getComputedStyle(el).display==='none')return null;
          const r=el.getBoundingClientRect();
          return {s,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)};
        }).filter(Boolean);
        const errors=positions.filter(p=>p.left < -3 || p.right > W+3);
        return {viewport:W,positions,errors};
      },selector);
      assert.deepEqual(measures.errors,[],
        'Off-screen panel at '+width+'px in '+view+': '+JSON.stringify(measures));
    }
  }
  await page.setViewportSize({width:initialWidth,height:844});
  await page.evaluate(()=>App.showRoadmap());
}

async function testLongEmailSettings(page, initialWidth) {
 const longEmail = 'studente.' + 'x'.repeat(175) + '@' + 'example'.repeat(9) + '.com';
 const widths = [1440, 1024, 820, 768, 390, 320];
 await page.evaluate(email => {
   App.updateAuthUI({isGuest:false, provider:'email', name:'Studente', email});
   App.openSettingsModal();
 }, longEmail);
 for (const width of widths) {
   await page.setViewportSize({width,height:844});
   const geometry = await page.evaluate(() => {
     const panel=document.querySelector('#settings-modal .modal-card');
     const row=document.querySelector('#settings-account-desc').closest('.settings-row');
     const label=document.querySelector('#settings-account-desc');
     const button=document.querySelector('#btn-settings-auth-action');
     const rects=[panel,row,label,button].map(el=>{
       const r=el.getBoundingClientRect();
       return {left:r.left,right:r.right,width:r.width};
     });
     const style=getComputedStyle(label);
     return {
       viewport: document.documentElement.clientWidth,
       rects,
       truncated:label.scrollWidth>label.clientWidth,
       overflow:style.overflow,
       textOverflow:style.textOverflow,
       whiteSpace:style.whiteSpace,
       fullEmail:label.title,
       displayed:label.textContent
     };
   });
   assert.equal(geometry.fullEmail,longEmail,'Full email must remain accessible in title');
   assert.equal(geometry.displayed,'Connesso: '+longEmail,'Email must not be mutated/truncated in data');
   assert.equal(geometry.textOverflow,'ellipsis','Long emails must use CSS ellipsis');
   assert.equal(geometry.whiteSpace,'nowrap','Long email must occupy one line');
   assert.equal(geometry.overflow,'hidden','Long email must not expand its label');
   assert.ok(geometry.truncated,'Long email should be clipped inside its available width');
   assert.ok(geometry.rects.every(r=>r.left>=-1 && r.right<=geometry.viewport+1),
     'Settings content overflowed at '+width+'px: '+JSON.stringify(geometry));
   if(process.env.E2E_SCREENSHOTS==='1' && [1440,390].includes(width)){
     const dir=path.join(root,'test-artifacts');fs.mkdirSync(dir,{recursive:true});
     await page.screenshot({path:path.join(dir,'settings-long-email-'+width+'.png'),fullPage:false});
   }
 }
 await page.evaluate(()=>{
   App.closeSettingsModal();
   App.updateAuthUI({isGuest:true});
 });
 await page.setViewportSize({width:initialWidth,height:844});
}

async function smoke(browser,url,width){
 const context=await browser.newContext({viewport:{width,height:844},locale:'it-IT'});
 const page=await context.newPage();
 const errors=[],network=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('requestfailed',request=>{
   if(request.url().includes('/native/')) network.push({url:request.url(),failure:request.failure()});
 });
 page.on('response',response=>{
   if(response.url().includes('/native/'))network.push({url:response.url(),status:response.status()});
 });
 // Avoid external services and real Supabase accounts.
 await page.route(/^https:\/\//,r=>r.abort('blockedbyclient'));
 const response=await page.goto(url,{waitUntil:'load',timeout:30000});
 assert.equal(response.status(),200);
 await page.waitForFunction(()=>!!window.App&&!!window.LESSONS_DATA&&!document.getElementById('view-roadmap').classList.contains('hidden'));
 assert.equal(await page.evaluate(()=>LESSONS_DATA.length),60);
 assert.equal(await page.evaluate(()=>window.GDHGodot?.engine),'Godot 4.4.1 WebAssembly','Godot must be the default engine');
 assert.equal(await page.locator('#gdh-native-verify-toggle').count(),0,'No Beta toggle should remain');
 assert.equal(await page.locator('#btn-open-settings svg.ui-icon').count(),1,'Settings button must use SVG icon');
 assert.equal((await page.locator('#btn-open-settings').textContent()).trim(),'','Settings button must not contain emoji text');
 // Errori cloud/locali devono essere spiegati e visibili, senza sparire dopo un toast.
 await page.evaluate(()=>App.renderSyncStatus({kind:'error',message:'Test connessione assente'}));
 assert.equal(await page.locator('#gdh-save-notice').isVisible(),true,'Missing persistent offline notice');
 assert.ok((await page.locator('#gdh-save-notice').textContent()).includes('Test connessione assente'));
 assert.equal(await page.locator('#gdh-save-retry').isVisible(),true);
 await page.evaluate(()=>App.renderSyncStatus({kind:'conflict',message:'Versioni differenti'}));
 assert.equal(await page.locator('#gdh-save-resolve').isVisible(),true);
 assert.equal(await page.locator('#gdh-save-backup').isVisible(),true);
 await page.evaluate(()=>App.renderLocalSaveError(true));
 assert.equal(await page.locator('#gdh-save-backup').isVisible(),true,'Missing local save failure backup');
 await page.evaluate(()=>{
   App.renderLocalSaveError(false);
   App.renderSyncStatus({kind:'synced',message:''});
 });
 assert.equal(await page.locator('#gdh-save-notice').isHidden(),true);
 await testLongEmailSettings(page,width);
 await testResponsiveLayout(page,width);
 await page.evaluate(()=>localStorage.setItem('sandbox_welcome_seen','true'));
 // L'Arena classificata e i progetti Premium sono in pausa, ma il progetto gratuito resta aperto.
 await page.evaluate(()=>App.openProjectsView());
 assert.equal(await page.locator('.gdh-arena-coming-soon .gdh-coming-soon-lock').count(),1);
 assert.equal((await page.locator('.gdh-arena-coming-soon .gdh-coming-soon-cover strong').textContent()).trim(),'In arrivo');
 assert.equal(await page.locator('.gdh-project-coming-soon').count(),3);
 assert.equal(await page.locator('.gdh-project-coming-soon .gdh-coming-soon-lock').count(),3);
 assert.equal(await page.locator('.gdh-project-coming-soon button').count(),0,'Premium projects must not be clickable');
 assert.equal(await page.locator('.project-card:not(.gdh-project-coming-soon)').count(),1);
 assert.equal(await page.locator('#project-preview-modal').isHidden(),true);
 await page.evaluate(()=>{
   App.openProjectPreview('project_inventory');
   App.openCompetitiveArena();
   App.openOfficialArena();
 });
 assert.equal(await page.locator('#projects-catalog-section').isVisible(),true);
 assert.equal(await page.locator('#competition-workspace').isHidden(),true);
 assert.equal(await page.locator('#official-arena-workspace').isHidden(),true);
 assert.equal(await page.locator('#project-preview-modal').isHidden(),true);
 // Una posizione salvata della vecchia Arena non deve ripristinare la sezione sospesa.
 await page.evaluate(()=>sessionStorage.setItem('gdscript_hero_position_v1',
   JSON.stringify({version:1,view:'view-projects',projectsTab:'official'})));
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>!document.getElementById('view-projects').classList.contains('hidden'));
 assert.equal(await page.locator('#projects-catalog-section').isVisible(),true);
 assert.equal(await page.locator('#official-arena-workspace').isHidden(),true);
 await page.locator('.project-card:not(.gdh-project-coming-soon)').click();
 assert.equal(await page.locator('#project-arena-workspace').isVisible(),true,'Free Gladiator project must remain available');
 await page.evaluate(()=>App.openProjectsView());
 assert.equal(await page.locator('#projects-catalog-section').isVisible(),true);
 await page.evaluate(()=>App.showRoadmap());
 if(width>820 && process.env.E2E_SCREENSHOTS==='1'){
   const dir=path.join(root,'test-artifacts');fs.mkdirSync(dir,{recursive:true});
   await page.screenshot({path:path.join(dir,'roadmap-1440-global-theme.png'),fullPage:false});
 }
 assert.ok(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgb(27, 31, 38)'),'Godot global background must replace neon theme');
 const roadmapStyle=await page.evaluate(()=>{
   const active=document.querySelector('#view-roadmap .pulse-current');
   const cta=document.querySelector('#view-roadmap .btn-hero-continue');
   return {
     nodeCount:document.querySelectorAll('#view-roadmap .node-item').length,
     nodeAnimation:active?getComputedStyle(active).animationName:null,
     buttonShadow:cta?getComputedStyle(cta).boxShadow:null
   };
 });
 assert.ok(roadmapStyle.nodeCount>0,'Roadmap nodes must remain rendered');
 if(roadmapStyle.nodeAnimation!==null)assert.equal(roadmapStyle.nodeAnimation,'none','Roadmap node must not pulsate with neon');
 console.log('ROADMAP_STYLE '+JSON.stringify(roadmapStyle));

 // Il riscatto deve mantenere i colori Godot in dark/light, senza neon né animazioni.
 // Con progressi simulati controlliamo anche che il clic accrediti gli XP una sola volta.
 const questPaint=await page.evaluate(()=>{
   const original=JSON.parse(JSON.stringify(App.state.dailyQuests));
   const originalXP=App.state.xp;
   const originalCount=App.state.claimedQuestsCount;
   const first=DAILY_QUESTS_CONFIG[0],second=DAILY_QUESTS_CONFIG[1];
   try {
     App.state.dailyQuests.progress[first.id]=first.target;
     App.state.dailyQuests.progress[second.id]=0;
     App.state.dailyQuests.claimed[first.id]=false;
     App.state.dailyQuests.claimed[second.id]=false;
     App.renderSidebarDailyQuests();
     App.updateQuestsBadge();
     const prior=document.documentElement.getAttribute('data-theme');
     const ready=document.querySelector('#sidebar-quests-list .sidebar-quest-item.ready');
     const button=ready.querySelector('.sidebar-quest-btn.active');
     const badge=document.getElementById('sidebar-quests-badge');
     // Senza le transizioni: confrontiamo lo stile finale, non il frame intermedio.
     button.style.transition='none';
     badge.style.transition='none';
     const inspect=()=>{
       const fill=ready.querySelector('.sidebar-quest-fill');
       const s=getComputedStyle(button),b=getComputedStyle(badge);
       return {background:s.backgroundColor,image:s.backgroundImage,shadow:s.boxShadow,
         animation:s.animationName,badgeBackground:b.backgroundColor,badgeImage:b.backgroundImage,
         badgeShadow:b.boxShadow,badgeAnimation:b.animationName,
         fillImage:getComputedStyle(fill).backgroundImage};
     };
     document.documentElement.setAttribute('data-theme','dark');
     const dark=inspect();
     document.documentElement.setAttribute('data-theme','light');
     const light=inspect();
     if(prior===null)document.documentElement.removeAttribute('data-theme');
     else document.documentElement.setAttribute('data-theme',prior);
     const label=document.querySelector('#sidebar-quests-list .sidebar-quest-btn.active').textContent.trim();
     // Simula solo lo stato estetico "riscattato": il vero riscatto può anche
     // attivare trofei e bonus XP non pertinenti a un test CSS.
     App.state.dailyQuests.claimed[first.id]=true;
     App.renderSidebarDailyQuests();
     const state=document.querySelector('#sidebar-quests-list .sidebar-quest-btn.claimed')?.textContent.trim();
     return {dark,light,label,claimed:!!state,state,xpUnchanged:App.state.xp===originalXP};
   } finally {
     App.state.dailyQuests=original;
     App.state.xp=originalXP;
     App.state.claimedQuestsCount=originalCount;
     App.renderSidebarDailyQuests();
     App.updateQuestsBadge();
   }
 });
 for(const theme of ['dark','light']){
   const paint=questPaint[theme];
   assert.equal(paint.image,'none',theme+' ready reward button still has a neon gradient');
   assert.equal(paint.badgeImage,'none',theme+' quest badge still has a gradient');
   assert.equal(paint.shadow,'none',theme+' claim button still glows');
   assert.equal(paint.badgeShadow,'none',theme+' quest badge still glows');
   assert.equal(paint.animation,'none',theme+' claim button still pulses');
   assert.equal(paint.badgeAnimation,'none',theme+' quest badge still pulses');
   assert.equal(paint.fillImage,'none',theme+' progress bar still has a gradient');
 }
 assert.equal(questPaint.dark.background,'rgb(71, 127, 166)','Ready button has wrong Godot dark color');
 assert.equal(questPaint.light.background,'rgb(63, 138, 184)','Ready button has wrong Godot light color');
 assert.equal(questPaint.label,'Riscatta ricompensa','Old neon reward emoji should be removed');
 assert.equal(questPaint.claimed,true,'Claimed state must render correctly');
 assert.equal(questPaint.xpUnchanged,true,'Visual test must not award any XP');
 assert.match(questPaint.state,/Riscattato/);

 // CTA Ripasso: nessun testo sottolineato o controllo senza layout nel callout.
 const reviewCalloutStyle=await page.evaluate(()=>{
   const panel=document.getElementById('roadmap-review-callout');
   panel.classList.remove('hidden');
   const primary=panel.querySelector('button.btn-primary');
   const secondary=panel.querySelector('button.btn-subtle');
   // Per confrontare i colori finali, non i frame intermedi di transition.
   primary.style.transition='none';
   secondary.style.transition='none';
   const prior=document.documentElement.getAttribute('data-theme');
   const inspect=()=>{
     const first=getComputedStyle(primary),second=getComputedStyle(secondary);
     return {
       primary:{bg:first.backgroundColor,color:first.color,padding:first.paddingLeft,
         radius:first.borderTopLeftRadius,height:primary.getBoundingClientRect().height,
         decoration:first.textDecorationLine,shadow:first.boxShadow},
       secondary:{bg:second.backgroundColor,radius:second.borderTopLeftRadius,
         height:secondary.getBoundingClientRect().height}
     };
   };
   document.documentElement.setAttribute('data-theme','dark');
   const dark=inspect();
   document.documentElement.setAttribute('data-theme','light');
   const light=inspect();
   if(prior===null)document.documentElement.removeAttribute('data-theme');
   else document.documentElement.setAttribute('data-theme',prior);
   return {dark,light};
 });
 assert.equal(reviewCalloutStyle.dark.primary.bg,'rgb(87, 157, 204)',
   'CTA Apri Ripasso missing Godot button background');
 assert.equal(reviewCalloutStyle.light.primary.bg,'rgb(63, 143, 190)',
   'CTA Apri Ripasso missing light-theme background');
 assert.equal(reviewCalloutStyle.dark.primary.radius,'8px');
 assert.equal(reviewCalloutStyle.dark.secondary.radius,'8px');
 assert.equal(reviewCalloutStyle.dark.primary.decoration,'none');
 assert.equal(reviewCalloutStyle.dark.primary.shadow,'none');
 assert.ok(reviewCalloutStyle.dark.primary.height>=39);
 assert.ok(reviewCalloutStyle.dark.secondary.height>=39);
 const primaryPadding=parseFloat(reviewCalloutStyle.dark.primary.padding);
 assert.ok(primaryPadding>=10,'CTA missing horizontal padding');
 await page.locator('#roadmap-review-callout button.btn-primary').click();
 await viewIs(page,'review');
 await page.evaluate(()=>App.showRoadmap());
 await page.evaluate(()=>document.getElementById('roadmap-review-callout').classList.remove('hidden'));
 await page.locator('#roadmap-review-callout button.btn-subtle').click();
 assert.ok(await page.locator('#roadmap-review-callout').isHidden(),
   'Non adesso must dismiss the callout');
 await page.evaluate(()=>{
   App.state.sessionDismissedReviewCallout=false;
   App.updateReviewIndicators();
 });

 await testNavigationPersistence(page,width);
 for(const section of ['roadmap','practice','projects','review','stats']){
   const selector=width<821?'#mob-nav-'+section:'#nav-'+section+'-btn';
   await page.locator(selector).click({timeout:15000});
   await viewIs(page,section);
 }
 // Esecuzione della Sandbox attraverso il pulsante reale, senza chiamate dirette al runtime.
 const sandboxNav=width<821?'#mob-nav-practice':'#nav-practice-btn';
 await page.locator(sandboxNav).click({timeout:15000});
 await viewIs(page,'practice');
 // Le icone Sandbox devono essere veri SVG visibili, non emoji o glifi testuali.
 const iconAudit=await page.evaluate(()=>{
   const root=document.getElementById('view-practice');
   const icons=[...root.querySelectorAll('svg.sandbox-svg-icon')];
   const missing=icons.filter(svg=>{
     // Il tasto Rimuovi nodo resta nascosto finché non c'è una selezione.
     if(!svg.getClientRects().length)return false;
     const use=svg.querySelector('use');
     const id=use?.getAttribute('href');
     return !id?.startsWith('#gdh-icon-') || !document.getElementById(id.slice(1)) ||
       svg.getBBox().width<=0 || svg.getBBox().height<=0;
   });
   const pictographs=[...root.textContent].filter(c=>/\p{Extended_Pictographic}/u.test(c));
   return {count:icons.length,missing:missing.map(x=>x.outerHTML.slice(0,180)),pictographs};
 });
 assert.ok(iconAudit.count>=12,'Missing Sandbox SVG icons: '+JSON.stringify(iconAudit));
 assert.equal(iconAudit.missing.length,0,'Unrendered Sandbox icon: '+JSON.stringify(iconAudit));
 assert.deepEqual(iconAudit.pictographs,[],'Emoji remain in Sandbox: '+JSON.stringify(iconAudit));
 for(const [open,modal,close] of [
   ['#btn-sandbox-help','#modal-sandbox-welcome','#btn-close-sandbox-welcome'],
   ['#btn-sandbox-new-project','#modal-sandbox-new-project','#btn-cancel-sandbox-new'],
   ['#btn-sandbox-add-node','#add-node-modal','#btn-cancel-add-node']
 ]){
   await page.locator(open).click({timeout:10000});
   await page.locator(modal).waitFor({state:'visible'});
   const iconCount=await page.locator(modal+' svg.sandbox-svg-icon use').count();
   assert.ok(iconCount>=1,'Missing SVG icon in '+modal);
   await page.locator(close).click({timeout:10000});
 }
 // Stesso autocomplete del corso: suggerimenti, Tab/Enter, frecce, Escape
 // e completamento delle variabili definite dall'utente.
 await page.locator('#sandbox-code-editor').fill('extends Node2D\n\npri');
 await page.locator('#sandbox-autocomplete-popup').waitFor({state:'visible',timeout:4000});
 assert.equal(await page.locator('#sandbox-autocomplete-popup .autocomplete-name').first().textContent(),'print');
 // Menu delle lezioni e Sandbox: stessa resa Godot, senza gradienti e senza glow.
 const autocompletePaint=await page.evaluate(()=>{
   const root=document.documentElement;
   const prior=root.getAttribute('data-theme');
   const measure=()=>{
     const selectors=['#sandbox-autocomplete-popup','#autocomplete-popup'];
     return selectors.map(id=>{
       const popup=document.querySelector(id);
       const styles=getComputedStyle(popup);
       const item=getComputedStyle(document.querySelector('#sandbox-autocomplete-popup .autocomplete-item.selected'));
       return {background:styles.backgroundColor,image:styles.backgroundImage,
         radius:styles.borderTopLeftRadius,selected:item.backgroundColor};
     });
   };
   root.setAttribute('data-theme','dark');
   const dark=measure();
   root.setAttribute('data-theme','light');
   const light=measure();
   if(prior===null)root.removeAttribute('data-theme');
   else root.setAttribute('data-theme',prior);
   return {dark,light};
 });
 for(const item of autocompletePaint.dark){
   assert.equal(item.background,'rgb(36, 45, 57)','Dark autocomplete not using new Godot palette');
   assert.equal(item.image,'none','Old gradient remains in autocomplete');
   assert.equal(item.radius,'8px','Old autocomplete border radius remains');
 }
 for(const item of autocompletePaint.light){
   assert.equal(item.background,'rgb(247, 250, 252)','Light autocomplete not using new Godot palette');
   assert.equal(item.image,'none','Autocomplete light theme has gradient');
 }
 assert.equal(autocompletePaint.dark[0].selected,'rgb(52, 74, 96)',
   'Autocomplete selected row still uses old neon highlight');
 await page.locator('#sandbox-code-editor').press('ArrowDown');
 await page.locator('#sandbox-code-editor').press('ArrowUp');
 await page.locator('#sandbox-code-editor').press('Tab');
 assert.ok((await page.locator('#sandbox-code-editor').inputValue()).endsWith('print'),'Sandbox Tab completion failed');
 assert.ok(await page.locator('#sandbox-autocomplete-popup').isHidden(),'Sandbox autocomplete remains open after Tab');
 assert.ok((await page.evaluate(()=>App.getActiveSandboxProject().code)).endsWith('print'),
   'Sandbox completion not saved into the active project');
 await page.locator('#sandbox-code-editor').fill('var energia_totale = 10\nener');
 await page.locator('#sandbox-autocomplete-popup').waitFor({state:'visible',timeout:4000});
 assert.equal(await page.locator('#sandbox-autocomplete-popup .autocomplete-name').first().textContent(),'energia_totale');
 await page.locator('#sandbox-autocomplete-popup .autocomplete-item').first().click();
 assert.ok((await page.locator('#sandbox-code-editor').inputValue()).endsWith('energia_totale'),
   'Sandbox variable autocomplete failed by mouse click');
 await page.locator('#sandbox-code-editor').fill('pri');
 await page.locator('#sandbox-autocomplete-popup').waitFor({state:'visible'});
 await page.locator('#sandbox-code-editor').press('Escape');
 assert.ok(await page.locator('#sandbox-autocomplete-popup').isHidden(),'Escape must close Sandbox autocomplete');
 await page.locator('#sandbox-code-editor').fill('pri');
 await page.locator('#sandbox-code-editor').press('Enter');
 assert.equal(await page.locator('#sandbox-code-editor').inputValue(),'print',
   'Sandbox Enter completion failed');
 await testSmartIndent(page,'#sandbox-code-editor');
 await testGodotEditorExtras(page,'#sandbox-code-editor');
 await page.locator('#sandbox-code-editor').fill('extends Node2D\n\nfunc _ready():\n    print("BROWSER_SANDBOX_OK")');
 await page.locator('#btn-sandbox-run').click({timeout:10000});
 try {
   await page.waitForFunction(()=>document.getElementById('sandbox-console-output').textContent.includes('BROWSER_SANDBOX_OK'),null,{timeout:12000});
 } catch(error) {
   const diagnostics=await page.evaluate(()=>({
     sandbox:document.getElementById('sandbox-console-output')?.textContent,
     status:document.getElementById('sandbox-status-tag')?.textContent,
     engine:window.GDHGodot?.engine,
     lastStage:window.GDHGodot?.lastStage,
     frame:document.getElementById('gdh-native-runner')?.src,
     scripts:[...document.querySelectorAll('script[src]')].slice(-4).map(x=>x.src)
   }));
   throw new Error('Godot Sandbox smoke diagnostic: '+JSON.stringify({diagnostics,pageErrors:errors,network}));
 }
 // Sandbox: aggiungi i nodi come farebbe un utente con un nuovo progetto vuoto.
 await page.evaluate(()=>{
   App.addSandboxNode('Label','Label','In attesa');
   App.addSandboxNode('Button','Button','Clicca');
 });
 // Sandbox: figli effettivamente istanziati, proprietà native e click persistenti.
 const sampleCode='extends Node2D\nvar clicks = 0\nfunc _ready():\n    $Label.text = "Nativo pronto"\n    print("SANDBOX_NODES_READY")\nfunc _on_button_pressed():\n    clicks += 1\n    $Label.text = "Click " + str(clicks)\n    print("SANDBOX_CLICK " + str(clicks))';
 await page.locator('#sandbox-code-editor').fill(sampleCode);
 await page.locator('#btn-sandbox-run').click({timeout:10000});
 try {
   await page.waitForFunction(()=>document.getElementById('sandbox-console-output').textContent.includes('SANDBOX_NODES_READY'),null,{timeout:15000});
 } catch(error){
   const info=await page.evaluate(()=>({
     output:document.getElementById('sandbox-console-output')?.textContent,
     status:document.getElementById('sandbox-status-tag')?.textContent,
     phase:window.GDHGodot?.lastStage,
     scene:App.sandboxScene?.children?.map(x=>({name:x.name,text:x.text})),
     connected:App.sandboxNativeSession,
     selectedProject:App.getActiveSandboxProject()?.id
   }));
   throw Error('Sandbox scene diagnostic: '+JSON.stringify(info));
 }
 const sceneStart=await page.evaluate(()=>{
   const s=App.sandboxScene;
   const label=s.children.find(x=>x.name==='Label');
   const native=App.sandboxNativeSession;
   const project=App.getActiveSandboxProject();
   return {label:label?.text,native:!!native,projectLabel:project.nodes.find(x=>x.name==='Label')?.text,
     scene:document.getElementById('sandbox-ui-overlay')?.textContent};
 });
 assert.equal(sceneStart.label,'Nativo pronto','Godot _ready must update native Label');
 assert.ok(sceneStart.native,'Godot persistent session missing');
 assert.ok(sceneStart.scene.includes('Nativo pronto'),'Viewport not synced with Godot');
 for(let click=1;click<=2;click++){
   await page.locator('#sandbox-ui-overlay .godot-ui-btn').click({timeout:10000});
   await page.waitForFunction(i=>document.getElementById('sandbox-console-output').textContent.includes('SANDBOX_CLICK '+i),click,{timeout:8000});
   assert.equal(await page.evaluate(()=>App.sandboxScene.children.find(x=>x.name==='Label').text),
     'Click '+click,'Godot instance did not persist click state');
 }
 assert.equal(await page.evaluate(()=>App.getActiveSandboxProject().nodes.find(x=>x.name==='Label').text),
   sceneStart.projectLabel,'Runtime properties must not overwrite saved scene definition');
 // Contrasto del testo: tema scuro e tema chiaro.
 const contrast=await page.evaluate(()=>{
   const syntax=document.getElementById('sandbox-gdscript-highlight');
   const text=getComputedStyle(syntax).color;
   const bg=getComputedStyle(document.querySelector('.sandbox-editor-col .gdscript-edit-stack')).backgroundColor;
   const rgb=str=>(str.match(/\d+(?:\.\d+)?/g)||[]).slice(0,3).map(Number);
   const lum=tuple=>tuple.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;})
      .reduce((total,v,i)=>total+v*[.2126,.7152,.0722][i],0);
   const l1=lum(rgb(text)),l2=lum(rgb(bg));
   return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
 });
 assert.ok(contrast>=4.5,'Sandbox editor text contrast below WCAG AA: '+contrast);
 assert.ok(await page.locator('#sandbox-gdscript-syntax-layer .gd-token-keyword').count()>0,
   'Sandbox editor does not highlight GDScript keywords');
 const lightContrast=await page.evaluate(()=>{
   document.documentElement.setAttribute('data-theme','light');
   const text=getComputedStyle(document.getElementById('sandbox-gdscript-highlight')).color;
   const bg=getComputedStyle(document.querySelector('#view-practice .gdscript-edit-stack')).backgroundColor;
   const rgb=str=>(str.match(/\d+(?:\.\d+)?/g)||[]).slice(0,3).map(Number);
   const lum=str=>rgb(str).map(v=>{
     const x=v/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;
   }).reduce((a,b,i)=>a+b*[.2126,.7152,.0722][i],0);
   const a=lum(text),b=lum(bg);
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
 });
 assert.ok(lightContrast>=4.5,'Sandbox light-theme editor text contrast below WCAG AA: '+lightContrast);
 await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
 // Anche nel rendering della scena, un nome nodo non deve trasformarsi in HTML attivo.
 await page.evaluate(()=>{
   const current=App.getActiveSandboxProject();
   current.nodes.push({name:'<img src=x onerror=window.__sandboxXss=1>',type:'Label',parent:current.nodes[0].name,text:'<img src=x onerror=window.__sandboxXss=1>'});
   App.loadActiveSandboxProject();
 });
 assert.equal(await page.evaluate(()=>window.__sandboxXss||0),0,'XSS in Sandbox node name');
 assert.equal(await page.locator('#sandbox-scene-tree img').count(),0,'HTML in Sandbox node tree');
 await page.evaluate(()=>App.openLesson(1));
 await viewIs(page,'exercise');
 await testAllLessonCodeSamplesFit(page,width);
 assert.equal(await page.locator('#view-exercise .exercise-mascot-slot').count(),0,
   'Il vecchio placeholder della mascotte non deve comparire nelle lezioni');
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await testSmartIndent(page,'#code-editor');
 await testGodotEditorExtras(page,'#code-editor');
 // Il completamento originale delle lezioni rimane operativo.
 await page.locator('#code-editor').fill('pri');
 await page.locator('#autocomplete-popup').waitFor({state:'visible',timeout:4000});
 assert.equal(await page.locator('#autocomplete-popup .autocomplete-name').first().textContent(),'print');
 await page.locator('#code-editor').press('Tab');
 assert.equal(await page.locator('#code-editor').inputValue(),'print');
 // Il controllo del completamento non deve alterare lo starter della lezione 1.
 await page.evaluate(()=>{
   delete App.state.userCode[1];
   App.saveStorage();
   App.openLesson(1);
 });
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 assert.equal(await page.locator('#view-exercise .editor-header #btn-run-code').count(),1,'Verify button belongs to editor header');
 assert.equal(await page.locator('#view-exercise .panel-lesson #expected-output-pre').count(),0,'Expected output must appear only in dock');
 const initialGeometry=await page.evaluate(()=>{
   const el=id=>document.getElementById(id).getBoundingClientRect();
   const viewport=document.getElementById('exercise-viewport-col');
   return {
     feedbackAboveOutput:el('exercise-primary-feedback').top < el('expected-output-pre').top,
     feedbackBeforeTests:el('exercise-primary-feedback').top < el('exercise-test-details').top,
     viewportHidden:getComputedStyle(viewport).display==='none',
     dockBottom:el('exercise-validation-panel').bottom,
     buttonTop:el('btn-run-code').top,
     expectedShown:getComputedStyle(document.getElementById('expected-output-pre')).display!=='none'
   };
 });
 assert.ok(initialGeometry.feedbackAboveOutput&&initialGeometry.feedbackBeforeTests,'First feedback is above outputs and tests');
 const outputLayout=await page.evaluate(()=>{
   const el=document.querySelector('#view-exercise .output-comparison-grid');
   const e=el.querySelector('.expected-box').getBoundingClientRect();
   const o=el.querySelector('.real-box').getBoundingClientRect();
   const style=getComputedStyle(el);
   return {display:style.display,template:style.gridTemplateColumns,expected:{x:e.x,y:e.y,w:e.width},actual:{x:o.x,y:o.y,w:o.width}};
 });
 console.log('LAYOUT '+width+'px '+JSON.stringify(outputLayout));
 assert.equal(outputLayout.display,'grid','Expected/actual must use CSS grid');
 assert.ok(outputLayout.actual.x>outputLayout.expected.x+10,'Expected/actual must appear side-by-side');
 const headerLayout=await page.evaluate(()=>{
   const tab=document.querySelector('#view-exercise .editor-header .tab').getBoundingClientRect();
   const run=document.getElementById('btn-run-code').getBoundingClientRect();
   return {tabRight:tab.right,runLeft:run.left};
 });
 assert.ok(headerLayout.tabRight+4<headerLayout.runLeft,'Editor file tab and Verify must not overlap');
 assert.ok(initialGeometry.viewportHidden,'Introductory lesson must not show scene or viewport');
 assert.ok(initialGeometry.expectedShown,'Expected output must be visible before Verify');
 if(width>820)assert.ok(initialGeometry.dockBottom<=844,'Desktop dock must remain visible without page scrolling');
 if(process.env.E2E_SCREENSHOTS==='1'){
   const dir=path.join(root,'test-artifacts');
   fs.mkdirSync(dir,{recursive:true});
   await page.screenshot({path:path.join(dir,'exercise-'+width+'-initial.png'),fullPage:false});
 }
 // Design acceptance: real colored GDScript tokens, no old neon theme.
 const design=await page.evaluate(()=>{
   const e=document.getElementById('code-editor');
   const layer=document.getElementById('gdscript-syntax-layer');
   const shell=document.querySelector('#view-exercise .panel-code');
   const header=document.querySelector('body:has(#view-exercise:not(.hidden)) .navbar');
   const tokens=layer?[...layer.querySelectorAll('[class^="gd-token-"]')]:[];
   const getRGB=element=>getComputedStyle(element).backgroundColor;
   return {
      tokens:tokens.length,
      comments:tokens.filter(x=>x.classList.contains('gd-token-comment')).length,
      keywords:tokens.filter(x=>x.classList.contains('gd-token-keyword')).length,
      editorColor:getRGB(shell),
      navbarColor:header?getRGB(header):null,
      syntaxLayerHeight:layer?layer.getBoundingClientRect().height:0,
      inputTransparent:getComputedStyle(e).color
   };
 });
 console.log('DESIGN '+width+'px '+JSON.stringify(design));
 assert.ok(design.tokens>0 && design.keywords>0,'GDScript syntax must be highlighted');
 assert.ok(await page.locator('.gdh-code-guide').count()===1,'La guida al codice deve comparire in ogni lezione');
 assert.match(await page.locator('.gdh-code-guide').textContent(),/func _ready/);
 await page.evaluate(()=>App.openLesson(4));
 assert.equal(await page.locator('#view-exercise .exercise-mascot-slot').count(),0,
   'Il vecchio placeholder della mascotte non deve comparire nelle sfide');
 assert.equal(await page.locator('.gdh-code-guide').evaluate(el=>el.open),true,
   'La sfida 4 deve spiegare automaticamente extends Node al suo primo incontro');
 assert.match(await page.locator('.gdh-code-guide').textContent(),/extends Node/);
 assert.match(await page.locator('.gdh-code-guide').textContent(),/nodo/i);
 // Hover sulla parola: nessun click, nessuna X, sparisce uscendo dal termine.
 if(width<821)await page.locator('#btn-tab-code').click();
 const codeBeforeHelp=await page.locator('#code-editor').inputValue();
 const hoverToken=async (index,context='code-editor')=>page.locator('#'+context).evaluate((el,i)=>{
   const style=getComputedStyle(el),rect=el.getBoundingClientRect();
   const fontSize=parseFloat(style.fontSize);
   const lineHeight=parseFloat(style.lineHeight)||fontSize*1.6;
   const canvas=document.createElement('canvas');
   const ctx=canvas.getContext('2d');
   ctx.font=[style.fontStyle,style.fontWeight,style.fontSize,style.fontFamily].join(' ');
   const charWidth=ctx.measureText('M').width;
   const x=rect.left+el.clientLeft+parseFloat(style.paddingLeft)+charWidth*(i+.5)-el.scrollLeft;
   const y=rect.top+el.clientTop+parseFloat(style.paddingTop)+lineHeight/2-el.scrollTop;
   el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',clientX:x,clientY:y}));
 },index);
 await hoverToken(2);
 assert.equal(await page.locator('#gdh-inline-code-help').isVisible(),true,
   'Il passaggio del mouse su extends deve aprire il tooltip');
 assert.equal(await page.locator('#gdh-inline-code-help').getAttribute('data-concept'),'extends');
 assert.match(await page.locator('#gdh-inline-code-help').textContent(),/Node/);
 assert.equal(await page.locator('#gdh-inline-code-help .gdh-inline-help-close').count(),0,
   'Non deve esserci un pulsante X');
 assert.equal(await page.locator('#code-editor').inputValue(),codeBeforeHelp);
 // Interruttore della guida: chiusura immediata, sincronizzazione e persistenza.
 assert.equal(await page.locator('.gdh-inline-help-toggle[aria-checked="true"]').count(),4,
   'Il toggle deve essere inizialmente attivo in tutti gli editor');
 const toggle=page.locator('#view-exercise .editor-tools .gdh-inline-help-toggle');
 await toggle.evaluate(button=>button.click());
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true,
   'Disattivare la guida deve chiudere la finestra già aperta');
 assert.equal(await page.locator('.gdh-inline-help-toggle[aria-checked="false"]').count(),4,
   'I toggle delle lezioni e Sandbox devono condividere la preferenza');
 await hoverToken(2);
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true,
   'Con la guida spenta non devono apparire tooltip passando sulle parole');
 await page.locator('#code-editor').evaluate(el=>{el.focus();el.setSelectionRange(2,2);});
 await page.locator('#code-editor').press('F1');
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true,
   'F1 non deve aggirare il toggle spento');
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>!!window.App?.state?.sandbox);
 assert.equal(await page.locator('.gdh-inline-help-toggle[aria-checked="false"]').count(),4,
   'La guida deve restare disattivata dopo il ricaricamento');
 await page.evaluate(()=>App.openLesson(4));
 if(width<821)await page.locator('#btn-tab-code').click();
 await hoverToken(2);
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true);
 await page.locator('#view-exercise .mobile-code-toolbar .gdh-inline-help-toggle')
   .evaluate(button=>button.click());
 assert.equal(await page.locator('.gdh-inline-help-toggle[aria-checked="true"]').count(),4);
 await hoverToken(2);
 assert.equal(await page.locator('#gdh-inline-code-help').isVisible(),true,
   'La guida riattivata deve tornare a funzionare senza ricaricare la pagina');
 // Anche uscire dalla parola, pur restando sopra l'editor, deve chiudere.
 await hoverToken(13);
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true);
 // Codice DIGITATO dallo studente, senza parametri né parentesi.
 await page.locator('#code-editor').fill('func');
 await hoverToken(2);
 assert.equal(await page.locator('#gdh-inline-code-help').getAttribute('data-concept'),'func');
 await page.locator('#code-editor').evaluate(el=>el.dispatchEvent(new PointerEvent('pointerleave',{bubbles:true,pointerType:'mouse'})));
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true);
 await page.locator('#code-editor').fill('var');
 await hoverToken(1);
 assert.equal(await page.locator('#gdh-inline-code-help').getAttribute('data-concept'),'var');
 await page.locator('#code-editor').fill('# nota: func');
 await hoverToken(9);
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true,
   'Non interpretare come codice le parole dei commenti');
 // F1 resta disponibile per la navigazione con tastiera.
 await page.locator('#code-editor').fill('func');
 await page.locator('#code-editor').evaluate(el=>{el.focus();el.setSelectionRange(2,2);});
 await page.locator('#code-editor').press('F1');
 assert.equal(await page.locator('#gdh-inline-code-help').isVisible(),true);
 await page.locator('#code-editor').press('Escape');
 assert.equal(await page.locator('#gdh-inline-code-help').isHidden(),true);
 await page.evaluate(()=>App.openLesson(1));
 if(width<821)await page.locator('#btn-tab-code').click();

 assert.ok(design.syntaxLayerHeight>0,'Syntax layer must be rendered');
 assert.ok(!design.navbarColor?.includes('0, 229, 255'),'Old neon header must not remain');
 // Errore sintattico reale: Godot deve popolare il pannello didattico.
 const badCode='extends Node\nfunc _ready():\n    if true\n        print("FAIL")';
 await page.locator('#code-editor').fill(badCode);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>!App.isValidating,null,{timeout:18000});
 const debugState=await page.evaluate(()=>({
   kind:document.querySelector('#exercise-debug-area .gdh-debug-panel')?.dataset.kind,
   hint:document.querySelector('#exercise-debug-area .gdh-debug-hint')?.textContent,
   technical:document.querySelector('#exercise-debug-area .gdh-debug-technical pre')?.textContent,
   jump:document.querySelector('#exercise-debug-area .gdh-debug-jump')?.textContent,
   finished:App.state.finishedLessons.includes(1)
 }));
 assert.equal(debugState.kind,'engine','Godot syntax error lacks debugger panel');
 assert.ok(debugState.hint?.length>20,'Debugger lacks an explanatory hint');
 assert.ok(debugState.technical?.length>5,'Debugger must preserve original Godot message');
 assert.equal(debugState.finished,false,'Debugging should not complete a lesson');
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-next-hint').count(),1,
   'Il debugger deve mostrare un pulsante per gli indizi progressivi');
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-step').count(),0,
   'Gli indizi approfonditi non devono essere svelati subito');
 const initialHintCount=await page.evaluate(()=>App.state.hintsRevealed);
 await page.locator('#exercise-debug-area .gdh-debug-next-hint').click();
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-step').count(),1);
 assert.ok(await page.locator('#exercise-debug-area .gdh-debug-step').first().textContent().then(x=>x.length>25));
 assert.ok((await page.evaluate(()=>App.state.hintsRevealed))>initialHintCount,
   'Aprire gli indizi nel debugger deve contare come aiuto');
 await page.locator('#exercise-debug-area .gdh-debug-next-hint').click();
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-step').count(),2);
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-next-hint').count(),0);
 const noExtendsCode='func _ready():\n    # Stampa esattamente\n    prin("Ciao Godot!")\n';
 await page.locator('#code-editor').fill(noExtendsCode);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>!App.isValidating,null,{timeout:18000});
 const mappedError=await page.evaluate(()=>({
   jump:document.querySelector('#exercise-debug-area .gdh-debug-jump')?.textContent,
   row:[...document.querySelectorAll('#line-numbers .gdh-error-number')].map(el=>Number(el.textContent)),
   bannerHidden:document.getElementById('exercise-primary-feedback').classList.contains('hidden'),
   hasGuide:!!document.querySelector('#exercise-debug-area .gdh-debug-panel')
 }));
 assert.equal(mappedError.jump,'Vai alla riga 3','Il debugger deve indicare la riga dell’editor, non quella preceduta da extends Node');
 assert.deepEqual(mappedError.row,[3],'Il colore rosso deve evidenziare la riga 3, non quella vuota 4');
 assert.equal(mappedError.bannerHidden,true,'Il riquadro rosso duplicato deve sparire');
 assert.equal(mappedError.hasGuide,true,'La spiegazione didattica deve rimanere visibile');
 if(mappedError.jump){
   await page.locator('#exercise-debug-area .gdh-debug-jump').click();
   assert.equal(await page.locator('#code-editor').evaluate(el=>{
     return el.value.slice(0,el.selectionStart).split('\n').length;
   }),3,'Debugger jump does not focus the correctly mapped line');
 }
 const official=await page.evaluate(()=>LESSONS_DATA.find(l=>l.id===1).solution);
 await page.locator('#code-editor').fill(official);
 assert.equal(await page.locator('#exercise-debug-area .gdh-debug-panel').count(),0,
   'Editing the code should clear the previous error');
 await page.locator('#btn-run-code').click({timeout:10000});
 try {
   await page.waitForFunction(()=>App.state.finishedLessons.includes(1),null,{timeout:15000});
 } catch(error){
   throw new Error('Lesson after Sandbox diagnostic: '+JSON.stringify(await page.evaluate(()=>({
     output:document.getElementById('real-output-pre')?.textContent,
     status:document.getElementById('test-status-badge')?.textContent,
     feedback:document.getElementById('exercise-feedback-description')?.textContent,
     stage:window.GDHGodot?.lastStage,validating:App.isValidating,
     script:document.getElementById('code-editor')?.value
   }))));
 }
 assert.ok(await page.evaluate(()=>App.state.xp>0),'Missing XP reward');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gdscript_hero_save_v4')));
 assert.ok(saved.finishedLessons.includes(1),'Lesson missing from localStorage');
 await page.waitForFunction(()=>!document.getElementById('success-modal').classList.contains('hidden'),null,{timeout:4000});
 assert.equal(await page.locator('#modal-xp-gain').textContent(),
   '+'+await page.evaluate(()=>LESSONS_DATA.find(l=>l.id===1).xp),
   'First successful completion must show its real XP');
 assert.equal(await page.locator('#modal-xp-card').isVisible(),true,
   'First successful completion must show the XP card');
 assert.equal(await page.locator('#lesson-xp-badge').textContent(),'Già completato',
   'Lesson badge must stop advertising the already claimed reward');
 // Ripetere lo stesso esercizio non deve assegnare XP né prometterne nella modale.
 await page.locator('#btn-modal-stay').click({timeout:10000});
 const xpBeforeReplay=await page.evaluate(()=>App.state.xp);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>!App.isValidating &&
   !document.getElementById('success-modal').classList.contains('hidden'),null,{timeout:20000});
 assert.equal(await page.evaluate(()=>App.state.xp),xpBeforeReplay,
   'Repeating a completed lesson must not assign XP again');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('gdscript_hero_save_v4')).xp),xpBeforeReplay,
   'Repeated lesson must not persist extra XP');
 assert.equal(await page.locator('#modal-success-title').textContent(),'ESERCIZIO COMPLETATO!',
   'Repeated lesson must display a neutral success title');
 assert.equal(await page.locator('#modal-xp-card').isHidden(),true,
   'Repeated lesson must not show an XP reward card');
 // Chiudi la modale di successo come farebbe lo studente prima della seconda prova.
 await page.locator('#btn-modal-stay').click({timeout:10000});
 // Ripasso: TUTTE le varianti devono mostrare il proprio compito/starter,
 // anche dopo una sfida di apprendimento con layout differente (lezione 4).
 await page.evaluate(()=>{
   App.state.userCode[4]='func _ready():\\n    print("BOZZA_SOLO_CORSO")';
   App.saveStorage();
   App.openLesson(4);
 });
 const reviewIds=await page.evaluate(()=>REVIEW_VARIANTS.map(v=>v.id));
 assert.equal(reviewIds.length,17,'Expected 17 review variants');
 for(const id of reviewIds){
   const snap=await page.evaluate(variantId=>{
     App.openReviewVariant(variantId);
     const v=REVIEW_VARIANTS.find(x=>x.id===variantId);
     const sample=document.createElement('div');sample.innerHTML=v.task;
     return {
       isReview:App.isReviewMode,activeId:App.currentReviewVariant?.id,
       title:document.getElementById('lesson-title')?.textContent,
       scenario:document.getElementById('lesson-theory')?.textContent||'',
       task:document.getElementById('lesson-task')?.textContent,
       wantedTask:sample.textContent,code:document.getElementById('code-editor').value,
       starter:v.starterCode,expected:document.getElementById('expected-output-pre').innerText,
       expectedVariant:v.expectedOutput||'// Nessun output richiesto',
       hint:!!document.getElementById('btn-toggle-hint'),
       nextHidden:document.getElementById('btn-header-next').classList.contains('hidden'),
       previousHidden:document.getElementById('btn-header-prev').classList.contains('hidden'),
       banner:!document.getElementById('review-exercise-banner').classList.contains('hidden'),
       back:document.getElementById('btn-back-to-roadmap').textContent,
       baseDraft:App.state.userCode[4],titleExpected:v.title,scenarioExpected:v.scenario
     };
   },id);
   assert.equal(snap.isReview,true,'Not in review: '+id);
   assert.equal(snap.activeId,id);
   assert.equal(snap.title,snap.titleExpected,'Stale title '+id);
   assert.ok(snap.scenario.includes(snap.scenarioExpected),'Stale scenario '+id);
   assert.equal(snap.task,snap.wantedTask,'Stale assignment '+id);
   assert.equal(snap.code,snap.starter,'Stale editor content '+id);
   assert.equal(snap.expected,snap.expectedVariant,'Stale expected output '+id);
   assert.ok(snap.hint&&snap.nextHidden&&snap.previousHidden&&snap.banner,'Review controls out of sync '+id);
   assert.ok(snap.back.includes('Palestra'),'Review back navigation wrong '+id);
   assert.ok(snap.baseDraft.includes('BOZZA_SOLO_CORSO'),'Course draft overwritten '+id);
 }
 // Audit end-to-end delle soluzioni ufficiali con Godot WASM reale.
 // Un solo desktop evita di eseguire due volte le 17 varianti su mobile.
 if(width>820){
   const nativeAudit=await page.evaluate(async()=>{
     const results=[];
     for(const v of REVIEW_VARIANTS){
       try {
         const initialScene=v.initialNodes?.length?GDScriptRuntime.buildScene(v):null;
         const result=await GDScriptRuntime.execute(v.solution,{lesson:v,initialScene});
         const checks=await v.validate(result,GDScriptRuntime);
         const sceneMatches=!v.initialNodes?.length || v.initialNodes.every(node=>
           result.native?.scene?.[node.name]?.exists===true &&
           result.native.scene[node.name].class===node.type);
         results.push({
           id:v.id,accepted:result.success&&sceneMatches&&checks.length>0&&checks.every(t=>t.passed),
           nativeStatus:result.native?.status||null,error:result.error||null,
           scene:result.scene?true:false,sceneMatches,
           checks:checks.filter(t=>!t.passed).map(t=>({desc:t.desc,diff:t.diff})).slice(0,8)
         });
       }catch(error){results.push({id:v.id,accepted:false,error:String(error)});}
     }
     return results;
   });
   console.log('REVIEW_NATIVE_AUDIT '+JSON.stringify(nativeAudit));
   assert.equal(nativeAudit.length,17,'Native review audit did not cover all variants');
   assert.ok(nativeAudit.every(x=>x.accepted),
     'Godot rejected official review solutions: '+nativeAudit.filter(x=>!x.accepted).map(x=>x.id).join(', '));
 }
 // Digitazione, Ripristina e Mostra soluzione agiscono soltanto sulla variante.
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await page.locator('#code-editor').fill('extends Node\\nfunc _ready():\\n    print("SOLO_RIPASSO")');
 assert.ok((await page.evaluate(()=>App.state.userCode[4])).includes('BOZZA_SOLO_CORSO'));
 page.once('dialog',dialog=>dialog.accept());
 // Il controllo Ripristina e' nascosto su alcuni layout mobile: proviamo
 // comunque la stessa azione DOM, senza cambiare la UI responsiva.
 if(width<821)await page.evaluate(()=>document.getElementById('btn-reset-code').click());
 else await page.locator('#btn-reset-code').click({timeout:10000});
 assert.equal(await page.locator('#code-editor').inputValue(),
   await page.evaluate(()=>App.currentReviewVariant.starterCode),'Review reset must use variant starter');
 if(width<821)await page.locator('#btn-tab-instructions').click({timeout:10000});
 await page.locator('#btn-toggle-hint').click({timeout:10000});
 assert.ok(await page.locator('#hint-box').isVisible(),'Review hint panel did not open');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#btn-reveal-solution').click({timeout:10000});
 assert.equal(await page.locator('#code-editor').inputValue(),
   await page.evaluate(()=>App.currentReviewVariant.solution),'Review reveal must use variant solution');
 assert.ok((await page.evaluate(()=>App.state.userCode[4])).includes('BOZZA_SOLO_CORSO'));
 // Una soluzione di ripasso accettata dà i suoi XP, non completa la lezione 4.
 await page.evaluate(()=>App.openReviewVariant('rev_syntax_01'));
 const reviewXpBefore=await page.evaluate(()=>App.state.xp);
 const reviewSolution=await page.evaluate(()=>REVIEW_VARIANTS.find(v=>v.id==='rev_syntax_01').solution);
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await page.locator('#code-editor').fill(reviewSolution);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>App.state.reviewProgress.completedVariants.includes('rev_syntax_01'),null,{timeout:20000});
 assert.equal(await page.evaluate(()=>App.state.xp),reviewXpBefore+15,'Incorrect review XP reward');
 assert.ok(!(await page.evaluate(()=>App.state.finishedLessons.includes(4))),'Review completed original lesson');
 await page.locator('#btn-modal-next').click({timeout:10000});
 await viewIs(page,'review');
 assert.equal(await page.evaluate(()=>App.isReviewMode),false,'Victory modal must return to review');
 // Uscire dal Ripasso preserva la bozza precedente del corso.
 await page.evaluate(()=>App.openLesson(4));
 assert.ok((await page.locator('#code-editor').inputValue()).includes('BOZZA_SOLO_CORSO'));
 assert.equal(await page.evaluate(()=>App.isReviewMode),false);
 await page.evaluate(()=>App.openLesson(1));
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await page.locator('#code-editor').fill('func _ready():\n    print("<img src=x onerror=window.__auditXss=1>")');
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>!App.isValidating);
 assert.equal(await page.evaluate(()=>window.__auditXss||0),0,'XSS executed in validator');
 const feedback=await page.evaluate(()=>({
   state:document.getElementById('exercise-primary-feedback').dataset.state,
   title:document.getElementById('exercise-feedback-title').textContent,
   text:document.getElementById('exercise-feedback-description').textContent
 }));
 const viewportMetrics=await page.evaluate(()=>({
   scrollX:window.scrollX,
   scrollLeft:document.documentElement.scrollLeft,
   visualOffsetLeft:window.visualViewport?.offsetLeft,
   bodyScrollWidth:document.body.scrollWidth,
   rootScrollWidth:document.documentElement.scrollWidth,
   innerWidth:window.innerWidth,
   codePanelLeft:document.querySelector('#view-exercise .panel-code').getBoundingClientRect().left,
   workspaceLeft:document.getElementById('exercise-workspace-grid').getBoundingClientRect().left,
   editorWidth:document.getElementById('code-editor').getBoundingClientRect().width,
   editorScrollLeft:document.getElementById('code-editor').scrollLeft
 }));
 console.log('AFTER_ERROR_GEOMETRY '+width+'px '+JSON.stringify(viewportMetrics));
 assert.equal(viewportMetrics.scrollX,0,'Root must not scroll horizontally');
 assert.ok(viewportMetrics.codePanelLeft>=0,'Exercise workspace must not pan left after long output');
 if(width<=820){
   const ancestors=await page.evaluate(()=>{
     const items=[];
     let el=document.getElementById('code-editor');
     while(el && items.length<15){
       const st=getComputedStyle(el);
       items.push({tag:el.tagName,id:el.id,cls:String(el.className).slice(0,55),scrollLeft:el.scrollLeft,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,overflowX:st.overflowX,rectLeft:Math.round(el.getBoundingClientRect().left)});
       el=el.parentElement;
     }
     return items;
   });
   console.log('SCROLL_ANCESTORS '+JSON.stringify(ancestors));
 }
 assert.equal(feedback.state,'error','Failed verification must show the error on top of dock');
 assert.ok(feedback.text.length>0,'Error summary must be present');
 if(process.env.E2E_SCREENSHOTS==='1'){
   await page.screenshot({path:path.join(root,'test-artifacts','exercise-'+width+'-error.png'),fullPage:false});
 }
 assert.equal(await page.locator('#test-results-view img').count(),0,'HTML created from user output');
 assert.equal(await page.locator('#gdscript-highlight img').count(),0,'Syntax highlighter must escape markup');
 assert.ok(await page.locator('#gdscript-highlight .gd-token-string').count()>0,'String literal has a visible syntax token');
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>!!window.App&&App.state.finishedLessons.includes(1));
 assert.ok(await page.evaluate(()=>App.state.xp>0),'Progress lost on reload');
 const backup=await page.evaluate(()=>{
   const payload=AuthManager.createBackupPayload(JSON.parse(localStorage.getItem('gdscript_hero_save_v4')));
   const restored=AuthManager.parseBackupString(JSON.stringify(payload));
   const altered=structuredClone(payload);altered.data.xp=99999;
   let denied=false;try{AuthManager.parseBackupString(JSON.stringify(altered));}catch(e){denied=true;}
   return {arena:!!restored.data.arenaProject,sandbox:!!restored.data.sandbox,review:!!restored.data.reviewProgress,denied};
 });
 assert.ok(backup.arena&&backup.sandbox&&backup.review&&backup.denied,'Incomplete backup or integrity failure');

 // Regression: un caricamento, la navigazione o un import cloud non devono
 // mai produrre una notifica di passaggio livello senza XP guadagnati.
 await page.evaluate(()=>{
   const stored=JSON.parse(localStorage.getItem('gdscript_hero_save_v4')||'{}');
   stored.xp=1259; // Un XP sotto la soglia del livello 10.
   stored.unlockedAchievements=ACHIEVEMENTS_DATA.map(a=>a.id);
   localStorage.setItem('gdscript_hero_save_v4',JSON.stringify(stored));
   sessionStorage.removeItem('gdscript_hero_position_v1');
 });
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>App.state.level===9);
 assert.notEqual(await page.locator('#achievement-toast').getAttribute('data-kind'),'level',
   'Reload must not celebrate an existing XP level');
 await page.evaluate(()=>{App.showStatsView();App.openProjectsView();App.updateStatsUI();});
 assert.notEqual(await page.locator('#achievement-toast').getAttribute('data-kind'),'level',
   'Changing sections must not trigger a level-up');
 await page.evaluate(()=>{
   App.applyImportedState({xp:1260},false);
 });
 assert.notEqual(await page.locator('#achievement-toast').getAttribute('data-kind'),'level',
   'Cloud/backup hydration must not celebrate XP');
 await page.evaluate(()=>{
   App.state.xp=1259;
   App.updateStatsUI();
   App.state.xp=1260;
   App.updateStatsUI({announceLevelUp:true});
 });
 assert.equal(await page.locator('#achievement-toast').getAttribute('data-kind'),'level',
   'A genuine XP threshold crossing should display the level-up toast');
 assert.equal((await page.locator('#toast-icon svg').count()),1,
   'Level-up toast must show the SVG trophy');
 const toastRect=await page.locator('#achievement-toast').boundingBox();
 assert.ok(toastRect && toastRect.x>=0 && toastRect.x+toastRect.width<=width+1,
   'Toast must fit inside the viewport');
 if(process.env.E2E_SCREENSHOTS==='1'){
   await page.screenshot({path:path.join(root,'test-artifacts','level-toast-'+width+'.png'),fullPage:false});
 }
 await page.evaluate(()=>{
   App.saveStorage();
   document.getElementById('achievement-toast').classList.add('hidden');
   App.openProjectsView();
   App.showStatsView();
   App.updateStatsUI();
 });
 assert.equal(await page.locator('#achievement-toast').isHidden(),true,
   'Navigation should not show another level-up toast');
 await page.reload({waitUntil:'load'});
 await page.waitForFunction(()=>App.state.level===10);
 assert.notEqual(await page.locator('#achievement-toast').getAttribute('data-kind'),'level',
   'Refreshing after a real level-up must not replay the toast');
 assert.deepEqual(errors,[],'Unhandled browser exceptions '+errors.join('; '));
 console.log('PASS: Chrome '+width+'px sections/exercise/XSS/reload/backup');
 await context.close();
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
   browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
   const url='http://127.0.0.1:'+server.address().port;
   for(const width of [1440,390])await smoke(browser,url,width);
   console.log('SUCCESS: desktop and mobile browser smoke completed.');
 } finally {
   if(browser)await browser.close();
   await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error('E2E FAILURE:',e);process.exitCode=1;});
