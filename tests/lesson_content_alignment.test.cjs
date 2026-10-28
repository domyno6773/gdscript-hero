'use strict';
// Lezione, consegna e indizi devono rimanere coerenti.
// Esegui: node tests/lesson_content_alignment.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'lessons.js'), 'utf8');
const context = vm.createContext({ window: {}, console });
vm.runInContext(source, context, { filename: 'lessons.js' });
const lessons = context.window.LESSONS_DATA;
assert.equal(lessons.length, 60, 'Il corso deve conservare tutte le 60 lezioni');
const targets = {
    8: ['title', 'npc_line', 'door_code'],
    12: ['MAX_HP', 'scudo_attivo', ':='],
    13: ['somma', 'prodotto'],
    24: ['append', 'erase', 'has', 'size'],
    28: ['nemici', 'xp_totali', '+= 25'],
    35: ['pos.x', 'pos.y'],
    36: ['posizione.x', 'posizione.y', 'stazione'],
    40: ['boss', 'hp', 'furia'],
    47: ['colpo_caricato', 'attacco', 'return'],
    48: ['Avventuriero', 'membro1', 'membro2', 'vita_totale'],
    51: ['$SaluteLabel', '.text'],
    55: ['$ClickBtn', '$PuntiLabel', 'punti'],
    56: ['$MotoriBtn', '$AllarmeBtn', '$StatoNave'],
    60: ['$CompraPozioneBtn', '$OroLabel', '$MessaggioLabel', 'monete']
};
const obsolete = {
    8: ['nome_personaggio', 'classe_ruolo'],
    13: ['xp_totali'],
    28: ['somma += n', 'monete_casse'],
    35: ['nuova_posizione = posizione + velocita'],
    36: ['.length()'],
    40: ['armatura', 'torace'],
    48: ['subisci_danno', 'guarisci'],
    51: ['Moneta Speciale', 'get_node('],
    55: ['.modulate', '$Riquadro'],
    56: ['.modulate', '$Sfondo'],
    60: ['TimerPartita', 'queue_free()', '$Ostacolo']
};
for (const lesson of lessons) {
    assert.ok(Array.isArray(lesson.hints) && lesson.hints.length === 3, 'Tre indizi per lezione ' + lesson.id);
    for (let i = 0; i < 3; i++) {
        assert.equal(lesson.hints[i].level, i + 1, 'Ordine indizi lezione ' + lesson.id);
        assert.ok(typeof lesson.hints[i].text === 'string' && lesson.hints[i].text.trim(), 'Testo indizio vuoto lezione ' + lesson.id);
    }
    const hints = lesson.hints.map(x => x.text).join(' ');
    for (const term of targets[lesson.id] || [])
        assert.ok(hints.includes(term), 'Lezione ' + lesson.id + ': indizi privi del requisito ' + term);
    for (const term of obsolete[lesson.id] || [])
        assert.ok(!hints.includes(term), 'Lezione ' + lesson.id + ': riferimento non pertinente ' + term);
}
const oop = lessons.find(x => x.id === 48);
assert.ok(!(/CORSO GODOT 4 COMPLETATO|Sfida Finale del Corso/i.test(oop.theory + ' ' + oop.aiExplanation)),
    'La lezione 48 conclude il capitolo 12, non tutto il corso');
console.log('OK: 60 lezioni con tre indizi ordinati e 14 interventi didattici verificati.');
