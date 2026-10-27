'use strict';
/* Tooltip dell'editor: hover desktop / tap touch / F1. Solo lettura.
   Ricava la parola dalle coordinate della textarea, NON dalla posizione del caret.
 */
(function(root){
  const EDITORS=['code-editor','sandbox-code-editor'];
  const editors=[];
  let popup=null,active=null,canvas=null;
  function close(){
    active=null;
    if(popup)popup.hidden=true;
  }
  function ensurePopup(){
    if(popup)return popup;
    popup=document.createElement('section');
    popup.className='gdh-inline-code-help';
    popup.id='gdh-inline-code-help';
    popup.hidden=true;
    popup.setAttribute('aria-label','Spiegazione della parola sotto il puntatore');
    const title=document.createElement('strong');
    title.className='gdh-inline-help-title';
    const description=document.createElement('p');
    description.className='gdh-inline-help-description';
    popup.append(title,description);
    document.body.append(popup);
    return popup;
  }
  function show(editor,result,clientX,clientY,mode){
    if(!result)return close();
    const card=ensurePopup();
    const same=active&&active.editor===editor&&active.start===result.start&&active.end===result.end;
    if(!same){
      card.querySelector('.gdh-inline-help-title').textContent=result.title;
      card.querySelector('.gdh-inline-help-description').textContent=result.detail;
    }
    card.dataset.concept=result.key;
    card.dataset.editor=editor.id;
    card.hidden=false;
    active={editor,start:result.start,end:result.end,mode};
    const rect=editor.getBoundingClientRect();
    const x=Number.isFinite(clientX)?clientX:rect.left+36;
    const y=Number.isFinite(clientY)?clientY:rect.top+32;
    const w=card.offsetWidth,h=card.offsetHeight;
    const vw=document.documentElement.clientWidth,vh=window.innerHeight;
    const left=Math.max(8,Math.min(x+14,vw-w-8));
    const below=y+20,top=below+h<vh-8?below:y-h-14;
    card.style.left=Math.round(left)+'px';
    card.style.top=Math.round(Math.max(8,Math.min(top,vh-h-8)))+'px';
    return result;
  }
  function showAt(editor,offset,position={}){
    const concept=root.GDHCodeGuide?.explainAt(editor?.value,offset);
    return show(editor,concept,position.clientX,position.clientY,'keyboard');
  }
  // Gli editor sono monospace con white-space:pre, tab-size:4 e scroll propri.
  // Calcola la cella effettiva del carattere con metriche CSS (senza usare
  // selectionStart, che non segue il mouse finché non si clicca).
  function offsetAtPoint(editor,clientX,clientY){
    if(!editor)return null;
    const rect=editor.getBoundingClientRect();
    if(clientX<rect.left||clientX>=rect.right||clientY<rect.top||clientY>=rect.bottom)return null;
    const style=getComputedStyle(editor);
    const fontSize=parseFloat(style.fontSize)||14;
    const height=parseFloat(style.lineHeight)||fontSize*1.6;
    const x=clientX-rect.left-editor.clientLeft-(parseFloat(style.paddingLeft)||0)+editor.scrollLeft;
    const y=clientY-rect.top-editor.clientTop-(parseFloat(style.paddingTop)||0)+editor.scrollTop;
    if(x<0||y<0)return null;
    const row=Math.floor(y/height);
    const lines=editor.value.split('\n');
    if(row<0||row>=lines.length)return null;
    const line=lines[row];
    if(!line)return null;
    if(!canvas)canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d');
    if(!ctx)return null;
    ctx.font=[style.fontStyle||'normal',style.fontWeight||'400',style.fontSize||'14px',style.fontFamily||'monospace'].join(' ');
    const spacing=parseFloat(style.letterSpacing)||0;
    const cell=ctx.measureText('M').width+spacing;
    const tabSize=parseInt(style.tabSize,10)||4;
    let current=0,chars=0;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      const width=ch==='\t'
        ?(tabSize-(chars%tabSize))*cell
        :ctx.measureText(ch).width+spacing;
      if(x>=current&&x<current+width){
        return lines.slice(0,row).reduce((n,s)=>n+s.length+1,0)+i;
      }
      current+=width;
      chars+=ch==='\t'?tabSize-(chars%tabSize):1;
    }
    return null;
  }
  function hover(editor,x,y){
    const offset=offsetAtPoint(editor,x,y);
    if(offset===null)return close();
    const item=root.GDHCodeGuide?.explainAt(editor.value,offset,{strict:true});
    if(!item)return close();
    // Non muovere il tooltip quando il puntatore percorre la stessa parola.
    if(active?.editor===editor&&active.start===item.start&&active.end===item.end&&active.mode==='hover')return item;
    return show(editor,item,x,y,'hover');
  }
  function attach(editor){
    if(!editor||editor.dataset.inlineCodeHelpReady)return;
    editor.dataset.inlineCodeHelpReady='true';
    editors.push(editor);
    editor.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch'||e.buttons!==0)return close();
      hover(editor,e.clientX,e.clientY);
    });
    editor.addEventListener('pointerleave',close);
    // Nei touch screen il mouse non esiste: un tap apre, un altro altrove chiude.
    editor.addEventListener('pointerup',e=>{
      if(e.pointerType!=='touch')return;
      const offset=offsetAtPoint(editor,e.clientX,e.clientY);
      if(offset===null)return close();
      const item=root.GDHCodeGuide?.explainAt(editor.value,offset,{strict:true});
      show(editor,item,e.clientX,e.clientY,'touch');
    });
    editor.addEventListener('keydown',e=>{
      if(e.key==='F1'){
        e.preventDefault();
        if(active?.editor===editor&&active.mode==='keyboard')return close();
        showAt(editor,editor.selectionStart);
      }else if(e.key==='Escape')close();
    });
    editor.addEventListener('input',close);
    editor.addEventListener('scroll',close);
  }
  function init(){
    for(const id of EDITORS)attach(document.getElementById(id));
    document.addEventListener('pointerdown',e=>{
      if(active&&!editors.includes(e.target))close();
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)close()});
    window.addEventListener('blur',close);
  }
  root.GDHInlineCodeHelp=Object.freeze({init,close,showAt,hover,offsetAtPoint});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(typeof window!=='undefined'?window:globalThis);
