// GDScript Hero - Motore Applicativo con Capitoli, Sfide di Padronanza, Profilo, Missioni, Pratica & Progetti
const App = {
    state: {
        theme: "dark", // "dark" | "light"
        currentLessonId: 1,
        completedLessons: [1],
        finishedLessons: [],
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
        autocompleteList: [],
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

    init() {
        this.loadStorage();
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

        // Inizializzazione Viewport 2D Godot Engine
        if (window.GodotViewport) {
            this.viewport = new GodotViewport('exercise-viewport-canvas');
            this.practiceViewport = new GodotViewport('practice-viewport-canvas');
            if (this.state.theme) {
                this.viewport.setTheme(this.state.theme);
                this.practiceViewport.setTheme(this.state.theme);
            }
        }

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
                this.state.unlockedAchievements = parsed.unlockedAchievements || [];
                this.state.streakMode = parsed.streakMode || "rilassato";
                this.state.streakWeeks = parsed.streakWeeks || 0;
                this.state.activeDaysThisWeek = parsed.activeDaysThisWeek || [];
                this.state.currentWeekId = parsed.currentWeekId || this.getWeekId();
                this.state.lastActiveDate = parsed.lastActiveDate || null;
                this.state.userCode = parsed.userCode || {};
                
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

                if (parsed.projectInterests) {
                    this.state.projectInterests = { ...this.state.projectInterests, ...parsed.projectInterests };
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
            }
        } catch (e) {
            console.warn("Storage non disponibile.");
        }
    },

    saveStorage() {
        try {
            localStorage.setItem('gdscript_hero_save_v4', JSON.stringify({
                theme: this.state.theme,
                xp: this.state.xp,
                streak: this.state.streak,
                finishedLessons: this.state.finishedLessons,
                completedLessons: this.state.completedLessons,
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
                projectInterests: this.state.projectInterests
            }));
        } catch (e) {}
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

    // ==========================================
    // VISTA PRATICA / PALESTRA (SANDBOX LIBERA)
    // ==========================================
    setupPracticeEditor() {
        const practiceEditor = document.getElementById('practice-code-editor');
        if (!practiceEditor) return;

        if (!practiceEditor.value) {
            practiceEditor.value = `func _ready():\n    # Benvenuto nella Palestra di GDScript 4!\n    # Scrivi qui qualsiasi codice e premi "Esegui Script"\n    var saluto = "Pronto a sviluppare su Godot!"\n    print(saluto)\n`;
        }
        this.updatePracticeLineNumbers();

        practiceEditor.addEventListener('input', () => {
            this.updatePracticeLineNumbers();
        });

        practiceEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = practiceEditor.selectionStart;
                const end = practiceEditor.selectionEnd;
                practiceEditor.value = practiceEditor.value.substring(0, start) + "    " + practiceEditor.value.substring(end);
                practiceEditor.selectionStart = practiceEditor.selectionEnd = start + 4;
                this.updatePracticeLineNumbers();
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.runPracticeCode();
            }
        });
    },

    updatePracticeLineNumbers() {
        const editor = document.getElementById('practice-code-editor');
        const linesEl = document.getElementById('practice-line-numbers');
        if (!editor || !linesEl) return;

        const count = editor.value.split('\n').length;
        let nums = '';
        for (let i = 1; i <= Math.max(count, 1); i++) {
            nums += i + '\n';
        }
        linesEl.innerText = nums;
    },

    openPracticeView() {
        SoundFX.playClick();
        this.hideAutocomplete();

        document.getElementById('view-roadmap').classList.add('hidden');
        document.getElementById('view-exercise').classList.add('hidden');
        document.getElementById('view-projects').classList.add('hidden');
        document.getElementById('view-practice').classList.remove('hidden');

        this.updateNavSelection('practice');
        this.updatePracticeLineNumbers();
        setTimeout(() => this.practiceViewport && this.practiceViewport.resize(), 60);
    },

    async runPracticeCode() {
        SoundFX.playClick();
        const editor = document.getElementById('practice-code-editor');
        const outputPre = document.getElementById('practice-console-output');
        const statusTag = document.getElementById('practice-status-tag');
        if (!editor || !outputPre) return;

        statusTag.innerText = "In esecuzione...";
        statusTag.style.color = "#f59e0b";

        const startT = performance.now();
        const code = editor.value;

        // Registra progresso missione quotidiana (esecuzioni codice)
        this.recordDailyQuestProgress('code_runs', 1);

        try {
            const res = await GDScriptRuntime.execute(code);
            const elapsed = Math.round(performance.now() - startT);

            if (res.logs && res.logs.length > 0) {
                outputPre.innerText = res.logs.join('\n');
                outputPre.style.color = '#38bdf8';
                statusTag.innerText = `OK (${elapsed} ms)`;
                statusTag.style.color = '#10b981';
                SoundFX.playSuccess();
            } else if (res.error) {
                outputPre.innerText = `// Errore: ${res.error}`;
                outputPre.style.color = '#f87171';
                statusTag.innerText = "Errore Script";
                statusTag.style.color = '#ef4444';
                SoundFX.playError();
            } else {
                outputPre.innerText = "// Esecuzione completata (nessun output print a console)";
                outputPre.style.color = '#94a3b8';
                statusTag.innerText = `OK (${elapsed} ms)`;
                statusTag.style.color = '#10b981';
            }

            if (this.practiceViewport) {
                this.practiceViewport.updateFromExecution(res, null, !res.error);
            }
        } catch (e) {
            outputPre.innerText = `// Errore inaspettato: ${e.message}`;
            outputPre.style.color = '#f87171';
            statusTag.innerText = "Errore Critico";
            statusTag.style.color = '#ef4444';
            SoundFX.playError();
        }
    },

    clearPracticeConsole() {
        SoundFX.playClick();
        const outputPre = document.getElementById('practice-console-output');
        const statusTag = document.getElementById('practice-status-tag');
        if (outputPre) outputPre.innerText = "// Console ripulita";
        if (statusTag) statusTag.innerText = "Pronto";
    },

    loadPracticeTemplate(type) {
        const editor = document.getElementById('practice-code-editor');
        if (!editor) return;

        const templates = {
            hello: `func _ready():\n    # Stampa multipla e commenti\n    print("=== AVVIO MOTORE GODOT 4 ===")\n    print("Benvenuto sviluppatore!")\n`,
            rpg: `func _ready():\n    # Scheda del personaggio\n    var nome: String = "Cavaliere"\n    var salute: int = 100\n    var difesa: float = 12.5\n    var scudo: bool = true\n    print("Eroe: ", nome, " | HP: ", salute)\n`,
            math: `func _ready():\n    # Calcolo danno e bottino\n    var monete: int = 250\n    var membri: int = 3\n    var a_testa: int = monete / membri\n    var resto: int = monete % membri\n    print("Monete per ciascuno: ", a_testa)\n    print("Resto allo scrigno: ", resto)\n`,
            logic: `func _ready():\n    # Condizioni con if, elif ed else\n    var punti_vita: int = 35\n    if punti_vita > 70:\n        print("Stato Ottimo")\n    elif punti_vita > 20:\n        print("Personaggio Ferito!")\n    else:\n        print("Attenzione: Stato Critico!")\n`,
            vector: `func _ready():\n    # Movimento 2D con Vector2\n    var posizione = Vector2(100, 200)\n    var velocita = Vector2(15, -20)\n    posizione.x += velocita.x\n    posizione.y += velocita.y\n    print("Nuova posizione 2D: ", posizione)\n`
        };

        if (templates[type]) {
            SoundFX.playClick();
            editor.value = templates[type];
            this.updatePracticeLineNumbers();
        }
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
                    <span class="project-req-text">🔒 ${proj.levelReq}</span>
                    <button class="btn-preview-project">Anteprima ➔</button>
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
        document.getElementById('xp-count').innerText = this.state.xp;

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

        document.getElementById('streak-count').innerText = `${this.state.streakWeeks}`;
        document.getElementById('streak-sub-label').innerText = `(${this.state.activeDaysThisWeek.length}/${currentTier.target}d)`;

        const streakPill = document.getElementById('btn-streak-modal');
        if (streakPill) {
            streakPill.title = `Serie Settimanale: ${this.state.streakWeeks} settimane (${this.state.activeDaysThisWeek.length} di ${currentTier.target} giorni completati)`;
        }

        const info = this.getCurrentLevelInfo();
        const prevLevel = this.state.level;
        this.state.level = info.tier.level;

        // Aggiorna badge e barra mini del livello
        document.getElementById('level-badge').innerText = `Lv. ${info.tier.level}`;
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
    renderRoadmap() {
        const container = document.getElementById('chapters-roadmap-flow');
        if (!container) return;
        container.innerHTML = '';

        const total = LESSONS_DATA.length;
        const finishedCount = this.state.finishedLessons.length;
        const percent = Math.round((finishedCount / total) * 100);

        const progressFill = document.getElementById('overall-progress-fill');
        if (progressFill) progressFill.style.width = `${percent}%`;

        const statsText = document.getElementById('completed-count-text');
        if (statsText) statsText.innerText = `${finishedCount} di ${total} completati (${percent}%)`;

        this.renderSidebarDailyQuests();

        CHAPTERS_DATA.forEach(chapter => {
            const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id);
            const chapterFinished = chapterLessons.filter(l => this.state.finishedLessons.includes(l.id)).length;
            const chapterTotal = chapterLessons.length;
            // Il capitolo è sbloccato se è il capitolo 1, oppure se l'ultima lezione del capitolo precedente è stata completata
            let isChapterUnlocked = chapter.id === 1;
            if (chapter.id > 1) {
                const prevChapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id - 1);
                const lastPrev = prevChapterLessons[prevChapterLessons.length - 1];
                if (lastPrev && this.state.finishedLessons.includes(lastPrev.id)) {
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

            chapterLessons.forEach((lesson, index) => {
                const isFinished = this.state.finishedLessons.includes(lesson.id);
                const isUnlocked = this.state.completedLessons.includes(lesson.id);
                const isCurrent = isUnlocked && !isFinished;

                let statusClass = 'locked';
                if (isFinished) {
                    statusClass = 'completed';
                } else if (isCurrent || (isUnlocked && lesson.id === 1)) {
                    statusClass = 'current';
                }

                const node = document.createElement('div');
                node.className = `node-item ${statusClass} ${lesson.isMastery ? 'mastery' : ''}`;
                node.onclick = () => {
                    if (isUnlocked) {
                        SoundFX.playClick();
                        this.openLesson(lesson.id);
                    } else {
                        SoundFX.playError();
                    }
                };

                const zigzagOffset = (index % 2 === 0 ? -45 : 45);
                node.style.transform = `translateX(${zigzagOffset}px)`;

                node.innerHTML = `
                    <div class="node-pedestal"></div>
                    <div class="node-button">
                        <span class="node-emoji">${lesson.icon}</span>
                        ${isFinished ? '<div class="node-status-badge">✓</div>' : ''}
                        ${isCurrent ? '<div class="node-current-tag">INIZIA</div>' : ''}
                    </div>
                    ${lesson.isMastery ? `<div class="mastery-crown-tag">⚔️ PADRONANZA (+${lesson.xp} XP)</div>` : ''}
                    <div class="node-label">${lesson.title}</div>
                `;

                nodesList.appendChild(node);
            });

            treeWrapper.appendChild(nodesList);
            section.appendChild(treeWrapper);
            container.appendChild(section);
        });

        setTimeout(() => {
            this.drawConnectingLines();
        }, 60);
    },

    // Generatore tracciati curvi SVG per ciascun capitolo
    drawConnectingLines() {
        CHAPTERS_DATA.forEach(chapter => {
            const svg = document.getElementById(`tree-svg-chapter-${chapter.id}`);
            const wrapper = document.getElementById(`tree-wrapper-chapter-${chapter.id}`);
            const nodesContainer = document.getElementById(`nodes-container-chapter-${chapter.id}`);
            if (!svg || !wrapper || !nodesContainer) return;

            const nodeElements = nodesContainer.querySelectorAll('.node-item');
            if (nodeElements.length < 2) return;

            const contRect = wrapper.getBoundingClientRect();
            svg.setAttribute('width', contRect.width);
            svg.setAttribute('height', contRect.height);
            svg.innerHTML = '';

            const chapterLessons = LESSONS_DATA.filter(l => l.chapterId === chapter.id);

            for (let i = 0; i < nodeElements.length - 1; i++) {
                const btn1 = nodeElements[i].querySelector('.node-button');
                const btn2 = nodeElements[i + 1].querySelector('.node-button');
                if (!btn1 || !btn2) continue;

                const r1 = btn1.getBoundingClientRect();
                const r2 = btn2.getBoundingClientRect();

                const x1 = Math.round(r1.left + r1.width / 2 - contRect.left);
                const y1 = Math.round(r1.top + r1.height / 2 - contRect.top);
                const x2 = Math.round(r2.left + r2.width / 2 - contRect.left);
                const y2 = Math.round(r2.top + r2.height / 2 - contRect.top);

                const midY = Math.round((y1 + y2) / 2);
                const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

                const nextLesson = chapterLessons[i + 1];
                const isNextFinished = this.state.finishedLessons.includes(nextLesson.id);
                const isNextUnlocked = this.state.completedLessons.includes(nextLesson.id);

                let pathClass = 'locked';
                if (isNextFinished) {
                    pathClass = 'completed';
                } else if (isNextUnlocked) {
                    pathClass = 'unlocked';
                }

                // Linea nera sottostante per effetto spessore 3D
                const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                bgPath.setAttribute('d', pathD);
                bgPath.setAttribute('class', 'tree-path-bg');
                svg.appendChild(bgPath);

                // Linea principale (tratteggiata / solida ciano / verde)
                const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                mainPath.setAttribute('d', pathD);
                mainPath.setAttribute('class', `tree-path ${pathClass}`);
                svg.appendChild(mainPath);
            }
        });
    },

    openLesson(lessonId) {
        const lesson = LESSONS_DATA.find(l => l.id === lessonId);
        if (!lesson) return;

        this.state.currentLessonId = lessonId;
        this.state.hintsRevealed = 0;
        this.hideAutocomplete();

        document.getElementById('view-roadmap').classList.add('hidden');
        document.getElementById('view-practice').classList.add('hidden');
        document.getElementById('view-projects').classList.add('hidden');
        document.getElementById('view-exercise').classList.remove('hidden');

        this.updateNavSelection('exercise');
        this.setMobileExerciseTab('instructions', false);

        document.getElementById('lesson-title').innerText = lesson.title;
        document.getElementById('lesson-theory').innerHTML = lesson.theory;
        document.getElementById('lesson-task').innerHTML = lesson.task;
        document.getElementById('lesson-xp-badge').innerText = `+${lesson.xp} XP`;

        const savedCode = this.state.userCode[lessonId] || lesson.initialCode;
        const editor = document.getElementById('code-editor');
        editor.value = savedCode;
        this.updateLineNumbers();

        const headerNextBtn = document.getElementById('btn-header-next');
        if (headerNextBtn) {
            if (this.state.finishedLessons.includes(lessonId)) {
                headerNextBtn.classList.remove('hidden');
            } else {
                headerNextBtn.classList.add('hidden');
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

        document.getElementById('hint-box').classList.add('hidden');
        document.getElementById('hint-toggle-text').innerText = `Ti serve un consiglio? (0/${lesson.hints.length} usati)`;

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
            const result = await GDScriptRuntime.execute(code);

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

                    const nextId = currentLesson.id + 1;
                    if (nextId <= LESSONS_DATA.length && !this.state.completedLessons.includes(nextId)) {
                        this.state.completedLessons.push(nextId);
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
                    if (modalTitle) modalTitle.innerText = "⚔️ SFIDA DI PADRONANZA SUPERATA!";
                    if (modalSubtitle) modalSubtitle.innerText = "Incredibile! Hai dimostrato la tua padronanza assoluta conquistando il capitolo!";
                    if (modalGain) modalGain.innerText = `+${currentLesson.xp}`;
                } else {
                    if (modalTitle) modalTitle.innerText = "MISSIONE COMPIUTA!";
                    if (modalSubtitle) modalSubtitle.innerText = "Ottimo lavoro! Il tuo script GDScript funziona alla perfezione.";
                    if (modalGain) modalGain.innerText = `+${currentLesson.xp}`;
                }

                setTimeout(() => {
                    document.getElementById('success-modal').classList.remove('hidden');
                }, 300);

            } else {
                badge.innerText = `✗ Fallito (${tests.filter(t => t.passed).length}/${tests.length})`;
                badge.style.color = '#ef4444';
                SoundFX.playError();
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

        // Palestra di Codice
        document.getElementById('btn-practice-run').onclick = () => this.runPracticeCode();
        document.getElementById('btn-practice-clear').onclick = () => this.clearPracticeConsole();
        document.getElementById('btn-practice-reset').onclick = () => {
            SoundFX.playClick();
            const ed = document.getElementById('practice-code-editor');
            if (ed) {
                ed.value = `func _ready():\n    # Scrivi qui il tuo codice GDScript...\n    pass\n`;
                this.updatePracticeLineNumbers();
            }
        };

        const templateSelect = document.getElementById('practice-template-select');
        if (templateSelect) {
            templateSelect.onchange = (e) => {
                if (e.target.value) {
                    this.loadPracticeTemplate(e.target.value);
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
            if (currentLesson && confirm("Vuoi ripristinare il codice iniziale di questo livello?")) {
                document.getElementById('code-editor').value = currentLesson.initialCode;
                this.updateLineNumbers();
                delete this.state.userCode[this.state.currentLessonId];
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

        const btnToggleHint = document.getElementById('btn-toggle-hint');
        btnToggleHint.onclick = () => {
            const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
            if (!currentLesson) return;

            const hintBox = document.getElementById('hint-box');
            if (hintBox.classList.contains('hidden')) {
                SoundFX.playHint();
                hintBox.classList.remove('hidden');
                if (this.state.hintsRevealed === 0) {
                    this.state.hintsRevealed = 1;
                }
                this.displayHint(currentLesson);
                this.checkAchievements();
            } else {
                hintBox.classList.add('hidden');
            }
        };

        document.getElementById('btn-next-hint').onclick = () => {
            const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
            if (!currentLesson) return;
            if (this.state.hintsRevealed < currentLesson.hints.length) {
                SoundFX.playHint();
                this.state.hintsRevealed++;
                this.displayHint(currentLesson);
            }
        };

        document.getElementById('btn-reveal-solution').onclick = () => {
            const currentLesson = LESSONS_DATA.find(l => l.id === this.state.currentLessonId);
            if (!currentLesson) return;
            if (confirm("Vuoi visualizzare la soluzione completa?")) {
                SoundFX.playHint();
                document.getElementById('code-editor').value = currentLesson.solution;
                this.updateLineNumbers();
            }
        };

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
    },

    displayHint(lesson) {
        const hintIdx = Math.min(this.state.hintsRevealed - 1, lesson.hints.length - 1);
        document.getElementById('hint-text').innerText = lesson.hints[hintIdx];
        document.getElementById('hint-toggle-text').innerText = `Consiglio (${this.state.hintsRevealed}/${lesson.hints.length})`;

        const nextBtn = document.getElementById('btn-next-hint');
        if (this.state.hintsRevealed >= lesson.hints.length) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'inline-block';
        }
    }
};

window.App = App;

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
