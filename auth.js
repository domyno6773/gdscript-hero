/**
 * ===================================================================
 * GDSCRIPT HERO - AUTH & CLOUD SYNC MANAGER (auth.js)
 * Gestione Autenticazione (Ospite, Email/Password, Google)
 * ed Esportazione / Importazione Dati di Gioco (.json / codice Base64)
 * Supporto nativo per PC e Dispositivi Mobili.
 * ===================================================================
 */

const AuthManager = {
    SESSION_KEY: 'gdscript_hero_auth_session',
    ACCOUNTS_KEY: 'gdscript_hero_accounts_db',

    currentUser: null,
    listeners: [],

    /**
     * Inizializzazione: ripristina la sessione utente o imposta Ospite di default
     */
    init() {
        try {
            const rawSession = localStorage.getItem(this.SESSION_KEY);
            if (rawSession) {
                this.currentUser = JSON.parse(rawSession);
            }
        } catch (e) {
            console.warn('[AuthManager] Impossibile leggere la sessione salvata:', e);
            this.currentUser = null;
        }

        if (!this.currentUser) {
            this.currentUser = this.createGuestUser();
        }

        this.notifyListeners();
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

    /**
     * Verifica se l'utente corrente è in modalità ospite
     */
    isGuest() {
        return !this.currentUser || this.currentUser.isGuest === true;
    },

    /**
     * Ottiene l'utente corrente
     */
    getUser() {
        return this.currentUser;
    },

    /**
     * Registra un callback per gli eventi di cambio autenticazione
     */
    onAuthStateChanged(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
            // Esegui subito con lo stato corrente
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

    /**
     * Salva la sessione attiva
     */
    saveSession(user) {
        this.currentUser = user;
        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        } catch (e) {}
        this.notifyListeners();
    },

    /**
     * Ottiene il database locale degli account
     */
    getAccountsDB() {
        try {
            const raw = localStorage.getItem(this.ACCOUNTS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    /**
     * Salva il database locale degli account
     */
    saveAccountsDB(db) {
        try {
            localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(db));
        } catch (e) {}
    },

    /**
     * Calcola un hash rapido per la password (SHA-256 via SubtleCrypto se disponibile)
     */
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
        // Fallback leggero in assenza di SubtleCrypto
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
     * Registrazione nuovo account con Email e Password
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
     * Accesso con Email e Password
     */
    async loginWithEmail(email, password) {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            throw new Error('Inserisci email e password.');
        }

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
     * Accesso Rapido con Account Google
     */
    async loginWithGoogle(customProfile = null, currentProgress = null) {
        // Se non viene passato un profilo personalizzato, crea/seleziona un profilo Google predefinito
        const googleName = customProfile?.name || 'Sviluppatore Google';
        const googleEmail = (customProfile?.email || 'godot.dev@gmail.com').toLowerCase();
        const googleAvatar = customProfile?.photoURL || 'https://lh3.googleusercontent.com/a/default-user=s96-c';

        const db = this.getAccountsDB();
        let account = db[googleEmail];

        if (!account) {
            // Primo accesso con Google: crea l'account
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
     * Salva i progressi dell'utente loggato nel database account
     */
    syncUserProgress(progressData) {
        if (this.isGuest() || !this.currentUser || !this.currentUser.email) return;

        const db = this.getAccountsDB();
        if (db[this.currentUser.email]) {
            db[this.currentUser.email].progress = progressData;
            db[this.currentUser.email].lastSync = new Date().toISOString();
            this.saveAccountsDB(db);
        }
    },

    /**
     * Recupera i progressi salvati per l'account attualmente loggato
     */
    getSavedUserProgress() {
        if (this.isGuest() || !this.currentUser || !this.currentUser.email) return null;
        const db = this.getAccountsDB();
        const acc = db[this.currentUser.email];
        return acc ? acc.progress : null;
    },

    /**
     * Disconnette l'utente e torna in modalità Ospite
     */
    logout() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (e) {}

        this.currentUser = this.createGuestUser();
        this.notifyListeners();
    },

    // ===================================================================
    // ESPORTAZIONE & IMPORTAZIONE DATI (BACKUP & RIPRISTINO)
    // ===================================================================

    /**
     * Prepara il payload completo di salvataggio da esportare
     */
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

        // Genera un checksum di integrità semplice
        payload.checksum = this.generateChecksum(payload.data);
        return payload;
    },

    /**
     * Calcola un checksum semplice per verificare l'integrità del salvataggio
     */
    generateChecksum(dataObj) {
        const str = JSON.stringify(dataObj);
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return 'gd_' + Math.abs(hash).toString(36);
    },

    /**
     * Esporta i dati come file JSON scaricabile
     */
    exportToFile(appState) {
        const payload = this.createBackupPayload(appState);
        const jsonString = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

        const dateStr = new Date().toISOString().slice(0, 10);
        const fileName = `gdscript_hero_backup_${dateStr}.json`;

        // Download cross-browser (PC e Mobile)
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        return fileName;
    },

    /**
     * Esporta i dati come codice di testo compatto (Base64)
     */
    exportToCode(appState) {
        const payload = this.createBackupPayload(appState);
        const jsonString = JSON.stringify(payload);
        // UTF-8 safe Base64 encoding
        const encoded = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
        return "GDHERO-" + encoded;
    },

    /**
     * Analizza e valida una stringa di salvataggio (JSON o Codice Base64)
     */
    parseBackupString(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') {
            throw new Error('Dati di salvataggio non validi o vuoti.');
        }

        let parsed = null;
        const trimmed = rawInput.trim();

        // Caso 1: Codice Base64 "GDHERO-..."
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
            // Caso 2: JSON Diretto
            try {
                parsed = JSON.parse(trimmed);
            } catch (e) {
                throw new Error('Il formato del file non è un JSON valido.');
            }
        }

        // Validazione della struttura
        if (!parsed || !parsed.data) {
            // Supporta anche il formato grezzo legacy di localStorage
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

    /**
     * Unione intelligente dei progressi tra dati correnti e dati importati
     */
    mergeProgress(current, imported) {
        const merged = { ...current };

        // Punti Esperienza: conserva il punteggio massimo
        merged.xp = Math.max(current.xp || 0, imported.xp || 0);

        // Serie: conserva la serie maggiore
        merged.streak = Math.max(current.streak || 1, imported.streak || 1);
        merged.streakWeeks = Math.max(current.streakWeeks || 0, imported.streakWeeks || 0);

        // Lezioni Completate: unione degli insiemi (nessuna perdita)
        const finishedSet = new Set([...(current.finishedLessons || []), ...(imported.finishedLessons || [])]);
        merged.finishedLessons = Array.from(finishedSet).sort((a, b) => a - b);

        const completedSet = new Set([...(current.completedLessons || [1]), ...(imported.completedLessons || [1])]);
        merged.completedLessons = Array.from(completedSet).sort((a, b) => a - b);

        // Traguardi Sbloccati: unione degli insiemi
        const achSet = new Set([...(current.unlockedAchievements || []), ...(imported.unlockedAchievements || [])]);
        merged.unlockedAchievements = Array.from(achSet);

        // Codice Utente scritto: unione dei dizionari (i file più recenti hanno la precedenza)
        merged.userCode = { ...(current.userCode || {}), ...(imported.userCode || {}) };

        // Profilo: se importato ha personalizzazioni, mantieni quelle
        if (imported.profileCustomized) {
            merged.profile = { ...(current.profile || {}), ...(imported.profile || {}) };
            merged.profileCustomized = true;
        }

        // Missioni Giornaliere: unione
        if (imported.dailyQuests) {
            merged.dailyQuests = imported.dailyQuests;
        }
        merged.claimedQuestsCount = Math.max(current.claimedQuestsCount || 0, imported.claimedQuestsCount || 0);

        return merged;
    }
};

// Inizializza immediatamente al caricamento dello script
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}
