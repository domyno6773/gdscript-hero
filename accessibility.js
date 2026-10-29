'use strict';
/* Keyboard and dialog accessibility for GDScript Hero.
 * Does not alter course state, editor keyboard commands or Godot runner. */
(() => {
  const init=()=>{
    const dialogSelector='.modal-overlay';
    const overlays=[...document.querySelectorAll(dialogSelector)];
    const openers=new WeakMap();
    const isOpen=node=>node&&!node.classList.contains('hidden')&&
      getComputedStyle(node).display!=='none';
    const topDialog=()=>overlays.filter(isOpen).at(-1)||null;
    const focusable=modal=>[...modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), '+
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(el=>el.getClientRects().length>0&&
        getComputedStyle(el).visibility!=='hidden'&&
        !el.closest('[inert], [aria-hidden="true"]'));
    const focusInside=modal=>{
      if(!modal||modal.contains(document.activeElement))return;
      (focusable(modal)[0]||modal.querySelector('.modal-card')||modal).focus();
    };
    let lastLauncher=null;
    document.addEventListener('click',event=>{
      if(event.target.closest(dialogSelector))return;
      const candidate=event.target.closest('button, a, [role="button"], [tabindex]');
      if(candidate)lastLauncher=candidate;
    },true);
    const handleVisibility=(modal,opened)=>{
      if(opened){
        const active=document.activeElement;
        openers.set(modal,lastLauncher&&lastLauncher.isConnected?lastLauncher:
          active instanceof HTMLElement?active:null);
        queueMicrotask(()=>{if(isOpen(modal)&&topDialog()===modal)focusInside(modal);});
      }else{
        const opener=openers.get(modal);
        queueMicrotask(()=>{
          const top=topDialog();
          if(top){focusInside(top);return;}
          if(opener?.isConnected&&opener.getClientRects().length)opener.focus();
          else if(modal.id==='profile-modal')document.getElementById('btn-open-user-menu')?.focus();
        });
      }
    };
    overlays.forEach(modal=>{
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      const header=modal.querySelector('.modal-card h2, .modal-card h3');
      if(header){
        if(!header.id)header.id=modal.id+'-accessible-title';
        modal.setAttribute('aria-labelledby',header.id);
      }else if(!modal.hasAttribute('aria-label')){
        modal.setAttribute('aria-label','Finestra di dialogo');
      }
      const card=modal.querySelector('.modal-card');
      if(card&&!card.hasAttribute('tabindex'))card.tabIndex=-1;
      modal.querySelectorAll('.modal-close-btn').forEach(btn=>{
        if(!btn.hasAttribute('aria-label'))btn.setAttribute('aria-label','Chiudi finestra');
      });
      let wasOpen=isOpen(modal);
      new MutationObserver(()=>{
        const now=isOpen(modal);
        if(now===wasOpen)return;
        wasOpen=now;
        handleVisibility(modal,now);
      }).observe(modal,{attributes:true,attributeFilter:['class']});
    });
    document.addEventListener('keydown',event=>{
      const modal=topDialog();
      if(!modal)return;
      if(event.key==='Escape'){
        const close=modal.querySelector('.modal-close-btn:not([disabled])');
        if(close&&close.getClientRects().length){
          event.preventDefault();
          event.stopPropagation();
          close.click();
        }
        return;
      }
      if(event.key!=='Tab')return;
      const items=focusable(modal);
      if(!items.length){event.preventDefault();focusInside(modal);return;}
      const first=items[0],last=items[items.length-1],active=document.activeElement;
      if(!modal.contains(active)||!items.includes(active)){
        event.preventDefault();(event.shiftKey?last:first).focus();
      }else if(event.shiftKey&&active===first){
        event.preventDefault();last.focus();
      }else if(!event.shiftKey&&active===last){
        event.preventDefault();first.focus();
      }
    },true);

    // Legacy clickable divs need keyboard parity with native buttons.
    ['btn-home','btn-streak-modal','btn-open-auth-nav','btn-open-profile']
      .forEach(id=>{
        const el=document.getElementById(id);
        if(!el)return;
        el.setAttribute('role','button');
        if(!el.hasAttribute('tabindex'))el.tabIndex=0;
        if(!el.hasAttribute('aria-label'))
          el.setAttribute('aria-label',el.title||'Apri '+id.replace(/^btn-/,''));
        el.addEventListener('keydown',event=>{
          if(event.key==='Enter'||event.key===' '){
            event.preventDefault();
            el.click();
          }
        });
      });

    // Custom Godot node picker is a true single-selection keyboard group.
    const picker=document.getElementById('node-type-selector-grid');
    if(picker){
      picker.setAttribute('role','radiogroup');
      picker.setAttribute('aria-label','Tipo di nodo Godot');
      const nodes=[...picker.querySelectorAll('.node-type-option')];
      const sync=()=>{
        nodes.forEach(el=>{
          const selected=el.classList.contains('selected');
          el.setAttribute('role','radio');
          el.setAttribute('aria-checked',String(selected));
          el.tabIndex=selected?0:-1;
        });
      };
      picker.addEventListener('click',event=>{
        if(event.target.closest('.node-type-option'))sync();
      });
      picker.addEventListener('keydown',event=>{
        const current=event.target.closest('.node-type-option');
        if(!current)return;
        const i=nodes.indexOf(current);
        if(i<0)return;
        let next=null;
        if(['ArrowRight','ArrowDown'].includes(event.key))next=nodes[(i+1)%nodes.length];
        if(['ArrowLeft','ArrowUp'].includes(event.key))next=nodes[(i+nodes.length-1)%nodes.length];
        if(event.key==='Home')next=nodes[0];
        if(event.key==='End')next=nodes[nodes.length-1];
        if(next){event.preventDefault();next.click();next.focus();}
        else if(event.key==='Enter'||event.key===' '){event.preventDefault();current.click();}
      });
      sync();
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
