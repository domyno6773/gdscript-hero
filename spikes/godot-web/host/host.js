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
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.referrerPolicy = 'no-referrer';
    frame.title = 'Godot runner — origin separato';
    frame.src = RUNNER_ORIGIN + '/isolated.html?session=' + encodeURIComponent(session);
    byId('runner-mount').append(frame);
    byId('generation').textContent = 'Generazione motore: ' + generation;
    setStatus(reason + ' · caricamento Godot…');
  };

  // Each scenario runs as a separate native Godot request, without altering the editor text.
  // This is local instructional feedback, NOT an anti-tamper grading boundary.
  const startStep = () => {
    if (!active || !frame) return;
    const step = active.steps[active.phase];
    const id = ++nextId;
    active.id = id;
    frame.contentWindow.postMessage({
      v: VERSION, type: 'run', session, id, code: step.code,
      inspect: active.lesson ? active.lesson.properties : ['answer'],
      locals: active.lesson ? active.lesson.locals : [],
      calls: step.key === 'base' && active.lesson ? active.lesson.calls || [] : [],
      emissions: step.key==='base' && active.lesson ? active.lesson.emissions||[]:[],
      objectCalls: step.key==='base' && active.lesson ? active.lesson.objectCalls||[]:[]
    }, '*');
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      if (active && active.id === id) {
        byId('result').textContent = JSON.stringify({id, status:'timeout', reset:true},null,2);
        if (document.getElementById('grade')) {
          document.getElementById('grade').textContent = JSON.stringify({
            passed:false,reason:'Timeout in '+step.key+', nessuna validazione'
          });
        }
        reset('Timeout, contesto precedente eliminato');
      }
    }, TIMEOUT_MS);
  };

  window.addEventListener('message', event => {
    if (event.origin !== 'null' || !frame || event.source !== frame.contentWindow) {
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
    const step = active.steps[active.phase];
    active.outputs[step.key] = {reply:m.reply, stdout:m.stdout, stderr:m.stderr};
    if (active.phase + 1 < active.steps.length) {
      active.phase++;
      setStatus('Prova di comportamento '+active.phase+'/'+(active.steps.length-1)+'…');
      startStep();
      return;
    }
    const completed = active;
    active = null;
    const base = completed.outputs.base;
    byId('stdout').textContent = base.stdout;
    byId('stderr').textContent = base.stderr;
    byId('result').textContent = JSON.stringify(base.reply, null, 2).slice(0, 34000);
    byId('run').disabled = false;
    if (completed.lesson && window.GDHLessonLab && document.getElementById('grade')) {
      const feedback = window.GDHLessonLab.grade(
        completed.lesson.id, completed.code, base.reply, base.stdout, base.stderr, completed.outputs
      );
      document.getElementById('grade').textContent = JSON.stringify(feedback, null, 2);
    }
    setStatus('Esecuzione conclusa · valutazione locale sperimentale e non attendibile');
  });

  byId('run').addEventListener('click', () => {
    if (!ready || active || !frame) return;
    const code = byId('code').value;
    if (code.length > LIMIT_CODE) {
      setStatus('Massimo 10000 caratteri'); return;
    }
    const lesson = window.GDHLessonLab && document.getElementById('lesson') ? window.GDHLessonLab.get(Number(document.getElementById('lesson').value)) : null;
    const extra = lesson && window.GDHLessonLab ? window.GDHLessonLab.scenarios(lesson.id, code) : [];
    active = {id:null, code, lesson, phase:0, outputs:{},
      steps:[{key:'base',code}, ...extra]};
    byId('run').disabled = true;
    byId('stdout').textContent = '';
    byId('stderr').textContent = '';
    byId('result').textContent = '';
    if (document.getElementById('grade')) document.getElementById('grade').textContent = '';
    setStatus('Esecuzione in corso…');
    startStep();
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
