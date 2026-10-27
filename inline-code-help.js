'use strict';
/* Guida on-demand sopra la textarea: click/tap sul costrutto o F1 per tastiera.
 * Non altera selezione, testo, highlighting né auto-completamento.
 */
(function(root) {
  let popup=null;
  let editors=[];
  function close() {
    if(popup)popup.hidden=true;
  }
  function ensurePopup() {
    if(popup)return popup;
    popup=document.createElement('section');
    popup.className='gdh-inline-code-help';
    popup.id='gdh-inline-code-help';
    popup.hidden=true;
    popup.setAttribute('aria-label','Spiegazione del codice');
    const header=document.createElement('div');
    header.className='gdh-inline-help-heading';
    const title=document.createElement('strong');
    title.className='gdh-inline-help-title';
    const dismiss=document.createElement('button');
    dismiss.type='button';
    dismiss.className='gdh-inline-help-close';
    dismiss.setAttribute('aria-label','Chiudi spiegazione');
    dismiss.textContent='×';
    dismiss.addEventListener('click',close);
    header.append(title,dismiss);
    const description=document.createElement('p');
    description.className='gdh-inline-help-description';
    popup.append(header,description);
    document.body.append(popup);
    return popup;
  }
  function showAt(editor,offset,{clientX,clientY}={}) {
    const result=root.GDHCodeGuide?.explainAt(editor?.value,offset);
    if(!result){close();return null;}
    const card=ensurePopup();
    card.querySelector('.gdh-inline-help-title').textContent=result.title;
    card.querySelector('.gdh-inline-help-description').textContent=result.detail;
    card.dataset.concept=result.key;
    card.dataset.editor=editor.id;
    card.hidden=false;
    // Posizione vicina al click, ma sempre dentro la finestra visibile.
    const bounds=editor.getBoundingClientRect();
    const x=Number.isFinite(clientX)?clientX:bounds.left+36;
    const y=Number.isFinite(clientY)?clientY:bounds.top+36;
    const width=card.offsetWidth, height=card.offsetHeight;
    const vw=document.documentElement.clientWidth, vh=window.innerHeight;
    const left=Math.max(10,Math.min(x+12,vw-width-10));
    const below=y+18;
    const top=below+height<=vh-10?below:Math.max(10,y-height-12);
    card.style.left=Math.round(left)+'px';
    card.style.top=Math.round(Math.min(top,vh-height-10))+'px';
    return result;
  }
  function attach(editor) {
    if(!editor||editor.dataset.inlineCodeHelpReady)return;
    editor.dataset.inlineCodeHelpReady='true';
    editors.push(editor);
    editor.addEventListener('click',event=>{
      // A drag-selection must remain a selection, not a help request.
      if(editor.selectionStart!==editor.selectionEnd)return close();
      showAt(editor,editor.selectionStart,{clientX:event.clientX,clientY:event.clientY});
    });
    editor.addEventListener('keydown',event=>{
      if(event.key==='F1'){
        event.preventDefault();
        if(!popup?.hidden && popup?.dataset.editor===editor.id)return close();
        showAt(editor,editor.selectionStart);
      }else if(event.key==='Escape')close();
    });
    editor.addEventListener('input',close);
    editor.addEventListener('scroll',close);
  }
  function init(){
    for(const id of ['code-editor','sandbox-code-editor'])attach(document.getElementById(id));
    document.addEventListener('pointerdown',event=>{
      if(!popup||popup.hidden)return;
      if(popup.contains(event.target)||editors.includes(event.target))return;
      close();
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)close();});
  }
  root.GDHInlineCodeHelp=Object.freeze({init,close,showAt});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(typeof window!=='undefined'?window:globalThis);
