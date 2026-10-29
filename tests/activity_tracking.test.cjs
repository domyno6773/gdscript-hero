'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const P = require('../progression.js');
const window = { addEventListener() {} };
const ctx = {
  window, ProgressionV2: P, console, Date, Intl,
  document: { getElementById: () => null },
  SoundFX: { playFanfare() {}, playClick() {} }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'stats.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8'), ctx);
ctx.STREAK_TIERS = {
  rilassato: { target: 2, label: 'Rilassato' },
  concentrato: { target: 4, label: 'Concentrato' },
  lockin: { target: 6, label: 'Lock-in' }
};
ctx.LESSONS_DATA = [
  { id: 1, conceptId: 'syntax' }, { id: 2, conceptId: 'syntax' },
  { id: 5, conceptId: 'variables' }
];
const app = window.App;
let saved = 0, refreshed = 0, lastSaveOptions = null;
app.saveStorage = (options) => { saved++; lastSaveOptions = options; };
app.updateStatsUI = () => { refreshed++; };
app.showToast = () => {};
app.state.xp = 0;
app.state.rewardsV2 = P.createRewards(0);
app.state.finishedLessons = [];
app.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };
const pass = [{ passed: true, desc: 'Godot OK' }];
const fail = [{ passed: false, desc: 'Requisito mancante' }];
const result = { success: true, nativeStatus: 'executed' };

// La verifica intermedia conta come tentativo, mai come lezione conclusa.
app.recordLessonAttempt(1, result, pass, null, 'print("ok")', { lessonCompleted: false });
let record = app.state.learningTelemetry.lessons[1];
assert.equal(record.verify_attempts, 1);
assert.equal(record.success_count, 0);
assert.equal(record.first_success_at, null);
assert.equal(record.first_success_without_hints, null);
app.recordLessonAttempt(1, result, fail, null, 'print("no")', { lessonCompleted: false });
assert.equal(record.failed_verifications, 1);
assert.equal(record.failed_before_first_success, 1);
app.recordHintOpened(1, 2);
app.recordLessonAttempt(1, result, pass, null, 'print("secondo")', { lessonCompleted: false });
assert.equal(record.success_count, 0);
assert.equal(record.hints_opened_before_first_success, 2);
assert.equal(record.failed_verifications, 1);
const today = window.StatsEngine.formatLocalDateKey(new Date());
let daily = app.state.learningTelemetry.daily_activity[today];
assert.equal(daily.verifications, 3);
assert.equal(daily.lessons_completed, 0);
assert.equal(daily.autonomous_completed, 0);
assert.equal(daily.assisted_completed, 0);

// Solo l'ultimo compito segna il primo successo e la relativa autonomia.
app.recordLessonAttempt(1, result, pass, null, 'print("finale")', { lessonCompleted: true });
assert.ok(record.first_success_at);
assert.equal(record.success_count, 1);
assert.equal(record.first_success_without_hints, false);
assert.equal(record.failed_before_first_success, 1);
assert.equal(lastSaveOptions.localOnly, true, 'Nessuna sync cloud prima di finishedLessons');
app.state.finishedLessons.push(1);
daily = app.state.learningTelemetry.daily_activity[today];
assert.equal(daily.verifications, 4);
assert.equal(daily.lessons_completed, 1);
assert.equal(daily.assisted_completed, 1);
app.recordLessonAttempt(1, result, pass, null, 'print("ripetizione")', { lessonCompleted: true });
assert.equal(record.success_count, 2);
assert.equal(daily.lessons_completed, 1, 'Non duplicare il primo completamento');
assert.equal(window.StatsEngine.computeCourseAutonomy(app.state).assistedCount, 1);

// Una lezione senza percorso multi-compito mantiene il comportamento normale.
app.recordLessonAttempt(5, result, pass, null, 'print("singolo")');
assert.ok(app.state.learningTelemetry.lessons[5].first_success_at);

// Migrazione: vecchi salvataggi con primo compito superato ma lezione incompleta.
const history = {
  schema_version: 1,
  lessons: {
    1: {
      first_success_at: '2026-10-27T10:00:00.000Z',
      last_success_at: '2026-10-27T10:00:00.000Z',
      success_count: 1, first_success_without_hints: true,
      failed_verifications: 2, failed_before_first_success: 0,
      max_hint_level_opened: 2, hints_opened_before_first_success: 0,
      history_available: true
    },
    2: {
      first_success_at: '2026-10-27T12:00:00.000Z',
      success_count: 1, first_success_without_hints: true,
      history_available: true
    }
  },
  daily_activity: {
    '2026-10-27': {
      verifications: 8, lessons_completed: 2, autonomous_completed: 2,
      assisted_completed: 0, reviews_completed: 3
    }
  }
};
const migrated = app.migrateLearningTelemetry(history, [2]);
assert.equal(migrated.lessons[1].first_success_at, null);
assert.equal(migrated.lessons[1].last_success_at, null);
assert.equal(migrated.lessons[1].success_count, 0);
assert.equal(migrated.lessons[1].first_success_without_hints, null);
assert.equal(migrated.lessons[1].hints_opened_before_first_success, 2);
assert.equal(migrated.lessons[1].failed_before_first_success, 2);
assert.equal(migrated.lessons[2].success_count, 1);
const migratedDay = Object.values(migrated.daily_activity).find(x => x.verifications === 8);
assert.equal(migratedDay.lessons_completed, 1);
assert.equal(migratedDay.autonomous_completed, 1);
assert.equal(migratedDay.verifications, 8);
assert.equal(migratedDay.reviews_completed, 3);
assert.equal(app.migrateLearningTelemetry(migrated, [2]).daily_activity['2026-10-27'].lessons_completed, 1,
  'Migrazione idempotente');
app.state.learningTelemetry = migrated;
app.state.finishedLessons = [2];
const trend = window.StatsEngine.computeChronologicalProgress(app.state);
assert.equal(trend.dailySeries.reduce((sum, day) => sum + day.lessonsCompleted, 0), 1,
  'Il grafico non deve contare la lezione incompleta');

// Streak: un giorno di studio viene registrato una sola volta, con XP una sola volta.
app.state.xp = 0;
app.state.rewardsV2 = P.createRewards(0);
app.state.streakMode = 'rilassato';
app.state.streakWeeks = 0;
app.state.activeDaysThisWeek = [];
app.getWeekId = () => '2026-10-26';
app.state.currentWeekId = '2026-10-26';
let day = '2026-10-27';
app.getTodayISO = () => day;
const beforeRefresh = refreshed;
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 1);
assert.equal(refreshed, beforeRefresh + 1, 'La UI si aggiorna al primo giorno');
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 1);
assert.equal(app.state.streakWeeks, 0);
day = '2026-10-28';
app.recordDailyActivity();
assert.equal(app.state.activeDaysThisWeek.length, 2);
assert.equal(app.state.streakWeeks, 1);
assert.equal(app.state.xp, 20);
app.recordDailyActivity();
day = '2026-10-29';
app.recordDailyActivity();
assert.equal(app.state.streakWeeks, 1);
assert.equal(app.state.xp, 20, 'Nessun doppio premio settimanale');
assert.ok(saved > 0);
console.log('PASS: multi-task telemetry, legacy migration, streak and weekly XP');
