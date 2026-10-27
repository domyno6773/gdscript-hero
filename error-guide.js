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
  const rules = [
    {
      pattern: /expected\s*["']?:["']?|expected.*colon|missing.*colon/i,
      title: 'Mancano i due punti (:)',
      why: 'Per aprire un blocco, come una condizione if o una funzione, GDScript richiede i due punti alla fine della riga.',
      hint: 'Controlla la fine della riga che apre il blocco e assicurati che le istruzioni sotto siano rientrate.'
    },
    {
      pattern: /indent|unindent|tabs and spaces|mixed tabs|expected.*indented/i,
      title: 'Il rientro del codice non è corretto',
      why: 'In GDScript gli spazi a inizio riga indicano quali istruzioni appartengono a una funzione, a un if o a un ciclo.',
      hint: 'Confronta il rientro delle righe vicine. Dopo un blocco che termina con : serve un livello di indentazione in più.'
    },
    {
      pattern: /unterminated string|unclosed string|expected closing.*quote|string not terminated/i,
      title: 'Manca una virgoletta di chiusura',
      why: 'Hai iniziato a scrivere un testo tra virgolette, ma il testo non è stato chiuso.',
      hint: 'Trova la stringa nella riga segnalata e controlla che le virgolette siano presenti sia all’inizio sia alla fine.'
    },
    {
      pattern: /identifier.*(not declared|not found)|unknown identifier|not declared in the current scope|undeclared identifier/i,
      title: 'Una variabile o un nome non è riconosciuto',
      why: 'Il codice utilizza un nome che Godot non conosce in questo punto dello script.',
      hint: 'Controlla se hai dichiarato la variabile, se si trova nell’ambito giusto e se hai scritto correttamente maiuscole e minuscole.'
    },
    {
      pattern: /invalid operands|invalid operator|cannot (?:convert|assign)|type mismatch|cannot be assigned/i,
      title: 'L’operazione usa valori incompatibili',
      why: 'Stai combinando due valori che non possono essere utilizzati insieme in quell’operazione.',
      hint: 'Osserva il tipo dei valori coinvolti: ad esempio, un numero e un testo non sempre possono essere sommati direttamente.'
    },
    {
      pattern: /invalid (?:get|set)|nil|null instance|nonexistent function|invalid call/i,
      title: 'Stai usando un oggetto o una funzione in modo non valido',
      why: 'Godot non riesce a eseguire un accesso o una chiamata: l’oggetto potrebbe non esistere oppure quella funzione non è disponibile.',
      hint: 'Verifica che l’oggetto sia presente e che la proprietà o la funzione appartenga davvero a quell’oggetto.'
    },
    {
      pattern: /expected.*\)|expected.*\]|expected.*\}/i,
      title: 'Manca una parentesi di chiusura',
      why: 'Godot ha trovato una parentesi aperta senza la chiusura corrispondente.',
      hint: 'Controlla le parentesi nella riga indicata e nelle righe immediatamente precedenti.'
    }
  ];
  function functionAdvice(message) {
    const match = String(message).match(/Function\s+["']([^"']+?)["']\s+not found in base self/i);
    if (!match) return null;
    const name = match[1].replace(/\(\)$/, '');
    const suggestions = { prin: 'print', pritn: 'print', pirnt: 'print', prnt: 'print',
      rng: 'range', strr: 'str' };
    const suggestion = suggestions[name.toLowerCase()];
    return {
      title: 'Funzione non riconosciuta',
      why: 'Hai chiamato "' + name + '()", ma Godot non trova una funzione con questo nome.',
      hint: suggestion
        ? 'Controlla il nome: forse intendevi "' + suggestion + '()". In GDScript anche una sola lettera diversa cambia il significato.'
        : 'Controlla l’ortografia della funzione e verifica che sia disponibile in questo script. Maiuscole e minuscole contano.'
    };
  }
  function diagnose({source = '', error = '', failedTest = null, verdict = ''} = {}) {
    const raw = cut(error);
    const failure = cut(failedTest?.diff || failedTest?.desc || '', 800);
    if (!raw && !failure) return null;
    const engine = Boolean(raw);
    const line = engine ? lineOf(raw, source) : null;
    let title, why, hint;
    if (engine) {
      const infra = /failed to fetch|networkerror|motore godot non disponibile|failed to load.*wasm/i.test(raw);
      const match = !infra && functionAdvice(raw) || (!infra && rules.find(rule => rule.pattern.test(raw)));
      if (infra) {
        title = 'La verifica non è riuscita ad avviarsi';
        why = 'Il motore di verifica non è disponibile in questo momento. Non significa che il codice sia sbagliato.';
        hint = 'Riprova la verifica. Se il problema persiste, ricarica la pagina.';
      } else if (match) {
        ({title, why, hint} = match);
      } else if (verdict === 'timeout') {
        title = 'Il programma impiega troppo tempo';
        why = 'L’esecuzione non è terminata entro il tempo disponibile.';
        hint = 'Controlla se hai creato un ciclo che potrebbe non terminare.';
      } else if (/parse error|parser error|syntax error|unexpected token/i.test(raw)) {
        title = 'Godot non riesce a interpretare un’istruzione';
        why = 'Una parte del codice non rispetta la sintassi di GDScript, quindi il programma non può partire.';
        hint = 'Controlla parentesi, virgolette, due punti e nomi delle istruzioni nella zona segnalata.';
      } else {
        title = 'Un’istruzione non può essere completata';
        why = 'Il motore si è fermato mentre cercava di usare una funzione, un valore o un oggetto del programma.';
        hint = 'Controlla che le variabili abbiano un valore valido e che gli oggetti e le funzioni utilizzati esistano.';
      }
    } else {
      title = 'Il programma funziona, ma manca un requisito';
      why = 'Godot ha eseguito il codice, ma il risultato non soddisfa ancora tutta la consegna.';
      hint = 'Confronta il risultato con ciò che chiede l’esercizio: controlla valori, ordine delle istruzioni e testo stampato.';
    }
    return Object.freeze({
      kind: engine ? 'engine' : 'requirement', title, why, hint, line,
      raw: engine ? raw : '', requirement: failure, exact: line !== null
    });
  }
  function clear(container) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (host) host.querySelectorAll(':scope > .gdh-debug-panel').forEach(node => node.remove());
  }
  function render(container, diagnosis, onLine) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!host) return;
    clear(host);
    if (!diagnosis) return;
    const card = document.createElement('section');
    card.className = 'gdh-debug-panel';
    card.dataset.kind = diagnosis.kind;
    card.setAttribute('aria-label', 'Guida alla correzione');
    const top = document.createElement('div');
    top.className = 'gdh-debug-top';
    const tag = document.createElement('span');
    tag.className = 'gdh-debug-tag';
    tag.textContent = diagnosis.kind === 'engine' ? 'ERRORE GODOT' : 'REQUISITO';
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
    } else if (diagnosis.kind === 'engine') {
      const where = document.createElement('small');
      where.className = 'gdh-debug-location';
      where.textContent = 'Godot non ha fornito una riga attendibile per questo problema.';
      card.append(where);
    }
    const box = document.createElement('div');
    box.className = 'gdh-debug-hint';
    const hintTitle = document.createElement('strong');
    hintTitle.textContent = 'Come provare a correggerlo';
    const hint = document.createElement('p');
    hint.textContent = diagnosis.hint;
    box.append(hintTitle, hint);
    card.append(box);
    if (diagnosis.requirement) {
      const req = document.createElement('p');
      req.className = 'gdh-debug-requirement';
      req.textContent = diagnosis.requirement;
      card.append(req);
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
