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
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await testSmartIndent(page,'#code-editor');
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
 assert.equal(await page.locator('.gdh-code-guide').evaluate(el=>el.open),true,
   'La sfida 4 deve spiegare automaticamente extends Node al suo primo incontro');
 assert.match(await page.locator('.gdh-code-guide').textContent(),/extends Node/);
 assert.match(await page.locator('.gdh-code-guide').textContent(),/nodo/i);
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
 assert.equal(await page.evaluate(()=>App.state.xp),reviewXpBefore+10,'Incorrect review XP reward');
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
