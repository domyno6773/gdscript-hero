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
 await page.evaluate(()=>localStorage.setItem('sandbox_welcome_seen','true'));
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
 for(const section of ['roadmap','practice','projects','review','stats']){
   const selector=width<821?'#mob-nav-'+section:'#nav-'+section+'-btn';
   await page.locator(selector).click({timeout:15000});
   await viewIs(page,section);
 }
 // Esecuzione della Sandbox attraverso il pulsante reale, senza chiamate dirette al runtime.
 const sandboxNav=width<821?'#mob-nav-practice':'#nav-practice-btn';
 await page.locator(sandboxNav).click({timeout:15000});
 await viewIs(page,'practice');
 await page.locator('#sandbox-code-editor').fill('extends Node2D\n\nfunc _ready():\n    print("BROWSER_SANDBOX_OK")');
 await page.locator('#btn-sandbox-run').click({timeout:10000});
 try {
   await page.waitForFunction(()=>document.getElementById('sandbox-console-output').textContent.includes('BROWSER_SANDBOX_OK'),null,{timeout:12000});
 } catch(error) {
   const diagnostics=await page.evaluate(()=>({
     sandbox:document.getElementById('sandbox-console-output')?.textContent,
     status:document.getElementById('sandbox-status-tag')?.textContent,
     engine:window.GDHGodot?.engine,
     frame:document.getElementById('gdh-native-runner')?.src,
     scripts:[...document.querySelectorAll('script[src]')].slice(-4).map(x=>x.src)
   }));
   throw new Error('Godot Sandbox smoke diagnostic: '+JSON.stringify({diagnostics,pageErrors:errors,network}));
 }
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
 assert.ok(design.syntaxLayerHeight>0,'Syntax layer must be rendered');
 assert.ok(!design.navbarColor?.includes('0, 229, 255'),'Old neon header must not remain');
 const official=await page.evaluate(()=>LESSONS_DATA.find(l=>l.id===1).solution);
 await page.locator('#code-editor').fill(official);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>App.state.finishedLessons.includes(1));
 assert.ok(await page.evaluate(()=>App.state.xp>0),'Missing XP reward');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gdscript_hero_save_v4')));
 assert.ok(saved.finishedLessons.includes(1),'Lesson missing from localStorage');
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
       starter:v.starterCode,expected:document.getElementById('expected-output-pre').textContent,
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
 // Digitazione, Ripristina e Mostra soluzione agiscono soltanto sulla variante.
 await page.locator('#code-editor').fill('extends Node\\nfunc _ready():\\n    print("SOLO_RIPASSO")');
 assert.ok((await page.evaluate(()=>App.state.userCode[4])).includes('BOZZA_SOLO_CORSO'));
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#btn-reset-code').click({timeout:10000});
 assert.equal(await page.locator('#code-editor').inputValue(),
   await page.evaluate(()=>App.currentReviewVariant.starterCode),'Review reset must use variant starter');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#btn-reveal-solution').click({timeout:10000});
 assert.equal(await page.locator('#code-editor').inputValue(),
   await page.evaluate(()=>App.currentReviewVariant.solution),'Review reveal must use variant solution');
 assert.ok((await page.evaluate(()=>App.state.userCode[4])).includes('BOZZA_SOLO_CORSO'));
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
