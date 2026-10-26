'use strict';
const byId = id => document.getElementById(id);
const status = byId('status'), output = byId('stdout'), errors = byId('stderr'), result = byId('result');
let requestId = 0, currentlyRunning = false;
window.gdhReady = () => { status.textContent = 'Godot pronto'; byId('run').disabled = false; };
window.gdhResult = raw => {
  let reply;
  try { reply = JSON.parse(raw); } catch (err) { errors.textContent += String(err); return; }
  if (reply.id !== requestId) return;
  result.textContent = JSON.stringify(reply, null, 2);
  currentlyRunning = false; byId('run').disabled = false;
};
byId('run').addEventListener('click', () => {
  if (typeof window.gdhReceive !== 'function' || currentlyRunning) return;
  requestId++; currentlyRunning = true;
  output.textContent = ''; errors.textContent = ''; result.textContent = '';
  byId('run').disabled = true;
  window.gdhReceive(JSON.stringify({id: requestId, code: byId('source').value, inspect: ['answer']}));
});
byId('invalid').addEventListener('click', () => {
  byId('source').value = 'extends Node\nfunc _ready():\n    var x: int = "wrong"\n';
});
if (typeof Engine !== 'function') {
  status.textContent = 'godot.js non presente: esporta il progetto con Godot 4.4.1';
} else {
  const engine = new Engine({canvas: byId('canvas'), executable: 'godot', mainPack: 'godot.pck'});
  engine.startGame({
    onPrint: (...args) => { if (currentlyRunning) output.textContent += args.join(' ') + '\n'; },
    onPrintError: (...args) => { if (currentlyRunning) errors.textContent += args.join(' ') + '\n'; },
  }).catch(err => { status.textContent = String(err); });
}
