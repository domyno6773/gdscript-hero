/**
 * GDScript Hero - P3.4: Motore Statistiche di Apprendimento (StatsEngine)
 * ====================================================================
 * Calcolo trasparente, affidabile e verificabile dei dati didattici reali:
 * 1. Avanzamento del percorso e grado di autonomia (distinzione lezioni legacy e tracciate).
 * 2. Diagnostica dei punti di attrito e ripartizione tipologie di errore (esclusi errori transpiler).
 * 3. Pratica nella Palestra di Ripasso e andamento cronologico reale (senza percentuali fittizie).
 */

const StatsEngine = {
    /**
     * DOMANDA 1: A che punto sono del mio percorso e con quanta autonomia sto lavorando?
     */
    computeCourseAutonomy(state) {
        if (!state) {
            return {
                totalLessons: 60,
                completedLessons: 0,
                courseProgressPercent: 0,
                legacyCount: 0,
                trackedCount: 0,
                autonomousCount: 0,
                assistedCount: 0,
                autonomyRate: null,
                cleanFirstTryCount: 0,
                totalVerifications: 0,
                avgAttemptsPerTrackedLesson: null,
                hasLegacyData: false
            };
        }

        const finished = state.finishedLessons || [];
        const totalLessons = (typeof LESSONS_DATA !== 'undefined' && Array.isArray(LESSONS_DATA)) ? LESSONS_DATA.length : 60;
        const completedLessons = finished.length;
        const courseProgressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

        const telemetry = (state.learningTelemetry && state.learningTelemetry.lessons)
            ? state.learningTelemetry.lessons
            : (state.learningTelemetry || {});

        let legacyCount = 0;
        let trackedCount = 0;
        let autonomousCount = 0;
        let assistedCount = 0;
        let cleanFirstTryCount = 0;
        let totalVerifications = 0;

        finished.forEach(id => {
            const tel = telemetry[String(id)] || telemetry[id];
            if (!tel || tel.legacy_completion === true || tel.history_available === false) {
                legacyCount++;
            } else {
                trackedCount++;
                const hintsBefore = tel.hints_opened_before_first_success;
                const failedBefore = tel.failed_before_first_success || 0;
                const attempts = tel.verify_attempts || tel.total_runs || 1;

                totalVerifications += attempts;

                if (tel.first_success_without_hints === true || hintsBefore === 0) {
                    autonomousCount++;
                    if (failedBefore === 0) {
                        cleanFirstTryCount++;
                    }
                } else if (tel.first_success_without_hints === false || (hintsBefore !== null && hintsBefore > 0)) {
                    assistedCount++;
                } else {
                    // Dati parziali senza marcatura di aiuti: trattati prudentemente come assistiti
                    assistedCount++;
                }
            }
        });

        const autonomyRate = trackedCount > 0 ? Math.round((autonomousCount / trackedCount) * 100) : null;
        const avgAttemptsPerTrackedLesson = trackedCount > 0 ? (totalVerifications / trackedCount).toFixed(1) : null;

        return {
            totalLessons,
            completedLessons,
            courseProgressPercent,
            legacyCount,
            trackedCount,
            autonomousCount,
            assistedCount,
            autonomyRate,
            cleanFirstTryCount,
            totalVerifications,
            avgAttemptsPerTrackedLesson,
            hasLegacyData: legacyCount > 0
        };
    },

    /**
     * DOMANDA 2: Quali sono i miei veri punti di attrito e gli errori più frequenti?
     */
    computeErrorBreakdown(state) {
        const breakdown = {
            requirement: 0,
            syntax: 0,
            runtime: 0,
            timeout: 0,
            internal: 0 // Escluso dagli errori addebitati allo studente
        };

        if (!state) {
            return {
                counts: breakdown,
                studentTotal: 0,
                percentages: { requirement: 0, syntax: 0, runtime: 0, timeout: 0 },
                primaryFrictionType: null,
                pedagogicalInsight: "Nessun errore registrato finora. Ottima precisione iniziale!"
            };
        }

        const telemetry = (state.learningTelemetry && state.learningTelemetry.lessons)
            ? state.learningTelemetry.lessons
            : (state.learningTelemetry || {});

        Object.values(telemetry).forEach(tel => {
            if (tel && tel.error_breakdown) {
                breakdown.requirement += (tel.error_breakdown.requirement || 0);
                breakdown.syntax += (tel.error_breakdown.syntax || 0);
                breakdown.runtime += (tel.error_breakdown.runtime || 0);
                breakdown.timeout += (tel.error_breakdown.timeout || 0);
                breakdown.internal += (tel.error_breakdown.internal || 0);
            }
        });

        const studentTotal = breakdown.requirement + breakdown.syntax + breakdown.runtime + breakdown.timeout;

        const percentages = {
            requirement: studentTotal > 0 ? Math.round((breakdown.requirement / studentTotal) * 100) : 0,
            syntax: studentTotal > 0 ? Math.round((breakdown.syntax / studentTotal) * 100) : 0,
            runtime: studentTotal > 0 ? Math.round((breakdown.runtime / studentTotal) * 100) : 0,
            timeout: studentTotal > 0 ? Math.round((breakdown.timeout / studentTotal) * 100) : 0
        };

        // Identificazione del tipo di attrito principale
        let primaryFrictionType = null;
        let maxCount = 0;
        ['requirement', 'syntax', 'runtime', 'timeout'].forEach(type => {
            if (breakdown[type] > maxCount) {
                maxCount = breakdown[type];
                primaryFrictionType = type;
            }
        });

        let pedagogicalInsight = "Nessun errore di verifica registrato. Procedi così!";
        if (studentTotal > 0) {
            if (primaryFrictionType === 'requirement') {
                pedagogicalInsight = "Il tuo codice è generalmente valido e non genera errori di crash. La maggior parte dei mancati superamenti riguarda la logica di gioco o la corrispondenza dei requisiti richiesti. Consiglio: rileggi attentamente la consegna prima di cliccare 'Verifica Codice'.";
            } else if (primaryFrictionType === 'syntax') {
                pedagogicalInsight = "Gli errori di sintassi rappresentano il punto di attrito principale (es. due punti ':' omessi dopo istruzioni di controllo, indentazione o parentesi sbilanciate). Consiglio: fai attenzione alla formattazione e ai due punti dopo if, for, while e func.";
            } else if (primaryFrictionType === 'runtime') {
                pedagogicalInsight = "Le eccezioni durante l'esecuzione sono il punto di attrito più frequente (variabili o nodi non inizializzati, divisioni per zero o accessi fuori limite). Consiglio: controlla i nomi delle variabili e verifica l'esistenza dei nodi con $Nodo.";
            } else if (primaryFrictionType === 'timeout') {
                pedagogicalInsight = "Sono stati registrati blocchi o cicli infiniti. Consiglio: assicurati sempre che le variabili di controllo nei cicli while vengano incrementate ad ogni iterazione.";
            }
        }

        return {
            counts: breakdown,
            studentTotal,
            percentages,
            primaryFrictionType,
            pedagogicalInsight
        };
    },

    /**
     * Mappatura dei 15 concetti didattici nei 3 macro-stati (P3.3.1 / P3.4)
     */
    computeConceptsStatusSummary(state) {
        if (typeof ReviewEngine === 'undefined') {
            return {
                daRipassare: [],
                inMiglioramento: [],
                consolidati: [],
                disponibili: [],
                nonIniziati: []
            };
        }

        const all = ReviewEngine.getAllConceptsWithStatus(state);
        const summary = {
            daRipassare: [],
            inMiglioramento: [],
            consolidati: [],
            disponibili: [],
            nonIniziati: []
        };

        all.forEach(item => {
            if (item.status === 'da_ripassare') {
                summary.daRipassare.push(item);
            } else if (item.status === 'in_miglioramento') {
                summary.inMiglioramento.push(item);
            } else if (item.status === 'consolidato') {
                summary.consolidati.push(item);
            } else if (item.status === 'disponibile') {
                summary.disponibili.push(item);
            } else {
                summary.nonIniziati.push(item);
            }
        });

        return summary;
    },

    /**
     * Pratica nella Palestra di Ripasso
     */
    computeReviewStats(state) {
        const totalVariants = (typeof REVIEW_VARIANTS !== 'undefined' && Array.isArray(REVIEW_VARIANTS))
            ? REVIEW_VARIANTS.length
            : 17;

        const reviewProgress = state?.reviewProgress || { completedVariants: [], variantHistory: {} };
        const completedVariants = reviewProgress.completedVariants || [];
        const variantHistory = reviewProgress.variantHistory || {};

        let cleanAutonomousCount = 0;
        let assistedCount = 0;
        let totalReviewAttempts = 0;
        let totalReviewSuccesses = 0;

        completedVariants.forEach(varId => {
            const hist = variantHistory[varId];
            if (hist) {
                const attempts = hist.attempts || 1;
                const successes = hist.successes || 1;
                const failed = Math.max(0, attempts - successes);
                const hints = Math.max(hist.hints_used || 0, hist.hintsUsed || 0);

                totalReviewAttempts += attempts;
                totalReviewSuccesses += successes;

                if (hints === 0 && failed <= 1) {
                    cleanAutonomousCount++;
                } else {
                    assistedCount++;
                }
            } else {
                assistedCount++;
            }
        });

        // Somma anche eventuali tentativi su varianti non ancora completate
        Object.entries(variantHistory).forEach(([varId, hist]) => {
            if (!completedVariants.includes(varId)) {
                totalReviewAttempts += (hist.attempts || 0);
                totalReviewSuccesses += (hist.successes || 0);
            }
        });

        return {
            totalVariants,
            completedCount: completedVariants.length,
            cleanAutonomousCount,
            assistedCount,
            totalReviewAttempts,
            totalReviewSuccesses,
            variantsCoveragePercent: Math.min(100, Math.round((completedVariants.length / totalVariants) * 100))
        };
    },

    /**
     * DOMANDA 3: Come sta evolvendo il mio studio nel tempo?
     * Valutazione rigorosa dei timestamp reali (nessun dato o trend inventato).
     */
    computeChronologicalProgress(state) {
        if (!state) {
            return {
                trendAvailable: false,
                reason: "Nessun dato di avanzamento disponibile.",
                dailySeries: [],
                distinctDaysCount: 0
            };
        }

        const dateMap = {};

        const registerEvent = (isoString, type) => {
            if (!isoString || typeof isoString !== 'string') return;
            try {
                const datePart = isoString.split('T')[0];
                if (!datePart || datePart.length < 10) return;

                if (!dateMap[datePart]) {
                    dateMap[datePart] = {
                        date: datePart,
                        lessonsCompleted: 0,
                        verifyAttempts: 0,
                        reviewCompleted: 0,
                        autonomousSuccesses: 0
                    };
                }

                if (type === 'lesson_success') dateMap[datePart].lessonsCompleted++;
                if (type === 'verify_attempt') dateMap[datePart].verifyAttempts++;
                if (type === 'review_success') dateMap[datePart].reviewCompleted++;
                if (type === 'autonomous_success') dateMap[datePart].autonomousSuccesses++;
            } catch (e) {}
        };

        // 1. Estrazione timestamp reali dalle lezioni
        const telemetry = (state.learningTelemetry && state.learningTelemetry.lessons)
            ? state.learningTelemetry.lessons
            : (state.learningTelemetry || {});

        Object.values(telemetry).forEach(tel => {
            if (!tel || tel.legacy_completion === true || tel.history_available === false) return;

            if (tel.first_success_at) {
                registerEvent(tel.first_success_at, 'lesson_success');
                if (tel.first_success_without_hints === true) {
                    registerEvent(tel.first_success_at, 'autonomous_success');
                }
            }
            if (tel.first_attempt_at) {
                registerEvent(tel.first_attempt_at, 'verify_attempt');
            }
            if (tel.last_attempt_at && tel.last_attempt_at !== tel.first_attempt_at) {
                registerEvent(tel.last_attempt_at, 'verify_attempt');
            }
        });

        // 2. Estrazione timestamp reali dal ripasso
        const variantHistory = state.reviewProgress?.variantHistory || {};
        Object.values(variantHistory).forEach(hist => {
            if (!hist) return;
            if (hist.first_success_at) {
                registerEvent(hist.first_success_at, 'review_success');
            }
            if (hist.first_attempt_at) {
                registerEvent(hist.first_attempt_at, 'verify_attempt');
            }
        });

        const sortedDates = Object.keys(dateMap).sort();
        const distinctDaysCount = sortedDates.length;

        // Criterio trasparente: per mostrare un andamento cronologico significativo nel tempo
        // servono almeno 2 date di calendario distinte con attività registrata.
        if (distinctDaysCount < 2) {
            return {
                trendAvailable: false,
                reason: distinctDaysCount === 1
                    ? "Tutte le attività registrate finora appartengono alla stessa giornata di studio. Per tracciare un andamento cronologico significativo dell'apprendimento, continua a esercitarti nei prossimi giorni. La piattaforma registrerà automaticamente l'attività giorno per giorno senza generare curve o percentuali fittizie."
                    : "Dati cronologici storici al momento assenti o appartenenti a versioni precedenti senza timestamp. Esegui verifiche ed esercizi per iniziare la rilevazione temporale.",
                dailySeries: sortedDates.map(d => dateMap[d]),
                distinctDaysCount
            };
        }

        const dailySeries = sortedDates.map(d => dateMap[d]);

        return {
            trendAvailable: true,
            reason: `Andamento cronologico rilevato su ${distinctDaysCount} giornate di studio effettive.`,
            dailySeries,
            distinctDaysCount
        };
    },

    /**
     * Report completo aggregato per la Dashboard P3.4
     */
    getCompleteLearningReport(state) {
        return {
            courseAutonomy: this.computeCourseAutonomy(state),
            errorBreakdown: this.computeErrorBreakdown(state),
            conceptsSummary: this.computeConceptsStatusSummary(state),
            reviewStats: this.computeReviewStats(state),
            chronologicalProgress: this.computeChronologicalProgress(state)
        };
    }
};

if (typeof window !== 'undefined') {
    window.StatsEngine = StatsEngine;
}
