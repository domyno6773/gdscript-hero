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
        let supabaseFoundUser = false;

        // 1. Inizializza client Supabase se le credenziali sono presenti
        if (typeof window.supabase !== 'undefined' && window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
            try {
                this.supabaseClient = window.supabase.createClient(
                    window.SupabaseConfig.url,
                    window.SupabaseConfig.anonKey,
                    {
                        auth: {
                            flowType: 'implicit',
                            persistSession: true,
                            autoRefreshToken: true,
                            detectSessionInUrl: true
                        }
                    }
                );
                console.log('[AuthManager] Supabase Cloud connesso con successo!');

                // Controllo errori nell'URL di ritorno
                const searchParams = new URLSearchParams(window.location.search);
                const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.substring(1) : '');
                const urlError = searchParams.get('error_description') || hashParams.get('error_description');
                if (urlError) {
                    console.error('[AuthManager] Errore restituito da OAuth:', urlError);
                    alert('Errore durante l\'accesso con Google: ' + decodeURIComponent(urlError.replace(/\+/g, ' ')));
                    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                }

                let activeSession = null;

                // 1. Controlla prima se sono presenti token nell'hash dell'URL (#access_token=... da Implicit Flow)
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                if (accessToken) {
                    try {
                        console.log('[AuthManager] Rilevato access_token da Google OAuth nell\'hash dell\'URL!');
                        const { data, error } = await this.supabaseClient.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || ''
                        });
                        if (!error && data && data.session) {
                            activeSession = data.session;
                            console.log('[AuthManager] Sessione impostata con successo tramite setSession!');
                        } else if (error) {
                            console.warn('[AuthManager] Errore setSession:', error.message);
                        }
                    } catch (e) {
                        console.warn('[AuthManager] Eccezione setSession:', e);
                    }
                }

                // 2. Controlla se c'è un codice di autorizzazione PKCE (?code=...)
                const authCode = searchParams.get('code');
                if (!activeSession && authCode) {
                    try {
                        console.log('[AuthManager] Rilevato codice OAuth da Google (?code=...), scambio sessione in corso...');
                        const { data, error } = await this.supabaseClient.auth.exchangeCodeForSession(authCode);
                        if (!error && data && data.session) {
                            activeSession = data.session;
                            console.log('[AuthManager] Scambio codice completato con successo!');
                        } else if (error) {
                            console.warn('[AuthManager] Errore nello scambio codice:', error.message);
                        }
                    } catch (e) {
                        console.warn('[AuthManager] Eccezione exchangeCodeForSession:', e);
                    }
                }

                // 3. Se non c'era o è fallito, controlla se c'è una sessione attiva già memorizzata
                if (!activeSession) {
                    const { data: { session }, error: sessionErr } = await this.supabaseClient.auth.getSession();
                    if (!sessionErr && session) {
                        activeSession = session;
                    }
                }

                if (activeSession && activeSession.user) {
                    const u = activeSession.user;
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
                    supabaseFoundUser = true;
                    console.log('[AuthManager] Sessione Supabase autenticata trovata:', sessionUser.email);

                    // Pulisce l'URL dai frammenti di hash OAuth o query code
                    if (window.location.hash || window.location.search.includes('code=') || window.location.search.includes('error=')) {
                        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
                    }

                    // Carica i salvataggi cloud
                    const cloudSave = await this.fetchFromCloud();
                    if (window.App && typeof window.App.integrateCloudSave === 'function') {
                        await window.App.integrateCloudSave(cloudSave);
                    } else if (cloudSave && window.App && typeof window.App.applyImportedState === 'function') {
                        window.App.applyImportedState(cloudSave, false);
                    }
                }

                // Ascolta gli eventi di sessione Supabase (OAuth redirect, login, refresh)
                this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                    console.log('[AuthManager] onAuthStateChange event:', event);
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

                        // Pulisce l'URL dai frammenti OAuth se presenti
                        if (window.location.hash || window.location.search.includes('code=')) {
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }

                        // Integra i progressi dell'Ospite con i salvataggi cloud
                        const cloudSave = await this.fetchFromCloud();
                        if (window.App && typeof window.App.integrateCloudSave === 'function') {
                            await window.App.integrateCloudSave(cloudSave);
                        } else if (cloudSave && window.App && typeof window.App.applyImportedState === 'function') {
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

        // 2. Se Supabase non ha fornito un utente valido, controlla localStorage locale
        if (!supabaseFoundUser) {
            try {
                const rawSession = localStorage.getItem(this.SESSION_KEY);
                if (rawSession) {
                    const parsed = JSON.parse(rawSession);
                    if (parsed && !parsed.isGuest) {
                        this.currentUser = parsed;
                    }
                }
            } catch (e) {
                this.currentUser = null;
            }
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
        // 1. Se NON è passato un profilo manuale e Supabase è attivo: avvia Google OAuth ufficiale
        if (!customProfile && this.isCloudActive()) {
            let redirectUrl = window.location.origin + window.location.pathname;
            if (!redirectUrl.endsWith('/') && !redirectUrl.endsWith('.html')) {
                redirectUrl += '/';
            }
            const { data, error } = await this.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl
                }
            });

            if (error) {
                throw new Error(error.message);
            }
            return data;
        }

        // 2. Se è specificato un profilo manuale o fallback autonomo locale
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
        if (this.isGuest() || !this.currentUser?.email || !progressData) return;
        const email = this.currentUser.email;
        // Una copia indipendente evita che una modifica successiva alteri il salvataggio in coda.
        const snapshot = JSON.parse(JSON.stringify(progressData));

        // Prima la copia locale: un errore di rete non deve impedire il salvataggio.
        const db = this.getAccountsDB();
        if (db[email]) {
            db[email].progress = snapshot;
            db[email].lastSync = new Date().toISOString();
            this.saveAccountsDB(db);
        }

        if (this.isCloudActive()) {
            try {
                await this.syncToCloud(snapshot);
            } catch (err) {
                console.warn('[AuthManager] Sync cloud non riuscito; progressi locali mantenuti:', err);
            }
        }
    },

    /**
     * Serializza gli upsert cloud della scheda corrente nell'ordine richiesto.
     * La coda evita che una richiesta lenta sovrascriva quella successiva.
     * Non sostituisce una gestione delle versioni lato server per schede/dispositivi diversi.
     */
    async syncToCloud(saveData) {
        if (!this.isCloudActive() || this.isGuest() || !this.currentUser?.email || !saveData) return;
        const accountEmail = this.currentUser.email.toLowerCase();
        const snapshot = JSON.parse(JSON.stringify(saveData));
        const previous = this._cloudWriteQueue || Promise.resolve();
        const operation = previous.catch(() => {}).then(async () => {
            if (!this.isCloudActive() || this.isGuest() ||
                this.currentUser?.email?.toLowerCase() !== accountEmail) return;

            const { data, error: authError } = await this.supabaseClient.auth.getUser();
            if (authError) throw authError;
            const user = data?.user;
            if (!user || user.email?.toLowerCase() !== accountEmail) return;
            // Controllo anche dopo l'attesa dell'autenticazione.
            if (this.isGuest() || this.currentUser?.email?.toLowerCase() !== accountEmail) return;

            const payload = {
                user_id: user.id,
                email: user.email,
                xp: snapshot.xp || 0,
                level: Math.floor((snapshot.xp || 0) / 100) + 1,
                streak: snapshot.streak || 0,
                streak_weeks: snapshot.streakWeeks || 0,
                finished_lessons_count: (snapshot.finishedLessons || []).length,
                save_data: snapshot,
                updated_at: new Date().toISOString()
            };

            const { error } = await this.supabaseClient
                .from('game_saves')
                .upsert(payload, { onConflict: 'user_id' });
            if (error) throw error;
        });

        // La coda continua anche quando una singola richiesta fallisce.
        this._cloudWriteQueue = operation.catch(() => {});
        return operation;
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

    /**
     * Verifica se un utente è autorizzato come amministratore
     */
    isAdmin(user = null) {
        const u = user || this.currentUser;
        if (!u || u.isGuest || !u.email) return false;
        if (window.SupabaseConfig && typeof window.SupabaseConfig.isAdmin === 'function') {
            return window.SupabaseConfig.isAdmin(u.email);
        }
        return false;
    },

    // ===================================================================
    // METRICHE E STATISTICHE AMMINISTRATORE (Admin Dashboard)
    // ===================================================================

    /**
     * Raccoglie le statistiche della piattaforma (utenti, XP, lezioni)
     */
    async fetchAdminStats() {
        if (!this.isAdmin()) {
            console.warn('[AuthManager] Tentativo non autorizzato di accedere alle statistiche admin.');
            return {
                isCloud: this.isCloudActive(),
                totalUsers: 0,
                totalXp: 0,
                avgLessons: 0,
                usersList: []
            };
        }

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
            version: '4.1',
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
                // Questi dati erano già salvati localmente, ma mancavano dal backup.
                arenaProject: appState.arenaProject ?? null,
                sandbox: appState.sandbox ?? null,
                reviewProgress: appState.reviewProgress ?? null,
                learningTelemetry: appState.learningTelemetry || null,
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

        // I checksum dei backup recenti rilevano modifiche e file danneggiati.
        // Non sono firme crittografiche: non attestano chi ha creato il file.
        if (!parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data) ||
            (parsed.app && parsed.app !== 'GDScript Hero')) {
            throw new Error('Il backup non appartiene a GDScript Hero oppure contiene dati non validi.');
        }
        if (parsed.checksum !== undefined) {
            if (typeof parsed.checksum !== 'string' || parsed.checksum !== this.generateChecksum(parsed.data)) {
                throw new Error('Il controllo di integrità del backup non corrisponde: il file potrebbe essere danneggiato o modificato.');
            }
        } else if (parsed.version === '4.1') {
            throw new Error('Il backup è privo del checksum di integrità richiesto.');
        }
        // I backup storici e il formato legacy rimangono importabili.
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
        merged.projectInterests = { ...(current.projectInterests || {}), ...(imported.projectInterests || {}) };
        merged.claimedQuestsCount = Math.max(current.claimedQuestsCount || 0, imported.claimedQuestsCount || 0);

        // Fusione intelligente dei progetti Sandbox
        if (imported.sandbox) {
            if (!current.sandbox || !current.sandbox.projects || current.sandbox.projects.length === 0) {
                merged.sandbox = imported.sandbox;
            } else {
                const projectMap = new Map();
                (current.sandbox.projects || []).forEach(p => projectMap.set(p.id, p));
                (imported.sandbox.projects || []).forEach(p => {
                    if (!projectMap.has(p.id)) {
                        projectMap.set(p.id, p);
                    } else {
                        const existing = projectMap.get(p.id);
                        const existingTime = new Date(existing.updatedAt || 0).getTime();
                        const importedTime = new Date(p.updatedAt || 0).getTime();
                        if (importedTime >= existingTime) {
                            projectMap.set(p.id, p);
                        }
                    }
                });
                merged.sandbox = {
                    activeProjectId: imported.sandbox.activeProjectId || current.sandbox.activeProjectId || 'proj_default',
                    projects: Array.from(projectMap.values())
                };
            }
        }

        // Fusione intelligente del mini-progetto Arena del Gladiatore (P2)
        if (imported.arenaProject) {
            if (!current.arenaProject) {
                merged.arenaProject = imported.arenaProject;
            } else {
                const curPhases = Array.isArray(current.arenaProject.completedPhases) ? current.arenaProject.completedPhases : [];
                const impPhases = Array.isArray(imported.arenaProject.completedPhases) ? imported.arenaProject.completedPhases : [];
                const mergedPhases = Array.from(new Set([...curPhases, ...impPhases])).sort((a, b) => a - b);
                merged.arenaProject = {
                    currentPhase: Math.max(current.arenaProject.currentPhase || 1, imported.arenaProject.currentPhase || 1),
                    completedPhases: mergedPhases,
                    userCode: { ...(current.arenaProject.userCode || {}), ...(imported.arenaProject.userCode || {}) },
                    hintsRevealed: Math.max(current.arenaProject.hintsRevealed || 0, imported.arenaProject.hintsRevealed || 0),
                    activeHintLevel: 1,
                    liveSalute: 100,
                    liveMaxSalute: 100,
                    liveIsVivo: true
                };
            }
        }

        // Fusione deterministica della telemetria didattica P3.1
        if (imported.learningTelemetry && imported.learningTelemetry.lessons) {
            if (!current.learningTelemetry || !current.learningTelemetry.lessons) {
                merged.learningTelemetry = imported.learningTelemetry;
            } else {
                merged.learningTelemetry = this.mergeLearningTelemetry(current.learningTelemetry, imported.learningTelemetry);
            }
        } else if (current.learningTelemetry) {
            merged.learningTelemetry = current.learningTelemetry;
        }

        // Fusione intelligente e idempotente dei progressi di Ripasso P3.3 (Nessuna duplicazione)
        const curReview = current.reviewProgress || { completedVariants: [], variantHistory: {} };
        const impReview = imported.reviewProgress || { completedVariants: [], variantHistory: {} };
        const mergedVariants = Array.from(new Set([
            ...(Array.isArray(curReview.completedVariants) ? curReview.completedVariants : []),
            ...(Array.isArray(impReview.completedVariants) ? impReview.completedVariants : [])
        ]));

        const mergedHistory = {};
        const allVariantIds = new Set([
            ...Object.keys(curReview.variantHistory || {}),
            ...Object.keys(impReview.variantHistory || {})
        ]);

        const earlierReviewDate = (d1, d2) => {
            if (!d1) return d2 || null;
            if (!d2) return d1 || null;
            return new Date(d1).getTime() <= new Date(d2).getTime() ? d1 : d2;
        };

        const laterReviewDate = (d1, d2) => {
            if (!d1) return d2 || null;
            if (!d2) return d1 || null;
            return new Date(d1).getTime() >= new Date(d2).getTime() ? d1 : d2;
        };

        for (const vId of allVariantIds) {
            const curH = (curReview.variantHistory || {})[vId];
            const impH = (impReview.variantHistory || {})[vId];

            if (curH && !impH) {
                mergedHistory[vId] = { ...curH };
            } else if (!curH && impH) {
                mergedHistory[vId] = { ...impH };
            } else if (curH && impH) {
                const maxHints = Math.max(curH.hints_used || 0, curH.hintsUsed || 0, impH.hints_used || 0, impH.hintsUsed || 0);
                const curTime = Date.parse(curH.last_attempt_at || '') || 0;
                const impTime = Date.parse(impH.last_attempt_at || '') || 0;
                const newest = impTime > curTime ? impH : curH;
                const older = impTime > curTime ? curH : impH;
                mergedHistory[vId] = {
                    ...older,
                    ...newest,
                    attempts: Math.max(curH.attempts || 0, impH.attempts || 0),
                    successes: Math.max(curH.successes || 0, impH.successes || 0),
                    hints_used: maxHints,
                    hintsUsed: maxHints,
                    has_autonomous_success: !!(curH.has_autonomous_success || impH.has_autonomous_success),
                    clean_autonomous_runs: Math.max(curH.clean_autonomous_runs || 0, impH.clean_autonomous_runs || 0),
                    first_attempt_at: earlierReviewDate(curH.first_attempt_at, impH.first_attempt_at),
                    last_attempt_at: laterReviewDate(curH.last_attempt_at, impH.last_attempt_at),
                    first_success_at: earlierReviewDate(curH.first_success_at, impH.first_success_at),
                    // Errori nella sessione corrente e ultimo risultato appartengono
                    // allo storico più recente, non alla somma dei due dispositivi.
                    attempts_since_last_success: newest.attempts_since_last_success ?? older.attempts_since_last_success ?? 0,
                    last_run: newest.last_run ?? older.last_run ?? null
                };
            }
        }

        merged.reviewProgress = {
            ...curReview,
            ...impReview,
            completedVariants: mergedVariants,
            variantHistory: mergedHistory
        };

        return merged;
    },

    /**
     * Merge deterministico e idempotente della telemetria didattica locale e remota
     */
    mergeLearningTelemetry(local, remote) {
        if (!local && !remote) return { schema_version: 1, lessons: {} };
        if (!local) return remote;
        if (!remote) return local;

        const result = {
            schema_version: Math.max(local.schema_version || 1, remote.schema_version || 1),
            lessons: { ...(local.lessons || {}) }
        };
        const remoteLessons = remote.lessons || {};

        const earlierDate = (d1, d2) => {
            if (!d1) return d2 || null;
            if (!d2) return d1 || null;
            return new Date(d1).getTime() <= new Date(d2).getTime() ? d1 : d2;
        };

        const laterDate = (d1, d2) => {
            if (!d1) return d2 || null;
            if (!d2) return d1 || null;
            return new Date(d1).getTime() >= new Date(d2).getTime() ? d1 : d2;
        };

        for (const [idStr, rData] of Object.entries(remoteLessons)) {
            const lData = result.lessons[idStr];
            if (!lData) {
                result.lessons[idStr] = { ...rData };
                continue;
            }

            const hasLocalHistory = lData.history_available && !lData.legacy_completion;
            const hasRemoteHistory = rData.history_available && !rData.legacy_completion;

            let mergedLesson;
            if (!hasLocalHistory && hasRemoteHistory) {
                mergedLesson = { ...rData };
            } else if (hasLocalHistory && !hasRemoteHistory) {
                mergedLesson = { ...lData };
            } else {
                const firstSuccessAt = earlierDate(lData.first_success_at, rData.first_success_at);
                const lastSuccessAt = laterDate(lData.last_success_at, rData.last_success_at);
                const firstAttemptAt = earlierDate(lData.first_attempt_at, rData.first_attempt_at);
                const lastAttemptAt = laterDate(lData.last_attempt_at, rData.last_attempt_at);

                let failedBeforeFirst = null;
                if (lData.failed_before_first_success !== null && lData.failed_before_first_success !== undefined &&
                    rData.failed_before_first_success !== null && rData.failed_before_first_success !== undefined) {
                    if (firstSuccessAt && lData.first_success_at === firstSuccessAt && lData.first_success_at !== rData.first_success_at) {
                        failedBeforeFirst = lData.failed_before_first_success;
                    } else if (firstSuccessAt && rData.first_success_at === firstSuccessAt && lData.first_success_at !== rData.first_success_at) {
                        failedBeforeFirst = rData.failed_before_first_success;
                    } else {
                        failedBeforeFirst = Math.max(lData.failed_before_first_success, rData.failed_before_first_success);
                    }
                } else {
                    failedBeforeFirst = (lData.failed_before_first_success !== null && lData.failed_before_first_success !== undefined)
                        ? lData.failed_before_first_success
                        : rData.failed_before_first_success ?? null;
                }

                let hintsBeforeFirst = null;
                if (lData.hints_opened_before_first_success !== null && lData.hints_opened_before_first_success !== undefined &&
                    rData.hints_opened_before_first_success !== null && rData.hints_opened_before_first_success !== undefined) {
                    hintsBeforeFirst = Math.max(lData.hints_opened_before_first_success, rData.hints_opened_before_first_success);
                } else {
                    hintsBeforeFirst = (lData.hints_opened_before_first_success !== null && lData.hints_opened_before_first_success !== undefined)
                        ? lData.hints_opened_before_first_success
                        : rData.hints_opened_before_first_success ?? null;
                }

                let firstSuccessWithoutHints = null;
                if (lData.first_success_without_hints !== null && lData.first_success_without_hints !== undefined &&
                    rData.first_success_without_hints !== null && rData.first_success_without_hints !== undefined) {
                    firstSuccessWithoutHints = lData.first_success_without_hints && rData.first_success_without_hints;
                } else {
                    firstSuccessWithoutHints = (lData.first_success_without_hints !== null && lData.first_success_without_hints !== undefined)
                        ? lData.first_success_without_hints
                        : rData.first_success_without_hints ?? null;
                }

                const lErr = lData.error_breakdown || {};
                const rErr = rData.error_breakdown || {};
                const errorBreakdown = {
                    syntax: Math.max(lErr.syntax || 0, rErr.syntax || 0),
                    runtime: Math.max(lErr.runtime || 0, rErr.runtime || 0),
                    requirement: Math.max(lErr.requirement || 0, rErr.requirement || 0),
                    timeout: Math.max(lErr.timeout || 0, rErr.timeout || 0),
                    internal: Math.max(lErr.internal || 0, rErr.internal || 0)
                };

                mergedLesson = {
                    lesson_id: lData.lesson_id,
                    concept_id: lData.concept_id || rData.concept_id,
                    concept_tags: lData.concept_tags || rData.concept_tags || [],
                    total_runs: Math.max(lData.total_runs || 0, rData.total_runs || 0),
                    verify_attempts: Math.max(lData.verify_attempts || 0, rData.verify_attempts || 0),
                    failed_verifications: Math.max(lData.failed_verifications || 0, rData.failed_verifications || 0),
                    failed_before_first_success: failedBeforeFirst,
                    success_count: Math.max(lData.success_count || 0, rData.success_count || 0),
                    first_attempt_at: firstAttemptAt,
                    last_attempt_at: lastAttemptAt,
                    first_success_at: firstSuccessAt,
                    last_success_at: lastSuccessAt,
                    max_hint_level_opened: Math.max(lData.max_hint_level_opened || 0, rData.max_hint_level_opened || 0),
                    hints_opened_before_first_success: hintsBeforeFirst,
                    first_success_without_hints: firstSuccessWithoutHints,
                    error_breakdown: errorBreakdown,
                    legacy_completion: !!(lData.legacy_completion && rData.legacy_completion),
                    history_available: !!(lData.history_available || rData.history_available)
                };
            }

            result.lessons[idStr] = mergedLesson;
        }

        // Fusione idempotente e deterministica dell'attività giornaliera aggregata
        const lDaily = local.daily_activity || {};
        const rDaily = remote.daily_activity || {};
        const mergedDaily = {};
        const allDates = Array.from(new Set([...Object.keys(lDaily), ...Object.keys(rDaily)]));
        allDates.forEach(date => {
            const ld = lDaily[date] || {};
            const rd = rDaily[date] || {};
            mergedDaily[date] = {
                verifications: Math.max(ld.verifications || 0, rd.verifications || 0),
                lessons_completed: Math.max(ld.lessons_completed || 0, rd.lessons_completed || 0),
                autonomous_completed: Math.max(ld.autonomous_completed || 0, rd.autonomous_completed || 0),
                assisted_completed: Math.max(ld.assisted_completed || 0, rd.assisted_completed || 0),
                reviews_completed: Math.max(ld.reviews_completed || 0, rd.reviews_completed || 0)
            };
        });
        result.daily_activity = mergedDaily;

        return result;
    }
};

if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}
