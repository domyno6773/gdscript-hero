'use strict';
// Security proof only. It intentionally accepts untrusted *display data*, never grades, secrets or entitlements.
// Runner and host must be served from DIFFERENT origins. Production must pin the runner origin in configuration.
(() => {
  const RUNNER_ORIGIN = 'http://localhost:18768'; // local CI / PoC only
  const VERSION = 1;
  const TIMEOUT_MS = 4500;
  const LIMIT_CODE = 10000;
  const byId = id => document.getElementById(id);
  const setStatus = text => { byId('status').textContent = text; };
  let session, frame, generation = 0, nextId = 0, active = null, ready = false, timer = null, rejected = 0;
  if (location.origin === RUNNER_ORIGIN) {
    setStatus('BLOCCATO: runner e interfaccia devono avere origini differenti');
    return;
  }

  const reset = reason => {
    if (timer !== null) clearTimeout(timer);
    timer = null; active = null; ready = false;
    byId('run').disabled = true;
    if (frame) {
      frame.remove(); // Cancella il contesto (da verificare contro loop infiniti nel browser).
      frame = null;
    }
    generation++;
    session = crypto.randomUUID();
    frame = document.createElement('iframe');
    frame.id = 'isolated-runner';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.referrerPolicy = 'no-referrer';
    frame.title = 'Godot runner — origin separato';
    frame.src = RUNNER_ORIGIN + '/isolated.html?session=' + encodeURIComponent(session);
    byId('runner-mount').append(frame);
    byId('generation').textContent = 'Generazione motore: ' + generation;
    setStatus(reason + ' · caricamento Godot…');
  };

  window.addEventListener('message', event => {
    if (event.origin !== RUNNER_ORIGIN || !frame || event.source !== frame.contentWindow) {
      rejected++; return;
    }
    const m = event.data;
    if (!m || typeof m !== 'object' || m.v !== VERSION || m.session !== session) {
      rejected++; return;
    }
    if (m.type === 'ready') {
      if (ready || active !== null) return;
      ready = true;
      byId('run').disabled = false;
      setStatus('Godot pronto — origin differente');
      return;
    }
    if (m.type === 'error' && typeof m.message === 'string') {
      setStatus('Errore nel runner: ' + m.message.slice(0, 200));
      return;
    }
    if (m.type !== 'result' || !active || m.id !== active.id) {
      rejected++; return;
    }
    // Tutto ciò che proviene da Godot è non fidato. Visualizzare solo con textContent.
    if (typeof m.stdout !== 'string' || typeof m.stderr !== 'string' ||
        m.stdout.length > 33000 || m.stderr.length > 33000 ||
        !m.reply || typeof m.reply !== 'object') {
      rejected++; return;
    }
    if (timer !== null) clearTimeout(timer);
    timer = null;
    const id = active.id;
    active = null;
    byId('stdout').textContent = m.stdout;
    byId('stderr').textContent = m.stderr;
    byId('result').textContent = JSON.stringify({id, ...m.reply}, null, 2).slice(0, 34000);
    byId('run').disabled = false;
    setStatus('Esecuzione conclusa · risultati non affidabili per il grading');
  });

  byId('run').addEventListener('click', () => {
    if (!ready || active || !frame) return;
    const code = byId('code').value;
    if (code.length > LIMIT_CODE) {
      setStatus('Massimo 10000 caratteri'); return;
    }
    const id = ++nextId;
    active = {id};
    byId('run').disabled = true;
    byId('stdout').textContent = '';
    byId('stderr').textContent = '';
    byId('result').textContent = '';
    setStatus('Esecuzione in corso…');
    frame.contentWindow.postMessage({v: VERSION, type:'run', session, id, code, inspect:['answer']}, RUNNER_ORIGIN);
    timer = setTimeout(() => {
      if (active && active.id === id) {
        byId('result').textContent = JSON.stringify({id, status:'timeout', reset:true},null,2);
        reset('Timeout, contesto precedente eliminato');
      }
    }, TIMEOUT_MS);
  });
  byId('restart').addEventListener('click', () => reset('Riavvio manuale'));
  byId('invalid').addEventListener('click', () => {
    byId('code').value = 'extends Node\nfunc _ready():\n    var value: int = "not an int"\n';
  });
  // Read-only indicators only for test assertions; never a privileged grading interface.
  window.__gdhIsolation = Object.freeze({
    get generation(){return generation;}, get rejected(){return rejected;},
    get active(){return Boolean(active);}, get ready(){return ready;},
    get runnerOrigin(){return RUNNER_ORIGIN;}
  });
  reset('Primo avvio');
})();
