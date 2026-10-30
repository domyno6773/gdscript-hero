'use strict';
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const {w}=require('./helpers/load_course.cjs')();
const solution=require('./helpers/capstone_solution.cjs')(w.GDHCourseCapstone.starter);
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.wasm':'application/wasm','.pck':'application/octet-stream','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,(req.url||'/').split('?')[0].replace(/^\//,'')||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*'}).end(data);});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  for(const width of [1280,390]){
   const context=await browser.newContext({viewport:{width,height:844}}),page=await context.newPage();
   page.setDefaultTimeout(90000);
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.route(/^https:\/\//,r=>r.abort());
   const url='http://127.0.0.1:'+server.address().port;
   await page.goto(url);
   await page.waitForFunction(()=>window.App&&window.GDHCourseCapstoneVerifier&&window.GDHGodot);
   const before=await page.evaluate(()=>{
    App.createSandboxProject('Bozza da conservare');
    App.getActiveSandboxProject().code='extends Node2D\n# La mia bozza\n';App.saveStorage();
    const saved=JSON.stringify(App.state.sandbox.projects);
    App.openLesson(48);
    for(const el of document.querySelectorAll('#site-welcome,#site-tour'))el.remove();
    return {saved,count:App.state.sandbox.projects.length,xp:App.state.xp,finished:JSON.stringify(App.state.finishedLessons)};
   });
   await page.locator('#gdh-start-final-project').click();
   const created=await page.evaluate(()=>({project:App.getActiveSandboxProject(),projects:App.state.sandbox.projects}));
   assert.equal(created.projects.length,before.count+1);
   assert.equal(JSON.stringify(created.projects.slice(0,-1)),before.saved);
   assert.match(created.project.code,/TODO A/);
   async function assess(){
    await page.locator('#btn-verify-capstone').click();
    await page.waitForFunction(()=>!document.getElementById('btn-verify-capstone').disabled);
    return page.evaluate(()=>App.getActiveSandboxProject().finalAssessment);
   }
   const starter=await assess();assert.equal(starter.passed,false,'Incomplete starter accepted');
   await page.locator('#sandbox-code-editor').fill(solution);
   const completed=await assess();assert.ok(completed?.passed,JSON.stringify({checks:completed?.checks,error:completed?.error}));
   assert.ok(completed.checks.every(c=>c.passed));
   assert.match(await page.locator('#capstone-assessment-status').textContent(),/Progetto finale verificato/);
   assert.equal(await page.evaluate(()=>App.state.xp),before.xp);
   assert.equal(await page.evaluate(()=>JSON.stringify(App.state.finishedLessons)),before.finished);
   await page.reload();await page.waitForFunction(()=>window.App&&window.GDHCourseCapstoneVerifier);
   await page.evaluate(()=>{App.openPracticeView();for(const el of document.querySelectorAll('#site-welcome,#site-tour'))el.remove();});
   assert.match(await page.locator('#capstone-assessment-status').textContent(),/Progetto finale verificato/);
   await page.locator('#sandbox-code-editor').fill(solution+'\n# cambiato');
   assert.match(await page.locator('#capstone-assessment-status').textContent(),/verifica di nuovo/);
   await page.locator('#sandbox-code-editor').fill(solution);
   assert.match(await page.locator('#capstone-assessment-status').textContent(),/Progetto finale verificato/);
   await page.evaluate(()=>{App.getActiveSandboxProject().nodes[1].position.x=80;App.renderSandboxSceneDock();});
   assert.match(await page.locator('#capstone-assessment-status').textContent(),/verifica di nuovo/);
   await page.evaluate(()=>{App.getActiveSandboxProject().nodes[1].position.x=60;App.renderSandboxSceneDock();});
   if(width===1280){
    const negatives=[
     ['missing movement',solution.replace('$Player.move_and_slide()','pass')],
     ['no physical collection',solution.replace('$Coin.body_entered.connect(_raccogli)','pass')],
     ['no inventory method',solution.replace('oggetti.append(nome)','pass')],
     ['no custom signal listener',solution.replace('tesoro_raccolto.connect(_aggiorna_hud)','pass')],
     ['no removal',solution.replace('$Coin.queue_free()','pass')],
     ['negative HP',solution.replace('        boss["hp"] = 0','        pass')],
     ['premature victory',solution.replace('monete > 0 and boss["hp"] == 0','boss["hp"] == 0')],
     ['hardcoded startup reward',solution.replace('_aggiorna_hud(monete)','monete = 1\n    zaino.aggiungi("Moneta")\n    _aggiorna_hud(monete)')],
     ['syntax error','extends Node2D\nfunc broken(:\n']
    ];
    for(const [name,code] of negatives){
     const result=await page.evaluate(code=>GDHCourseCapstoneVerifier.verify(code,GDHCourseCapstone.nodes),code);
     assert.equal(result.passed,false,'Accepted '+name);console.log('REJECTED '+name);
    }
    const alt=solution.replaceAll('_raccogli','prendi_tesoro').replace('monete += 1','monete = monete + 1');
    const accepted=await page.evaluate(code=>GDHCourseCapstoneVerifier.verify(code,GDHCourseCapstone.nodes),alt);
    assert.ok(accepted.passed,'Alternative solution rejected: '+JSON.stringify(accepted));
    const legacy=await page.evaluate(code=>{
     const nodes=JSON.parse(JSON.stringify(GDHCourseCapstone.nodes));nodes.find(n=>n.name==='AttaccaBtn').name='UsaPozione';
     return GDHCourseCapstoneVerifier.verify(code.replaceAll('AttaccaBtn','UsaPozione'),nodes);
    },solution);assert.ok(legacy.passed,'Saved v1 project incompatible: '+JSON.stringify(legacy));
    const failed=await page.evaluate(()=>GDHCourseCapstoneVerifier.verify('',GDHCourseCapstone.nodes,async()=>{throw Error('Unavailable');}));
    assert.equal(failed.passed,false);assert.equal(failed.error,'Unavailable');
    const noShape=await page.evaluate(code=>GDHCourseCapstoneVerifier.verify(code,GDHCourseCapstone.nodes.filter(n=>n.name!=='CoinShape')),solution);
    assert.equal(noShape.passed,false,'Collection accepted without a collision shape');
    await page.locator('#btn-verify-capstone').click();
    await page.locator('#sandbox-code-editor').fill(solution+'\n# cambiato durante la prova');
    await page.waitForFunction(()=>!document.getElementById('btn-verify-capstone').disabled);
    assert.match(await page.locator('#capstone-assessment-status').textContent(),/cambiato durante la verifica/);
   }
   await page.evaluate(()=>App.createSandboxProject('Progetto libero'));
   assert.equal(await page.locator('#capstone-assessment').isVisible(),false);
   assert.deepEqual(errors,[]);await context.close();
   console.log('PASS capstone '+width+'px: physical collection in two layouts and both orders, saved evidence, invalidation, preserved XP and drafts.');
  }
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
