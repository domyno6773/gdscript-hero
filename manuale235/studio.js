/* Editor del nuovo manuale: file .gd, input testuale e anteprima senza XP.
 * La verifica definitiva passa sempre da GDHManualVerifier.
 */
(() => {
  'use strict';
  const drafts=new Map();
  let active=null;
  const lookup=id=>(window.LESSONS_DATA||[]).find(l=>l.id===id&&l.manualLessonNumber);
  const current=()=>lookup(window.App?.state?.currentLessonId);
  const getDraft=lesson=>{
    if(!drafts.has(lesson.id))drafts.set(lesson.id,{
      files:{...lesson.sourceFiles},selected:Object.keys(lesson.sourceFiles).find(name=>name!=='main.gd')||Object.keys(lesson.sourceFiles)[0],
      stdin:(window.GDHManualExamples?.[lesson.manualLessonNumber]||[]).join('\n')
    });
    return drafts.get(lesson.id);
  };
  const saveVisible=()=>{
    const l=current(),editor=document.getElementById('code-editor');
    if(!l||!editor||!active||active.lessonId!==l.id)return;
    const d=getDraft(l);if(d.selected)d.files[d.selected]=editor.value;
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
    active={lessonId:lesson.id};
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
          editor.readOnly=lesson.requiresMultipleFiles&&file==='main.gd';
          editor.setAttribute('aria-readonly',String(editor.readOnly));
          editor.dispatchEvent(new Event('input',{bubbles:true}));
          group.querySelectorAll('button').forEach(b=>{
            b.classList.toggle('is-active',b===button);
            b.setAttribute('aria-selected',String(b===button));
          });
        };
        group.append(button);
      }
      wrapper.before(group);
      editor.value=draft.files[draft.selected]||'';
      editor.readOnly=draft.selected==='main.gd';
      editor.setAttribute('aria-readonly',String(editor.readOnly));
      editor.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(lesson.requiresStdin){
      const section=document.createElement('section');section.className='manual-input-panel';
      const label=document.createElement('label');label.htmlFor='manual-stdin-lines';
      label.textContent='Dati di input (una riga per ciascuna lettura)';
      const area=document.createElement('textarea');
      area.id='manual-stdin-lines';area.rows=4;area.spellcheck=false;
      area.placeholder='Inserisci una riga di input per volta';
      area.value=draft.stdin;
      area.oninput=()=>{draft.stdin=area.value;};
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
  const original=window.App?.openLesson;
  if(typeof original!=='function')throw Error('App.openLesson non disponibile');
  window.App.openLesson=function(id){
    saveVisible();
    const result=original.call(this,id);
    if(lookup(id))attach(id);
    return result;
  };
  window.GDHManualStudio=Object.freeze({inputLines,attach,getDraft,saveVisible});
})();
