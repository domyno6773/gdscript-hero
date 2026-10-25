'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const requested=decodeURIComponent((req.url||'/').split('?')[0]);
 const file=path.resolve(root,requested==='/'?'index.html':requested.replace(/^\/+/,''));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,bytes)=>{
  if(error){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8','Cache-Control':'no-store'});res.end(bytes);
 });
});
async function viewIs(page,name){
 const active=await page.evaluate(()=>[...document.querySelectorAll('.view-container:not(.hidden)')].map(e=>e.id));
 assert.deepEqual(active,['view-'+name],'Section '+name+' not active: '+active.join(','));
}
async function smoke(browser,url,width){
 const context=await browser.newContext({viewport:{width,height:844},locale:'it-IT'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 // Avoid external services and real Supabase accounts.
 await page.route(/^https:\/\//,r=>r.abort('blockedbyclient'));
 const response=await page.goto(url,{waitUntil:'load',timeout:30000});
 assert.equal(response.status(),200);
 await page.waitForFunction(()=>!!window.App&&!!window.LESSONS_DATA&&!document.getElementById('view-roadmap').classList.contains('hidden'));
 assert.equal(await page.evaluate(()=>LESSONS_DATA.length),60);
 await page.evaluate(()=>localStorage.setItem('sandbox_welcome_seen','true'));
 for(const section of ['roadmap','practice','projects','review','stats']){
   const selector=width<821?'#mob-nav-'+section:'#nav-'+section+'-btn';
   await page.locator(selector).click({timeout:15000});
   await viewIs(page,section);
 }
 await page.evaluate(()=>App.openLesson(1));
 await viewIs(page,'exercise');
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 const official=await page.evaluate(()=>LESSONS_DATA.find(l=>l.id===1).solution);
 await page.locator('#code-editor').fill(official);
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>App.state.finishedLessons.includes(1));
 assert.ok(await page.evaluate(()=>App.state.xp>0),'Missing XP reward');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('gdscript_hero_save_v4')));
 assert.ok(saved.finishedLessons.includes(1),'Lesson missing from localStorage');
 await page.evaluate(()=>App.openLesson(1));
 if(width<821)await page.locator('#btn-tab-code').click({timeout:10000});
 await page.locator('#code-editor').fill('func _ready():\n    print("<img src=x onerror=window.__auditXss=1>")');
 await page.locator('#btn-run-code').click({timeout:10000});
 await page.waitForFunction(()=>!App.isValidating);
 assert.equal(await page.evaluate(()=>window.__auditXss||0),0,'XSS executed in validator');
 assert.equal(await page.locator('#test-results-view img').count(),0,'HTML created from user output');
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
