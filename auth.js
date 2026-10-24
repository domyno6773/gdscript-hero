/**
 * ===================================================================
 * GDSCRIPT HERO - AUTH & CLOUD SYNC MANAGER (auth.js)
 * Gestione Autenticazione (Ospite, Email/Password, Google OAuth)
 * Integrazione Database Cloud Gratuito Supabase & Backup Locale
 * Supporto nativo per PC e Dispositivi Mobili.
 * ===================================================================
 */

const AuthManager = {
    SESSION_KEY: 'gdscript_hero_auth_session',
    ACCOUNTS_KEY: 'gdscript_hero_accounts_db',

    currentUser: null,
    supabaseClient: null,
    listeners: [],

    /**
     * Inizializzazione: verifica se Supabase è configurato,
     * ripristina la sessione o imposta la modalità Ospite.
     */
    async init() {
        // 1. Inizializza client Supabase se le credenziali sono presenti
        if (typeof window.supabase !== 'undefined' && window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
            try {
                this.supabaseClient = window.supabase.createClient(
                    window.SupabaseConfig.url,
                    window.SupabaseConfig.anonKey
                );
                console.log('[AuthManager] Supabase Cloud connesso con successo!');

                // Ascolta gli eventi di sessione Supabase (OAuth redirect, login, refresh)
                this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                    if (session && session.user) {
                        const u = session.user;
                        const sessionUser = {
                            id: u.id,
                            isGuest: false,
                            provider: u.app_metadata?.provider || (u.email?.includes('gmail') ? 'google' : 'email'),
                            name: u.user_metadata?.name || u.user_metadata?.full_name || u.email.split('@')[0],
                            email: u.email,
                            photoURL: u.user_metadata?.avatar_url || null,
                            createdAt: u.created_at || new Date().toISOString()
                        };
                        this.saveSession(sessionUser);

                        // Carica i progressi cloud salvati per questo utente
                        const cloudSave = await this.fetchFromCloud();
                        if (cloudSave && window.App && typeof window.App.applyImportedState === 'function') {
                            window.App.applyImportedState(cloudSave, false);
                        }
                    } else if (event === 'SIGNED_OUT') {
                        this.currentUser = this.createGuestUser();
                        this.notifyListeners();
                    }
                });
            } catch (err) {
                console.warn('[AuthManager] Errore inizializzazione Supabase:', err);
                this.supabaseClient = null;
            }
        }

        // 2. Ripristina sessione locale o imposta Ospite
        try {
            const rawSession = localStorage.getItem(this.SESSION_KEY);
            if (rawSession) {
                this.currentUser = JSON.parse(rawSession);
            }
        } catch (e) {
            this.currentUser = null;
        }

        if (!this.currentUser) {
            this.currentUser = this.createGuestUser();
        }

        this.notifyListeners();
    },

    /**
     * Verifica se il client Supabase Cloud è attualmente attivo e configurato
     */
    isCloudActive() {
        return !!(this.supabaseClient && window.SupabaseConfig && window.SupabaseConfig.isConfigured());
    },

    /**
     * Crea un profilo Ospite locale
     */
    createGuestUser() {
        return {
            id: 'guest_local',
            isGuest: true,
            provider: 'guest',
            name: 'Ospite Locale',
            email: null,
            photoURL: null,
            createdAt: new Date().toISOString()
        };
    },

    isGuest() {
        return !this.currentUser || this.currentUser.isGuest === true;
    },

    getUser() {
        return this.currentUser;
    },

    onAuthStateChanged(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
            callback(this.currentUser);
        }
    },

    notifyListeners() {
        this.listeners.forEach(cb => {
            try {
                cb(this.currentUser);
            } catch (e) {
                console.error('[AuthManager] Errore nel listener auth:', e);
            }
        });
    },

    saveSession(user) {
        this.currentUser = user;
        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        } catch (e) {}
        this.notifyListeners();
    },

    getAccountsDB() {
        try {
            const raw = localStorage.getItem(this.ACCOUNTS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    saveAccountsDB(db) {
        try {
            localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(db));
        } catch (e) {}
    },

    async hashPassword(password) {
        if (window.crypto && window.crypto.subtle) {
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(password + "_gdscript_salt_2026");
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) {}
        }
        let hash = 0;
        const str = password + "_gdscript_salt_2026";
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return "h_" + Math.abs(hash).toString(16);
    },

    /**
     * Registrazione nuovo account con Email e Password (Cloud o Locale)
     */
    async registerWithEmail(name, email, password, currentProgress = null) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim() || 'Sviluppatore Godot';

        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
            throw new Error('Inserisci un indirizzo email valido.');
        }

        if (!password || password.length < 6) {
            throw new Error('La password deve contenere almeno 6 caratteri.');
        }

        // 1. Se Supabase è attivo: registrazione remota
        if (this.isCloudActive()) {
            const { data, error } = await this.supabaseClient.auth.signUp({
                email: cleanEmail,
                password: password,
                options: {
                    data: {
                        name: cleanName,
                        full_name: cleanName
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            const sessionUser = {
                id: data.user.id,
                isGuest: false,
                provider: 'email',
                name: cleanName,
                email: cleanEmail,
                photoURL: null,
                createdAt: data.user.created_at || new Date().toISOString()
            };

            this.saveSession(sessionUser);

            if (currentProgress) {
                await this.syncToCloud(currentProgress);
            }

            return { user: sessionUser, account: data.user };
        }

        // 2. Fallback autonomo locale
        const db = this.getAccountsDB();
        if (db[cleanEmail]) {
            throw new Error('Un account con questa email esiste già. Effettua l\'accesso!');
        }

        const pwdHash = await this.hashPassword(password);
        const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

        const newAccount = {
            id: userId,
            name: cleanName,
            email: cleanEmail,
            passwordHash: pwdHash,
            provider: 'email',
            avatar: '🤖',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            progress: currentProgress || null
        };

        db[cleanEmail] = newAccount;
        this.saveAccountsDB(db);

        const sessionUser = {
            id: userId,
            isGuest: false,
            provider: 'email',
            name: cleanName,
            email: cleanEmail,
            photoURL: null,
            createdAt: newAccount.createdAt
        };

        this.saveSession(sessionUser);
        return { user: sessionUser, account: newAccount };
    },

    /**
     * Accesso con Email e Password (Cloud o Locale)
     */
    async loginWithEmail(email, password) {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            throw new Error('Inserisci email e password.');
        }

        // 1. Se Supabase è attivo: login remoto
        if (this.isCloudActive()) {
            const { data, error } = await this.supabaseClient.auth.signInWithPassword({
                email: cleanEmail,
                password: password
            });

            if (error) {
                throw new Error(error.message);
            }

            const u = data.user;
            const sessionUser = {
                id: u.id,
                isGuest: false,
                provider: 'email',
                name: u.user_metadata?.name || u.user_metadata?.full_name || u.email.split('@')[0],
                email: u.email,
                photoURL: null,
                createdAt: u.created_at
            };

            this.saveSession(sessionUser);

            const cloudSave = await this.fetchFromCloud();
            return { user: sessionUser, account: { progress: cloudSave } };
        }

        // 2. Fallback autonomo locale
        const db = this.getAccountsDB();
        const account = db[cleanEmail];

        if (!account) {
            throw new Error('Nessun account trovato con questa email. Clicca su "Registrati" per crearne uno!');
        }

        const pwdHash = await this.hashPassword(password);
        if (account.passwordHash !== pwdHash) {
            throw new Error('Password non corretta. Riprova!');
        }

        account.lastLogin = new Date().toISOString();
        db[cleanEmail] = account;
        this.saveAccountsDB(db);

        const sessionUser = {
            id: account.id,
            isGuest: false,
            provider: 'email',
            name: account.name,
            email: account.email,
            photoURL: account.photoURL || null,
            createdAt: account.createdAt
        };

        this.saveSession(sessionUser);
        return { user: sessionUser, account };
    },

    /**
     * Accesso Rapido con Account Google (Cloud OAuth o Locale)
     */
    async loginWithGoogle(customProfile = null, currentProgress = null) {
        // 1. Se Supabase è attivo: avvia Google OAuth ufficiale
        if (this.isCloudActive()) {
            const { data, error } = await this.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.href.split('#')[0]
                }
            });

            if (error) {
                throw new Error(error.message);
            }
            return data;
        }

        // 2. Fallback autonomo locale
        const googleName = customProfile?.name || 'Sviluppatore Google';
        const googleEmail = (customProfile?.email || 'godot.dev@gmail.com').toLowerCase();
        const googleAvatar = customProfile?.photoURL || 'https://lh3.googleusercontent.com/a/default-user=s96-c';

        const db = this.getAccountsDB();
        let account = db[googleEmail];

        if (!account) {
            const userId = 'goog_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
            account = {
                id: userId,
                name: googleName,
                email: googleEmail,
                provider: 'google',
                photoURL: googleAvatar,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                progress: currentProgress || null
            };
            db[googleEmail] = account;
        } else {
            account.lastLogin = new Date().toISOString();
            if (googleAvatar) account.photoURL = googleAvatar;
            db[googleEmail] = account;
        }

        this.saveAccountsDB(db);

        const sessionUser = {
            id: account.id,
            isGuest: false,
            provider: 'google',
            name: account.name,
            email: account.email,
            photoURL: account.photoURL,
            createdAt: account.createdAt
        };

        this.saveSession(sessionUser);
        return { user: sessionUser, account };
    },

    /**
     * Disconnette l'utente e ripristina la modalità Ospite
     */
    async logout() {
        if (this.isCloudActive()) {
            try {
                await this.supabaseClient.auth.signOut();
            } catch (e) {}
        }

        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (e) {}

        this.currentUser = this.createGuestUser();
        this.notifyListeners();
    },

    /**
     * Salva i progressi nel Database Cloud (Supabase) e nel database locale
     */
    async syncUserProgress(progressData) {
        if (this.isGuest() || !this.currentUser || !this.currentUser.email) return;

        // 1. Sincronizzazione Cloud Supabase
        if (this.isCloudActive()) {
            try {
                await this.syncToCloud(progressData);
            } catch (err) {
                console.warn('[AuthManager] Sync cloud non riuscito, salvataggio locale preservato:', err);
            }
        }

        // 2. Sincronizzazione database locale
        const db = this.getAccountsDB();
        if (db[this.currentUser.email]) {
            db[this.currentUser.email].progress = progressData;
            db[this.currentUser.email].lastSync = new Date().toISOString();
            this.saveAccountsDB(db);
        }
    },

    /**
     * Salva record su tabella Supabase 'game_saves'
     */
    async syncToCloud(saveData) {
        if (!this.isCloudActive() || this.isGuest()) return;
        const { data: { user } } = await this.supabaseClient.auth.getUser();
        if (!user) return;

        const payload = {
            user_id: user.id,
            email: user.email,
            xp: saveData.xp || 0,
            level: Math.floor((saveData.xp || 0) / 100) + 1,
            streak: saveData.streak || 0,
            streak_weeks: saveData.streakWeeks || 0,
            finished_lessons_count: (saveData.finishedLessons || []).length,
            save_data: saveData,
            updated_at: new Date().toISOString()
        };

        const { error } = await this.supabaseClient
            .from('game_saves')
            .upsert(payload, { onConflict: 'user_id' });

        if (error) {
            console.warn('[AuthManager] Errore upsert game_saves:', error.message);
        }
    },

    /**
     * Recupera il salvataggio salvato nel cloud Supabase
     */
    async fetchFromCloud() {
        if (!this.isCloudActive() || this.isGuest()) return null;
        try {
            const { data: { user } } = await this.supabaseClient.auth.getUser();
            if (!user) return null;

            const { data, error } = await this.supabaseClient
                .from('game_saves')
                .select('save_data')
                .eq('user_id', user.id)
                .single();

            if (error || !data) return null;
            return data.save_data;
        } catch (e) {
            return null;
        }
    },

    /**
     * Recupera i progressi salvati (Cloud o Locale)
     */
    getSavedUserProgress() {
        if (this.isGuest() || !this.currentUser || !this.currentUser.email) return null;
        const db = this.getAccountsDB();
        const acc = db[this.currentUser.email];
        return acc ? acc.progress : null;
    },

    // ===================================================================
    // METRICHE E STATISTICHE AMMINISTRATORE (Admin Dashboard)
    // ===================================================================

    /**
     * Raccoglie le statistiche della piattaforma (utenti, XP, lezioni)
     */
    async fetchAdminStats() {
        // 1. Se Supabase è connesso, recupera dati reali dal cloud
        if (this.isCloudActive()) {
            try {
                const { data: saves, error } = await this.supabaseClient
                    .from('game_saves')
                    .select('user_id, email, xp, level, finished_lessons_count, updated_at');

                if (!error && saves) {
                    const totalUsers = saves.length;
                    const totalXp = saves.reduce((acc, row) => acc + (row.xp || 0), 0);
                    const avgLessons = totalUsers > 0 ? (saves.reduce((acc, r) => acc + (r.finished_lessons_count || 0), 0) / totalUsers).toFixed(1) : 0;

                    const usersList = saves.map(s => ({
                        id: s.user_id,
                        email: s.email,
                        name: s.email.split('@')[0],
                        provider: s.email.includes('gmail') ? 'google' : 'email',
                        xp: s.xp || 0,
                        level: s.level || 1,
                        finishedLessons: s.finished_lessons_count || 0,
                        lastLogin: s.updated_at
                    }));

                    return {
                        isCloud: true,
                        totalUsers,
                        totalXp,
                        avgLessons,
                        usersList
                    };
                }
            } catch (e) {
                console.warn('[AuthManager] Fallback alle statistiche locali per l\'admin:', e);
            }
        }

        // 2. Statistiche dal database locale
        const db = this.getAccountsDB();
        const emails = Object.keys(db);
        const usersList = emails.map(email => {
            const acc = db[email];
            const p = acc.progress || {};
            return {
                id: acc.id,
                email: acc.email,
                name: acc.name,
                provider: acc.provider || 'email',
                xp: p.xp || 0,
                level: Math.floor((p.xp || 0) / 100) + 1,
                finishedLessons: (p.finishedLessons || []).length,
                createdAt: acc.createdAt,
                lastLogin: acc.lastLogin
            };
        });

        // Aggiungi utente ospite se ha fatto progressi
        if (window.App && window.App.state && (window.App.state.xp > 0 || window.App.state.finishedLessons.length > 0)) {
            usersList.unshift({
                id: 'guest_local',
                email: 'ospite.locale@browser',
                name: window.App.state.profile?.username || 'Ospite Locale',
                provider: 'guest',
                xp: window.App.state.xp || 0,
                level: window.App.getCurrentLevelInfo ? window.App.getCurrentLevelInfo().tier.level : 1,
                finishedLessons: window.App.state.finishedLessons.length,
                lastLogin: new Date().toISOString()
            });
        }

        const totalUsers = usersList.length;
        const totalXp = usersList.reduce((acc, u) => acc + (u.xp || 0), 0);
        const avgLessons = totalUsers > 0 ? (usersList.reduce((acc, u) => acc + u.finishedLessons, 0) / totalUsers).toFixed(1) : 0;

        return {
            isCloud: false,
            totalUsers,
            totalXp,
            avgLessons,
            usersList
        };
    },

    // ===================================================================
    // ESPORTAZIONE & IMPORTAZIONE DATI (BACKUP & RIPRISTINO)
    // ===================================================================

    createBackupPayload(appState) {
        const payload = {
            app: 'GDScript Hero',
            version: '4.0',
            exportedAt: new Date().toISOString(),
            user: {
                name: appState.profile?.username || 'Eroe Godot',
                tag: appState.profile?.tag || 'Sviluppatore GDScript',
                avatar: appState.profile?.avatar || '🤖',
                isGuest: this.isGuest(),
                accountEmail: this.currentUser?.email || null
            },
            data: {
                theme: appState.theme || 'dark',
                xp: appState.xp || 0,
                streak: appState.streak || 1,
                streakWeeks: appState.streakWeeks || 0,
                streakMode: appState.streakMode || 'rilassato',
                activeDaysThisWeek: appState.activeDaysThisWeek || [],
                currentWeekId: appState.currentWeekId || null,
                lastActiveDate: appState.lastActiveDate || null,
                finishedLessons: appState.finishedLessons || [],
                completedLessons: appState.completedLessons || [1],
                unlockedAchievements: appState.unlockedAchievements || [],
                profile: appState.profile || {},
                profileCustomized: !!appState.profileCustomized,
                dailyQuests: appState.dailyQuests || null,
                claimedQuestsCount: appState.claimedQuestsCount || 0,
                projectInterests: appState.projectInterests || {},
                userCode: appState.userCode || {},
                soundEnabled: typeof SoundFX !== 'undefined' ? SoundFX.enabled : true,
                soundVolume: typeof SoundFX !== 'undefined' ? SoundFX.volume : 0.8
            }
        };

        payload.checksum = this.generateChecksum(payload.data);
        return payload;
    },

    generateChecksum(dataObj) {
        const str = JSON.stringify(dataObj);
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return 'gd_' + Math.abs(hash).toString(36);
    },

    exportToFile(appState) {
        const payload = this.createBackupPayload(appState);
        const jsonString = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `gdscript_hero_backup_${dateStr}.json`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        return fileName;
    },

    exportToCode(appState) {
        const payload = this.createBackupPayload(appState);
        const jsonString = JSON.stringify(payload);
        const encoded = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
        return "GDHERO-" + encoded;
    },

    parseBackupString(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') {
            throw new Error('Dati di salvataggio non validi o vuoti.');
        }

        let parsed = null;
        const trimmed = rawInput.trim();

        if (trimmed.startsWith('GDHERO-')) {
            try {
                const b64 = trimmed.substring(7);
                const decodedJson = decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                parsed = JSON.parse(decodedJson);
            } catch (e) {
                throw new Error('Il codice di backup inserito è corrotto o non valido.');
            }
        } else {
            try {
                parsed = JSON.parse(trimmed);
            } catch (e) {
                throw new Error('Il formato del file non è un JSON valido.');
            }
        }

        if (!parsed || !parsed.data) {
            if (parsed && (parsed.xp !== undefined || parsed.finishedLessons !== undefined)) {
                return {
                    app: 'GDScript Hero',
                    version: 'legacy',
                    exportedAt: new Date().toISOString(),
                    user: { name: parsed.profile?.username || 'Eroe Godot' },
                    data: parsed
                };
            }
            throw new Error('Struttura dati non riconosciuta. Assicurati che sia un salvataggio di GDScript Hero.');
        }

        return parsed;
    },

    mergeProgress(current, imported) {
        const merged = { ...current };

        merged.xp = Math.max(current.xp || 0, imported.xp || 0);
        merged.streak = Math.max(current.streak || 1, imported.streak || 1);
        merged.streakWeeks = Math.max(current.streakWeeks || 0, imported.streakWeeks || 0);

        const finishedSet = new Set([...(current.finishedLessons || []), ...(imported.finishedLessons || [])]);
        merged.finishedLessons = Array.from(finishedSet).sort((a, b) => a - b);

        const completedSet = new Set([...(current.completedLessons || [1]), ...(imported.completedLessons || [1])]);
        merged.completedLessons = Array.from(completedSet).sort((a, b) => a - b);

        const achSet = new Set([...(current.unlockedAchievements || []), ...(imported.unlockedAchievements || [])]);
        merged.unlockedAchievements = Array.from(achSet);

        merged.userCode = { ...(current.userCode || {}), ...(imported.userCode || {}) };

        if (imported.profileCustomized) {
            merged.profile = { ...(current.profile || {}), ...(imported.profile || {}) };
            merged.profileCustomized = true;
        }

        if (imported.dailyQuests) {
            merged.dailyQuests = imported.dailyQuests;
        }
        merged.claimedQuestsCount = Math.max(current.claimedQuestsCount || 0, imported.claimedQuestsCount || 0);

        return merged;
    }
};

if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}
