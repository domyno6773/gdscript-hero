'use strict';

// Eseguire: node tests/streak_telemetry_regression.test.cjs
// Non richiede npm, rete, account o un browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({
    window: { addEventListener() {} },
    console,
    Date,
    STREAK_TIERS: {
        rilassato: { target: 2, label: 'Rilassato' }
    },
    SoundFX: { playFanfare() {} }
});

for (const file of ['progression.js', 'app.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'),
        context, { filename: file });
}

const app = context.window.App;
assert.ok(app, 'App deve essere disponibile');
let saves = 0;
app.saveStorage = () => { saves++; };
app.showToast = () => {};
app.updateStatsUI = () => {};
app.state.streakMode = 'rilassato';

const weekKey = context.window.ProgressionV2.weekKey;
const thisWeek = weekKey();
const lastWeek = weekKey(new Date(Date.now() - 7 * 86400000));
const twoWeeksAgo = weekKey(new Date(Date.now() - 14 * 86400000));

function resetFromWeek(week, activeDays, weeksInStreak, expectedWeeks) {
    app.state.currentWeekId = week;
    app.state.activeDaysThisWeek = activeDays;
    app.state.streakWeeks = weeksInStreak;
    app.checkWeekReset();
    assert.equal(app.state.currentWeekId, thisWeek, 'Aggiornamento settimana');
    assert.equal(app.state.activeDaysThisWeek.length, 0, 'Attivita precedenti eliminate');
    assert.equal(app.state.streakWeeks, expectedWeeks, 'Serie settimanale');
}

// La serie continua se l'obiettivo era stato raggiunto nella settimana precedente.
resetFromWeek(lastWeek, ['lunedi', 'martedi'], 3, 3);
// La serie si interrompe se la settimana precedente non raggiunge l'obiettivo.
resetFromWeek(lastWeek, ['lunedi'], 3, 0);
// Una settimana saltata annulla la serie anche se la vecchia settimana era completa.
resetFromWeek(twoWeeksAgo, ['lunedi', 'martedi'], 3, 0);

// Giorni e bonus settimanale vengono registrati una sola volta.
app.state.currentWeekId = thisWeek;
app.state.activeDaysThisWeek = [];
app.state.streakWeeks = 0;
app.state.xp = 0;
app.state.rewardsV2 = null;
const days = app.getCurrentWeekDays();
let today = days[0].iso;
app.getTodayISO = () => today;
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 1);
assert.equal(app.state.xp, 0);
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 1,
    'Ripetere la verifica nello stesso giorno non crea un secondo giorno');
today = days[1].iso;
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 2);
assert.equal(app.state.streakWeeks, 1);
assert.equal(app.state.xp, 20, 'Il traguardo assegna 20 XP');
app.recordDailyActivity();
assert.equal(app.state.xp, 20, 'Il premio non si duplica');
assert.equal(app.state.streakWeeks, 1, 'La settimana non si duplica');

// La prima risposta giusta di un percorso a quattro compiti NON e' una lezione completa.
app.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };
const passed = [{ desc: 'OK', passed: true }];
const result = { success: true, nativeStatus: true };
for (let i = 0; i < 3; i++) {
    app.recordLessonAttempt(1, result, passed, null,
        'func _ready():\n    print(1)', { lessonCompleted: false });
}
const telemetry = app.getOrCreateLessonTelemetry(1);
assert.equal(telemetry.verify_attempts, 3);
assert.equal(telemetry.success_count, 0, 'Compiti intermedi non sono lezioni complete');
assert.equal(telemetry.first_success_at, null, 'Nessun successo prematuro');
const daily = Object.values(app.state.learningTelemetry.daily_activity)[0];
assert.equal(daily.verifications, 3);
assert.equal(daily.lessons_completed, 0, 'Statistiche giornaliere non premature');
app.recordLessonAttempt(1, result, passed, null,
    'func _ready():\n    print(4)', { lessonCompleted: true });
assert.equal(telemetry.verify_attempts, 4);
assert.equal(telemetry.success_count, 1);
assert.ok(telemetry.first_success_at, 'Il quarto compito registra il successo');
assert.equal(daily.lessons_completed, 1);
app.recordLessonAttempt(1, result, passed, null,
    'func _ready():\n    print(4)', { lessonCompleted: true });
assert.equal(daily.lessons_completed, 1, 'Rieseguire la lezione non la conta due volte');
assert.ok(saves > 0, 'Il progresso e la streak vengono salvati');

const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert.equal((appSource.match(/^\s*recordDailyActivity\(\)\s*\{/gm) || []).length, 1,
    'Deve esserci una sola definizione di recordDailyActivity');
console.log('PASS: streak settimanale, bonus idempotente e telemetria multi-compito.');
