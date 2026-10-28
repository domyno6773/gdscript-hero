'use strict';
/* Debug didattico: interpreta i messaggi autentici di Godot senza inventare
 * righe o sostituire il motore GDScript. Le modifiche al codice restano dell'utente.
 */
(function (root) {
  const cut = (value, max = 1600) => String(value ?? '').trim().slice(0, max);
  const lineOf = (message, source) => {
    const total = String(source || '').split('\n').length;
    // Godot Web può indicare uno script temporaneo come gdscript://-12345.gd:4.
    const patterns = [
      /(?:res|user|gdscript):\/\/[^\s()]*?\.gd:(\d+)(?::\d+)?\b/i,
      /(?:^|[\s(])(?:[^\s()]*?\/)?[^\s():]+\.gd:(\d+)(?::\d+)?\b/i,
      /\b(?:line|riga)\s*(\d+)\b/i
    ];
    for (const pattern of patterns) {
      const match = String(message || '').match(pattern);
      if (!match) continue;
      const godotLine = Number(match[1]);
      // Il runner inserisce "extends Node\\n" prima del codice se manca extends.
      // I numeri restituiti dallo script GDScript temporaneo sono quindi +1.
      // Correggiamo soltanto quei percorsi: file esterni / messaggi generici
      // non hanno una mappatura affidabile con l'editor dello studente.
      const generatedScript = /gdscript:\/\/[^\s()]*?\.gd:\d+/i.test(match[0]);
      const hasExtends = /^\s*extends\s+/m.test(String(source || ''));
      const line = generatedScript && !hasExtends ? godotLine - 1 : godotLine;
      if (Number.isSafeInteger(line) && line > 0 && line <= total) return line;
    }
    return null;
  };
  // La guida parte da un controllo semplice; gli indizi successivi si aprono
  // su richiesta e non includono mai la soluzione completa.
  const rules = [
    {
      pattern: /expected\s*["']?:["']?|expected.*colon|missing.*colon/i,
      title: 'Mancano i due punti (:)',
      why: 'Godot non riconosce la fine di un’istruzione che dovrebbe aprire un blocco.',
      hint: 'Guarda la fine della riga segnalata: come si indica l’inizio di un blocco in GDScript?',
      steps: [
        'Un if, un ciclo o una funzione introduce un gruppo di istruzioni. Il simbolo che apre quel gruppo si trova alla fine della sua riga.',
        'Confronta l’ultima parte della riga con un esempio nella teoria. Dopo l’apertura, le istruzioni del blocco vanno anche rientrate.'
      ]
    },
    {
      pattern: /indent|unindent|tabs and spaces|mixed tabs|expected.*indented/i,
      title: 'Il rientro del codice non è corretto',
      why: 'Godot usa il rientro per capire quali righe appartengono allo stesso blocco.',
      hint: 'Confronta la posizione della riga segnalata con le istruzioni vicine.',
      steps: [
        'Le istruzioni dentro func, if o for devono avere un rientro rispetto alla riga che apre il blocco.',
        'Guarda il rientro della prima istruzione del blocco e rendi coerenti le righe dello stesso livello. Evita di mescolare tabulazioni e spazi.'
      ]
    },
    {
      pattern: /unterminated string|unclosed string|expected closing.*quote|string not terminated/i,
      title: 'C’è un testo non chiuso',
      why: 'Godot ha trovato un testo iniziato con le virgolette senza riuscire a trovarne la fine.',
      hint: 'Conta le virgolette presenti nella zona indicata.',
      steps: [
        'Una stringa inizia e termina con lo stesso tipo di virgolette.',
        'Controlla il testo passato alle funzioni nelle righe coinvolte: verifica che ogni apertura abbia la sua chiusura.'
      ]
    },
    {
      pattern: /identifier.*(not declared|not found)|unknown identifier|not declared in the current scope|undeclared identifier/i,
      title: 'Un nome non è riconosciuto',
      why: 'Stai usando un nome che Godot non conosce nel punto in cui lo hai scritto.',
      hint: 'Dove viene creato o dichiarato questo nome?',
      steps: [
        'Una variabile deve esistere prima di poter essere usata e dev’essere visibile nella funzione o nel blocco corretto.',
        'Confronta carattere per carattere il nome usato con quello della dichiarazione: anche le maiuscole e le minuscole contano.'
      ]
    },
    {
      pattern: /invalid operands|invalid operator|cannot (?:convert|assign)|type mismatch|cannot be assigned/i,
      title: 'Stai combinando valori incompatibili',
      why: 'Godot non riesce a eseguire questa operazione con i tipi di dato presenti.',
      hint: 'Quali valori entrano nell’operazione? Sono numeri, testi o altri tipi?',
      steps: [
        'Per calcolare o confrontare valori, il tipo dei dati fa la differenza. Un testo non è automaticamente un numero.',
        'Controlla i valori prima dell’operazione e verifica se puoi usare tipi compatibili, senza cambiare l’obiettivo dell’esercizio.'
      ]
    },
    {
      pattern: /invalid (?:get|set)|nil|null instance|nonexistent function|invalid call/i,
      title: 'Chiamata o accesso non valido',
      why: 'Il programma prova a usare una proprietà o una funzione che l’oggetto non mette a disposizione.',
      hint: 'Controlla quale oggetto stai utilizzando e cosa stai chiedendogli di fare.',
      steps: [
        'Un metodo appartiene a determinati tipi di oggetto. Non tutte le funzioni funzionano su qualunque nodo o valore.',
        'Verifica che il riferimento non sia nullo e che il nome della funzione o della proprietà appartenga davvero al tipo usato.'
      ]
    },
    {
      pattern: /expected.*\)|expected.*\]|expected.*\}/i,
      title: 'Manca una chiusura',
      why: 'Godot ha trovato una parentesi o un altro delimitatore senza la sua chiusura.',
      hint: 'Controlla le aperture e le chiusure nella riga indicata.',
      steps: [
        'Ogni parentesi aperta richiede una parentesi dello stesso tipo per chiudere il gruppo.',
        'Controlla anche la riga prima di quella segnalata: a volte Godot si accorge del problema soltanto all’istruzione successiva.'
      ]
    }
  ];

  // Scansione lessicale locale, senza AI: evita falsi allarmi per caratteri
  // contenuti in stringhe, commenti o stringhe multilinea di GDScript.
  // Serve quando Godot segnala un altro problema prima del delimitatore aperto.
  function unclosedDelimiter(source) {
    const text=String(source||'');
    const closers={'(':')','[':']','{':'}'};
    const stack=[];
    let quote='', triple=false,escaped=false,comment=false,line=1;
    for(let i=0;i<text.length;i++){
      const ch=text[i];
      if(ch==='\n'){
        line++;
        comment=false;
        if(quote && !triple)escaped=false;
        continue;
      }
      if(comment)continue;
      if(quote){
        if(escaped){escaped=false;continue;}
        if(ch==='\\'){escaped=true;continue;}
        if(triple){
          if(text.slice(i,i+3)===quote.repeat(3)){quote='';triple=false;i+=2;}
        }else if(ch===quote)quote='';
        continue;
      }
      if(ch==='#'){comment=true;continue;}
      if(ch==='"'||ch==="'"){
        triple=text.slice(i,i+3)===ch.repeat(3);
        quote=ch;
        if(triple)i+=2;
        continue;
      }
      if(closers[ch])stack.push({open:ch,close:closers[ch],line});
      else if(ch===')'||ch===']'||ch==='}'){
        if(stack.at(-1)?.close===ch)stack.pop();
        else return null; // delimitatori non corrispondenti: lascia giudicare Godot
      }
    }
    if(quote||!stack.length)return null;
    return stack.at(-1);
  }
  function classBodyAdvice(message) {
    const match=String(message).match(/Unexpected (?:identifier|token) ["']([^"']+)["'] in class body/i);
    if(!match)return null;
    const name=match[1];
    return {
      title:'Istruzione fuori da una funzione',
      why:'Godot ha trovato "'+name+'" direttamente nel corpo dello script, ma qui possono stare dichiarazioni come var e func. Le istruzioni eseguibili, per esempio print(...), vanno dentro una funzione come func _ready(): e devono essere indentate.',
      hint:'Hai inserito questa istruzione dentro func _ready(): oppure dentro un’altra funzione?',
      steps:[
        'In GDScript le istruzioni vengono eseguite dentro funzioni. All’inizio dello script puoi invece dichiarare variabili, costanti e funzioni.',
        'Se vuoi eseguire una stampa all’avvio, usa una funzione come _ready() e indenta le istruzioni al suo interno.'
      ]
    };
  }
  function functionAdvice(message) {
    const match = String(message).match(/Function\s+["']([^"']+?)["']\s+not found in base self/i);
    if (!match) return null;
    const name = match[1].replace(/\(\)$/, '');
    return {
      title: 'Funzione non riconosciuta',
      why: 'Godot ha trovato la chiamata "' + name + '()", ma non conosce una funzione con questo nome in questo script.',
      hint: 'Rileggi il nome della funzione che hai scritto: potrebbe esserci una lettera in più, mancante o fuori posto.',
      steps: [
        'Ripensa allo scopo di questa riga: vuoi stampare un testo, eseguire un calcolo o richiamare una funzione creata da te? Cerca il comando corrispondente nella teoria.',
        'Confronta una lettera alla volta il nome nella riga con quello della funzione che hai studiato. Puoi aiutarti con i suggerimenti automatici dell’editor, senza riscrivere tutto il programma.'
      ]
    };
  }
  function diagnose({source = '', error = '', failedTest = null, verdict = ''} = {}) {
    const raw = cut(error);
    const failure = cut(failedTest?.diff || failedTest?.desc || '', 800);
    if (!raw && !failure) return null;

    const engine = Boolean(raw);
    let line = engine ? lineOf(raw, source) : null;
    const infra = engine && /failed to fetch|networkerror|motore godot non disponibile|failed to load.*wasm|webassembly.*failed/i.test(raw);
    const timedOut = engine && !infra && (verdict === 'timeout' || /timed out|timeout|time limit exceeded/i.test(raw));
    const syntax = engine && !infra && !timedOut &&
      /parse error|parser error|syntax error|unexpected token|expected.*(?:colon|:|indent)|not declared in the current scope|function\s+["'][^"']+["']\s+not found in base self/i.test(raw);
    const missingClose = syntax ? unclosedDelimiter(source) : null;
    const category = infra ? 'system' : timedOut ? 'timeout' :
      !engine ? 'requirement' : syntax ? 'syntax' : 'runtime';
    let title, why, hint, steps;
    if (infra) {
      title = 'La verifica non è riuscita ad avviarsi';
      why = 'Il motore Godot non è disponibile in questo momento: questo non dimostra che il tuo codice sia sbagliato.';
      hint = 'Riprova la verifica. Se continua a non funzionare, ricarica la pagina.';
      steps = [];
    } else if (timedOut) {
      title = 'Il programma impiega troppo tempo';
      why = 'L’esecuzione non è terminata nel tempo disponibile.';
      hint = 'Controlla se il programma può terminare o se continua a ripetere le stesse istruzioni.';
      steps = [
        'Un ciclo while continua finché la condizione è vera. Che cosa deve accadere perché diventi falsa?',
        'Segui a mente due o tre iterazioni del ciclo: un valore cambia davvero, oppure rimane sempre uguale?'
      ];
    } else if (missingClose) {
      // Non basarsi solo sull'errore che Godot segnala per primo:
      // nello script libero, print("ciao" da' Unexpected identifier prima
      // di arrivare al delimitatore mancante.
      line = missingClose.line;
      const names={'(': 'parentesi tonda', '[': 'parentesi quadra', '{': 'parentesi graffa'};
      title='Manca una '+names[missingClose.open]+' di chiusura ('+missingClose.close+')';
      why='Alla riga '+missingClose.line+' hai aperto '+missingClose.open+
        ' ma non hai inserito la corrispondente '+missingClose.close+
        '. La chiusura serve a completare la chiamata o l’espressione.';
      const isTopLevelPrint=String(source).split(/\r?\n/).some((row,index)=>
        index+1===missingClose.line && /^print\s*\(/.test(row));
      if(isTopLevelPrint && /Unexpected identifier ["']print["'] in class body/i.test(raw)){
        why+=' Godot segnala anche che print(...) è fuori da una funzione: inseriscila in _ready() o in un’altra funzione.';
      }
      hint='Cerca la '+missingClose.open+' aperta alla riga '+missingClose.line+
        ': con quale simbolo va chiusa?';
      steps=[
        'Ogni '+missingClose.open+' deve avere una '+missingClose.close+
          ', anche quando ci sono stringhe o altre parentesi dentro.',
        isTopLevelPrint
          ? 'Inoltre, per eseguire print all’avvio in Godot, scrivila dentro func _ready(): e rientra la chiamata.'
          : 'Rileggi l’istruzione dalla prima apertura e controlla che i delimitatori siano chiusi nell’ordine corretto.'
      ];
    } else if (engine) {
      const match = functionAdvice(raw) || classBodyAdvice(raw) || rules.find(rule => rule.pattern.test(raw));
      if (match) ({title, why, hint, steps} = match);
      else if (syntax) {
        title = 'Godot non riesce a leggere un’istruzione';
        why = 'Una parte del codice non segue la sintassi di GDScript, quindi il programma non può partire.';
        hint = 'Parti dalla zona segnalata e cerca un simbolo o un nome diverso dagli esempi studiati.';
        steps = [
          'Controlla i segni che formano la struttura delle istruzioni: virgolette, parentesi, due punti e rientro.',
          'Isola una sola istruzione e confrontala con un esempio della lezione. Verifica anche la riga precedente a quella segnalata.'
        ];
      } else {
        title = 'Un’istruzione si blocca durante l’esecuzione';
        why = 'Godot ha iniziato a elaborare il programma, ma non è riuscito a completare un’operazione.';
        hint = 'Chiediti quale valore o quale oggetto usa l’istruzione coinvolta.';
        steps = [
          'Controlla da dove provengono i valori usati in quel punto e se l’oggetto esiste davvero.',
          'Segui l’ordine delle istruzioni fino al punto in cui avviene il problema: un valore potrebbe non essere ancora pronto.'
        ];
      }
    } else {
      title = 'Il programma funziona, ma manca un requisito';
      why = 'Godot ha eseguito il programma, ma il risultato non corrisponde ancora a tutti i requisiti della consegna.';
      hint = 'Confronta un requisito alla volta con ciò che il programma produce realmente.';
      steps = [
        'Parti dalla consegna: quali valori, testi oppure comportamenti sono richiesti? Confrontali con ciò che ottieni, senza modificare più istruzioni insieme.',
        'Se ci sono stampe, controlla anche l’ordine delle righe, gli spazi e i simboli. Se il compito richiede un comportamento, verifica quando accade e con quali valori.'
      ];
    }
    return Object.freeze({
      kind: engine ? 'engine' : 'requirement',
      category, title, why, hint, steps: Object.freeze([...(steps || [])]), line,
      raw: engine ? raw : '', requirement: failure, exact: line !== null
    });
  }
  function clear(container) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (host) host.querySelectorAll(':scope > .gdh-debug-panel').forEach(node => node.remove());
  }
  function render(container, diagnosis, onLine, onHint) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!host) return;
    clear(host);
    if (!diagnosis) return;
    const card = document.createElement('section');
    card.className = 'gdh-debug-panel';
    card.dataset.kind = diagnosis.kind;
    card.dataset.category = diagnosis.category;
    card.setAttribute('aria-label', 'Guida alla correzione');
    const top = document.createElement('div');
    top.className = 'gdh-debug-top';
    const tag = document.createElement('span');
    tag.className = 'gdh-debug-tag';
    tag.textContent = ({
      syntax: 'SINTASSI', runtime: 'ESECUZIONE', requirement: 'REQUISITO',
      timeout: 'TEMPO ESAURITO', system: 'VERIFICA NON DISPONIBILE'
    })[diagnosis.category] || 'ERRORE GODOT';
    const heading = document.createElement('strong');
    heading.textContent = diagnosis.title;
    top.append(tag, heading);
    card.append(top);

    const label = document.createElement('strong');
    label.className = 'gdh-debug-section-label';
    label.textContent = 'Che cosa significa';
    const explain = document.createElement('p');
    explain.className = 'gdh-debug-explanation';
    explain.textContent = diagnosis.why;
    card.append(label, explain);

    if (diagnosis.line !== null && typeof onLine === 'function') {
      const jump = document.createElement('button');
      jump.type = 'button';
      jump.className = 'gdh-debug-jump';
      jump.textContent = 'Vai alla riga ' + diagnosis.line;
      jump.addEventListener('click', () => onLine(diagnosis.line));
      card.append(jump);
    } else if (diagnosis.kind === 'engine' && diagnosis.category !== 'system') {
      const where = document.createElement('small');
      where.className = 'gdh-debug-location';
      where.textContent = 'Godot non ha fornito una riga attendibile per questo problema.';
      card.append(where);
    }

    const box = document.createElement('div');
    box.className = 'gdh-debug-hint';
    const hintTitle = document.createElement('strong');
    hintTitle.textContent = diagnosis.category === 'system' ? 'Che cosa puoi fare' : 'Da dove iniziare';
    const hint = document.createElement('p');
    hint.textContent = diagnosis.hint;
    box.append(hintTitle, hint);
    card.append(box);

    if (diagnosis.steps?.length) {
      const progress = document.createElement('div');
      progress.className = 'gdh-debug-steps';
      const count = document.createElement('p');
      count.className = 'gdh-debug-steps-status';
      count.textContent = 'Se non basta, puoi chiedere altri indizi. Nessuna soluzione viene inserita nel codice.';
      progress.append(count);
      const extra = document.createElement('div');
      extra.className = 'gdh-debug-steps-revealed';
      extra.setAttribute('aria-live','polite');
      progress.append(extra);
      const next = document.createElement('button');
      next.className = 'gdh-debug-next-hint';
      next.type = 'button';
      let shown = 0;
      const update = () => {
        if (shown >= diagnosis.steps.length) {
          next.remove();
          count.textContent = 'Hai letto tutti gli indizi. Prova a correggere il codice e verifica di nuovo.';
        } else {
          next.textContent = 'Mostra indizio ' + (shown + 1) + ' di ' + diagnosis.steps.length;
        }
      };
      next.addEventListener('click', () => {
        if (shown >= diagnosis.steps.length) return;
        shown++;
        const row = document.createElement('div');
        row.className = 'gdh-debug-step';
        const title = document.createElement('strong');
        title.textContent = 'Indizio ' + shown;
        const description = document.createElement('p');
        description.textContent = diagnosis.steps[shown - 1];
        row.append(title, description);
        extra.append(row);
        if (typeof onHint === 'function') onHint(shown);
        update();
      });
      progress.append(next);
      update();
      card.append(progress);
    }

    if (diagnosis.requirement) {
      const details = document.createElement('details');
      details.className = 'gdh-debug-technical';
      const summary = document.createElement('summary');
      summary.textContent = 'Dettaglio del controllo non superato';
      const pre = document.createElement('pre');
      pre.textContent = diagnosis.requirement;
      details.append(summary, pre);
      card.append(details);
    }
    if (diagnosis.raw) {
      const details = document.createElement('details');
      details.className = 'gdh-debug-technical';
      const summary = document.createElement('summary');
      summary.textContent = 'Messaggio tecnico originale (facoltativo)';
      const pre = document.createElement('pre');
      pre.textContent = diagnosis.raw;
      details.append(summary, pre);
      card.append(details);
    }
    host.append(card);
    return card;
  }
  function clearMark(editor) {
    if (!editor) return;
    if (editor._gdhErrorScroll) {
      editor.removeEventListener('scroll', editor._gdhErrorScroll);
      delete editor._gdhErrorScroll;
    }
    const stack = editor.closest('.gdscript-edit-stack');
    stack?.querySelector('.gdh-error-row')?.remove();
    const gutter = stack?.parentElement?.querySelector('.line-numbers');
    if (gutter && gutter.dataset.gdhErrorDecorated === 'true') {
      gutter.textContent = Array.from({length: editor.value.split('\n').length}, (_, i) => i + 1).join('\n');
      delete gutter.dataset.gdhErrorDecorated;
      gutter.scrollTop = editor.scrollTop;
    }
  }
  function mark(editor, line) {
    clearMark(editor);
    if (!editor || !Number.isSafeInteger(line) || line < 1 ||
        line > editor.value.split('\n').length) return;
    const stack = editor.closest('.gdscript-edit-stack');
    if (!stack) return;
    const row = document.createElement('div');
    row.className = 'gdh-error-row';
    row.setAttribute('aria-hidden', 'true');
    stack.prepend(row);
    const gutter = stack.parentElement?.querySelector('.line-numbers');
    if (gutter) {
      const fragment = document.createDocumentFragment();
      editor.value.split('\n').forEach((_, index) => {
        const number = document.createElement('span');
        number.className = 'gdh-editor-line-number' + (index + 1 === line ? ' gdh-error-number' : '');
        number.textContent = String(index + 1);
        fragment.append(number);
      });
      gutter.replaceChildren(fragment);
      gutter.dataset.gdhErrorDecorated = 'true';
    }
    const place = () => {
      const style = getComputedStyle(editor);
      const height = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) || 14) * 1.6;
      const padding = parseFloat(style.paddingTop) || 0;
      row.style.top = (padding + (line - 1) * height - editor.scrollTop) + 'px';
      row.style.height = height + 'px';
      if (gutter) gutter.scrollTop = editor.scrollTop;
    };
    editor._gdhErrorScroll = place;
    editor.addEventListener('scroll', place);
    place();
    // Rendi la riga visibile senza spostare il focus dalla scheda di spiegazione.
    const style = getComputedStyle(editor);
    const height = parseFloat(style.lineHeight) || 22;
    const relative = (line - 1) * height - editor.scrollTop;
    if (relative < 0 || relative > editor.clientHeight - height * 2) {
      editor.scrollTop = Math.max(0, (line - 3) * height);
      place();
    }
  }
  function jump(editor, line) {
    if (!editor || !Number.isSafeInteger(line) || line < 1) return;
    const rows = editor.value.split('\n');
    if (line > rows.length) return;
    const start = rows.slice(0, line - 1).reduce((sum, row) => sum + row.length + 1, 0);
    editor.focus({preventScroll: true});
    editor.setSelectionRange(start, start + rows[line - 1].length);
    const height = parseFloat(getComputedStyle(editor).lineHeight) || 22;
    editor.scrollTop = Math.max(0, (line - 3) * height);
    editor._gdhErrorScroll?.();
  }
  root.GDHErrorGuide = Object.freeze({diagnose, render, clear, mark, clearMark, jump});
})(typeof window !== 'undefined' ? window : globalThis);
