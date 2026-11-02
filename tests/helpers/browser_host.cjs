'use strict';
const fs=require('fs'),path=require('path'),http=require('http');
module.exports=async function host(){
 const root=path.resolve(__dirname,'../..');
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.pck':'application/octet-stream','.svg':'image/svg+xml','.png':'image/png'};
 const server=http.createServer((req,res)=>{
  let file;try{file=path.resolve(root,decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\//,'')||'index.html');}catch(e){return res.writeHead(400).end();}
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'}).end(data);});
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 return {url:'http://127.0.0.1:'+server.address().port,close:()=>new Promise(r=>server.close(r))};
};
module.exports.welcome=async page=>{
 if(await page.locator('#site-welcome').isVisible())await page.locator('#site-skip-tour').click();
 if(await page.locator('#site-goal-gate').isVisible())await page.locator('#site-goal-gate [data-goal="rilassato"]').click();
 if(await page.locator('#streak-modal').isVisible())await page.locator('#btn-close-streak').click();
};
