/*
 * GDScript Hero — Godot-style indentation and folding, without editing
 * or truncating the canonical textarea source used by validators and saves.
 */
(function(){
'use strict';
const IDs=['code-editor','sandbox-code-editor','arena-code-editor','competition-code-editor','official-code'];
const items=new WeakMap();
const UNIT='    ';
function edit(el,start,end,value,cursor){
 el.setRangeText(value,start,end,'end');
 if(cursor!==undefined)el.setSelectionRange(cursor,cursor);
 el.dispatchEvent(new Event('input',{bubbles:true}));
}
function lineBegin(s,p){return s.lastIndexOf('\n',p-1)+1;}
function indent(el,unindent=false){
 const s=el.value,a=el.selectionStart,b=el.selectionEnd,first=lineBegin(s,a);
 if(a===b && unindent){
  const leading=s.slice(first,a);
  if(!leading || !/^[ \t]+$/.test(leading))return false;
  const count=leading.endsWith('\t')?1:(leading.length%4||4);
  edit(el,a-count,a,'',a-count);
  return true;
 }
 const multiline=s.slice(a,b).includes('\n');
 if(multiline || unindent){
  const last=multiline && s[b-1]==='\n'?b-1:b;
  const finish=s.indexOf('\n',last);
  const until=finish<0?s.length:finish;
  const rows=s.slice(first,until).split('\n');
  let delta=0,firstDelta=0;
  const output=rows.map((row,index)=>{
   const spaces=row.match(/^ */)[0].length;
   const count=unindent?(row.startsWith('\t')?1:Math.min(4,spaces)):0;
   const next=unindent?row.slice(count):UNIT+row;
   const change=next.length-row.length;
   if(index===0)firstDelta=change;
   delta+=change;
   return next;
  }).join('\n');
  el.setRangeText(output,first,until,'end');
  el.setSelectionRange(Math.max(first,a+firstDelta),Math.max(first,b+delta));
  el.dispatchEvent(new Event('input',{bubbles:true}));
  return true;
 }
 edit(el,a,b,UNIT,a+4);
 return true;
}
function backspace(el){
 if(el.selectionStart!==el.selectionEnd)return false;
 const p=el.selectionStart,leading=el.value.slice(lineBegin(el.value,p),p);
 if(!leading||!/^[ \t]+$/.test(leading))return false;
 const remove=leading.endsWith('\t')?1:(leading.length%4||4);
 edit(el,p-remove,p,'',p-remove);
 return true;
}
function width(line){let w=0;for(const c of line.match(/^[ \t]*/)?.[0]||'')w+=c==='\t'?4:1;return w;}
function strip(line){
 let out='',q='',escape=false;
 for(const c of line){
  if(q){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===q)q='';continue;}
  if(c==='#')break;
  if(c==='"'||c==="'"){q=c;continue;}
  out+=c;
 }
 return out.trim();
}
function ranges(source){
 const rows=source.split('\n'),result=new Map();
 const indents=rows.map(width);
 for(let i=0;i<rows.length;i++){
  const code=strip(rows[i]);
  if(!code.endsWith(':'))continue;
  if(!/^(?:(?:static\s+)?func\b|if\b|elif\b|else\b|for\b|while\b|match\b|class\b|get\b|set\b|when\b)/.test(code)
   && !(indents[i]>0 && /^[\w"'_\d().,\s-]+:\s*$/.test(code)))continue;
  let end=i,content=false;
  for(let j=i+1;j<rows.length;j++){
   const trimmed=rows[j].trim();
   // A dedented comment belongs to the next section, never this block.
   // Trailing empty separator lines must remain visible after folding.
   if(trimmed&&indents[j]<=indents[i])break;
   if(!trimmed)continue;
   if(!trimmed.startsWith('#'))content=true;
   end=j;
  }
  if(content&&end>i)result.set(i,end);
 }
 return result;
}
function node(tag,cls,text){
 const el=document.createElement(tag);
 el.className=cls;
 if(text!==undefined)el.textContent=text;
 return el;
}
function lh(el){return parseFloat(getComputedStyle(el).lineHeight)||22.4;}
function arrow(line,closed,onClick){
 const btn=node('button','gdh-fold-arrow'+(closed?' collapsed':''));
 btn.type='button';
 btn.setAttribute('aria-label',(closed?'Espandi':'Comprimi')+' blocco dalla riga '+(line+1));
 btn.setAttribute('aria-expanded',String(!closed));
 btn.title=closed?'Espandi blocco':'Comprimi blocco';
 btn.innerHTML='<svg aria-hidden="true" viewBox="0 0 12 12"><path d="m4 2 4 4-4 4"/></svg>';
 btn.addEventListener('mousedown',e=>e.preventDefault());
 btn.addEventListener('click',onClick);
 return btn;
}
function gutter(el,state){
 state.gutter.replaceChildren();
 if(state.folds.size)return;
 const rect=el.getBoundingClientRect(),parent=state.gutter.getBoundingClientRect();
 const height=lh(el),pad=parseFloat(getComputedStyle(el).paddingTop)||0;
 const first=Math.max(0,Math.floor((el.scrollTop-pad)/height));
 const count=el.value.split('\n').length;
 for(let i=first;i<Math.min(count,first+Math.ceil(rect.height/height)+4);i++){
  if(!state.blocks.has(i))continue;
  const btn=arrow(i,false,()=>toggle(el,i));
  btn.style.top=(rect.top-parent.top+pad+i*height-el.scrollTop)+'px';
  btn.style.height=height+'px';
  state.gutter.append(btn);
 }
}
function preview(el,state){
 const surface=state.preview;
 // Keep exactly the native editor's height, typography and viewport scroll.
 const savedTop=surface.scrollTop,savedLeft=surface.scrollLeft;
 const edStyle=getComputedStyle(el);
 surface.style.setProperty('--gdh-row-height',lh(el)+'px');
 surface.style.setProperty('--gdh-padding-top',edStyle.paddingTop);
 surface.style.setProperty('--gdh-padding-bottom',edStyle.paddingBottom);
 surface.style.fontFamily=edStyle.fontFamily;
 surface.style.fontWeight=edStyle.fontWeight;
 surface.style.fontSize=edStyle.fontSize;
 surface.style.lineHeight=edStyle.lineHeight;
 surface.replaceChildren();
 surface.hidden=false;
 const numberColumn=state.host.querySelector('.line-numbers');
 surface.style.setProperty('--gdh-number-width',(numberColumn?.getBoundingClientRect().width||48)+'px');
 surface.dataset.foldMode='overlay';
 const rows=el.value.split('\n');
 for(let i=0;i<rows.length;){
  const line=i,closed=state.folds.has(i);
  const row=node('div','gdh-fold-preview-row');
  row.dataset.sourceLine=String(i+1);
  const num=node('div','gdh-fold-preview-number',String(i+1));
  // Separate column, after the line number, matching Godot's gutter.
  const foldSlot=node('div','gdh-fold-preview-controls');
  if(state.blocks.has(i)){
   foldSlot.append(arrow(i,closed,()=>toggle(el,line)));
  }
  const code=node('pre','gdh-fold-preview-code');
  if(window.GDScriptHighlighter){
   // The normal editor remains underneath. Preserve syntax colors and indent
   // marks in the compact view, without inserting markup in saved source.
   code.innerHTML=window.GDScriptHighlighter.highlight(rows[i]||' ');
  }else code.textContent=rows[i]||' ';
  if(closed)code.append(node('span','gdh-fold-count','  … '+(state.blocks.get(i)-i)+' righe nascoste'));
  code.title='Tocca per modificare il codice (riapre i blocchi)';
  code.addEventListener('click',()=>{
   state.folds.clear();refresh(el);
   const cursor=rows.slice(0,line).reduce((n,s)=>n+s.length+1,0);
   el.focus();el.setSelectionRange(cursor,cursor);
   el.scrollTop=Math.max(0,line*lh(el)-3*lh(el));
  });
  row.append(num,foldSlot,code);surface.append(row);
  // Skip ONLY this block's own children; adjacent functions stay visible.
  i=closed?state.blocks.get(i)+1:i+1;
 }
 surface.scrollTop=savedTop;
 surface.scrollLeft=savedLeft;
}
function refresh(el){
 const s=items.get(el);if(!s)return;
 if(el.value!==s.source){
  s.folds.clear();
  // Programmatic restores (saved Sandbox projects, lessons, review drafts)
  // change textarea.value without firing input. Keep the actual visible
  // highlighting in sync, not only the fold-only preview.
  if(el.id==='sandbox-code-editor')window.GDScriptHighlighter?.sync('sandbox');
  else if(el.id==='code-editor')window.GDScriptHighlighter?.sync('exercise');
 }
 s.source=el.value;
 s.blocks=ranges(el.value);
 for(const key of [...s.folds])if(!s.blocks.has(key))s.folds.delete(key);
 if(s.folds.size){
  preview(el,s);
  // Preserve the flex layout but never draw two editors on top of each
  // other. The fold preview is the only visible code and number gutter.
  s.host.classList.add('gdh-is-folded');
 }else{
  s.host.classList.remove('gdh-is-folded');
  s.preview.hidden=true;
 }
 gutter(el,s);
 if(s.syntax){
  s.syntax.innerHTML=window.GDScriptHighlighter?
    window.GDScriptHighlighter.highlight(el.value):'';
  s.syntax.parentElement.scrollTop=el.scrollTop;
  s.syntax.parentElement.scrollLeft=el.scrollLeft;
 }
}
function toggle(el,line){
 const s=items.get(el);if(!s)return;
 if(el.value!==s.source)refresh(el);
 if(!s.blocks.has(line))return;
 if(s.folds.has(line))s.folds.delete(line);else s.folds.add(line);
 refresh(el);
}
function attach(el){
 if(!el||items.has(el))return;
 const core=el.id==='code-editor'||el.id==='sandbox-code-editor';
 let host=el.closest('.editor-wrapper'),syntax=null;
 if(!core){
  host=node('div','gdh-plain-code-shell '+(el.id==='arena-code-editor'?'gdh-arena-code-shell':'gdh-other-code-shell'));
  el.before(host);host.append(el);
  const pre=node('pre','gdh-plain-syntax-layer');
  pre.setAttribute('aria-hidden','true');
  syntax=node('code','');
  pre.append(syntax);el.before(pre);
 }
 if(!host)return;
 const foldGutter=node('div','gdh-fold-gutter');
 const folded=node('div','gdh-fold-preview');
 folded.hidden=true;
 folded.setAttribute('aria-label','Codice compattato. Tocca una riga per aprire il codice e modificarlo.');
 // The real fold controls belong beside the code, not inside line numbers.
 // The compact preview spans both the number column and the editor.
 (core?el.closest('.gdscript-edit-stack'):host).append(foldGutter);
 host.append(folded);
 const s={host,gutter:foldGutter,preview:folded,folds:new Set(),blocks:new Map(),source:el.value,syntax};
 items.set(el,s);
 el.addEventListener('input',()=>refresh(el));
 el.addEventListener('scroll',()=>{
  gutter(el,s);
  if(syntax){
   syntax.parentElement.scrollTop=el.scrollTop;
   syntax.parentElement.scrollLeft=el.scrollLeft;
  }
 });
 el.addEventListener('focus',()=>refresh(el));
 if(!core)el.addEventListener('keydown',e=>{
  if(e.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Backspace'&&backspace(el)){
   e.preventDefault();e.stopImmediatePropagation();
  }else if(e.key==='Tab'){
   e.preventDefault();e.stopImmediatePropagation();indent(el,e.shiftKey);
  }else if(e.key==='Enter'&&window.App?.insertSmartNewline){
   e.preventDefault();e.stopImmediatePropagation();window.App.insertSmartNewline(el);
  }
 });
 refresh(el);
}
function init(){IDs.forEach(id=>attach(document.getElementById(id)));}
window.GDHEditorUX={init,indent,backspace,refresh,toggle,ranges};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
