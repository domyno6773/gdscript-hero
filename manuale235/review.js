// Review repeats completed manual activities in separate drafts and never advances the course.
const REVIEW_VARIANTS = window.LESSONS_DATA.map(lesson=>({...lesson,
 id:'manual_review_'+lesson.id,manualLessonId:lesson.id,
 title:'Ripasso: '+lesson.title,starterCode:lesson.initialCode,xpReward:5,
 scenario:'Risolvi di nuovo questa attività del manuale. La bozza e il risultato del ripasso sono separati dal corso.'
}));
const ReviewEngine = {
    getConceptStatus(conceptId, state) {
        if (!state) return { status: 'non_iniziato', priority: 0 };
        const finished = state.finishedLessons || [];
        const telemetry = (state.learningTelemetry && state.learningTelemetry.lessons)
            ? state.learningTelemetry.lessons
            : (state.learningTelemetry || {});

        const allLessons = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA : [];
        const conceptLessons = allLessons.filter(l => l.conceptId === conceptId);
        const completedLessons = conceptLessons.filter(l => finished.includes(l.id));

        const conceptVariants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId && (state.finishedLessons||[]).includes(v.manualLessonId));
        const reviewProgress = state.reviewProgress || { completedVariants: [], variantHistory: {} };
        const completedVariantsForConcept = conceptVariants.filter(v => (reviewProgress.completedVariants || []).includes(v.id));

        // Se non ha ancora sbloccato o completato alcuna lezione del concetto
        if (completedLessons.length === 0) {
            return {
                status: 'non_iniziato',
                badgeText: 'BLOCCATO',
                badgeClass: 'badge-locked',
                reason: 'Argomento non ancora affrontato nel percorso principale',
                priority: 0,
                hasActiveFriction: false,
                metrics: { errors: 0, maxHints: 0, variantsDone: 0, totalVariants: conceptVariants.length }
            };
        }

        // Valutazione dell'attrito nel corso principale
        let totalErrorsBeforeFirstSuccess = 0;
        let maxHintsBeforeFirstSuccess = 0;
        let hasActiveFriction = false;

        conceptLessons.forEach(l => {
            const tel = telemetry[String(l.id)] || telemetry[l.id];
            if (tel) {
                const errs = tel.failed_before_first_success || 0;
                const hints = tel.hints_opened_before_first_success || 0;
                totalErrorsBeforeFirstSuccess += errs;
                if (hints > maxHintsBeforeFirstSuccess) {
                    maxHintsBeforeFirstSuccess = hints;
                }
                if (errs >= 2 || hints >= 2) {
                    hasActiveFriction = true;
                }
            }
        });

        // Analisi dettagliata delle prestazioni durante il ripasso
        let cleanAutonomousCompletions = 0;
        let assistedCompletions = 0;
        let maxVariantHintsUsed = 0;
        let maxVariantErrors = 0;

        completedVariantsForConcept.forEach(v => {
            const vHist = reviewProgress.variantHistory ? reviewProgress.variantHistory[v.id] : null;
            if (vHist) {
                const hintsUsed = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0);
                const attempts = vHist.attempts || 1;
                const successes = vHist.successes || 1;
                const failedAttempts = Math.max(0, attempts - successes);

                if (hintsUsed > maxVariantHintsUsed) maxVariantHintsUsed = hintsUsed;
                if (failedAttempts > maxVariantErrors) maxVariantErrors = failedAttempts;

                // Definizione rigorosa di superamento autonomo (P3.3.1 / P3.4):
                // 1) Se documentata una prova autonoma pulita (vHist.has_autonomous_success === true)
                // 2) Oppure, per retrocompatibilità storica: senza alcun suggerimento (hintsUsed === 0) e con al massimo un errore occasionale (failedAttempts <= 1)
                const isCleanAutonomous = (vHist.has_autonomous_success === true) || (hintsUsed === 0 && failedAttempts <= 1);
                if (isCleanAutonomous) {
                    cleanAutonomousCompletions++;
                } else {
                    assistedCompletions++;
                }
            } else {
                // In assenza di telemetria specifica sulla variante, trattalo prudentemente come assistito
                assistedCompletions++;
            }
        });

        const remainingVariants = Math.max(0, conceptVariants.length - completedVariantsForConcept.length);

        // LIVELLO 1: CONSOLIDATO
        // Richiede ALMENO UNA dimostrazione sufficientemente autonoma (0 suggerimenti, max 1 errore occasionale).
        // Completare 2 o più varianti con assistenza NON garantisce automaticamente lo stato Consolidato.
        if (cleanAutonomousCompletions >= 1) {
            const reasonText = cleanAutonomousCompletions > 1
                ? `Argomento consolidato: ${cleanAutonomousCompletions} varianti di ripasso superate in piena autonomia (senza aiuti e al massimo 1 errore occasionale)`
                : 'Argomento consolidato: variante superata in piena autonomia (senza suggerimenti e al massimo un errore occasionale)';
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: reasonText,
                priority: 1,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: completedVariantsForConcept.length,
                    totalVariants: conceptVariants.length,
                    cleanVariants: cleanAutonomousCompletions,
                    assistedVariants: assistedCompletions,
                    remainingVariants: remainingVariants
                }
            };
        }

        // LIVELLO 2: IN MIGLIORAMENTO
        // Se ha completato una o più varianti MA tutte con assistenza/errori (cleanAutonomousCompletions === 0):
        if (completedVariantsForConcept.length > 0) {
            const detailText = maxVariantErrors >= 2
                ? `${maxVariantErrors} tentativi errati prima del successo`
                : (maxVariantHintsUsed > 0 ? `${maxVariantHintsUsed} livelli di suggerimento consultati` : 'con assistenza');

            let reasonText = '';
            if (remainingVariants === 0) {
                // Tutte le varianti disponibili per l'argomento sono state completate con supporto
                reasonText = `In miglioramento: hai completato con supporto tutte le ${completedVariantsForConcept.length} prove disponibili per questo argomento (${detailText}). Al momento non ci sono ulteriori varianti; puoi ripeterle in piena autonomia per consolidare.`;
            } else {
                reasonText = `In miglioramento: ${completedVariantsForConcept.length} prova/e superata/e con supporto (${detailText}). Restano altre prove disponibili per consolidare in piena autonomia.`;
            }

            return {
                status: 'in_miglioramento',
                badgeText: 'IN MIGLIORAMENTO',
                badgeClass: 'badge-improving',
                reason: reasonText,
                priority: 6,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: completedVariantsForConcept.length,
                    totalVariants: conceptVariants.length,
                    cleanVariants: cleanAutonomousCompletions,
                    assistedVariants: assistedCompletions,
                    remainingVariants: remainingVariants
                }
            };
        }
        // LIVELLO 3: DA RIPASSARE
        // Se ha incontrato attrito significativo nel corso (>= 2 errori o >= 2 hint) e non ha ancora completato varianti
        if (hasActiveFriction) {
            const primaryReason = totalErrorsBeforeFirstSuccess >= 2
                ? `Consigliato: riscontrati ${totalErrorsBeforeFirstSuccess} tentativi falliti prima del successo nel corso`
                : `Consigliato: utilizzati ${maxHintsBeforeFirstSuccess} livelli di suggerimento nella lezione`;

            return {
                status: 'da_ripassare',
                badgeText: 'DA RIPASSARE',
                badgeClass: 'badge-recommended',
                reason: primaryReason,
                priority: 10 + totalErrorsBeforeFirstSuccess + (maxHintsBeforeFirstSuccess * 2),
                hasActiveFriction: true,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length,
                    cleanVariants: 0,
                    assistedVariants: 0,
                    remainingVariants: conceptVariants.length
                }
            };
        }

        // Se tutte le lezioni sono state completate nel corso senza frizione (<= 1 errore, <= 1 hint): CONSOLIDATO
        if (completedLessons.length === conceptLessons.length && conceptLessons.length > 0) {
            return {
                status: 'consolidato',
                badgeText: 'CONSOLIDATO',
                badgeClass: 'badge-consolidated',
                reason: 'Superato con facilità: nessun attrito significativo riscontrato nel corso',
                priority: 2,
                hasActiveFriction: false,
                metrics: {
                    errors: totalErrorsBeforeFirstSuccess,
                    maxHints: maxHintsBeforeFirstSuccess,
                    variantsDone: 0,
                    totalVariants: conceptVariants.length,
                    cleanVariants: 0,
                    assistedVariants: 0,
                    remainingVariants: conceptVariants.length
                }
            };
        }

        // Disponibile facoltativamente
        return {
            status: 'disponibile',
            badgeText: 'DISPONIBILE',
            badgeClass: 'badge-available',
            reason: 'Argomento sbloccato: ripasso facoltativo a disposizione',
            priority: 3,
            hasActiveFriction: false,
            metrics: {
                errors: totalErrorsBeforeFirstSuccess,
                maxHints: maxHintsBeforeFirstSuccess,
                variantsDone: 0,
                totalVariants: conceptVariants.length,
                cleanVariants: 0,
                assistedVariants: 0
            }
        };
    },

    getRecommendedConcepts(state) {
        if (!state) return [];
        const result = [];
        const catalog = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG : {};

        for (const [conceptId, conceptMeta] of Object.entries(catalog)) {
            const statusInfo = this.getConceptStatus(conceptId, state);
            if (statusInfo.status === 'da_ripassare' || statusInfo.status === 'in_miglioramento') {
                const variants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId && (state.finishedLessons||[]).includes(v.manualLessonId));
                result.push({
                    concept: conceptMeta,
                    variants: variants,
                    ...statusInfo
                });
            }
        }

        result.sort((a, b) => b.priority - a.priority);
        return result;
    },

    getAllConceptsWithStatus(state) {
        if (!state) return [];
        const result = [];
        const catalog = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG : {};

        for (const [conceptId, conceptMeta] of Object.entries(catalog)) {
            const statusInfo = this.getConceptStatus(conceptId, state);
            const variants = REVIEW_VARIANTS.filter(v => v.conceptId === conceptId && (state.finishedLessons||[]).includes(v.manualLessonId));
            result.push({
                concept: conceptMeta,
                variants: variants,
                ...statusInfo
            });
        }

        return result;
    },

    recordVariantHintOpened(variantId, hintLevel, state) {
        if (!state || !variantId) return;
        if (!state.reviewProgress) {
            state.reviewProgress = { completedVariants: [], variantHistory: {} };
        }
        if (!state.reviewProgress.variantHistory) {
            state.reviewProgress.variantHistory = {};
        }
        const vHist = state.reviewProgress.variantHistory[variantId] || {
            attempts: 0,
            successes: 0,
            hints_used: 0,
            hintsUsed: 0,
            attempts_since_last_success: 0,
            has_autonomous_success: false,
            clean_autonomous_runs: 0,
            first_attempt_at: null,
            last_attempt_at: null,
            first_success_at: null
        };
        const maxH = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0, hintLevel || 0);
        vHist.hints_used = maxH;
        vHist.hintsUsed = maxH;
        state.reviewProgress.variantHistory[variantId] = vHist;
    },

    recordVariantAttempt(variantId, isSuccess, hintsRevealed, state) {
        if (!state) return;
        if (!state.reviewProgress) {
            state.reviewProgress = { completedVariants: [], variantHistory: {} };
        }
        if (!state.reviewProgress.completedVariants) {
            state.reviewProgress.completedVariants = [];
        }
        if (!state.reviewProgress.variantHistory) {
            state.reviewProgress.variantHistory = {};
        }

        const now = new Date();
        const nowIso = now.toISOString();
        const vHist = state.reviewProgress.variantHistory[variantId] || {
            attempts: 0,
            successes: 0,
            hints_used: 0,
            hintsUsed: 0,
            attempts_since_last_success: 0,
            has_autonomous_success: false,
            clean_autonomous_runs: 0,
            first_attempt_at: null,
            last_attempt_at: null,
            first_success_at: null
        };

        vHist.attempts++;
        if (!vHist.first_attempt_at) vHist.first_attempt_at = nowIso;
        vHist.last_attempt_at = nowIso;

        const currentRunHints = hintsRevealed || 0;
        const maxH = Math.max(vHist.hints_used || 0, vHist.hintsUsed || 0, currentRunHints);
        vHist.hints_used = maxH;
        vHist.hintsUsed = maxH;

        const isFirstSuccess = isSuccess && !vHist.first_success_at;

        if (!isSuccess) {
            // Tentativo fallito nella sessione corrente
            vHist.attempts_since_last_success = (vHist.attempts_since_last_success || 0) + 1;
        } else {
            // Successo conseguito!
            vHist.successes++;
            if (!vHist.first_success_at) vHist.first_success_at = nowIso;
            if (!state.reviewProgress.completedVariants.includes(variantId)) {
                state.reviewProgress.completedVariants.push(variantId);
            }

            const sessionFailures = vHist.attempts_since_last_success || 0;
            // Valutazione della sessione: autonoma se 0 hint aperti in questa sessione e al max 1 errore prima del successo
            const isAutonomousRun = (currentRunHints === 0 && sessionFailures <= 1);
            if (isAutonomousRun) {
                vHist.has_autonomous_success = true;
                vHist.clean_autonomous_runs = (vHist.clean_autonomous_runs || 0) + 1;
            }

            vHist.last_run = {
                success: true,
                hints_used: currentRunHints,
                failed_attempts: sessionFailures,
                is_autonomous: isAutonomousRun,
                completed_at: nowIso
            };

            // Reset del conteggio errori per la sessione successiva
            vHist.attempts_since_last_success = 0;
        }

        state.reviewProgress.variantHistory[variantId] = vHist;

        // Registrazione nel contatore giornaliero aggregato (P3.4) - PROPRIETÀ ESCLUSIVA
        if (state && state.learningTelemetry) {
            if (!state.learningTelemetry.daily_activity) state.learningTelemetry.daily_activity = {};
            const todayKey = (typeof StatsEngine !== 'undefined' && StatsEngine.formatLocalDateKey)
                ? StatsEngine.formatLocalDateKey(now)
                : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            if (!state.learningTelemetry.daily_activity[todayKey]) {
                state.learningTelemetry.daily_activity[todayKey] = {
                    verifications: 0,
                    lessons_completed: 0,
                    autonomous_completed: 0,
                    assisted_completed: 0,
                    reviews_completed: 0
                };
            }
            state.learningTelemetry.daily_activity[todayKey].verifications++;
            if (isFirstSuccess) {
                state.learningTelemetry.daily_activity[todayKey].reviews_completed++;
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.REVIEW_VARIANTS = REVIEW_VARIANTS;
    window.ReviewEngine = ReviewEngine;
}
