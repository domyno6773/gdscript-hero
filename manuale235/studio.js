/* Editor del nuovo manuale: file .gd, input testuale e anteprima senza XP.
 * La verifica definitiva passa sempre da GDHManualVerifier.
 */
(() => {
  'use strict';
  let saveTimer=null;
  let active=null;
  const lookup=id=>(window.LESSONS_DATA||[]).find(l=>l.id===id&&l.manualLessonNumber)||(window.REVIEW_VARIANTS||[]).find(v=>v.id===id&&v.manualLessonId);
  const current=()=>window.App?.isReviewMode&&window.App.currentReviewVariant?.manualLessonId?window.App.currentReviewVariant:lookup(window.App?.state?.currentLessonId);
  const getDraft=lesson=>{
    if(window.App.isReviewMode&&window.App.currentReviewVariant?.manualLessonId===lesson.id)lesson=window.App.currentReviewVariant;
    const state=window.App.state;
    state.manualDrafts ||= {};
  const original=lesson.requiresMultipleFiles?lesson.sourceFiles:{'main.gd':state.userCode?.[lesson.id]??lesson.initialCode};
    let draft=state.manualDrafts[lesson.id];
    if(!draft || !draft.files || typeof draft.files!=='object'||Array.isArray(draft.files)){
      draft={files:{...original},selected:Object.keys(original).find(name=>
        !lesson.requiresMultipleFiles||!(lesson.readOnlyFiles||['main.gd']).includes(name)),
        stdin:(window.GDHManualExamples?.[lesson.manualLessonNumber]||[]).join('\n'),fileUpdatedAt:{},updatedAt:0};
      state.manualDrafts[lesson.id]=draft;
    }
    for(const [name,source] of Object.entries(original)){
      if(typeof draft.files[name]!=='string'||draft.files[name].length>16000||
        lesson.requiresMultipleFiles&&(lesson.readOnlyFiles||['main.gd']).includes(name))draft.files[name]=source;
    }
    for(const name of Object.keys(draft.files))if(!Object.hasOwn(original,name))delete draft.files[name];
    if(!Object.hasOwn(original,draft.selected))draft.selected=Object.keys(original)[0];
    if(typeof draft.stdin!=='string')draft.stdin='';
    return draft;
  };
  const scheduleSave=()=>{
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>window.App.saveStorage(),400);
  };
  const saveVisible=()=>{
    const l=current(),editor=document.getElementById('code-editor');
    if(!l||!editor||!active||active.lessonId!==l.id||active.owner!==window.App._saveOwner)return;
    const d=getDraft(l);
    if(d.selected&&(!l.requiresMultipleFiles||!(l.readOnlyFiles||['main.gd']).includes(d.selected))&&d.files[d.selected]!==editor.value){
      d.files[d.selected]=editor.value;d.updatedAt=Date.now();
      (d.fileUpdatedAt||={})[d.selected]=d.updatedAt;
    }
    const stdin=document.getElementById('manual-stdin-lines');
    if(stdin&&d.stdin!==stdin.value){d.stdin=stdin.value;d.updatedAt=Date.now();}
  };
  const inputLines=()=>{
    const l=current();if(!l)return [];
    const text=document.getElementById('manual-stdin-lines')?.value??getDraft(l).stdin;
    if(!text)return [];
    return text.replace(/\r/g,'').split('\n').slice(0,64);
  };
  function attach(id){
    const lesson=lookup(id);if(!lesson)return;
    const editor=document.getElementById('code-editor');
    const wrapper=document.querySelector('#view-exercise .editor-wrapper');
    const task=document.getElementById('lesson-task');
    if(!editor||!wrapper||!task)return;
    document.querySelectorAll('.manual-file-bar,.manual-input-panel,.manual-verification-note').forEach(el=>el.remove());
    const draft=getDraft(lesson);
    editor.readOnly=false;
    editor.setAttribute('aria-readonly','false');
    active={lessonId:lesson.id,owner:window.App._saveOwner};
    const filename=document.querySelector('#view-exercise .file-name');
    if(filename)filename.textContent=draft.selected;
    // Quando un progetto contiene più script, ciascun file ha una propria bozza.
    if(lesson.requiresMultipleFiles){
      const group=document.createElement('div');group.className='manual-file-bar';
      group.setAttribute('role','tablist');group.setAttribute('aria-label','File GDScript del progetto');
      for(const file of Object.keys(draft.files)){
        const button=document.createElement('button');button.type='button';
        button.className='manual-file-tab'+(file===draft.selected?' is-active':'');
        button.textContent=file;
        button.setAttribute('role','tab');button.setAttribute('aria-selected',String(file===draft.selected));
        button.onclick=()=>{
          saveVisible();draft.selected=file;
          editor.value=draft.files[file]||'';
          if(filename)filename.textContent=file;
          editor.readOnly=lesson.requiresMultipleFiles&&(lesson.readOnlyFiles||['main.gd']).includes(file);
          editor.setAttribute('aria-readonly',String(editor.readOnly));
          editor.dispatchEvent(new Event('input',{bubbles:true}));
          window.App.saveStorage();
          group.querySelectorAll('button').forEach(b=>{
            b.classList.toggle('is-active',b===button);
            b.setAttribute('aria-selected',String(b===button));
          });
        };
        group.append(button);
      }
      wrapper.before(group);
      editor.value=draft.files[draft.selected]||'';
      editor.readOnly=(lesson.readOnlyFiles||['main.gd']).includes(draft.selected);
      editor.setAttribute('aria-readonly',String(editor.readOnly));
      editor.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(!lesson.requiresMultipleFiles){editor.value=draft.files['main.gd'];editor.dispatchEvent(new Event('input',{bubbles:true}));}
    if(lesson.requiresStdin){
      const section=document.createElement('section');section.className='manual-input-panel';
      const label=document.createElement('label');label.htmlFor='manual-stdin-lines';
      label.textContent='Dati di input (una riga per ciascuna lettura)';
      const area=document.createElement('textarea');
      area.id='manual-stdin-lines';area.rows=4;area.spellcheck=false;
      area.placeholder='Inserisci una riga di input per volta';
      area.value=draft.stdin;
      area.oninput=()=>{draft.stdin=area.value;draft.updatedAt=Date.now();scheduleSave();};
      const btn=document.createElement('button');btn.type='button';btn.className='manual-preview-btn';
      btn.textContent='Prova con questi dati (senza completare)';
      btn.onclick=async()=>{
        saveVisible();
        const result=document.getElementById('real-output-pre');
        const source=editor.value;
        btn.disabled=true;btn.textContent='Esecuzione in Godot…';
        try{
          if(!window.GDHGodot?.runNative)throw Error('Motore Godot non disponibile');
          const out=await window.GDHManualVerifier.preview(lesson.id,source,
            window.GDHGodot.runNative,inputLines());
          if(result)result.textContent=out.success?(out.logs.join('\n')||'(nessun messaggio)'):
            (out.error||'Esecuzione non riuscita');
        }catch(error){if(result)result.textContent=String(error.message||error);}
        finally{btn.disabled=false;btn.textContent='Prova con questi dati (senza completare)';}
      };
      section.append(label,area,btn);
      task.append(section);
    }
    if(!lesson.validationReady){
      const warning=document.createElement('p');
      warning.className='manual-verification-note';
      warning.setAttribute('role','status');
      warning.textContent=lesson.requiresMultipleFiles?
        'Questo progetto richiede la verifica con le classi Godot e non attribuisce ancora progressi.':
        'Questa lezione è importata dal manuale; il verificatore completo è ancora in preparazione.';
      task.append(warning);
    }
    const btn=document.getElementById('btn-run-code');
    if(btn && lesson.manualLessonNumber===1){
      const text=btn.querySelector('.run-text');if(text)text.textContent='Esegui codice';
    }else if(btn){
      const text=btn.querySelector('.run-text');if(text)text.textContent='Verifica il codice';
    }
  }
  let references;
  async function showSolution(lesson){
    const owner=window.App._saveOwner,id=lesson.id;
    if(!references)references=fetch(new URL('manuale235/solutions.json',document.baseURI))
      .then(r=>{if(!r.ok)throw Error('Soluzione non disponibile');return r.json();})
      .catch(error=>{references=null;throw error;});
    const solved=(await references)[lesson.manualLessonNumber];
    if(window.App._saveOwner!==owner||current()?.id!==id)return;
    if(!solved)throw Error('Soluzione non disponibile');
    saveVisible();
    const draft=getDraft(lesson),now=Date.now();
    for(const [name,text] of Object.entries(solved)){
      if(Object.hasOwn(draft.files,name)&&(!lesson.requiresMultipleFiles||!(lesson.readOnlyFiles||['main.gd']).includes(name))){
        draft.files[name]=text;(draft.fileUpdatedAt||={})[name]=now;
      }
    }
    draft.updatedAt=now;attach(id);window.App.saveStorage();
  }
  const original=window.App?.openLesson;
  if(typeof original!=='function')throw Error('App.openLesson non disponibile');
  window.App.openLesson=function(id){
    saveVisible();
    const result=original.call(this,id);
    if(lookup(id))attach(id);
    return result;
  };
  const originalReview=window.App.openReviewVariant;
  window.App.openReviewVariant=function(id){
    saveVisible();const result=originalReview.call(this,id);
    if(this.isReviewMode&&lookup(id))attach(id);
    return result;
  };
  function resetFile(lesson){
    const draft=getDraft(lesson),name=draft.selected;
    // Nei file singoli initialCode è lo starter revisionato mostrato all'apertura;
    // sourceFiles può ancora contenere il vecchio frammento importato dal PDF.
    draft.files[name]=lesson.requiresMultipleFiles?lesson.sourceFiles[name]:lesson.initialCode;
    draft.updatedAt=Date.now();(draft.fileUpdatedAt||={})[name]=draft.updatedAt;
    attach(lesson.id);window.App.saveStorage();
  }
  document.addEventListener('input',event=>{
    if(event.target?.id==='code-editor'&&current()){
      saveVisible();scheduleSave();
    }
  });
  window.addEventListener('pagehide',()=>{saveVisible();window.App.saveStorage({localOnly:true});});
  const resetSession=()=>{clearTimeout(saveTimer);active=null;};
  const selectFile=name=>{
    const lesson=current();if(!lesson)return false;
    const draft=getDraft(lesson);if(!Object.hasOwn(draft.files,name))return false;
    saveVisible();draft.selected=name;attach(lesson.id);window.App.saveStorage();return true;
  };
  window.GDHManualStudio=Object.freeze({inputLines,attach,getDraft,saveVisible,showSolution,resetFile,resetSession,selectFile});
})();
