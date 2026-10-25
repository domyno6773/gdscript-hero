// GDScript Hero - Motore Applicativo con Capitoli, Sfide di Padronanza, Profilo, Missioni, Pratica & Progetti
const App = {
    state: {
        theme: "dark", // "dark" | "light"
        currentLessonId: 1,
        completedLessons: [1],
        finishedLessons: [],
        devAllUnlocked: false, // Default false: la modalità test/verifica si attiva solo in locale
        unlockedAchievements: [],
        xp: 0,
        streak: 1,
        level: 1,
        streakMode: "rilassato", // "rilassato" (2), "concentrato" (4), "lockin" (6)
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
                    code: `extends Node2D\n\nvar clicks = 0\n\nfunc _ready():\n    print("🎮 Benvenuto nella Sandbox di Godot 4!")\n    $Label.text = "Clicca il pulsante sotto per iniziare."\n\nfunc _on_button_pressed():\n    clicks += 1\n    print("Pulsante cliccato! Volte:", clicks)\n    $Label.text = "Bravo! Hai cliccato " + str(clicks) + " volte!"\n`,
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

    init() {
        this.loadStorage();
        this.ensureUnlockedConsistency();
        this.applyTheme(this.state.theme || 'dark');
        this.checkDailyQuestsReset();
        this.bindEvents();
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

        window.addEventListener('resize', () => {
            const roadmapView = document.getElementById('view-roadmap');
            if (roadmapView && !roadmapView.classList.contains('hidden')) {
                this.drawConnectingLines();
            }
        });
    },

    loadStorage() {
        try {
            const saved = localStorage.getItem('gdscript_hero_save_v4');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.xp = parsed.xp || 0;
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
            } else {
                this.state.currentWeekId = this.getWeekId();
                this.state.sandbox = this.getDefaultSandboxState();
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

    saveStorage() {
        const payload = {
            theme: this.state.theme,
            xp: this.state.xp,
            streak: this.state.streak,
            finishedLessons: this.state.finishedLessons,
            completedLessons: this.state.completedLessons,
            devAllUnlocked: this.state.devAllUnlocked,
            unlockedAchievements: this.state.unlockedAchievements,
            streakMode: this.state.streakMode,
            streakWeeks: this.state.streakWeeks,
            activeDaysThisWeek: this.state.activeDaysThisWeek,
            currentWeekId: this.state.currentWeekId,
            lastActiveDate: this.state.lastActiveDate,
            soundEnabled: SoundFX.enabled,
            soundVolume: SoundFX.volume,
            userCode: this.state.userCode,
            profile: this.state.profile,
            profileCustomized: this.state.profileCustomized,
            dailyQuests: this.state.dailyQuests,
            claimedQuestsCount: this.state.claimedQuestsCount,
            projectInterests: this.state.projectInterests,
            arenaProject: this.state.arenaProject,
            sandbox: this.state.sandbox
        };

        try {
            localStorage.setItem('gdscript_hero_save_v4', JSON.stringify(payload));
        } catch (e) {}

        // Sincronizza nel database dell'account collegato se autenticato
        if (window.AuthManager && typeof window.AuthManager.syncUserProgress === 'function') {
            window.AuthManager.syncUserProgress(payload);
        }
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
        if (this.state.dailyQuests.date !== today) {
            this.state.dailyQuests = {
                date: today,
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
            };
            this.saveStorage();
        }
    },

    recordDailyQuestProgress(type, amount = 1) {
        this.checkDailyQuestsReset();
        const cur = this.state.dailyQuests.progress[type] || 0;
        this.state.dailyQuests.progress[type] = cur + amount;
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
            if (readyCount > 0) {
                badge.style.background = '#10b981';
                badge.style.color = '#fff';
            } else {
                badge.style.background = 'var(--bg-panel)';
                badge.style.color = 'var(--accent-cyan)';
            }
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

    renderSidebarDailyQuests() {
        this.checkDailyQuestsReset();
        const list = document.getElementById('sidebar-quests-list');
        if (!list) return;
        list.innerHTML = '';

        const badge = document.getElementById('sidebar-quests-badge');
        const todayDateEl = document.getElementById('sidebar-today-date');
        if (todayDateEl) {
            const now = new Date();
            todayDateEl.innerText = now.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
        }

        let completedCount = 0;
        let readyCount = 0;

        DAILY_QUESTS_CONFIG.forEach(quest => {
            const prog = Math.min(quest.target, this.state.dailyQuests.progress[quest.id] || 0);
            const isCompleted = prog >= quest.target;
            const isClaimed = !!this.state.dailyQuests.claimed[quest.id];
            const percent = Math.round((prog / quest.target) * 100);

            if (isCompleted) completedCount++;
            if (isCompleted && !isClaimed) readyCount++;

            const item = document.createElement('div');
            item.className = `sidebar-quest-item ${isCompleted && !isClaimed ? 'ready' : ''} ${isClaimed ? 'claimed' : ''}`;
            item.innerHTML = `
                <div class="sidebar-quest-top">
                    <span class="sidebar-quest-icon">${quest.icon}</span>
                    <div class="sidebar-quest-title-wrap">
                        <span class="sidebar-quest-title" title="${quest.title}">${quest.title}</span>
                        <span class="sidebar-quest-reward">+${quest.xpReward} XP</span>
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
                        ${isClaimed ? '✓ Riscattato' : (isCompleted ? 'Riscatta Ricompensa ⚡' : 'In Corso')}
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
            todayDateEl.innerText = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' });
        }

        DAILY_QUESTS_CONFIG.forEach(quest => {
            const prog = Math.min(quest.target, this.state.dailyQuests.progress[quest.id] || 0);
            const isCompleted = prog >= quest.target;
            const isClaimed = !!this.state.dailyQuests.claimed[quest.id];
            const percent = Math.round((prog / quest.target) * 100);

            const card = document.createElement('div');
            card.className = `quest-card ${isCompleted && !isClaimed ? 'ready-to-claim' : ''}`;
            card.innerHTML = `
                <div class="quest-left">
                    <div class="quest-icon">${quest.icon}</div>
                    <div class="quest-info">
                        <div class="quest-title-row">
                            <span class="quest-title">${quest.title}</span>
                            <span class="quest-reward-badge">+${quest.xpReward} XP</span>
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
                        ${isClaimed ? '✓ Riscattato' : (isCompleted ? 'Riscatta' : 'In Corso')}
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
        const quest = DAILY_QUESTS_CONFIG.find(q => q.id === questId);
        if (!quest) return;

        this.state.dailyQuests.claimed[questId] = true;
        this.state.xp += quest.xpReward;
        this.state.claimedQuestsCount++;
        this.saveStorage();

        SoundFX.playFanfare();
        ConfettiFX.burst();

        this.showToast({
            icon: "🎯",
            tag: "RICOMPENSA RISCATTATA!",
            title: quest.title,
            desc: `Hai guadagnato +${quest.xpReward} XP extra!`
        });

        this.checkAchievements();
        this.updateStatsUI();
        this.updateQuestsBadge();
        this.renderSidebarDailyQuests();

        // Ri-renderizza il modale solo se era attualmente aperto
        const modal = document.getElementById('quests-modal');
        if (modal && !modal.classList.contains('hidden')) {
            this.openQuestsModal();
        }
    },

    // =========================================================
    // VISTA SANDBOX & MINI-IDE GODOT 4 (Libera Sperimentazione)
    // =========================================================
    getDefaultSandboxState() {
        return {
            activeProjectId: 'proj_default',
            projects: [
                {
                    id: 'proj_default',
                    name: 'Il Mio Gioco Godot',
                    code: `extends Node2D\n\nfunc _ready():\n    print("🎮 Sandbox avviata! Scrivi il tuo codice qui.")\n`,
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
            this.updateSandboxLineNumbers();
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

        // Tab e Scorciatoie da tastiera (Ctrl+Enter per eseguire scena)
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
                this.updateSandboxLineNumbers();
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runSandboxCode();
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

    openPracticeView() {
        SoundFX.playClick();
        this.hideAutocomplete();

        document.getElementById('view-roadmap').classList.add('hidden');
        document.getElementById('view-exercise').classList.add('hidden');
        document.getElementById('view-projects').classList.add('hidden');
        document.getElementById('view-practice').classList.remove('hidden');

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
            editor.value = cur.code || '';
            this.updateSandboxLineNumbers();
        }

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
            code: `extends Node2D\n\nfunc _ready():\n    print("🎮 Progetto ${name} avviato!")\n`,
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
            icon: '🚀',
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
            icon: '✏️',
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
            icon: '🗑️',
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

        const getNodeIcon = (type) => {
            switch (type) {
                case 'Button': return '🔘';
                case 'Label': return '🏷️';
                case 'Timer': return '⏱️';
                case 'ColorRect': return '🟥';
                case 'Sprite2D': return '🖼️';
                case 'CharacterBody2D': return '🤖';
                case 'ProgressBar': return '📊';
                case 'Node2D': return '🌳';
                default: return '📦';
            }
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
            item.innerHTML = `
                <span class="scene-node-icon">${icon}</span>
                <span class="scene-node-name">${node.name}</span>
                <span class="scene-node-type-badge">${node.type || 'Node'}</span>
            `;

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
                let extra = '';
                if (s.text !== undefined) extra = ` | Testo: <strong>"${s.text}"</strong>`;
                detailsEl.innerHTML = `<div>Nodo Selezionato: <strong>$${s.name}</strong> (${s.type || 'Node'})${extra}</div>`;
            } else {
                detailsEl.innerHTML = `<div class="sandbox-node-hint">💡 Clicca un nodo per selezionarlo o usa '➕ Nodo' per aggiungerne altri</div>`;
            }
        }
    },

    selectSandboxSceneNode(node) {
        this.selectedSandboxNode = node;
        this.renderSandboxSceneDock();
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
                    if (node.pressed) {
                        node.pressed.emit();
                    }

                    // Se c'è una funzione associata nello script (es. _on_button_pressed o _on_NomeNodo_pressed)
                    if (this.sandboxScope) {
                        const candidates = [
                            `_on_${node.name.toLowerCase()}_pressed`,
                            `_on_${node.name}_pressed`,
                            `_on_button_pressed`,
                            `on_button_pressed`
                        ];
                        for (const fn of candidates) {
                            if (typeof this.sandboxScope[fn] === 'function') {
                                try {
                                    await this.sandboxScope[fn]();
                                } catch (err) {
                                    const outputPre = document.getElementById('sandbox-console-output') || document.getElementById('practice-console-output');
                                    if (outputPre) {
                                        outputPre.innerText += `\n// Errore in ${fn}: ${err.message}`;
                                        outputPre.scrollTop = outputPre.scrollHeight;
                                    }
                                }
                                break;
                            }
                        }
                    }

                    this.renderSandboxSceneDock();
                    this.renderSandboxViewportOverlay();
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

        // Salva codice nel progetto attivo
        const cur = this.getActiveSandboxProject();
        if (cur) {
            cur.code = code;
            cur.updatedAt = new Date().toISOString();
            this.saveStorage();
        }

        // Ricostruisci scena da nodi
        this.sandboxScene = this.buildSceneFromNodes(cur ? cur.nodes : []);

        // Registra progresso missione code_runs
        this.recordDailyQuestProgress('code_runs', 1);

        try {
            const res = await GDScriptRuntime.execute(code, {
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
            this.sandboxScope = res.scope;
            const elapsed = Math.round(performance.now() - startT);

            if (res.logs && res.logs.length > 0) {
                outputPre.innerText = res.logs.join('\n');
                outputPre.style.color = '#38bdf8';
                if (statusTag) {
                    statusTag.innerText = `OK (${elapsed} ms)`;
                    statusTag.style.color = '#10b981';
                }
                SoundFX.playSuccess();
            } else if (res.error) {
                outputPre.innerText = `// Errore: ${res.error}`;
                outputPre.style.color = '#f87171';
                if (statusTag) {
                    statusTag.innerText = "Errore Script";
                    statusTag.style.color = '#ef4444';
                }
                SoundFX.playError();
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
            icon: '📦',
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
            icon: '➕',
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
            icon: '🗑️',
            tag: 'SCENA GODOT',
            title: 'Nodo Rimosso',
            desc: `Il nodo '$${targetNode.name}' è stato rimosso dalla scena.`
        });
    },

    // ==========================================
    // VISTA PROGETTI PRATICI (W.I.P.)
    // ==========================================
    openProjectsView() {
        SoundFX.playClick();
        this.hideAutocomplete();

        document.getElementById('view-roadmap').classList.add('hidden');
        document.getElementById('view-exercise').classList.add('hidden');
        document.getElementById('view-practice').classList.add('hidden');
        document.getElementById('view-projects').classList.remove('hidden');

        const cat = document.getElementById('projects-catalog-section');
        const ws = document.getElementById('project-arena-workspace');
        if (cat) cat.classList.remove('hidden');
        if (ws) ws.classList.add('hidden');

        this.updateNavSelection('projects');
        this.renderProjectsGrid();
    },

    renderProjectsGrid() {
        const grid = document.getElementById('projects-grid-container');
        if (!grid) return;
        grid.innerHTML = '';

        PROJECTS_DATA.forEach(proj => {
            const card = document.createElement('div');
            card.className = "project-card";
            card.onclick = () => this.openProjectPreview(proj.id);

            const pills = proj.topics.map(t => `<span class="topic-pill">${t}</span>`).join('');

            const isArena = proj.id === "project_arena";
            const completedPhasesCount = (this.state.arenaProject && this.state.arenaProject.completedPhases) ? this.state.arenaProject.completedPhases.length : 0;
            const progressLabel = isArena ? (completedPhasesCount >= 4 ? "✓ Completato (4/4)" : `Avanzamento: ${completedPhasesCount}/4 Fasi`) : `🔒 ${proj.levelReq}`;
            const btnText = isArena ? (completedPhasesCount > 0 ? (completedPhasesCount >= 4 ? "Rivedi Arena ➔" : "Continua Arena ➔") : "Inizia Progetto ➔") : "Anteprima ➔";
            const btnClass = isArena ? "btn-preview-project btn-playable-start" : "btn-preview-project";

            card.onclick = () => {
                if (isArena) {
                    this.openArenaWorkspace();
                } else {
                    this.openProjectPreview(proj.id);
                }
            };

            card.innerHTML = `
                <div>
                    <div class="project-card-top">
                        <div class="project-card-icon">${proj.icon}</div>
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
        if (!proj) return;

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
        this.state.streak = 1;
        this.state.level = 1;
        this.state.streakWeeks = 0;
        this.state.activeDaysThisWeek = [];
        this.state.finishedLessons = [];
        this.state.completedLessons = [1];
        this.state.unlockedAchievements = [];
        this.state.currentLessonId = 1;
        this.state.userCode = {};
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
            progress: { daily_exercise: 0, no_hints: 0, code_runs: 0 },
            claimed: { daily_exercise: false, no_hints: false, code_runs: false }
        };

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
        const xp = this.state.xp;
        let currentTier = LEVELS_CONFIG[0];

        for (let i = 0; i < LEVELS_CONFIG.length; i++) {
            if (xp >= LEVELS_CONFIG[i].minXp) {
                currentTier = LEVELS_CONFIG[i];
            }
        }

        const span = currentTier.maxXp - currentTier.minXp + 1;
        const progressInTier = xp - currentTier.minXp;
        const percent = Math.min(100, Math.max(0, Math.round((progressInTier / span) * 100)));
        const xpToNext = Math.max(0, (currentTier.maxXp + 1) - xp);

        return {
            tier: currentTier,
            percent: percent,
            xpToNext: xpToNext
        };
    },

    getTodayISO() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    getWeekId(d = new Date()) {
        const date = new Date(d.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        const week1 = new Date(date.getFullYear(), 0, 4);
        const weekNum = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    },

    getCurrentWeekDays() {
        const now = new Date();
        const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Lunedi, 6 = Domenica
        const monday = new Date(now);
        monday.setDate(now.getDate() - dayOfWeek);
        monday.setHours(0, 0, 0, 0);

        const days = [];
        const labels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
        const todayISO = this.getTodayISO();

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const iso = `${year}-${month}-${day}`;

            days.push({
                label: labels[i],
                iso: iso,
                isToday: iso === todayISO
            });
        }
        return days;
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

            if (metGoal) {
                this.state.streakWeeks += 1;
            } else {
                this.state.streakWeeks = 0; // Reset streak se obiettivo mancato!
            }

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
                SoundFX.playFanfare();
                this.showToast({
                    icon: "🔥",
                    tag: "OBIETTIVO SETTIMANALE RAGGIUNTO!",
                    title: `Streak ${currentTier.label} Conquistata!`,
                    desc: `Hai completato ${daysCount} giorni questa settimana. La serie è al sicuro (+50 XP)!`
                });
                this.state.xp += 50;
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

        ["rilassato", "concentrato", "lockin"].forEach(tier => {
            const el = document.getElementById(`tier-${tier}`);
            if (el) {
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

    setStreakMode(tier) {
        SoundFX.playClick();
        this.state.streakMode = tier;
        this.saveStorage();
        this.updateStatsUI();
        this.openStreakModal(); // Aggiorna la vista modale
    },

    updateStatsUI() {
        this.checkWeekReset();
        const xpEl = document.getElementById('xp-count');
        if (xpEl) xpEl.innerText = this.state.xp;

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
        if (scEl) scEl.innerText = `${this.state.streakWeeks}`;
        const sslEl = document.getElementById('streak-sub-label');
        if (sslEl) sslEl.innerText = `(${this.state.activeDaysThisWeek.length}/${currentTier.target}d)`;

        const streakPill = document.getElementById('btn-streak-modal');
        if (streakPill) {
            streakPill.title = `Serie Settimanale: ${this.state.streakWeeks} settimane (${this.state.activeDaysThisWeek.length} di ${currentTier.target} giorni completati)`;
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

        // Se è salito di livello, notifica con fanfare!
        if (this.state.level > prevLevel && prevLevel > 0) {
            SoundFX.playFanfare();
            ConfettiFX.burst();
            this.showToast({
                icon: "🎖️",
                tag: "LIVELLO SUPERATO!",
                title: `Sei salito a Livello ${info.tier.level}!`,
                desc: `Nuovo titolo: ${info.tier.title}`
            });
        }
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
            this.updateStatsUI();
        }
    },

    showToast(data) {
        const toast = document.getElementById('achievement-toast');
        if (!toast) return;

        document.getElementById('toast-icon').innerText = data.icon;
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

        // Progressione normale per il sito pubblico online:
        // Ricalcola lo sblocco effettivo basandosi SOLO sui finishedLessons reali dell'utente
        const normalUnlocked = [1];
        CHAPTERS_DATA.forEach(chapter => {
            const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id);
            const coreLessons = chapterLessons.filter(l => !l.isMastery);
            const masteryLesson = chapterLessons.find(l => l.isMastery);

            coreLessons.forEach((core, idx) => {
                if (this.state.finishedLessons.includes(core.id)) {
                    if (idx < coreLessons.length - 1) {
                        const nextCore = coreLessons[idx + 1];
                        if (!normalUnlocked.includes(nextCore.id)) {
                            normalUnlocked.push(nextCore.id);
                        }
                    } else {
                        // Ultimo core del capitolo: sblocca la sfida bonus di apprendimento!
                        if (masteryLesson && !normalUnlocked.includes(masteryLesson.id)) {
                            normalUnlocked.push(masteryLesson.id);
                        }
                        // E sblocca il primo livello core del capitolo successivo!
                        const nextChapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id + 1 && !l.isMastery);
                        if (nextChapterLessons.length > 0) {
                            const nextCore = nextChapterLessons[0];
                            if (!normalUnlocked.includes(nextCore.id)) {
                                normalUnlocked.push(nextCore.id);
                            }
                        }
                    }
                }
            });
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

    // Generatore SVG 3D Hexagon fedele allo stile Coddy
    renderHexNodeSVG(isMastery, status) {
        if (isMastery) {
            if (status === 'completed') {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <defs>
                            <linearGradient id="hexGoldComp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#b45309"/>
                            </linearGradient>
                        </defs>
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#78350f" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="url(#hexGoldComp)" stroke="#fde68a" stroke-width="2.5" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#fffbeb" />
                    </svg>
                `;
            } else if (status === 'current' || status === 'unlocked') {
                const pulseClass = (status === 'current') ? 'pulse-mastery' : '';
                return `
                    <svg class="hex-svg ${pulseClass}" width="84" height="84" viewBox="0 0 84 84">
                        <defs>
                            <linearGradient id="hexGoldActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#fbbf24"/>
                                <stop offset="100%" stop-color="#d97706"/>
                            </linearGradient>
                        </defs>
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#92400e" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="url(#hexGoldActive)" stroke="#fef08a" stroke-width="3" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#ffffff" />
                    </svg>
                `;
            } else {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#0f172a" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#1e293b" stroke="#334155" stroke-width="2" />
                        <polygon points="42,21 46.5,31.5 57.5,33 49.5,41 52,52 42,46 32,52 34.5,41 26.5,33 37.5,31.5" fill="#475569" opacity="0.6" />
                    </svg>
                `;
            }
        } else {
            // Core Node
            if (status === 'completed') {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <defs>
                            <linearGradient id="hexGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#34d399"/>
                                <stop offset="100%" stop-color="#059669"/>
                            </linearGradient>
                        </defs>
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#047857" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="url(#hexGreen)" stroke="#6ee7b7" stroke-width="2" />
                        <path d="M 27 39 L 37 49 L 57 29" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                `;
            } else if (status === 'current' || status === 'unlocked') {
                const pulseClass = (status === 'current') ? 'pulse-current' : '';
                return `
                    <svg class="hex-svg ${pulseClass}" width="84" height="84" viewBox="0 0 84 84">
                        <defs>
                            <linearGradient id="hexCyan" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#38bdf8"/>
                                <stop offset="100%" stop-color="#0284c7"/>
                            </linearGradient>
                        </defs>
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#075985" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="url(#hexCyan)" stroke="#bae6fd" stroke-width="2.5" />
                        <polygon points="36,28 36,52 54,40" fill="#ffffff" />
                    </svg>
                `;
            } else {
                return `
                    <svg class="hex-svg" width="84" height="84" viewBox="0 0 84 84">
                        <path d="M 2 40 L 2 48 L 22 82 L 62 82 L 82 48 L 82 40 L 62 74 L 22 74 Z" fill="#0f172a" />
                        <path d="M 22 6 L 62 6 L 82 40 L 62 74 L 22 74 L 2 40 Z" fill="#1e293b" stroke="#334155" stroke-width="2" />
                        <path d="M 36 34 L 36 30 C 36 26.7 38.7 24 42 24 C 45.3 24 48 26.7 48 30 L 48 34 M 32 34 L 52 34 C 53.1 34 54 34.9 54 36 L 54 50 C 54 51.1 53.1 52 52 52 L 32 52 C 30.9 52 30 51.1 30 50 L 30 36 C 30 34.9 30.9 34 32 34 Z" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" />
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
            const coreLessons = chapterLessons.filter(l => !l.isMastery);
            const masteryLesson = chapterLessons.find(l => l.isMastery);

            const chapterFinished = chapterLessons.filter(l => this.state.finishedLessons.includes(l.id)).length;
            const chapterTotal = chapterLessons.length;

            // Il capitolo è sbloccato se è il capitolo 1, oppure se contiene livelli già sbloccati, oppure se il capitolo precedente è stato completato
            let isChapterUnlocked = chapter.id === 1 || chapterLessons.some(l => this.state.completedLessons.includes(l.id));
            if (!isChapterUnlocked && chapter.id > 1) {
                const prevCoreLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id - 1 && !l.isMastery);
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
                <div class="chapter-progress-pill">${chapterFinished}/${chapterTotal} Livelli</div>
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
                    const firstUnfinishedCore = LESSONS_DATA.find(l => !l.isMastery && this.state.completedLessons.includes(l.id) && !this.state.finishedLessons.includes(l.id));
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
                node.className = `node-item ${statusClass} ${isMastery ? 'mastery' : ''}`;
                node.id = `node-lesson-${lesson.id}`;

                if (!isMastery && offset !== 0) {
                    node.style.transform = `translateX(${offset}px)`;
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
                        ${this.renderHexNodeSVG(isMastery, statusClass)}
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
                                <span>+${lesson.xp} XP</span>
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
            const coreLessons = chapterLessons.filter(l => !l.isMastery);
            const masteryLesson = chapterLessons.find(l => l.isMastery);

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

    openLesson(lessonId) {
        const lesson = LESSONS_DATA.find(l => l.id === lessonId);
        if (!lesson) return;

        this.state.currentLessonId = lessonId;
        this.state.hintsRevealed = 0;
        this.state.activeHintLevel = 1;
        this.hideAutocomplete();

        document.getElementById('view-roadmap').classList.add('hidden');
        document.getElementById('view-practice').classList.add('hidden');
        document.getElementById('view-projects').classList.add('hidden');
        document.getElementById('view-exercise').classList.remove('hidden');

        this.updateNavSelection('exercise');
        this.setMobileExerciseTab('instructions', false);

        if (lesson.initialNodes && Array.isArray(lesson.initialNodes) && window.GDScriptRuntime) {
            this.currentScene = GDScriptRuntime.buildScene(lesson);
        } else if (window.GD_Node) {
            this.currentScene = new GD_Node("Root");
        }
        this.renderSceneDock();
        this.renderViewportOverlay();

        const lessonContent = document.querySelector('.lesson-content');
        if (lesson.isMastery) {
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
                        <span class="target-icon">${lesson.isDebugging ? '🐛' : '🎯'}</span>
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

        document.getElementById('lesson-xp-badge').innerText = `+${lesson.xp} XP`;

        const savedCode = this.state.userCode[lessonId] || lesson.initialCode;
        const editor = document.getElementById('code-editor');
        editor.value = savedCode;
        this.updateLineNumbers();

        const headerNextBtn = document.getElementById('btn-header-next');
        if (headerNextBtn) {
            const hasNext = lessonId < LESSONS_DATA.length;
            const isNextUnlocked = hasNext && this.state.completedLessons.includes(lessonId + 1);
            if (hasNext && (this.state.finishedLessons.includes(lessonId) || (this.isLocalEnvironment() && isNextUnlocked))) {
                headerNextBtn.classList.remove('hidden');
            } else {
                headerNextBtn.classList.add('hidden');
            }
        }

        const headerPrevBtn = document.getElementById('btn-header-prev');
        if (headerPrevBtn) {
            if (lessonId > 1) {
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

    showRoadmap() {
        SoundFX.playClick();
        this.hideAutocomplete();
        document.getElementById('view-exercise').classList.add('hidden');
        document.getElementById('view-practice').classList.add('hidden');
        document.getElementById('view-projects').classList.add('hidden');
        document.getElementById('view-roadmap').classList.remove('hidden');

        this.updateNavSelection('roadmap');
        this.renderRoadmap();
    },

    updateNavSelection(viewName) {
        // Desktop nav buttons
        ['roadmap', 'editor', 'practice', 'projects'].forEach(key => {
            const btn = document.getElementById(`nav-${key}-btn`);
            if (btn) {
                if (key === viewName || (key === 'editor' && viewName === 'exercise')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });

        // Mobile bottom nav buttons
        ['roadmap', 'exercise', 'practice', 'projects'].forEach(key => {
            const mobBtn = document.getElementById(`mob-nav-${key}`);
            if (mobBtn) {
                if (key === viewName) {
                    mobBtn.classList.add('active');
                } else {
                    mobBtn.classList.remove('active');
                }
            }
        });
    },

    setMobileExerciseTab(tab, playSound = true) {
        if (playSound) SoundFX.playClick();
        const workspaceGrid = document.getElementById('exercise-workspace-grid');
        const btnTabInstructions = document.getElementById('btn-tab-instructions');
        const btnTabCode = document.getElementById('btn-tab-code');
        if (!workspaceGrid) return;

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

    setupEditor() {
        const editor = document.getElementById('code-editor');
        if (!editor) return;

        editor.addEventListener('input', () => {
            this.updateLineNumbers();
            this.checkAutocomplete();
            this.state.userCode[this.state.currentLessonId] = editor.value;
            this.saveStorage();
        });

        editor.addEventListener('keydown', (e) => {
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

            // Supporto Tab = 4 spazi
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
                this.updateLineNumbers();
                return;
            }

            // Scorciatoia Ctrl+Enter per eseguire
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runAndValidate();
            }
        });
    },

    checkAutocomplete() {
        const editor = document.getElementById('code-editor');
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

        this.state.autocompleteList = matches.slice(0, 6);
        this.state.selectedAutocompleteIndex = 0;
        this.renderAutocompletePopup();
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

    renderAutocompletePopup() {
        const popup = document.getElementById('autocomplete-popup');
        const editor = document.getElementById('code-editor');
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
                this.commitAutocompleteSelection();
            };
            popup.appendChild(el);
        });

        const caret = this.getCaretCoordinates(editor, editor.selectionStart);
        const wrapper = editor.parentElement;
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

    moveAutocompleteSelection(delta) {
        const len = this.state.autocompleteList.length;
        if (len === 0) return;
        this.state.selectedAutocompleteIndex = (this.state.selectedAutocompleteIndex + delta + len) % len;
        this.renderAutocompletePopup();
    },

    commitAutocompleteSelection() {
        const selected = this.state.autocompleteList[this.state.selectedAutocompleteIndex];
        if (!selected) return;

        const editor = document.getElementById('code-editor');
        const pos = editor.selectionStart;
        const textBefore = editor.value.substring(0, pos);
        const match = textBefore.match(/([a-zA-Z0-9_]+)$/);

        if (match) {
            const replaceStart = pos - match[1].length;
            editor.value = editor.value.substring(0, replaceStart) + selected.name + editor.value.substring(pos);
            editor.selectionStart = editor.selectionEnd = replaceStart + selected.name.length;
            this.updateLineNumbers();
            this.state.userCode[this.state.currentLessonId] = editor.value;
            this.saveStorage();
        }

        this.hideAutocomplete();
    },

    hideAutocomplete() {
        const popup = document.getElementById('autocomplete-popup');
        if (popup) popup.classList.add('hidden');
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
    },

    // ==========================================
    // VERIFICA DEL CODICE
    // ==========================================
    async runAndValidate() {
        SoundFX.playClick();
        const editor = document.getElementById('code-editor');
        const code = editor.value;
        const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
        if (!currentLesson) return;

        const runBtn = document.getElementById('btn-run-code');
        runBtn.style.opacity = '0.7';
        runBtn.querySelector('.run-text').innerText = "Verifica in corso...";

        // Registra progresso missione: esecuzione codice
        this.recordDailyQuestProgress('code_runs', 1);

        try {
            const result = await GDScriptRuntime.execute(code, { initialScene: this.currentScene, lesson: currentLesson });
            if (result.scene) {
                this.currentScene = result.scene;
                this.renderSceneDock();
                this.renderViewportOverlay();
            }

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

            const tests = await currentLesson.validate(result, GDScriptRuntime);
            const allPassed = tests.every(t => t.passed);

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
                    <div class="test-info">
                        <div class="test-desc">${test.desc}</div>
                        ${test.diff ? `<div class="test-diff">${test.diff}</div>` : ''}
                    </div>
                `;
                resultsContainer.appendChild(row);
            });

            const badge = document.getElementById('test-status-badge');
            if (allPassed) {
                badge.innerText = `✓ Superato (${tests.length}/${tests.length})`;
                badge.style.color = '#10b981';

                const isFirstTime = !this.state.finishedLessons.includes(currentLesson.id);
                if (isFirstTime) {
                    this.state.finishedLessons.push(currentLesson.id);
                    this.state.xp += currentLesson.xp;

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
                            // E sblocca SUBITO il primo livello del capitolo successivo!
                            const nextChapterLessons = LESSONS_DATA.filter(l => l.chapterId === currentLesson.chapterId + 1 && !l.isMastery);
                            if (nextChapterLessons.length > 0) {
                                const nextCore = nextChapterLessons[0];
                                if (!this.state.completedLessons.includes(nextCore.id)) {
                                    this.state.completedLessons.push(nextCore.id);
                                }
                            }
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
                    this.updateStatsUI();
                }

                // Registra missione quotidiana: esercizio completato
                this.recordDailyQuestProgress('daily_exercise', 1);

                // Se non ha usato aiuti, registra missione no_hints
                if (this.state.hintsRevealed === 0) {
                    this.recordDailyQuestProgress('no_hints', 1);
                }

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

                // Aggiorna modale vittoria
                const modalTitle = document.getElementById('modal-success-title');
                const modalSubtitle = document.getElementById('modal-success-subtitle');
                const modalGain = document.getElementById('modal-xp-gain');

                if (currentLesson.isMastery) {
                    if (modalTitle) modalTitle.innerText = "⭐ SFIDA DI APPRENDIMENTO SUPERATA!";
                    if (modalSubtitle) modalSubtitle.innerText = "Incredibile! Hai completato la sfida bonus e dimostrato la tua padronanza!";
                    if (modalGain) modalGain.innerText = `+${currentLesson.xp}`;
                } else {
                    const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === currentLesson.chapterId);
                    const coreLessons = chapterLessons.filter(l => !l.isMastery);
                    const isLastCore = (currentLesson.id === coreLessons[coreLessons.length - 1].id);

                    if (modalTitle) modalTitle.innerText = isLastCore ? "CAPITOLO COMPLETATO!" : "MISSIONE COMPIUTA!";
                    if (modalSubtitle) {
                        modalSubtitle.innerText = isLastCore 
                            ? "Ottimo lavoro! Hai sbloccato il capitolo successivo e la ⭐ Sfida di Apprendimento Bonus!"
                            : "Ottimo lavoro! Il tuo script GDScript funziona alla perfezione.";
                    }
                    if (modalGain) modalGain.innerText = `+${currentLesson.xp}`;
                }

                setTimeout(() => {
                    document.getElementById('success-modal').classList.remove('hidden');
                }, 300);

            } else {
                badge.innerText = `✗ Fallito (${tests.filter(t => t.passed).length}/${tests.length})`;
                badge.style.color = '#ef4444';
                SoundFX.playError();

                // Costruzione Feedback Didattico Contestuale (P1)
                const firstFailedTest = tests.find(t => !t.passed);
                const feedbackCard = this.buildContextualFeedback(result, currentLesson, firstFailedTest, tests);
                if (feedbackCard) {
                    resultsContainer.appendChild(feedbackCard);
                }
            }

        } catch (criticalErr) {
            console.error("Errore durante la verifica:", criticalErr);
            const realOutputPre = document.getElementById('real-output-pre');
            realOutputPre.innerText = `// Errore inaspettato: ${criticalErr.message}`;
            realOutputPre.style.color = '#f87171';
            SoundFX.playError();
        } finally {
            runBtn.style.opacity = '1';
            runBtn.querySelector('.run-text').innerText = "Verifica Codice";
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
        document.getElementById('nav-editor-btn').onclick = () => {
            SoundFX.playClick();
            this.openLesson(this.state.currentLessonId);
        };
        document.getElementById('nav-practice-btn').onclick = () => this.openPracticeView();
        document.getElementById('nav-projects-btn').onclick = () => this.openProjectsView();
        document.getElementById('btn-back-to-roadmap').onclick = () => this.showRoadmap();

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
        document.getElementById('btn-open-profile').onclick = () => this.openProfileModal();
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
        document.getElementById('level-pill').onclick = () => this.openAchievementsModal();

        // Serie Settimanale (Streak)
        document.getElementById('btn-streak-modal').onclick = () => this.openStreakModal();
        document.getElementById('btn-close-streak').onclick = () => this.closeStreakModal();

        ["rilassato", "concentrato", "lockin"].forEach(tier => {
            const el = document.getElementById(`tier-${tier}`);
            if (el) {
                el.onclick = () => this.setStreakMode(tier);
            }
        });

        // Verifica ed Editor
        document.getElementById('btn-run-code').onclick = () => this.runAndValidate();

        document.getElementById('btn-reset-code').onclick = () => {
            SoundFX.playClick();
            const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
            if (currentLesson && confirm("Vuoi ripristinare il codice iniziale e la scena di questo livello?")) {
                document.getElementById('code-editor').value = currentLesson.initialCode;
                this.updateLineNumbers();
                delete this.state.userCode[this.state.currentLessonId];
                if (currentLesson.initialNodes && Array.isArray(currentLesson.initialNodes) && window.GDScriptRuntime) {
                    this.currentScene = GDScriptRuntime.buildScene(currentLesson);
                } else if (window.GD_Node) {
                    this.currentScene = new GD_Node("Root");
                }
                this.selectedSceneNode = null;
                this.renderSceneDock();
                this.renderViewportOverlay();
                this.saveStorage();
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
            const nextId = this.state.currentLessonId + 1;
            const nextLesson = LESSONS_DATA.find(l => l.id === nextId);

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
            if (nextBtnHeader) nextBtnHeader.classList.remove('hidden');
        };

        const btnModalStay = document.getElementById('btn-modal-stay');
        if (btnModalStay) btnModalStay.onclick = stayInExercise;

        const btnModalClose = document.getElementById('btn-modal-close');
        if (btnModalClose) btnModalClose.onclick = stayInExercise;

        const btnHeaderNext = document.getElementById('btn-header-next');
        if (btnHeaderNext) {
            btnHeaderNext.onclick = () => {
                SoundFX.playClick();
                const nextId = this.state.currentLessonId + 1;
                const nextLesson = LESSONS_DATA.find(l => l.id === nextId);
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
                const prevId = this.state.currentLessonId - 1;
                const prevLesson = LESSONS_DATA.find(l => l.id === prevId);
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
            const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
            if (currentLesson) this.renderHintBox(currentLesson);
        }
    },

    unlockNextHintLevel() {
        const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
        if (!currentLesson) return;
        if (this.state.hintsRevealed < currentLesson.hints.length) {
            SoundFX.playHint();
            this.state.hintsRevealed++;
            this.state.activeHintLevel = this.state.hintsRevealed;
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
                const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
                if (!currentLesson) return;

                const hintBox = document.getElementById('hint-box');
                if (hintBox && hintBox.classList.contains('hidden')) {
                    SoundFX.playHint();
                    hintBox.classList.remove('hidden');
                    if (this.state.hintsRevealed === 0) {
                        this.state.hintsRevealed = 1;
                        this.state.activeHintLevel = 1;
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
                const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
                if (!currentLesson) return;
                if (confirm("Vuoi visualizzare la soluzione completa?")) {
                    SoundFX.playHint();
                    document.getElementById('code-editor').value = currentLesson.solution;
                    this.updateLineNumbers();
                }
            };
        }
    },

    openHintFromFeedback() {
        const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
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
                this.renderHintBox(currentLesson);
                this.checkAchievements();
                hintBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    },

    buildContextualFeedback(result, currentLesson, failedTest, allTests) {
        const card = document.createElement('div');
        card.className = 'didactic-feedback-card';

        let title = "🎯 Verifica Didattica: Requisito Non Soddisfatto";
        let icon = "💡";
        let explanation = "Il codice è stato eseguito, ma il risultato o lo stato generato non corrisponde a quanto richiesto dalla traccia.";
        let technicalDetail = "";

        if (result && result.error) {
            const errStr = String(result.error);
            const isSyntax = /syntaxerror|invalid or unexpected token|unexpected token|indentation|unexpected identifier/i.test(errStr);
            const isUndefined = /is not defined|referenceerror/i.test(errStr);
            if (isSyntax) {
                title = "🔍 Errore di Sintassi GDScript";
                icon = "🛠️";
                explanation = "Il compilatore GDScript non è riuscito a comprendere la struttura del codice. Controlla di aver racchiuso correttamente i testi tra virgolette doppie o singole, chiuso tutte le parentesi e aggiunto i due punti (:) al termine delle definizioni.";
            } else if (isUndefined) {
                title = "🔍 Errore di Sintassi o Nome Non Definito";
                icon = "🛠️";
                explanation = "GDScript non riconosce questo nome. Se intendevi assegnare una parola o un testo, racchiudilo tra virgolette (es. \"Eroe\"); altrimenti verifica di aver dichiarato la variabile con 'var' prima di usarla.";
            } else {
                title = "⚡ Errore durante l'Esecuzione (Runtime)";
                icon = "🛑";
                explanation = "Il codice si è interrotto durante l'esecuzione prima di raggiungere il risultato. Verifica il nome delle variabili dichiarate, gli indici degli array o le chiamate di metodi.";
            }
            technicalDetail = `<div class="didactic-tech-err"><code>${this.escapeHtml(errStr)}</code></div>`;
        } else if (failedTest && failedTest.desc) {
            explanation = `Il requisito non ancora soddisfatto è: <strong>${this.escapeHtml(failedTest.desc)}</strong>.`;
            if (failedTest.diff) {
                technicalDetail = `<div class="didactic-tech-err"><code>${this.escapeHtml(failedTest.diff)}</code></div>`;
            }
        }

        // Recupera l'indizio concettuale di Livello 1 per la riflessione
        let lvl1HintText = "Rileggi l'obiettivo dell'esercizio e verifica con attenzione ogni passaggio logico.";
        if (currentLesson.hints && currentLesson.hints.length > 0) {
            const h1 = currentLesson.hints[0];
            lvl1HintText = (typeof h1 === 'object' && h1.text) ? h1.text : String(h1);
        }

        const debugHtml = currentLesson.isDebugging ? `
            <div class="didactic-debug-badge">
                <span class="debug-badge-icon">🐛</span>
                <span><strong>Focus Debugging:</strong> ${this.escapeHtml(currentLesson.debugType || 'Correzione bug')} — In questo esercizio c'è un bug inserito appositamente nel codice iniziale. Esaminalo riga per riga per individuare la causa del malfunzionamento.</span>
            </div>
        ` : '';

        card.innerHTML = `
            <div class="didactic-card-header">
                <span class="didactic-card-icon">${icon}</span>
                <h4 class="didactic-card-title">${title}</h4>
            </div>
            <div class="didactic-card-body">
                ${debugHtml}
                <p class="didactic-card-explanation">${explanation}</p>
                ${technicalDetail}
                <div class="didactic-card-reflection-prompt">
                    <div class="reflection-prompt-header">
                        <span class="prompt-icon">💡</span>
                        <span class="prompt-text">Ti serve un consiglio logico per comprendere l'argomento?</span>
                    </div>
                    <button type="button" class="btn-reveal-reflection" onclick="App.openHintFromFeedback()">
                        <span>💭</span>
                        <span>Richiedi Indizio Concettuale (Livello 1)</span>
                    </button>
                </div>
            </div>
            <div class="didactic-card-footer">
                <button type="button" class="btn-open-hint-step" onclick="App.openHintFromFeedback()">
                    <span>💡</span>
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

        await window.AuthManager.init();

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
                    // Se già autenticato, disconnetti tornando a ospite
                    if (confirm('Vuoi davvero disconnetterti e tornare alla modalità Ospite Locale?')) {
                        window.AuthManager.logout();
                        this.updateStatsUI();
                        this.applyProfileUI();
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
                        window.AuthManager.logout();
                        this.updateStatsUI();
                        this.applyProfileUI();
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
                window.AuthManager.logout(); // assicura guest
                this.closeAuthModal();
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
                const shouldMerge = mergeCheckbox ? mergeCheckbox.checked : true;

                try {
                    this.clearAuthAlert();
                    if (isRegister) {
                        const progressToAttach = shouldMerge ? { ...this.state } : null;
                        const res = await window.AuthManager.registerWithEmail(name, email, password, progressToAttach);
                        this.showAuthAlert('Account creato con successo! Benvenuto, ' + res.user.name + '!', 'success');
                        SoundFX.playSuccess();
                        if (progressToAttach) {
                            this.saveStorage();
                        }
                    } else {
                        const res = await window.AuthManager.loginWithEmail(email, password);
                        this.showAuthAlert('Accesso effettuato! Bentornato, ' + res.user.name + '!', 'success');
                        SoundFX.playSuccess();

                        // Se l'account ha salvataggi cloud precedenti, caricali
                        if (res.account && res.account.progress) {
                            this.applyImportedState(res.account.progress, false);
                        }
                    }

                    setTimeout(() => {
                        this.closeAuthModal();
                    }, 900);
                } catch (err) {
                    SoundFX.playError();
                    this.showAuthAlert(err.message, 'error');
                }
            };
        }

        // 4. Accesso Rapido Google
        const btnGoogle = document.getElementById('btn-google-signin');
        const googlePickerModal = document.getElementById('google-picker-modal');
        const btnCloseGooglePicker = document.getElementById('btn-close-google-picker');

        if (btnGoogle) {
            btnGoogle.onclick = async () => {
                SoundFX.playClick();
                // 1. Se Supabase Cloud è attivo, prova ad avviare Google OAuth ufficiale
                if (window.AuthManager && window.AuthManager.isCloudActive()) {
                    try {
                        await window.AuthManager.loginWithGoogle();
                        return;
                    } catch (err) {
                        console.warn('[Google Auth]', err.message);
                        // Se il provider Google non è ancora configurato su Supabase, apri il dialogo di fallback
                        if (googlePickerModal) {
                            googlePickerModal.classList.remove('hidden');
                        } else {
                            this.showAuthAlert('Provider Google non ancora abilitato su Supabase: ' + err.message);
                        }
                        return;
                    }
                }

                // 2. Modalità locale / offline
                if (googlePickerModal) {
                    googlePickerModal.classList.remove('hidden');
                }
            };
        }

        if (btnCloseGooglePicker && googlePickerModal) {
            btnCloseGooglePicker.onclick = () => {
                SoundFX.playClick();
                googlePickerModal.classList.add('hidden');
            };
        }

        const googleAccPreset = document.getElementById('google-acc-preset');
        if (googleAccPreset) {
            googleAccPreset.onclick = async () => {
                SoundFX.playClick();
                const email = googleAccPreset.getAttribute('data-email') || 'godot.dev@gmail.com';
                const name = googleAccPreset.getAttribute('data-name') || 'Sviluppatore Godot';
                await this.completeGoogleLogin({ email, name });
            };
        }

        const btnConfirmCustomGoogle = document.getElementById('btn-confirm-custom-google');
        const googleCustomEmailInput = document.getElementById('google-custom-email-input');
        if (btnConfirmCustomGoogle && googleCustomEmailInput) {
            btnConfirmCustomGoogle.onclick = async () => {
                const customEmail = googleCustomEmailInput.value.trim();
                if (!customEmail || !customEmail.includes('@')) {
                    alert('Inserisci un indirizzo email Google valido.');
                    return;
                }
                const namePart = customEmail.split('@')[0];
                const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                await this.completeGoogleLogin({ email: customEmail, name: capitalized });
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

    async completeGoogleLogin(profile) {
        try {
            const googlePickerModal = document.getElementById('google-picker-modal');
            if (googlePickerModal) googlePickerModal.classList.add('hidden');

            const res = await window.AuthManager.loginWithGoogle(profile, { ...this.state });
            SoundFX.playSuccess();

            // Se l'account Google ha già salvataggi cloud, applicali
            if (res.account && res.account.progress) {
                this.applyImportedState(res.account.progress, false);
            }

            this.showAuthAlert(`Accesso con Google completato! Benvenuto, ${res.user.name}!`, 'success');
            setTimeout(() => {
                this.closeAuthModal();
            }, 900);
        } catch (e) {
            SoundFX.playError();
            this.showAuthAlert('Errore durante l\'accesso con Google: ' + e.message, 'error');
        }
    },

    updateAuthUI(user) {
        const isGuest = !user || user.isGuest === true;
        const navAuthIcon = document.getElementById('nav-auth-icon');
        const navAuthLabel = document.getElementById('nav-auth-label');
        const btnNavAuth = document.getElementById('btn-open-auth-nav');

        if (btnNavAuth) {
            if (isGuest) {
                btnNavAuth.classList.remove('logged-in');
                btnNavAuth.title = 'Modalità Ospite • Tocca per accedere';
            } else {
                btnNavAuth.classList.add('logged-in');
                btnNavAuth.title = `Connesso: ${user.email} • Tocca per gestire`;
            }
        }

        if (navAuthIcon) {
            if (isGuest) {
                navAuthIcon.innerText = '👤';
            } else if (user.provider === 'google') {
                navAuthIcon.innerText = '🌐';
            } else {
                navAuthIcon.innerText = '🟢';
            }
        }

        if (navAuthLabel) {
            if (isGuest) {
                navAuthLabel.innerText = 'Ospite';
            } else {
                const shortName = (user.name || 'Utente').split(' ')[0];
                navAuthLabel.innerText = shortName;
            }
        }

        // Aggiorna Sezione Profilo
        const profileBadge = document.getElementById('profile-acc-badge');
        const profileDesc = document.getElementById('profile-acc-desc');
        const btnProfileAuth = document.getElementById('btn-profile-open-auth');

        if (profileBadge) {
            profileBadge.innerText = isGuest ? 'Modalità Ospite (Locale)' : `✓ Cloud Attivo (${user.provider === 'google' ? 'Google' : 'Email'})`;
            profileBadge.style.color = isGuest ? '#38bdf8' : '#10b981';
            profileBadge.style.borderColor = isGuest ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        }

        if (profileDesc) {
            if (isGuest) {
                profileDesc.innerHTML = 'Stai giocando come <strong>Ospite Locale</strong>. I tuoi progressi sono salvati solo in questo browser. Accedi per salvarli nel cloud!';
            } else {
                profileDesc.innerHTML = `Connesso come <strong>${user.email}</strong>. Sincronizzazione automatica attiva nel cloud.`;
            }
        }

        if (btnProfileAuth) {
            btnProfileAuth.innerText = isGuest ? '🔑 Accedi / Crea Account' : '🚪 Disconnetti (Torna Ospite)';
        }

        // Aggiorna Sezione Impostazioni
        const settingsAccountDesc = document.getElementById('settings-account-desc');
        const btnSettingsAuth = document.getElementById('btn-settings-auth-action');

        if (settingsAccountDesc) {
            settingsAccountDesc.innerText = isGuest ? 'Modalità Ospite (Dati salvati in locale)' : `Connesso: ${user.email}`;
        }
        if (btnSettingsAuth) {
            btnSettingsAuth.innerText = isGuest ? '🔑 Accedi' : '🚪 Esci';
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
                tbody.innerHTML = `<tr><td colspan="5" class="table-empty-row" style="color: #ef4444;">Errore nel recupero dati: ${e.message}</td></tr>`;
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

    applyImportedState(data, notify = true) {
        if (!data) return;

        if (data.xp !== undefined) this.state.xp = data.xp;
        if (data.streak !== undefined) this.state.streak = data.streak;
        if (data.streakWeeks !== undefined) this.state.streakWeeks = data.streakWeeks;
        if (data.streakMode) this.state.streakMode = data.streakMode;
        if (data.activeDaysThisWeek) this.state.activeDaysThisWeek = data.activeDaysThisWeek;
        if (data.finishedLessons) this.state.finishedLessons = data.finishedLessons;
        if (data.completedLessons) this.state.completedLessons = data.completedLessons;
        if (data.unlockedAchievements) this.state.unlockedAchievements = data.unlockedAchievements;
        if (data.userCode) this.state.userCode = data.userCode;
        if (data.profile) this.state.profile = { ...this.state.profile, ...data.profile };
        if (data.profileCustomized !== undefined) this.state.profileCustomized = !!data.profileCustomized;
        if (data.dailyQuests) this.state.dailyQuests = data.dailyQuests;
        if (data.claimedQuestsCount !== undefined) this.state.claimedQuestsCount = data.claimedQuestsCount;
        if (data.sandbox) {
            this.state.sandbox = data.sandbox;
            const practiceView = document.getElementById('view-practice');
            if (practiceView && !practiceView.classList.contains('hidden')) {
                this.loadActiveSandboxProject();
            }
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

        // Carica codice nell'editor
        const editor = document.getElementById('arena-code-editor');
        if (editor) {
            let codeToLoad = this.state.arenaProject.userCode[phaseNum];
            if (!codeToLoad && phaseNum > 1 && this.state.arenaProject.userCode[phaseNum - 1]) {
                // Pre-popola con il codice funzionante della fase precedente
                codeToLoad = this.state.arenaProject.userCode[phaseNum - 1];
            }
            if (!codeToLoad) {
                codeToLoad = phaseData.initialCode;
            }
            editor.value = codeToLoad;
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
                    this.updateStatsUI();
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
                const res = await GDScriptRuntime.execute(code);
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
        if (editor && editor.value.trim().length > 0) return editor.value;
        const curPhase = this.state.arenaProject.currentPhase || 4;
        return this.state.arenaProject.userCode[curPhase] || (ARENA_PROJECT_DATA.phases[3].solution);
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
