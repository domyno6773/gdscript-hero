'use strict';

// Suite ufficiale per evitare regressioni nei 60 esercizi e 17 ripassi.
// Avvio: node tests/audit_validator_regression.test.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {}, console, Date });
for (const file of ['runtime.js', 'lessons.js', 'review_variants.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
}
const runtime = context.window.GDScriptRuntime;
const lessons = context.window.LESSONS_DATA;
const reviews = context.window.REVIEW_VARIANTS;

const lessonMutations = [
    [25, s => s.replace('range(3)', 'range(0)') + '    print(0)\n    print(1)\n    print(2)\n'],
    [26, s => s.replace('print(nemico)', 'pass') + '    print("Goblin")\n    print("Orco")\n    print("Drago")\n'],
    [27, s => s.replace('print("Conto: " + str(conto))', 'pass') + '    print("Conto: 1")\n    print("Conto: 2")\n    print("Conto: 3")\n'],
    [30, s => s.replace('saluta("Eroe")', 'print("Ciao Eroe")')],
    [31, s => s.replace('var danno = calcola_danno(30, 5)\n    print(danno)', 'print(25)')],
    [32, s => s.replace('print("Colpo normale: ", normale)', 'print("RISULTATO FALSO")').replace('print("Colpo critico: ", critico)', 'print("RISULTATO FALSO")')],
    [33, s => s.replace('print(posizione)', 'print("Vector2(100, 200)")')],
    [41, s => s.replace('porta_aperta.emit()', 'print("Porta aperta con successo!")')],
    [42, s => s.replace('moneta_raccolta.emit()', 'print("+10 Monete raccolte!")')],
    [43, s => s.replace('danno_inflitto.emit(35)', 'print("Danno registrato: 35")')],
    [44, s => s.replace('salute_aggiornata.emit(75)', 'print("UI: Barra salute a 75")').replace('salute_aggiornata.emit(40)', 'print("UI: Barra salute a 40")')],
    [57, s => s.replace('$Cooldown.start()', 'pass')],
    [59, s => s.replace('print("Moneta presente prima: ", has_node("Moneta"))', 'print("Moneta presente prima: true")').replace('print("Moneta eliminata con queue_free: ", not has_node("Moneta"))', 'print("Moneta eliminata con queue_free: true")')]
];
const reviewMutations = [
    ['rev_variables_01', s => s.replace('print("Il ranger " + nome_ranger + " possiede " + str(frecce) + " frecce.")', 'print("Il ranger Kael possiede 18 frecce.")')],
    ['rev_types_01', s => s.replace('const LIVELLO_MAX: int', 'const LIVELLO_MAX').replace('print(altitudine)', 'print(120.5)')],
    ['rev_math_01', s => s.replace('danno_subito = 25', 'danno_subito = 250').replace('print(resistenza_finale)', 'print(65)')],
    ['rev_conditions_01', s => s.replace('if ha_chiave == true and livello >= 10:', 'if true and true:')],
    ['rev_arrays_01', s => s.replace('print(zaino.size())', 'print(3)')],
    ['rev_loops_01', s => s.replace('print("Generatore " + str(i) + " attivo")', 'pass') + '\n    print("Generatore 1 attivo")\n    print("Generatore 2 attivo")\n    print("Generatore 3 attivo")\n    print("Generatore 4 attivo")'],
    ['rev_functions_01', s => s.replace('var spinta = calcola_spinta(10, 5)\n    print(spinta)', 'print(30)')],
    ['rev_vectors_01', s => s.replace('print(posizione)', 'print(Vector2(150, 170))')],
    ['rev_dictionaries_01', s => s.replace('print(bottino["oro"])', 'print(150)')],
    ['rev_signals_01', s => s.replace('allarme_attivato.emit()', 'print("[ALLARME] Violazione perimetro rilevata!")')],
    ['rev_signals_02', s => s.replace('energia_ricaricata.emit(50)', 'print("Energia ripristinata: +50 MW")')],
    ['rev_oop_01', s => s.replace('print("Drone " + d.matricola + " operativo (Batteria: " + str(d.batteria) + "%)")', 'print("Drone EX-101 operativo (Batteria: 100%)")')],
    ['rev_scene_tree_01', s => s.replace('print("Monitor aggiornato: ", $MonitorTermico.text)', 'print("Monitor aggiornato: Temperatura: 300 K")')],
    ['rev_ui_button_01', s => s.replace('$BtnLancio.pressed.emit()', 'print("Sequenza di lancio avviata con successo!")')],
    ['rev_timers_01', s => s.replace('$TimerMina.timeout.emit()', 'print("Detonazione mina energetica!")\n    $MinaGrafica.queue_free()')],
    ['rev_conditions_02', s => s.replace('if tessera_valida and livello_radiazioni < 25:', 'if true and true:')]
];
async function check(lesson, source, expected, message) {
    const result = await runtime.execute(source, { lesson });
    const checks = await lesson.validate(result);
    const accepted = result.success && checks.every(t => t.passed);
    assert.equal(accepted, expected, message + (accepted !== expected ? ' | falliti: ' + checks.filter(t => !t.passed).map(t => t.desc).join(', ') : ''));
}
async function run() {
    assert.equal(lessons.length, 60);
    assert.equal(reviews.length, 17);
    for (const lesson of lessons) await check(lesson, lesson.solution, true, 'Soluzione ufficiale lezione ' + lesson.id);
    for (const review of reviews) await check(review, review.solution, true, 'Soluzione ufficiale ripasso ' + review.id);

    for (const [id, transform] of lessonMutations) {
        const lesson = lessons.find(l => l.id === id);
        const mutated = transform(lesson.solution);
        assert.notEqual(mutated, lesson.solution, 'Mutazione non applicata alla lezione ' + id);
        await check(lesson, mutated, false, 'Bypass lezione ' + id);
    }
    for (const [id, transform] of reviewMutations) {
        const review = reviews.find(v => v.id === id);
        const mutated = transform(review.solution);
        assert.notEqual(mutated, review.solution, 'Mutazione non applicata al ripasso ' + id);
        await check(review, mutated, false, 'Bypass ripasso ' + id);
    }
    // Accettare condizioni equivalenti: cambia solo l'ordine delle verifiche.
    const alternatives = [
        ['rev_conditions_01', s => s.replace('if ha_chiave == true and livello >= 10:', 'if livello >= 10 and ha_chiave:')],
        ['rev_conditions_02', s => s.replace('if tessera_valida and livello_radiazioni < 25:', 'if livello_radiazioni < 25 and tessera_valida:')]
    ];
    for (const [id, transform] of alternatives) {
        const review = reviews.find(v => v.id === id);
        await check(review, transform(review.solution), true, 'Alternativa corretta ' + id);
    }

    console.log('OK: 60 lezioni ufficiali, 17 ripassi ufficiali, 29 bypass respinti, 2 alternative accolte.');
}
run().catch(err => { console.error(err); process.exitCode = 1; });
