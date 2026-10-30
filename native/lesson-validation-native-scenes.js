'use strict';
(function(root){
  const base=root.GDHLessonLab;
  if(!base)throw Error('Load lesson-validation.js first');
  const lines=x=>String(x||'').trimEnd().split(/\r?\n/).filter(Boolean);
  const eq=(x,y)=>x.length===y.length&&x.every((v,i)=>v===y[i]);
  const clean=x=>String(x||'').split(/\r?\n/).filter(l=>!/^\s*#/.test(l)).join('\n');
  const node=(r,name,type)=>Boolean(r?.scene?.[name]?.exists&&r.scene[name].class===type);
  const text=(r,name,value)=>r?.scene?.[name]?.text===value;
  const assign=(code,name)=>clean(code).includes('$'+name+'.text =');
  const printText=(code,name)=>clean(code).includes('$'+name+'.text');
  const connect=(code,nodeName,callback,signal='pressed')=>
    clean(code).includes('$'+nodeName+'.'+signal+'.connect('+callback+')');
  const action=(r,i,nodeName,signal='pressed')=>r?.sceneActions?.[i]?.status==='emitted'&&
    r.sceneActions[i].node===nodeName&&r.sceneActions[i].signal===signal&&r.sceneActions[i].connections===1;
  function scenarios(id,src){
    const steps=base.scenarios(id,src).slice();
    if(id===54){
      steps.push({key:'no_click',code:src,actions:[]});
      steps.push({key:'two_clicks',code:src,actions:[{node:'AttaccaBtn',signal:'pressed'},{node:'AttaccaBtn',signal:'pressed'}]});
    }
    if(id===56)steps.push({key:'reverse_clicks',code:src,actions:[{node:'AllarmeBtn',signal:'pressed'},{node:'MotoriBtn',signal:'pressed'}]});
    if(id===55)steps.push({key:'two_clicks',code:src,actions:[
      {node:'ClickBtn',signal:'pressed'},{node:'ClickBtn',signal:'pressed'}]});
    if(id===60){
      steps.push({key:'five_clicks',code:src,actions:Array.from({length:5},()=>({node:'CompraPozioneBtn',signal:'pressed'}))});
      const low=String(src).replace(/(^[ \t]*var\s+monete(?:\s*:\s*int)?\s*(?:=|:=)\s*)100\b/m,
        (_match,prefix)=>prefix+'20');
      if(low!==src)steps.push({key:'low_money',code:low,actions:[{node:'CompraPozioneBtn',signal:'pressed'}]});
    }
    return steps;
  }
  function grade(id,src,reply,stdout,stderr,steps={}){
    if(id<49||id>60)return base.grade(id,src,reply,stdout,stderr,steps);
    const checks=[],l=lines(stdout),code=clean(src),props=reply?.properties||{};
    const add=(title,result)=>checks.push({desc:title,passed:Boolean(result)});
    const scenarioClean=key=>Boolean(steps[key]?.reply?.status==='executed'&&
      !String(steps[key]?.stderr||'').trim());
    add('Script eseguito dal vero Godot',reply?.status==='executed');
    add('Nessun errore segnalato dal motore Godot',!String(stderr||'').trim());
    switch(id){
      case 49:
        add('Giocatore è un vero nodo',node(reply,'Giocatore','Node'));
        add('Accede con $Giocatore.name',(/\$Giocatore\b|\bget_node\s*\(/.test(code)));
        add('Stampa il nome del nodo',eq(l,['Nodo rilevato: Giocatore']));break;
      case 50:
        add('Titolo è una vera Label',node(reply,'Titolo','Label'));
        add('La label contiene il testo richiesto',text(reply,'Titolo','Benvenuto in Godot 4!'));
        add('Imposta e legge $Titolo.text',eq(l,['Testo a schermo: Benvenuto in Godot 4!']));break;
      case 51:
        add('SaluteLabel è una vera Label',node(reply,'SaluteLabel','Label'));
        add('La label contiene HP: 75',text(reply,'SaluteLabel','HP: 75'));
        add('Modifica e stampa il testo della label',eq(l,['Nuova salute: HP: 75']));break;
      case 52:
        add('Tre Label native', ['TitoloDungeon','LivelloLabel','MoneteLabel'].every(x=>node(reply,x,'Label')));
        add('Testi delle tre targhette reali',text(reply,'TitoloDungeon','Caverna dei Goblin')&&
          text(reply,'LivelloLabel','Livello: 1')&&text(reply,'MoneteLabel','Oro: 50'));

        add('Output dungeon',eq(l,['Dungeon: Caverna dei Goblin','Difficolta: Livello: 1','Bottino: Oro: 50']));break;
      case 53:
        add('AttaccaBtn è un vero Button',node(reply,'AttaccaBtn','Button'));
        add('Testo impostato realmente',text(reply,'AttaccaBtn','Sferra Attacco'));
        add('Assegna e legge il testo del Button',eq(l,['Pulsante configurato: Sferra Attacco']));break;
      case 54:
        add('Segnale pressed connesso realmente',node(reply,'AttaccaBtn','Button')&&
          reply?.sceneBeforeActions?.AttaccaBtn?.pressed_connections===1&&action(reply,0,'AttaccaBtn'));

        add('Click invoca il callback',eq(l,['Pulsante connesso','Colpo sferrato con successo!']));
        add('Nessun colpo prima del clic',scenarioClean('no_click')&&eq(lines(steps.no_click?.stdout),['Pulsante connesso']));
        add('Ogni clic attiva un colpo',scenarioClean('two_clicks')&&eq(lines(steps.two_clicks?.stdout),['Pulsante connesso','Colpo sferrato con successo!','Colpo sferrato con successo!']));break;
      case 55:
        add('ClickBtn e PuntiLabel nativi',node(reply,'ClickBtn','Button')&&node(reply,'PuntiLabel','Label'));
        add('Segnale pressed collegato a una funzione',
          action(reply,0,'ClickBtn')&&
          reply?.sceneBeforeActions?.ClickBtn?.pressed_connections===1);
        add('Primo clic incrementa punti',props.punti===1);
        add('Label aggiornata e stampata',text(reply,'PuntiLabel','Click: 1')&&
          eq(l,['Clicker pronto','Click: 1']));
        add('Due clic aggiornano punti a 2',
          scenarioClean('two_clicks')&&steps.two_clicks?.reply?.properties?.punti===2&&
          steps.two_clicks?.reply?.scene?.PuntiLabel?.text==='Click: 2'&&
          eq(lines(steps.two_clicks?.stdout),['Clicker pronto','Click: 1','Click: 2']));break;
      case 56:
        add('Due Button e una Label reali',node(reply,'MotoriBtn','Button')&&node(reply,'AllarmeBtn','Button')&&node(reply,'StatoNave','Label'));
        add('Connessi i due segnali',reply?.sceneBeforeActions?.MotoriBtn?.pressed_connections===1&&reply?.sceneBeforeActions?.AllarmeBtn?.pressed_connections===1);
        add('Pulsanti impostano due stati diversi',
          action(reply,0,'MotoriBtn')&&action(reply,1,'AllarmeBtn')&&
          reply?.sceneActions?.[0]?.scene?.StatoNave?.text==='Motori a Massima Potenza'&&
          reply?.sceneActions?.[1]?.scene?.StatoNave?.text==='Allarme Rosso Attivo');
        add('Output motori e allarme',eq(l,['Plancia Operativa','Velocita Aumentata','Scudi al 100%']));
        add('I comandi funzionano anche in ordine inverso',scenarioClean('reverse_clicks')&&
          steps.reverse_clicks?.reply?.sceneActions?.[0]?.scene?.StatoNave?.text==='Allarme Rosso Attivo'&&
          steps.reverse_clicks?.reply?.sceneActions?.[1]?.scene?.StatoNave?.text==='Motori a Massima Potenza'&&
          eq(lines(steps.reverse_clicks?.stdout),['Plancia Operativa','Scudi al 100%','Velocita Aumentata']));break;
      case 57:
        add('Timer nativo con wait_time 2.5 e one_shot',node(reply,'Cooldown','Timer')&&
          reply?.sceneBeforeActions?.Cooldown?.wait_time===2.5&&reply?.sceneBeforeActions?.Cooldown?.one_shot===true);
        add('Timer avviato e timeout connesso',reply?.sceneBeforeActions?.Cooldown?.stopped===false&&
          reply?.sceneBeforeActions?.Cooldown?.timeout_connections===1&&
          connect(src,'Cooldown','quando_scaduto','timeout')&&code.includes('$Cooldown.start()'));
        add('Evento timeout di prova raggiunge la callback',action(reply,0,'Cooldown','timeout')&&
          eq(l,['Timer avviato per: 2.5s','Tempo scaduto!']));break;
      case 58:
        add('BarraVita è un ColorRect nativo',node(reply,'BarraVita','ColorRect'));
        add('Colore nativo corrisponde a #22c55e',
          reply?.scene?.BarraVita?.color?.toLowerCase()==='22c55e'&&
          /\$BarraVita\s*\.\s*color\s*=/.test(code));
        add('Dimensioni ColorRect 200x20',
          reply?.scene?.BarraVita?.size?.x===200&&reply?.scene?.BarraVita?.size?.y===20&&
          code.includes('$BarraVita.size = Vector2'));
        add('Stampa la proprietà Color, non una stringa costante',
          code.includes('$BarraVita.color')&&l.length===1&&
          l[0].startsWith('Barra salute aggiornata con colore: '));break;
      case 59:
        add('Esiste una vera Moneta come nodo',node(reply,'Moneta','Node'));
        add('Moneta è in coda per queue_free()',reply?.scene?.Moneta?.queued===true&&
          /\$Moneta\s*\.\s*queue_free\s*\(\s*\)/.test(code));
        add('Usa has_node e is_queued_for_deletion',
          /has_node\s*\(\s*["']Moneta["']\s*\)/.test(code)&&
          /\$Moneta\s*\.\s*is_queued_for_deletion\s*\(\s*\)/.test(code));
        add('Console riflette gli stati reali',
          eq(l,['Moneta presente prima: true','Moneta in attesa di eliminazione: true']));break;
      case 60:
        add('Button acquisto e due Label nativi',
          node(reply,'CompraPozioneBtn','Button')&&node(reply,'OroLabel','Label')&&node(reply,'MessaggioLabel','Label'));
        add('Segnale acquisto collegato',connect(src,'CompraPozioneBtn','compra_pozione')&&
          action(reply,0,'CompraPozioneBtn')&&reply?.sceneBeforeActions?.CompraPozioneBtn?.pressed_connections===1);
        add('Acquisto riduce monete a 75',
          props.monete===75&&/\bmonete\s*-=\s*25\b/.test(code)&&text(reply,'OroLabel','Monete: 75'));
        add('Messaggio iniziale dopo acquisto',text(reply,'MessaggioLabel','Pozione Acquistata!')&&
          eq(l,['Bottega Aperta','Pozione Acquistata!']));
        add('Controllo fondi e ramo else',
          /\bif\s+monete\s*>=\s*25\s*:/.test(code)&&/\belse\s*:/.test(code));
        add('Acquisto rifiutato quando monete = 20',
          scenarioClean('low_money')&&steps.low_money?.reply?.properties?.monete===20&&
          steps.low_money?.reply?.scene?.MessaggioLabel?.text==='Oro Insufficiente!'&&
          eq(lines(steps.low_money?.stdout),['Bottega Aperta','Oro Insufficiente!']));
        add('Cinque click: quattro acquisti, poi fondi insufficienti',
          scenarioClean('five_clicks')&&steps.five_clicks?.reply?.properties?.monete===0&&
          steps.five_clicks?.reply?.scene?.OroLabel?.text==='Monete: 0'&&
          steps.five_clicks?.reply?.scene?.MessaggioLabel?.text==='Oro Insufficiente!'&&
          eq(lines(steps.five_clicks?.stdout),[
            'Bottega Aperta','Pozione Acquistata!','Pozione Acquistata!',
            'Pozione Acquistata!','Pozione Acquistata!','Oro Insufficiente!']));break;
    }
    const missing=id===55?(!steps.two_clicks?['two_clicks']:[]):
      id===60?['low_money','five_clicks'].filter(key=>!steps[key]):[];
    if(missing.length)add('Scenari di interazione disponibili',false);
    const engineError=reply?.status!=='executed'||Boolean(String(stderr||'').trim());
    const passed=!engineError&&!missing.length&&checks.every(x=>x.passed);
    const verdict=engineError?'invalid_code':missing.length?'inconclusive':
      passed?'accepted':'requirements_not_met';
    return {id,passed,verdict,checks,nativeStatus:reply?.status,demoOnly:true,
      reason:missing.length?'Impossibile generare le prove native: '+missing.join(', '):undefined,
      warning:'Validazione locale non attendibile per progressi, XP o accessi Premium.'};
  }
  root.GDHLessonLab=Object.freeze({...base,grade,scenarios});
})(window);
