'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const {chromium, webkit} = require('playwright');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.wasm':'application/wasm','.pck':'application/octet-stream'};
const server = http.createServer((req, res) => {
  const reqPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.resolve(root, reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, ''));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (err, content) => {
    if (err) return res.writeHead(404).end();
    res.writeHead(200, {'Content-Type':(mime[path.extname(file)] || 'application/octet-stream'),'Cache-Control':'no-store'});
    res.end(content);
  });
});
const widths = [2048, 1920, 1915, 1800, 1780, 1728, 1680, 1600, 1545, 1512, 1470, 1440, 1366, 1280, 1200, 1120, 1100, 1024, 960, 900, 821, 820, 390];
async function inspect(engine, url) {
 const browser = await engine.launch(engine.name()==='chromium' ? {headless:true,channel:'chrome',args:['--no-sandbox']} : {headless:true});
 try {
  const context = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2,locale:'it-IT'});
  const page = await context.newPage();
  await page.route(/^https:\/\//,r => r.abort('blockedbyclient'));
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.waitForSelector('.navbar #btn-home');
  await page.evaluate(() => {
    document.getElementById('nav-auth-label').textContent='Gianluca';
    document.getElementById('nav-profile-name').textContent='Gianluca';
    document.getElementById('xp-count').textContent='885';
    document.getElementById('streak-sub-label').textContent='(0/2d)';
  });
  for(const w of widths) {
    await page.setViewportSize({width:w,height:900});
    let baseline=null;
    for(const view of ['view-roadmap', 'view-exercise']) {
      await page.evaluate(name=>{
        document.querySelectorAll('.view-container').forEach(el=>el.classList.toggle('hidden',el.id!==name));
      },view);
      const result=await page.evaluate(()=>{
        const vw=document.documentElement.clientWidth;
        const nav=document.querySelector('.navbar');
        const selectors=[
          '#btn-home','#nav-roadmap-btn','#nav-editor-btn','#nav-practice-btn',
          '#nav-projects-btn','#nav-review-btn','#nav-stats-btn',
          '#btn-open-achievements','#btn-streak-modal','.xp-pill',
          '.nav-right .level-pill','#btn-open-auth-nav','#btn-open-profile',
          '#btn-open-settings'
        ];
        const top=['.nav-left','.nav-center','.nav-right'].map(s=>nav.querySelector(s));
        const rects=top.map(el=>el.getBoundingClientRect());
        const visible=selectors.map(s=>nav.querySelector(s)).filter(el=>el
          && getComputedStyle(el).display!=='none' && el.getClientRects().length)
          .map(el=>{
            const r=el.getBoundingClientRect();
            return {key:el.id||el.className,left:r.left,right:r.right,top:r.top,width:r.width};
          });
        const clipped=visible.filter(r=>r.left < -1 || r.right > vw+1);
        const colliding=rects.slice(0,-1).some((r,i)=>r.right>rects[i+1].left+1);
        const stableSelectors=['.navbar','.nav-left','.nav-center','.nav-right',
          '#btn-home','#nav-roadmap-btn','#nav-editor-btn','#nav-practice-btn',
          '#nav-projects-btn','#nav-review-btn','#nav-stats-btn',
          '#btn-open-achievements','.nav-stats-group','#btn-open-auth-nav',
          '#btn-open-profile','#btn-open-settings'];
        const stableLayout=stableSelectors.map(selector=>{
          const el=document.querySelector('.navbar '+selector) ||
            (selector==='.navbar' ? nav : null);
          if(!el)return {selector,missing:true};
          const r=el.getBoundingClientRect(),style=getComputedStyle(el);
          return {selector,x:r.x,y:r.y,width:r.width,height:r.height,
            fontSize:style.fontSize,fontFamily:style.fontFamily,
            padding:style.padding,display:style.display};
        });
        const logo=nav.querySelector('#btn-home').getBoundingClientRect();
        const labels=Array.from(nav.querySelectorAll('.nav-center .nav-btn-text'))
          .map(el=>({text:el.textContent.trim(),display:getComputedStyle(el).display,
            width:el.getBoundingClientRect().width}));
        const items=Array.from(nav.querySelectorAll('.nav-center .nav-btn'))
          .filter(el=>getComputedStyle(el).display!=='none')
          .map(el=>el.getBoundingClientRect());
        const menuOverlap=items.slice(0,-1).some((r,i)=>r.right>items[i+1].left+1);
        const navButtons=[...nav.querySelectorAll('.nav-center .nav-btn')]
          .filter(el=>getComputedStyle(el).display!=='none');
        const labelsClipped=navButtons.filter(el=>{
          const label=el.querySelector('.nav-btn-text');
          if(!label || getComputedStyle(label).display==='none')return false;
          const a=el.getBoundingClientRect(),b=label.getBoundingClientRect();
          return b.left<a.left-1 || b.right>a.right+1;
        }).map(el=>el.id);
        const firstButton=navButtons[0]?.getBoundingClientRect();
        const lastButton=navButtons.at(-1)?.getBoundingClientRect();
        const whitespaceLeft=firstButton ? firstButton.left-rects[0].right : 0;
        const whitespaceRight=lastButton ? rects[2].left-lastButton.right : 0;
        return {vw,clipped,colliding,stableLayout,labels,menuOverlap,labelsClipped,
          whitespaceLeft,whitespaceRight,scrollWidth:nav.scrollWidth,clientWidth:nav.clientWidth,
          logo:{left:logo.left,right:logo.right,width:logo.width},
          right:rects[2].right,groups:rects.map(r=>({left:r.left,right:r.right,width:r.width})),
          scrollX:window.scrollX,navDisplay:getComputedStyle(nav).display};
      });
      const msg=engine.name()+' '+w+'px '+view+' '+JSON.stringify(result);
      // Cruciale: Esercizio non deve cambiare dimensioni e tipografia
      // della navbar, neppure sui telefoni. Le variazioni da "active"
      // dei singoli pulsanti sono presenti in entrambi i rilievi.
      if (view==='view-roadmap') baseline=result.stableLayout;
      else for(const [i,now] of result.stableLayout.entries()){
        const prev=baseline[i];
        assert.equal(now.selector,prev.selector);
        assert.equal(Boolean(now.missing),Boolean(prev.missing));
        if(now.missing)continue;
        for(const metric of ['x','y','width','height']){
          // Font metrics / viewport scrollbar may shift a flexible grid
          // column a couple pixels; navbar HEIGHT and control heights
          // must nonetheless be identical when switching sections.
          const tolerance=metric==='height'||metric==='y'?0.7:4;
          assert.ok(Math.abs(now[metric]-prev[metric])<tolerance,
            'Exercise resizes navbar '+now.selector+'.'+metric+
            ' at '+w+'px in '+engine.name()+': before '+prev[metric]+
            ' after '+now[metric]);
        }
        for(const metric of ['fontSize','fontFamily','padding','display'])
          assert.equal(now[metric],prev[metric],
            'Exercise changes navbar typography or spacing '+now.selector+
            '.'+metric+' at '+w+'px in '+engine.name());
      }
      assert.equal(result.clipped.length,0,'A navbar action left the viewport: '+msg);
      assert.equal(result.colliding,false,'Navbar sections overlap: '+msg);
      assert.equal(result.menuOverlap,false,'Menu buttons overlap: '+msg);
      assert.deepEqual(result.labelsClipped,[],'Navigation text overflows its button: '+msg);
      // Guard against the original 2048px screenshot's 200px+ EMPTY bands
      // on either side of the central links. Filling the center must be
      // intentional, not hiding unused space with overflow clipping.
      if(w>=1600 && w<=2048){
        assert.ok(result.whitespaceLeft<48 && result.whitespaceRight<48,
          'Excessive unused horizontal navbar space: '+msg);
      }
      if (w>=1200) {
        assert.ok(result.labels.length>=7&&result.labels.every(l=>l.display!=='none'&&l.width>6),
          'Desktop must show text labels beside the icons: '+msg);
      }
      assert.ok(result.logo.left >= 0 && result.logo.right <= result.vw,
        'Brand disappeared at left: '+msg);
      assert.ok(result.right <= result.vw+1,'Profile was clipped: '+msg);
      assert.ok(result.scrollWidth <= result.clientWidth+2,'Navbar internal scroll: '+msg);
      assert.equal(result.scrollX,0,'Page panned sideways: '+msg);
      if(w===1512 && view==='view-exercise' && process.env.E2E_SCREENSHOTS==='1') {
        fs.mkdirSync(path.join(root,'test-artifacts'),{recursive:true});
        await page.screenshot({path:path.join(root,'test-artifacts','macbook-navbar-'+engine.name()+'.png')});
      }
    }
  }
  await context.close();
  console.log('PASS: '+engine.name()+' MacBook navbar, all visible controls and profile inside viewport');
 } finally {await browser.close();}
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port;
 try{
  await inspect(chromium,url);
  await inspect(webkit,url);
 } finally {
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(err=>{console.error('NAVBAR SAFARI REGRESSION:',err);process.exitCode=1;});
