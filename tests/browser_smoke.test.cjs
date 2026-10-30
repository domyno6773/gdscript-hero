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
     for(const lesson of LESSONS_DATA.filter(l=>!l.isQuiz)){
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
 assert.equal(result.lessonCount,85,'The visual regression must scan all 85 lessons');
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
  const presets=[1920,1800,1781,1780,1728,1680,1600,1545,1512,1470,1440,1366,1280,1200,1180,1100,1060,1024,960,901,900,821,820,768,430,414,390,375,360,320];
  const views=[
    ['roadmap',()=>App.showRoadmap(),'.roadmap-layout-container'],
    ['exercise',()=>App.openLesson(1),'#view-exercise .workspace-grid'],
    ['practice',()=>App.openPracticeView(),'#view-practice .sandbox-workspace-grid'],
    ['projects',()=>App.openProjectsView(),'#view-projects .projects-grid'],
    ['review',()=>App.showReviewView(),'.review-view-inner'],
    ['stats',()=>App.showStatsView(),'.stats-view-inner']
  ];
  // Riproduci le statistiche e l'identità della schermata MacBook: la navbar
  // deve adattarsi anche quando c'è un utente autenticato.
  const navOriginal=await page.evaluate(()=>{
    const ids=['nav-auth-label','nav-profile-name','streak-count'];
    const before=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)?.textContent||'']));
    document.getElementById('nav-auth-label').textContent='Gianluca';
    document.getElementById('nav-profile-name').textContent='Gianluca';
    document.getElementById('streak-count').textContent='0';
    return before;
  });
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
        // Controllare i singoli comandi: in precedenza i tre gruppi erano
        // tecnicamente dentro al viewport, ma i figli uscivano dallo schermo.
        const nav=document.querySelector('.navbar');
        const navEls=[
          '#btn-home','#nav-roadmap-btn','#nav-editor-btn','#nav-practice-btn',
          '#nav-projects-btn','#nav-review-btn','#nav-stats-btn',
          '#btn-open-achievements','#btn-streak-modal',
          '.nav-right .level-pill','#btn-open-auth-nav','#btn-open-profile',
          '#btn-open-settings'
        ].map(s=>document.querySelector('.navbar '+s)).filter(Boolean)
         .filter(el=>getComputedStyle(el).display!=='none'&&el.getClientRects().length);
        const navBoxes=navEls.map(el=>{
          const r=el.getBoundingClientRect();
          return {id:el.id||el.className,left:r.left,right:r.right,width:r.width};
        });
        const navOutside=navBoxes.filter(p=>p.left<-1||p.right>W+1);
        const groups=['.nav-left','.nav-center','.nav-right'].map(s=>nav.querySelector(s))
          .map(el=>el.getBoundingClientRect());
        const collisions=[];
        for(let i=0;i<groups.length-1;i++){
          if(groups[i].right>groups[i+1].left+1)
            collisions.push([i,Math.round(groups[i].right-groups[i+1].left)]);
        }
        return {viewport:W,positions,errors,navBoxes,navOutside,collisions,
          navScrollWidth:nav.scrollWidth,navClientWidth:nav.clientWidth};
      },selector);
      assert.deepEqual(measures.errors,[],
        'Off-screen panel at '+width+'px in '+view+': '+JSON.stringify(measures));
      assert.deepEqual(measures.navOutside,[],
        'Navbar item clipped at '+width+'px in '+view+': '+JSON.stringify(measures));
      assert.deepEqual(measures.collisions,[],
        'Navbar groups overlap at '+width+'px in '+view+': '+JSON.stringify(measures));
      assert.ok(measures.navScrollWidth<=measures.navClientWidth+2,
        'Navbar internally overflows at '+width+'px in '+view+': '+JSON.stringify(measures));
    }
  }
  await page.setViewportSize({width:initialWidth,height:844});
  await page.evaluate(navOriginal=>{
    for(const [id,value] of Object.entries(navOriginal)){
      const el=document.getElementById(id);
      if(el)el.textContent=value;
    }
    App.showRoadmap();
  },navOriginal);
}


async function testAccessibilityKeyboard(page,width){
  const status=await page.evaluate(()=>{
    const ids=['profile-username-input','profile-tag-select','setting-sound-enabled',
      'setting-volume-slider','setting-music-enabled','setting-music-volume-slider','arena-code-editor'];
    const fields=ids.map(id=>{
      const el=document.getElementById(id);
      return {id,hasLabel:!!(el?.labels?.length||el?.getAttribute('aria-label'))};
    });
    const dialogs=[...document.querySelectorAll('.modal-overlay')].map(el=>({
      id:el.id,role:el.getAttribute('role'),modal:el.getAttribute('aria-modal'),
      label:el.getAttribute('aria-labelledby')||el.getAttribute('aria-label')
    }));
    return {fields,dialogs};
  });
  assert.ok(status.fields.every(x=>x.hasLabel),
    'Unlabelled form fields: '+JSON.stringify(status.fields.filter(x=>!x.hasLabel)));
  assert.ok(status.dialogs.length>=12,'Not all dialogs were discovered');
  assert.ok(status.dialogs.every(x=>x.role==='dialog'&&x.modal==='true'&&x.label),
    'Unlabelled dialogs: '+JSON.stringify(status.dialogs.filter(x=>!x.label||x.role!=='dialog')));

  // A click-only navigation DIV must work using Space and restore focus on close.
  const profile=page.locator('#btn-open-profile');
  await profile.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#level-popover').isVisible(),true,'Level panel not keyboard-accessible');
  assert.equal(await profile.getAttribute('aria-expanded'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('#level-popover')!==null),true,
    'Opening level panel should move keyboard focus inside it');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#level-popover').isHidden(),true,'Escape did not close level panel');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'btn-open-profile',
    'Closing level panel must restore focus to its launcher');
  await page.locator('#btn-open-user-menu').click();
  await page.locator('#btn-menu-profile').click();
  assert.equal(await page.locator('#profile-modal').isVisible(),true,'Existing customization must remain accessible');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('#profile-modal')!==null),true,
    'Opening profile dialog should move focus inside it');
  assert.equal(await page.locator('#btn-close-profile').getAttribute('aria-label'),'Chiudi finestra');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#profile-modal').isHidden(),true,'Escape did not close profile');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'btn-open-user-menu',
    'Full profile dialog must restore focus to its visible launcher');
  const streak=page.locator('#btn-streak-modal');
  await streak.focus();await page.keyboard.press('Space');
  assert.equal(await page.locator('#streak-modal').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#streak-modal').isHidden(),true);

  // Tab/Shift+Tab remain inside the active settings dialog.
  await page.locator('#btn-open-settings').click();
  assert.equal(await page.locator('#settings-modal').isVisible(),true);
  await page.locator('#btn-close-settings').focus();
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('#settings-modal')!==null),true,
    'Shift+Tab escaped the dialog');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#settings-modal').isHidden(),true);

  // The native dialog supports keyboard search, creation and cancellation.
  await page.evaluate(()=>App.openPracticeView());
  if(await page.locator('#modal-sandbox-welcome').isVisible())await page.locator('#btn-close-sandbox-welcome').click();
  await page.locator('#btn-sandbox-add-node').click();
  const picker=page.locator('dialog.scene-create-dialog');
  assert.equal(await picker.isVisible(),true);
  await page.locator('.scene-node-search').fill('CollisionShape2D');
  assert.equal(await picker.locator('.scene-type-list button').count(),1);
  await page.locator('.scene-node-search').fill('');
  await page.keyboard.press('Escape');
  await picker.waitFor({state:'detached'});

  // The active section and exercise split-tab are announced to screen readers.
  await page.evaluate(()=>App.openLesson(1));
  assert.equal(await page.locator('#nav-roadmap-btn').getAttribute('aria-current'),'page');
  assert.equal(await page.locator('#mob-nav-roadmap').getAttribute('aria-current'),'page');
  await page.evaluate(()=>App.setMobileExerciseTab('code',false));
  assert.equal(await page.locator('#btn-tab-code').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('#btn-tab-instructions').getAttribute('aria-pressed'),'false');
  if(width<=820){
    const panels=await page.evaluate(()=>({
      theory:getComputedStyle(document.querySelector('#view-exercise .panel-lesson')).display,
      code:getComputedStyle(document.querySelector('#view-exercise .panel-code')).display
    }));
    assert.equal(panels.theory,'none','Su mobile la consegna deve scomparire quando selezioni Codice');
    assert.notEqual(panels.code,'none','Su mobile il pannello Codice deve diventare visibile');
  }
  await page.evaluate(()=>App.setMobileExerciseTab('instructions',false));
  assert.equal(await page.locator('#btn-tab-instructions').getAttribute('aria-pressed'),'true');
  if(width<=820){
    const panels=await page.evaluate(()=>({
      theory:getComputedStyle(document.querySelector('#view-exercise .panel-lesson')).display,
      code:getComputedStyle(document.querySelector('#view-exercise .panel-code')).display
    }));
    assert.notEqual(panels.theory,'none','La consegna deve ricomparire');
    assert.equal(panels.code,'none','Il pannello Codice deve nascondersi nella scheda Consegna');
  }
  // Entrambe le modalità di chiusura devono funzionare per entrambe le introduzioni.
  for(const [key,card,buttons] of [
    ['seen_intro_viewport2d','intro-card-viewport2d',['btn-close-intro-viewport2d','btn-dismiss-intro-viewport2d']],
    ['seen_intro_nodetree','intro-card-nodetree',['btn-close-intro-nodetree','btn-dismiss-intro-nodetree']]
  ]){
    for(const button of buttons){
      const state=await page.evaluate(({key,card,button})=>{
        localStorage.removeItem(key);
        App.state.manualToolsOverride='visible';
        App.openLesson(50);
        const before=!document.getElementById(card).classList.contains('hidden');
        document.getElementById(button).click();
        const after=document.getElementById(card).classList.contains('hidden');
        return {before,after,saved:localStorage.getItem(key)};
      },{key,card,button});
      assert.ok(state.before&&state.after&&state.saved==='true',
        'Introduzione non chiudibile con '+button+': '+JSON.stringify(state));
    }
  }
  await page.evaluate(()=>{App.state.manualToolsOverride=null;App.openLesson(1);});
  await page.evaluate(()=>App.showRoadmap());
  assert.equal(await page.locator('#nav-roadmap-btn').getAttribute('aria-current'),'page');
  assert.equal(await page.locator('#nav-editor-btn').getAttribute('aria-current'),null);

  await page.emulateMedia({reducedMotion:'reduce'});
  const motion=await page.evaluate(()=>{
    const el=document.createElement('div');
    el.style.animation='gdh-fake-motion 2s infinite';
    el.style.transition='opacity 2s';
    document.body.append(el);
    const value={animation:getComputedStyle(el).animationDuration,
      transition:getComputedStyle(el).transitionDuration};
    el.remove();return value;
  });
  assert.ok(parseFloat(motion.animation)<0.01&&parseFloat(motion.transition)<0.01,
    'Reduced motion is not honored: '+JSON.stringify(motion));
  await page.emulateMedia({reducedMotion:'no-preference'});
  console.log('PASS: keyboard, dialogs, field labels, node picker, reduced motion '+width+'px');
}


async function testNonBlockingCloudConflict(page){
  // Contratto UX: esiste sempre una terza scelta, "Non ora".
  // E' possibile continuare e gestire il conflitto in Impostazioni.
  await page.evaluate(()=>{
    AuthManager.currentUser={id:'test-ux-user',isGuest:false,
      email:'test@example.invalid'};
    AuthManager._cloudVersion={userId:'test-ux-user',revision:5,
      blocked:true,remote:{userCode:{1:'print("cloud")'}}};
    AuthManager.setSyncStatus('conflict','Differenze cloud');
  });
  assert.equal(await page.locator('#gdh-save-notice').isVisible(),true,
    'First conflict should be actionable');
  assert.equal(await page.locator('#gdh-save-dismiss').isVisible(),true,
    'User needs a way to continue without merging or exporting');
  await page.locator('#gdh-save-dismiss').click();
  assert.equal(await page.locator('#gdh-save-notice').isHidden(),true,
    'Not now must dismiss the banner');
  const snapshot=await page.evaluate(()=>({
    blocked:AuthManager._cloudVersion.blocked,
    revision:AuthManager._cloudVersion.revision,
    dismissed:AuthManager.isConflictDismissed(),
    local:AuthManager.getSyncStatus().kind
  }));
  assert.equal(snapshot.blocked,true);
  assert.equal(snapshot.dismissed,true);
  assert.equal(snapshot.local,'conflict');
  await page.locator('#btn-open-settings').click();
  assert.equal(await page.locator('#settings-sync-conflict-row').isVisible(),true,
    'Dismissed conflict must remain manageable in Settings');
  await page.locator('#btn-settings-manage-conflict').click();
  assert.equal(await page.locator('#gdh-save-notice').isVisible(),true,
    'Settings should reopen conflict options');
  await page.locator('#gdh-save-dismiss').click();
  const saved=await page.evaluate(()=>
    localStorage.getItem('gdscript_hero_conflict_dismissed_v1:test-ux-user'));
  assert.equal(saved,'5');
  await page.evaluate(()=>{
    AuthManager._cloudVersion=null;
    AuthManager.currentUser=AuthManager.createGuestUser();
    AuthManager.setSyncStatus('idle','');
  });
}

async function testSubtleMotion(page, initialWidth) {
  // The Sandbox welcomes first-time visitors with its own modal. Disable
  // that onboarding for this navigation-only test so it never obscures the
  // Settings dialog; onboarding itself is covered in the browser smoke suite.
  await page.evaluate(()=>localStorage.setItem('sandbox_welcome_seen','true'));
  // Use computed animation properties rather than screenshots or wall-clock guesses.
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>App.showRoadmap());
  await page.evaluate(()=>App.openPracticeView());
  let motion=await page.evaluate(()=>{
    const practice=document.getElementById('view-practice');
    const road=document.getElementById('view-roadmap');
    const style=getComputedStyle(practice);
    return {active:practice.classList.contains('gdh-view-enter'),
      name:style.animationName,duration:parseFloat(style.animationDuration),
      roadmapHidden:road.classList.contains('hidden')};
  });
  assert.equal(motion.active,true,'New section should receive a one-time motion marker');
  assert.equal(motion.name,'gdh-view-appear');
  assert.ok(motion.duration>0&&motion.duration<=.25,
    'Section transition should be subtle and brief: '+JSON.stringify(motion));
  assert.equal(motion.roadmapHidden,true);

  // Returning to the same section should not restart its animation.
  await page.waitForTimeout(225);
  const before=await page.evaluate(()=>({
    starts:0,
    current:document.getElementById('view-practice').getAnimations().length
  }));
  await page.evaluate(()=>App.openPracticeView());
  const after=await page.evaluate(()=>({
    current:document.getElementById('view-practice').getAnimations().length,
    markers:[...document.querySelectorAll('.view-container.gdh-view-enter')].map(e=>e.id)
  }));
  assert.equal(after.current,before.current,
    'Re-opening current section must not restart its animation');
  assert.deepEqual(after.markers,['view-practice']);
  await page.evaluate(()=>App.showRoadmap());
  assert.equal(await page.locator('#view-practice.gdh-view-enter').count(),0,
    'Hidden views must not retain active motion markers');

  await page.evaluate(()=>App.openSettingsModal());
  const dialog=await page.evaluate(()=>{
    const modal=document.getElementById('settings-modal');
    const card=modal.querySelector('.settings-modal-card');
    const backdrop=getComputedStyle(modal),panel=getComputedStyle(card);
    return {backdrop:backdrop.animationName,card:panel.animationName,
      duration:parseFloat(panel.animationDuration),
      modalVisible:!modal.classList.contains('hidden')};
  });
  assert.equal(dialog.backdrop,'gdh-dialog-backdrop');
  assert.equal(dialog.card,'gdh-dialog-card');
  assert.ok(dialog.duration>0&&dialog.duration<=.25);
  assert.equal(dialog.modalVisible,true);
  await page.locator('#btn-close-settings').click();
  assert.equal(await page.locator('#settings-modal').isHidden(),true);

  // Reduced-motion preference must disable the whole effect, not only
  // shorten animation durations on keyframes.
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>{App.openPracticeView();App.openSettingsModal();});
  const reduced=await page.evaluate(()=>({
    section:getComputedStyle(document.getElementById('view-practice')).animationName,
    modal:getComputedStyle(document.getElementById('settings-modal')).animationName,
    card:getComputedStyle(document.querySelector('#settings-modal .settings-modal-card')).animationName,
    transform:getComputedStyle(document.querySelector('#settings-modal .settings-modal-card')).transform
  }));
  assert.equal(reduced.section,'none','Reduced motion must disable view entrance');
  assert.equal(reduced.modal,'none','Reduced motion must disable backdrop entrance');
  assert.equal(reduced.card,'none','Reduced motion must disable dialog entrance');
  assert.equal(reduced.transform,'none');
  await page.locator('#btn-close-settings').click();
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>App.showRoadmap());
  await page.setViewportSize({width:initialWidth,height:844});
  console.log('PASS: subtle navigation/dialog animations and reduced-motion accessibility');
}

async function testSettingsModalRefresh(page, initialWidth) {
 const widths=[1440,1024,820,640,600,430,390,320];
 const iconAudit=await page.evaluate(()=>{
   const modal=document.getElementById('settings-modal');
   const icons=[...modal.querySelectorAll('svg.settings-icon use')];
   const unresolved=icons.map(icon=>icon.getAttribute('href'))
     .filter(href=>!href?.startsWith('#')||!document.querySelector(href));
   const emojis=[...modal.textContent].filter(ch=>/\p{Extended_Pictographic}/u.test(ch));
   return {count:icons.length,unresolved,emojis};
 });
 assert.ok(iconAudit.count>=16,'Not enough settings SVG icons: '+JSON.stringify(iconAudit));
 assert.deepEqual(iconAudit.unresolved,[],'Settings SVG sprite symbols not found');
 assert.deepEqual(iconAudit.emojis,[],'Settings still contain emoji');
 await page.evaluate(()=>{
   // The dashboard only exists for admins, but geometry must be safe for them.
   document.getElementById('admin-settings-row').classList.remove('hidden');
   App.openSettingsModal();
   document.getElementById('admin-settings-row').classList.remove('hidden');
 });
 // Stats and reset must have the same neutral button surface as export/import.
 // Only their icons should indicate admin access vs. destructive action.
 const actionStyles=await page.evaluate(async()=>{
   const root=document.documentElement,body=document.body;
   const before=[root.getAttribute('data-theme'),body.getAttribute('data-theme')];
   const read=()=>{
     const button=id=>document.getElementById(id);
     const attrs=el=>{
       const style=getComputedStyle(el);
       const rect=el.getBoundingClientRect();
       return {background:style.backgroundColor,border:style.borderColor,color:style.color,
         fontSize:style.fontSize,fontWeight:style.fontWeight,radius:style.borderRadius,
         height:rect.height,icon:getComputedStyle(el.querySelector('svg.settings-icon')).color};
     };
     return {normal:attrs(button('btn-settings-export')),
       admin:attrs(button('btn-settings-open-admin')),
       reset:attrs(button('btn-start-reset'))};
   };
   const themes={};
   for(const theme of ['dark','light']){
     root.setAttribute('data-theme',theme);
     body.setAttribute('data-theme',theme);
     // The modal has its own entrance animation; browser frames can
     // delay the start of the button's color transition. Compare only after
     // all three buttons actually reach matching final colors.
     const finished=()=>{
       const sample=read();
       return ['admin','reset'].every(name=>
         ['background','border','color'].every(key=>
           sample[name][key]===sample.normal[key]));
     };
     const until=performance.now()+1200;
     while(!finished() && performance.now()<until)
       await new Promise(resolve=>setTimeout(resolve,30));
     themes[theme]=read();
   }
   if(before[0]===null)root.removeAttribute('data-theme');
   else root.setAttribute('data-theme',before[0]);
   if(before[1]===null)body.removeAttribute('data-theme');
   else body.setAttribute('data-theme',before[1]);
   return themes;
 });
 for(const [theme,buttons] of Object.entries(actionStyles)){
   for(const name of ['admin','reset']){
     for(const key of ['background','border','color','fontSize','fontWeight','radius']){
       assert.equal(buttons[name][key],buttons.normal[key],
         'Settings '+name+' has outdated '+key+' in '+theme+': '+JSON.stringify(buttons));
     }
     assert.ok(Math.abs(buttons[name].height-buttons.normal.height)<=2,
       'Settings '+name+' sizing differs from normal actions: '+JSON.stringify(buttons));
   }
   assert.notEqual(buttons.admin.icon,buttons.reset.icon,
     'Admin and reset actions need distinct, restrained icon colors');
 }
 for(const width of widths){
   await page.setViewportSize({width,height:480});
   const geometry=await page.evaluate(()=>{
     const modal=document.getElementById('settings-modal');
     const card=modal.querySelector('.modal-card');
     const close=document.getElementById('btn-close-settings');
     const header=modal.querySelector('.modal-header-row');
     const admin=document.getElementById('admin-settings-row');
     const danger=modal.querySelector('.danger-group');
     const regular=modal.querySelector('.settings-group:not(.danger-group)');
     const children=[...modal.querySelectorAll('.settings-row:not(.hidden) > button')];
     const bounds=node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width};};
     return {
       viewport:innerWidth,card:bounds(card),close:bounds(close),header:bounds(header),
       admin:bounds(admin),buttons:children.map(bounds),
       maxHeight:getComputedStyle(card).maxHeight,
       scrollHeight:card.scrollHeight,clientHeight:card.clientHeight,scrollWidth:card.scrollWidth,clientWidth:card.clientWidth,
       dangerBackground:getComputedStyle(danger).backgroundColor,
       regularBackground:getComputedStyle(regular).backgroundColor,
       dangerGradient:getComputedStyle(danger).backgroundImage
     };
   });
   for(const key of ['card','close','header','admin']){
     const rect=geometry[key];
     assert.ok(rect.left>=-1&&rect.right<=width+1,
       'Settings '+key+' horizontal overflow at '+width+': '+JSON.stringify(geometry));
   }
   assert.ok(geometry.buttons.every(rect=>rect.left>=-1&&rect.right<=width+1),
     'Settings action overflow at '+width+': '+JSON.stringify(geometry));
   assert.ok(geometry.scrollWidth<=geometry.clientWidth+2,
     'Settings modal horizontally scrolls at '+width+': '+JSON.stringify(geometry));
   assert.equal(geometry.dangerBackground,geometry.regularBackground,
     'Danger card still uses the old separate color scheme');
   assert.equal(geometry.dangerGradient,'none',
     'Old gradient still present in settings danger section');
   assert.ok(geometry.close.top>=0&&geometry.close.bottom<=480,
     'Close button must remain in viewport at '+width);
   await page.evaluate(()=>{
     const card=document.querySelector('#settings-modal .modal-card');
     card.scrollTop=card.scrollHeight;
   });
   const closeAfterScroll=await page.locator('#btn-close-settings').boundingBox();
   assert.ok(closeAfterScroll && closeAfterScroll.y>=-1&&closeAfterScroll.y+closeAfterScroll.height<=481,
     'Close button disappeared when scrolling settings at '+width);
   if(process.env.E2E_SCREENSHOTS==='1'&&[1440,390].includes(width)){
     const dir=path.join(root,'test-artifacts');fs.mkdirSync(dir,{recursive:true});
     await page.screenshot({path:path.join(dir,'settings-refresh-admin-'+width+'.png'),fullPage:false});
   }
 }

 // The modal must have natural height on a large screen (even for admins)
 // and scroll only when the available height is genuinely insufficient.
 for(const variant of [
   {width:1440,height:1080,admin:true,expectScroll:false},
   {width:1440,height:1080,admin:false,expectScroll:false},
   {width:1440,height:540,admin:true,expectScroll:true}
 ]){
   await page.setViewportSize({width:variant.width,height:variant.height});
   const result=await page.evaluate(({admin})=>{
     const settings=document.getElementById('settings-modal');
     const card=settings.querySelector('.settings-modal-card');
     document.getElementById('admin-settings-row').classList.toggle('hidden',!admin);
     card.scrollTop=0;
     const style=getComputedStyle(card);
     const close=document.getElementById('btn-close-settings').getBoundingClientRect();
     return {height:card.getBoundingClientRect().height,content:card.scrollHeight,
       client:card.clientHeight,scrollable:card.scrollHeight>card.clientHeight+1,
       overflowY:style.overflowY,gutter:style.scrollbarGutter,
       closeTop:close.top,closeBottom:close.bottom};
   },variant);
   assert.equal(result.gutter,'auto','Modal must not reserve a permanent scrollbar gutter');
   assert.equal(result.scrollable,variant.expectScroll,
     'Incorrect settings scroll behavior at '+variant.height+'px: '+JSON.stringify(result));
   assert.ok(result.closeTop>=0&&result.closeBottom<=variant.height+1,
     'Settings close control must remain in view');
 }
 // All panels share one restrained scrollbar palette, including the light theme.
 const scrollbarTheme=await page.evaluate(()=>{
   const sample=document.querySelector('.view-container');
   const settings=document.querySelector('#settings-modal .settings-modal-card');
   const read=()=>({width:getComputedStyle(sample).scrollbarWidth,
     color:getComputedStyle(sample).scrollbarColor,
     settingsColor:getComputedStyle(settings).scrollbarColor});
   const before=document.body.getAttribute('data-theme');
   document.body.setAttribute('data-theme','dark');
   const dark=read();
   document.body.setAttribute('data-theme','light');
   const light=read();
   if(before===null)document.body.removeAttribute('data-theme');
   else document.body.setAttribute('data-theme',before);
   return {dark,light};
 });
 assert.equal(scrollbarTheme.dark.width,'thin','Custom scrollbars must be thin');
 assert.notEqual(scrollbarTheme.dark.color,scrollbarTheme.light.color,
   'Light mode should use a separate scrollbar color');
 assert.equal(scrollbarTheme.dark.color,scrollbarTheme.dark.settingsColor,
   'Scrollbars must be consistent between page and modal');

 // Clicking inside does NOT dismiss; clicking the backdrop does.
 await page.setViewportSize({width:960,height:650});
 await page.evaluate(()=>{
   document.querySelector('#settings-modal .modal-card').scrollTop=0;
 });
 await page.locator('#settings-modal .settings-group-title').first().click();
 assert.equal(await page.locator('#settings-modal').isVisible(),true,
   'Clicking inside settings incorrectly closed the modal');
 await page.mouse.click(2,2);
 assert.equal(await page.locator('#settings-modal').isHidden(),true,
   'Clicking the settings backdrop should close it');
 await page.evaluate(()=>document.getElementById('admin-settings-row').classList.add('hidden'));
 await page.setViewportSize({width:initialWidth,height:844});
 console.log('PASS: settings SVG icons, danger redesign, dashboard responsive and backdrop dismissal');
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


async function testNavbarProfileAndQuestClaim(page,width) {
  const profile=await page.evaluate(()=>{
    const previous={...App.state.profile};
    App.state.profile={...previous,username:'domyno'};
    App.applyProfileUI();
    App.updateAuthUI({id:'test',provider:'google',name:'Gianluca',email:'test@example.com'});
    const state={
      displayedName:document.getElementById('nav-profile-name').textContent.trim(),
      visibleGoogle:getComputedStyle(document.getElementById('nav-auth-label')).position!=='absolute',
      connected:document.getElementById('btn-open-auth-nav').classList.contains('logged-in'),
      dot:getComputedStyle(document.getElementById('nav-auth-icon')).backgroundColor,
      levelInProfile:!!document.querySelector('#btn-open-profile #level-pill'),
      decorativeMedals:document.querySelectorAll('#level-pill .trophy-icon').length,
      streak:document.getElementById('streak-count').textContent.trim(),
      hasXpPill:!!document.querySelector('.xp-pill')
    };
    App.state.profile=previous;App.applyProfileUI();
    App.updateAuthUI({isGuest:true});
    return state;
  });
  assert.equal(profile.displayedName,'domyno');
  assert.equal(profile.visibleGoogle,false,'Google account name must not duplicate the username');
  assert.equal(profile.connected,true);
  assert.equal(profile.levelInProfile,true);
  assert.equal(profile.decorativeMedals,0);
  assert.ok(profile.streak.includes('/'),'Streak needs a readable weekly goal');
  assert.equal(profile.hasXpPill,false,'No XP slot in navbar');

  // Popup sempre sincronizzato alla progressione esistente.
  await page.locator('#btn-open-profile').click();
  const levelPanel=await page.evaluate(()=>{
    const info=ProgressionV2.levelFromXp(App.state.xp);
    const panel=document.getElementById('level-popover');
    const bar=document.getElementById('level-popover-progress');
    const rect=panel.getBoundingClientRect();
    return {
      open:!panel.classList.contains('hidden'),
      title:document.getElementById('level-popover-title').textContent,
      grade:document.getElementById('level-popover-grade').textContent,
      total:document.getElementById('level-popover-xp').textContent,
      remaining:document.getElementById('level-popover-remaining').textContent,
      progress:bar.getAttribute('aria-valuenow'),
      fill:document.getElementById('level-popover-fill').style.width,
      expected:info,xp:App.state.xp,
      rect:{left:rect.left,right:rect.right},vw:document.documentElement.clientWidth
    };
  });
  assert.equal(levelPanel.open,true);
  assert.equal(levelPanel.title,'Livello '+levelPanel.expected.tier.level);
  assert.equal(levelPanel.grade,levelPanel.expected.tier.title);
  assert.ok(levelPanel.total.includes(String(levelPanel.xp)));
  assert.ok(levelPanel.remaining.includes(String(levelPanel.expected.xpToNext)));
  assert.equal(levelPanel.progress,String(levelPanel.expected.percent));
  assert.equal(levelPanel.fill,levelPanel.expected.percent+'%');
  assert.ok(levelPanel.rect.left>=-1&&levelPanel.rect.right<=levelPanel.vw+1,
    'Level panel must fit viewport at '+width+'px');
  await page.locator('#btn-close-level-popover').click();

  const before=await page.evaluate(()=>{
    const data={
      dailyQuests:JSON.parse(JSON.stringify(App.state.dailyQuests)),
      rewardsV2:JSON.parse(JSON.stringify(App.state.rewardsV2)),
      claimedQuestsCount:App.state.claimedQuestsCount,xp:App.state.xp,
      achievements:App.state.unlockedAchievements.slice()
    };
    // Isoliamo i traguardi: qui verifichiamo solo la ricompensa missione.
    App._testOriginalQuestAchievements=App.checkAchievements;
    App.checkAchievements=()=>{};
    App.state.dailyQuests={date:App.getTodayISO(),
      progress:{daily_exercise:1,review_success:0,study_variety:0},
      claimed:{daily_exercise:false,review_success:false,study_variety:false}};
    const ledger=ProgressionV2.createRewards(0);
    for(let n=0;n<4;n++)ProgressionV2.grantRecurring(ledger,'quests','earlier-'+n,10);
    App.state.rewardsV2=ledger;
    App.renderSidebarDailyQuests();
    return data;
  });
  const ready=await page.locator('#sidebar-btn-quest-daily_exercise').textContent();
  assert.ok(ready.includes('Riscatta'),'A mission above 40 XP must offer the reward');
  await page.evaluate(()=>document.getElementById('sidebar-btn-quest-daily_exercise').click());
  const claimed=await page.evaluate(()=>{
    const element=document.getElementById('sidebar-btn-quest-daily_exercise');
    const payload=JSON.parse(localStorage.getItem(
      App.ownerStorageKey(App._saveOwner||'guest')));
    return {
      claimed:App.state.dailyQuests.claimed.daily_exercise,
      button:element.textContent.trim(),
      buttonReady:element.classList.contains('active'),
      saved:payload.dailyQuests.claimed.daily_exercise,
      duplicate:App.claimQuestReward('daily_exercise'),
      xp:App.state.xp,
      weeklyTotal:App.state.rewardsV2.totals.quests
    };
  });
  assert.equal(claimed.claimed,true);
  assert.equal(claimed.saved,true,'Claimed quest must persist immediately');
  assert.equal(claimed.buttonReady,false,'CTA must disappear after claiming');
  assert.ok(claimed.button.includes('Riscattato'));
  assert.equal(claimed.duplicate,false);
  assert.equal(claimed.xp,before.xp+10,'Daily quest XP should exceed 40');
  assert.equal(claimed.weeklyTotal,50);
  await page.evaluate(before=>{
    App.state.dailyQuests=before.dailyQuests;
    App.state.rewardsV2=before.rewardsV2;
    App.state.claimedQuestsCount=before.claimedQuestsCount;
    App.state.xp=before.xp;
    App.state.unlockedAchievements=before.achievements;
    App.checkAchievements=App._testOriginalQuestAchievements;
    delete App._testOriginalQuestAchievements;
    App.saveStorage({localOnly:true});
    App.updateStatsUI();
    App.updateQuestsBadge();
    App.renderSidebarDailyQuests();
    document.getElementById('achievement-toast')?.classList.add('hidden');
  },before);
}

async function testAudioSettings(page) {
  await page.evaluate(()=>App.openSettingsModal());
  assert.equal(await page.locator('#setting-sound-enabled').isChecked(),true);
  assert.equal(await page.locator('#setting-music-enabled').isChecked(),true);
  assert.equal(await page.locator('#setting-music-volume-slider').inputValue(),'38');
  await page.locator('#music-enabled-setting-row .toggle-switch').click();
  assert.equal(await page.evaluate(()=>SoundFX.musicEnabled),false);
  assert.equal(await page.evaluate(()=>SoundFX.enabled),true,'Disattivare musica non deve disattivare SFX');
  await page.locator('#setting-music-volume-slider').evaluate(el=>{el.value='67';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.evaluate(()=>SoundFX.musicVolume),0.67);
  assert.equal((await page.locator('#music-volume-percent-label').textContent()).trim(),'67%');
  await page.locator('#setting-sound-enabled').locator('..').click();
  assert.equal(await page.evaluate(()=>SoundFX.enabled),false);
  assert.equal(await page.evaluate(()=>SoundFX.musicEnabled),false);
  await page.locator('#music-enabled-setting-row .toggle-switch').click();
  assert.equal(await page.evaluate(()=>SoundFX.musicEnabled),true);
  assert.equal(await page.evaluate(()=>SoundFX.enabled),false,'Musica non deve abilitare automaticamente SFX');
  const state=await page.evaluate(()=>App.getSavePayload());
  assert.equal(state.musicEnabled,true);
  assert.equal(state.musicVolume,0.67);
  await page.evaluate(()=>{
    SoundFX.setMusicEnabled(false); SoundFX.toggle(true);
    SoundFX.setMusicVolume(.38); SoundFX.setVolume(.65);
    App.saveStorage({localOnly:true});
    App.closeSettingsModal();
  });
}

async function testQuizLearningFlow(page) {
 const previous=await page.evaluate(()=>{
   const snapshot={finished:App.state.finishedLessons.slice(),completed:App.state.completedLessons.slice(),
     xp:App.state.xp,current:App.state.currentLessonId,
     daily:JSON.parse(JSON.stringify(App.state.dailyQuests))};
   App.state.finishedLessons=[1,2];
   App.ensureUnlockedConsistency();
   App.openLesson(201);
   return snapshot;
 });
 assert.equal(await page.locator('#view-quiz').isVisible(),true,'Quiz non raggiungibile dopo due lezioni');
 assert.equal(await page.locator('.gdh-quiz-question').count(),3,'Ogni quiz deve avere tre domande');
 assert.equal(await page.locator('#quiz-question-0 input[type="radio"]').count(),4);
 assert.equal(await page.locator('#quiz-question-1 input[type="checkbox"]').count(),4);
 assert.equal(await page.locator('#quiz-question-2 input[type="radio"]').count(),4,
   'Il completamento codice deve restare una scelta tra quattro opzioni');
 assert.ok((await page.locator('#quiz-question-2 .gdh-quiz-code').textContent()).includes('□□□□'));
 const orders=await page.evaluate(()=>[0,1,2].map(i=>
   [...document.querySelectorAll('#quiz-question-'+i+' input[data-question]')].map(input=>Number(input.value))));
 orders.forEach((order,i)=>assert.deepEqual([...order].sort((a,b)=>a-b),[0,1,2,3],
   'Risposte perse o duplicate nella domanda '+i));
 const permutations=await page.evaluate(()=>({
   identity:GDHQuizEngine.shuffleChoices(4,()=>.999999),
   moved:GDHQuizEngine.shuffleChoices(4,()=>0)
 }));
 assert.deepEqual(permutations.identity,[0,1,2,3]);
 assert.notDeepEqual(permutations.moved,[0,1,2,3],
   'La risposta A deve poter apparire in posizioni diverse');
 await page.locator('#chapter-quiz-form button[type="submit"]').click();
 assert.ok((await page.locator('#quiz-inline-status').textContent()).includes('tutte e tre'),
   'Risposte mancanti devono impedire il completamento');
 // Le posizioni sono casuali, mentre value conserva l'indice originale.
 await page.locator('#quiz-question-0 .gdh-quiz-option:has(input[value="1"])').click();
 await page.locator('#quiz-question-1 .gdh-quiz-option:has(input[value="0"])').click();
 await page.locator('#quiz-question-1 .gdh-quiz-option:has(input[value="2"])').click();
 await page.locator('#quiz-question-2 .gdh-quiz-option:has(input[value="0"])').click();
 await page.locator('#chapter-quiz-form button[type="submit"]').click();
 assert.ok((await page.locator('#quiz-inline-status').textContent()).includes('2 su 3'),
   'Quiz con risposta errata non deve essere superato');
 assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(201)),false);
 await page.locator('#quiz-question-0 .gdh-quiz-option:has(input[value="0"])').click();
 await page.locator('#chapter-quiz-form button[type="submit"]').click();
 assert.ok((await page.locator('#quiz-completion').textContent()).includes('Quiz superato'));
 assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(201)),true);
 assert.equal(await page.evaluate(()=>App.state.completedLessons.includes(3)),true,
   'Quiz superato deve sbloccare il prossimo esercizio');
 const xp=await page.evaluate(()=>App.state.xp);
 await page.evaluate(()=>App.gradeCurrentQuiz());
 assert.equal(await page.evaluate(()=>App.state.xp),xp,'Quiz ripetuto non deve duplicare gli XP');
 await page.evaluate(previous=>{
   App.state.finishedLessons=previous.finished;
   App.state.completedLessons=previous.completed;
   App.state.xp=previous.xp;
   App.state.currentLessonId=previous.current;
   App.state.dailyQuests=previous.daily;
   sessionStorage.removeItem('gdh_chapter_quiz_v1:'+String(App._saveOwner||'guest')+':201');
   App.ensureUnlockedConsistency();
   App.saveStorage({localOnly:true});
   App.showRoadmap();
 },previous);
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
 // Primo ingresso: tour facoltativo, obiettivo non saltabile.
 assert.equal(await page.locator('#site-welcome').isVisible(),true);
 await page.locator('#site-start-tour').click();
 assert.equal(await page.locator('#site-tour').isVisible(),true);
 const tourLength=await page.evaluate(()=>App.siteTourSteps.length);
 assert.equal(tourLength,4);
 for(let n=0;n<tourLength;n++){
   assert.equal((await page.locator('#site-tour-position').textContent()).trim(),(n+1)+' / '+tourLength);
   await page.locator('#site-tour-next').click();
 }
 assert.equal(await page.locator('#site-goal-gate').isVisible(),true);
 await page.reload({waitUntil:'load'});
 assert.equal(await page.locator('#site-goal-gate').isVisible(),true,
   'Reload must not bypass the weekly goal');
 await page.locator('#site-goal-gate [data-goal="concentrato"]').click();
 assert.equal(await page.locator('#site-goal-gate').isHidden(),true);
 assert.equal(await page.evaluate(()=>App.state.streakMode),'concentrato');
 assert.equal(await page.evaluate(()=>App.state.streakGoalSelection.week===App.streakGoalWeekKey()),true);
 assert.equal(await page.evaluate(()=>App.setStreakMode('lockin')),false);
 await page.locator('#btn-close-streak').click();
 await page.reload({waitUntil:'load'});
 assert.equal(await page.locator('#site-welcome').isHidden(),true);
 assert.equal(await page.locator('#site-goal-gate').isHidden(),true);
 await page.waitForFunction(()=>!!window.App&&!!window.LESSONS_DATA&&!document.getElementById('view-roadmap').classList.contains('hidden'));
 assert.equal(await page.evaluate(()=>LESSONS_DATA.length),115);
 assert.equal(await page.evaluate(()=>window.GDHGodot?.engine),'Godot 4.4.1 WebAssembly','Godot must be the default engine');
 // La modale di successo non deve piu' allargarsi a quasi tutto il viewport.
 await page.evaluate(()=>document.getElementById('success-modal').classList.remove('hidden'));
 const compactSuccess=await page.locator('#success-modal > .modal-card').boundingBox();
 assert.ok(compactSuccess && compactSuccess.width<=445 &&
   compactSuccess.width<=width-20,
   'Success dialog too wide: '+JSON.stringify(compactSuccess));
 await page.evaluate(()=>document.getElementById('success-modal').classList.add('hidden'));
 assert.equal(await page.locator('#gdh-native-verify-toggle').count(),0,'No Beta toggle should remain');
 assert.equal(await page.locator('#btn-open-settings svg.ui-icon').count(),1,'Settings button must use SVG icon');
 assert.equal((await page.locator('#btn-open-settings').textContent()).trim(),'','Settings button must not contain emoji text');
 // Errori cloud/locali devono essere spiegati e visibili, senza sparire dopo un toast.
 await page.evaluate(()=>App.renderSyncStatus({kind:'error',message:'Test connessione assente'}));
 assert.equal(await page.locator('#gdh-save-notice').isVisible(),true,'Missing persistent offline notice');
 assert.ok((await page.locator('#gdh-save-notice').textContent()).includes('Test connessione assente'));
 assert.equal(await page.locator('#gdh-save-retry').isVisible(),true);
 await page.evaluate(()=>App.renderSyncStatus({kind:'conflict',message:'Versioni differenti'}));
 assert.equal(await page.locator('#gdh-save-notice').isHidden(),true,
   'No mandatory conflict alert without an actual blocked cloud state');
 await page.evaluate(()=>App.renderLocalSaveError(true));
 assert.equal(await page.locator('#gdh-save-backup').isVisible(),true,'Missing local save failure backup');
 await page.evaluate(()=>{
   App.renderLocalSaveError(false);
   App.renderSyncStatus({kind:'synced',message:''});
 });
 assert.equal(await page.locator('#gdh-save-notice').isHidden(),true);
 await testNavbarProfileAndQuestClaim(page,width);
 await testAudioSettings(page);
 await testQuizLearningFlow(page);
 await testAccessibilityKeyboard(page,width);
 await testNonBlockingCloudConflict(page);
 await testLongEmailSettings(page,width);
 await testSettingsModalRefresh(page,width);
 await testSubtleMotion(page,width);
 await testResponsiveLayout(page,width);
 await page.evaluate(()=>localStorage.setItem('sandbox_welcome_seen','true'));
 // L'Arena classificata e i progetti Premium sono in pausa, ma il progetto gratuito resta aperto.
 await page.evaluate(()=>App.openProjectsView());
 assert.equal(await page.locator('.gdh-arena-coming-soon').count(),0,'The paused competitive Arena has no catalog card');
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
 assert.match(questPaint.state,/Riscattato|Completata/);

 // Measure the final layout, after the roadmap's entrance transform settles.
 await page.locator('#view-roadmap').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished.catch(()=>{}))));
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
 assert.ok(reviewCalloutStyle.dark.primary.height>=39,JSON.stringify(reviewCalloutStyle));
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
   if(section==='stats')await page.locator('#btn-open-user-menu').click();
   const selector=section==='stats'?'#nav-stats-btn':width<821?'#mob-nav-'+section:'#nav-'+section+'-btn';
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
   ['#btn-sandbox-new-project','#modal-sandbox-new-project','#btn-cancel-sandbox-new']
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
 // Stesso errore reale sia negli esercizi sia nella Sandbox:
 // la guida deve spiegare la parentesi mancante, non dire solo "ricontrolla".
 const missingParenthesis='func _ready():\\n    print("Ciao"'.replace('\\n','\n');
 await page.locator('#scene-stop').click();
 await page.locator('#sandbox-code-editor').fill(missingParenthesis);
 await page.locator('#btn-sandbox-run').click({timeout:10000});
 await page.waitForFunction(()=>
   !!document.querySelector('#sandbox-debug-area .gdh-debug-panel'),null,{timeout:15000});
 const sandboxParenthesis=await page.evaluate(()=>({
   title:document.querySelector('#sandbox-debug-area .gdh-debug-top strong')?.textContent,
   why:document.querySelector('#sandbox-debug-area .gdh-debug-explanation')?.textContent,
   hint:document.querySelector('#sandbox-debug-area .gdh-debug-hint')?.textContent,
   raw:document.querySelector('#sandbox-console-output')?.textContent,
   category:document.querySelector('#sandbox-debug-area .gdh-debug-panel')?.dataset.category,
   line:document.querySelector('#sandbox-debug-area .gdh-debug-jump')?.textContent
 }));
 assert.match([sandboxParenthesis.title,sandboxParenthesis.why,
   sandboxParenthesis.hint].join(' '),/parentes/i,
   'Sandbox must explain an unclosed print parenthesis: '+JSON.stringify(sandboxParenthesis));
 assert.equal(sandboxParenthesis.category,'syntax',
   'Sandbox must classify missing parenthesis as syntax: '+JSON.stringify(sandboxParenthesis));
 // Caso frequente nella Sandbox libera: print scritto a livello radice.
 // Godot può segnalare prima la posizione della chiamata e non la parentesi.
 await page.locator('#sandbox-code-editor').fill('print("Ciao"');
 await page.locator('#btn-sandbox-run').click({timeout:10000});
 await page.waitForFunction(()=>
   !!document.querySelector('#sandbox-debug-area .gdh-debug-panel'),null,{timeout:15000});
 const bareParenthesis=await page.evaluate(()=>({
   title:document.querySelector('#sandbox-debug-area .gdh-debug-top strong')?.textContent,
   why:document.querySelector('#sandbox-debug-area .gdh-debug-explanation')?.textContent,
   hint:document.querySelector('#sandbox-debug-area .gdh-debug-hint')?.textContent,
   technical:document.querySelector('#sandbox-debug-area .gdh-debug-technical pre')?.textContent,
   console:document.querySelector('#sandbox-console-output')?.textContent,
   category:document.querySelector('#sandbox-debug-area .gdh-debug-panel')?.dataset.category
 }));
 assert.match([bareParenthesis.title,bareParenthesis.why,bareParenthesis.hint].join(' '),/parentes/i,
   'Sandbox root-level print with missing parenthesis needs specific guidance: '+
     JSON.stringify(bareParenthesis));
 // Sandbox: aggiungi i nodi come farebbe un utente con un nuovo progetto vuoto.
 await page.evaluate(()=>{
   App.addSandboxNode('Label','Label','In attesa');
   App.addSandboxNode('Button','Button','Clicca');
 });
 // Sandbox: figli effettivamente istanziati, proprietà native e click persistenti.
 const sampleCode='extends Node2D\nvar clicks = 0\nfunc _ready():\n    $Label.text = "Nativo pronto"\n    print("SANDBOX_NODES_READY")\n    $Button.pressed.connect(_on_button_pressed)\nfunc _on_button_pressed():\n    clicks += 1\n    $Label.text = "Click " + str(clicks)\n    print("SANDBOX_CLICK " + str(clicks))';
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
 const sceneStart=await page.evaluate(()=>({
   native:!!App.sandboxNativeSession,
   projectLabel:App.getActiveSandboxProject().nodes.find(x=>x.name==='Label')?.text
 }));
 assert.ok(sceneStart.native,'Godot persistent session missing');
 assert.equal(await page.locator('#gdh-native-runner').isVisible(),true,'Native canvas host is visible');
 for(let click=1;click<=2;click++){
   const result=await page.evaluate(()=>GDHGodot.sandboxAction('Button'));
   assert.ok(result.success);
   assert.equal(result.native.scene.Label.text,'Click '+click,'Native signal did not retain state');
 }
 assert.equal(await page.evaluate(()=>App.getActiveSandboxProject().nodes.find(x=>x.name==='Label').text),
   sceneStart.projectLabel,'Runtime properties must not overwrite saved scene definition');
 await page.locator('#scene-stop').click();
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
   if(App.state.lessonTaskProgress?.[1])
     delete App.state.lessonTaskProgress[1].codes.base;
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
     feedbackHidden:document.getElementById('exercise-primary-feedback').classList.contains('hidden'),
     testsHidden:document.getElementById('exercise-test-details').hidden,
     viewportHidden:getComputedStyle(viewport).display==='none',
     dockBottom:el('exercise-validation-panel').bottom,
     buttonTop:el('btn-run-code').top,
     expectedShown:getComputedStyle(document.getElementById('expected-output-pre')).display!=='none'
   };
 });
 assert.ok(initialGeometry.feedbackHidden&&initialGeometry.testsHidden,'Feedback and test results must stay hidden until verification');
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
 await page.waitForFunction(()=>!App.isValidating &&
   !document.getElementById('success-modal').classList.contains('hidden'),null,{timeout:20000});
 assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(1)),false,
   'Non assegnare XP dopo il primo dei quattro compiti');
 assert.equal(await page.locator('#lesson-practice-progress').evaluate(el=>!el.classList.contains('hidden')),true,
   'Il contatore dei quattro compiti deve essere attivo anche nella scheda Codice');
 for(let index=1;index<4;index++){
   await page.locator('#btn-modal-next').click();
   const nextTask=await page.evaluate(()=>({
     task:LessonPractice.tasksFor(LESSONS_DATA.find(l=>l.id===1))[App.currentPracticeTaskIndex],
     index:App.currentPracticeTaskIndex
   }));
   assert.equal(nextTask.index,index,'Avanzamento compiti non corretto');
   if(width<=820)await page.locator('#btn-tab-code').click();
   await page.locator('#code-editor').fill(nextTask.task.solution);
   await page.locator('#btn-run-code').click();
   await page.waitForFunction(()=>!App.isValidating &&
     !document.getElementById('success-modal').classList.contains('hidden'),null,{timeout:20000});
 }
 assert.equal(await page.evaluate(()=>App.state.finishedLessons.includes(1)),true,
   'La lezione si conclude solo dopo il quarto compito');
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
   App.state.lessonTaskProgress[4]={
     completed:['p1','p2','p3'],
     codes:{base:'func _ready():\\n    print("BOZZA_SOLO_CORSO")'},
     activeIndex:3
   };
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
   // Il vecchio mirror non deve prevalere sul salvataggio associato al proprietario.
   localStorage.setItem('gdscript_hero_save_v4',JSON.stringify({...stored,xp:1}));
   localStorage.setItem(App.ownerStorageKey(App._saveOwner),JSON.stringify(stored));
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
