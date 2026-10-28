// GDScript Hero - Motore Applicativo con Capitoli, Sfide di Padronanza, Profilo, Missioni, Pratica & Progetti
const App = {
    state: {
        theme: "dark", // "dark" | "light"
        currentLessonId: 1,
        isValidating: false,
        learningTelemetry: { schema_version: 1, lessons: {}, daily_activity: {} },
        completedLessons: [1],
        finishedLessons: [],
        devAllUnlocked: false, // Default false: la modalità test/verifica si attiva solo in locale
        unlockedAchievements: [],
        xp: 0,
        rewardsV2: null, // Registro locale UX, non valido per la classifica ufficiale
        streak: 1,
        level: 1,
        streakMode: "rilassato", // "rilassato" (2), "concentrato" (4), "lockin" (6)
        streakGoalSelection:null,siteWelcomeSeen:false,
        streakWeeks: 0,
        activeDaysThisWeek: [],  // array di date ISO es. ["2026-10-24"]
        currentWeekId: "",
        lastActiveDate: null,
        userCode: {},
        hintsRevealed: 0,
        activeHintLevel: 1,
        autocompleteList: [],

        // Progetto Pratico P2: Arena del Gladiatore
        arenaProject: {
            currentPhase: 1,
            completedPhases: [],
            userCode: {},
            hintsRevealed: 0,
            activeHintLevel: 1,
            liveSalute: 100,
            liveMaxSalute: 100,
            liveIsVivo: true
        },

        // P3.3: Progresso Ripasso Intelligente
        reviewProgress: {
            completedVariants: [],
            variantHistory: {}
        },
        currentReviewTab: "recommended",
        sessionDismissedReviewCallout: false,
        selectedAutocompleteIndex: 0,

        // Profilo Giocatore
        profile: {
            username: "Eroe Godot",
            tag: "Sviluppatore GDScript",
            color: "#478cbf",
            avatar: "🤖"
        },
        profileCustomized: false,

        // Missioni Giornaliere
        dailyQuests: {
            date: "",
            progress: {
                daily_exercise: 0,
                no_hints: 0,
                code_runs: 0
            },
            claimed: {
                daily_exercise: false,
                no_hints: false,
                code_runs: false
            }
        },
        claimedQuestsCount: 0,

        // Interessi Progetti W.I.P.
        projectInterests: {
            project_platformer: 24,
            project_inventory: 19,
            project_turn_combat: 31
        },

        // Progetti Sandbox & Mini-IDE (Sincronizzati Cloud in tempo reale)
        sandbox: {
            activeProjectId: 'proj_default',
            projects: [
                {
                    id: 'proj_default',
                    name: 'Il Mio Gioco Godot',
                    code: `extends Node2D\n\nvar clicks = 0\n\nfunc _ready():\n    print("Benvenuto nella Sandbox di Godot 4!")\n    $Label.text = "Clicca il pulsante sotto per iniziare."\n\nfunc _on_button_pressed():\n    clicks += 1\n    print("Pulsante cliccato! Volte:", clicks)\n    $Label.text = "Bravo! Hai cliccato " + str(clicks) + " volte!"\n`,
                    nodes: [
                        { name: 'Main', type: 'Node2D', parent: null },
                        { name: 'Label', type: 'Label', text: 'Clicca il pulsante sotto per iniziare.', parent: 'Main' },
                        { name: 'Button', type: 'Button', text: 'Cliccami!', parent: 'Main' },
                        { name: 'Sprite2D', type: 'Sprite2D', parent: 'Main' }
                    ],
                    updatedAt: new Date().toISOString()
                }
            ]
        }
    },

    // Parole chiave, funzioni built-in e termini frequenti in italiano
    builtins: [
        { name: "print", type: "func", badge: "funzione" },
        { name: "Vector2", type: "builtin", badge: "vettore 2D" },
        { name: "Vector3", type: "builtin", badge: "vettore 3D" },
        { name: "_ready", type: "func", badge: "ciclo vita" },
        { name: "String", type: "builtin", badge: "tipo testo" },
        { name: "int", type: "builtin", badge: "tipo intero" },
        { name: "float", type: "builtin", badge: "tipo decimale" },
        { name: "bool", type: "builtin", badge: "tipo booleano" },
        { name: "nome_giocatore", type: "var", badge: "variabile" },
        { name: "punti_vita", type: "var", badge: "variabile" },
        { name: "posizione", type: "var", badge: "vettore" },
        { name: "velocita", type: "var", badge: "variabile" },
        { name: "range", type: "builtin", badge: "intervallo" },
        { name: "len", type: "builtin", badge: "lunghezza" },
        { name: "var", type: "keyword", badge: "dichiara" },
        { name: "func", type: "keyword", badge: "funzione" },
        { name: "if", type: "keyword", badge: "condizione" },
        { name: "elif", type: "keyword", badge: "altrimenti se" },
        { name: "else", type: "keyword", badge: "altrimenti" },
        { name: "match", type: "keyword", badge: "seleziona" },
        { name: "for", type: "keyword", badge: "ciclo" },
        { name: "while", type: "keyword", badge: "mentre" },
        { name: "return", type: "keyword", badge: "ritorna" },
        { name: "pass", type: "keyword", badge: "ignora" }
    ],

    isLocalEnvironment() {
        try {
            const h = window.location.hostname;
            const p = window.location.protocol;
            return p === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '::1';
        } catch (e) {
            return false;
        }
    },

    // La posizione e' locale alla singola scheda: non e' progresso utente,
    // non finisce nei backup e non va sincronizzata con account diversi.
    saveNavigationPosition() {
        try {
            const current = document.querySelector('.view-container:not(.hidden)');
            if (!current) return;
            const allowed = ['view-roadmap','view-exercise','view-practice',
                'view-projects','view-review','view-stats'];
            if (!allowed.includes(current.id)) return;
            const workspace = document.getElementById('exercise-workspace-grid');
            const snapshot = {
                version: 1,
                view: current.id,
                lessonId: this.state.currentLessonId,
                reviewVariantId: current.id === 'view-exercise' && this.isReviewMode
                    ? this.currentReviewVariant?.id : null,
                reviewTab: this.state.currentReviewTab === 'all' ? 'all' : 'recommended',
                projectsTab: current.id === 'view-projects'
                    ? (!document.getElementById('official-arena-workspace')?.classList.contains('hidden')
                        ? 'official'
                        : !document.getElementById('competition-workspace')?.classList.contains('hidden')
                            ? 'demo' : 'catalog')
                    : null,
                mobileTab: workspace?.classList.contains('show-code') ? 'code' : 'instructions'
            };
            sessionStorage.setItem('gdscript_hero_position_v1', JSON.stringify(snapshot));
        } catch (error) {
            // La navigazione funziona anche se lo storage e' disabilitato.
        }
    },

    saveReviewDraft() {
        if (!this.isReviewMode || !this.currentReviewVariant) return;
        try {
            const editor = document.getElementById('code-editor');
            if (editor) sessionStorage.setItem('gdscript_hero_review_draft_v1',
                JSON.stringify({id:this.currentReviewVariant.id,code:editor.value}));
        } catch (error) {}
    },

    restoreNavigationPosition() {
        let position = null;
        try {
            position = JSON.parse(sessionStorage.getItem('gdscript_hero_position_v1') || 'null');
        } catch (error) { return; }
        if (!position || position.version !== 1) return;

        // Non fidarsi di chiavi obsolete o di ID arbitrari nello storage.
        const view = position.view;
        const allowed = ['view-roadmap','view-exercise','view-quiz','view-practice',
            'view-projects','view-review','view-stats'];
        if (!allowed.includes(view)) return;
        try {
            if (view === 'view-quiz') {
                const id = Number(position.lessonId);
                const quiz = LESSONS_DATA.find(l => l.id === id && l.isQuiz);
                if (quiz && (this.state.devAllUnlocked || this.state.completedLessons.includes(id) ||
                    this.state.finishedLessons.includes(id))) this.openLesson(id);
            } else if (view === 'view-exercise') {
                if (typeof position.reviewVariantId === 'string' &&
                    typeof REVIEW_VARIANTS !== 'undefined' &&
                    REVIEW_VARIANTS.some(v => v.id === position.reviewVariantId)) {
                    // Leggere la bozza PRIMA di openReviewVariant, che inizializza
                    // l'editor al codice starter della nuova variante.
                    let draft = null;
                    try {
                        draft = JSON.parse(sessionStorage.getItem('gdscript_hero_review_draft_v1') || 'null');
                    } catch (error) {}
                    this.openReviewVariant(position.reviewVariantId);
                    if (draft?.id === position.reviewVariantId && typeof draft.code === 'string') {
                        document.getElementById('code-editor').value = draft.code;
                        this.updateLineNumbers();
                        window.GDScriptHighlighter?.sync('exercise');
                        // openReviewVariant salva inizialmente lo starter: ripristina
                        // anche lo snapshot, cosi' i refresh successivi conservano la bozza.
                        this.saveReviewDraft();
                    }
                } else {
                    const id = Number(position.lessonId);
                    const lesson = LESSONS_DATA.find(l => l.id === id);
                    // Non ripristinare lezioni ormai bloccate o inesistenti.
                    const accessible = lesson && (id === 1 || this.state.devAllUnlocked ||
                        this.state.completedLessons.includes(id) ||
                        this.state.finishedLessons.includes(id));
                    if (!accessible) return;
                    this.openLesson(id);
                }
                this.setMobileExerciseTab(position.mobileTab === 'code' ? 'code' : 'instructions', false);
            } else if (view === 'view-practice') {
                this.openPracticeView();
            } else if (view === 'view-projects') {
                // Anche una sessione salvata prima della pausa torna al catalogo.
                this.openProjectsView();
            } else if (view === 'view-review') {
                this.showReviewView();
                if (position.reviewTab === 'all') this.setReviewTab('all');
            } else if (view === 'view-stats') {
                this.showStatsView();
            } else {
                // La Mappa e' gia' pronta all'avvio.
                this.saveNavigationPosition();
            }
        } catch (error) {
            // Nessun blocco all'avvio, anche con uno stato vecchio o incompleto.
            this.switchView('view-roadmap');
            this.updateNavSelection('roadmap');
        }
    },

    init() {
        this._blankUserState=JSON.parse(JSON.stringify(this.state));
        this._saveOwner=this.initialSaveOwner();
        this._cloudHydrationPending=this._saveOwner!=='guest';
        // La copia legacy non identifica il proprietario. Preferire sempre
        // il salvataggio legato all'account attivo, se presente.
        let scopedSave=null;
        try{scopedSave=localStorage.getItem(this.ownerStorageKey(this._saveOwner));}catch(e){}
        if(scopedSave!==null)this.loadStorage(scopedSave);
        else if(this._saveOwner==='guest')this.loadStorage();
        else this.loadStorage(null);
        this.ensureUnlockedConsistency();
        SoundFX.bindMusicGesture();
        this.applyTheme(this.state.theme || 'dark');
        this.checkDailyQuestsReset();
        this.bindEvents();
        // In mobile il comando Ripristina vive nella toolbar, senza affollare l'header.
        document.getElementById('btn-mobile-reset-code')?.addEventListener('click', () => {
            document.getElementById('btn-reset-code')?.click();
        });
        document.getElementById('btn-mobile-toggle-tools')?.addEventListener('click', () => {
            document.getElementById('btn-toggle-extra-tools')?.click();
        });
        document.getElementById('code-editor')?.addEventListener('input', () => this.keepExerciseAtHorizontalOrigin());
        this.applyProfileUI();
        this.renderRoadmap();
        this.renderSidebarDailyQuests();
        this.updateStatsUI();
        this.setupEditor();
        this.setupPracticeEditor();
        this.checkAchievements();
        this.updateQuestsBadge();

        // Mostra i controlli sviluppatore nelle impostazioni ESCLUSIVAMENTE in ambiente locale
        if (this.isLocalEnvironment()) {
            const devGroup = document.getElementById('dev-settings-group');
            if (devGroup) devGroup.classList.remove('hidden');
        }

        // Inizializzazione Viewport 2D Godot Engine
        if (window.GodotViewport) {
            this.viewport = new GodotViewport('exercise-viewport-canvas');
            this.practiceViewport = new GodotViewport('sandbox-viewport-canvas');
            if (this.state.theme) {
                this.viewport.setTheme(this.state.theme);
                this.practiceViewport.setTheme(this.state.theme);
            }
        }

        // Inizializzazione Autenticazione & Salvataggio Cloud / Backup
        this.initAuthAndSync();
        this.restoreNavigationPosition();
        queueMicrotask(()=>{if(this._saveOwner==='guest')this.ensureSiteOnboarding();});

        window.addEventListener('resize', () => {
            const roadmapView = document.getElementById('view-roadmap');
            if (roadmapView && !roadmapView.classList.contains('hidden')) {
                this.drawConnectingLines();
            }
        });
    },

    loadStorage(savedOverride) {
        try {
            const saved = arguments.length ? savedOverride : localStorage.getItem('gdscript_hero_save_v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.xp = parsed.xp || 0;
                this.state.rewardsV2 = ProgressionV2.normalizeRewards(parsed.rewardsV2,this.state.xp,parsed.dailyQuests);
                this.state.streak = parsed.streak || 1;
                this.state.finishedLessons = parsed.finishedLessons || [];
                this.state.completedLessons = parsed.completedLessons || [1];
                // In ambiente locale permette la modalità sblocco rapido, online forza false
                if (this.isLocalEnvironment()) {
                    this.state.devAllUnlocked = (parsed.devAllUnlocked !== undefined) ? parsed.devAllUnlocked : true;
                } else {
                    this.state.devAllUnlocked = false;
                }
                this.state.unlockedAchievements = parsed.unlockedAchievements || [];
                this.state.streakMode = parsed.streakMode || "rilassato";
                this.state.streakGoalSelection=Object.hasOwn(parsed,'streakGoalSelection')
                    ? parsed.streakGoalSelection
                    : {week:parsed.currentWeekId||this.getWeekId(),selectedDate:'legacy'};
                this.state.siteWelcomeSeen=parsed.siteWelcomeSeen!==false;
                this.state.streakWeeks = parsed.streakWeeks || 0;
                this.state.activeDaysThisWeek = parsed.activeDaysThisWeek || [];
                this.state.currentWeekId = parsed.currentWeekId || this.getWeekId();
                this.state.lastActiveDate = parsed.lastActiveDate || null;
                this.state.userCode = parsed.userCode || {};
                
                // Pulisce eventuale codice legacy con Node.new salvato in localStorage per le lezioni aggiornate
                [49, 50, 52, 53, 57, 58].forEach(id => {
                    if (this.state.userCode[id] && (this.state.userCode[id].includes('.new') || this.state.userCode[id].includes('Node.new') || this.state.userCode[id].includes('add_child'))) {
                        delete this.state.userCode[id];
                    }
                });
                
                if (parsed.theme) {
                    this.state.theme = parsed.theme;
                }

                if (parsed.profile) {
                    this.state.profile = { ...this.state.profile, ...parsed.profile };
                }
                this.state.profileCustomized = !!parsed.profileCustomized;
                this.state.guestOnboardingV1 = parsed.guestOnboardingV1?.complete
                    ? parsed.guestOnboardingV1 : null;

                if (parsed.dailyQuests) {
                    this.state.dailyQuests = parsed.dailyQuests;
                }
                this.state.claimedQuestsCount = parsed.claimedQuestsCount || 0;

                if (parsed.arenaProject) {
            this.state.arenaProject = {
                currentPhase: parsed.arenaProject.currentPhase || 1,
                completedPhases: Array.isArray(parsed.arenaProject.completedPhases) ? parsed.arenaProject.completedPhases : [],
                userCode: parsed.arenaProject.userCode || {},
                hintsRevealed: parsed.arenaProject.hintsRevealed || 0,
                activeHintLevel: parsed.arenaProject.activeHintLevel || 1,
                liveSalute: 100,
                liveMaxSalute: 100,
                liveIsVivo: true
            };
        }

        if (parsed.projectInterests) {
                    this.state.projectInterests = { ...this.state.projectInterests, ...parsed.projectInterests };
                }

                // Progetti Sandbox & Mini-IDE
                if (parsed.sandbox && Array.isArray(parsed.sandbox.projects) && parsed.sandbox.projects.length > 0) {
                    this.state.sandbox = parsed.sandbox;
                } else {
                    this.state.sandbox = this.getDefaultSandboxState();
                }

                // Impostazioni Audio
                if (parsed.soundEnabled !== undefined) {
                    SoundFX.enabled = parsed.soundEnabled;
                }
                if (parsed.soundVolume !== undefined) {
                    SoundFX.setVolume(parsed.soundVolume);
                }
                if (typeof parsed.musicEnabled === 'boolean')
                    SoundFX.musicEnabled = parsed.musicEnabled;
                if (parsed.musicVolume !== undefined)
                    SoundFX.musicVolume = SoundFX.clamp(parsed.musicVolume, SoundFX.musicVolume);
                // Sincronizza il bus senza avviare audio durante il caricamento.
                if (SoundFX.musicPlaying) {
                    if (!SoundFX.musicEnabled || !SoundFX.musicVolume) SoundFX.stopMusic();
                    else SoundFX.musicBus?.gain.setTargetAtTime(
                        SoundFX.musicVolume * 0.40, SoundFX.ctx.currentTime, 0.08);
                }

                // P3.1: Telemetria didattica per apprendimento adattivo
                if (parsed.learningTelemetry && parsed.learningTelemetry.schema_version) {
                    this.state.learningTelemetry = this.migrateLearningTelemetry(parsed.learningTelemetry, this.state.finishedLessons);
                } else {
                    this.state.learningTelemetry = this.initLearningTelemetryFromLegacy(this.state.finishedLessons);
                }

                // P3.3: Progresso Ripasso Intelligente
                if (parsed.reviewProgress) {
                    this.state.reviewProgress = {
                        completedVariants: Array.isArray(parsed.reviewProgress.completedVariants) ? parsed.reviewProgress.completedVariants : [],
                        variantHistory: (typeof parsed.reviewProgress.variantHistory === 'object' && parsed.reviewProgress.variantHistory !== null) ? parsed.reviewProgress.variantHistory : {}
                    };
                } else {
                    this.state.reviewProgress = { completedVariants: [], variantHistory: {} };
                }
            } else {
                this.state.currentWeekId = this.getWeekId();
                this.state.rewardsV2 = ProgressionV2.createRewards(0);
                this.state.sandbox = this.getDefaultSandboxState();
                this.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };
                if (this.isLocalEnvironment()) {
                    this.state.devAllUnlocked = true;
                } else {
                    this.state.devAllUnlocked = false;
                }
            }
        } catch (e) {
            console.warn("Storage non disponibile.");
        }
    },


    // P1: Un salvataggio per ogni identita'. Il vecchio gdscript_hero_save_v4
    // resta uno specchio compatibile, ma NON viene mai riutilizzato per un altro account.
    saveOwnerOf(user) {
        return user && !user.isGuest && typeof user.id === 'string' && user.id
            ? 'user:' + user.id : 'guest';
    },
    ownerStorageKey(owner) {
        return 'gdscript_hero_scoped_save_v1:' + owner;
    },
    initialSaveOwner() {
        try {
            const marker=localStorage.getItem('gdscript_hero_active_owner_v1');
            if(marker==='guest'||(marker && /^user:[a-zA-Z0-9_-]{3,100}$/.test(marker)))return marker;
            const raw=localStorage.getItem('gdscript_hero_auth_session');
            const session=raw?JSON.parse(raw):null;
            return this.saveOwnerOf(session);
        }catch(e){return 'guest';}
    },
    // Invocata PRIMA di ridisegnare la UI a ogni cambio di account, incluso logout.
    // NON fonde mai automaticamente dati di due identita' differenti.
    switchSaveOwner(user) {
        if(!this._saveOwner)return;
        const owner=this.saveOwnerOf(user);
        if(owner===this._saveOwner)return;
        this.saveReviewDraft();
        this.saveNavigationPosition();
        this.saveStorage({localOnly:true}); // backup del proprietario uscente
        try {
            for(const key of ['gdscript_hero_review_draft_v1','gdscript_hero_position_v1']){
                const saved=sessionStorage.getItem(key);
                if(saved!==null)sessionStorage.setItem(key+':'+this._saveOwner,saved);
                const restored=sessionStorage.getItem(key+':'+owner);
                if(restored===null)sessionStorage.removeItem(key);
                else sessionStorage.setItem(key,restored);
            }
        }catch(e){}
        let next=null;
        try{next=localStorage.getItem(this.ownerStorageKey(owner));}catch(e){}
        this._saveOwner=owner;
        this._forceShowConflictNotice=false;
        this._cloudHydrationPending=owner!=='guest' && !!window.AuthManager?.isCloudActive?.();
        this.state=JSON.parse(JSON.stringify(this._blankUserState));
        this.isReviewMode=false;
        this.currentReviewVariant=null;
        this.loadStorage(next);
        this.ensureUnlockedConsistency();
        this.applyTheme(this.state.theme||'dark');
        this.switchView('view-roadmap');
        this.updateNavSelection('roadmap');
        this.renderRoadmap();
        this.renderSidebarDailyQuests();
        this.updateStatsUI();
        this.applyProfileUI();
        this.updateQuestsBadge();
        this.saveStorage({localOnly:true});
    },

    getSavePayload() {
        return {
            theme: this.state.theme,
            xp: this.state.xp,
            rewardsV2: this.state.rewardsV2,
            streak: this.state.streak,
            finishedLessons: this.state.finishedLessons,
            completedLessons: this.state.completedLessons,
            devAllUnlocked: this.state.devAllUnlocked,
            unlockedAchievements: this.state.unlockedAchievements,
            streakMode: this.state.streakMode,
            streakGoalSelection:this.state.streakGoalSelection,
            siteWelcomeSeen:!!this.state.siteWelcomeSeen,
            streakWeeks: this.state.streakWeeks,
            activeDaysThisWeek: this.state.activeDaysThisWeek,
            currentWeekId: this.state.currentWeekId,
            lastActiveDate: this.state.lastActiveDate,
            soundEnabled: SoundFX.enabled,
            soundVolume: SoundFX.volume,
            musicEnabled: SoundFX.musicEnabled,
            musicVolume: SoundFX.musicVolume,
            userCode: this.state.userCode,
            profile: this.state.profile,
            profileCustomized: this.state.profileCustomized,
            guestOnboardingV1: this.state.guestOnboardingV1 || null,
            dailyQuests: this.state.dailyQuests,
            claimedQuestsCount: this.state.claimedQuestsCount,
            projectInterests: this.state.projectInterests,
            arenaProject: this.state.arenaProject,
            sandbox: this.state.sandbox,
            learningTelemetry: this.state.learningTelemetry,
            reviewProgress: this.state.reviewProgress
        };
    },
    saveStorage(options = {}) {
        const payload=this.getSavePayload();
        try{
            const serialized=JSON.stringify(payload);
            // Il salvataggio per identita' e' prioritario rispetto allo specchio legacy.
            localStorage.setItem(this.ownerStorageKey(this._saveOwner||'guest'),serialized);
            localStorage.setItem('gdscript_hero_active_owner_v1',this._saveOwner||'guest');
            try{localStorage.setItem('gdscript_hero_save_v4',serialized);}
            catch(error){console.warn('[App] Copia legacy non disponibile:',error);}
            this.renderLocalSaveError(false);
        }catch(error){
            this.renderLocalSaveError(true);
            console.error('[App] Salvataggio locale non riuscito:',error);
        }
        if(!options.localOnly && !this._cloudHydrationPending &&
            window.AuthManager?.syncUserProgress){
            window.AuthManager.syncUserProgress(payload);
        }
    },
    renderLocalSaveError(failed){
        this._localSaveFailed=failed;
        this.renderSyncStatus(window.AuthManager?.getSyncStatus?.()||{kind:'idle'});
    },
    renderSyncStatus(status={kind:'idle',message:''}){
        const notice=document.getElementById('gdh-save-notice');
        const auth=window.AuthManager;
        const isConflict=status.kind==='conflict' &&
            !!auth?._cloudVersion?.blocked;
        const row=document.getElementById('settings-sync-conflict-row');
        if(row){
            row.classList.toggle('hidden',!isConflict);
            const label=document.getElementById('settings-sync-conflict-text');
            if(label)label.textContent=isConflict
                ?'Continua a studiare normalmente. Il salvataggio locale è attivo; il cloud non viene sovrascritto fino alla risoluzione.'
                :'Sincronizzazione attiva';
        }
        const accountPill=document.getElementById('btn-open-auth-nav');
        if(accountPill){
            accountPill.setAttribute('data-sync-paused',isConflict?'true':'false');
            if(isConflict)accountPill.setAttribute('aria-description','Sincronizzazione cloud in sospeso; gestibile dalle Impostazioni');
            else accountPill.removeAttribute('aria-description');
        }
        if(!notice)return;
        const text=notice.querySelector('.gdh-save-notice-text');
        const retry=notice.querySelector('#gdh-save-retry');
        const resolve=notice.querySelector('#gdh-save-resolve');
        const backup=notice.querySelector('#gdh-save-backup');
        const dismiss=notice.querySelector('#gdh-save-dismiss');
        const hiddenConflict=isConflict &&
            !this._forceShowConflictNotice&&!!auth?.isConflictDismissed?.();
        const show=this._localSaveFailed||status.kind==='error'||
            (isConflict&&!hiddenConflict);
        notice.classList.toggle('hidden',!show);
        notice.dataset.kind=this._localSaveFailed?'error':status.kind;
        if(this._localSaveFailed)
            text.textContent='Non riesco a salvare in questo browser. Libera spazio o esporta i dati per non perderli.';
        else if(isConflict)
            text.textContent='Alcune modifiche a questo dispositivo sono diverse da quelle cloud. Puoi continuare normalmente: il codice locale è salvato e il cloud non verrà sovrascritto. Puoi gestire le differenze anche più tardi dalle Impostazioni.';
        else text.textContent=status.message||'Salvataggio cloud non confermato.';
        if(retry)retry.hidden=!!this._localSaveFailed||isConflict;
        if(resolve)resolve.hidden=!!this._localSaveFailed||!isConflict;
        if(backup)backup.hidden=!(this._localSaveFailed||isConflict);
        if(dismiss)dismiss.hidden=!!this._localSaveFailed||!isConflict;
    },

    // ==========================================
    // GESTIONE PROFILO GIOCATORE
    // ==========================================
    applyProfileUI() {
        const p = this.state.profile;
        const navName = document.getElementById('nav-profile-name');
        const navAvatar = document.getElementById('nav-profile-avatar');

        if (navName) navName.innerText = p.username;
        if (navAvatar) {
            navAvatar.innerText = p.avatar;
            navAvatar.style.borderColor = p.color;
            navAvatar.style.boxShadow = `0 0 10px ${p.color}55`;
        }
    },

    openProfileModal() {
        SoundFX.playClick();
        const p = this.state.profile;

        // Campi input
        const nameInput = document.getElementById('profile-username-input');
        if (nameInput) nameInput.value = p.username;

        const tagSelect = document.getElementById('profile-tag-select');
        if (tagSelect) tagSelect.value = p.tag;

        // Preview card
        this.updateProfilePreviewCard();

        // Selettore Avatar
        const avatarButtons = document.querySelectorAll('.avatar-option');
        avatarButtons.forEach(btn => {
            if (btn.getAttribute('data-avatar') === p.avatar) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });

        // Selettore Colore
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            if (swatch.getAttribute('data-color') === p.color) {
                swatch.classList.add('selected');
            } else {
                swatch.classList.remove('selected');
            }
        });

        document.getElementById('profile-modal').classList.remove('hidden');
    },

    updateProfilePreviewCard() {
        const p = this.state.profile;
        const info = this.getCurrentLevelInfo();

        const nameDisp = document.getElementById('profile-name-display');
        const tagDisp = document.getElementById('profile-tag-display');
        const avatarDisp = document.getElementById('profile-avatar-display');
        const levelDisp = document.getElementById('profile-level-display');

        if (nameDisp) nameDisp.innerText = p.username;
        if (tagDisp) tagDisp.innerText = p.tag;
        if (avatarDisp) {
            avatarDisp.innerText = p.avatar;
            avatarDisp.style.borderColor = p.color;
            avatarDisp.style.boxShadow = `0 0 25px ${p.color}55`;
        }
        if (levelDisp) levelDisp.innerText = `Livello ${info.tier.level} • ${info.tier.title}`;
        const prestige = document.getElementById('profile-prestige-display');
        if (prestige) {
            prestige.classList.toggle('hidden',!info.grade);
            prestige.innerHTML = info.grade
                ? ProgressionV2.gradeIcon(info.grade)+'<span>'+info.grade.title+'</span>'
                : '';
            if(info.grade) prestige.style.setProperty('--prestige-color',info.grade.color);
        }

        // Statistiche Carriera
        document.getElementById('profile-stat-xp').innerText = this.state.xp;
        document.getElementById('profile-stat-lessons').innerText = `${this.state.finishedLessons.length}/${LESSONS_DATA.length}`;
        const masteryDone = LESSONS_DATA.filter(l => l.isMastery && this.state.finishedLessons.includes(l.id)).length;
        const totalMastery = LESSONS_DATA.filter(l => l.isMastery).length;
        document.getElementById('profile-stat-mastery').innerText = `${masteryDone}/${totalMastery}`;
        document.getElementById('profile-stat-streak').innerText = `${this.state.streakWeeks}`;
    },

    closeProfileModal() {
        SoundFX.playClick();
        document.getElementById('profile-modal').classList.add('hidden');
    },

    saveProfile() {
        const nameInput = document.getElementById('profile-username-input');
        const tagSelect = document.getElementById('profile-tag-select');

        const newName = nameInput ? nameInput.value.trim() : "";
        if (newName) {
            this.state.profile.username = newName;
        }

        if (tagSelect) {
            this.state.profile.tag = tagSelect.value;
        }

        this.state.profileCustomized = true;
        this.saveStorage();
        this.applyProfileUI();
        this.checkAchievements();

        SoundFX.playSuccess();
        this.showToast({
            icon: "👤",
            tag: "PROFILO AGGIORNATO!",
            title: this.state.profile.username,
            desc: "Le modifiche alla tua identità sono state salvate."
        });

        this.closeProfileModal();
    },

    // ==========================================
    // MISSIONI GIORNALIERE (DAILY QUESTS)
    // ==========================================
    checkDailyQuestsReset() {
        const today = this.getTodayISO();
        if (!this.state.dailyQuests || this.state.dailyQuests.date !== today) {
            this.state.dailyQuests = {
                date: today,
                progress: {daily_exercise:0,review_success:0,study_variety:0},
                claimed: {daily_exercise:false,review_success:false,study_variety:false}
            };
            this.saveStorage();
        } else {
            // Un registro XP già pagato prevale sul flag di un cloud obsoleto.
            // Ogni identificativo contiene la data, perciò domani riparte.
            let reconciled=false;
            for(const quest of DAILY_QUESTS_CONFIG) {
                const key='quests:daily:'+today+':'+quest.id;
                if(Object.hasOwn(this.state.rewardsV2?.claims||{},key) &&
                    !this.state.dailyQuests.claimed?.[quest.id]) {
                    this.state.dailyQuests.claimed ??= {};
                    this.state.dailyQuests.claimed[quest.id]=true;
                    reconciled=true;
                }
            }
            if(reconciled)this.saveStorage();
        }
    },

    recordDailyQuestProgress(type, amount = 1) {
        this.checkDailyQuestsReset();
        if (!['daily_exercise','review_success'].includes(type)) return;
        if (!Number.isInteger(amount) || amount <= 0) return;
        const progress=this.state.dailyQuests.progress;
        progress[type]=Math.min(1,(Number(progress[type])||0)+amount);
        progress.study_variety=(progress.daily_exercise>=1 && progress.review_success>=1)?1:0;
        this.saveStorage();
        this.updateQuestsBadge();
        this.renderSidebarDailyQuests();
    },

    updateQuestsBadge() {
        this.checkDailyQuestsReset();
        let readyCount = 0;
        let completedCount = 0;

        DAILY_QUESTS_CONFIG.forEach(q => {
            const prog = this.state.dailyQuests.progress[q.id] || 0;
            const claimed = this.state.dailyQuests.claimed[q.id];
            if (prog >= q.target) {
                completedCount++;
                if (!claimed) readyCount++;
            }
        });

        const badge = document.getElementById('quests-count-badge');
        if (badge) {
            badge.innerText = `${completedCount}/${DAILY_QUESTS_CONFIG.length}`;
            // Lo stato grafico è gestito dal tema, non da colori neon inline.
            badge.style.removeProperty('background');
            badge.style.removeProperty('color');
            badge.classList.toggle('has-rewards', readyCount > 0);
        }

        const sidebarBadge = document.getElementById('sidebar-quests-badge');
        if (sidebarBadge) {
            sidebarBadge.innerText = `${completedCount}/${DAILY_QUESTS_CONFIG.length}`;
            if (readyCount > 0) {
                sidebarBadge.classList.add('has-rewards');
            } else {
                sidebarBadge.classList.remove('has-rewards');
            }
        }
    },

    
    getQuestIconSVG(questId) {
        switch (questId) {
            case 'daily_exercise':
                return '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
            case 'review_success':
                return '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5A7.85 7.85 0 0 1 9 14"/></svg>';
            case 'study_variety':
                return '<svg class="ui-icon" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
            default:
                return '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
        }
    },

    getProjectIconSVG(projectId) {
        switch (projectId) {
            case 'project_arena':
                return '<svg class="ui-icon ui-icon-lg" viewBox="0 0 24 24"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="17" x2="4" y2="20"/><line x1="3" y1="19" x2="5" y2="21"/></svg>';
            case 'project_platformer':
                return '<svg class="ui-icon ui-icon-lg" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 12h4m-2-2v4m8-2h.01m2-2h.01"/></svg>';
            default:
                return '<svg class="ui-icon ui-icon-lg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
        }
    },

    renderSidebarDailyQuests() {
        this.checkDailyQuestsReset();
        const list = document.getElementById('sidebar-quests-list');
        if (!list) return;
        list.innerHTML = '';

        const badge = document.getElementById('sidebar-quests-badge');
        const todayDateEl = document.getElementById('sidebar-today-date');
        if (todayDateEl) {
            const now = new Date();
            todayDateEl.innerText = now.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) + ' UTC';
        }

        let completedCount = 0;
        let readyCount = 0;

        DAILY_QUESTS_CONFIG.forEach(quest => {
            const prog = Math.min(quest.target, this.state.dailyQuests.progress[quest.id] || 0);
            const isCompleted = prog >= quest.target;
            const isClaimed = !!this.state.dailyQuests.claimed[quest.id];
            const percent = Math.round((prog / quest.target) * 100);
            const rewards = ProgressionV2.normalizeRewards(this.state.rewardsV2,this.state.xp,this.state.dailyQuests);
            const earnedKey = 'quests:daily:' + this.getTodayISO() + ':' + quest.id;
            const paid = Object.hasOwn(rewards.claims, earnedKey);

            if (isCompleted) completedCount++;
            if (isCompleted && !isClaimed) readyCount++;

            const item = document.createElement('div');
            item.className = `sidebar-quest-item ${isCompleted && !isClaimed ? 'ready' : ''} ${isClaimed ? 'claimed' : ''}`;
            item.innerHTML = `
                <div class="sidebar-quest-top">
                    <span class="sidebar-quest-icon">${this.getQuestIconSVG(quest.id)}</span>
                    <div class="sidebar-quest-title-wrap">
                        <span class="sidebar-quest-title" title="${quest.title}">${quest.title}</span>
                        <span class="sidebar-quest-reward">${'+'+quest.xpReward+' XP'}</span>
                    </div>
                </div>
                <div class="sidebar-quest-desc">${quest.desc}</div>
                <div class="sidebar-quest-progress-row">
                    <div class="sidebar-quest-bar">
                        <div class="sidebar-quest-fill" style="width: ${percent}%;"></div>
                    </div>
                    <span class="sidebar-quest-count">${prog}/${quest.target}</span>
                </div>
                <div class="sidebar-quest-action">
                    <button class="sidebar-quest-btn ${isClaimed ? 'claimed' : (isCompleted ? 'active' : 'in-progress')}" id="sidebar-btn-quest-${quest.id}">
                        ${isClaimed ? (paid ? '✓ Riscattato' : '✓ Completata') : (isCompleted ? 'Riscatta ricompensa' : 'In Corso')}
                    </button>
                </div>
            `;

            const claimBtn = item.querySelector(`#sidebar-btn-quest-${quest.id}`);
            if (claimBtn && isCompleted && !isClaimed) {
                claimBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.claimQuestReward(quest.id);
                };
            }

            list.appendChild(item);
        });

        if (badge) {
            badge.innerText = `${completedCount}/${DAILY_QUESTS_CONFIG.length}`;
            if (readyCount > 0) {
                badge.classList.add('has-rewards');
            } else {
                badge.classList.remove('has-rewards');
            }
        }
    },

    openQuestsModal() {
        SoundFX.playClick();
        this.checkDailyQuestsReset();
        const list = document.getElementById('quests-list-container');
        if (!list) return;
        list.innerHTML = '';

        const todayDateEl = document.getElementById('quests-today-date');
        if (todayDateEl) {
            const now = new Date();
            todayDateEl.innerText = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }) + ' UTC';
        }

        DAILY_QUESTS_CONFIG.forEach(quest => {
            const prog = Math.min(quest.target, this.state.dailyQuests.progress[quest.id] || 0);
            const isCompleted = prog >= quest.target;
            const isClaimed = !!this.state.dailyQuests.claimed[quest.id];
            const percent = Math.round((prog / quest.target) * 100);
            const rewards = ProgressionV2.normalizeRewards(this.state.rewardsV2,this.state.xp,this.state.dailyQuests);
            const earnedKey = 'quests:daily:' + this.getTodayISO() + ':' + quest.id;
            const paid = Object.hasOwn(rewards.claims, earnedKey);

            const card = document.createElement('div');
            card.className = `quest-card ${isCompleted && !isClaimed ? 'ready-to-claim' : ''}`;
            card.innerHTML = `
                <div class="quest-left">
                    <div class="quest-icon">${this.getQuestIconSVG(quest.id)}</div>
                    <div class="quest-info">
                        <div class="quest-title-row">
                            <span class="quest-title">${quest.title}</span>
                            <span class="quest-reward-badge">${'+'+quest.xpReward+' XP'}</span>
                        </div>
                        <div class="quest-desc">${quest.desc}</div>
                        <div class="quest-progress-track">
                            <div class="quest-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="quest-right">
                    <span class="quest-progress-text">${prog}/${quest.target}</span>
                    <button class="btn-claim-quest ${isClaimed ? 'claimed' : (isCompleted ? 'active' : '')}" id="btn-quest-${quest.id}">
                        ${isClaimed ? (paid ? '✓ Riscattato' : '✓ Completata') : (isCompleted ? 'Riscatta' : 'In Corso')}
                    </button>
                </div>
            `;

            const claimBtn = card.querySelector(`#btn-quest-${quest.id}`);
            if (claimBtn && isCompleted && !isClaimed) {
                claimBtn.onclick = () => this.claimQuestReward(quest.id);
            }

            list.appendChild(card);
        });

        document.getElementById('quests-modal').classList.remove('hidden');
    },

    closeQuestsModal() {
        SoundFX.playClick();
        document.getElementById('quests-modal').classList.add('hidden');
    },

    claimQuestReward(questId) {
        this.checkDailyQuestsReset();
        const quest = DAILY_QUESTS_CONFIG.find(q => q.id === questId);
        if (!quest || !this.state.dailyQuests ||
            this.state.dailyQuests.date !== this.getTodayISO() ||
            this.state.dailyQuests.claimed?.[questId] ||
            !Number.isFinite(Number(this.state.dailyQuests.progress?.[questId])) ||
            Number(this.state.dailyQuests.progress[questId]) < quest.target) return false;
        this.state.rewardsV2 = ProgressionV2.normalizeRewards(this.state.rewardsV2,this.state.xp,this.state.dailyQuests);
        const sourceId = 'daily:' + this.getTodayISO() + ':' + questId;
        const ledgerKey = 'quests:' + sourceId;
        const alreadyPaid = Object.hasOwn(this.state.rewardsV2.claims,ledgerKey);
        const gain = alreadyPaid ? 0 : ProgressionV2.grantRecurring(
            this.state.rewardsV2,'quests',sourceId,quest.xpReward);
        // Il registro giornaliero impedisce doppi premi con un cloud obsoleto.
        // Il budget settimanale non limita le missioni.
        this.state.dailyQuests.claimed[questId] = true;
        if (gain) this.state.xp += gain;
        this.state.claimedQuestsCount++;
        this.saveStorage();

        if (gain) {
            SoundFX.playFanfare();
            ConfettiFX.burst();
        } else SoundFX.playClick();
        this.showToast(gain ? {
            tag: 'RICOMPENSA RISCATTATA',
            title: quest.title,
            desc: `Hai guadagnato +${gain} XP extra!`
        } : {
            tag: 'MISSIONE COMPLETATA',
            title: quest.title,
            desc: alreadyPaid
                ? 'Premio già registrato: nessun XP duplicato.'
                : 'Missione completata.'
        });
        this.checkAchievements({ fromAction: true });
        this.updateStatsUI({ announceLevelUp: true });
        this.updateQuestsBadge();
        this.renderSidebarDailyQuests();
        const modal = document.getElementById('quests-modal');
        if (modal && !modal.classList.contains('hidden')) this.openQuestsModal();
        return true;
    },

    // =========================================================
    // VISTA SANDBOX & MINI-IDE GODOT 4 (Libera Sperimentazione)
    // =========================================================
    // Icone SVG statiche; nessun dato proveniente dai progetti entra nei riferimenti.
    sandboxIcon(name) {
        const allowed = new Set(['gamepad','folder','plus','pencil','trash','help',
            'package','play','network','file','monitor','terminal','bulb','refresh',
            'button','tag','clock','square','locate','circle','rocket','image','user','chart']);
        const id = allowed.has(name) ? name : 'circle';
        return `<svg class="ui-icon sandbox-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#gdh-icon-${id}"></use></svg>`;
    },

    getDefaultSandboxState() {
        return {
            activeProjectId: 'proj_default',
            projects: [
                {
                    id: 'proj_default',
                    name: 'Il Mio Gioco Godot',
                    code: `extends Node2D\n\nfunc _ready():\n    print("Sandbox avviata! Scrivi il tuo codice qui.")\n`,
                    nodes: [
                        { name: 'Main', type: 'Node2D', parent: null }
                    ],
                    updatedAt: new Date().toISOString()
                }
            ]
        };
    },

    getActiveSandboxProject() {
        if (!this.state.sandbox || !Array.isArray(this.state.sandbox.projects) || this.state.sandbox.projects.length === 0) {
            this.state.sandbox = this.getDefaultSandboxState();
        }
        let proj = this.state.sandbox.projects.find(p => p.id === this.state.sandbox.activeProjectId);
        if (!proj) {
            proj = this.state.sandbox.projects[0];
            this.state.sandbox.activeProjectId = proj.id;
        }
        return proj;
    },

    setupPracticeEditor() {
        this.setupSandbox();
    },

    setupSandbox() {
        const editor = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
        if (!editor) return;

        // Auto-save debounced a 800ms
        let autoSaveDebounce = null;
        editor.addEventListener('input', () => {
            window.GDHErrorGuide?.clearMark(editor);
            window.GDHErrorGuide?.clear('#sandbox-debug-area');
            this.updateSandboxLineNumbers();
            this.checkAutocomplete('sandbox');
            this.updateSandboxSyncStatus('saving');
            clearTimeout(autoSaveDebounce);
            autoSaveDebounce = setTimeout(() => {
                const curProj = this.getActiveSandboxProject();
                if (curProj) {
                    curProj.code = editor.value;
                    curProj.updatedAt = new Date().toISOString();
                    this.saveStorage();
                    this.updateSandboxSyncStatus('saved');
                }
            }, 800);
        });

        // Scroll sync per numeri di riga
        editor.addEventListener('scroll', () => {
            const linesEl = document.getElementById('sandbox-line-numbers') || document.getElementById('practice-line-numbers');
            if (linesEl) linesEl.scrollTop = editor.scrollTop;
        });

        // Stessi suggerimenti, tasti e completamento automatico dell'editor lezioni.
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runSandboxCode();
                return;
            }
            const popup = document.getElementById('sandbox-autocomplete-popup');
            if (popup && !popup.classList.contains('hidden')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.moveAutocompleteSelection(1, 'sandbox');
                    return;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.moveAutocompleteSelection(-1, 'sandbox');
                    return;
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    this.commitAutocompleteSelection('sandbox');
                    return;
                } else if (e.key === 'Escape') {
                    this.hideAutocomplete();
                    return;
                }
            }

            if (e.key === '(' || e.key === '"') {
                e.preventDefault();
                const pos = editor.selectionStart;
                const pair = e.key === '(' ? '()' : '""';
                editor.value = editor.value.substring(0, pos) + pair + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = pos + 1;
                editor.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                window.GDHEditorUX?.indent(editor,e.shiftKey);
                return;
            }
            if (e.key === 'Backspace' && window.GDHEditorUX?.backspace(editor)) {
                e.preventDefault();
                return;
            }
            if (e.key === 'Enter' && !e.altKey && !e.isComposing) {
                e.preventDefault();
                this.insertSmartNewline(editor);
                return;
            }
        });

        // Dropdown selezione progetto
        const projSelect = document.getElementById('sandbox-project-select');
        if (projSelect) {
            projSelect.addEventListener('change', (e) => {
                SoundFX.playClick();
                this.switchSandboxProject(e.target.value);
            });
        }

        // Modale Nuovo Progetto
        const btnNew = document.getElementById('btn-sandbox-new-project');
        const modalNew = document.getElementById('modal-sandbox-new-project');
        const btnCloseNew = document.getElementById('btn-close-sandbox-new');
        const btnCancelNew = document.getElementById('btn-cancel-sandbox-new');
        const btnConfirmNew = document.getElementById('btn-confirm-sandbox-new');

        if (btnNew && modalNew) {
            btnNew.onclick = () => {
                SoundFX.playClick();
                modalNew.classList.remove('hidden');
                const nameInput = document.getElementById('sandbox-new-name-input');
                if (nameInput) {
                    nameInput.value = `Progetto ${(this.state.sandbox.projects || []).length + 1}`;
                    nameInput.focus();
                }
            };
        }
        if (btnCloseNew && modalNew) btnCloseNew.onclick = () => modalNew.classList.add('hidden');
        if (btnCancelNew && modalNew) btnCancelNew.onclick = () => modalNew.classList.add('hidden');
        if (btnConfirmNew) {
            btnConfirmNew.onclick = () => {
                const nameInput = document.getElementById('sandbox-new-name-input');
                const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Nuovo Progetto';
                this.createSandboxProject(name);
                if (modalNew) modalNew.classList.add('hidden');
            };
        }

        // Modale Benvenuto / Guida Sandbox
        const btnHelp = document.getElementById('btn-sandbox-help');
        const modalWelcome = document.getElementById('modal-sandbox-welcome');
        const btnCloseWelcome = document.getElementById('btn-close-sandbox-welcome');
        const btnStartWelcome = document.getElementById('btn-start-sandbox-welcome');

        if (btnHelp && modalWelcome) {
            btnHelp.onclick = () => {
                SoundFX.playClick();
                modalWelcome.classList.remove('hidden');
            };
        }
        if (btnCloseWelcome && modalWelcome) {
            btnCloseWelcome.onclick = () => {
                SoundFX.playClick();
                modalWelcome.classList.add('hidden');
                localStorage.setItem('sandbox_welcome_seen', 'true');
            };
        }
        if (btnStartWelcome && modalWelcome) {
            btnStartWelcome.onclick = () => {
                SoundFX.playSuccess();
                modalWelcome.classList.add('hidden');
                localStorage.setItem('sandbox_welcome_seen', 'true');
            };
        }

        // Modale Rinomina Progetto
        const btnRename = document.getElementById('btn-sandbox-rename-project');
        const modalRename = document.getElementById('modal-sandbox-rename-project');
        const btnCloseRename = document.getElementById('btn-close-sandbox-rename');
        const btnCancelRename = document.getElementById('btn-cancel-sandbox-rename');
        const btnConfirmRename = document.getElementById('btn-confirm-sandbox-rename');

        if (btnRename && modalRename) {
            btnRename.onclick = () => {
                SoundFX.playClick();
                modalRename.classList.remove('hidden');
                const cur = this.getActiveSandboxProject();
                const renInput = document.getElementById('sandbox-rename-input');
                if (renInput && cur) {
                    renInput.value = cur.name;
                    renInput.focus();
                }
            };
        }
        if (btnCloseRename && modalRename) btnCloseRename.onclick = () => modalRename.classList.add('hidden');
        if (btnCancelRename && modalRename) btnCancelRename.onclick = () => modalRename.classList.add('hidden');
        if (btnConfirmRename) {
            btnConfirmRename.onclick = () => {
                const renInput = document.getElementById('sandbox-rename-input');
                if (renInput && renInput.value.trim()) {
                    this.renameSandboxProject(renInput.value.trim());
                }
                if (modalRename) modalRename.classList.add('hidden');
            };
        }

        // Elimina Progetto Corrente
        const btnDelete = document.getElementById('btn-sandbox-delete-project');
        if (btnDelete) {
            btnDelete.onclick = () => this.deleteSandboxProject();
        }

        // Esporta per Godot 4
        const btnExport = document.getElementById('btn-sandbox-export-godot');
        if (btnExport) {
            btnExport.onclick = () => this.exportSandboxToGodot4();
        }

        // Esegui Scena
        const btnRun = document.getElementById('btn-sandbox-run') || document.getElementById('btn-practice-run');
        if (btnRun) {
            btnRun.onclick = () => this.runSandboxCode();
        }

        // Scene Tree Aggiungi & Rimuovi Nodo
        const btnAddNode = document.getElementById('btn-sandbox-add-node');
        if (btnAddNode) {
            btnAddNode.onclick = () => this.openAddNodeModal('sandbox');
        }

        const btnRemoveNode = document.getElementById('btn-sandbox-remove-node');
        if (btnRemoveNode) {
            btnRemoveNode.onclick = () => this.removeSandboxNode(this.selectedSandboxNode);
        }

        // Viewport Riavvia & Pulisci Console
        const btnRestart = document.getElementById('btn-sandbox-restart') || document.getElementById('btn-practice-restart');
        if (btnRestart) {
            btnRestart.onclick = () => {
                SoundFX.playClick();
                if (this.practiceViewport) this.practiceViewport.replay();
            };
        }

        const btnClearConsole = document.getElementById('btn-sandbox-clear-console') || document.getElementById('btn-practice-clear');
        if (btnClearConsole) {
            btnClearConsole.onclick = () => this.clearSandboxConsole();
        }
    },

    updateSandboxLineNumbers() {
        const editor = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
        const linesEl = document.getElementById('sandbox-line-numbers') || document.getElementById('practice-line-numbers');
        if (!editor || !linesEl) return;

        const count = editor.value.split('\n').length;
        let nums = '';
        for (let i = 1; i <= Math.max(count, 1); i++) {
            nums += i + '\n';
        }
        linesEl.innerText = nums;
        window.GDHEditorUX?.refresh(editor);
    },

    updateSandboxSyncStatus(status = 'saved') {
        const badge = document.getElementById('sandbox-sync-badge');
        const dot = document.getElementById('sandbox-sync-dot');
        const text = document.getElementById('sandbox-sync-text');
        if (!badge || !dot || !text) return;

        if (status === 'saving') {
            dot.className = 'sync-dot saving';
            text.innerText = 'Salvataggio in corso...';
        } else {
            const isCloud = window.AuthManager && !window.AuthManager.isGuest();
            if (isCloud) {
                dot.className = 'sync-dot cloud';
                const email = (window.AuthManager.currentUser && window.AuthManager.currentUser.email) ? window.AuthManager.currentUser.email : 'Cloud';
                text.innerText = `Sincronizzato (${email})`;
                badge.title = `I tuoi progetti sono salvati nel database cloud per ${email}`;
            } else {
                dot.className = 'sync-dot local';
                text.innerText = 'Salvato nel Browser (Accedi per Cloud)';
                badge.title = 'Salvataggio locale nel browser. Effettua l\'accesso per sincronizzare su altri PC o telefono.';
            }
        }
    },

    switchView(activeViewId) {
        const views = [
            'view-roadmap',
            'view-exercise',
            'view-quiz',
            'view-practice',
            'view-projects',
            'view-review',
            'view-stats'
        ];
        const current = views.find(id => {
            const el = document.getElementById(id);
            return el && !el.classList.contains('hidden');
        });
        const changed = current !== activeViewId;
        views.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === activeViewId) {
                el.classList.remove('hidden');
                // Only genuine navigation animates; re-rendering an exercise,
                // revisiting the current tab and typing never restart motion.
                if (changed) el.classList.add('gdh-view-enter');
            } else {
                el.classList.add('hidden');
                el.classList.remove('gdh-view-enter');
            }
        });
        this.saveNavigationPosition();
    },

    openPracticeView() {
        SoundFX.playClick();
        this.hideAutocomplete();

        this.switchView('view-practice');

        this.updateNavSelection('practice');
        this.loadActiveSandboxProject();
        setTimeout(() => this.practiceViewport && this.practiceViewport.resize(), 80);

        // Mostra modale benvenuto se prima visita
        if (!localStorage.getItem('sandbox_welcome_seen')) {
            const modalWelcome = document.getElementById('modal-sandbox-welcome');
            if (modalWelcome) {
                modalWelcome.classList.remove('hidden');
            }
        }
    },

    loadActiveSandboxProject() {
        const cur = this.getActiveSandboxProject();
        if (!cur) return;

        // Popola dropdown progetti
        const projSelect = document.getElementById('sandbox-project-select');
        if (projSelect) {
            projSelect.innerHTML = '';
            (this.state.sandbox.projects || []).forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id;
                opt.textContent = p.name;
                if (p.id === cur.id) opt.selected = true;
                projSelect.appendChild(opt);
            });
        }

        // Imposta codice nell'editor
        const editor = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
        if (editor) {
            window.GDHErrorGuide?.clearMark(editor);
            window.GDHErrorGuide?.clear('#sandbox-debug-area');
            editor.value = cur.code || '';
            this.updateSandboxLineNumbers();
        }

        // Un progetto cambiato richiede una nuova istanza Godot prima dei clic.
        this.sandboxNativeSession = null;
        // Costruisci e renderizza Scena Godot
        this.sandboxScene = this.buildSceneFromNodes(cur.nodes || []);
        this.renderSandboxSceneDock();
        this.renderSandboxViewportOverlay();
        this.updateSandboxSyncStatus('saved');
    },

    switchSandboxProject(projectId) {
        // Salva prima il codice del progetto uscente
        const cur = this.getActiveSandboxProject();
        const editor = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
        if (cur && editor) {
            cur.code = editor.value;
            cur.updatedAt = new Date().toISOString();
        }

        this.state.sandbox.activeProjectId = projectId;
        this.saveStorage();
        this.loadActiveSandboxProject();
        SoundFX.playSuccess();
    },

    createSandboxProject(name = 'Nuovo Progetto') {
        const id = 'proj_' + Date.now();
        const newProj = {
            id: id,
            name: name,
            code: `extends Node2D\n\nfunc _ready():\n    print("Progetto ${name} avviato!")\n`,
            nodes: [
                { name: 'Main', type: 'Node2D', parent: null }
            ],
            updatedAt: new Date().toISOString()
        };

        if (!this.state.sandbox.projects) this.state.sandbox.projects = [];
        this.state.sandbox.projects.push(newProj);
        this.state.sandbox.activeProjectId = id;
        this.saveStorage();
        this.loadActiveSandboxProject();

        SoundFX.playFanfare();
        this.showToast({
            iconName: 'rocket',
            tag: 'SANDBOX',
            title: 'Nuovo Progetto Creato',
            desc: `"${name}" è ora attivo e sincronizzato!`
        });
    },

    renameSandboxProject(newName) {
        const cur = this.getActiveSandboxProject();
        if (!cur) return;
        cur.name = newName;
        cur.updatedAt = new Date().toISOString();
        this.saveStorage();
        this.loadActiveSandboxProject();
        SoundFX.playSuccess();
        this.showToast({
            iconName: 'pencil',
            tag: 'SANDBOX',
            title: 'Progetto Rinominato',
            desc: `Nome aggiornato in "${newName}"`
        });
    },

    deleteSandboxProject() {
        const cur = this.getActiveSandboxProject();
        if (!cur) return;

        if (this.state.sandbox.projects.length <= 1) {
            if (!confirm(`Vuoi azzerare il progetto "${cur.name}" alle impostazioni di default?`)) return;
            const def = this.getDefaultSandboxState().projects[0];
            cur.name = def.name;
            cur.code = def.code;
            cur.nodes = def.nodes;
            cur.updatedAt = new Date().toISOString();
        } else {
            if (!confirm(`Sei sicuro di voler eliminare definitivamente il progetto "${cur.name}"?`)) return;
            this.state.sandbox.projects = this.state.sandbox.projects.filter(p => p.id !== cur.id);
            this.state.sandbox.activeProjectId = this.state.sandbox.projects[0].id;
        }

        this.saveStorage();
        this.loadActiveSandboxProject();
        SoundFX.playClick();
        this.showToast({
            iconName: 'trash',
            tag: 'SANDBOX',
            title: 'Progetto Rimosso',
            desc: 'La lista progetti è stata aggiornata.'
        });
    },

    buildSceneFromNodes(nodesList) {
        if (!nodesList || nodesList.length === 0) {
            return new GD_Node("Main");
        }
        const nodeMap = new Map();
        let root = null;

        nodesList.forEach(item => {
            let n;
            const type = item.type || 'Node2D';
            if (type === 'Button' && window.GD_Button) {
                n = new GD_Button(item.name);
                if (item.text !== undefined) n.text = item.text;
            } else if (type === 'Label' && window.GD_Label) {
                n = new GD_Label(item.name);
                if (item.text !== undefined) n.text = item.text;
            } else if (type === 'Timer' && window.GD_Timer) {
                n = new GD_Timer(item.name);
            } else if (type === 'ColorRect' && window.GD_ColorRect) {
                n = new GD_ColorRect(item.name);
            } else if (type === 'Sprite2D' && window.GD_Sprite2D) {
                n = new GD_Sprite2D(item.name);
            } else if (type === 'CharacterBody2D' && window.GD_CharacterBody2D) {
                n = new GD_CharacterBody2D(item.name);
            } else if (type === 'ProgressBar' && window.GD_ProgressBar) {
                n = new GD_ProgressBar(item.name);
            } else if (type === 'Node2D' && window.GD_Node2D) {
                n = new GD_Node2D(item.name);
            } else if (window.GD_Node) {
                n = new GD_Node(item.name);
            }
            if (n) {
                n.type = type;
                nodeMap.set(item.name, n);
                if (!item.parent && !root) {
                    root = n;
                }
            }
        });

        nodesList.forEach(item => {
            if (item.parent && nodeMap.has(item.parent) && nodeMap.has(item.name)) {
                nodeMap.get(item.parent).add_child(nodeMap.get(item.name));
            }
        });

        return root || new GD_Node("Main");
    },

    renderSandboxSceneDock() {
        const treeContainer = document.getElementById('sandbox-scene-tree');
        if (!treeContainer) return;
        treeContainer.innerHTML = '';

        const cur = this.getActiveSandboxProject();
        const nodesList = cur ? (cur.nodes || []) : [];

        // Aggiorna contatore nodi
        const countEl = document.getElementById('sandbox-scene-node-count');
        if (countEl) {
            countEl.innerText = `${nodesList.length} ${nodesList.length === 1 ? 'nodo' : 'nodi'}`;
        }

        const getNodeIcon = type => {
            const icons = {
                Button:'button', Label:'tag', Timer:'clock', ColorRect:'square',
                Sprite2D:'image', CharacterBody2D:'user', ProgressBar:'chart',
                Node2D:'network', Node:'circle'
            };
            return this.sandboxIcon(icons[type] || 'package');
        };

        const buildTreeDom = (node, depth = 0) => {
            if (!node) return;
            const item = document.createElement('div');
            item.className = 'scene-tree-item';
            if (this.selectedSandboxNode && this.selectedSandboxNode.name === node.name) {
                item.classList.add('selected');
            }
            item.style.paddingLeft = `${12 + depth * 16}px`;

            const icon = getNodeIcon(node.type);
            // Le icone SVG sono controllate dall'app; nome e tipo provengono
            // invece da progetti modificabili/importabili e vanno resi come testo.
            item.innerHTML = `
                <span class="scene-node-icon">${icon}</span>
                <span class="scene-node-name"></span>
                <span class="scene-node-type-badge"></span>
            `;
            item.querySelector('.scene-node-name').textContent = String(node.name ?? '');
            item.querySelector('.scene-node-type-badge').textContent = String(node.type || 'Node');

            item.onclick = (e) => {
                e.stopPropagation();
                SoundFX.playClick();
                this.selectSandboxSceneNode(node);
            };

            treeContainer.appendChild(item);

            for (const child of node.children) {
                buildTreeDom(child, depth + 1);
            }
        };

        if (this.sandboxScene) {
            buildTreeDom(this.sandboxScene);
        }

        // Aggiorna visibilità tasto Rimuovi
        const removeBtn = document.getElementById('btn-sandbox-remove-node');
        if (removeBtn) {
            if (this.selectedSandboxNode && this.selectedSandboxNode !== this.sandboxScene && this.selectedSandboxNode.parent) {
                removeBtn.classList.remove('hidden');
                removeBtn.title = `Rimuovi il nodo '${this.selectedSandboxNode.name}'`;
            } else {
                removeBtn.classList.add('hidden');
            }
        }

        // Dettagli nodo selezionato
        const detailsEl = document.getElementById('sandbox-node-details');
        if (detailsEl) {
            if (this.selectedSandboxNode) {
                const s = this.selectedSandboxNode;
                // Non interpretare mai come HTML nomi, tipi o testi dei nodi.
                detailsEl.innerHTML = '<div>Nodo Selezionato: <strong class="sandbox-selected-name"></strong> <span class="sandbox-selected-type"></span></div>';
                const detail = detailsEl.firstElementChild;
                detail.querySelector('.sandbox-selected-name').textContent = `$${s.name}`;
                detail.querySelector('.sandbox-selected-type').textContent = `(${s.type || 'Node'})`;
                if (s.text !== undefined) {
                    const textLabel = document.createTextNode(' | Testo: ');
                    const textValue = document.createElement('strong');
                    textValue.textContent = `"${s.text}"`;
                    detail.append(textLabel, textValue);
                }
            } else {
                detailsEl.innerHTML = `<div class="sandbox-node-hint">${this.sandboxIcon('bulb')} <span>Clicca un nodo per selezionarlo oppure usa <strong>Nodo</strong> per aggiungerne altri.</span></div>`;
            }
        }
    },

    selectSandboxSceneNode(node) {
        this.selectedSandboxNode = node;
        this.renderSandboxSceneDock();
    },

    // Il modello JS serve unicamente per la rappresentazione. Testi e proprietà
    // vengono letti dallo snapshot restituito da Godot, senza mutare il progetto.
    applySandboxNativeSnapshot(snapshot) {
        if (!snapshot || typeof snapshot !== 'object' || !this.sandboxScene) return;
        const visit = node => {
            if (!node) return;
            const state = snapshot[node.name];
            if (state?.exists) {
                if (typeof state.text === 'string') node.text = state.text;
                if (typeof state.disabled === 'boolean') node.disabled = state.disabled;
                if (typeof state.visible === 'boolean') node.visible = state.visible;
                if (typeof state.color === 'string' && /^[a-f0-9]{6}$/i.test(state.color)) node.color = '#' + state.color;
                if (Number.isFinite(state.value)) node.value = state.value;
            }
            node.children = (node.children || []).filter(child =>
                snapshot[child.name]?.exists !== false && !snapshot[child.name]?.queued);
            for (const child of node.children) visit(child);
        };
        visit(this.sandboxScene);
    },

    renderSandboxViewportOverlay() {
        const overlay = document.getElementById('sandbox-ui-overlay');
        if (!overlay) return;
        overlay.innerHTML = '';
        if (!this.sandboxScene) return;

        const collectUiNodes = (node, list = []) => {
            if (node !== this.sandboxScene) {
                if (['Button', 'Label', 'ColorRect'].includes(node.type)) {
                    list.push(node);
                }
            }
            for (const child of node.children) {
                collectUiNodes(child, list);
            }
            return list;
        };

        const uiNodes = collectUiNodes(this.sandboxScene);
        if (uiNodes.length === 0) {
            overlay.style.display = 'none';
            return;
        }

        overlay.style.display = 'flex';

        for (const node of uiNodes) {
            if (node.type === 'Button') {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'godot-ui-btn';
                btn.textContent = node.text || node.name;
                btn.disabled = !!node.disabled;
                btn.title = `Clicca nodo Button: $${node.name}`;
                btn.addEventListener('click', async () => {
                    SoundFX.playClick();
                    const output = document.getElementById('sandbox-console-output');
                    const project = this.getActiveSandboxProject();
                    if (!this.sandboxNativeSession || this.sandboxNativeSession !== project?.id) {
                        if (output) output.textContent = '// Premi Esegui Scena prima di interagire con i nodi.';
                        return;
                    }
                    btn.disabled = true;
                    try {
                        // Emette il vero segnale pressed sull'istanza Godot già avviata:
                        // salute, variabili e connessioni rimangono persistenti.
                        const response = await window.GDHGodot.sandboxAction(node.name, 'pressed');
                        if (output) {
                            if (response.logs.length) output.textContent += '\n' + response.logs.join('\n');
                            if (response.error) output.textContent += '\n// Errore Godot: ' + response.error;
                            output.scrollTop = output.scrollHeight;
                        }
                        if (response.success) this.applySandboxNativeSnapshot(response.native?.scene);
                    } catch (error) {
                        if (output) output.textContent += '\n// Errore: ' + String(error.message || error);
                    } finally {
                        this.renderSandboxSceneDock();
                        this.renderSandboxViewportOverlay();
                    }
                });
                overlay.appendChild(btn);
            } else if (node.type === 'Label') {
                const lbl = document.createElement('div');
                lbl.className = 'godot-ui-label';
                lbl.textContent = node.text !== undefined ? node.text : '';
                overlay.appendChild(lbl);
            } else if (node.type === 'ColorRect') {
                const rect = document.createElement('div');
                rect.className = 'godot-ui-colorrect';
                rect.style.backgroundColor = node.color || '#438eff';
                overlay.appendChild(rect);
            }
        }
    },

    async runSandboxCode() {
        SoundFX.playClick();
        const editor = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
        const outputPre = document.getElementById('sandbox-console-output') || document.getElementById('practice-console-output');
        const statusTag = document.getElementById('sandbox-status-tag') || document.getElementById('practice-status-tag');
        if (!editor || !outputPre) return;

        if (statusTag) {
            statusTag.innerText = "In esecuzione...";
            statusTag.style.color = "#f59e0b";
        }

        const startT = performance.now();
        const code = editor.value;

        window.GDHErrorGuide?.clearMark(editor);
        window.GDHErrorGuide?.clear('#sandbox-debug-area');
        // Salva codice nel progetto attivo
        const cur = this.getActiveSandboxProject();
        if (cur) {
            cur.code = code;
            cur.updatedAt = new Date().toISOString();
            this.saveStorage();
        }

        // Ricostruisci la vista dal progetto: il motore riceve questi stessi nodi.
        this.sandboxNativeSession = null;
        this.sandboxScene = this.buildSceneFromNodes(cur ? cur.nodes : []);

         try {
            const res = await window.GDHGodot.execute(code, {
                sandboxNodes: cur ? cur.nodes : [],
                initialScene: this.sandboxScene,
                onLog: (line) => {
                    if (outputPre.innerText === "// Console ripulita" || outputPre.innerText.startsWith("// Esecuzione completata")) {
                        outputPre.innerText = line;
                    } else {
                        outputPre.innerText += '\n' + line;
                    }
                    outputPre.scrollTop = outputPre.scrollHeight;
                }
            });
            // La diagnostica è restituita dal vero Godot, non dal runtime JS.
            if (editor.value === code) this.updateDidacticDebugger(res, [], 'sandbox');
            this.sandboxScope = res.scope;
            this.sandboxNativeSession = res.success ? cur?.id : null;
            if (res.success) this.applySandboxNativeSnapshot(res.native?.scene);
            const elapsed = Math.round(performance.now() - startT);

            if (res.error) {
                outputPre.textContent = '// Errore Godot: ' + res.error;
                outputPre.style.color = '#ffb4b4';
                if (statusTag) {
                    statusTag.textContent = 'Errore Script';
                    statusTag.style.color = '#fca5a5';
                }
                SoundFX.playError();
            } else if (res.logs && res.logs.length > 0) {
                outputPre.innerText = res.logs.join('\n');
                outputPre.style.color = '#38bdf8';
                if (statusTag) {
                    statusTag.innerText = `OK (${elapsed} ms)`;
                    statusTag.style.color = '#10b981';
                }
                SoundFX.playSuccess();
            } else {
                outputPre.innerText = "// Esecuzione completata (nessun output print a console)";
                outputPre.style.color = '#94a3b8';
                if (statusTag) {
                    statusTag.innerText = `OK (${elapsed} ms)`;
                    statusTag.style.color = '#10b981';
                }
            }

            if (this.practiceViewport) {
                this.practiceViewport.updateFromExecution(res, null, !res.error);
            }

            this.renderSandboxSceneDock();
            this.renderSandboxViewportOverlay();
            this.updateSandboxSyncStatus('saved');
        } catch (e) {
            if (editor.value === code) this.updateDidacticDebugger({error:String(e.message || e),nativeStatus:'inconclusive'}, [], 'sandbox');
            outputPre.innerText = `// Errore inaspettato: ${e.message}`;
            outputPre.style.color = '#f87171';
            if (statusTag) {
                statusTag.innerText = "Errore";
                statusTag.style.color = '#ef4444';
            }
            SoundFX.playError();
        }
    },

    clearSandboxConsole() {
        SoundFX.playClick();
        const outputPre = document.getElementById('sandbox-console-output') || document.getElementById('practice-console-output');
        const statusTag = document.getElementById('sandbox-status-tag') || document.getElementById('practice-status-tag');
        window.GDHErrorGuide?.clear('#sandbox-debug-area');
        if (outputPre) outputPre.innerText = "// Console ripulita";
        if (statusTag) statusTag.innerText = "Pronto";
    },

    exportSandboxToGodot4() {
        SoundFX.playClick();
        const cur = this.getActiveSandboxProject();
        if (!cur) return;

        const projectName = cur.name || "MioProgettoGodot";

        // 1. Script main.gd
        const scriptHeader = `# ==========================================\n# Creato con GDScript Hero Sandbox\n# Progetto: ${projectName}\n# Data: ${new Date().toLocaleDateString()}\n# ==========================================\n\n`;
        const scriptContent = scriptHeader + (cur.code || 'extends Node2D\n\nfunc _ready():\n    pass\n');

        // 2. Scena main.tscn per Godot 4
        let tscnContent = `[gd_scene load_steps=2 format=3]\n\n`;
        tscnContent += `[ext_resource type="Script" path="res://main.gd" id="1_main"]\n\n`;
        tscnContent += `[node name="Main" type="Node2D"]\n`;
        tscnContent += `script = ExtResource("1_main")\n\n`;

        let uiOffsetTop = 40;
        (cur.nodes || []).forEach(n => {
            if (!n.parent) return; // Salta radice già definita come Main
            const type = n.type || 'Node2D';
            tscnContent += `[node name="${n.name}" type="${type}" parent="."]\n`;
            if (type === 'Label') {
                tscnContent += `offset_left = 40.0\n`;
                tscnContent += `offset_top = ${uiOffsetTop}.0\n`;
                tscnContent += `text = "${(n.text || '').replace(/"/g, '\\"')}"\n\n`;
                uiOffsetTop += 40;
            } else if (type === 'Button') {
                tscnContent += `offset_left = 40.0\n`;
                tscnContent += `offset_top = ${uiOffsetTop}.0\n`;
                tscnContent += `text = "${(n.text || 'Button').replace(/"/g, '\\"')}"\n\n`;
                uiOffsetTop += 50;
            } else if (type === 'Sprite2D') {
                tscnContent += `position = Vector2(240, 160)\n\n`;
            } else if (type === 'Timer') {
                tscnContent += `wait_time = 1.0\nautostart = true\n\n`;
            } else if (type === 'ColorRect') {
                tscnContent += `color = Color(0.26, 0.55, 1, 1)\n`;
                tscnContent += `offset_right = 100.0\noffset_bottom = 30.0\n\n`;
            } else {
                tscnContent += `\n`;
            }
        });

        // Funzione helper download file
        const downloadBlob = (filename, text) => {
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        };

        downloadBlob('main.gd', scriptContent);
        setTimeout(() => downloadBlob('main.tscn', tscnContent), 300);

        SoundFX.playFanfare();
        this.showToast({
            iconName: 'package',
            tag: 'ESPORTAZIONE GODOT 4',
            title: 'File main.gd e main.tscn Scaricati!',
            desc: 'Trascina i file nella cartella di un progetto Godot Engine 4 per eseguirli!'
        });
    },

    addSandboxNode(name, type, text) {
        const cur = this.getActiveSandboxProject();
        if (!cur) return;
        if (!cur.nodes) cur.nodes = [{ name: 'Main', type: 'Node2D', parent: null }];

        // Assicurati che non ci siano duplicati di nome
        let finalName = name;
        let counter = 1;
        while (cur.nodes.some(n => n.name === finalName)) {
            finalName = `${name}_${counter++}`;
        }

        const newNode = {
            name: finalName,
            type: type,
            text: text || '',
            parent: 'Main'
        };

        cur.nodes.push(newNode);
        cur.updatedAt = new Date().toISOString();

        this.saveStorage();
        this.sandboxScene = this.buildSceneFromNodes(cur.nodes);
        this.renderSandboxSceneDock();
        this.renderSandboxViewportOverlay();

        SoundFX.playSuccess();
        this.showToast({
            iconName: 'plus',
            tag: 'SCENA GODOT',
            title: 'Nodo Aggiunto!',
            desc: `Nodo '$${finalName}' (${type}) aggiunto alla scena Sandbox.`
        });
    },

    removeSandboxNode(targetNode) {
        if (!targetNode) return;
        const cur = this.getActiveSandboxProject();
        if (!cur || !cur.nodes) return;

        if (targetNode.name === 'Main' || !targetNode.parent) {
            alert('Il nodo radice (Main) non può essere rimosso!');
            return;
        }

        if (!confirm(`Rimuovere il nodo '$${targetNode.name}' dalla scena?`)) return;

        cur.nodes = cur.nodes.filter(n => n.name !== targetNode.name && n.parent !== targetNode.name);
        cur.updatedAt = new Date().toISOString();

        this.selectedSandboxNode = null;
        this.saveStorage();
        this.sandboxScene = this.buildSceneFromNodes(cur.nodes);
        this.renderSandboxSceneDock();
        this.renderSandboxViewportOverlay();

        SoundFX.playClick();
        this.showToast({
            iconName: 'trash',
            tag: 'SCENA GODOT',
            title: 'Nodo Rimosso',
            desc: `Il nodo '$${targetNode.name}' è stato rimosso dalla scena.`
        });
    },

    // ==========================================
    // VISTA PROGETTI PRATICI (W.I.P.)
    // ==========================================
    showProjectsView() {
        this.openProjectsView();
    },

    openProjectsView() {
        SoundFX.playClick();
        this.hideAutocomplete();

        this.switchView('view-projects');

        const cat = document.getElementById('projects-catalog-section');
        const ws = document.getElementById('project-arena-workspace');
        if (cat) cat.classList.remove('hidden');
        if (ws) ws.classList.add('hidden');
        document.getElementById('competition-workspace')?.classList.add('hidden');
        document.getElementById('official-arena-workspace')?.classList.add('hidden');

        this.updateNavSelection('projects');
        this.renderProjectsGrid();
    },

    openCompetitiveArena() {
        // Funzionalità sospesa: non aprire la demo nemmeno tramite chiamate dirette.
        this.openProjectsView();
    },

    closeCompetitiveArena() {
        this.openProjectsView();
    },

    openOfficialArena() {
        // Classifiche e invio ufficiale in pausa; resta visibile il catalogo.
        this.openProjectsView();
    },

    renderProjectsGrid() {
        const grid = document.getElementById('projects-grid-container');
        if (!grid) return;
        grid.innerHTML = '';

        PROJECTS_DATA.forEach(proj => {
            const card = document.createElement('div');
            card.className = "project-card";

            const pills = proj.topics.map(t => `<span class="topic-pill">${t}</span>`).join('');

            const isArena = proj.id === "project_arena";
            if (!isArena) {
                card.classList.add("gdh-project-coming-soon");
                card.setAttribute("aria-label", proj.title + ": progetto Premium in arrivo");
                card.innerHTML = `
                    <div class="gdh-coming-soon-preview" aria-hidden="true">
                        <div class="project-card-top">
                            <div class="project-card-icon">${this.getProjectIconSVG(proj.id)}</div>
                            <span class="${proj.badgeClass}">${proj.badge}</span>
                        </div>
                        <h3>${proj.title}</h3>
                        <p>${proj.desc}</p>
                        <div class="project-topics-pills">${pills}</div>
                    </div>
                    <div class="gdh-coming-soon-cover">
                        <svg class="gdh-coming-soon-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="11" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/><circle cx="12" cy="16" r="1"/></svg>
                        <strong>In arrivo</strong>
                        <span>Progetto Premium · Non ancora disponibile</span>
                    </div>`;
                grid.appendChild(card);
                return;
            }
            const completedPhasesCount = (this.state.arenaProject && this.state.arenaProject.completedPhases) ? this.state.arenaProject.completedPhases.length : 0;
            const progressLabel = isArena ? (completedPhasesCount >= 4 ? "✓ Completato (4/4)" : `Avanzamento: ${completedPhasesCount}/4 Fasi`) : `🔒 ${proj.levelReq}`;
            const btnText = isArena ? (completedPhasesCount > 0 ? (completedPhasesCount >= 4 ? "Rivedi Arena ➔" : "Continua Arena ➔") : "Inizia Progetto ➔") : "Anteprima ➔";
            const btnClass = isArena ? "btn-preview-project btn-playable-start" : "btn-preview-project";

            card.onclick = () => this.openArenaWorkspace();

            card.innerHTML = `
                <div>
                    <div class="project-card-top">
                        <div class="project-card-icon">${this.getProjectIconSVG(proj.id)}</div>
                        <span class="${proj.badgeClass}">${proj.badge}</span>
                    </div>
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                    <div class="project-topics-pills">${pills}</div>
                </div>
                <div class="project-card-footer">
                    <span class="project-req-text ${isArena ? 'req-completed' : ''}">${progressLabel}</span>
                    <button type="button" class="${btnClass}">${btnText}</button>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    openProjectPreview(projectId) {
        SoundFX.playClick();
        const proj = PROJECTS_DATA.find(p => p.id === projectId);
        if (!proj || proj.id !== 'project_arena') return; // Le anteprime Premium sono sospese.

        document.getElementById('project-preview-title').innerText = `${proj.icon} ${proj.title}`;
        document.getElementById('project-preview-badge').innerText = proj.badge;
        document.getElementById('project-preview-req').innerText = `Requisito: ${proj.levelReq}`;
        document.getElementById('project-preview-desc').innerText = proj.desc;

        const pills = document.getElementById('project-preview-topics');
        if (pills) {
            pills.innerHTML = proj.topics.map(t => `<span class="topic-pill">${t}</span>`).join('');
        }

        const countEl = document.getElementById('project-interest-count');
        const curInterests = this.state.projectInterests[projectId] || 20;
        if (countEl) countEl.innerText = curInterests;

        const interestBtn = document.getElementById('btn-project-interest');
        if (interestBtn) {
            interestBtn.onclick = () => {
                SoundFX.playSuccess();
                ConfettiFX.burst();
                this.state.projectInterests[projectId] = (this.state.projectInterests[projectId] || 20) + 1;
                countEl.innerText = this.state.projectInterests[projectId];
                this.saveStorage();
            };
        }

        document.getElementById('project-preview-modal').classList.remove('hidden');
    },

    closeProjectPreview() {
        SoundFX.playClick();
        document.getElementById('project-preview-modal').classList.add('hidden');
    },

    // ==========================================
    // IMPOSTAZIONI & RESET DATI
    // ==========================================
    setTheme(theme) {
        SoundFX.playClick();
        this.state.theme = theme;
        this.saveStorage();
        this.applyTheme(theme);
    },

    applyTheme(theme) {
        const currentTheme = theme || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        const btnDark = document.getElementById('btn-theme-dark');
        const btnLight = document.getElementById('btn-theme-light');
        if (btnDark && btnLight) {
            if (currentTheme === 'light') {
                btnDark.classList.remove('active');
                btnLight.classList.add('active');
            } else {
                btnLight.classList.remove('active');
                btnDark.classList.add('active');
            }
        }
        if (this.drawConnectingLines) {
            setTimeout(() => this.drawConnectingLines(), 60);
        }
        if (this.viewport) this.viewport.setTheme(currentTheme);
        if (this.practiceViewport) this.practiceViewport.setTheme(currentTheme);
    },

    openSettingsModal() {
        SoundFX.playClick();
        const soundCheckbox = document.getElementById('setting-sound-enabled');
        if (soundCheckbox) soundCheckbox.checked = SoundFX.enabled;

        const volumeSlider = document.getElementById('setting-volume-slider');
        const volumeLabel = document.getElementById('volume-percent-label');
        const percent = Math.round(SoundFX.volume * 100);
        if (volumeSlider) volumeSlider.value = percent;
        if (volumeLabel) volumeLabel.innerText = `${percent}%`;

        const musicCheckbox = document.getElementById('setting-music-enabled');
        if (musicCheckbox) musicCheckbox.checked = SoundFX.musicEnabled;
        const musicSlider = document.getElementById('setting-music-volume-slider');
        const musicLabel = document.getElementById('music-volume-percent-label');
        const musicPercent = Math.round(SoundFX.musicVolume * 100);
        if (musicSlider) musicSlider.value = musicPercent;
        if (musicLabel) musicLabel.textContent = `${musicPercent}%`;

        // Sincronizza stato pulsanti tema
        const btnDark = document.getElementById('btn-theme-dark');
        const btnLight = document.getElementById('btn-theme-light');
        if (btnDark && btnLight) {
            if (this.state.theme === 'light') {
                btnDark.classList.remove('active');
                btnLight.classList.add('active');
            } else {
                btnLight.classList.remove('active');
                btnDark.classList.add('active');
            }
        }

        // Ripristina stato tasto reset
        const confirmBox = document.getElementById('reset-confirm-box');
        const resetRow = document.getElementById('reset-initial-row');
        if (confirmBox) confirmBox.classList.add('hidden');
        if (resetRow) resetRow.classList.remove('hidden');

        document.getElementById('settings-modal').classList.remove('hidden');
    },

    closeSettingsModal() {
        SoundFX.playClick();
        document.getElementById('settings-modal').classList.add('hidden');
    },

    resetAllData() {
        try {
            localStorage.removeItem('gdscript_hero_save_v4');
            localStorage.removeItem('gdscript_hero_save_v3');
            localStorage.removeItem('gdscript_hero_save_v2');
            localStorage.removeItem('gdscript_hero_save');
        } catch (e) {}

        // Reset completo dello stato in memoria
        this.state.xp = 0;
        this.state.rewardsV2 = ProgressionV2.createRewards(0);
        this.state.streak = 1;
        this.state.level = 1;
        this.state.streakWeeks = 0;
        this.state.activeDaysThisWeek = [];
        this.state.finishedLessons = [];
        this.state.completedLessons = [1];
        this.state.unlockedAchievements = [];
        this.state.currentLessonId = 1;
        this.state.userCode = {};
        try {
            const owner=String(this._saveOwner||'guest');
            for(let id=201;id<=230;id++)sessionStorage.removeItem('gdh_chapter_quiz_v1:'+owner+':'+id);
        } catch(e) {}
        this.state.profileCustomized = false;
        this.state.claimedQuestsCount = 0;
        this.state.profile = {
            username: "Eroe Godot",
            tag: "Sviluppatore GDScript",
            color: "#478cbf",
            avatar: "🤖"
        };
        this.state.dailyQuests = {
            date: this.getTodayISO(),
            progress: { daily_exercise: 0, review_success: 0, study_variety: 0 },
            claimed: { daily_exercise: false, review_success: false, study_variety: false }
        };
        this.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };

        this.saveStorage();
        this.applyProfileUI();
        this.updateStatsUI();
        this.updateQuestsBadge();
        this.renderRoadmap();

        SoundFX.playSuccess();
        this.showToast({
            icon: "🚨",
            tag: "DATI AZZERATI!",
            title: "Ripristino Completato",
            desc: "Tutti i tuoi progressi sono stati azzerati con successo."
        });

        this.closeSettingsModal();
        this.showRoadmap();
    },

    // Calcolo Livello e Progresso XP
    getCurrentLevelInfo() {
        return ProgressionV2.levelFromXp(this.state.xp);
    },

    updateLevelPopover(info=this.getCurrentLevelInfo()) {
        const setText=(id,value)=>{
            const el=document.getElementById(id);
            if(el)el.textContent=value;
        };
        const xp=Math.max(0,Number(this.state.xp)||0);
        const gained=xp-info.tier.minXp;
        const needed=info.nextXp-info.tier.minXp;
        setText('level-popover-title','Livello '+info.tier.level);
        setText('level-popover-grade',info.tier.title);
        setText('level-popover-xp',xp.toLocaleString('it-IT')+' XP');
        setText('level-popover-progress-text',gained+' / '+needed+' XP nel livello');
        setText('level-popover-remaining',info.xpToNext+' XP al prossimo livello');
        const progress=document.getElementById('level-popover-progress');
        if(progress)progress.setAttribute('aria-valuenow',String(info.percent));
        const fill=document.getElementById('level-popover-fill');
        if(fill)fill.style.width=info.percent+'%';
    },

    closeLevelPopover(restoreFocus=false) {
        const panel=document.getElementById('level-popover');
        const trigger=document.getElementById('btn-open-profile');
        if(!panel||panel.classList.contains('hidden'))return;
        panel.classList.add('hidden');
        trigger?.setAttribute('aria-expanded','false');
        if(restoreFocus)trigger?.focus();
    },

    toggleLevelPopover() {
        const panel=document.getElementById('level-popover');
        if(!panel)return;
        if(!panel.classList.contains('hidden')) {
            this.closeLevelPopover(true);
            return;
        }
        SoundFX.playClick();
        this.updateLevelPopover();
        panel.classList.remove('hidden');
        document.getElementById('btn-open-profile')?.setAttribute('aria-expanded','true');
        document.getElementById('btn-close-level-popover')?.focus();
    },

    getTodayISO() {
        return ProgressionV2.dateKey();
    },

    getWeekId(d = new Date()) {
        return ProgressionV2.weekKey(d);
    },

    getCurrentWeekDays() {
        // I periodi XP ufficiali seguono la settimana UTC, non il fuso del browser.
        const now = new Date();
        const dayOfWeek = (now.getUTCDay() + 6) % 7;
        const monday = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),
            now.getUTCDate()-dayOfWeek));
        const labels = ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
        const todayISO = this.getTodayISO();
        return labels.map((label,index) => {
            const day=new Date(monday.getTime()+index*86400000);
            const iso=ProgressionV2.dateKey(day);
            return {label,iso,isToday:iso===todayISO};
        });
    },

    checkWeekReset() {
        const currentWeek = this.getWeekId();
        if (!this.state.currentWeekId) {
            this.state.currentWeekId = currentWeek;
            return;
        }

        if (this.state.currentWeekId !== currentWeek) {
            const currentTier = STREAK_TIERS[this.state.streakMode] || STREAK_TIERS.rilassato;
            const metGoal = this.state.activeDaysThisWeek.length >= currentTier.target;

            // La settimana è già stata conteggiata al raggiungimento
            // dell'obiettivo: non incrementarla una seconda volta al reset.
            if (!metGoal) this.state.streakWeeks = 0;

            this.state.activeDaysThisWeek = [];
            this.state.currentWeekId = currentWeek;
            this.saveStorage();
        }
    },

    recordDailyActivity() {
        this.checkWeekReset();
        const todayISO = this.getTodayISO();
        const currentTier = STREAK_TIERS[this.state.streakMode] || STREAK_TIERS.rilassato;

        if (!this.state.activeDaysThisWeek.includes(todayISO)) {
            this.state.activeDaysThisWeek.push(todayISO);
            this.state.lastActiveDate = todayISO;

            const daysCount = this.state.activeDaysThisWeek.length;

            if (daysCount === currentTier.target) {
                this.state.streakWeeks += 1;
                this.state.rewardsV2 = ProgressionV2.normalizeRewards(this.state.rewardsV2,this.state.xp);
                const gain = ProgressionV2.grantRecurring(this.state.rewardsV2,'streak',
                    'week:'+this.getWeekId(),20);
                if (gain) {
                    this.state.xp += gain;
                    SoundFX.playFanfare();
                    this.showToast({
                        tag: "OBIETTIVO SETTIMANALE RAGGIUNTO!",
                        title: `Streak ${currentTier.label} Conquistata!`,
                        desc: `Hai completato ${daysCount} giorni questa settimana (+${gain} XP).`
                    });
                    this.updateStatsUI({ announceLevelUp: true });
                }
            } else if (daysCount < currentTier.target) {
                this.showToast({
                    icon: "🔥",
                    tag: "GIORNO ACCESO!",
                    title: "Esercizio di Oggi Convalidato!",
                    desc: `${daysCount} di ${currentTier.target} giorni completati questa settimana.`
                });
            }

            this.saveStorage();
        }
    },

    // La finestra di modifica segue il calendario LOCALE dello studente,
    // senza cambiare le regole XP/UTC gia' usate dalla serie settimanale.
    streakGoalWeekKey(date=new Date()){
        const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());
        d.setDate(d.getDate()-((d.getDay()+6)%7));
        return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),
            String(d.getDate()).padStart(2,'0')].join('-');
    },
    canChangeStreakGoal(){
        const selection=this.state.streakGoalSelection;
        if(!selection)return true;
        if(new Date().getDay()!==1)return false;
        // Compatibilita' con scelte precedenti salvate con weekKey UTC.
        return selection.week!==this.streakGoalWeekKey() &&
            selection.week!==this.getWeekId();
    },
    ensureSiteOnboarding(){
        const welcome=document.getElementById('site-welcome'),gate=document.getElementById('site-goal-gate');
        if(!welcome||!gate)return;
        if(!this.state.siteWelcomeSeen)welcome.classList.remove('hidden');
        else if(!this.state.streakGoalSelection){welcome.classList.add('hidden');gate.classList.remove('hidden');}
    },
    siteTourSteps:[
        {desktop:'#nav-roadmap-btn',mobile:'#mob-nav-roadmap',title:'Il percorso',desc:'La mappa esagonale ti guida dai fondamenti alle sfide avanzate.'},
        {desktop:'#nav-editor-btn',mobile:'#mob-nav-exercise',title:'Esercizi',desc:'Scrivi GDScript, eseguilo con Godot e usa suggerimenti e debugger.'},
        {desktop:'#nav-practice-btn',mobile:'#mob-nav-practice',title:'Sandbox',desc:'Sperimenta liberamente con codice, scene e nodi.'},
        {desktop:'#nav-projects-btn',mobile:'#mob-nav-projects',title:'Progetti',desc:'Metti in pratica le conoscenze costruendo veri progetti.'},
        {desktop:'#nav-review-btn',mobile:'#mob-nav-review',title:'Ripasso',desc:'Consolida le competenze con il ripasso intelligente.'},
        {desktop:'#nav-stats-btn',mobile:'#mob-nav-stats',title:'Statistiche',desc:'Consulta progressi, livelli e risultati del tuo percorso.'}
    ],
    beginSiteTour(){
        document.getElementById('site-welcome')?.classList.add('hidden');
        this._siteTourStep=0;
        document.getElementById('site-tour')?.classList.remove('hidden');
        this.renderSiteTour();
    },
    renderSiteTour(){
        document.querySelectorAll('.site-tour-highlight').forEach(el=>el.classList.remove('site-tour-highlight'));
        const step=this.siteTourSteps[this._siteTourStep];
        if(!step)return this.finishSiteTour();
        const selector=innerWidth<=820?step.mobile:step.desktop;
        const target=document.querySelector(selector);
        if(target?.getClientRects().length)target.classList.add('site-tour-highlight');
        document.getElementById('site-tour-title').textContent=step.title;
        document.getElementById('site-tour-description').textContent=step.desc;
        document.getElementById('site-tour-position').textContent=(this._siteTourStep+1)+' / '+this.siteTourSteps.length;
        document.getElementById('site-tour-next').textContent=this._siteTourStep===this.siteTourSteps.length-1?'Termina tour':'Avanti';
    },
    advanceSiteTour(){this._siteTourStep++;this.renderSiteTour();},
    finishSiteTour(){
        document.querySelectorAll('.site-tour-highlight').forEach(el=>el.classList.remove('site-tour-highlight'));
        document.getElementById('site-tour')?.classList.add('hidden');
        document.getElementById('site-welcome')?.classList.add('hidden');
        this.state.siteWelcomeSeen=true;
        this.saveStorage({localOnly:true});
        this.ensureSiteOnboarding();
    },
    // Modal Streak
    openStreakModal() {
        SoundFX.playClick();
        this.checkWeekReset();

        const container = document.getElementById('streak-days-row');
        if (!container) return;
        container.innerHTML = '';

        const weekDays = this.getCurrentWeekDays();
        weekDays.forEach(day => {
            const isActive = this.state.activeDaysThisWeek.includes(day.iso);
            const el = document.createElement('div');
            el.className = `streak-day-bubble ${isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`;
            el.innerHTML = `
                <div class="day-label">${day.label}</div>
                <div class="day-icon">${isActive ? '🔥' : '•'}</div>
            `;
            container.appendChild(el);
        });

        const editable=this.canChangeStreakGoal();
        const status=document.getElementById('streak-change-status');
        if(status)status.textContent=editable?'Puoi scegliere una volta oggi; dopo la scelta il ritmo resta bloccato.':'Ritmo bloccato: potrai cambiarlo il prossimo lunedi, una sola volta.';
        ["rilassato", "concentrato", "lockin"].forEach(tier => {
            const el = document.getElementById(`tier-${tier}`);
            if (el) {
                el.classList.toggle('goal-locked',!editable);
                el.setAttribute('aria-disabled',String(!editable));
                if (this.state.streakMode === tier) {
                    el.classList.add('selected');
                    el.querySelector('.tier-status-tag').innerText = "Attivo";
                } else {
                    el.classList.remove('selected');
                    el.querySelector('.tier-status-tag').innerText = "Seleziona";
                }
            }
        });

        document.getElementById('streak-modal').classList.remove('hidden');
    },

    closeStreakModal() {
        SoundFX.playClick();
        document.getElementById('streak-modal').classList.add('hidden');
    },

    setStreakMode(tier){
        if(!Object.hasOwn(STREAK_TIERS,tier)||!this.canChangeStreakGoal())return false;
        SoundFX.playClick();
        // Conteggia PRIMA la settimana conclusa col vecchio obiettivo.
        this.checkWeekReset();
        this.state.streakMode=tier;
        this.state.streakGoalSelection={week:this.streakGoalWeekKey(),
            selectedDate:new Date().toLocaleDateString('en-CA')};
        this.state.siteWelcomeSeen=true;
        this.saveStorage();
        this.updateStatsUI();
        document.getElementById('site-goal-gate')?.classList.add('hidden');
        this.openStreakModal();
        return true;
    },

    updateStatsUI({ announceLevelUp = false } = {}) {
        this.checkWeekReset();
        // Gestione Fiamma e Serie Settimanale
        const currentTier = STREAK_TIERS[this.state.streakMode] || STREAK_TIERS.rilassato;
        const todayISO = this.getTodayISO();
        const doneToday = this.state.activeDaysThisWeek.includes(todayISO);

        const flameEl = document.getElementById('streak-flame');
        if (flameEl) {
            if (doneToday) {
                flameEl.className = "fire-icon active";
            } else {
                flameEl.className = "fire-icon inactive";
            }
        }

        const scEl = document.getElementById('streak-count');
        if (scEl) scEl.textContent = `${this.state.activeDaysThisWeek.length} / ${currentTier.target}`;
        const streakPill = document.getElementById('btn-streak-modal');
        if (streakPill) {
            const description = `Obiettivo settimanale: ${this.state.activeDaysThisWeek.length} di ${currentTier.target} giorni studiati · Serie: ${this.state.streakWeeks} settimane`;
            streakPill.title = description;
            streakPill.setAttribute('aria-label', description);
        }

        const info = this.getCurrentLevelInfo();
        const prevLevel = this.state.level;
        this.state.level = info.tier.level;

        // Aggiorna badge e barra mini del livello
        const lvlBadge = document.getElementById('level-badge'); if (lvlBadge) { lvlBadge.innerText = `Lv. ${info.tier.level}`; }
        const levelPill = document.getElementById('level-pill');
        if (levelPill) {
            levelPill.title = `Livello ${info.tier.level}: ${info.tier.title} (${info.percent}%)`;
        }
        const fill = document.getElementById('level-mini-fill');
        if (fill) fill.style.width = `${info.percent}%`;
        this.updateLevelPopover(info);

        // Testo nella roadmap
        const xpToNextEl = document.getElementById('xp-to-next-level-tag');
        if (xpToNextEl) {
            xpToNextEl.innerText = `${info.xpToNext} XP al prossimo livello (${info.percent}%)`;
        }

        // Badge contatore traguardi
        const countBadge = document.getElementById('achievements-count-badge');
        if (countBadge) {
            countBadge.innerText = `${this.state.unlockedAchievements.length}/${ACHIEVEMENTS_DATA.length}`;
        }

        // Solo un'azione che assegna XP può celebrare il nuovo livello.
        // Ricariche, navigazione e importazioni cloud aggiornano solo l'interfaccia.
        if (announceLevelUp && info.tier.level > prevLevel && prevLevel > 0) {
            SoundFX.playFanfare();
            ConfettiFX.burst();
            this.showToast({
                kind: 'level',
                tag: 'NUOVO LIVELLO',
                title: `Hai raggiunto il livello ${info.tier.level}`,
                desc: `Titolo: ${info.tier.title}`
            });
        }
    },

    syncLessonXpBadge(lesson) {
        const badge = document.getElementById('lesson-xp-badge');
        if (!badge || !lesson) return;
        const completed = this.state.finishedLessons.includes(lesson.id);
        badge.innerText = completed ? 'Già completato' : `+${lesson.xp} XP`;
        badge.title = completed ? 'Premio XP già ottenuto in precedenza'
            : 'XP ottenibili alla prima soluzione corretta';
        badge.style.background = completed ? 'rgba(148, 163, 184, .12)' : '';
        badge.style.color = completed ? 'var(--text-muted)' : '';
    },

    // La modale mostra SOLO gli XP realmente ottenuti per l'attività completata.
    // Se l'attività non assegna XP, il riquadro premio scompare del tutto.
    setSuccessModalReward(earnedXp) {
        const amount = Number.isFinite(earnedXp) ? Math.max(0, earnedXp) : 0;
        const card = document.getElementById('modal-xp-card');
        const gain = document.getElementById('modal-xp-gain');
        if (gain) gain.innerText = `+${amount}`;
        if (card) card.classList.toggle('hidden', amount === 0);
    },

    // Sistema Traguardi / Achievements
    checkAchievements(meta = {}) {
        let unlockedAny = false;
        ACHIEVEMENTS_DATA.forEach(ach => {
            if (!this.state.unlockedAchievements.includes(ach.id)) {
                if (ach.condition(this.state, meta)) {
                    this.state.unlockedAchievements.push(ach.id);
                    this.state.xp += ach.xpReward;
                    unlockedAny = true;

                    this.showToast({
                        icon: ach.icon,
                        tag: "TRAGUARDO SBLOCCATO!",
                        title: ach.title,
                        desc: `${ach.desc} (+${ach.xpReward} XP)`
                    });

                    SoundFX.playSuccess();
                }
            }
        });

        if (unlockedAny) {
            this.saveStorage();
            this.updateStatsUI({ announceLevelUp: !!(meta.lessonId || meta.fromAction) });
        }
    },

    showToast(data) {
        const toast = document.getElementById('achievement-toast');
        if (!toast) return;

        const toastIcon = document.getElementById('toast-icon');
        if (data.kind === 'level') {
            // Un'unica icona SVG del tema, senza emoji o glow.
            toastIcon.innerHTML = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v4a4 4 0 0 1-8 0V3z"/><path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 11v5m-4 5h8m-8 0v-3h8v3"/></svg>';
        } else if (data.iconName) {
            toastIcon.innerHTML = this.sandboxIcon(data.iconName);
        } else {
            toastIcon.textContent = data.icon || '';
        }
        toast.dataset.kind = data.kind === 'level' ? 'level' : 'default';
        toast.querySelector('.toast-tag').innerText = data.tag;
        document.getElementById('toast-title').innerText = data.title;
        document.getElementById('toast-desc').innerText = data.desc;

        toast.classList.remove('hidden');

        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    },

    // Rendering Modal Traguardi
    openAchievementsModal() {
        SoundFX.playClick();
        const list = document.getElementById('achievements-list');
        if (!list) return;
        list.innerHTML = '';

        ACHIEVEMENTS_DATA.forEach(ach => {
            const isUnlocked = this.state.unlockedAchievements.includes(ach.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-card-icon">${isUnlocked ? ach.icon : '🔒'}</div>
                <div class="achievement-card-info">
                    <div class="achievement-card-title">${ach.title}</div>
                    <div class="achievement-card-desc">${ach.desc}</div>
                    <div class="achievement-reward">${isUnlocked ? '✓ Sbloccato (+ ' + ach.xpReward + ' XP)' : 'Ricompensa: +' + ach.xpReward + ' XP'}</div>
                </div>
            `;
            list.appendChild(card);
        });

        document.getElementById('achievements-modal').classList.remove('hidden');
    },

    closeAchievementsModal() {
        SoundFX.playClick();
        document.getElementById('achievements-modal').classList.add('hidden');
    },

    // ==========================================
    // MAPPA A NODI E CAPITOLI
    // ==========================================
    // Garantisce che i livelli completati sblocchino coerentemente sia il percorso principale che i bonus
    ensureUnlockedConsistency() {
        if (!this.state.completedLessons || !Array.isArray(this.state.completedLessons)) {
            this.state.completedLessons = [1];
        }
        if (!this.state.completedLessons.includes(1)) {
            this.state.completedLessons.unshift(1);
        }

        // Se siamo sul sito online pubblico, la modalità devAllUnlocked è disattivata categoricamente
        if (!this.isLocalEnvironment()) {
            this.state.devAllUnlocked = false;
        }

        // Se la modalità sblocco totale è attiva (SOLO ed esclusivamente in locale)
        if (this.state.devAllUnlocked) {
            LESSONS_DATA.forEach(lesson => {
                if (!this.state.completedLessons.includes(lesson.id)) {
                    this.state.completedLessons.push(lesson.id);
                }
            });
            this.saveStorage();
            return;
        }

        // Progressione lineare sulla mappa ordinata: gli esercizi di
        // consolidamento concludono il capitolo e sono obbligatori.
        // Gli ID persistenti non indicano più l'ordine del corso.
        const normalUnlocked = [LESSONS_DATA[0]?.id || 1];
        LESSONS_DATA.forEach((lesson, index) => {
            if (!this.state.finishedLessons.includes(lesson.id)) return;
            const next = LESSONS_DATA[index + 1];
            if (next && !normalUnlocked.includes(next.id)) normalUnlocked.push(next.id);
        });
        this.state.completedLessons = normalUnlocked;
        this.saveStorage();
    },

    unlockAllLessons(notify = false) {
        if (!this.isLocalEnvironment()) {
            this.showToast({
                icon: '🔒',
                tag: 'PRODUZIONE',
                title: 'Comando non disponibile',
                desc: 'Lo sblocco totale è consentito solo in locale per i test dello sviluppatore.'
            });
            return;
        }
        this.state.devAllUnlocked = true;
        this.state.completedLessons = LESSONS_DATA.map(l => l.id);
        this.saveStorage();
        this.renderRoadmap();
        if (notify) {
            this.showToast({
                icon: '🔓',
                tag: 'MODALITÀ VERIFICA (LOCALE)',
                title: 'Tutti i 60 Livelli Sbloccati',
                desc: 'Ora puoi selezionare e testare qualsiasi esercizio o sfida in locale!'
            });
        }
    },

    lockToStandardProgression(notify = false) {
        this.state.devAllUnlocked = false;
        this.state.completedLessons = [1];
        this.ensureUnlockedConsistency();
        this.saveStorage();
        this.renderRoadmap();
        if (notify) {
            this.showToast({
                icon: '🔒',
                tag: 'PROGRESSIONE NORMALE',
                title: 'Blocco Sequenziale Ripristinato',
                desc: 'I livelli sono ora vincolati al completamento in ordine degli esercizi precedenti.'
            });
        }
    },

    toggleMasteryPopover(lessonId) {
        const popover = document.getElementById(`mastery-popover-${lessonId}`);
        if (!popover) return;
        const isCurrentlyOpen = !popover.classList.contains('hidden');
        this.closeAllMasteryPopovers();
        if (!isCurrentlyOpen) {
            popover.classList.remove('hidden');
        }
    },

    closeAllMasteryPopovers() {
        document.querySelectorAll('.mastery-popover').forEach(p => {
            p.classList.add('hidden');
        });
    },

    // Generatore SVG 3D Hexagon fedele al Concept 1 Indie Game Academy
    renderHexNodeSVG(isMastery, status, isQuiz = false) {
        if (isQuiz) {
            const colors = {
                completed: ['#00BFA6','#102E2C','#93F7E2'],
                current: ['#68B9F3','#1B3446','#D8F1FF'],
                unlocked: ['#537FA5','#1D2C3E','#B3CDE1'],
                locked: ['#283444','#111923','#516477']
            };
            const [edge,face,mark] = colors[status] || colors.locked;
            return `<svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
              <path d="M 22 7 L 62 7 L 82 40 L 62 73 L 22 73 L 2 40 Z"
                    fill="${face}" stroke="${edge}" stroke-width="3"/>
              <rect x="28" y="27" width="28" height="27" rx="5" fill="none" stroke="${mark}" stroke-width="2"/>
              <path d="M34 35h16 M34 41h13 M34 47h8" stroke="${mark}" stroke-width="2" stroke-linecap="round"/>
              <circle cx="55" cy="52" r="9" fill="${face}" stroke="${mark}" stroke-width="2"/>
              <path d="m51 52 3 3 5-6" fill="none" stroke="${mark}" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        }
        if (isMastery) {
            if (status === 'completed') {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#4D3800" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#2A1E08" stroke="#FFB703" stroke-width="2.5" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#FFB703" />
                    </svg>
                `;
            } else if (status === 'current' || status === 'unlocked') {
                const pulseClass = (status === 'current') ? 'pulse-mastery' : '';
                return `
                    <svg class="hex-svg ${pulseClass}" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#664900" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#33250A" stroke="#FFD166" stroke-width="3" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#FFFFFF" />
                    </svg>
                `;
            } else {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#070A0F" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#0E121A" stroke="#232D42" stroke-width="2" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#384869" opacity="0.5" />
                    </svg>
                `;
            }
        } else {
            // Core Node
            if (status === 'completed') {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#05372B" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#0E231F" stroke="#00F0AA" stroke-width="2.5" />
                        <path d="M 27 39 L 37 49 L 57 29" fill="none" stroke="#00F0AA" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                `;
            } else if (status === 'current') {
                return `
                    <svg class="hex-svg pulse-current" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#05445E" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#0C2538" stroke="#00E5FF" stroke-width="3" />
                        <polygon points="36,28 36,52 54,40" fill="#00E5FF" />
                    </svg>
                `;
            } else if (status === 'unlocked') {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#0E121A" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#141924" stroke="#384869" stroke-width="2" />
                        <polygon points="36,28 36,52 54,40" fill="#6F81A5" />
                    </svg>
                `;
            } else {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#070A0F" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#0E121A" stroke="#232D42" stroke-width="2" />
                        <path d="M 36 34 L 36 30 C 36 26.7 38.7 24 42 24 C 45.3 24 48 26.7 48 30 L 48 34 M 32 34 L 52 34 C 53.1 34 54 34.9 54 36 L 54 50 C 54 51.1 53.1 52 52 52 L 32 52 C 30.9 52 30 51.1 30 50 L 30 36 C 30 34.9 30.9 34 32 34 Z" fill="none" stroke="#384869" stroke-width="2.5" stroke-linecap="round" />
                    </svg>
                `;
            }
        }
    },

    renderRoadmap() {
        const container = document.getElementById('chapters-roadmap-flow');
        if (!container) return;
        container.innerHTML = '';

        this.ensureUnlockedConsistency();

        // P3.3: Aggiorna indicatori, badge e callout della Palestra di Ripasso
        this.updateReviewIndicators();

        const finishedCount = this.state.finishedLessons.length;
        const total = LESSONS_DATA.length;
        const percent = Math.min(100, Math.round((finishedCount / total) * 100));

        const progressFill = document.getElementById('overall-progress-fill');
        if (progressFill) progressFill.style.width = `${percent}%`;

        const statsText = document.getElementById('completed-count-text');
        if (statsText) statsText.innerText = `${finishedCount} di ${total} completati (${percent}%)`;

        this.renderSidebarDailyQuests();

        CHAPTERS_DATA.forEach(chapter => {
            const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id);
            const coreLessons = chapterLessons;
            const masteryLesson = null;

            const chapterFinished = chapterLessons.filter(l => this.state.finishedLessons.includes(l.id)).length;
            const chapterTotal = chapterLessons.length;

            // Il capitolo è sbloccato se è il capitolo 1, oppure se contiene livelli già sbloccati, oppure se il capitolo precedente è stato completato
            let isChapterUnlocked = chapter.id === 1 || chapterLessons.some(l => this.state.completedLessons.includes(l.id));
            if (!isChapterUnlocked && chapter.id > 1) {
                const prevCoreLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id - 1);
                const lastPrevCore = prevCoreLessons[prevCoreLessons.length - 1];
                if (lastPrevCore && this.state.finishedLessons.includes(lastPrevCore.id)) {
                    isChapterUnlocked = true;
                }
            }

            const section = document.createElement('section');
            section.className = "chapter-section";

            // Banner del Capitolo
            const banner = document.createElement('div');
            banner.className = `chapter-banner ${isChapterUnlocked ? 'unlocked' : 'locked'}`;
            banner.innerHTML = `
                <div class="chapter-banner-left">
                    <div class="chapter-icon-circle">${chapter.icon}</div>
                    <div class="chapter-title-group">
                        <div class="chapter-badge">${chapter.badge}</div>
                        <h3>${chapter.title}</h3>
                        <p>${chapter.desc}</p>
                    </div>
                </div>
                <div class="chapter-progress-pill">${chapterFinished}/${chapterTotal} Attività</div>
            `;
            section.appendChild(banner);

            // Wrapper Nodi + SVG del Capitolo
            const treeWrapper = document.createElement('div');
            treeWrapper.className = "chapter-tree-wrapper";
            treeWrapper.id = `tree-wrapper-chapter-${chapter.id}`;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'tree-lines');
            svg.id = `tree-svg-chapter-${chapter.id}`;
            treeWrapper.appendChild(svg);

            const nodesList = document.createElement('div');
            nodesList.className = "nodes-list";
            nodesList.id = `nodes-container-chapter-${chapter.id}`;

            // Helper per costruire un nodo
            const buildNode = (lesson, isMastery, offset = 0) => {
                const isFinished = this.state.finishedLessons.includes(lesson.id);
                const isUnlocked = this.state.completedLessons.includes(lesson.id);

                // Determina quale singolo nodo deve avere il tag "CONTINUA" e la pulsazione d'azione
                let focusId = this.state.currentLessonId;
                if (!focusId || this.state.finishedLessons.includes(focusId)) {
                    const firstUnfinishedCore = LESSONS_DATA.find(l => this.state.completedLessons.includes(l.id) && !this.state.finishedLessons.includes(l.id));
                    if (firstUnfinishedCore) focusId = firstUnfinishedCore.id;
                }
                const isCurrentFocus = isUnlocked && !isFinished && (lesson.id === focusId);

                let statusClass = 'locked';
                if (isFinished) {
                    statusClass = 'completed';
                } else if (isCurrentFocus) {
                    statusClass = 'current';
                } else if (isUnlocked) {
                    statusClass = 'unlocked';
                }

                const node = document.createElement('div');
                node.className = `node-item ${statusClass} ${isMastery ? 'mastery' : ''} ${lesson.isQuiz ? 'quiz-node' : ''}`;
                node.id = `node-lesson-${lesson.id}`;
                node.setAttribute('role', 'button');
                node.setAttribute('tabindex', isUnlocked ? '0' : '-1');
                node.setAttribute('aria-label', `${lesson.title} - ${statusClass === 'completed' ? 'Completato' : (statusClass === 'current' ? 'In corso' : (statusClass === 'unlocked' ? 'Disponibile' : 'Bloccato'))}`);
                node.title = lesson.title;

                node.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        node.click();
                    }
                };

                if (!isMastery && offset !== 0) {
                    node.style.setProperty('--node-offset', `${offset}px`);
                    node.style.transform = `translateX(${offset}px)`;
                } else {
                    node.style.setProperty('--node-offset', '0px');
                }

                if (isMastery) {
                    node.onclick = (e) => {
                        e.stopPropagation();
                        if (!isUnlocked) {
                            SoundFX.playError();
                            this.showToast({
                                icon: '🔒',
                                tag: 'LIVELLO BONUS',
                                title: 'Sfida di Apprendimento Bloccata',
                                desc: 'Completa tutti i livelli del capitolo per sbloccare questa sfida di apprendimento bonus!'
                            });
                            return;
                        }
                        SoundFX.playClick();
                        this.toggleMasteryPopover(lesson.id);
                    };
                } else {
                    node.onclick = () => {
                        if (isUnlocked) {
                            SoundFX.playClick();
                            this.openLesson(lesson.id);
                        } else {
                            SoundFX.playError();
                        }
                    };
                }

                // Costruisci contenuto del nodo
                let innerHtml = `
                    <div class="node-button hex-node">
                        ${this.renderHexNodeSVG(isMastery, statusClass, lesson.isQuiz)}
                        ${(!isMastery && isCurrentFocus) ? '<div class="tag-continua">CONTINUA</div>' : ''}
                    </div>
                    <div class="node-label">${isMastery ? '⭐ Sfida di apprendimento' : lesson.title.replace(/^\d+\.\s*/, '')}</div>
                `;

                // Se è Mastery (Sfida di apprendimento), aggiungi la Popover card in stile Coddy
                if (isMastery) {
                    innerHtml += `
                        <div class="mastery-popover hidden" id="mastery-popover-${lesson.id}">
                            <div class="mastery-popover-arrow"></div>
                            <div class="mastery-popover-badge">⭐ LIVELLO BONUS</div>
                            <h4 class="mastery-popover-title">Sfida di apprendimento</h4>
                            <p class="mastery-popover-desc">Metti alla prova le conoscenze del capitolo con una sfida pratica!</p>
                            <div class="mastery-popover-reward">
                                <span>${isFinished ? 'XP già ottenuti' : '+' + lesson.xp + ' XP'}</span>
                                <span>🏆 Capitolo ${chapter.id}</span>
                            </div>
                            <button class="mastery-popover-btn" onclick="event.stopPropagation(); App.closeAllMasteryPopovers(); App.openLesson(${lesson.id});">
                                ${isFinished ? 'RIGIOCA' : 'INIZIA LA SFIDA'}
                            </button>
                        </div>
                    `;
                }

                node.innerHTML = innerHtml;
                return node;
            };

            // Disposizione dei nodi: i livelli core scorrono in sequenza, l'ultimo core è affiancato alla Mastery!
            coreLessons.forEach((lesson, index) => {
                const isLastCore = (index === coreLessons.length - 1);

                if (isLastCore && masteryLesson) {
                    // Riga traguardo: Core lesson a sinistra, Mastery Bonus a destra!
                    const row = document.createElement('div');
                    row.className = "tree-milestone-row";

                    const coreNode = buildNode(lesson, false, 0);
                    const masteryNode = buildNode(masteryLesson, true, 0);

                    row.appendChild(coreNode);
                    row.appendChild(masteryNode);
                    nodesList.appendChild(row);
                } else {
                    const zigzagOffset = (index % 2 === 0 ? -36 : 36);
                    const node = buildNode(lesson, false, zigzagOffset);
                    nodesList.appendChild(node);
                }
            });

            treeWrapper.appendChild(nodesList);
            section.appendChild(treeWrapper);
            container.appendChild(section);
        });

        setTimeout(() => {
            this.drawConnectingLines();
        }, 60);
    },

    // Generatore tracciati curvi SVG per ciascun capitolo + ramo bonus tratteggiato
    drawConnectingLines() {
        CHAPTERS_DATA.forEach(chapter => {
            const svg = document.getElementById(`tree-svg-chapter-${chapter.id}`);
            const wrapper = document.getElementById(`tree-wrapper-chapter-${chapter.id}`);
            const nodesContainer = document.getElementById(`nodes-container-chapter-${chapter.id}`);
            if (!svg || !wrapper || !nodesContainer) return;

            const contRect = wrapper.getBoundingClientRect();
            svg.setAttribute('width', contRect.width);
            svg.setAttribute('height', contRect.height);
            svg.innerHTML = '';

            const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id);
            const coreLessons = chapterLessons;
            const masteryLesson = null;

            // 1. Linee del percorso principale tra i nodi Core
            const coreNodeElements = [];
            coreLessons.forEach(l => {
                const el = nodesContainer.querySelector(`#node-lesson-${l.id}`);
                if (el) coreNodeElements.push(el);
            });

            for (let i = 0; i < coreNodeElements.length - 1; i++) {
                const btn1 = coreNodeElements[i].querySelector('.node-button');
                const btn2 = coreNodeElements[i + 1].querySelector('.node-button');
                if (!btn1 || !btn2) continue;

                const r1 = btn1.getBoundingClientRect();
                const r2 = btn2.getBoundingClientRect();

                const x1 = Math.round(r1.left + r1.width / 2 - contRect.left);
                const y1 = Math.round(r1.top + r1.height / 2 - contRect.top);
                const x2 = Math.round(r2.left + r2.width / 2 - contRect.left);
                const y2 = Math.round(r2.top + r2.height / 2 - contRect.top);

                const midY = Math.round((y1 + y2) / 2);
                const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                const nextLesson = coreLessons[i + 1];
                const isNextFinished = this.state.finishedLessons.includes(nextLesson.id);
                const isNextUnlocked = this.state.completedLessons.includes(nextLesson.id);

                let pathClass = isNextFinished ? 'completed' : (isNextUnlocked ? 'unlocked' : 'locked');

                // Linea nera sottostante per effetto spessore 3D
                const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                bgPath.setAttribute('d', pathD);
                bgPath.setAttribute('class', 'tree-path-bg');
                svg.appendChild(bgPath);

                // Linea principale
                const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                mainPath.setAttribute('d', pathD);
                mainPath.setAttribute('class', `tree-path ${pathClass}`);
                svg.appendChild(mainPath);
            }

            // 2. Ramo Bonus a Puntini Orizzontale verso la Sfida di Padronanza
            if (masteryLesson && coreNodeElements.length > 0) {
                const lastCoreEl = coreNodeElements[coreNodeElements.length - 1];
                const masteryEl = nodesContainer.querySelector(`#node-lesson-${masteryLesson.id}`);

                if (lastCoreEl && masteryEl) {
                    const btnCore = lastCoreEl.querySelector('.node-button');
                    const btnMast = masteryEl.querySelector('.node-button');

                    if (btnCore && btnMast) {
                        const rCore = btnCore.getBoundingClientRect();
                        const rMast = btnMast.getBoundingClientRect();

                        const x1 = Math.round(rCore.right - contRect.left - 4);
                        const y1 = Math.round(rCore.top + rCore.height / 2 - contRect.top);
                        const x2 = Math.round(rMast.left - contRect.left + 4);
                        const y2 = Math.round(rMast.top + rMast.height / 2 - contRect.top);

                        const isMastUnlocked = this.state.completedLessons.includes(masteryLesson.id);

                        const dotLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        dotLine.setAttribute('x1', x1);
                        dotLine.setAttribute('y1', y1);
                        dotLine.setAttribute('x2', x2);
                        dotLine.setAttribute('y2', y2);
                        dotLine.setAttribute('class', `mastery-branch-dots ${isMastUnlocked ? 'unlocked' : 'locked'}`);
                        svg.appendChild(dotLine);
                    }
                }
            }
        });
    },

    
    // ==========================================================================
    // GESTIONE DINAMICA E CONTESTUALE DEGLI STRUMENTI DIDATTICI (2D & SCENE TREE)
    // ==========================================================================

    updateExerciseToolsVisibility(lesson) {
        const viewportCol = document.getElementById('exercise-viewport-col');
        const viewportCanvasWrapper = document.getElementById('exercise-viewport-wrapper');
        const viewportHeader = document.getElementById('exercise-viewport-header');
        const sceneDock = document.getElementById('exercise-scene-dock');
        const validationGrid = document.getElementById('exercise-validation-grid');
        const validationPanel = document.getElementById('exercise-validation-panel');
        const toggleBtn = document.getElementById('btn-toggle-extra-tools');

        // Se l'utente ha impostato un toggle manuale per la sessione corrente
        const manualOverride = this.state.manualToolsOverride;

        let showNodeTree = false;
        let showViewport = false;

        if (manualOverride === 'visible') {
            showNodeTree = true;
            showViewport = true;
        } else if (manualOverride === 'hidden') {
            showNodeTree = false;
            showViewport = false;
        } else {
            // Logica contestuale predefinita basata sui metadati dell'esercizio
            showNodeTree = (lesson.hasNodeTree !== undefined) ? !!lesson.hasNodeTree : (!!lesson.initialNodes && lesson.initialNodes.length > 0);
            showViewport = (lesson.has2DViewport !== undefined) ? !!lesson.has2DViewport : (lesson.id >= 50);
        }

        const anyActive = showNodeTree || showViewport;

        if (!anyActive) {
            // Nasconde completamente la colonna degli strumenti 2D e allarga la console
            if (viewportCol) viewportCol.classList.add('hidden');
            if (validationGrid) validationGrid.classList.add('console-only');
            if (validationPanel) validationPanel.classList.add('console-only');
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
                toggleBtn.title = "Mostra Schermo 2D e Scena Godot (Strumenti avanzati)";
            }
        } else {
            // Mostra la colonna e ripartisce lo spazio
            if (viewportCol) viewportCol.classList.remove('hidden');
            if (validationGrid) validationGrid.classList.remove('console-only');
            if (validationPanel) validationPanel.classList.remove('console-only');
            if (toggleBtn) {
                toggleBtn.classList.add('active');
                toggleBtn.title = "Nascondi Schermo 2D e Scena Godot";
            }

            // Sotto-pannelli individuali
            if (viewportCanvasWrapper) viewportCanvasWrapper.style.display = showViewport ? 'flex' : 'none';
            if (viewportHeader) viewportHeader.style.display = showViewport ? 'flex' : 'none';
            if (sceneDock) sceneDock.style.display = showNodeTree ? 'flex' : 'none';

            // Resize automatico del viewport 2D se attivo
            if (showViewport && this.viewport) {
                setTimeout(() => this.viewport.resize(), 80);
            }
        }

        // Verifica onboarding / introduzione contestuale la prima volta che compaiono
        this.checkToolIntroductions(lesson, showNodeTree, showViewport);
    },

    checkToolIntroductions(lesson, showNodeTree, showViewport) {
        // 1. Introduzione Albero della Scena
        const cardTree = document.getElementById('intro-card-nodetree');
        if (cardTree) {
            const seenTree = localStorage.getItem('seen_intro_nodetree');
            if (showNodeTree && !seenTree && lesson.id >= 49) {
                cardTree.classList.remove('hidden');
            } else {
                cardTree.classList.add('hidden');
            }
        }

        // 2. Introduzione Schermo 2D
        const cardViewport = document.getElementById('intro-card-viewport2d');
        if (cardViewport) {
            const seenViewport = localStorage.getItem('seen_intro_viewport2d');
            if (showViewport && !seenViewport && lesson.id >= 50) {
                cardViewport.classList.remove('hidden');
            } else {
                cardViewport.classList.add('hidden');
            }
        }
    },

    dismissToolIntro(toolType) {
        SoundFX.playClick();
        if (toolType === 'nodetree') {
            localStorage.setItem('seen_intro_nodetree', 'true');
            const card = document.getElementById('intro-card-nodetree');
            if (card) card.classList.add('hidden');
        } else if (toolType === 'viewport2d') {
            localStorage.setItem('seen_intro_viewport2d', 'true');
            const card = document.getElementById('intro-card-viewport2d');
            if (card) card.classList.add('hidden');
        }
    },

    toggleManualExerciseTools() {
        SoundFX.playClick();
        const lesson = this.getCurrentActiveLessonOrVariant() || LESSONS_DATA[0];
        
        // Se attualmente visibili, nascondi; se nascosti, mostra
        const validationGrid = document.getElementById('exercise-validation-grid');
        const currentlyConsoleOnly = validationGrid && validationGrid.classList.contains('console-only');

        if (currentlyConsoleOnly) {
            this.state.manualToolsOverride = 'visible';
            this.showToast({
                icon: "🎮",
                tag: "STRUMENTI ATTIVATI",
                title: "Schermo 2D e Scena Godot",
                desc: "Gli strumenti visivi sono ora visibili per questo esercizio."
            });
        } else {
            this.state.manualToolsOverride = 'hidden';
            this.showToast({
                icon: "💻",
                tag: "LAYOUT PULITO",
                title: "Modalità Console Attiva",
                desc: "Strumenti 2D nascosti per massimizzare lo spazio dell'editor."
            });
        }

        this.updateExerciseToolsVisibility(lesson);
    },

    openLesson(lessonId) {
        const lesson = LESSONS_DATA.find(l => l.id === lessonId);
        if (!lesson) return;
        if (lesson.isQuiz) return this.openQuiz(lessonId);

        this.isReviewMode = false;
        this.currentReviewVariant = null;
        const revBanner = document.getElementById('review-exercise-banner');
        if (revBanner) revBanner.classList.add('hidden');

        this.state.currentLessonId = lessonId;
        this.state.hintsRevealed = 0;
        this.state.activeHintLevel = 1;
        this.hideAutocomplete();

        this.switchView('view-exercise');

        this.updateNavSelection('exercise');
        this.setMobileExerciseTab('instructions', false);

        if (lesson.initialNodes && Array.isArray(lesson.initialNodes) && window.GDScriptRuntime) {
            this.currentScene = GDScriptRuntime.buildScene(lesson);
        } else if (window.GD_Node) {
            this.currentScene = new GD_Node("Root");
        }
        this.renderSceneDock();
        this.renderViewportOverlay();
        this.updateExerciseToolsVisibility(lesson);

        const lessonContent = document.querySelector('.lesson-content');
        if (lesson.isMastery && !lesson.isConsolidation) {
            // Render del layout dedicato Sfida di Apprendimento in stile Coddy
            lessonContent.innerHTML = `
                <div class="coddy-challenge-card">
                    <div class="coddy-challenge-header">
                        <div class="coddy-challenge-title-row">
                            <span class="coddy-bulb-icon">💡</span>
                            <h2 class="coddy-challenge-title">Sfida di apprendimento</h2>
                            <span class="coddy-diff-badge ${lesson.difficulty || 'facile'}">${lesson.difficultyLabel || 'Facile'}</span>
                            ${lesson.isDebugging ? `<span class="badge-debugging">🐛 Debugging: ${App.escapeHtml(lesson.debugType || 'Bug Fix')}</span>` : ''}
                        </div>
                    </div>

                    <div class="coddy-challenge-body">
                        <p class="coddy-challenge-narrative">${lesson.scenario}</p>
                        <ul class="coddy-challenge-reqs">
                            ${(lesson.requirements || []).map(r => `<li>${r}</li>`).join('')}
                        </ul>
                        <p class="coddy-challenge-notice">${lesson.notice || 'Non modificare le righe print(). Il programma stampa:'}</p>
                        <div class="coddy-expected-box">
                            <pre>${lesson.expectedOutput}</pre>
                        </div>

                        <button type="button" class="btn-coddy-explain" id="btn-coddy-explain" onclick="App.toggleCoddyExplanation()">
                            <span class="explain-robot-icon">👾</span>
                            <span>Spiega la sfida</span>
                        </button>
                        <div class="coddy-explain-box hidden" id="coddy-explain-box">
                            <div class="explain-bubble-header">🤖 Assistente Didattico GDScript:</div>
                            <div class="explain-bubble-content">${lesson.aiExplanation || 'Applica le conoscenze del capitolo per completare la sfida!'}</div>
                        </div>
                    </div>

                    <div class="coddy-hints-container">
                        <div class="coddy-hints-header">
                            <span class="hints-header-icon">🎯</span>
                            <span>Suggerimenti</span>
                        </div>
                        <div class="coddy-hints-list">
                            ${(lesson.hints || []).map((hint, idx) => {
                                const hObj = (typeof hint === 'object' && hint !== null) ? hint : {
                                    level: idx + 1,
                                    icon: '💡',
                                    label: `Suggerimento ${idx + 1}`,
                                    text: String(hint)
                                };
                                return `
                                    <div class="coddy-hint-item" id="coddy-hint-item-${idx}">
                                        <div class="coddy-hint-trigger" onclick="App.toggleCoddyHint(${idx})">
                                            <span class="coddy-hint-title-text"><span class="hint-item-icon">${hObj.icon || '💡'}</span> Livello ${hObj.level}: ${App.escapeHtml(hObj.label)}</span>
                                            <span class="coddy-hint-arrow" id="coddy-hint-arrow-${idx}">›</span>
                                        </div>
                                        <div class="coddy-hint-text hidden" id="coddy-hint-text-${idx}">
                                            <div class="hint-level-badge level-${hObj.level}">
                                                <span class="badge-icon">${hObj.icon || '💡'}</span>
                                                <span class="badge-title">Livello ${hObj.level} — ${App.escapeHtml(hObj.label)}</span>
                                            </div>
                                            <div class="hint-body-formatted">${App.formatHintContent(hObj.text)}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="coddy-solution-row">
                            <button type="button" class="btn-coddy-sol-toggle" onclick="App.revealChallengeSolution()">Mostra Soluzione</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Ripristina layout standard lezione con teoria e obiettivo
            lessonContent.innerHTML = `
                <div class="lesson-header-row">
                    <h2 id="lesson-title">${lesson.title}</h2>
                    ${lesson.isDebugging ? `<span class="badge-debugging">🐛 Debugging: ${App.escapeHtml(lesson.debugType || 'Bug Fix')}</span>` : ''}
                </div>
                <div id="lesson-theory" class="theory-body">${lesson.theory}</div>
                <div class="task-box ${lesson.isDebugging ? 'debugging-task-box' : ''}">
                    <div class="task-header">
                        <span class="target-icon" aria-hidden="true"><svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg></span>
                        <h3>${lesson.isDebugging ? 'Compito di Debugging:' : 'Il Tuo Obiettivo:'}</h3>
                    </div>
                    <div id="lesson-task" class="task-body">${lesson.task}</div>
                </div>
                <div class="hints-section">
                    <div class="hints-toggle-btn" id="btn-toggle-hint">
                        <span class="hint-icon">💡</span>
                        <span id="hint-toggle-text">Ti serve un consiglio? (0/${lesson.hints.length} sbloccati)</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="hint-box hidden" id="hint-box">
                        <div class="hint-stepper-nav" id="hint-stepper-nav"></div>
                        <div class="hint-content" id="hint-text">
                            Leggi attentamente il compito e usa la funzione corretta.
                        </div>
                        <div class="hint-actions">
                            <button type="button" class="btn-subtle" id="btn-next-hint">Altro Consiglio ➔</button>
                            <button type="button" class="btn-danger-subtle" id="btn-reveal-solution">Mostra Soluzione Completa</button>
                        </div>
                    </div>
                </div>
            `;
            this.bindStandardHintEvents();
        }

        this.syncLessonXpBadge(lesson);
        const backButton = document.getElementById('btn-back-to-roadmap');
        if (backButton) backButton.textContent = '← Torna alla Mappa';

        const savedCode = this.state.userCode[lessonId] || lesson.initialCode;
        const editor = document.getElementById('code-editor');
        editor.value = savedCode;
        this.updateLineNumbers();
        this.mountCodeGuide(lesson, savedCode);

        const headerNextBtn = document.getElementById('btn-header-next');
        if (headerNextBtn) {
            const position = LESSONS_DATA.findIndex(l => l.id === lessonId);
            const next = LESSONS_DATA[position + 1];
            const hasNext = !!next;
            const isNextUnlocked = hasNext && this.state.completedLessons.includes(next.id);
            if (hasNext && (this.state.finishedLessons.includes(lessonId) || (this.isLocalEnvironment() && isNextUnlocked))) {
                headerNextBtn.classList.remove('hidden');
            } else {
                headerNextBtn.classList.add('hidden');
            }
        }

        const headerPrevBtn = document.getElementById('btn-header-prev');
        if (headerPrevBtn) {
            if (LESSONS_DATA.findIndex(l => l.id === lessonId) > 0) {
                headerPrevBtn.classList.remove('hidden');
            } else {
                headerPrevBtn.classList.add('hidden');
            }
        }

        document.getElementById('expected-output-pre').innerText = lesson.expectedOutput || "// Nessun output richiesto";
        document.getElementById('real-output-pre').innerText = '// Clicca su "Verifica Codice" per eseguire';
        document.getElementById('real-output-pre').style.color = '#38bdf8';
        
        document.getElementById('test-results-view').innerHTML = `
            <div class="empty-state">In attesa della verifica...</div>
        `;
        document.getElementById('test-status-badge').innerText = '• Non verificato';
        document.getElementById('test-status-badge').style.color = '#94a3b8';
        this.resetExerciseFeedback();

        const hintBox = document.getElementById('hint-box');
        if (hintBox) hintBox.classList.add('hidden');
        const hintToggleText = document.getElementById('hint-toggle-text');
        if (hintToggleText) hintToggleText.innerText = `Ti serve un consiglio? (0/${lesson.hints.length} sbloccati)`;

        // Reset e posizionamento Viewport 2D per il livello corrente
        if (this.viewport) {
            this.viewport.reset();
            this.viewport.statusText = `Livello ${lesson.id}: ${lesson.title}`;
            setTimeout(() => this.viewport.resize(), 50);
        }
    },

    showRoadmapView() {
        this.showRoadmap();
    },

    showRoadmap() {
        SoundFX.playClick();
        this.hideAutocomplete();
        this.switchView('view-roadmap');

        this.updateNavSelection('roadmap');
        this.renderRoadmap();
    },

    updateNavSelection(viewName) {
        // Desktop nav buttons
        ['roadmap', 'editor', 'practice', 'projects', 'review', 'stats'].forEach(key => {
            const btn = document.getElementById(`nav-${key}-btn`);
            if (btn) {
                const selected=key===viewName||(key==='editor'&&viewName==='exercise');
                btn.classList.toggle('active',selected);
                if(selected)btn.setAttribute('aria-current','page');
                else btn.removeAttribute('aria-current');
            }
        });

        // Mobile bottom nav buttons
        ['roadmap', 'exercise', 'practice', 'projects', 'review', 'stats'].forEach(key => {
            const mobBtn = document.getElementById(`mob-nav-${key}`);
            if (mobBtn) {
                const selected=key===viewName;
                mobBtn.classList.toggle('active',selected);
                if(selected)mobBtn.setAttribute('aria-current','page');
                else mobBtn.removeAttribute('aria-current');
            }
        });
    },

    setMobileExerciseTab(tab, playSound = true) {
        if (playSound) SoundFX.playClick();
        const workspaceGrid = document.getElementById('exercise-workspace-grid');
        const btnTabInstructions = document.getElementById('btn-tab-instructions');
        const btnTabCode = document.getElementById('btn-tab-code');
        if (!workspaceGrid) return;

        if(btnTabInstructions)btnTabInstructions.setAttribute('aria-pressed',String(tab!=='code'));
        if(btnTabCode)btnTabCode.setAttribute('aria-pressed',String(tab==='code'));
        if (tab === 'code') {
            workspaceGrid.classList.remove('show-instructions');
            workspaceGrid.classList.add('show-code');
            if (btnTabInstructions) btnTabInstructions.classList.remove('active');
            if (btnTabCode) btnTabCode.classList.add('active');
            this.updateLineNumbers();
        } else {
            workspaceGrid.classList.remove('show-code');
            workspaceGrid.classList.add('show-instructions');
            if (btnTabCode) btnTabCode.classList.remove('active');
            if (btnTabInstructions) btnTabInstructions.classList.add('active');
        }
        this.saveNavigationPosition();
    },

    insertTextAtEditor(targetId, textToInsert, cursorOffset = 0) {
        const editor = document.getElementById(targetId);
        if (!editor) return;
        const start = editor.selectionStart !== undefined ? editor.selectionStart : editor.value.length;
        const end = editor.selectionEnd !== undefined ? editor.selectionEnd : editor.value.length;
        const val = editor.value;
        editor.value = val.substring(0, start) + textToInsert + val.substring(end);
        const newPos = start + textToInsert.length + cursorOffset;
        editor.selectionStart = newPos;
        editor.selectionEnd = newPos;
        editor.focus();
        editor.dispatchEvent(new Event('input',{bubbles:true}));
        if (targetId === 'code-editor') {
            this.updateLineNumbers();
        } else if (targetId === 'practice-code-editor') {
            this.updatePracticeLineNumbers();
        }
    },

    extractUserVariables(code) {
        const vars = new Set();
        const varMatches = code.matchAll(/\bvar\s+([a-zA-Z0-9_]+)/g);
        for (const m of varMatches) {
            vars.add(m[1]);
        }
        const funcMatches = code.matchAll(/\bfunc\s+([a-zA-Z0-9_]+)/g);
        for (const m of funcMatches) {
            vars.add(m[1]);
        }
        return Array.from(vars).map(name => ({
            name: name,
            type: "var",
            badge: "variabile"
        }));
    },

    // Indentazione GDScript condivisa da corso, Ripasso e Sandbox.
    // Usa il testo fino al cursore: non completa righe parziali o commenti.
    insertSmartNewline(editor) {
        if (!editor) return;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
        const prefix = editor.value.slice(lineStart, start);
        const indent = prefix.match(/^[ \t]*/)[0];

        // Ignora i due-punti dentro stringhe o commenti.
        let code = '', quote = '', escaped = false;
        for (const ch of prefix) {
            if (quote) {
                if (escaped) escaped = false;
                else if (ch === '\\') escaped = true;
                else if (ch === quote) quote = '';
            } else if (ch === '#') {
                break;
            } else if (ch === '"' || ch === "'") {
                quote = ch;
            } else {
                code += ch;
            }
        }
        const statement = code.trim();
        const hasColon = /:\s*$/.test(statement);
        const block = hasColon &&
            /^(?:(?:static\s+)?func\b|if\b|elif\b|else\b|for\b|while\b|match\b|when\b|class\b|get\b|set\b)/.test(statement);
        // I rami di match (1:, _:, "nome":, ecc.) sono blocchi pur non
        // iniziando con una parola chiave. Riconosci il loro match genitore.
        let matchArm = false;
        if (hasColon && !block && indent.length) {
            const previous = editor.value.slice(0, lineStart).split('\n');
            for (let i = previous.length - 1; i >= 0; i--) {
                const line = previous[i];
                if (!line.trim() || /^\s*#/.test(line)) continue;
                if (line.match(/^[ \t]*/)[0].length < indent.length) {
                    matchArm = /^match\b.*:\s*(?:#.*)?$/.test(line.trim());
                    break;
                }
            }
        }
        const unit = indent.includes('\t') && !indent.includes(' ') ? '\t' : '    ';
        editor.setRangeText('\n' + indent + (block || matchArm ? unit : ''), start, end, 'end');
        // Notifica la stessa pipeline di aggiornamento usata dalla digitazione:
        // numeri di riga, colori, suggerimenti, autosalvataggio e progressi.
        editor.dispatchEvent(new Event('input', { bubbles: true }));
    },

    mountCodeGuide(lesson, source) {
        const root = document.querySelector('#view-exercise .lesson-content');
        if (!root || !window.GDHCodeGuide) return;
        root.querySelector('.gdh-code-guide-mount')?.remove();
        const mount = document.createElement('div');
        mount.className = 'gdh-code-guide-mount';
        const before = root.querySelector('.hints-section, .coddy-hints-container');
        if (before) before.before(mount);
        else root.append(mount);
        const previous = typeof lesson.id === 'number'
            ? GDHCodeGuide.unseenKeys(lesson.id, LESSONS_DATA) : new Set();
        const items = GDHCodeGuide.analyze(lesson.initialCode || lesson.starterCode || '');
        const newKeys = items.filter(x => !previous.has(x.key)).map(x => x.key);
        mount.dataset.newKeys = JSON.stringify(newKeys);
        // Prima comparsa nel corso: leggibile subito. Il ripasso resta sempre apribile.
        GDHCodeGuide.render(mount, source, {
            expanded: typeof lesson.id !== 'number' || newKeys.length > 0, newKeys
        });
        mount.addEventListener('click', event => {
            const button = event.target.closest('.gdh-code-guide-jump');
            if (!button || !mount.contains(button)) return;
            const editor = document.getElementById('code-editor');
            const line = Number(button.dataset.line);
            if (!editor || !Number.isSafeInteger(line) || line < 1) return;
            this.setMobileExerciseTab('code', false);
            window.GDHErrorGuide?.jump(editor, line);
        });
    },

    refreshCodeGuide() {
        const mount = document.querySelector('#view-exercise .gdh-code-guide-mount');
        const editor = document.getElementById('code-editor');
        if (!mount || !editor || !window.GDHCodeGuide) return;
        let newKeys = [];
        try { newKeys = JSON.parse(mount.dataset.newKeys || '[]'); } catch (_) {}
        GDHCodeGuide.render(mount, editor.value, {newKeys});
    },

    setupEditor() {
        const editor = document.getElementById('code-editor');
        if (!editor) return;

        editor.addEventListener('input', () => {
            window.GDHErrorGuide?.clearMark(editor);
            window.GDHErrorGuide?.clear('#exercise-debug-area');
            this.updateLineNumbers();
            this.refreshCodeGuide();
            this.checkAutocomplete();
            // Un ripasso non deve mai sovrascrivere il codice salvato del corso.
            if (!this.isReviewMode) {
                this.state.userCode[this.state.currentLessonId] = editor.value;
                this.saveStorage();
            } else {
                this.saveReviewDraft();
            }
        });

        editor.addEventListener('keydown', (e) => {
            // Ctrl+Invio esegue anche quando è aperto un suggerimento.
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runAndValidate();
                return;
            }
            // Autocomplete navigazione da tastiera
            const popup = document.getElementById('autocomplete-popup');
            if (popup && !popup.classList.contains('hidden')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.moveAutocompleteSelection(1);
                    return;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.moveAutocompleteSelection(-1);
                    return;
                } else if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    this.commitAutocompleteSelection();
                    return;
                } else if (e.key === 'Escape') {
                    this.hideAutocomplete();
                    return;
                }
            }

            // Chiusura automatica parentesi e virgolette
            if (e.key === '(') {
                e.preventDefault();
                const pos = editor.selectionStart;
                editor.value = editor.value.substring(0, pos) + "()" + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = pos + 1;
                this.updateLineNumbers();
                return;
            }

            if (e.key === '"') {
                e.preventDefault();
                const pos = editor.selectionStart;
                editor.value = editor.value.substring(0, pos) + '""' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = pos + 1;
                this.updateLineNumbers();
                return;
            }

            // Tab / Shift+Tab e Backspace sull'indentazione condivisi con Sandbox.
            if (e.key === 'Tab') {
                e.preventDefault();
                window.GDHEditorUX?.indent(editor,e.shiftKey);
                return;
            }
            if (e.key === 'Backspace' && window.GDHEditorUX?.backspace(editor)) {
                e.preventDefault();
                return;
            }

            // Scorciatoia Ctrl+Enter per eseguire
            if (e.key === 'Enter' && !e.altKey && !e.isComposing) {
                e.preventDefault();
                this.insertSmartNewline(editor);
                return;
            }
        });
    },

    checkAutocomplete(context = 'exercise') {
        const editor = document.getElementById(context === 'sandbox' ? 'sandbox-code-editor' : 'code-editor');
        if (!editor) return;
        const pos = editor.selectionStart;
        const textBefore = editor.value.substring(0, pos);
        
        const match = textBefore.match(/([a-zA-Z0-9_]+)$/);
        if (!match || match[1].length < 1) {
            this.hideAutocomplete();
            return;
        }

        const query = match[1].toLowerCase();
        const userVars = this.extractUserVariables(editor.value);
        const candidates = [...userVars, ...this.builtins];

        const seen = new Set();
        const matches = [];
        for (const item of candidates) {
            if (!seen.has(item.name) && item.name.toLowerCase().startsWith(query) && item.name.toLowerCase() !== query) {
                seen.add(item.name);
                matches.push(item);
            }
        }

        if (matches.length === 0) {
            this.hideAutocomplete();
            return;
        }

        this.hideAutocomplete();
        this.state.autocompleteList = matches.slice(0, 6);
        this.state.selectedAutocompleteIndex = 0;
        this.renderAutocompletePopup(context);
    },

    getCaretCoordinates(element, position) {
        const mirror = document.createElement('div');
        const style = window.getComputedStyle(element);

        const properties = [
            'direction', 'boxSizing', 'width', 'overflowX', 'overflowY',
            'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize',
            'lineHeight', 'fontFamily', 'textAlign', 'textTransform',
            'textIndent', 'letterSpacing', 'wordSpacing', 'tabSize'
        ];

        mirror.style.position = 'absolute';
        mirror.style.top = '-9999px';
        mirror.style.left = '-9999px';
        mirror.style.visibility = 'hidden';
        mirror.style.whiteSpace = 'pre';
        mirror.style.wordWrap = 'normal';

        properties.forEach(prop => {
            mirror.style[prop] = style[prop];
        });

        mirror.textContent = element.value.substring(0, position);
        const span = document.createElement('span');
        span.textContent = element.value.substring(position, position + 1) || ' ';
        mirror.appendChild(span);

        document.body.appendChild(mirror);

        const top = span.offsetTop + parseInt(style.borderTopWidth || '0', 10);
        const left = span.offsetLeft + parseInt(style.borderLeftWidth || '0', 10);
        const height = parseInt(style.lineHeight, 10) || Math.round(parseInt(style.fontSize, 10) * 1.6);

        document.body.removeChild(mirror);

        return { top, left, height };
    },

    renderAutocompletePopup(context = 'exercise') {
        const popup = document.getElementById(context === 'sandbox' ? 'sandbox-autocomplete-popup' : 'autocomplete-popup');
        const editor = document.getElementById(context === 'sandbox' ? 'sandbox-code-editor' : 'code-editor');
        if (!popup || !editor) return;

        popup.innerHTML = '';
        this.state.autocompleteList.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = `autocomplete-item ${idx === this.state.selectedAutocompleteIndex ? 'selected' : ''}`;
            el.innerHTML = `
                <span class="autocomplete-name">${item.name}</span>
                <span class="autocomplete-badge ${item.type}">${item.badge}</span>
            `;
            el.onmousedown = (e) => {
                e.preventDefault();
                this.state.selectedAutocompleteIndex = idx;
                this.commitAutocompleteSelection(context);
            };
            popup.appendChild(el);
        });

        const caret = this.getCaretCoordinates(editor, editor.selectionStart);
        const wrapper = editor.closest('.editor-wrapper');
        if (!wrapper) return;
        const wrapperRect = wrapper.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();

        const offsetLeft = editorRect.left - wrapperRect.left;
        const offsetTop = editorRect.top - wrapperRect.top;

        let posX = offsetLeft + caret.left - editor.scrollLeft;
        let posY = offsetTop + caret.top - editor.scrollTop + caret.height + 4;

        const popupWidth = 270;
        if (posX + popupWidth > wrapper.clientWidth - 10) {
            posX = Math.max(offsetLeft + 10, wrapper.clientWidth - popupWidth - 15);
        }

        const popupHeight = Math.min(220, this.state.autocompleteList.length * 36 + 10);
        if (posY + popupHeight > wrapper.clientHeight - 10) {
            posY = Math.max(10, offsetTop + caret.top - editor.scrollTop - popupHeight - 4);
        }

        popup.style.left = `${Math.round(posX)}px`;
        popup.style.top = `${Math.round(posY)}px`;
        popup.classList.remove('hidden');
    },

    moveAutocompleteSelection(delta, context = 'exercise') {
        const len = this.state.autocompleteList.length;
        if (len === 0) return;
        this.state.selectedAutocompleteIndex = (this.state.selectedAutocompleteIndex + delta + len) % len;
        this.renderAutocompletePopup(context);
    },

    commitAutocompleteSelection(context = 'exercise') {
        const selected = this.state.autocompleteList[this.state.selectedAutocompleteIndex];
        if (!selected) return;

        const editor = document.getElementById(context === 'sandbox' ? 'sandbox-code-editor' : 'code-editor');
        if (!editor) return;
        const pos = editor.selectionStart;
        const textBefore = editor.value.substring(0, pos);
        const match = textBefore.match(/([a-zA-Z0-9_]+)$/);

        if (match) {
            const replaceStart = pos - match[1].length;
            editor.value = editor.value.substring(0, replaceStart) + selected.name + editor.value.substring(pos);
            editor.selectionStart = editor.selectionEnd = replaceStart + selected.name.length;
            if (context === 'sandbox') {
                this.updateSandboxLineNumbers();
                window.GDScriptHighlighter?.sync('sandbox');
                const project = this.getActiveSandboxProject();
                if (project) {
                    project.code = editor.value;
                    project.updatedAt = new Date().toISOString();
                    this.saveStorage();
                    this.updateSandboxSyncStatus('saved');
                }
            } else {
                this.updateLineNumbers();
                if (!this.isReviewMode) {
                    this.state.userCode[this.state.currentLessonId] = editor.value;
                    this.saveStorage();
                } else {
                    this.saveReviewDraft();
                }
            }
        }

        this.hideAutocomplete();
    },

    hideAutocomplete() {
        for (const id of ['autocomplete-popup', 'sandbox-autocomplete-popup']) {
            const popup = document.getElementById(id);
            if (popup) popup.classList.add('hidden');
        }
        this.state.autocompleteList = [];
    },

    updateLineNumbers() {
        const editor = document.getElementById('code-editor');
        const lineNums = document.getElementById('line-numbers');
        if (!editor || !lineNums) return;

        const lines = editor.value.split('\n').length;
        let numbers = '';
        for (let i = 1; i <= Math.max(lines, 1); i++) {
            numbers += i + '\n';
        }
        lineNums.innerText = numbers;
        window.GDScriptHighlighter?.sync();
        window.GDHEditorUX?.refresh(editor);
    },

    // ==========================================
    // VERIFICA DEL CODICE
    // ==========================================
    // ==========================================
    // P3.1: TELEMETRIA DIDATTICA LOCALE & APPRENDIMENTO ADATTIVO
    // ==========================================
    initLearningTelemetryFromLegacy(finishedLessons = []) {
        const telemetry = {
            schema_version: 1,
            lessons: {},
            daily_activity: {}
        };
        const finishedSet = new Set(finishedLessons || []);
        finishedSet.forEach(id => {
            const lesson = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA.find(l => l.id === id) : null;
            const concept = (typeof getLessonConcept === 'function') ? getLessonConcept(id) : { id: "general" };
            telemetry.lessons[id] = {
                lesson_id: id,
                concept_id: lesson?.conceptId || concept.id,
                concept_tags: lesson?.conceptTags || [],
                total_runs: 0,
                verify_attempts: 0,
                failed_verifications: 0,
                failed_before_first_success: null, // Dati storici pre-P3 non disponibili
                success_count: 1,
                first_attempt_at: null,
                last_attempt_at: null,
                first_success_at: null,
                last_success_at: null,
                max_hint_level_opened: 0,
                hints_opened_before_first_success: null, // Dati storici pre-P3 non disponibili
                first_success_without_hints: null, // Non presumere soluzione senza aiuti per salvataggi legacy
                error_breakdown: { syntax: 0, runtime: 0, requirement: 0, timeout: 0, internal: 0 },
                legacy_completion: true,
                history_available: false
            };
        });
        return telemetry;
    },

    migrateLearningTelemetry(parsedTelemetry, finishedLessons = []) {
        if (!parsedTelemetry || typeof parsedTelemetry !== 'object') {
            return this.initLearningTelemetryFromLegacy(finishedLessons);
        }
        const telemetry = {
            schema_version: Math.max(parsedTelemetry.schema_version || 1, 1),
            lessons: { ...(parsedTelemetry.lessons || {}) },
            daily_activity: { ...(parsedTelemetry.daily_activity || {}) }
        };

        // Assicura che le lezioni completate prima di P3 abbiano una voce legacy corretta
        const finishedSet = new Set(finishedLessons || []);
        finishedSet.forEach(id => {
            if (!telemetry.lessons[id]) {
                const lesson = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA.find(l => l.id === id) : null;
                const concept = (typeof getLessonConcept === 'function') ? getLessonConcept(id) : { id: "general" };
                telemetry.lessons[id] = {
                    lesson_id: id,
                    concept_id: lesson?.conceptId || concept.id,
                    concept_tags: lesson?.conceptTags || [],
                    total_runs: 0,
                    verify_attempts: 0,
                    failed_verifications: 0,
                    failed_before_first_success: null,
                    success_count: 1,
                    first_attempt_at: null,
                    last_attempt_at: null,
                    first_success_at: null,
                    last_success_at: null,
                    max_hint_level_opened: 0,
                    hints_opened_before_first_success: null,
                    first_success_without_hints: null,
                    error_breakdown: { syntax: 0, runtime: 0, requirement: 0, timeout: 0, internal: 0 },
                    legacy_completion: true,
                    history_available: false
                };
            } else {
                const l = telemetry.lessons[id];
                if (!l.error_breakdown) {
                    l.error_breakdown = { syntax: 0, runtime: 0, requirement: 0, timeout: 0, internal: 0 };
                }
                if (l.total_runs === undefined) l.total_runs = l.verify_attempts || 0;
            }
        });

        return telemetry;
    },

    getOrCreateLessonTelemetry(lessonId) {
        if (!this.state.learningTelemetry) {
            this.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };
        }
        if (!this.state.learningTelemetry.lessons) {
            this.state.learningTelemetry.lessons = {};
        }
        if (!this.state.learningTelemetry.daily_activity) {
            this.state.learningTelemetry.daily_activity = {};
        }

        const idStr = String(lessonId);
        if (!this.state.learningTelemetry.lessons[idStr]) {
            const lesson = (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA.find(l => l.id === lessonId) : null;
            const concept = (typeof getLessonConcept === 'function') ? getLessonConcept(lessonId) : { id: "general" };
            this.state.learningTelemetry.lessons[idStr] = {
                lesson_id: lessonId,
                concept_id: lesson?.conceptId || concept.id,
                concept_tags: lesson?.conceptTags || [],
                total_runs: 0,
                verify_attempts: 0,
                failed_verifications: 0,
                failed_before_first_success: 0,
                success_count: 0,
                first_attempt_at: null,
                last_attempt_at: null,
                first_success_at: null,
                last_success_at: null,
                max_hint_level_opened: 0,
                hints_opened_before_first_success: 0,
                first_success_without_hints: null,
                error_breakdown: { syntax: 0, runtime: 0, requirement: 0, timeout: 0, internal: 0 },
                legacy_completion: false,
                history_available: true
            };
        }
        return this.state.learningTelemetry.lessons[idStr];
    },

    classifyExecutionError(result, tests, criticalErr, code = '') {
        if (criticalErr) {
            return 'internal';
        }
        if (!code && typeof document !== 'undefined') {
            const ed = document.getElementById('code-editor');
            if (ed) code = ed.value || '';
        }
        // La diagnostica del vecchio transpiler non va applicata a Godot nativo.
        if (!result?.nativeStatus && typeof GDScriptDiagnostic !== 'undefined' && code) {
            const diag = GDScriptDiagnostic.analyze(code, result, null, null);
            if (diag && diag.isTranspilerLimitation) {
                return 'internal';
            }
        }
        if (result && !result.success && result.error) {
            const err = String(result.error);
            if (/timeout|ciclo infinito/i.test(err)) {
                return 'timeout';
            }
            if (/syntaxerror|errore di sintassi|delimitazione stringa|unexpected token|invalid or unexpected token|unexpected identifier|missing \)/i.test(err)) {
                return 'syntax';
            }
            if (/internal|transpiler bug|non supportato/i.test(err)) {
                return 'internal';
            }
            return 'runtime';
        }
        if (tests && Array.isArray(tests)) {
            const allPassed = tests.length > 0 && tests.every(t => t.passed);
            if (!allPassed) {
                return 'requirement';
            }
        }
        return null;
    },

    recordDailyActivity(type, count = 1, options = {}) {
        if (!this.state.learningTelemetry) {
            this.state.learningTelemetry = { schema_version: 1, lessons: {}, daily_activity: {} };
        }
        if (!this.state.learningTelemetry.daily_activity) {
            this.state.learningTelemetry.daily_activity = {};
        }
        const todayKey = (typeof StatsEngine !== 'undefined' && StatsEngine.formatLocalDateKey)
            ? StatsEngine.formatLocalDateKey(new Date())
            : this.getTodayISO();
        if (!this.state.learningTelemetry.daily_activity[todayKey]) {
            this.state.learningTelemetry.daily_activity[todayKey] = {
                verifications: 0,
                lessons_completed: 0,
                autonomous_completed: 0,
                assisted_completed: 0,
                reviews_completed: 0
            };
        }
        const entry = this.state.learningTelemetry.daily_activity[todayKey];
        if (type === 'verification') {
            entry.verifications += count;
        } else if (type === 'lesson_success') {
            entry.lessons_completed += count;
            if (options.autonomous) {
                entry.autonomous_completed += count;
            } else {
                entry.assisted_completed += count;
            }
        } else if (type === 'review_success') {
            entry.reviews_completed += count;
        }
    },

    recordLessonAttempt(lessonId, result, tests, criticalErr, code = '') {
        if (!lessonId) return;
        const record = this.getOrCreateLessonTelemetry(lessonId);
        const nowIso = new Date().toISOString();

        record.total_runs++;
        record.verify_attempts++;
        if (!record.first_attempt_at) {
            record.first_attempt_at = nowIso;
        }
        record.last_attempt_at = nowIso;

        // Registra tentativo nel contatore aggregato giornaliero (P3.4)
        this.recordDailyActivity('verification', 1);

        const errType = this.classifyExecutionError(result, tests, criticalErr, code);

        if (errType === null) {
            // Verifica superata con successo
            const isFirstSuccess = !record.first_success_at;
            record.success_count++;
            if (!record.first_success_at) {
                record.first_success_at = nowIso;
                if (record.hints_opened_before_first_success === null || record.hints_opened_before_first_success === undefined) {
                    record.hints_opened_before_first_success = record.max_hint_level_opened || 0;
                }
                record.first_success_without_hints = (record.hints_opened_before_first_success === 0);
                if (record.failed_before_first_success === null || record.failed_before_first_success === undefined) {
                    record.failed_before_first_success = 0;
                }
            }
            record.last_success_at = nowIso;

            if (isFirstSuccess) {
                this.recordDailyActivity('lesson_success', 1, { autonomous: record.first_success_without_hints === true });
            }
        } else if (errType === 'internal') {
            // Errore infrastrutturale / interno: non attribuisce difficoltà didattica allo studente
            record.error_breakdown.internal = (record.error_breakdown.internal || 0) + 1;
        } else {
            // Errore didattico (sintassi, runtime, requisito o timeout)
            // Più asserzioni fallite nella stessa verifica valgono comunque come 1 solo tentativo fallito
            record.failed_verifications++;
            if (!record.first_success_at) {
                record.failed_before_first_success = (record.failed_before_first_success || 0) + 1;
            }
            record.error_breakdown[errType] = (record.error_breakdown[errType] || 0) + 1;
        }

        this.saveStorage();
    },

    recordHintOpened(lessonId, level) {
        if (!lessonId || level <= 0) return;
        const record = this.getOrCreateLessonTelemetry(lessonId);
        if (level > (record.max_hint_level_opened || 0)) {
            record.max_hint_level_opened = level;
        }
        if (!record.first_success_at) {
            if (record.hints_opened_before_first_success === null || record.hints_opened_before_first_success === undefined || level > record.hints_opened_before_first_success) {
                record.hints_opened_before_first_success = level;
            }
        }
        this.saveStorage();
    },

    // Il dock rimane leggibile anche quando la lista dei test è molto lunga.
    // L'errore più utile viene mostrato per primo, senza scorrere la pagina.
    // Debugger didattico comune a Corso, Ripasso e Sandbox.
    // Mostra solo righe confermate dal messaggio Godot: niente posizioni inventate.
    updateDidacticDebugger(result, tests = [], context = 'exercise') {
        if (!window.GDHErrorGuide) return;
        const sandbox = context === 'sandbox';
        const host = sandbox ? '#sandbox-debug-area' : '#exercise-debug-area';
        const editor = document.getElementById(sandbox ? 'sandbox-code-editor' : 'code-editor');
        const failed = Array.isArray(tests) ? tests.find(t => !t.passed) : null;
        const error = result?.error || '';
        if (!error && !failed) {
            GDHErrorGuide.clearMark(editor);
            GDHErrorGuide.clear(host);
            if (!sandbox) document.getElementById('exercise-primary-feedback')?.classList.remove('hidden');
            return;
        }
        const diagnosis = GDHErrorGuide.diagnose({
            source: editor?.value || '',
            error, failedTest: failed,
            verdict: result?.nativeFeedback?.verdict || ''
        });
        GDHErrorGuide.mark(editor, diagnosis?.kind === 'engine' ? diagnosis.line : null);
        GDHErrorGuide.render(host, diagnosis, line => GDHErrorGuide.jump(editor, line), level => {
            // Solo gli indizi aperti volontariamente contano come aiuti.
            // Anche il debugger rispetta quindi la missione "senza suggerimenti".
            if (sandbox || !level) return;
            this.state.hintsRevealed = Math.max(this.state.hintsRevealed || 0, level);
            if (this.isReviewMode && this.currentReviewVariant) {
                if (typeof ReviewEngine !== 'undefined') {
                    ReviewEngine.recordVariantHintOpened(this.currentReviewVariant.id, level, this.state);
                }
            } else {
                this.recordHintOpened(this.state.currentLessonId, level);
            }
        });
        // Evita due riquadri consecutivi per lo stesso problema.
        // La guida è il feedback principale quando viene mostrata.
        if (!sandbox) {
            document.getElementById('exercise-primary-feedback')?.classList.toggle('hidden', Boolean(diagnosis));
        }
    },

    resetExerciseFeedback() {
        document.getElementById('exercise-primary-feedback')?.classList.remove('hidden');
        window.GDHErrorGuide?.clearMark(document.getElementById('code-editor'));
        window.GDHErrorGuide?.clear('#exercise-debug-area');
        this.keepExerciseAtHorizontalOrigin();
        const area = document.getElementById('exercise-primary-feedback');
        const title = document.getElementById('exercise-feedback-title');
        const description = document.getElementById('exercise-feedback-description');
        const count = document.getElementById('exercise-test-count');
        const details = document.getElementById('exercise-test-details');
        if (area) area.dataset.state = 'idle';
        if (title) title.textContent = 'In attesa di verifica';
        if (description) description.textContent = 'Scrivi il codice e premi Verifica il codice per controllare il risultato.';
        if (count) count.textContent = 'Non ancora verificato';
        if (details) details.open = false;
    },

    keepExerciseAtHorizontalOrigin() {
        const exercise = document.getElementById('view-exercise');
        if (exercise && !exercise.classList.contains('hidden')) {
            // Chrome può spostare orizzontalmente BODY quando porta in vista
            // il cursore di una riga molto lunga. Il codice deve invece
            // scorrere soltanto dentro la textarea, mai tutta la pagina.
            document.body.scrollLeft = 0;
            document.documentElement.scrollLeft = 0;
        }
    },

    showExerciseFeedback(result, tests) {
        this.keepExerciseAtHorizontalOrigin();
        const area = document.getElementById('exercise-primary-feedback');
        const title = document.getElementById('exercise-feedback-title');
        const description = document.getElementById('exercise-feedback-description');
        const count = document.getElementById('exercise-test-count');
        const details = document.getElementById('exercise-test-details');
        if (!area || !title || !description) return;
        area.classList.remove('hidden');
        const list = Array.isArray(tests) ? tests : [];
        const passed = list.filter(test => test.passed).length;
        const failed = list.find(test => !test.passed);
        if (count) count.textContent = passed + ' di ' + list.length + ' superati';
        if (details) details.open = false;
        if (!failed && result?.success) {
            area.dataset.state = 'success';
            title.textContent = 'Ottimo! Tutti i controlli sono superati.';
            description.textContent = 'Il codice produce il risultato richiesto. Puoi proseguire.';
        } else {
            area.dataset.state = 'error';
            title.textContent = result?.error ? 'Ho trovato un problema nel codice' : 'Controlla il codice';
            // Il messaggio tecnico resta disponibile nei dettagli del debugger.
            // Non presentarlo come primo testo a chi sta imparando.
            const message = result?.error
                ? 'Guarda la spiegazione qui sotto e la riga evidenziata nell’editor.'
                : (failed?.diff || failed?.desc || 'Almeno un controllo non è stato superato.');
            description.textContent = String(message);
        }
    },

    async runAndValidate() {
        if (this.isValidating) return;
        this.isValidating = true;

        SoundFX.playClick();
        const editor = document.getElementById('code-editor');
        const code = editor.value;

        // P3.3: Gestione Esecuzione e Verifica in Modalità Ripasso
        if (this.isReviewMode && this.currentReviewVariant) {
            const runBtn = document.getElementById('btn-run-code');
            runBtn.style.opacity = '0.7';
            runBtn.querySelector('.run-text').innerText = "Verifica in corso...";
            await this.runAndValidateReviewVariant(code, runBtn);
            return;
        }
        const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
        if (!currentLesson) {
            this.isValidating = false;
            return;
        }

        const runBtn = document.getElementById('btn-run-code');
        runBtn.style.opacity = '0.7';
        runBtn.querySelector('.run-text').innerText = "Verifica in corso...";

         try {
            if (!window.GDHGodot) throw new Error('Motore Godot non disponibile');
            const native = await window.GDHGodot.verifyLesson(currentLesson.id, code);
            // Non attribuire a una lezione l'esito di un codice cambiato durante la verifica.
            if (this.state.currentLessonId !== currentLesson.id || editor.value !== code || this.isReviewMode) return;
            const result = native.execution;

            const realOutputPre = document.getElementById('real-output-pre');
            if (result.logs && result.logs.length > 0) {
                realOutputPre.innerText = result.logs.join('\n');
                realOutputPre.style.color = '#38bdf8';
            } else if (result.error) {
                realOutputPre.innerText = `// Errore: ${result.error}`;
                realOutputPre.style.color = '#f87171';
            } else {
                realOutputPre.innerText = "// Nessun output stampato a console";
                realOutputPre.style.color = '#94a3b8';
            }

            const expectedOutputPre = document.getElementById('expected-output-pre');
            expectedOutputPre.innerText = currentLesson.expectedOutput || "// Nessun output richiesto";

            // Solo il verdetto completo di Godot può attivare gli XP e gli sblocchi.
            const tests = [...(native.feedback.checks || [])];
            const allPassed = native.accepted && tests.length > 0 && tests.every(t => t.passed);
            if (!allPassed && tests.every(t => t.passed)) {
                tests.push({desc:'Verifica Godot non conclusiva',passed:false,
                    diff:native.feedback.reason || 'Impossibile confermare la soluzione. Riprova.'});
            }
            if (!allPassed && native.feedback.reason && native.feedback.verdict === 'inconclusive') {
                const failure = tests.find(t => !t.passed);
                if (failure) failure.diff = native.feedback.reason;
            }
            this.showExerciseFeedback(result, tests);
            this.updateDidacticDebugger(allPassed ? null : result, allPassed ? [] : tests);

            // Registra telemetria P3.1 del tentativo di verifica
            this.recordLessonAttempt(currentLesson.id, result, tests,
                ['inconclusive','timeout'].includes(native.feedback.verdict)
                    ? new Error(native.feedback.reason || 'Verifica nativa incompleta') : null, code);

            // Aggiorna Schermo Viewport 2D Godot
            if (this.viewport) {
                this.viewport.updateFromExecution(result, currentLesson, allPassed);
            }

            const resultsContainer = document.getElementById('test-results-view');
            resultsContainer.innerHTML = '';

            tests.forEach(test => {
                const row = document.createElement('div');
                row.className = `test-row ${test.passed ? 'passed' : 'failed'}`;
                row.innerHTML = `
                    <div class="test-icon">${test.passed ? '✅' : '❌'}</div>
                    <div class="test-info"><div class="test-desc"></div></div>
                `;
                // I messaggi possono includere l'output GDScript dello studente.
                // textContent impedisce che diventino HTML eseguibile.
                row.querySelector('.test-desc').textContent = String(test.desc ?? '');
                if (test.diff !== undefined && test.diff !== null && test.diff !== '') {
                    const diffEl = document.createElement('div');
                    diffEl.className = 'test-diff';
                    diffEl.textContent = String(test.diff);
                    row.querySelector('.test-info').appendChild(diffEl);
                }
                resultsContainer.appendChild(row);
            });

            const badge = document.getElementById('test-status-badge');
            if (allPassed) {
                badge.innerText = `✓ Superato (${tests.length}/${tests.length})`;
                badge.style.color = '#10b981';

                const isFirstTime = !this.state.finishedLessons.includes(currentLesson.id);
                const earnedLessonXp = isFirstTime ? currentLesson.xp : 0;
                if (isFirstTime) {
                    this.state.finishedLessons.push(currentLesson.id);
                    this.state.xp += earnedLessonXp;

                    const isCore = !currentLesson.isMastery;
                    const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === currentLesson.chapterId);
                    const coreLessons = chapterLessons.filter(l => !l.isMastery);
                    const lastCore = coreLessons[coreLessons.length - 1];
                    const mastery = chapterLessons.find(l => l.isMastery);

                    if (isCore) {
                        if (currentLesson.id === lastCore.id) {
                            // Ultimo livello core del capitolo: sblocca la sfida bonus di padronanza!
                            if (mastery && !this.state.completedLessons.includes(mastery.id)) {
                                this.state.completedLessons.push(mastery.id);
                            }
                            // Il capitolo successivo si sblocca solo dopo il consolidamento.
                        } else {
                            // Livello core intermedio: sblocca il livello core successivo
                            const currentIdx = coreLessons.findIndex(l => l.id === currentLesson.id);
                            if (currentIdx !== -1 && currentIdx < coreLessons.length - 1) {
                                const nextCore = coreLessons[currentIdx + 1];
                                if (!this.state.completedLessons.includes(nextCore.id)) {
                                    this.state.completedLessons.push(nextCore.id);
                                }
                            }
                        }
                    } else {
                        // È una sfida di padronanza: assicura che il prossimo capitolo sia aperto
                        const nextChapterLessons = LESSONS_DATA.filter(l => l.chapterId === currentLesson.chapterId + 1 && !l.isMastery);
                        if (nextChapterLessons.length > 0) {
                            const nextCore = nextChapterLessons[0];
                            if (!this.state.completedLessons.includes(nextCore.id)) {
                                this.state.completedLessons.push(nextCore.id);
                            }
                        }
                    }

                    this.saveStorage();
                    this.updateStatsUI({ announceLevelUp: true });
                }

                // Registra missione quotidiana: esercizio completato
                this.recordDailyQuestProgress('daily_exercise', 1);

                // Chiedere aiuto non riduce gli XP né blocca una missione.

                // Controllo sblocco traguardi
                this.checkAchievements({
                    lessonId: currentLesson.id,
                    hintsUsed: this.state.hintsRevealed
                });

                const nextBtnHeader = document.getElementById('btn-header-next');
                if (nextBtnHeader) nextBtnHeader.classList.remove('hidden');

                // Registra attività streak
                this.recordDailyActivity();

                SoundFX.playSuccess();
                ConfettiFX.burst();

                // Dopo la prima soluzione, anche il badge dell'esercizio non deve più
                // far pensare che il premio iniziale sia ancora ottenibile.
                this.syncLessonXpBadge(currentLesson);

                // Aggiorna modale vittoria
                const modalTitle = document.getElementById('modal-success-title');
                const modalSubtitle = document.getElementById('modal-success-subtitle');

                if (!isFirstTime) {
                    // Una ripetizione corretta non sblocca il capitolo né assegna XP della lezione.
                    if (modalTitle) modalTitle.innerText = "ESERCIZIO COMPLETATO!";
                    if (modalSubtitle) modalSubtitle.innerText = "Soluzione corretta. Hai già completato questo esercizio.";
                } else if (currentLesson.isMastery) {
                    if (modalTitle) modalTitle.innerText = "CONSOLIDAMENTO COMPLETATO!";
                    if (modalSubtitle) modalSubtitle.innerText = "Hai dimostrato di saper combinare le conoscenze del capitolo. Ora puoi proseguire.";
                } else {
                    const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === currentLesson.chapterId);
                    const coreLessons = chapterLessons.filter(l => !l.isMastery);
                    const isLastCore = (currentLesson.id === coreLessons[coreLessons.length - 1].id);

                    if (modalTitle) modalTitle.innerText = isLastCore ? "CAPITOLO COMPLETATO!" : "MISSIONE COMPIUTA!";
                    if (modalSubtitle) {
                        modalSubtitle.innerText = isLastCore
                            ? "Ottimo lavoro! Hai sbloccato l'esercizio di consolidamento del capitolo."
                            : "Ottimo lavoro! Il tuo script GDScript funziona alla perfezione.";
                    }
                }
                this.setSuccessModalReward(earnedLessonXp);

                setTimeout(() => {
                    document.getElementById('success-modal').classList.remove('hidden');
                }, 300);

            } else {
                badge.innerText = `✗ Fallito (${tests.filter(t => t.passed).length}/${tests.length})`;
                badge.style.color = '#ef4444';
                SoundFX.playError();

                // Costruzione Feedback Didattico Contestuale Avanzato (P3.2)
                const firstFailedTest = tests.find(t => !t.passed);
                const feedbackCard = this.buildContextualFeedback(result, currentLesson, firstFailedTest, tests, code);
                if (feedbackCard) {
                    resultsContainer.appendChild(feedbackCard);
                }
            }

        } catch (criticalErr) {
            if (editor.value === code) this.updateDidacticDebugger({error:String(criticalErr.message || criticalErr)}, []);
            console.error("Errore durante la verifica:", criticalErr);
            this.recordLessonAttempt(currentLesson.id, null, null, criticalErr, code);
            const realOutputPre = document.getElementById('real-output-pre');
            realOutputPre.innerText = `// Errore inaspettato: ${criticalErr.message}`;
            realOutputPre.style.color = '#f87171';
            SoundFX.playError();
        } finally {
            runBtn.style.opacity = '1';
            runBtn.querySelector('.run-text').innerText = "Verifica Codice";
            this.isValidating = false;
        }
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mastery-popover') && !e.target.closest('.node-item.mastery')) {
                this.closeAllMasteryPopovers();
            }
        });
        document.getElementById('btn-home').onclick = () => this.showRoadmap();
        document.getElementById('nav-roadmap-btn').onclick = () => this.showRoadmap();

        const btnHeroContinue = document.getElementById('btn-hero-continue');
        if (btnHeroContinue) {
            btnHeroContinue.onclick = () => {
                SoundFX.playClick();
                let focusId = this.state.currentLessonId;
                if (!focusId || this.state.finishedLessons.includes(focusId)) {
                    const firstUnfinished = LESSONS_DATA.find(l => !l.isMastery && !this.state.finishedLessons.includes(l.id));
                    focusId = firstUnfinished ? firstUnfinished.id : 1;
                }
                this.openLesson(focusId);
            };
        }
        document.getElementById('nav-editor-btn').onclick = () => {
            SoundFX.playClick();
            this.openLesson(this.state.currentLessonId);
        };
        document.getElementById('nav-practice-btn').onclick = () => this.openPracticeView();
        document.getElementById('nav-projects-btn').onclick = () => this.openProjectsView();
        document.getElementById('btn-open-competitive-arena')?.addEventListener('click',()=>this.openCompetitiveArena());
        document.getElementById('btn-close-competitive-arena')?.addEventListener('click',()=>this.closeCompetitiveArena());
        document.getElementById('competition-run')?.addEventListener('click',()=>CompetitionArena.run());
        document.getElementById('competition-save-code')?.addEventListener('click',()=>CompetitionArena.download());
        document.getElementById('btn-open-official-arena')?.addEventListener('click',()=>this.openOfficialArena());
        document.getElementById('btn-back-official')?.addEventListener('click',()=>this.openProjectsView());
        OfficialArena.wire();
        const navReviewBtn = document.getElementById('nav-review-btn');
        if (navReviewBtn) navReviewBtn.onclick = () => this.showReviewView();

        const navStatsBtn = document.getElementById('nav-stats-btn');
        if (navStatsBtn) navStatsBtn.onclick = () => this.showStatsView();

        const mobNavStats = document.getElementById('mob-nav-stats');
        if (mobNavStats) mobNavStats.onclick = () => this.showStatsView();

        const btnProfToStats = document.getElementById('btn-profile-to-stats');
        if (btnProfToStats) {
            btnProfToStats.onclick = () => {
                this.closeProfileModal();
                this.showStatsView();
            };
        }
        document.getElementById('btn-back-to-roadmap').onclick = () => {
            if (this.isReviewMode) {
                this.exitReviewMode();
            } else {
                this.showRoadmap();
            }
        };

        // Navigazione Bottom Mobile (Smartphone e Tablet)
        const mobNavRoadmap = document.getElementById('mob-nav-roadmap');
        if (mobNavRoadmap) mobNavRoadmap.onclick = () => this.showRoadmap();

        const mobNavExercise = document.getElementById('mob-nav-exercise');
        if (mobNavExercise) {
            mobNavExercise.onclick = () => {
                SoundFX.playClick();
                this.openLesson(this.state.currentLessonId);
            };
        }

        const mobNavPractice = document.getElementById('mob-nav-practice');
        if (mobNavPractice) mobNavPractice.onclick = () => this.openPracticeView();

        const mobNavProjects = document.getElementById('mob-nav-projects');
        if (mobNavProjects) mobNavProjects.onclick = () => this.openProjectsView();

        const mobNavReview = document.getElementById('mob-nav-review');
        if (mobNavReview) mobNavReview.onclick = () => this.showReviewView();

        const mobNavAchievements = document.getElementById('mob-nav-achievements');
        if (mobNavAchievements) mobNavAchievements.onclick = () => this.openAchievementsModal();

        // Switcher Schede Mobile in Esercizio (Compito vs Codice)
        const btnTabInstructions = document.getElementById('btn-tab-instructions');
        if (btnTabInstructions) btnTabInstructions.onclick = () => this.setMobileExerciseTab('instructions');

        const btnTabCode = document.getElementById('btn-tab-code');
        if (btnTabCode) btnTabCode.onclick = () => this.setMobileExerciseTab('code');

        const btnMobileToCode = document.getElementById('btn-mobile-to-code');
        if (btnMobileToCode) btnMobileToCode.onclick = () => this.setMobileExerciseTab('code');

        // Toolbar Caratteri Rapidi Mobile (Quick Keys)
        document.querySelectorAll('.quick-key').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                SoundFX.playClick();
                const targetId = btn.getAttribute('data-target') || 'code-editor';
                const textToInsert = btn.getAttribute('data-insert') || '';
                const cursorOffset = parseInt(btn.getAttribute('data-cursor') || '0', 10);
                this.insertTextAtEditor(targetId, textToInsert, cursorOffset);
            };
        });

        // Profilo
        document.getElementById('btn-open-profile').onclick = () => this.toggleLevelPopover();
        document.getElementById('btn-close-level-popover').onclick = () => this.closeLevelPopover(true);
        document.getElementById('btn-level-full-profile').onclick = () => {
            this.closeLevelPopover();
            this.openProfileModal();
        };
        document.addEventListener('click',event=>{
            const panel=document.getElementById('level-popover');
            if(panel?.classList.contains('hidden'))return;
            if(!event.target.closest('#level-popover, #btn-open-profile'))
                this.closeLevelPopover();
        });
        document.addEventListener('keydown',event=>{
            if(event.key==='Escape' &&
                !document.getElementById('level-popover')?.classList.contains('hidden')) {
                event.preventDefault();
                this.closeLevelPopover(true);
            }
        });
        document.getElementById('btn-close-profile').onclick = () => this.closeProfileModal();
        document.getElementById('btn-save-profile').onclick = () => this.saveProfile();

        // Palette Avatar
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.onclick = () => {
                SoundFX.playClick();
                document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.profile.avatar = btn.getAttribute('data-avatar');
                this.updateProfilePreviewCard();
            };
        });

        // Palette Colori
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.onclick = () => {
                SoundFX.playClick();
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
                this.state.profile.color = swatch.getAttribute('data-color');
                this.updateProfilePreviewCard();
            };
        });

        // Missioni Giornaliere
        const btnOpenDaily = document.getElementById('btn-open-daily-quests');
        if (btnOpenDaily) btnOpenDaily.onclick = () => this.openQuestsModal();
        const btnCloseQuests = document.getElementById('btn-close-quests');
        if (btnCloseQuests) btnCloseQuests.onclick = () => this.closeQuestsModal();

        // Toggle Sfide Giornaliere a Scomparsa su Mobile
        const sidebarToggle = document.getElementById('sidebar-quests-toggle');
        const sidebarCard = document.getElementById('sidebar-quests-card');
        if (sidebarToggle && sidebarCard) {
            sidebarToggle.onclick = () => {
                if (window.innerWidth <= 820) {
                    SoundFX.playClick();
                    sidebarCard.classList.toggle('collapsed-mobile');
                    setTimeout(() => {
                        this.drawConnectingLines();
                    }, 100);
                }
            };
        }

        // Progetti
        const btnCloseProj = document.getElementById('btn-close-project-preview');
        if (btnCloseProj) btnCloseProj.onclick = () => this.closeProjectPreview();

        // Palestra / Sandbox di Codice (Compatibilità controlli legacy)
        const btnLegacyRun = document.getElementById('btn-practice-run');
        if (btnLegacyRun) btnLegacyRun.onclick = () => this.runSandboxCode();
        const btnLegacyClear = document.getElementById('btn-practice-clear');
        if (btnLegacyClear) btnLegacyClear.onclick = () => this.clearSandboxConsole();
        const btnLegacyReset = document.getElementById('btn-practice-reset');
        if (btnLegacyReset) {
            btnLegacyReset.onclick = () => {
                SoundFX.playClick();
                const ed = document.getElementById('sandbox-code-editor') || document.getElementById('practice-code-editor');
                if (ed) {
                    ed.value = `extends Node2D\n\nfunc _ready():\n    pass\n`;
                    this.updateSandboxLineNumbers();
                }
            };
        }


        // Traguardi
        document.getElementById('btn-open-achievements').onclick = () => this.openAchievementsModal();
        document.getElementById('btn-close-achievements').onclick = () => this.closeAchievementsModal();
        // Il livello fa parte del profilo, senza un secondo pulsante annidato.
        // I traguardi rimangono raggiungibili da "Traguardi" nella navbar.

        // Tour introduttivo; la scelta della streak non e' saltabile.
        document.getElementById('site-start-tour')?.addEventListener('click',()=>this.beginSiteTour());
        document.getElementById('site-skip-tour')?.addEventListener('click',()=>this.finishSiteTour());
        document.getElementById('site-tour-skip')?.addEventListener('click',()=>this.finishSiteTour());
        document.getElementById('site-tour-next')?.addEventListener('click',()=>this.advanceSiteTour());
        document.querySelectorAll('#site-goal-gate [data-goal]').forEach(el=>el.onclick=()=>this.setStreakMode(el.dataset.goal));
        window.addEventListener('resize',()=>{
            if(!document.getElementById('site-tour')?.classList.contains('hidden'))this.renderSiteTour();
        });
        // Serie Settimanale (Streak)
        document.getElementById('btn-streak-modal').onclick = () => this.openStreakModal();
        document.getElementById('btn-close-streak').onclick = () => this.closeStreakModal();

        ["rilassato", "concentrato", "lockin"].forEach(tier => {
            const el = document.getElementById(`tier-${tier}`);
            if (el) {
                el.onclick = () => this.setStreakMode(tier);
                el.addEventListener('keydown',event=>{
                    if(event.key==='Enter'||event.key===' '){
                        event.preventDefault();
                        this.setStreakMode(tier);
                    }
                });
            }
        });

        // Verifica ed Editor
        document.getElementById('btn-run-code').onclick = () => this.runAndValidate();

        document.getElementById('btn-reset-code').onclick = () => {
            SoundFX.playClick();
            const currentLesson = this.getCurrentActiveLessonOrVariant();
            if (currentLesson && confirm("Vuoi ripristinare il codice iniziale e la scena di questo esercizio?")) {
                document.getElementById('code-editor').value =
                    this.isReviewMode ? currentLesson.starterCode : currentLesson.initialCode;
                this.updateLineNumbers();
                if (!this.isReviewMode) {
                    delete this.state.userCode[this.state.currentLessonId];
                    this.saveStorage();
                }
                if (currentLesson.initialNodes && Array.isArray(currentLesson.initialNodes) && window.GDScriptRuntime) {
                    this.currentScene = GDScriptRuntime.buildScene(currentLesson);
                } else if (window.GD_Node) {
                    this.currentScene = new GD_Node("Root");
                }
                this.selectedSceneNode = null;
                this.renderSceneDock();
                this.renderViewportOverlay();
                this.resetExerciseFeedback();
                document.getElementById('test-results-view').replaceChildren();
                document.getElementById('test-status-badge').textContent = 'In attesa di verifica';
            }
        };

        // Pulsanti Riavvia Simulazione Viewport 2D
        const btnRestartViewport = document.getElementById('btn-restart-viewport');
        if (btnRestartViewport) {
            btnRestartViewport.onclick = () => {
                SoundFX.playClick();
                if (this.viewport) this.viewport.replay();
            };
        }

        // Eventi Mini Scene Dock & Modal Crea Nodo Godot
        const btnOpenAddNode = document.getElementById('btn-open-add-node-modal');
        if (btnOpenAddNode) btnOpenAddNode.onclick = () => this.openAddNodeModal();

        const btnCloseAddNode = document.getElementById('btn-close-add-node');
        if (btnCloseAddNode) btnCloseAddNode.onclick = () => this.closeAddNodeModal();

        const btnCancelAddNode = document.getElementById('btn-cancel-add-node');
        if (btnCancelAddNode) btnCancelAddNode.onclick = () => this.closeAddNodeModal();

        const btnConfirmAddNode = document.getElementById('btn-confirm-add-node');
        if (btnConfirmAddNode) btnConfirmAddNode.onclick = () => this.confirmAddNode();

        const btnRemoveSelectedNode = document.getElementById('btn-remove-selected-node');
        if (btnRemoveSelectedNode) {
            btnRemoveSelectedNode.onclick = () => {
                this.removeSceneNode(this.selectedSceneNode);
            };
        }

        // Tasto Canc o Backspace per rimuovere il nodo selezionato nella Scena
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                if (activeTag !== 'input' && activeTag !== 'textarea') {
                    if (this.selectedSceneNode && this.selectedSceneNode !== this.currentScene) {
                        e.preventDefault();
                        this.removeSceneNode(this.selectedSceneNode);
                    }
                }
            }
        });

        const nodeTypeOpts = document.querySelectorAll('.node-type-option');
        nodeTypeOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                nodeTypeOpts.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                const type = opt.getAttribute('data-node-type');
                const nameInput = document.getElementById('node-name-input');
                if (nameInput) {
                    nameInput.value = (type === 'Button' ? 'MioPulsante' : (type === 'Label' ? 'MioTesto' : (type === 'Timer' ? 'MioTimer' : (type === 'ColorRect' ? 'MiaBarra' : 'MioNodo'))));
                }
            });
        });

        const btnPracticeRestart = document.getElementById('btn-practice-restart');
        if (btnPracticeRestart) {
            btnPracticeRestart.onclick = () => {
                SoundFX.playClick();
                if (this.practiceViewport) this.practiceViewport.replay();
            };
        }

        // Impostazioni & Audio & Reset
        const btnOpenSettings = document.getElementById('btn-open-settings');
        if (btnOpenSettings) {
            btnOpenSettings.onclick = () => this.openSettingsModal();
        }

        const btnCloseSettings = document.getElementById('btn-close-settings');
        if (btnCloseSettings) {
            btnCloseSettings.onclick = () => this.closeSettingsModal();
        }
        // Chiude soltanto quando il clic e' sull'overlay, mai dentro il pannello:
        // pulsanti, toggle e conferme rimangono utilizzabili.
        const settingsOverlay=document.getElementById('settings-modal');
        if(settingsOverlay){
            settingsOverlay.addEventListener('click',event=>{
                if(event.target===settingsOverlay && !settingsOverlay.classList.contains('hidden'))
                    this.closeSettingsModal();
            });
        }

        const btnThemeDark = document.getElementById('btn-theme-dark');
        const btnThemeLight = document.getElementById('btn-theme-light');
        if (btnThemeDark) {
            btnThemeDark.onclick = () => this.setTheme('dark');
        }
        if (btnThemeLight) {
            btnThemeLight.onclick = () => this.setTheme('light');
        }

        const settingSoundEnabled = document.getElementById('setting-sound-enabled');
        if (settingSoundEnabled) {
            settingSoundEnabled.onchange = (e) => {
                SoundFX.toggle(e.target.checked);
                this.saveStorage();
            };
        }

        const settingVolumeSlider = document.getElementById('setting-volume-slider');
        const volumeLabel = document.getElementById('volume-percent-label');
        if (settingVolumeSlider) {
            settingVolumeSlider.oninput = (e) => {
                const vol = parseFloat(e.target.value) / 100;
                SoundFX.setVolume(vol);
                if (volumeLabel) volumeLabel.innerText = `${e.target.value}%`;
                SoundFX.playClick();
                this.saveStorage();
            };
        }

        const musicCheckbox = document.getElementById('setting-music-enabled');
        if (musicCheckbox) {
            musicCheckbox.onchange = (event) => {
                SoundFX.setMusicEnabled(event.target.checked);
                this.saveStorage();
            };
        }
        const musicSlider = document.getElementById('setting-music-volume-slider');
        const musicLabel = document.getElementById('music-volume-percent-label');
        if (musicSlider) {
            musicSlider.oninput = (event) => {
                const percent = Number(event.target.value);
                SoundFX.setMusicVolume(percent / 100);
                if (musicLabel) musicLabel.textContent = `${percent}%`;
                this.saveStorage();
            };
        }

        const btnStartReset = document.getElementById('btn-start-reset');
        const btnCancelReset = document.getElementById('btn-cancel-reset');
        const btnConfirmReset = document.getElementById('btn-confirm-reset');
        const resetInitialRow = document.getElementById('reset-initial-row');
        const resetConfirmBox = document.getElementById('reset-confirm-box');

        if (btnStartReset && resetInitialRow && resetConfirmBox) {
            btnStartReset.onclick = () => {
                SoundFX.playClick();
                resetInitialRow.classList.add('hidden');
                resetConfirmBox.classList.remove('hidden');
            };
        }

        if (btnCancelReset && resetInitialRow && resetConfirmBox) {
            btnCancelReset.onclick = () => {
                SoundFX.playClick();
                resetConfirmBox.classList.add('hidden');
                resetInitialRow.classList.remove('hidden');
            };
        }

        if (btnConfirmReset) {
            btnConfirmReset.onclick = () => {
                this.resetAllData();
            };
        }

        this.bindStandardHintEvents();

        // Modal di Vittoria: Avanzamento o Rimani nell'Esercizio
        document.getElementById('btn-modal-next').onclick = () => {
            SoundFX.playClick();
            document.getElementById('success-modal').classList.add('hidden');
            if (this.isReviewMode) {
                this.exitReviewMode();
                return;
            }
            const nextLesson = LESSONS_DATA[LESSONS_DATA.findIndex(l => l.id === this.state.currentLessonId) + 1];
            const nextId = nextLesson?.id;

            if (nextLesson) {
                this.openLesson(nextId);
            } else {
                SoundFX.playFanfare();
                this.showRoadmap();
            }
        };

        const stayInExercise = () => {
            SoundFX.playClick();
            document.getElementById('success-modal').classList.add('hidden');
            const nextBtnHeader = document.getElementById('btn-header-next');
            if (nextBtnHeader && !this.isReviewMode) nextBtnHeader.classList.remove('hidden');
        };

        const btnModalStay = document.getElementById('btn-modal-stay');
        if (btnModalStay) btnModalStay.onclick = stayInExercise;

        const btnModalClose = document.getElementById('btn-modal-close');
        if (btnModalClose) btnModalClose.onclick = stayInExercise;

        const btnHeaderNext = document.getElementById('btn-header-next');
        if (btnHeaderNext) {
            btnHeaderNext.onclick = () => {
                SoundFX.playClick();
                if (this.isReviewMode) return this.exitReviewMode();
                const nextLesson = LESSONS_DATA[LESSONS_DATA.findIndex(l => l.id === this.state.currentLessonId) + 1];
                const nextId = nextLesson?.id;
                if (nextLesson) {
                    this.openLesson(nextId);
                } else {
                    SoundFX.playFanfare();
                    this.showRoadmap();
                }
            };
        }

        const btnHeaderPrev = document.getElementById('btn-header-prev');
        if (btnHeaderPrev) {
            btnHeaderPrev.onclick = () => {
                SoundFX.playClick();
                if (this.isReviewMode) return this.exitReviewMode();
                const prevLesson = LESSONS_DATA[LESSONS_DATA.findIndex(l => l.id === this.state.currentLessonId) - 1];
                const prevId = prevLesson?.id;
                if (prevLesson) {
                    this.openLesson(prevId);
                } else {
                    this.showRoadmap();
                }
            };
        }

        // Pulsanti Modal Impostazioni Sviluppatore / Modalità Verifica
        const btnUnlockAll = document.getElementById('btn-settings-unlock-all');
        if (btnUnlockAll) {
            btnUnlockAll.onclick = () => {
                SoundFX.playClick();
                this.unlockAllLessons(true);
            };
        }

        const btnLockProgression = document.getElementById('btn-settings-lock-progression');
        if (btnLockProgression) {
            btnLockProgression.onclick = () => {
                SoundFX.playClick();
                this.lockToStandardProgression(true);
            };
        }
    },

    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    formatHintContent(text) {
        if (!text) return '';
        let escaped = String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // ```gdscript ... ``` or ``` ... ```
        escaped = escaped.replace(/```(?:gdscript)?\s*([\s\S]*?)```/g, (match, code) => {
            return `<pre class="hint-code-block"><code>${code.trim()}</code></pre>`;
        });

        // `inline code`
        escaped = escaped.replace(/`([^`\n]+)`/g, '<code class="hint-inline-code">$1</code>');

        // **bold**
        escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Newlines: split around pre blocks so we don't insert <br> inside <pre>
        const parts = escaped.split(/(<pre[\s\S]*?<\/pre>)/g);
        for (let i = 0; i < parts.length; i += 2) {
            parts[i] = parts[i].replace(/\n\n/g, '<div class="hint-spacer"></div>').replace(/\n/g, '<br>');
        }
        return parts.join('');
    },

    renderHintBox(lesson) {
        if (!lesson || !lesson.hints) return;
        const totalHints = lesson.hints.length;
        if (this.state.hintsRevealed === 0) {
            this.state.hintsRevealed = 1;
        }
        if (!this.state.activeHintLevel || this.state.activeHintLevel > this.state.hintsRevealed) {
            this.state.activeHintLevel = this.state.hintsRevealed;
        }

        const hintToggleText = document.getElementById('hint-toggle-text');
        if (hintToggleText) {
            hintToggleText.innerText = `Consiglio (${this.state.hintsRevealed}/${totalHints} sbloccati)`;
        }

        const navContainer = document.getElementById('hint-stepper-nav');
        if (navContainer) {
            navContainer.innerHTML = lesson.hints.map((h, idx) => {
                const lvl = (typeof h === 'object' && h.level) ? h.level : (idx + 1);
                const isUnlocked = this.state.hintsRevealed >= lvl;
                const isActive = this.state.activeHintLevel === lvl;
                const label = (typeof h === 'object' && h.label) ? h.label : (lvl === 1 ? 'Indizio' : lvl === 2 ? 'Struttura' : 'Esempio');
                const icon = (typeof h === 'object' && h.icon) ? h.icon : (lvl === 1 ? '💭' : lvl === 2 ? '🏗️' : '📝');

                if (isUnlocked) {
                    return `
                        <button type="button" class="hint-tab-btn ${isActive ? 'active' : ''}" onclick="App.selectHintLevel(${lvl})">
                            <span class="tab-icon">${icon}</span>
                            <span class="tab-label">Liv. ${lvl}: ${this.escapeHtml(label)}</span>
                        </button>
                    `;
                } else {
                    return `
                        <button type="button" class="hint-tab-btn locked" onclick="App.unlockNextHintLevel()" title="Clicca per sbloccare il livello ${lvl}">
                            <span class="tab-icon">🔒</span>
                            <span class="tab-label">Liv. ${lvl}: ${this.escapeHtml(label)}</span>
                        </button>
                    `;
                }
            }).join('');
        }

        const hintContent = document.getElementById('hint-text');
        if (hintContent) {
            const activeIdx = Math.max(0, Math.min(this.state.activeHintLevel - 1, totalHints - 1));
            const activeHint = lesson.hints[activeIdx];
            const hObj = (typeof activeHint === 'object' && activeHint !== null) ? activeHint : {
                level: activeIdx + 1,
                icon: '💡',
                label: `Livello ${activeIdx + 1}`,
                text: String(activeHint)
            };

            hintContent.innerHTML = `
                <div class="hint-level-badge level-${hObj.level}">
                    <span class="badge-icon">${hObj.icon || '💡'}</span>
                    <span class="badge-title">Livello ${hObj.level} — ${this.escapeHtml(hObj.label)}</span>
                </div>
                <div class="hint-body-formatted">
                    ${this.formatHintContent(hObj.text)}
                </div>
            `;
        }

        const nextBtn = document.getElementById('btn-next-hint');
        if (nextBtn) {
            if (this.state.hintsRevealed >= totalHints) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'inline-block';
                const nextLvl = this.state.hintsRevealed + 1;
                const nextHint = lesson.hints[nextLvl - 1];
                const nextLabel = (nextHint && nextHint.label) ? nextHint.label : `Livello ${nextLvl}`;
                nextBtn.innerText = `Sblocca Liv. ${nextLvl}: ${nextLabel} ➔`;
            }
        }
    },

    selectHintLevel(level) {
        if (level <= this.state.hintsRevealed) {
            SoundFX.playClick();
            this.state.activeHintLevel = level;
            const currentLesson = this.getCurrentActiveLessonOrVariant();
            if (currentLesson) this.renderHintBox(currentLesson);
        }
    },

    unlockNextHintLevel() {
        const currentLesson = this.getCurrentActiveLessonOrVariant();
        if (!currentLesson || !currentLesson.hints) return;
        if (this.state.hintsRevealed < currentLesson.hints.length) {
            SoundFX.playHint();
            this.state.hintsRevealed++;
            this.state.activeHintLevel = this.state.hintsRevealed;
            if (this.isReviewMode && this.currentReviewVariant) {
                if (typeof ReviewEngine !== 'undefined') {
                    ReviewEngine.recordVariantHintOpened(this.currentReviewVariant.id, this.state.hintsRevealed, this.state);
                }
            } else {
                this.recordHintOpened(this.state.currentLessonId, this.state.hintsRevealed);
            }
            this.renderHintBox(currentLesson);
            this.checkAchievements();
        }
    },

    displayHint(lesson) {
        this.renderHintBox(lesson);
    },

    bindStandardHintEvents() {
        const btnToggleHint = document.getElementById('btn-toggle-hint');
        if (btnToggleHint) {
            btnToggleHint.onclick = () => {
                const currentLesson = this.getCurrentActiveLessonOrVariant();
                if (!currentLesson) return;

                const hintBox = document.getElementById('hint-box');
                if (hintBox && hintBox.classList.contains('hidden')) {
                    SoundFX.playHint();
                    hintBox.classList.remove('hidden');
                    if (this.state.hintsRevealed === 0) {
                        this.state.hintsRevealed = 1;
                        this.state.activeHintLevel = 1;
                    }
                    if (this.isReviewMode && this.currentReviewVariant) {
                        if (typeof ReviewEngine !== 'undefined') {
                            ReviewEngine.recordVariantHintOpened(this.currentReviewVariant.id, this.state.hintsRevealed, this.state);
                        }
                    } else {
                        this.recordHintOpened(this.state.currentLessonId, this.state.hintsRevealed);
                    }
                    this.renderHintBox(currentLesson);
                    this.checkAchievements();
                } else if (hintBox) {
                    hintBox.classList.add('hidden');
                }
            };
        }

        const btnNextHint = document.getElementById('btn-next-hint');
        if (btnNextHint) {
            btnNextHint.onclick = () => {
                this.unlockNextHintLevel();
            };
        }

        const btnRevealSolution = document.getElementById('btn-reveal-solution');
        if (btnRevealSolution) {
            btnRevealSolution.onclick = () => {
                const currentLesson = this.getCurrentActiveLessonOrVariant();
                if (!currentLesson) return;
                if (confirm("Vuoi visualizzare la soluzione completa?")) {
                    SoundFX.playHint();
                    if (this.isReviewMode && this.currentReviewVariant) {
                        if (typeof ReviewEngine !== 'undefined') {
                            ReviewEngine.recordVariantHintOpened(
                                this.currentReviewVariant.id, currentLesson.hints.length, this.state);
                        }
                        this.state.hintsRevealed = currentLesson.hints.length;
                    } else {
                        this.recordHintOpened(this.state.currentLessonId, 3);
                    }
                    document.getElementById('code-editor').value = currentLesson.solution;
                    this.updateLineNumbers();
                }
            };
        }
    },

    openHintFromFeedback() {
        const currentLesson = this.getCurrentActiveLessonOrVariant();
        if (!currentLesson) return;

        if (currentLesson.isMastery) {
            const item = document.getElementById('coddy-hint-item-0');
            const text = document.getElementById('coddy-hint-text-0');
            if (text && text.classList.contains('hidden')) {
                this.toggleCoddyHint(0);
            }
            if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            const hintBox = document.getElementById('hint-box');
            if (hintBox) {
                hintBox.classList.remove('hidden');
                if (this.state.hintsRevealed === 0) {
                    this.state.hintsRevealed = 1;
                }
                this.state.activeHintLevel = 1;
                if (this.isReviewMode && this.currentReviewVariant) {
                    if (typeof ReviewEngine !== 'undefined') {
                        ReviewEngine.recordVariantHintOpened(this.currentReviewVariant.id, 1, this.state);
                    }
                } else {
                    this.recordHintOpened(this.state.currentLessonId, 1);
                }
                this.renderHintBox(currentLesson);
                this.checkAchievements();
                hintBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    },

    // ===================================================================
    // P3.3: MODALITÀ RIPASSO DIDATTICO INTELLIGENTE & VARIANTI
    // ===================================================================
    getCurrentActiveLessonOrVariant() {
        if (this.isReviewMode && this.currentReviewVariant) {
            return this.currentReviewVariant;
        }
        return (typeof LESSONS_DATA !== 'undefined') ? LESSONS_DATA.find(l => l.id === this.state.currentLessonId) : null;
    },

    async runAndValidateReviewVariant(code, runBtn) {
        const variant = this.currentReviewVariant;
        try {
            let execScene = null;
            if (variant.initialNodes && Array.isArray(variant.initialNodes) && window.GDScriptRuntime) {
                execScene = GDScriptRuntime.buildScene(variant);
            } else if (this.currentScene) {
                execScene = this.currentScene;
            }
            const result = await GDScriptRuntime.execute(code, { initialScene: execScene, lesson: variant });
            if (!this.isReviewMode || this.currentReviewVariant !== variant ||
                document.getElementById('code-editor').value !== code) return;

            const realOutputPre = document.getElementById('real-output-pre');
            if (result.logs && result.logs.length > 0) {
                realOutputPre.innerText = result.logs.join('\n');
                realOutputPre.style.color = '#38bdf8';
            } else if (result.error) {
                realOutputPre.innerText = `// Errore: ${result.error}`;
                realOutputPre.style.color = '#f87171';
            } else {
                realOutputPre.innerText = "// Nessun output stampato a console";
                realOutputPre.style.color = '#94a3b8';
            }

            const expectedOutputPre = document.getElementById('expected-output-pre');
            expectedOutputPre.textContent = variant.expectedOutput || "// Nessun output richiesto";

            const tests = await variant.validate(result, GDScriptRuntime);
            if (!this.isReviewMode || this.currentReviewVariant !== variant ||
                document.getElementById('code-editor').value !== code) return;
            const allPassed = tests.length > 0 && tests.every(t => t.passed);
            this.showExerciseFeedback(result, tests);
            this.updateDidacticDebugger(allPassed ? null : result, allPassed ? [] : tests);

            const isFirstTime = !(this.state.reviewProgress && Array.isArray(this.state.reviewProgress.completedVariants) && this.state.reviewProgress.completedVariants.includes(variant.id));

            // Registra esito del tentativo di ripasso (ReviewEngine gestisce in modo esclusivo daily_activity e telemetria varianti)
            if (typeof ReviewEngine !== 'undefined') {
                ReviewEngine.recordVariantAttempt(variant.id, allPassed, this.state.hintsRevealed, this.state);
            }

            const resultsContainer = document.getElementById('test-results-view');
            resultsContainer.innerHTML = '';

            tests.forEach(test => {
                const row = document.createElement('div');
                row.className = `test-row ${test.passed ? 'passed' : 'failed'}`;
                row.innerHTML = `
                    <div class="test-icon">${test.passed ? '<svg class="ui-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg class="ui-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}</div>
                    <div class="test-info"><div class="test-desc"></div></div>
                `;
                row.querySelector('.test-desc').textContent = String(test.desc ?? '');
                if (test.diff !== undefined && test.diff !== null && test.diff !== '') {
                    const diffEl = document.createElement('div');
                    diffEl.className = 'test-diff';
                    diffEl.textContent = String(test.diff);
                    row.querySelector('.test-info').appendChild(diffEl);
                }
                resultsContainer.appendChild(row);
            });

            const badge = document.getElementById('test-status-badge');
            if (allPassed) {
                badge.innerText = `✓ Superato (${tests.length}/${tests.length})`;
                badge.style.color = '#10b981';

                let gainXp = 0;
                if (isFirstTime) {
                    if (!this.state.reviewProgress.completedVariants.includes(variant.id)) {
                        this.state.reviewProgress.completedVariants.push(variant.id);
                    }
                    gainXp = 15;
                } else {
                    this.state.rewardsV2 = ProgressionV2.normalizeRewards(this.state.rewardsV2,this.state.xp);
                    const firstSuccess = this.state.reviewProgress.variantHistory?.[variant.id]?.first_success_at;
                    // La ripetizione premia solo a partire da una settimana diversa
                    // da quella in cui è stata completata la variante per la prima volta.
                    const firstWeek = firstSuccess ? this.getWeekId(new Date(firstSuccess)) : null;
                    if (firstWeek !== this.getWeekId()) {
                        gainXp = ProgressionV2.grantRecurring(this.state.rewardsV2,'reviews',
                            'variant:'+variant.id,5);
                    }
                }
                this.state.xp += gainXp;
                this.recordDailyQuestProgress('review_success',1);
                this.saveStorage();
                this.updateStatsUI({ announceLevelUp: gainXp > 0 });
                this.checkAchievements({ fromAction: true });
                SoundFX.playSuccess();
                ConfettiFX.burst();

                // Modale di vittoria per ripasso
                const modalTitle = document.getElementById('modal-success-title');
                const modalSubtitle = document.getElementById('modal-success-subtitle');
                if (modalTitle) modalTitle.innerText = "⭐ VARIANTE DI RIPASSO SUPERATA!";
                if (modalSubtitle) {
                    modalSubtitle.innerText = isFirstTime
                        ? "Ottimo lavoro! Hai rafforzato questo concetto e ottenuto +15 XP!"
                        : (gainXp ? "Ottimo lavoro! Hai ricevuto +5 XP per il ripasso settimanale." :
                            "Ripasso superato! Il premio settimanale per questa variante è già stato ottenuto oppure hai raggiunto il limite.");
                }
                this.setSuccessModalReward(gainXp);

                setTimeout(() => {
                    document.getElementById('success-modal').classList.remove('hidden');
                }, 300);
            } else {
                badge.innerText = `✗ Fallito (${tests.filter(t => t.passed).length}/${tests.length})`;
                badge.style.color = '#ef4444';
                SoundFX.playError();

                const firstFailedTest = tests.find(t => !t.passed);
                const mockReviewLesson = {
                    id: 9999,
                    title: variant.title,
                    conceptId: variant.conceptId,
                    hints: variant.hints
                };
                const feedbackCard = this.buildContextualFeedback(result, mockReviewLesson, firstFailedTest, tests, code);
                if (feedbackCard) {
                    resultsContainer.appendChild(feedbackCard);
                }
            }

        } catch (err) {
            if (this.currentReviewVariant === variant &&
                document.getElementById('code-editor')?.value === code)
                this.updateDidacticDebugger({error:String(err.message || err)}, []);
            console.error("Errore verifica variante ripasso:", err);
            SoundFX.playError();
        } finally {
            runBtn.style.opacity = '1';
            runBtn.querySelector('.run-text').innerText = "Verifica Codice";
            this.isValidating = false;
        }
    },

    updateReviewIndicators() {
        if (typeof ReviewEngine === 'undefined') return;
        const recommended = ReviewEngine.getRecommendedConcepts(this.state);
        const count = recommended.length;

        // Badge pulsante nav
        const badge = document.getElementById('review-pending-badge');
        if (badge) {
            badge.innerText = count;
            if (count > 0) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }

        // Callout su Roadmap
        const callout = document.getElementById('roadmap-review-callout');
        if (callout) {
            if (count > 0 && !this.state.sessionDismissedReviewCallout) {
                callout.classList.remove('hidden');
                const textEl = document.getElementById('roadmap-review-text');
                if (textEl) {
                    textEl.innerText = count === 1
                        ? `Hai 1 argomento consigliato (${recommended[0].concept.name}) per consolidare le tue competenze.`
                        : `Hai ${count} argomenti consigliati per consolidare le tue competenze.`;
                }
            } else {
                callout.classList.add('hidden');
            }
        }
    },

    dismissRoadmapReviewCallout() {
        SoundFX.playClick();
        this.state.sessionDismissedReviewCallout = true;
        const callout = document.getElementById('roadmap-review-callout');
        if (callout) callout.classList.add('hidden');
    },

    showReviewView() {
        SoundFX.playClick();
        this.hideAutocomplete();
        this.isReviewMode = false;
        this.currentReviewVariant = null;

        this.switchView('view-review');

        this.updateNavSelection('review');
        this.renderReviewView();
    },

    openReviewView() {
        this.showReviewView();
    },

    setReviewTab(tab) {
        SoundFX.playClick();
        this.state.currentReviewTab = tab;
        this.saveNavigationPosition();
        const btnRec = document.getElementById('tab-review-recommended');
        const btnAll = document.getElementById('tab-review-all');
        const paneRec = document.getElementById('review-content-recommended');
        const paneAll = document.getElementById('review-content-all');

        if (tab === 'recommended') {
            if (btnRec) btnRec.classList.add('active');
            if (btnAll) btnAll.classList.remove('active');
            if (paneRec) paneRec.classList.remove('hidden');
            if (paneAll) paneAll.classList.add('hidden');
        } else {
            if (btnRec) btnRec.classList.remove('active');
            if (btnAll) btnAll.classList.add('active');
            if (paneRec) paneRec.classList.add('hidden');
            if (paneAll) paneAll.classList.remove('hidden');
        }
    },

    renderReviewView() {
        if (typeof ReviewEngine === 'undefined') return;
        this.updateReviewIndicators();

        const recommended = ReviewEngine.getRecommendedConcepts(this.state);
        const allConcepts = ReviewEngine.getAllConceptsWithStatus(this.state);
        const completedVariantsCount = (this.state.reviewProgress?.completedVariants || []).length;
        const consolidatedCount = allConcepts.filter(c => c.status === 'consolidato').length;

        // Badge schede
        const badgeRec = document.getElementById('badge-recommended-count');
        if (badgeRec) badgeRec.innerText = recommended.length;
        const badgeAll = document.getElementById('badge-all-concepts-count');
        if (badgeAll) badgeAll.innerText = allConcepts.length;

        const improvingCount = allConcepts.filter(c => c.status === 'in_miglioramento').length;
        const toReviewCount = allConcepts.filter(c => c.status === 'da_ripassare').length;

        // Statistiche in testata
        const statsSummary = document.getElementById('review-stats-summary');
        if (statsSummary) {
            statsSummary.innerHTML = `
                <div class="review-stat-pill">
                    <span class="stat-num">${consolidatedCount} / ${allConcepts.length}</span>
                    <span class="stat-label">Argomenti Consolidati</span>
                </div>
                <div class="review-stat-pill ${improvingCount > 0 ? 'improving' : ''}">
                    <span class="stat-num">${improvingCount}</span>
                    <span class="stat-label">In Miglioramento</span>
                </div>
                <div class="review-stat-pill ${toReviewCount > 0 ? 'alert' : ''}">
                    <span class="stat-num">${toReviewCount}</span>
                    <span class="stat-label">Da Ripassare</span>
                </div>
                <div class="review-stat-pill">
                    <span class="stat-num">${completedVariantsCount}</span>
                    <span class="stat-label">Varianti Completate</span>
                </div>
            `;
        }

        // Renderizza Lista Consigliati
        const recList = document.getElementById('review-recommended-list');
        if (recList) {
            recList.innerHTML = '';
            if (recommended.length === 0) {
                recList.innerHTML = `
                    <div class="review-empty-state">
                        <div class="empty-icon"><svg class="ui-icon ui-icon-lg" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                        <h3>Ottimo lavoro! Nessun argomento urgente da ripassare.</h3>
                        <p>Tutti gli argomenti affrontati sono stati completati senza attrito significativo o sono già stati consolidati.</p>
                        <button type="button" class="btn-primary btn-sm" onclick="App.setReviewTab('all')">Esplora Tutti gli Argomenti</button>
                    </div>
                `;
            } else {
                recommended.forEach(item => {
                    recList.appendChild(this.buildConceptReviewCard(item));
                });
            }
        }

        // Renderizza Lista Tutti gli Argomenti
        const allList = document.getElementById('review-all-list');
        if (allList) {
            allList.innerHTML = '';
            allConcepts.forEach(item => {
                allList.appendChild(this.buildConceptReviewCard(item));
            });
        }
    },

    buildConceptReviewCard(item) {
        const card = document.createElement('div');
        card.className = `review-concept-card status-${item.status}`;

        const concept = item.concept;
        const variants = item.variants || [];
        const completedVariants = (this.state.reviewProgress?.completedVariants || []);

        const variantsHtml = variants.length > 0 ? variants.map(v => {
            const isDone = completedVariants.includes(v.id);
            return `
                <div class="variant-item ${isDone ? 'done' : ''}">
                    <div class="variant-left">
                        <span class="variant-icon">${isDone ? '<svg class="ui-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>'}</span>
                        <div class="variant-info">
                            <span class="variant-title">${this.escapeHtml(v.title)}</span>
                            <span class="variant-scenario">${this.escapeHtml(v.scenario)}</span>
                        </div>
                    </div>
                    <button type="button" class="btn-start-variant ${isDone ? 'btn-subtle' : 'btn-primary'}" onclick="App.openReviewVariant('${v.id}')">
                        ${isDone ? 'Ripeti (+0 XP)' : 'Inizia (+10 XP)'}
                    </button>
                </div>
            `;
        }).join('') : `<p class="no-variants-text">Nuove varianti in arrivo per questo argomento.</p>`;

        card.innerHTML = `
            <div class="review-card-header">
                <div class="review-header-left">
                    <span class="review-badge ${item.badgeClass}">${this.escapeHtml(item.badgeText || item.status.toUpperCase())}</span>
                    <span class="review-chapter-tag">Capitolo ${concept.chapterId}</span>
                </div>
            </div>
            <h3 class="review-card-title">${this.escapeHtml(concept.name)}</h3>
            <p class="review-card-desc">${this.escapeHtml(concept.desc)}</p>
            <div class="review-card-reason">
                <span class="reason-icon"><svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span>
                <span class="reason-text">${this.escapeHtml(item.reason)}</span>
            </div>
            <div class="review-variants-container">
                <div class="variants-heading">Varianti di Pratica (${variants.filter(v => completedVariants.includes(v.id)).length}/${variants.length} completate):</div>
                ${variantsHtml}
            </div>
        `;

        return card;
    },

    openReviewVariant(variantId) {
        if (typeof REVIEW_VARIANTS === 'undefined') return;
        const variant = REVIEW_VARIANTS.find(v => v.id === variantId);
        if (!variant) return;

        SoundFX.playClick();
        this.isReviewMode = true;
        this.currentReviewVariant = variant;

        // Passaggio pulito anche da una sfida speciale del corso.
        this.hideAutocomplete();
        this.switchView('view-exercise');
        this.updateNavSelection('review');
        this.setMobileExerciseTab('instructions', false);
        const backButton = document.getElementById('btn-back-to-roadmap');
        if (backButton) backButton.textContent = '← Torna alla Palestra';
        for (const id of ['btn-header-next', 'btn-header-prev'])
            document.getElementById(id)?.classList.add('hidden');

        // Mostra il banner della modalità ripasso
        const revBanner = document.getElementById('review-exercise-banner');
        if (revBanner) {
            revBanner.classList.remove('hidden');
            const conceptMeta = (typeof CONCEPTS_CATALOG !== 'undefined') ? CONCEPTS_CATALOG[variant.conceptId] : null;
            const conceptEl = document.getElementById('review-banner-concept-name');
            if (conceptEl) conceptEl.innerText = conceptMeta ? `${conceptMeta.name} — ${variant.title}` : variant.title;
        }

        // Il layout precedente potrebbe essere una sfida di padronanza, senza
        // #lesson-title/#lesson-task: ricrea SEMPRE il pannello della variante.
        const lessonContent = document.querySelector('#view-exercise .lesson-content');
        lessonContent.innerHTML = `
            <div class="lesson-header-row">
                <h2 id="lesson-title">${this.escapeHtml(variant.title)}</h2>
            </div>
            <div id="lesson-theory" class="theory-body">
                <div class="review-scenario-box">
                    <span class="scenario-badge">SCENARIO ALTERNATIVO</span>
                    <p>${this.escapeHtml(variant.scenario)}</p>
                </div>
            </div>
            <div class="task-box">
                <div class="task-header">
                    <span class="target-icon" aria-hidden="true">◎</span>
                    <h3>Il Tuo Obiettivo di Ripasso:</h3>
                </div>
                <div id="lesson-task" class="task-body">${variant.task}</div>
            </div>
            <div class="hints-section">
                <div class="hints-toggle-btn" id="btn-toggle-hint">
                    <span class="hint-icon">💡</span>
                    <span id="hint-toggle-text">Ti serve un consiglio? (0/${variant.hints.length} sbloccati)</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="hint-box hidden" id="hint-box">
                    <div id="hint-stepper-nav" class="hint-stepper-nav"></div>
                    <div class="hint-content" id="hint-text">Leggi attentamente il compito.</div>
                    <div class="hint-actions">
                        <button type="button" class="btn-subtle" id="btn-next-hint">Altro Consiglio ➔</button>
                        <button type="button" class="btn-danger-subtle" id="btn-reveal-solution">Mostra Soluzione Completa</button>
                    </div>
                </div>
            </div>
            <button type="button" class="btn-mobile-to-code" id="btn-mobile-to-code"
                onclick="App.setMobileExerciseTab('code')">Vai all'Editor di Codice ➔</button>
        `;
        this.bindStandardHintEvents();

        const xpBadge = document.getElementById('lesson-xp-badge');
        const isDone = this.state.reviewProgress?.completedVariants?.includes(variant.id);
        if (xpBadge) {
            xpBadge.innerText = isDone ? "Già Completato (+0 XP)" : `+${variant.xpReward} XP Ripasso`;
            xpBadge.style.background = isDone ? 'rgba(148, 163, 184, 0.2)' : 'rgba(16, 185, 129, 0.2)';
            xpBadge.style.color = isDone ? '#94a3b8' : '#34d399';
        }

        // Reimposta i suggerimenti per la variante
        this.state.hintsRevealed = 0;
        this.state.activeHintLevel = 1;
        const hintBox = document.getElementById('hint-box');
        if (hintBox) hintBox.classList.add('hidden');
        const hintToggleText = document.getElementById('hint-toggle-text');
        if (hintToggleText) hintToggleText.innerText = `Ti serve un consiglio? (0/${variant.hints.length} sbloccati)`;

        // Inizializza l'editor con il codice iniziale della variante (MAI il codice precedente dello studente!)
        const editor = document.getElementById('code-editor');
        editor.value = variant.starterCode;
        this.updateLineNumbers();
        this.mountCodeGuide(variant, editor.value);
        this.saveReviewDraft();

        // Resetta console e test results
        document.getElementById('real-output-pre').innerText = "// Clicca su 'Verifica Codice' per eseguire lo script della variante";
        document.getElementById('real-output-pre').style.color = '#94a3b8';
        document.getElementById('expected-output-pre').textContent = variant.expectedOutput || "// Nessun output richiesto";
        document.getElementById('test-results-view').innerHTML = '';
        const badge = document.getElementById('test-status-badge');
        badge.innerText = "In attesa di verifica";
        badge.style.color = '#94a3b8';
        this.resetExerciseFeedback();

        // Configura scena e strumenti contestuali per la variante (Scene Tree se richiesto)
        if (variant.initialNodes && Array.isArray(variant.initialNodes) && window.GDScriptRuntime) {
            this.currentScene = GDScriptRuntime.buildScene(variant);
        } else if (window.GD_Node) {
            this.currentScene = new GD_Node("Root");
        }
        this.renderSceneDock();
        this.renderViewportOverlay();
        this.updateExerciseToolsVisibility(variant);
    },

    exitReviewMode() {
        SoundFX.playClick();
        this.isReviewMode = false;
        this.currentReviewVariant = null;
        const revBanner = document.getElementById('review-exercise-banner');
        if (revBanner) revBanner.classList.add('hidden');
        this.showReviewView();
    },

    // =============================================================
    // P3.4: STATISTICHE DI APPRENDIMENTO & CRUSCOTTO DIDATTICO
    // =============================================================
    showStatsView() {
        SoundFX.playClick();
        this.hideAutocomplete();
        this.switchView('view-stats');
        this.updateNavSelection('stats');
        this.renderStatsView();
    },

    renderStatsView() {
        if (typeof StatsEngine === 'undefined') return;

        const report = StatsEngine.getCompleteLearningReport(this.state);
        this.renderAutonomySection(report.courseAutonomy);
        this.renderFrictionSection(report.errorBreakdown, report.conceptsSummary);
        this.renderEvolutionSection(report.reviewStats, report.chronologicalProgress);
    },

    renderAutonomySection(autonomy) {
        const container = document.getElementById('stats-autonomy-content');
        if (!container) return;

        const autonomyRateDisplay = autonomy.autonomyRate !== null
            ? `${autonomy.autonomyRate}%`
            : 'N/D';
        const avgAttemptsDisplay = autonomy.avgAttemptsPerTrackedLesson !== null
            ? `${autonomy.avgAttemptsPerTrackedLesson}`
            : 'N/D';

        let legacyNoticeHtml = '';
        if (autonomy.hasLegacyData) {
            legacyNoticeHtml = `
                <div class="stats-legacy-callout">
                    <div class="callout-icon">
                        <svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <div class="callout-body">
                        <strong>Nota di Trasparenza sui Dati:</strong>
                        <p>${autonomy.legacyCount} lezioni sono state completate con una versione precedente all'introduzione della telemetria didattica dettagliata. Per queste lezioni lo storico iniziale di suggerimenti ed errori non è disponibile e <em>non viene inventato retroattivamente</em>. Le metriche di autonomia e i tentativi medi sono calcolati esclusivamente sulle <strong>${autonomy.trackedCount} lezioni tracciate</strong> con telemetria attiva.</p>
                    </div>
                </div>
            `;
        }

        const autoPct = autonomy.completedLessons > 0 ? ((autonomy.autonomousCount / autonomy.completedLessons) * 100).toFixed(1) : '0';
        const assistPct = autonomy.completedLessons > 0 ? ((autonomy.assistedCount / autonomy.completedLessons) * 100).toFixed(1) : '0';
        const legacyPct = autonomy.completedLessons > 0 ? ((autonomy.legacyCount / autonomy.completedLessons) * 100).toFixed(1) : '0';

        container.innerHTML = `
            <div class="stats-kpi-grid">
                <div class="stats-kpi-card">
                    <div class="kpi-top">
                        <span class="kpi-label">Lezioni Completate</span>
                        <span class="kpi-icon"><svg class="ui-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>
                    </div>
                    <div class="kpi-val">${autonomy.completedLessons} <span class="kpi-total">/ ${autonomy.totalLessons}</span></div>
                    <div class="kpi-progress-bar">
                        <div class="kpi-progress-fill" style="width: ${autonomy.courseProgressPercent}%;"></div>
                    </div>
                    <div class="kpi-subtext">${autonomy.courseProgressPercent}% del percorso completato</div>
                </div>

                <div class="stats-kpi-card highlight-autonomy">
                    <div class="kpi-top">
                        <span class="kpi-label">Indice di Autonomia</span>
                        <span class="kpi-icon"><svg class="ui-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                    </div>
                    <div class="kpi-val">${autonomyRateDisplay}</div>
                    <div class="kpi-subtext">
                        ${autonomy.trackedCount > 0 
                            ? `<strong>${autonomy.autonomousCount}</strong> su ${autonomy.trackedCount} lezioni tracciate superate senza indizi`
                            : 'Nessuna lezione tracciata con telemetria attiva'}
                    </div>
                </div>

                <div class="stats-kpi-card">
                    <div class="kpi-top">
                        <span class="kpi-label">Superate al 1° Colpo</span>
                        <span class="kpi-icon"><svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg></span>
                    </div>
                    <div class="kpi-val">${autonomy.cleanFirstTryCount}</div>
                    <div class="kpi-subtext">Zero errori e zero indizi utilizzati al primo tentativo</div>
                </div>

                <div class="stats-kpi-card">
                    <div class="kpi-top">
                        <span class="kpi-label">Tentativi Medi / Lezione</span>
                        <span class="kpi-icon"><svg class="ui-icon" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
                    </div>
                    <div class="kpi-val">${avgAttemptsDisplay}</div>
                    <div class="kpi-subtext">${autonomy.totalVerifications} verifiche totali registrate</div>
                </div>
            </div>

            <!-- Ripartizione Qualitativa Dettagliata -->
            <div class="stats-autonomy-breakdown-card">
                <div class="breakdown-header">
                    <span class="breakdown-title">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                        Ripartizione Qualitativa dei Completamenti
                    </span>
                    <span class="breakdown-subtitle">${autonomy.completedLessons} lezioni completate su ${autonomy.totalLessons} totali</span>
                </div>
                <div class="multi-progress-bar">
                    <div class="multi-segment seg-autonomous" style="width: ${autoPct}%;" title="In Piena Autonomia: ${autonomy.autonomousCount} (${autoPct}%)"></div>
                    <div class="multi-segment seg-assisted" style="width: ${assistPct}%;" title="Con Supporto / Indizi: ${autonomy.assistedCount} (${assistPct}%)"></div>
                    ${autonomy.hasLegacyData ? `<div class="multi-segment seg-legacy" style="width: ${legacyPct}%;" title="Legacy pre-P3: ${autonomy.legacyCount} (${legacyPct}%)"></div>` : ''}
                </div>
                <div class="breakdown-legend">
                    <div class="legend-item">
                        <span class="legend-dot seg-autonomous"></span>
                        <span class="legend-text">In Piena Autonomia (0 indizi): <strong>${autonomy.autonomousCount}</strong> (${autonomy.trackedCount > 0 ? autonomy.autonomyRate + '%' : '0%'})</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-dot seg-assisted"></span>
                        <span class="legend-text">Con Supporto Didattico (1–3 indizi): <strong>${autonomy.assistedCount}</strong> (${autonomy.trackedCount > 0 ? (autonomy.assistedRate || 0) + '%' : '0%'})</span>
                    </div>
                    ${autonomy.hasLegacyData ? `
                    <div class="legend-item">
                        <span class="legend-dot seg-legacy"></span>
                        <span class="legend-text">Pre-P3 (Storico indizi non tracciato): <strong>${autonomy.legacyCount}</strong></span>
                    </div>
                    ` : ''}
                </div>
            </div>

            ${legacyNoticeHtml}
        `;
    },

    renderFrictionSection(errorBreakdown, conceptsSummary) {
        const container = document.getElementById('stats-friction-content');
        if (!container) return;

        const { counts, percentages, studentTotal, pedagogicalInsight } = errorBreakdown;

        const daRip = conceptsSummary.daRipassare || [];
        const inMiglioramento = conceptsSummary.inMiglioramento || [];
        const consolidati = conceptsSummary.consolidati || [];

        let daRipHtml = '';
        if (daRip.length > 0) {
            daRipHtml = `
                <div class="stats-concept-group">
                    <div class="stats-group-title danger">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>Da Ripassare (${daRip.length})</span>
                    </div>
                    <div class="stats-concepts-grid">
                        ${daRip.map(item => `
                            <div class="stats-concept-item status-da_ripassare">
                                <div class="item-top">
                                    <span class="item-badge badge-recommended">${this.escapeHtml(item.badgeText || 'DA RIPASSARE')}</span>
                                    <span class="item-chapter">Capitolo ${item.concept.chapterId}</span>
                                </div>
                                <h4 class="item-title">${this.escapeHtml(item.concept.name)}</h4>
                                <p class="item-reason">${this.escapeHtml(item.reason)}</p>
                                <button type="button" class="btn-concept-action" onclick="App.showReviewView()">Ripassa Ora</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            daRipHtml = `
                <div class="stats-concept-group">
                    <div class="stats-empty-state ok">
                        <svg class="ui-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <div>
                            <strong>Nessun argomento urgente da ripassare!</strong>
                            <p>Non sono stati riscontrati attriti significativi irrisolti nel percorso.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        let inMigHtml = '';
        if (inMiglioramento.length > 0) {
            inMigHtml = `
                <div class="stats-concept-group">
                    <div class="stats-group-title warning">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        <span>In Miglioramento (${inMiglioramento.length})</span>
                    </div>
                    <div class="stats-concepts-grid">
                        ${inMiglioramento.map(item => `
                            <div class="stats-concept-item status-in_miglioramento">
                                <div class="item-top">
                                    <span class="item-badge badge-improving">${this.escapeHtml(item.badgeText || 'IN MIGLIORAMENTO')}</span>
                                    <span class="item-chapter">Capitolo ${item.concept.chapterId}</span>
                                </div>
                                <h4 class="item-title">${this.escapeHtml(item.concept.name)}</h4>
                                <p class="item-reason">${this.escapeHtml(item.reason)}</p>
                                <button type="button" class="btn-concept-action secondary" onclick="App.showReviewView()">Pratica</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        let consHtml = '';
        if (consolidati.length > 0) {
            consHtml = `
                <div class="stats-concept-group">
                    <div class="stats-group-title success">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>Consolidati (${consolidati.length})</span>
                    </div>
                    <div class="stats-concepts-grid">
                        ${consolidati.map(item => `
                            <div class="stats-concept-item status-consolidato">
                                <div class="item-top">
                                    <span class="item-badge badge-consolidated">${this.escapeHtml(item.badgeText || 'CONSOLIDATO')}</span>
                                    <span class="item-chapter">Capitolo ${item.concept.chapterId}</span>
                                </div>
                                <h4 class="item-title">${this.escapeHtml(item.concept.name)}</h4>
                                <p class="item-reason">${this.escapeHtml(item.reason)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="stats-friction-layout">
                <!-- Ripartizione Categorie di Errore -->
                <div class="stats-subpanel">
                    <h4 class="subpanel-title">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        Distribuzione Errori di Verifica (${studentTotal} totali)
                    </h4>
                    
                    <div class="stats-bars-container">
                        <div class="stats-bar-row">
                            <div class="bar-label-group">
                                <span class="bar-label">Logica / Requisiti Esercizio</span>
                                <span class="bar-value">${counts.requirement} (${percentages.requirement}%)</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill requirement" style="width: ${percentages.requirement}%;"></div>
                            </div>
                        </div>

                        <div class="stats-bar-row">
                            <div class="bar-label-group">
                                <span class="bar-label">Sintassi GDScript</span>
                                <span class="bar-value">${counts.syntax} (${percentages.syntax}%)</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill syntax" style="width: ${percentages.syntax}%;"></div>
                            </div>
                        </div>

                        <div class="stats-bar-row">
                            <div class="bar-label-group">
                                <span class="bar-label">Eccezioni Runtime &amp; Nodi</span>
                                <span class="bar-value">${counts.runtime} (${percentages.runtime}%)</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill runtime" style="width: ${percentages.runtime}%;"></div>
                            </div>
                        </div>

                        <div class="stats-bar-row">
                            <div class="bar-label-group">
                                <span class="bar-label">Timeout &amp; Cicli Infiniti</span>
                                <span class="bar-value">${counts.timeout} (${percentages.timeout}%)</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill timeout" style="width: ${percentages.timeout}%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-insight-card">
                        <div class="insight-badge">INTERPRETAZIONE DIDATTICA</div>
                        <p class="insight-text">${this.escapeHtml(pedagogicalInsight)}</p>
                        <div class="insight-footer-note">
                            <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            Eventuali limiti o anomalie del simulatore web sono filtrati e non gravano sullo studente.
                        </div>
                    </div>
                </div>

                <!-- Mappa di Consolidamento Argomenti -->
                <div class="stats-subpanel">
                    <h4 class="subpanel-title">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        Mappa dei 15 Concetti Didattici
                    </h4>
                    <div class="stats-concepts-status-container">
                        ${daRipHtml}
                        ${inMigHtml}
                        ${consHtml}
                    </div>
                </div>
            </div>
        `;
    },

    renderEvolutionSection(reviewStats, chronologicalProgress) {
        const container = document.getElementById('stats-evolution-content');
        if (!container) return;

        let trendHtml = '';
        if (chronologicalProgress.trendAvailable) {
            trendHtml = `
                <div class="stats-timeline-container">
                    <div class="timeline-header-row">
                        <span class="timeline-status-badge">CRONOLOGIA ATTIVA</span>
                        <span class="timeline-count-text">${this.escapeHtml(chronologicalProgress.reason)}</span>
                    </div>
                    <div class="stats-table-wrapper">
                        <table class="stats-timeline-table">
                            <thead>
                                <tr>
                                    <th>Data Sessione</th>
                                    <th>Avanzamento Corso</th>
                                    <th>In Autonomia</th>
                                    <th>Con Supporto</th>
                                    <th>Varianti Ripasso</th>
                                    <th>Verifiche Registrate</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${chronologicalProgress.dailySeries.map(row => `
                                    <tr>
                                        <td class="date-cell"><strong>${this.escapeHtml(row.date)}</strong></td>
                                        <td>${row.lessonsCompleted}</td>
                                        <td><span class="tag-autonomous">${row.autonomousSuccesses}</span></td>
                                        <td><span class="tag-assisted">${row.assistedSuccesses}</span></td>
                                        <td>${row.reviewCompleted}</td>
                                        <td>${row.isVerificationsTracked ? `<strong>${row.verifications}</strong>` : '<span class="tag-untracked" title="Verifiche non aggregate per questa data storica">—</span>'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="stats-table-footnote">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        <span><strong>Integrità Cronologica:</strong> la colonna <em>Verifiche Registrate</em> riporta i tentativi certi registrati nel contatore di sessione attivo. Per le sessioni storiche prive di contatore aggregato, i tentativi non vengono stimati a posteriori e sono contrassegnati con <em>—</em>.</span>
                    </div>
                </div>
            `;
        } else {
            trendHtml = `
                <div class="stats-notice-box">
                    <div class="notice-icon">
                        <svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div class="notice-body">
                        <h4>Andamento Temporale in Corso di Raccolta</h4>
                        <p>${this.escapeHtml(chronologicalProgress.reason)}</p>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="stats-evolution-grid">
                <!-- Card Pratica Ripasso -->
                <div class="stats-subpanel">
                    <h4 class="subpanel-title">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                        Pratica nella Palestra di Ripasso
                    </h4>
                    <div class="review-kpi-summary-row">
                        <div class="review-kpi-box">
                            <span class="rk-val">${reviewStats.completedCount} / ${reviewStats.totalVariants}</span>
                            <span class="rk-label">Varianti Completate</span>
                        </div>
                        <div class="review-kpi-box highlight-green">
                            <span class="rk-val">${reviewStats.cleanAutonomousCount}</span>
                            <span class="rk-label">In Piena Autonomia (0 aiuti)</span>
                        </div>
                        <div class="review-kpi-box">
                            <span class="rk-val">${reviewStats.assistedCount}</span>
                            <span class="rk-label">Con Supporto / Errori</span>
                        </div>
                        <div class="review-kpi-box">
                            <span class="rk-val">${reviewStats.totalReviewAttempts}</span>
                            <span class="rk-label">Verifiche nel Ripasso</span>
                        </div>
                    </div>
                    <div class="review-cta-row">
                        <button type="button" class="btn-review-cta" onclick="App.showReviewView()">
                            <span class="icon"><svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg></span>
                            <span>Apri Palestra di Ripasso</span>
                        </button>
                    </div>
                </div>

                <!-- Andamento Cronologico Reale -->
                <div class="stats-subpanel">
                    <h4 class="subpanel-title">
                        <svg class="ui-icon ui-icon-xs" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        Evoluzione Temporale delle Sessioni
                    </h4>
                    ${trendHtml}
                </div>
            </div>
        `;
    },

    buildContextualFeedback(result, currentLesson, failedTest, allTests, code = '') {
        const card = document.createElement('div');
        card.className = 'didactic-feedback-card';

        if (!code && typeof document !== 'undefined') {
            const ed = document.getElementById('code-editor');
            if (ed) code = ed.value || '';
        }

        // Diagnostica avanzata P3.2
        let diag = null;
        if (!result?.nativeStatus && typeof GDScriptDiagnostic !== 'undefined') {
            diag = GDScriptDiagnostic.analyze(code, result, failedTest, currentLesson);
        }

        let badgeText = "LOGICA / REQUISITO";
        let badgeClass = "badge-requirement";
        let title = "Verifica Didattica: Requisito Non Soddisfatto";
        let lineInfoHtml = "";
        let whyHtml = "Il codice è stato eseguito, ma il risultato o lo stato generato non corrisponde a quanto richiesto dalla traccia.";
        let nextStepHtml = "Rileggi l'obiettivo dell'esercizio per assicurarti di aver rispettato tutti i punti richiesti.";
        let techHtml = "";
        let headerIconSvg = '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

        if (diag) {
            badgeText = diag.badgeText || badgeText;
            badgeClass = diag.badgeClass || badgeClass;
            title = diag.title || title;
            whyHtml = diag.why || whyHtml;
            nextStepHtml = diag.nextStep || nextStepHtml;

            if (diag.line) {
                if (diag.isHeuristic) {
                    lineInfoHtml = `<span class="diag-pos heuristic">Posizione approssimativa: Riga ${diag.line} (stima euristica)</span>`;
                } else {
                    lineInfoHtml = `<span class="diag-pos exact">Riga ${diag.line}</span>`;
                }
            }

            if (diag.techDetails) {
                techHtml = `<div class="didactic-tech-err"><code>${this.escapeHtml(diag.techDetails)}</code></div>`;
            }

            if (diag.category === 'transpiler_limitation') {
                headerIconSvg = '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
            } else if (diag.category === 'syntax') {
                headerIconSvg = '<svg class="ui-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
            } else if (diag.category === 'runtime' || diag.category === 'timeout') {
                headerIconSvg = '<svg class="ui-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
            }
        } else {
            // Fallback legacy se GDScriptDiagnostic non è presente
            if (result && result.error) {
                const errStr = String(result.error);
                badgeText = "ERRORE SINTASSI / RUNTIME";
                badgeClass = "badge-runtime";
                title = "Errore durante l'esecuzione";
                whyHtml = result?.nativeStatus
                    ? "Il motore Godot non è riuscito a eseguire lo script."
                    : "Lo script si è interrotto in modo anomalo durante l'esecuzione.";
                nextStepHtml = "Esamina il messaggio tecnico e verifica le istruzioni digitate.";
                techHtml = `<div class="didactic-tech-err"><code>${this.escapeHtml(errStr)}</code></div>`;
            } else if (failedTest && failedTest.desc) {
                whyHtml = `Il requisito non ancora soddisfatto è: <strong>${this.escapeHtml(failedTest.desc)}</strong>.`;
                if (failedTest.diff) {
                    techHtml = `<div class="didactic-tech-err"><code>${this.escapeHtml(failedTest.diff)}</code></div>`;
                }
            }
        }

        const debugHtml = (currentLesson && currentLesson.isDebugging) ? `
            <div class="didactic-debug-badge">
                <span class="debug-badge-icon"><svg class="ui-icon" viewBox="0 0 24 24"><rect width="8" height="14" x="8" y="5" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1 1"/><path d="m14 4-1 1"/></svg></span>
                <span><strong>Focus Debugging:</strong> ${this.escapeHtml(currentLesson.debugType || 'Correzione bug')} — In questo esercizio c'è un bug inserito intenzionalmente nel codice di partenza. Esaminalo riga per riga per identificare e risolvere la causa.</span>
            </div>
        ` : '';

        card.innerHTML = `
            <div class="didactic-card-header">
                <div class="didactic-header-left">
                    <span class="didactic-card-icon">${headerIconSvg}</span>
                    <span class="diag-badge ${badgeClass}">${this.escapeHtml(badgeText)}</span>
                    ${lineInfoHtml}
                </div>
            </div>
            <div class="didactic-card-title-row">
                <h4 class="didactic-card-title">${this.escapeHtml(title)}</h4>
            </div>
            <div class="didactic-card-body">
                ${debugHtml}
                <div class="diag-section diag-why">
                    <div class="diag-section-label">Perché si verifica:</div>
                    <div class="diag-section-text">${whyHtml}</div>
                </div>
                <div class="diag-section diag-next-step">
                    <div class="diag-section-label">Passo successivo consigliato:</div>
                    <div class="diag-section-text">${nextStepHtml}</div>
                </div>
                ${techHtml}
                <div class="didactic-card-reflection-prompt">
                    <div class="reflection-prompt-header">
                        <span class="prompt-icon"><svg class="ui-icon" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg></span>
                        <span class="prompt-text">Ti serve un consiglio logico per comprendere l'argomento?</span>
                    </div>
                    <button type="button" class="btn-reveal-reflection" onclick="App.openHintFromFeedback()">
                        <span>Richiedi Indizio Concettuale (Livello 1)</span>
                    </button>
                </div>
            </div>
            <div class="didactic-card-footer">
                <button type="button" class="btn-open-hint-step" onclick="App.openHintFromFeedback()">
                    <span class="btn-icon"><svg class="ui-icon" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg></span>
                    <span>Apri Suggerimento Completo (Livello 1)</span>
                </button>
            </div>
        `;

        return card;
    },

    toggleCoddyExplanation() {
        const box = document.getElementById('coddy-explain-box');
        if (!box) return;
        const isHidden = box.classList.contains('hidden');
        if (isHidden) {
            SoundFX.playHint();
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    },

    toggleCoddyHint(idx) {
        const item = document.getElementById(`coddy-hint-item-${idx}`);
        const text = document.getElementById(`coddy-hint-text-${idx}`);
        const arrow = document.getElementById(`coddy-hint-arrow-${idx}`);
        if (!text) return;

        const isHidden = text.classList.contains('hidden');
        if (isHidden) {
            SoundFX.playHint();
            text.classList.remove('hidden');
            if (item) item.classList.add('open');
            if (arrow) arrow.innerText = '▼';
            this.state.hintsRevealed = Math.max(this.state.hintsRevealed, idx + 1);
            this.recordHintOpened(this.state.currentLessonId, this.state.hintsRevealed);
            this.checkAchievements();
        } else {
            text.classList.add('hidden');
            if (item) item.classList.remove('open');
            if (arrow) arrow.innerText = '›';
        }
    },

    revealChallengeSolution() {
        const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
        if (!currentLesson) return;
        if (confirm("Vuoi visualizzare la soluzione completa per questa sfida?")) {
            SoundFX.playHint();
            this.recordHintOpened(this.state.currentLessonId, 3);
            document.getElementById('code-editor').value = currentLesson.solution;
            this.updateLineNumbers();
        }
    },

    // ===================================================================
    // SISTEMA DI AUTENTICAZIONE, ACCOUNT & BACKUP DATI (auth.js integration)
    // ===================================================================
    async initAuthAndSync() {
        if (!window.AuthManager) return;

        const hadOAuthTokens = window.location.hash.includes('access_token=') || window.location.search.includes('code=');

        // Listener reattivo al cambio di sessione (Ospite <-> Autenticato)
        window.AuthManager.onAuthStateChanged((user) => {
            if(!user)return; // prima che AuthManager abbia verificato una sessione reale
            this.switchSaveOwner(user);
            this.updateAuthUI(user);
            if (hadOAuthTokens && user && !user.isGuest) {
                this.showToast({
                    icon: '🎉',
                    tag: 'BENTORNATO!',
                    title: 'Accesso Google Completato',
                    desc: `Benvenuto, ${user.name || user.email}!`
                });
            }
        });

        window.addEventListener('online',()=>window.AuthManager?.retryCloudSync?.());
        document.getElementById('gdh-save-dismiss')?.addEventListener('click',()=>
            window.AuthManager?.dismissConflictNotice?.());
        document.getElementById('btn-settings-manage-conflict')?.addEventListener('click',()=>{
            this.closeSettingsModal();
            window.AuthManager?.showConflictNotice?.();
        });
        const syncRetry=document.getElementById('gdh-save-retry');
        if(syncRetry)syncRetry.onclick=()=>window.AuthManager.retryCloudSync();
        const syncResolve=document.getElementById('gdh-save-resolve');
        if(syncResolve)syncResolve.onclick=()=>{
            if(confirm('Unire i progressi di entrambi i dispositivi? Le due versioni verranno archiviate localmente prima della fusione. In caso di codice modificato su entrambi, prevale il codice di questo dispositivo.')){
                window.AuthManager.resolveCloudConflict();
            }
        };
        const syncBackup=document.getElementById('gdh-save-backup');
        if(syncBackup)syncBackup.onclick=()=>{
            if(window.AuthManager?.getSyncStatus?.().kind==='conflict')
                window.AuthManager.downloadConflictCopies();
            else window.AuthManager.exportToFile(this.state);
        };
        await window.AuthManager.init();
        if(window.AuthManager.isGuest() || !window.AuthManager.isCloudActive()){
            this._cloudHydrationPending=false;
            this.ensureSiteOnboarding();
        }

        // 1. Apertura e Chiusura Modal Auth
        const btnNavAuth = document.getElementById('btn-open-auth-nav');
        if (btnNavAuth) {
            btnNavAuth.onclick = () => {
                SoundFX.playClick();
                if (window.AuthManager.isGuest()) {
                    this.openAuthModal('login');
                } else {
                    this.openProfileModal();
                }
            };
        }

        const btnProfileAuth = document.getElementById('btn-profile-open-auth');
        if (btnProfileAuth) {
            btnProfileAuth.onclick = () => {
                SoundFX.playClick();
                if (window.AuthManager.isGuest()) {
                    this.closeProfileModal();
                    this.openAuthModal('login');
                } else {
                    if (confirm('Vuoi davvero disconnetterti e tornare alla modalità Ospite Locale?')) {
                        window.AuthManager.logout().catch(e=>this.showToast({title:'Disconnessione non riuscita',desc:e.message,iconName:'alert-triangle'}));
                        SoundFX.playClick();
                    }
                }
            };
        }

        const btnSettingsAuth = document.getElementById('btn-settings-auth-action');
        if (btnSettingsAuth) {
            btnSettingsAuth.onclick = () => {
                SoundFX.playClick();
                if (window.AuthManager.isGuest()) {
                    document.getElementById('settings-modal').classList.add('hidden');
                    this.openAuthModal('login');
                } else {
                    if (confirm('Vuoi davvero disconnetterti e tornare alla modalità Ospite Locale?')) {
                        window.AuthManager.logout().catch(e=>this.showToast({title:'Disconnessione non riuscita',desc:e.message,iconName:'alert-triangle'}));
                        SoundFX.playClick();
                    }
                }
            };
        }

        const btnCloseAuth = document.getElementById('btn-close-auth');
        if (btnCloseAuth) {
            btnCloseAuth.onclick = () => this.closeAuthModal();
        }

        // 2. Toggle Tab Login vs Registrati
        const tabLogin = document.getElementById('tab-auth-login');
        const tabRegister = document.getElementById('tab-auth-register');
        const groupName = document.getElementById('group-auth-name');
        const groupMerge = document.getElementById('group-auth-merge');
        const submitText = document.getElementById('auth-submit-text');
        const authTitle = document.getElementById('auth-modal-title');

        if (tabLogin && tabRegister) {
            tabLogin.onclick = () => {
                SoundFX.playClick();
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                if (groupName) groupName.classList.add('hidden');
                if (groupMerge) groupMerge.classList.add('hidden');
                document.getElementById('auth-merge-checkbox').checked=false;
                if (submitText) submitText.innerText = 'Accedi al Tuo Account';
                if (authTitle) authTitle.innerText = 'Accedi a GDScript Hero';
                this.clearAuthAlert();
            };

            tabRegister.onclick = () => {
                SoundFX.playClick();
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                if (groupName) groupName.classList.remove('hidden');
                if (groupMerge) groupMerge.classList.remove('hidden');
                document.getElementById('auth-merge-checkbox').checked=true;
                if (submitText) submitText.innerText = 'Crea Account e Salva Progressi';
                if (authTitle) authTitle.innerText = 'Crea il Tuo Nuovo Account';
                this.clearAuthAlert();
            };
        }

        // Toggle Password visibile
        const btnTogglePwd = document.getElementById('btn-toggle-pwd');
        const pwdInput = document.getElementById('auth-password-input');
        if (btnTogglePwd && pwdInput) {
            btnTogglePwd.onclick = () => {
                if (pwdInput.type === 'password') {
                    pwdInput.type = 'text';
                    btnTogglePwd.innerText = '🙈';
                } else {
                    pwdInput.type = 'password';
                    btnTogglePwd.innerText = '👁️';
                }
            };
        }

        // Continua come Ospite
        const btnGuest = document.getElementById('btn-continue-guest');
        if (btnGuest) {
            btnGuest.onclick = () => {
                SoundFX.playClick();
                window.AuthManager.logout().then(()=>this.closeAuthModal())
                    .catch(e=>this.showAuthAlert('Disconnessione non riuscita: '+e.message));
            };
        }

        // 3. Invio Form Autenticazione (Login o Register)
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.onsubmit = async (e) => {
                e.preventDefault();
                const isRegister = tabRegister && tabRegister.classList.contains('active');
                const emailInput = document.getElementById('auth-email-input');
                const nameInput = document.getElementById('auth-name-input');
                const mergeCheckbox = document.getElementById('auth-merge-checkbox');

                const email = emailInput ? emailInput.value.trim() : '';
                const password = pwdInput ? pwdInput.value : '';
                const name = nameInput ? nameInput.value.trim() : '';
                const importOnSignup = !!mergeCheckbox?.checked;

                try {
                    this.clearAuthAlert();
                    if (isRegister) {
                        // L'intenzione e' riservata a questa specifica registrazione;
                        // al login di un account preesistente non si importa mai l'ospite.
                        window.AuthManager.beginGuestOnboarding('email',importOnSignup,email);
                        const res = await window.AuthManager.registerWithEmail(name, email, password);
                        if(res.pendingConfirmation){
                            this.showAuthAlert('Controlla la tua email per confermare la registrazione. I dati ospite restano in questo browser; l’importazione scelta avverrà soltanto al primo accesso verificato al nuovo account.', 'success');
                            return;
                        }
                        const remote = window.AuthManager.isCloudActive()
                            ? await window.AuthManager.fetchFromCloud() : null;
                        await this.integrateCloudSave(remote);
                        this.showAuthAlert('Account creato con successo! Benvenuto, ' + res.user.name + '!', 'success');
                        SoundFX.playSuccess();
                    } else {
                        const res = await window.AuthManager.loginWithEmail(email, password);
                        // Account gia' esistente: mai passare i dati dell'ospite.
                        await this.integrateCloudSave(res.account?.progress||null);
                        this.showAuthAlert('Accesso effettuato! Bentornato, ' + res.user.name + '!', 'success');
                        SoundFX.playSuccess();
                    }
                    setTimeout(() => {
                        this.closeAuthModal();
                    }, 900);
                } catch (err) {
                    // Se il server rifiuta la registrazione, non conservare
                    // un'intenzione pendente associabile ad altri account.
                    if(isRegister && window.AuthManager.isGuest())
                        window.AuthManager.clearGuestOnboarding();
                    SoundFX.playError();
                    this.showAuthAlert(err.message, 'error');
                }
            };
        }

        // 4. Accesso Rapido Google
        const btnGoogle = document.getElementById('btn-google-signin');
        if(btnGoogle){
            btnGoogle.onclick=async()=>{
                SoundFX.playClick();
                if(!window.AuthManager?.isCloudActive()){
                    this.showAuthAlert('Accesso Google non disponibile senza Supabase. Continua come ospite oppure riprova più tardi.');
                    return;
                }
                try{
                    // Google distingue un account appena creato da uno esistente
                    // tramite la data di creazione confermata da Supabase.
                    window.AuthManager.beginGuestOnboarding('google',
                        !!document.getElementById('auth-google-import-checkbox')?.checked);
                    await window.AuthManager.loginWithGoogle();
                }catch(err){
                    window.AuthManager.clearGuestOnboarding();
                    this.showAuthAlert('Impossibile accedere con Google: '+err.message);
                }
            };
        }

        // 5. Apertura e Gestione Modal Backup & Ripristino Dati
        const btnProfileBackup = document.getElementById('btn-profile-open-backup');
        if (btnProfileBackup) {
            btnProfileBackup.onclick = () => {
                SoundFX.playClick();
                this.closeProfileModal();
                this.openBackupModal('export');
            };
        }

        const btnSettingsExport = document.getElementById('btn-settings-export');
        if (btnSettingsExport) {
            btnSettingsExport.onclick = () => {
                SoundFX.playClick();
                document.getElementById('settings-modal').classList.add('hidden');
                this.openBackupModal('export');
            };
        }

        const btnSettingsImport = document.getElementById('btn-settings-import');
        if (btnSettingsImport) {
            btnSettingsImport.onclick = () => {
                SoundFX.playClick();
                document.getElementById('settings-modal').classList.add('hidden');
                this.openBackupModal('import');
            };
        }

        const btnCloseBackup = document.getElementById('btn-close-backup');
        if (btnCloseBackup) {
            btnCloseBackup.onclick = () => this.closeBackupModal();
        }

        // Schede Esporta vs Importa
        const tabBackupExport = document.getElementById('tab-backup-export');
        const tabBackupImport = document.getElementById('tab-backup-import');
        const panelExport = document.getElementById('panel-backup-export');
        const panelImport = document.getElementById('panel-backup-import');

        if (tabBackupExport && tabBackupImport) {
            tabBackupExport.onclick = () => {
                SoundFX.playClick();
                tabBackupExport.classList.add('active');
                tabBackupImport.classList.remove('active');
                panelExport.classList.remove('hidden');
                panelImport.classList.add('hidden');
                this.refreshBackupExportInfo();
            };

            tabBackupImport.onclick = () => {
                SoundFX.playClick();
                tabBackupImport.classList.add('active');
                tabBackupExport.classList.remove('active');
                panelImport.classList.remove('hidden');
                panelExport.classList.add('hidden');
            };
        }

        // Azione 1: Scarica File JSON
        const btnDoExportFile = document.getElementById('btn-do-export-file');
        if (btnDoExportFile) {
            btnDoExportFile.onclick = () => {
                SoundFX.playClick();
                const fileName = window.AuthManager.exportToFile(this.state);
                alert(`File di backup scaricato con successo!\nNome: ${fileName}`);
            };
        }

        // Azione 2: Copia Codice negli Appunti
        const btnDoCopyCode = document.getElementById('btn-do-copy-code');
        const exportCodeTextarea = document.getElementById('export-code-textarea');
        if (btnDoCopyCode && exportCodeTextarea) {
            btnDoCopyCode.onclick = () => {
                SoundFX.playClick();
                const code = window.AuthManager.exportToCode(this.state);
                exportCodeTextarea.value = code;
                exportCodeTextarea.select();

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(() => {
                        btnDoCopyCode.innerText = '✓ Codice Copiato Negli Appunti!';
                        setTimeout(() => {
                            btnDoCopyCode.innerText = '📋 Copia Codice Negli Appunti';
                        }, 2200);
                    });
                } else {
                    document.execCommand('copy');
                    btnDoCopyCode.innerText = '✓ Copiato!';
                    setTimeout(() => {
                        btnDoCopyCode.innerText = '📋 Copia Codice Negli Appunti';
                    }, 2200);
                }
            };
        }

        // Azione 3: Importazione - Analizza File o Codice Incollato
        const importFileInput = document.getElementById('import-file-input');
        const importDropzone = document.getElementById('import-dropzone');
        const importCodeInput = document.getElementById('import-code-input');
        const btnAnalyzeImport = document.getElementById('btn-analyze-import');

        if (importFileInput) {
            importFileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target.result;
                    if (importCodeInput) importCodeInput.value = text;
                    this.analyzeAndPreviewImport(text);
                };
                reader.readAsText(file);
            };
        }

        if (importDropzone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                importDropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    importDropzone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                importDropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    importDropzone.classList.remove('dragover');
                }, false);
            });

            importDropzone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const file = dt.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const text = event.target.result;
                        if (importCodeInput) importCodeInput.value = text;
                        this.analyzeAndPreviewImport(text);
                    };
                    reader.readAsText(file);
                }
            }, false);
        }

        if (btnAnalyzeImport) {
            btnAnalyzeImport.onclick = () => {
                SoundFX.playClick();
                const rawText = importCodeInput ? importCodeInput.value.trim() : '';
                this.analyzeAndPreviewImport(rawText);
            };
        }

        // Toggle Opzioni Modalità Import (Merge vs Overwrite)
        const modeOptMerge = document.getElementById('mode-opt-merge');
        const modeOptOverwrite = document.getElementById('mode-opt-overwrite');
        const radioMerge = document.getElementById('radio-merge');
        const radioOverwrite = document.getElementById('radio-overwrite');

        if (modeOptMerge && modeOptOverwrite && radioMerge && radioOverwrite) {
            modeOptMerge.onclick = () => {
                radioMerge.checked = true;
                modeOptMerge.classList.add('selected');
                modeOptOverwrite.classList.remove('selected');
            };
            modeOptOverwrite.onclick = () => {
                radioOverwrite.checked = true;
                modeOptOverwrite.classList.add('selected');
                modeOptMerge.classList.remove('selected');
            };
        }

        // Conferma Ripristino
        const btnConfirmImport = document.getElementById('btn-confirm-import');
        const btnCancelImport = document.getElementById('btn-cancel-import');
        if (btnConfirmImport) {
            btnConfirmImport.onclick = () => {
                this.executeImport();
            };
        }
        if (btnCancelImport) {
            btnCancelImport.onclick = () => {
                SoundFX.playClick();
                document.getElementById('import-preview-box').classList.add('hidden');
            };
        }

        // 6. Apertura e Gestione Pannello Amministratore (Admin Dashboard)
        const btnOpenAdmin = document.getElementById('btn-settings-open-admin');
        if (btnOpenAdmin) {
            btnOpenAdmin.onclick = () => {
                SoundFX.playClick();
                this.openAdminModal();
            };
        }

        const btnCloseAdmin = document.getElementById('btn-close-admin');
        if (btnCloseAdmin) {
            btnCloseAdmin.onclick = () => this.closeAdminModal();
        }

        const btnRefreshAdmin = document.getElementById('btn-refresh-admin');
        if (btnRefreshAdmin) {
            btnRefreshAdmin.onclick = () => {
                SoundFX.playClick();
                this.renderAdminStats();
            };
        }
    },

    updateAuthUI(user) {
        const isGuest = !user || user.isGuest === true;
        const navAuthIcon = document.getElementById('nav-auth-icon');
        const navAuthLabel = document.getElementById('nav-auth-label');
        const btnNavAuth = document.getElementById('btn-open-auth-nav');

        if (btnNavAuth) {
            btnNavAuth.classList.toggle('logged-in', !isGuest);
            btnNavAuth.title = isGuest
                ? 'Modalità ospite · Accedi per sincronizzare'
                : 'Account collegato · Gestisci la sincronizzazione';
        }

        if (navAuthIcon) {
            navAuthIcon.textContent = '';
            navAuthIcon.classList.toggle('connected', !isGuest);
        }

        // Lo username scelto nell'app e' l'unico nome visibile in navbar;
        // il vero stato dell'account rimane accessibile con tooltip e screen reader.
        if (navAuthLabel) navAuthLabel.textContent = isGuest ? 'Ospite' : 'Account collegato';
        if (btnNavAuth) btnNavAuth.setAttribute('aria-label', isGuest
            ? 'Modalità ospite: accedi per sincronizzare'
            : 'Account collegato: apri impostazioni di sincronizzazione');

        // Aggiorna Sezione Profilo
        const profileBadge = document.getElementById('profile-acc-badge');
        const profileDesc = document.getElementById('profile-acc-desc');
        const btnProfileAuth = document.getElementById('btn-profile-open-auth');

        if (profileBadge) {
            profileBadge.innerText = isGuest ? 'Modalità Ospite (Locale)' :
                (window.AuthManager?.isCloudActive() ? `✓ Cloud Attivo (${user.provider === 'google' ? 'Google' : 'Email'})` : 'Account locale (solo questo browser)');
            profileBadge.style.color = isGuest ? '#38bdf8' : '#10b981';
            profileBadge.style.borderColor = isGuest ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        }

        if (profileDesc) {
            if (isGuest) {
                profileDesc.innerHTML = 'Stai giocando come <strong>Ospite Locale</strong>. I tuoi progressi sono salvati solo in questo browser. Accedi per salvarli nel cloud!';
            } else {
                profileDesc.innerHTML = 'Connesso come <strong></strong>. Sincronizzazione automatica attiva nel cloud.';
                profileDesc.querySelector('strong').textContent = String(user.email || '');
            }
        }

        if (btnProfileAuth) {
            btnProfileAuth.innerText = isGuest ? '🔑 Accedi / Crea Account' : '🚪 Disconnetti (Torna Ospite)';
        }

        // Aggiorna Sezione Impostazioni
        const settingsAccountDesc = document.getElementById('settings-account-desc');
        const btnSettingsAuth = document.getElementById('btn-settings-auth-action');

        if (settingsAccountDesc) {
            const fullEmail = isGuest ? '' : String(user.email || '');
            settingsAccountDesc.textContent = isGuest
                ? 'Modalità Ospite (Dati salvati in locale)'
                : `Connesso: ${fullEmail}`;
            // CSS tronca solo la parte visibile, senza alterare l'indirizzo reale.
            settingsAccountDesc.title = fullEmail;
        }
        if (btnSettingsAuth) {
            // Cambia solo la label: l'icona SVG deve rimanere intatta.
            const label=btnSettingsAuth.querySelector('.settings-button-label');
            if(label)label.textContent=isGuest?'Accedi':'Esci';
            else btnSettingsAuth.textContent=isGuest?'Accedi':'Esci';
            btnSettingsAuth.dataset.action=isGuest?'login':'logout';
        }

        // Visibilità riga Admin nelle Impostazioni: VISIBILE SOLO SE L'UTENTE È L'ADMIN
        const adminSettingsRow = document.getElementById('admin-settings-row');
        if (adminSettingsRow) {
            const isUserAdmin = window.AuthManager && window.AuthManager.isAdmin(user);
            if (isUserAdmin) {
                adminSettingsRow.classList.remove('hidden');
            } else {
                adminSettingsRow.classList.add('hidden');
            }
        }
    },

    openAuthModal(defaultTab = 'login') {
        const modal = document.getElementById('auth-modal');
        if (!modal) return;
        this.clearAuthAlert();

        if (defaultTab === 'register') {
            const tabReg = document.getElementById('tab-auth-register');
            if (tabReg) tabReg.click();
        } else {
            const tabLog = document.getElementById('tab-auth-login');
            if (tabLog) tabLog.click();
        }

        modal.classList.remove('hidden');
    },

    closeAuthModal() {
        SoundFX.playClick();
        const modal = document.getElementById('auth-modal');
        if (modal) modal.classList.add('hidden');
        this.clearAuthAlert();
    },

    showAuthAlert(message, type = 'error') {
        const alertBox = document.getElementById('auth-alert-box');
        if (alertBox) {
            alertBox.className = `auth-alert ${type}`;
            alertBox.innerText = message;
            alertBox.classList.remove('hidden');
        }
    },

    clearAuthAlert() {
        const alertBox = document.getElementById('auth-alert-box');
        if (alertBox) {
            alertBox.classList.add('hidden');
            alertBox.innerText = '';
        }
    },

    openBackupModal(defaultTab = 'export') {
        const modal = document.getElementById('backup-modal');
        if (!modal) return;

        if (defaultTab === 'import') {
            const tabImp = document.getElementById('tab-backup-import');
            if (tabImp) tabImp.click();
        } else {
            const tabExp = document.getElementById('tab-backup-export');
            if (tabExp) tabExp.click();
        }

        this.refreshBackupExportInfo();
        modal.classList.remove('hidden');
    },

    closeBackupModal() {
        SoundFX.playClick();
        const modal = document.getElementById('backup-modal');
        if (modal) modal.classList.add('hidden');
        const previewBox = document.getElementById('import-preview-box');
        if (previewBox) previewBox.classList.add('hidden');
    },

    openAdminModal() {
        if (!window.AuthManager || !window.AuthManager.isAdmin()) {
            SoundFX.playError();
            alert('⛔ Accesso riservato: Solo l\'amministratore autenticato può accedere al pannello statistiche.');
            return;
        }

        SoundFX.playClick();
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) settingsModal.classList.add('hidden');

        const modal = document.getElementById('admin-modal');
        if (!modal) return;

        modal.classList.remove('hidden');
        this.renderAdminStats();
    },

    closeAdminModal() {
        SoundFX.playClick();
        const modal = document.getElementById('admin-modal');
        if (modal) modal.classList.add('hidden');
    },

    async renderAdminStats() {
        const cloudStatusText = document.getElementById('cloud-status-text');
        const cloudDot = document.getElementById('cloud-indicator-dot');
        const setupCard = document.getElementById('admin-setup-card');
        const kpiTotalUsers = document.getElementById('kpi-total-users');
        const kpiTotalXp = document.getElementById('kpi-total-xp');
        const kpiAvgLessons = document.getElementById('kpi-avg-lessons');
        const kpiTopLevel = document.getElementById('kpi-top-level');
        const tbody = document.getElementById('admin-users-tbody');
        const tableCount = document.getElementById('admin-table-count');

        if (!window.AuthManager || typeof window.AuthManager.fetchAdminStats !== 'function') return;

        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-empty-row">Caricamento statistiche in corso...</td></tr>';
        }

        try {
            const stats = await window.AuthManager.fetchAdminStats();

            if (cloudStatusText && cloudDot) {
                if (stats.isCloud) {
                    cloudStatusText.innerText = 'Stato Connessione: Supabase Cloud Connesso (Realtime Sync)';
                    cloudDot.className = 'cloud-indicator-dot active';
                    if (setupCard) setupCard.classList.add('hidden');
                } else {
                    cloudStatusText.innerText = 'Stato Connessione: Sincronizzazione Locale (Offline / Storage Browser)';
                    cloudDot.className = 'cloud-indicator-dot';
                    if (setupCard) setupCard.classList.remove('hidden');
                }
            }

            const users = stats.usersList || [];
            const totalUsers = stats.totalUsers !== undefined ? stats.totalUsers : users.length;
            const totalXp = stats.totalXp || 0;
            const avgLessons = stats.avgLessons || 0;
            const topLevel = users.length > 0 ? Math.max(...users.map(u => u.level || 1)) : 1;

            if (kpiTotalUsers) kpiTotalUsers.innerText = totalUsers;
            if (kpiTotalXp) kpiTotalXp.innerText = totalXp.toLocaleString();
            if (kpiAvgLessons) kpiAvgLessons.innerText = avgLessons;
            if (kpiTopLevel) kpiTopLevel.innerText = `Lv. ${topLevel}`;
            if (tableCount) tableCount.innerText = `${totalUsers} ${totalUsers === 1 ? 'giocatore trovato' : 'giocatori trovati'}`;

            if (tbody) {
                tbody.innerHTML = '';
                if (users.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="table-empty-row">Nessun giocatore registrato trovato. Registra un account per visualizzarlo qui.</td></tr>';
                    return;
                }

                users.forEach(u => {
                    const tr = document.createElement('tr');

                    let badgeClass = 'email';
                    let badgeText = 'Email';
                    if (u.provider === 'google') {
                        badgeClass = 'google';
                        badgeText = 'Google';
                    } else if (u.provider === 'guest') {
                        badgeClass = 'guest';
                        badgeText = 'Ospite';
                    }

                    const initial = (u.name || u.email || 'U').charAt(0).toUpperCase();
                    const lastActiveDate = u.lastLogin ? new Date(u.lastLogin).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Di recente';

                    tr.innerHTML = `
                        <td>
                            <div class="user-cell-meta">
                                <div class="user-avatar-mini">${initial}</div>
                                <div class="user-text-info">
                                    <strong class="user-display-name">${this.escapeHTML(u.name || 'Utente')}</strong>
                                    <span class="user-display-email">${this.escapeHTML(u.email || 'Nessuna email')}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span class="badge-tag-pill ${badgeClass}">${badgeText}</span>
                        </td>
                        <td>
                            <span class="stat-highlight-xp">⚡ ${(u.xp || 0).toLocaleString()} XP</span>
                            <span class="stat-sub-level">Livello ${u.level || 1}</span>
                        </td>
                        <td>
                            <strong>${u.finishedLessons || 0}</strong> / 36
                        </td>
                        <td class="last-seen-cell">${lastActiveDate}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        } catch (e) {
            console.error('Errore durante il recupero delle statistiche admin:', e);
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5" class="table-empty-row" style="color: #ef4444;"></td></tr>';
                tbody.querySelector('td').textContent = `Errore nel recupero dati: ${e.message}`;
            }
        }
    },

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    refreshBackupExportInfo() {
        const summary = document.getElementById('export-stat-summary');
        if (summary) {
            summary.innerText = `Riepilogo: ${this.state.xp} XP • ${this.state.finishedLessons.length}/36 lezioni completate • Livello ${this.getCurrentLevelInfo().tier.level}`;
        }
        const exportCodeTextarea = document.getElementById('export-code-textarea');
        if (exportCodeTextarea && window.AuthManager) {
            exportCodeTextarea.value = window.AuthManager.exportToCode(this.state);
        }
    },

    pendingImportPayload: null,

    analyzeAndPreviewImport(rawText) {
        if (!rawText) {
            alert('Inserisci o carica un file di salvataggio prima di analizzare.');
            return;
        }

        try {
            const parsed = window.AuthManager.parseBackupString(rawText);
            this.pendingImportPayload = parsed;

            const previewBox = document.getElementById('import-preview-box');
            const previewName = document.getElementById('import-preview-name');
            const previewXp = document.getElementById('import-preview-xp');
            const previewLessons = document.getElementById('import-preview-lessons');
            const previewAch = document.getElementById('import-preview-ach');
            const previewDate = document.getElementById('import-preview-date');

            if (previewName) previewName.innerText = parsed.user?.name || parsed.data?.profile?.username || 'Eroe Godot';
            if (previewXp) previewXp.innerText = `${parsed.data.xp || 0} XP`;
            if (previewLessons) previewLessons.innerText = `${(parsed.data.finishedLessons || []).length} completate`;
            if (previewAch) previewAch.innerText = `${(parsed.data.unlockedAchievements || []).length} sbloccati`;
            if (previewDate) {
                const dateStr = parsed.exportedAt ? new Date(parsed.exportedAt).toLocaleDateString() : 'Non specificata';
                previewDate.innerText = `Data salvataggio: ${dateStr}`;
            }

            if (previewBox) {
                previewBox.classList.remove('hidden');
                SoundFX.playSuccess();
            }
        } catch (e) {
            SoundFX.playError();
            alert('Impossibile leggere il salvataggio: ' + e.message);
        }
    },

    executeImport() {
        if (!this.pendingImportPayload || !this.pendingImportPayload.data) {
            alert('Nessun salvataggio valido pronto per il ripristino.');
            return;
        }

        const radioOverwrite = document.getElementById('radio-overwrite');
        const isOverwrite = radioOverwrite && radioOverwrite.checked;
        const importedData = this.pendingImportPayload.data;

        if (isOverwrite) {
            if (!confirm('ATTENZIONE: Stai per sovrascrivere completamente tutti i tuoi progressi correnti con questo file di backup. Continuare?')) {
                return;
            }
            this.applyImportedState(importedData, true);
        } else {
            // Modalità Unione (Merge progressivo intelligente)
            const merged = window.AuthManager.mergeProgress(this.state, importedData);
            this.applyImportedState(merged, true);
        }

        SoundFX.playFanfare();
        alert('🎉 Progressi ripristinati con successo!');
        this.closeBackupModal();
    },

    /**
     * Integra i progressi locali dell'Ospite con il salvataggio salvato nel Cloud Supabase
     */

    cloudBaseKey(owner=this._saveOwner){
        return 'gdscript_hero_cloud_base_v1:'+owner;
    },
    getCloudBaseline(){
        try{
            const parsed=JSON.parse(localStorage.getItem(this.cloudBaseKey())||'null');
            return parsed?.owner===this._saveOwner &&
                Number.isSafeInteger(parsed.revision) && parsed.data &&
                typeof parsed.data==='object' ? parsed : null;
        }catch(e){return null;}
    },
    saveCloudBaseline(data,revision){
        if(this._saveOwner==='guest'||!data||
            typeof revision!=='number'||!Number.isSafeInteger(revision))return;
        try{
            localStorage.setItem(this.cloudBaseKey(),JSON.stringify({
                owner:this._saveOwner,revision:Number(revision),data
            }));
        }catch(e){console.warn('[App] Impossibile archiviare la base cloud:',e);}
    },
    // Un conflitto reale richiede modifiche divergenti allo STESSO codice,
    // in entrambi i dispositivi, rispetto all'ultima base cloud confermata.
    // Il timestamp o la presenza di un codice starter non bastano.
    hasOverlappingCloudDrafts(local,remote,baseline=null){
        const base=baseline?.data||null;
        const meaningfullyEdited=(value,id)=>{
            if(typeof value!=='string'||!value.trim())return false;
            const lesson=typeof LESSONS_DATA!=='undefined'?
                LESSONS_DATA.find(l=>String(l.id)===String(id)):null;
            return !lesson||value!==lesson.initialCode;
        };
        const overlap=(left,right,ancestor,ignoreStarter=false)=>{
            if(!left||!right)return false;
            return Object.keys(left).some(id=>{
                const a=left[id],b=right[id];
                if(typeof a!=='string'||typeof b!=='string'||a===b)return false;
                if(ignoreStarter && !meaningfullyEdited(a,id))return false;
                if(!base)return true; // un primo accesso: conserva entrambi
                const previous=ancestor?.[id];
                return a!==previous && b!==previous;
            });
        };
        if(overlap(local.userCode,remote.userCode,base?.userCode,true))return true;
        if(overlap(local.arenaProject?.userCode,remote.arenaProject?.userCode,
            base?.arenaProject?.userCode))return true;
        const localProjects=local.sandbox?.projects||[];
        const remoteProjects=new Map((remote.sandbox?.projects||[]).map(p=>[p.id,p]));
        const baseProjects=new Map((base?.sandbox?.projects||[]).map(p=>[p.id,p]));
        const defaultCode=this._blankUserState?.sandbox?.projects?.[0]?.code;
        const defaultAlternate=this.getDefaultSandboxState?.()?.projects?.[0]?.code;
        const data=p=>p&&JSON.stringify({code:p.code||'',nodes:p.nodes||[]});
        return localProjects.some(p=>{
            const other=remoteProjects.get(p.id);
            if(!other||data(p)===data(other))return false;
            if(p.id==='proj_default' &&
                (p.code===defaultCode||p.code===defaultAlternate) &&
                data(p)===data(this._blankUserState?.sandbox?.projects?.[0]))return false;
            if(!base)return true;
            return data(p)!==data(baseProjects.get(p.id)) &&
                data(other)!==data(baseProjects.get(p.id));
        });
    },
    mergeCloudWithoutLosingLocalEdits(local,remote,baseline=null){
        const merge=(a,b)=>window.AuthManager?.mergeProgress?.(a,b)||{...a,...b};
        const result=merge(local,remote);
        const base=baseline?.data;
        if(!base)return result;
        const preserveEdits=(out,localValues,remoteValues,baseValues)=>{
            for(const [id,value] of Object.entries(localValues||{})){
                if(typeof value!=='string')continue;
                if(value!==(baseValues||{})[id] &&
                    (remoteValues||{})[id]===(baseValues||{})[id]){
                    out[id]=value;
                }
            }
        };
        result.userCode={...(result.userCode||{})};
        preserveEdits(result.userCode,local.userCode,remote.userCode,base.userCode);
        if(result.arenaProject){
            result.arenaProject={...result.arenaProject,
                userCode:{...(result.arenaProject.userCode||{})}};
            preserveEdits(result.arenaProject.userCode,
                local.arenaProject?.userCode,remote.arenaProject?.userCode,
                base.arenaProject?.userCode);
        }
        if(result.sandbox){
            const rp=new Map((remote.sandbox?.projects||[]).map(p=>[p.id,p]));
            const bp=new Map((base.sandbox?.projects||[]).map(p=>[p.id,p]));
            const signature=p=>p&&JSON.stringify({code:p.code||'',nodes:p.nodes||[]});
            const merged=new Map((result.sandbox.projects||[]).map(p=>[p.id,p]));
            for(const p of local.sandbox?.projects||[]){
                if(!rp.has(p.id) || (signature(p)!==signature(bp.get(p.id)) &&
                    signature(rp.get(p.id))===signature(bp.get(p.id))))merged.set(p.id,p);
            }
            result.sandbox={...result.sandbox,projects:[...merged.values()]};
        }
        return result;
    },
    async integrateCloudSave(cloudSave){
        let snapshot=this.state;
        const baseline=this.getCloudBaseline();
        const auth=window.AuthManager;
        // Gli account esistenti senza metadati di onboarding sono legacy:
        // conservano l'obiettivo corrente e non rivedono la guida.
        if(cloudSave && !cloudSave.streakGoalSelection) {
            cloudSave={...cloudSave,streakGoalSelection:{
                week:cloudSave.currentWeekId||this.getWeekId(),selectedDate:'legacy'
            },siteWelcomeSeen:true};
        }
        // Dati ospite solo al primo accesso del nuovo account verificato.
        // Il cloud, se gia' presente, ha sempre la precedenza su questa scelta.
        const firstImport=!this.state.guestOnboardingV1?.complete && auth && !auth.isGuest()
            ? auth.takeFirstRegistrationGuestSave(cloudSave||null) : null;
        if(firstImport)
            snapshot=auth.mergeProgress(snapshot,firstImport);
        if(!cloudSave && auth && !auth.isGuest() && !snapshot.guestOnboardingV1?.complete){
            snapshot={...snapshot,guestOnboardingV1:{
                complete:true,imported:!!firstImport
            }};
        }
        if(cloudSave&&this.hasOverlappingCloudDrafts(snapshot,cloudSave,baseline)){
            this.saveStorage({localOnly:true});
            const state=window.AuthManager?._cloudVersion;
            if(state&&state.userId===window.AuthManager?.currentUser?.id){
                state.blocked=true;
                state.remote=cloudSave;
            }
            this._cloudHydrationPending=true;
            window.AuthManager?.setSyncStatus?.('conflict',
                'Ci sono modifiche diverse tra questo dispositivo e il cloud. Puoi continuare a studiare: i dati locali restano salvati. La sincronizzazione è sospesa finché non scegli come gestirle.');
            return;
        }
        if(cloudSave){
            snapshot=this.mergeCloudWithoutLosingLocalEdits(snapshot,cloudSave,baseline);
            this.saveCloudBaseline(cloudSave,window.AuthManager?.getSaveRevision?.());
        }
        try{
            if(cloudSave||firstImport||snapshot!==this.state)
                this.applyImportedState(snapshot,false);
        }finally{
            this._cloudHydrationPending=false;
        }
        this.saveStorage();
        this.ensureSiteOnboarding();
    },

    applyImportedState(data, notify = true) {
        if (!data) return;

        if (data.xp !== undefined) this.state.xp = data.xp;
        this.state.rewardsV2 = ProgressionV2.normalizeRewards(data.rewardsV2,this.state.xp,data.dailyQuests);
        if (data.streak !== undefined) this.state.streak = data.streak;
        if (data.streakWeeks !== undefined) this.state.streakWeeks = data.streakWeeks;
        if (data.streakMode) this.state.streakMode = data.streakMode;
        if(data.streakGoalSelection?.week)this.state.streakGoalSelection=data.streakGoalSelection;
        if(data.siteWelcomeSeen===true)this.state.siteWelcomeSeen=true;
        if (data.activeDaysThisWeek) this.state.activeDaysThisWeek = data.activeDaysThisWeek;
        if (data.currentWeekId !== undefined) this.state.currentWeekId = data.currentWeekId;
        if (data.lastActiveDate !== undefined) this.state.lastActiveDate = data.lastActiveDate;
        if (data.finishedLessons) this.state.finishedLessons = data.finishedLessons;
        if (data.completedLessons) this.state.completedLessons = data.completedLessons;
        if (data.unlockedAchievements) this.state.unlockedAchievements = data.unlockedAchievements;
        if (data.userCode) this.state.userCode = data.userCode;
        if (data.projectInterests) this.state.projectInterests = data.projectInterests;
        if (data.soundEnabled !== undefined) SoundFX.enabled = !!data.soundEnabled;
        if (data.soundVolume !== undefined) SoundFX.setVolume(data.soundVolume);
        if (data.profile) this.state.profile = { ...this.state.profile, ...data.profile };
        if (data.profileCustomized !== undefined) this.state.profileCustomized = !!data.profileCustomized;
        if (data.guestOnboardingV1?.complete)
            this.state.guestOnboardingV1 = data.guestOnboardingV1;
        if (data.dailyQuests) this.state.dailyQuests = data.dailyQuests;
        if (data.claimedQuestsCount !== undefined) this.state.claimedQuestsCount = data.claimedQuestsCount;
        if (data.sandbox) {
            this.state.sandbox = data.sandbox;
            const practiceView = document.getElementById('view-practice');
            if (practiceView && !practiceView.classList.contains('hidden')) {
                this.loadActiveSandboxProject();
            }
        }
        if (data.arenaProject) {
            this.state.arenaProject = data.arenaProject;
        }
        if (data.learningTelemetry) {
            this.state.learningTelemetry = data.learningTelemetry;
        }
        if (data.reviewProgress) {
            this.state.reviewProgress = data.reviewProgress;
        }
        if (data.theme) {
            this.applyTheme(data.theme);
        }

        this.saveStorage();
        this.updateStatsUI();
        this.applyProfileUI();
        this.renderRoadmap();
        this.renderSidebarDailyQuests();
        this.checkAchievements();
        this.updateQuestsBadge();
    },

    selectSceneNode(node) {
        this.selectedSceneNode = node;
        const removeBtn = document.getElementById('btn-remove-selected-node');
        if (removeBtn) {
            if (node && node !== this.currentScene && node.parent) {
                removeBtn.classList.remove('hidden');
                removeBtn.title = `Rimuovi il nodo '${node.name}' (Canc)`;
            } else {
                removeBtn.classList.add('hidden');
            }
        }
        const items = document.querySelectorAll('.scene-tree-item');
        items.forEach(el => {
            if (el.getAttribute('data-node-name') === (node ? node.name : '')) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });
    },

    removeSceneNode(targetNode) {
        const node = targetNode || this.selectedSceneNode;
        if (!node) {
            this.showToast("Seleziona prima un nodo da rimuovere!", "info");
            return;
        }
        if (node === this.currentScene || !node.parent) {
            this.showToast("Non puoi rimuovere il nodo radice (Root) della scena!", "warning");
            return;
        }

        const name = node.name;
        node.parent.remove_child(node);
        if (this.selectedSceneNode === node) {
            this.selectedSceneNode = null;
        }

        SoundFX.playClick();
        this.renderSceneDock();
        this.renderViewportOverlay();
        this.updateExerciseToolsVisibility(lesson);
        this.showToast(`Nodo '$${name}' rimosso dall'albero della scena.`, "info");
    },

    renderSceneDock() {
        const treeContainer = document.getElementById('exercise-scene-tree');
        const countBadge = document.getElementById('scene-node-count');
        if (!treeContainer) return;

        if (!this.currentScene && window.GD_Node) {
            this.currentScene = new GD_Node("Root");
        }
        if (!this.currentScene) return;

        const countNodes = (node) => {
            let total = 1;
            for (const child of node.children) {
                total += countNodes(child);
            }
            return total;
        };

        const totalNodes = countNodes(this.currentScene);
        if (countBadge) {
            countBadge.textContent = `${totalNodes} nod${totalNodes === 1 ? 'o' : 'i'}`;
        }

        const getNodeIcon = (type) => {
            switch (type) {
                case 'Button': return '🔘';
                case 'Label': return '🏷️';
                case 'Timer': return '⏱️';
                case 'ColorRect': return '🟩';
                case 'Node2D': return '📍';
                default: return '📦';
            }
        };

        treeContainer.innerHTML = '';

        const buildTreeDom = (node, depth = 0) => {
            const icon = getNodeIcon(node.type);
            const indentPx = depth * 16;

            const item = document.createElement('div');
            item.className = 'scene-tree-item' + (this.selectedSceneNode === node ? ' selected' : '');
            item.style.paddingLeft = `${indentPx}px`;
            item.setAttribute('data-node-name', node.name);

            const iconSpan = document.createElement('span');
            iconSpan.className = 'tree-node-icon';
            iconSpan.textContent = icon;
            item.appendChild(iconSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'tree-node-name';
            nameSpan.textContent = node.name;
            item.appendChild(nameSpan);

            const typeSpan = document.createElement('span');
            typeSpan.className = 'tree-node-type';
            typeSpan.textContent = `(${node.type})`;
            item.appendChild(typeSpan);

            if (node.text !== undefined && node.text !== null && node.text !== '') {
                const propSpan = document.createElement('span');
                propSpan.className = 'tree-node-prop';
                propSpan.textContent = `"${node.text}"`;
                item.appendChild(propSpan);
            } else if (node.type === 'Timer') {
                const propSpan = document.createElement('span');
                propSpan.className = 'tree-node-prop';
                propSpan.textContent = `${node.wait_time}s`;
                item.appendChild(propSpan);
            } else if (node.type === 'ColorRect') {
                const propSpan = document.createElement('span');
                propSpan.className = 'tree-node-prop';
                propSpan.style.color = node.color;
                propSpan.textContent = node.color;
                item.appendChild(propSpan);
            }

            // Pulsante elimina rapido (✕) solo per i nodi figli (non per la radice)
            if (depth > 0) {
                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'tree-node-delete-btn';
                delBtn.title = `Rimuovi nodo '${node.name}'`;
                delBtn.textContent = '✕';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.removeSceneNode(node);
                };
                item.appendChild(delBtn);
            }

            item.onclick = (e) => {
                e.stopPropagation();
                SoundFX.playClick();
                this.selectSceneNode(node);
            };

            treeContainer.appendChild(item);

            for (const child of node.children) {
                buildTreeDom(child, depth + 1);
            }
        };

        buildTreeDom(this.currentScene);

        // Aggiorna stato del pulsante Rimuovi nell'header della dock
        const removeBtn = document.getElementById('btn-remove-selected-node');
        if (removeBtn) {
            if (this.selectedSceneNode && this.selectedSceneNode !== this.currentScene && this.selectedSceneNode.parent) {
                removeBtn.classList.remove('hidden');
                removeBtn.title = `Rimuovi il nodo '${this.selectedSceneNode.name}' (Canc)`;
            } else {
                removeBtn.classList.add('hidden');
            }
        }
    },

    renderViewportOverlay() {
        const overlay = document.getElementById('exercise-ui-overlay');
        if (!overlay) return;

        overlay.innerHTML = '';
        if (!this.currentScene) return;

        const collectUiNodes = (node, list = []) => {
            if (node !== this.currentScene) {
                if (['Button', 'Label', 'ColorRect'].includes(node.type)) {
                    list.push(node);
                }
            }
            for (const child of node.children) {
                collectUiNodes(child, list);
            }
            return list;
        };

        const uiNodes = collectUiNodes(this.currentScene);
        if (uiNodes.length === 0) {
            overlay.style.display = 'none';
            return;
        }

        overlay.style.display = 'flex';

        for (const node of uiNodes) {
            if (node.type === 'Button') {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'godot-ui-btn';
                btn.textContent = node.text || node.name;
                btn.disabled = !!node.disabled;
                btn.title = `Clicca nodo Button: $${node.name}`;
                btn.addEventListener('click', () => {
                    if (window.SoundFX && window.SoundFX.playClick) {
                        window.SoundFX.playClick();
                    }
                    if (node.pressed) {
                        node.pressed.emit();
                    }
                    this.renderSceneDock();
                    this.renderViewportOverlay();
                });
                overlay.appendChild(btn);
            } else if (node.type === 'Label') {
                const lbl = document.createElement('div');
                lbl.className = 'godot-ui-label';
                lbl.textContent = node.text !== undefined ? node.text : '';
                overlay.appendChild(lbl);
            } else if (node.type === 'ColorRect') {
                const rect = document.createElement('div');
                rect.className = 'godot-ui-colorrect';
                rect.style.backgroundColor = node.color || '#438eff';
                if (node.size) {
                    rect.style.width = Math.min(220, Math.max(30, node.size.x)) + 'px';
                    rect.style.height = Math.min(60, Math.max(10, node.size.y)) + 'px';
                }
                overlay.appendChild(rect);
            }
        }
    },

    openAddNodeModal(context = 'exercise') {
        this.addNodeContext = context;
        const modal = document.getElementById('add-node-modal');
        if (modal) {
            modal.classList.remove('hidden');
            const nameInput = document.getElementById('node-name-input');
            if (nameInput) {
                nameInput.value = 'MioPulsante';
                nameInput.focus();
            }
        }
    },

    closeAddNodeModal() {
        const modal = document.getElementById('add-node-modal');
        if (modal) modal.classList.add('hidden');
    },

    confirmAddNode() {
        const selectedOpt = document.querySelector('.node-type-option.selected');
        const type = selectedOpt ? selectedOpt.getAttribute('data-node-type') : 'Button';
        const nameInput = document.getElementById('node-name-input');
        const textInput = document.getElementById('node-text-input');
        const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : ('Nodo_' + type);
        const text = textInput ? textInput.value.trim() : '';

        // Se siamo nella Sandbox, aggiungi al progetto sandbox corrente
        if (this.addNodeContext === 'sandbox') {
            this.addSandboxNode(name, type, text);
            this.closeAddNodeModal();
            return;
        }

        if (!this.currentScene && window.GD_Node) {
            this.currentScene = new GD_Node("Root");
        }
        if (!this.currentScene) return;

        let newNode;
        if (type === 'Button' && window.GD_Button) {
            newNode = new GD_Button(name);
            if (text) newNode.text = text;
        } else if (type === 'Label' && window.GD_Label) {
            newNode = new GD_Label(name);
            if (text) newNode.text = text;
        } else if (type === 'Timer' && window.GD_Timer) {
            newNode = new GD_Timer(name);
        } else if (type === 'ColorRect' && window.GD_ColorRect) {
            newNode = new GD_ColorRect(name);
        } else if (type === 'Node2D' && window.GD_Node2D) {
            newNode = new GD_Node2D(name);
        } else if (window.GD_Node) {
            newNode = new GD_Node(name);
        }

        if (newNode) {
            this.currentScene.add_child(newNode);
            this.renderSceneDock();
            this.renderViewportOverlay();
            this.closeAddNodeModal();
            this.showToast(`Nodo '$${name}' (${type}) aggiunto alla scena!`, 'success');
        }
    },


    // ==========================================================================
    // MINI-PROGETTO ARENA DEL GLADIATORE (P2)
    // ==========================================================================

    openArenaWorkspace(targetPhase = null) {
        SoundFX.playClick();
        const cat = document.getElementById('projects-catalog-section');
        const ws = document.getElementById('project-arena-workspace');
        if (cat) cat.classList.add('hidden');
        document.getElementById('competition-workspace')?.classList.add('hidden');
        document.getElementById('official-arena-workspace')?.classList.add('hidden');
        if (ws) ws.classList.remove('hidden');

        let phase = targetPhase;
        if (!phase) {
            phase = (this.state.arenaProject && this.state.arenaProject.currentPhase) ? this.state.arenaProject.currentPhase : 1;
        }
        this.loadArenaPhase(phase);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    closeArenaWorkspace() {
        SoundFX.playClick();
        const cat = document.getElementById('projects-catalog-section');
        const ws = document.getElementById('project-arena-workspace');
        if (cat) cat.classList.remove('hidden');
        if (ws) ws.classList.add('hidden');
        this.renderProjectsGrid();
    },

    loadArenaPhase(phaseNum) {
        if (typeof ARENA_PROJECT_DATA === 'undefined') return;
        const phaseData = ARENA_PROJECT_DATA.phases.find(p => p.phase === phaseNum) || ARENA_PROJECT_DATA.phases[0];
        if (!phaseData) return;

        // Salva preventivamente il codice della fase precedente prima del cambio
        const prevPhaseNum = this.state.arenaProject.currentPhase;
        if (prevPhaseNum && prevPhaseNum !== phaseNum) {
            const editorEl = document.getElementById('arena-code-editor');
            if (editorEl) {
                this.state.arenaProject.userCode[prevPhaseNum] = editorEl.value;
                this.saveStorage();
            }
        }

        this.state.arenaProject.currentPhase = phaseNum;
        this.state.arenaProject.hintsRevealed = 0;
        this.state.arenaProject.activeHintLevel = 1;

        // Aggiorna progress pill e badge fase
        const headerProg = document.getElementById('arena-header-progress');
        if (headerProg) headerProg.innerText = `Fase ${phaseNum} di 4`;

        const badge = document.getElementById('arena-phase-badge');
        if (badge) badge.innerText = `FASE ${phaseNum}`;

        const title = document.getElementById('arena-phase-title');
        if (title) title.innerText = phaseData.title;

        const subtitle = document.getElementById('arena-phase-subtitle');
        if (subtitle) subtitle.innerText = phaseData.subtitle;

        const narrative = document.getElementById('arena-narrative-box');
        if (narrative) narrative.innerHTML = `<p>${phaseData.narrative}</p>`;

        const taskBody = document.getElementById('arena-task-body');
        if (taskBody) taskBody.innerHTML = phaseData.task;

        // Render Stepper Fasi
        const stepperRow = document.getElementById('arena-stepper-row');
        if (stepperRow) {
            stepperRow.innerHTML = ARENA_PROJECT_DATA.phases.map(p => {
                const isCurrent = p.phase === phaseNum;
                const isDone = (this.state.arenaProject.completedPhases || []).includes(p.phase);
                return `
                    <div class="arena-step-item ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}" onclick="App.loadArenaPhase(${p.phase})">
                        <span class="step-num">${isDone ? '✓' : p.phase}</span>
                        <span class="step-title">${p.title.split(':')[0]}</span>
                    </div>
                `;
            }).join('<div class="arena-step-divider"></div>');
        }

        // Carica codice nell'editor con continuita tra fasi
        const editor = document.getElementById('arena-code-editor');
        if (editor) {
            let codeToLoad = this.state.arenaProject.userCode[phaseNum];
            if (!codeToLoad && phaseNum > 1 && this.state.arenaProject.userCode[phaseNum - 1]) {
                const prevCode = this.state.arenaProject.userCode[phaseNum - 1];
                if (phaseNum === 2 && !prevCode.includes('take_damage')) {
                    codeToLoad = prevCode.trim() + "\n\n# FASE 2: Implementa qui sotto func take_damage(quantita: int):\n";
                } else if (phaseNum === 3 && !prevCode.includes('heal')) {
                    codeToLoad = prevCode.trim() + "\n\n# FASE 3: Implementa qui sotto func heal(quantita: int):\n";
                } else if (phaseNum === 4 && !prevCode.includes('get_status')) {
                    codeToLoad = prevCode.trim() + "\n\n# FASE 4: Implementa qui sotto func get_status() -> String:\n";
                } else {
                    codeToLoad = prevCode;
                }
            }
            if (!codeToLoad) {
                codeToLoad = phaseData.initialCode;
            }
            editor.value = codeToLoad;

            // Auto-salvataggio persistente in tempo reale su ogni digitazione
            if (!editor.dataset.arenaBound) {
                editor.dataset.arenaBound = "true";
                let saveTimeout = null;
                editor.addEventListener('input', () => {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => {
                        const cur = App.state.arenaProject.currentPhase || 1;
                        App.state.arenaProject.userCode[cur] = editor.value;
                        App.saveStorage();
                    }, 300);
                });
            }
        }

        // Reset verifiche e box successo
        const testList = document.getElementById('arena-test-list');
        if (testList) {
            testList.innerHTML = `<div class="arena-empty-tests">Modifica il codice e clicca su "Verifica Fase Corrente" per avviare i test automatici.</div>`;
        }
        const statusBadge = document.getElementById('arena-phase-status');
        if (statusBadge) {
            const isDone = (this.state.arenaProject.completedPhases || []).includes(phaseNum);
            statusBadge.innerText = isDone ? '✓ Già Superata' : '• In attesa';
            statusBadge.style.color = isDone ? '#10b981' : '#94a3b8';
        }
        const successBox = document.getElementById('arena-phase-success-box');
        if (successBox) successBox.classList.add('hidden');

        // Render suggerimenti fase
        this.renderArenaHints(phaseData);

        // Reset live HUD
        this.updateLiveHud(100, 100, true, "In Forma");
        const logEl = document.getElementById('hud-combat-log');
        if (logEl) logEl.innerText = "Gladiatore pronto per la Fase " + phaseNum + ".";
    },

    async verifyArenaPhase() {
        SoundFX.playClick();
        if (typeof ARENA_PROJECT_DATA === 'undefined') return;
        const curPhase = this.state.arenaProject.currentPhase || 1;
        const phaseData = ARENA_PROJECT_DATA.phases.find(p => p.phase === curPhase);
        if (!phaseData) return;

        const editor = document.getElementById('arena-code-editor');
        const code = editor ? editor.value : "";
        this.state.arenaProject.userCode[curPhase] = code;
        this.saveStorage();

        const runBtn = document.getElementById('btn-run-arena-phase');
        if (runBtn) {
            runBtn.style.opacity = '0.7';
            runBtn.querySelector('.run-text').innerText = "Verifica in corso...";
        }

        try {
            const result = await GDScriptRuntime.execute(code);
            const checks = await phaseData.validate(result, GDScriptRuntime);
            const allPassed = checks.every(c => c.passed);

            const testList = document.getElementById('arena-test-list');
            if (testList) {
                testList.innerHTML = checks.map(c => `
                    <div class="test-row ${c.passed ? 'passed' : 'failed'}">
                        <div class="test-icon">${c.passed ? '✅' : '❌'}</div>
                        <div class="test-info">
                            <div class="test-desc">${c.desc}</div>
                            ${c.diff ? `<div class="test-diff">${this.escapeHtml(c.diff)}</div>` : ''}
                        </div>
                    </div>
                `).join('');
            }

            const statusBadge = document.getElementById('arena-phase-status');
            const successBox = document.getElementById('arena-phase-success-box');

            if (allPassed) {
                if (statusBadge) {
                    statusBadge.innerText = `✓ Superato (${checks.length}/${checks.length})`;
                    statusBadge.style.color = '#10b981';
                }
                SoundFX.playSuccess();
                ConfettiFX.burst();

                // Registra fase completata
                if (!this.state.arenaProject.completedPhases.includes(curPhase)) {
                    this.state.arenaProject.completedPhases.push(curPhase);
                    this.state.xp += 75; // Ricompensa XP per ogni fase
                    this.saveStorage();
                    this.updateStatsUI({ announceLevelUp: true });
                }

                if (successBox) {
                    successBox.classList.remove('hidden');
                    const msgEl = document.getElementById('arena-success-msg');
                    const subEl = document.getElementById('arena-success-sub');
                    const nextBtn = document.getElementById('btn-arena-next-phase');

                    if (curPhase >= 4) {
                        if (msgEl) msgEl.innerText = "🏆 PROGETTO ARENA COMPLETATO!";
                        if (subEl) subEl.innerText = "Incredibile! Hai programmato un sistema di combattimento e salute completo in GDScript 4. Puoi esportarlo subito per Godot Engine!";
                        if (nextBtn) nextBtn.innerText = "💾 Esporta per Godot 4 ➔";
                    } else {
                        if (msgEl) msgEl.innerText = `FASE ${curPhase} COMPLETATA!`;
                        if (subEl) subEl.innerText = "Tutti i requisiti logici e didattici sono stati superati con successo.";
                        if (nextBtn) nextBtn.innerText = `Procedi alla Fase ${curPhase + 1} ➔`;
                    }
                }

                // Aggiorna HUD live
                const scope = result.scope || {};
                const sal = typeof scope.salute === 'number' ? scope.salute : 100;
                const salMax = typeof scope.salute_max === 'number' ? scope.salute_max : 100;
                const isV = scope.is_vivo !== false;
                const st = (typeof scope.get_status === 'function') ? await scope.get_status() : (isV ? "In Forma" : "Sconfitto");
                this.updateLiveHud(sal, salMax, isV, st);

            } else {
                if (statusBadge) {
                    const passCount = checks.filter(c => c.passed).length;
                    statusBadge.innerText = `✗ Non superato (${passCount}/${checks.length})`;
                    statusBadge.style.color = '#ef4444';
                }
                if (successBox) successBox.classList.add('hidden');
                SoundFX.playError();
            }

        } catch (e) {
            console.error("Errore verifica arena:", e);
        } finally {
            if (runBtn) {
                runBtn.style.opacity = '1';
                runBtn.querySelector('.run-text').innerText = "Verifica Fase Corrente";
            }
        }
    },

    nextArenaPhase() {
        const curPhase = this.state.arenaProject.currentPhase || 1;
        if (curPhase < 4) {
            this.loadArenaPhase(curPhase + 1);
        } else {
            this.openGodotExportModal();
        }
    },

    resetArenaCode() {
        if (!confirm("Vuoi ripristinare il codice iniziale per questa fase? Tutte le modifiche non salvate andranno perse.")) return;
        SoundFX.playClick();
        const curPhase = this.state.arenaProject.currentPhase || 1;
        const phaseData = ARENA_PROJECT_DATA.phases.find(p => p.phase === curPhase);
        if (!phaseData) return;
        const editor = document.getElementById('arena-code-editor');
        if (editor) {
            editor.value = phaseData.initialCode;
            this.state.arenaProject.userCode[curPhase] = phaseData.initialCode;
            this.saveStorage();
        }
    },

    async simulateArenaCombat(action, val = 0) {
        SoundFX.playClick();
        const editor = document.getElementById('arena-code-editor');
        const code = editor ? editor.value : "";
        const logEl = document.getElementById('hud-combat-log');

        if (action === 'reset') {
            this.arenaGladiatorScope = null;
            this.state.arenaProject.liveSalute = 100;
            this.state.arenaProject.liveIsVivo = true;
            this.updateLiveHud(100, 100, true, "In Forma");
            if (logEl) logEl.innerText = "Salute ripristinata al massimo (100 HP).";
            return;
        }

        try {
            if (!this.arenaGladiatorScope || this.arenaGladiatorCode !== code) {
                // Per la simulazione manuale interattiva con i bottoni, disattiviamo l'auto-esecuzione di _ready()
                // in modo da partire sempre a salute massima (100 HP) e permettere all'utente di provare manualmente ogni pulsante
                const simCode = code.replace(/func\s+_ready\s*\(\s*\)\s*:/g, 'func __arena_manual_ready():');
                const res = await GDScriptRuntime.execute(simCode);
                if (res.error) {
                    if (logEl) logEl.innerText = `⚠️ Errore nel codice: ${res.error}`;
                    SoundFX.playError();
                    return;
                }
                this.arenaGladiatorScope = res.scope || {};
                this.arenaGladiatorCode = code;
            }
            const scope = this.arenaGladiatorScope;

            if (action === 'damage') {
                if (typeof scope.take_damage !== 'function') {
                    if (logEl) logEl.innerText = "⚠️ La funzione take_damage() non è ancora definita nel tuo codice!";
                    SoundFX.playError();
                    return;
                }

                await scope.take_damage(val);

                const newSalute = typeof scope.salute === 'number' ? scope.salute : 0;
                const newVivo = scope.is_vivo !== false && newSalute > 0;
                this.state.arenaProject.liveSalute = newSalute;
                this.state.arenaProject.liveIsVivo = newVivo;

                let st = "";
                if (typeof scope.get_status === 'function') {
                    try { st = await scope.get_status(); } catch (e) {}
                }
                if (!st) {
                    st = newVivo ? (newSalute < 35 ? "Critico" : newSalute < 70 ? "Ferito" : "In Forma") : "Sconfitto";
                }
                this.updateLiveHud(newSalute, 100, newVivo, st);
                if (logEl) {
                    logEl.innerText = newVivo 
                        ? `Colpo subito! -${val} HP. Salute residua: ${newSalute} HP.` 
                        : `Colpo letale (-${val} HP)! Il Gladiatore è K.O.`;
                }
                if (newVivo) SoundFX.playClick(); else SoundFX.playError();

            } else if (action === 'heal') {
                if (typeof scope.heal !== 'function') {
                    if (logEl) logEl.innerText = "⚠️ La funzione heal() non è ancora definita nel tuo codice!";
                    SoundFX.playError();
                    return;
                }

                await scope.heal(val);

                const newSalute = typeof scope.salute === 'number' ? scope.salute : 0;
                const newVivo = scope.is_vivo !== false && newSalute > 0;
                this.state.arenaProject.liveSalute = newSalute;
                this.state.arenaProject.liveIsVivo = newVivo;

                let st = "";
                if (typeof scope.get_status === 'function') {
                    try { st = await scope.get_status(); } catch (e) {}
                }
                if (!st) {
                    st = newVivo ? (newSalute < 35 ? "Critico" : newSalute < 70 ? "Ferito" : "In Forma") : "Sconfitto";
                }
                this.updateLiveHud(newSalute, 100, newVivo, st);
                if (logEl) {
                    logEl.innerText = newVivo 
                        ? `Pozione usata! +${val} HP. Salute attuale: ${newSalute} HP.` 
                        : `Impossibile curare: il gladiatore è già sconfitto!`;
                }
                if (newVivo) SoundFX.playSuccess(); else SoundFX.playError();
            }

        } catch (e) {
            if (logEl) logEl.innerText = `Errore di simulazione: ${e.message}`;
        }
    },

    updateLiveHud(salute, maxSalute = 100, isVivo = true, statusText = "In Forma") {
        const fillEl = document.getElementById('hud-health-fill');
        const textEl = document.getElementById('hud-health-text');
        const badgeEl = document.getElementById('hud-status-badge');

        const pct = Math.max(0, Math.min(100, Math.round((salute / maxSalute) * 100)));

        if (fillEl) {
            fillEl.style.width = `${pct}%`;
            fillEl.className = 'health-bar-fill ' + (pct >= 70 ? 'bar-healthy' : pct >= 30 ? 'bar-wounded' : 'bar-critical');
        }

        if (textEl) {
            textEl.innerText = `${salute} / ${maxSalute} HP`;
        }

        if (badgeEl) {
            if (!isVivo || salute <= 0) {
                badgeEl.innerText = "🔴 Sconfitto";
                badgeEl.className = "hud-status-badge status-dead";
            } else if (salute < 35) {
                badgeEl.innerText = "🟠 Critico";
                badgeEl.className = "hud-status-badge status-critical";
            } else if (salute < 70) {
                badgeEl.innerText = "🟡 Ferito";
                badgeEl.className = "hud-status-badge status-wounded";
            } else {
                badgeEl.innerText = "🟢 In Forma";
                badgeEl.className = "hud-status-badge status-healthy";
            }
        }
    },

    toggleArenaHints() {
        const content = document.getElementById('arena-hints-content');
        const arrow = document.getElementById('arena-hints-arrow');
        if (!content) return;
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
            SoundFX.playHint();
            content.classList.remove('hidden');
            if (arrow) arrow.innerText = '▲';
            if (this.state.arenaProject.hintsRevealed === 0) {
                this.state.arenaProject.hintsRevealed = 1;
                this.state.arenaProject.activeHintLevel = 1;
            }
            const phase = ARENA_PROJECT_DATA.phases.find(p => p.phase === this.state.arenaProject.currentPhase);
            if (phase) this.renderArenaHints(phase);
        } else {
            content.classList.add('hidden');
            if (arrow) arrow.innerText = '▼';
        }
    },

    unlockNextArenaHint() {
        const phase = ARENA_PROJECT_DATA.phases.find(p => p.phase === this.state.arenaProject.currentPhase);
        if (!phase || !phase.hints) return;
        if (this.state.arenaProject.hintsRevealed < phase.hints.length) {
            SoundFX.playHint();
            this.state.arenaProject.hintsRevealed++;
            this.state.arenaProject.activeHintLevel = this.state.arenaProject.hintsRevealed;
            this.renderArenaHints(phase);
        }
    },

    selectArenaHintLevel(lvl) {
        if (lvl <= this.state.arenaProject.hintsRevealed) {
            SoundFX.playClick();
            this.state.arenaProject.activeHintLevel = lvl;
            const phase = ARENA_PROJECT_DATA.phases.find(p => p.phase === this.state.arenaProject.currentPhase);
            if (phase) this.renderArenaHints(phase);
        }
    },

    renderArenaHints(phase) {
        if (!phase || !phase.hints) return;
        const total = phase.hints.length;
        if (this.state.arenaProject.hintsRevealed === 0) this.state.arenaProject.hintsRevealed = 1;

        const toggleText = document.getElementById('arena-hints-toggle-text');
        if (toggleText) toggleText.innerText = `Consiglio (${this.state.arenaProject.hintsRevealed}/${total} sbloccati)`;

        const nav = document.getElementById('arena-hint-stepper-nav');
        if (nav) {
            nav.innerHTML = phase.hints.map((h, i) => {
                const lvl = h.level || (i + 1);
                const isUnlocked = this.state.arenaProject.hintsRevealed >= lvl;
                const isActive = this.state.arenaProject.activeHintLevel === lvl;
                if (isUnlocked) {
                    return `<button type="button" class="hint-tab-btn ${isActive ? 'active' : ''}" onclick="App.selectArenaHintLevel(${lvl})"><span class="tab-icon">${h.icon}</span> Liv. ${lvl}</button>`;
                } else {
                    return `<button type="button" class="hint-tab-btn locked" onclick="App.unlockNextArenaHint()"><span class="tab-icon">🔒</span> Liv. ${lvl}</button>`;
                }
            }).join('');
        }

        const body = document.getElementById('arena-hint-body');
        if (body) {
            const activeIdx = Math.max(0, Math.min(this.state.arenaProject.activeHintLevel - 1, total - 1));
            const h = phase.hints[activeIdx];
            body.innerHTML = `
                <div class="hint-level-badge level-${h.level}">
                    <span class="badge-icon">${h.icon}</span>
                    <span class="badge-title">Livello ${h.level} — ${this.escapeHtml(h.label)}</span>
                </div>
                <div class="hint-body-formatted">${this.formatHintContent(h.text)}</div>
            `;
        }

        const nextBtn = document.getElementById('btn-arena-next-hint');
        if (nextBtn) {
            nextBtn.style.display = this.state.arenaProject.hintsRevealed >= total ? 'none' : 'inline-block';
        }
    },

    revealArenaPhaseSolution() {
        if (!confirm("Vuoi visualizzare la soluzione completa per questa fase?")) return;
        SoundFX.playHint();
        const phase = ARENA_PROJECT_DATA.phases.find(p => p.phase === this.state.arenaProject.currentPhase);
        if (!phase) return;
        const editor = document.getElementById('arena-code-editor');
        if (editor) {
            editor.value = phase.solution;
        }
    },

    // Esportazione Godot 4
    openGodotExportModal() {
        SoundFX.playClick();
        const modal = document.getElementById('godot-export-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeGodotExportModal() {
        const modal = document.getElementById('godot-export-modal');
        if (modal) modal.classList.add('hidden');
    },

    getArenaCurrentCode() {
        const editor = document.getElementById('arena-code-editor');
        const curPhase = (this.state.arenaProject && this.state.arenaProject.currentPhase) || 1;

        if (this.state.arenaProject && this.state.arenaProject.userCode && this.state.arenaProject.userCode[4]) {
            if (curPhase === 4 && editor && editor.value.trim().length > 0) {
                return editor.value;
            }
            return this.state.arenaProject.userCode[4];
        }

        if (editor && editor.value.trim().length > 0) return editor.value;
        return (this.state.arenaProject && this.state.arenaProject.userCode && this.state.arenaProject.userCode[curPhase]) 
            || ARENA_PROJECT_DATA.phases[3].solution;
    },

    downloadGodotProject() {
        SoundFX.playSuccess();
        const projectContent = ARENA_PROJECT_DATA.exportGodotProject("Arena del Gladiatore");
        this.downloadFile("project.godot", projectContent, "text/plain");
    },

    downloadGodotScript() {
        SoundFX.playSuccess();
        const code = this.getArenaCurrentCode();
        const gdContent = ARENA_PROJECT_DATA.exportGdScript(code);
        this.downloadFile("gladiator.gd", gdContent, "text/plain");
    },

    downloadGodotScene() {
        SoundFX.playSuccess();
        const tscnContent = ARENA_PROJECT_DATA.exportGodotScene("gladiator.gd");
        this.downloadFile("gladiator_arena.tscn", tscnContent, "text/plain");
    },

    downloadFile(filename, content, mimeType = "text/plain") {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

};

window.App = App;
window.unlockAll = (notify = true) => App.unlockAllLessons(notify);
window.lockAll = (notify = true) => App.lockToStandardProgression(notify);

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
