'use strict';
const {chromium}=require('playwright');
const {spawn}=require('child_process');
const path=require('path');
const assert=require('assert/strict');
const http=require('http');
const root=path.resolve(__dirname,'..');
const proc=spawn('python3',[path.join(root,'preview','serve_preview.py'),'18769'],{stdio:'ignore'});
const base='http://127.0.0.1:18769';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(){
 for(let i=0;i<100;i++){
   const ok=await new Promise(resolve=>http.get(base+'/lesson-lab.html',res=>{res.resume();resolve(res.statusCode===200)}).on('error',()=>resolve(false)));
   if(ok)return;await sleep(100);
 }
 throw Error('Preview HTTP server unavailable');
}
(async()=>{
 let browser;
 try{
   await wait();
   browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']});
   const page=await browser.newPage({viewport:{width:1280,height:850}});
   await page.goto(base+'/lesson-lab.html',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.__gdhIsolation?.ready===true,null,{timeout:90000});
   assert.equal(await page.locator('#lesson option').count(),60);
   const frame=page.frame({url:/isolated\.html/});
   assert.ok(frame);
   assert.equal(await page.locator('#isolated-runner').getAttribute('sandbox'),'allow-scripts');
   const probe=await frame.evaluate(()=>{try{return window.parent.document.title;}catch(e){return e.name}});
   assert.equal(probe,'SecurityError');
   for(const id of [1,50]){
     await page.selectOption('#lesson',String(id));
     await page.locator('#solution').click();
     await page.locator('#run').click();
     await page.waitForFunction(id=>{
       try{return JSON.parse(document.querySelector('#grade').textContent).id===id;}
       catch{return false;}
     },id,{timeout:30000});
     const g=JSON.parse(await page.locator('#grade').textContent());
     assert.equal(g.passed,true,'Lesson '+id+' failed: '+JSON.stringify(g));
     if(id===50){
       const raw=JSON.parse(await page.locator('#result').textContent());
       assert.equal(raw.scene.Titolo.text,'Benvenuto in Godot 4!');
     }
   }
   console.log('TEMP_PREVIEW_LOCAL_PASS 60 lessons, 1+50 native, opaque sandbox');
 }finally{if(browser)await browser.close();proc.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
