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
    ONBOARDING_KEY: 'gdscript_hero_guest_onboarding_v1',

    // L'intenzione vale SOLO per la registrazione realmente iniziata qui,
    // non per accessi successivi a un account gia' esistente.
    beginGuestOnboarding(provider,importGuest=true,email='') {
        if(!this.isGuest() || !['google','email'].includes(provider))return false;
        const intent={
            version:1,provider,startedAt:Date.now(),importGuest:!!importGuest,
            email:provider==='email'?String(email).trim().toLowerCase():''
        };
        try{localStorage.setItem(this.ONBOARDING_KEY,JSON.stringify(intent));return true;}
        catch(error){console.warn('[AuthManager] Impossibile conservare la scelta di importazione:',error);return false;}
    },
    readGuestOnboarding() {
        try{
            const intent=JSON.parse(localStorage.getItem(this.ONBOARDING_KEY)||'null');
            if(intent?.version!==1 || !['email','google'].includes(intent.provider) ||
                !Number.isFinite(intent.startedAt) ||
                Date.now()-intent.startedAt > 30*86400000 ||
                intent.startedAt-Date.now() > 60000)return null;
            return intent;
        }catch(error){return null;}
    },
    clearGuestOnboarding() {
        try{localStorage.removeItem(this.ONBOARDING_KEY);}catch(error){}
    },
    // Solo Supabase puo' confermare che l'utente e' stato creato
    // DURANTE questa registrazione, non durante un normale login.
    isNewOnboardingAccount(intent,user=this.currentUser) {
        if(!intent||!user||user.isGuest)return false;
        const created=Date.parse(user.createdAt||'');
        if(!Number.isFinite(created) ||
            created<intent.startedAt-120000 ||
            created>intent.startedAt+1800000)return false;
        if(intent.provider==='email'){
            return intent.userId===user.id &&
                intent.email===String(user.email||'').trim().toLowerCase();
        }
        return intent.provider==='google' && user.provider==='google' &&
            Date.now()-intent.startedAt<=30*60000;
    },
    completeEmailOnboardingRegistration(user) {
        const intent=this.readGuestOnboarding();
        if(!intent||intent.provider!=='email')return;
        const created=Date.parse(user?.created_at||'');
        // Non riconoscere come nuova una risposta di signup che indica
        // un utente gia' registrato; in quel caso niente importazione.
        if(!user?.id || !Number.isFinite(created) ||
            created<intent.startedAt-120000 ||
            created>intent.startedAt+1800000){
            this.clearGuestOnboarding();
            return;
        }
        intent.userId=user.id;
        try{localStorage.setItem(this.ONBOARDING_KEY,JSON.stringify(intent));}
        catch(error){this.clearGuestOnboarding();}
    },
    // Chiamare esclusivamente DOPO una lettura cloud autenticata.
    // Una riga cloud assente NON basta, da sola, a provare la prima registrazione.
    takeFirstRegistrationGuestSave(cloudSave) {
        const intent=this.readGuestOnboarding();
        this.clearGuestOnboarding();
        const owner=this.currentUser?.id;
        if(!owner||cloudSave!==null ||
            (this.isCloudActive() &&
                (this._cloudVersion?.userId!==owner ||
                 this._cloudVersion.revision!==-1)) ||
            !this.isNewOnboardingAccount(intent))return null;
        if(!intent.importGuest)return null;
        try{
            const raw=localStorage.getItem('gdscript_hero_scoped_save_v1:guest');
            const data=raw?JSON.parse(raw):null;
            // Conserva anche sandbox, bozze e preferenze se gli XP sono 0.
            return data&&typeof data==='object'?data:null;
        }catch(error){
            console.warn('[AuthManager] Salvataggio ospite non leggibile:',error);
            return null;
        }
    },

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
                    try{
                        const cloudSave=await this.fetchFromCloud();
                        if(window.App?.integrateCloudSave)await window.App.integrateCloudSave(cloudSave);
                    }catch(error){
                        this.setSyncStatus('error','Lettura cloud fallita: salvataggio remoto sospeso per sicurezza.');
                        console.warn('[AuthManager] Lettura cloud fallita:',error);
                    }
                }

                // Ascolta gli eventi di sessione Supabase (OAuth redirect, login, refresh)
                // Non attendere metodi Supabase dentro il callback: possono
                // andare in deadlock sul lock interno delle sessioni.
                this.supabaseClient.auth.onAuthStateChange((event, session) => {
                    if(event==='SIGNED_OUT'){
                        try{localStorage.removeItem(this.SESSION_KEY);}catch(e){}
                        if(!this.isGuest()){
                            this.currentUser=this.createGuestUser();
                            this.notifyListeners();
                        }
                        return;
                    }
                    if(!session?.user || !['SIGNED_IN','INITIAL_SESSION'].includes(event))return;
                    const id=session.user.id;
                    if(this.currentUser?.id===id)return;
                    setTimeout(async()=>{
                        try{
                            const {data:{session:now}}=await this.supabaseClient.auth.getSession();
                            if(!now?.user || now.user.id!==id || this.currentUser?.id===id)return;
                            const u=now.user;
                            const user={
                                id:u.id,isGuest:false,
                                provider:u.app_metadata?.provider||(u.email?.includes('gmail')?'google':'email'),
                                name:u.user_metadata?.name||u.user_metadata?.full_name||u.email?.split('@')[0]||'Eroe Godot',
                                email:u.email,photoURL:u.user_metadata?.avatar_url||null,createdAt:u.created_at
                            };
                            this.saveSession(user);
                            const cloudSave=await this.fetchFromCloud();
                            if(this.currentUser?.id===id)await window.App?.integrateCloudSave?.(cloudSave);
                        }catch(error){
                            this.setSyncStatus('error','Lettura cloud fallita: salvataggio remoto sospeso.');
                            console.warn('[AuthManager] Recupero sessione fallito',error);
                        }
                    },0);
                });
            } catch (err) {
                console.warn('[AuthManager] Errore inizializzazione Supabase:', err);
                this.supabaseClient = null;
            }
        }

        // 2. Se Supabase non ha fornito un utente valido, controlla localStorage locale
        if (!supabaseFoundUser && !this.isCloudActive()) {
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
    async registerWithEmail(name, email, password) {
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

            if(!data?.user)throw new Error('Supabase non ha restituito un utente valido.');
            this.completeEmailOnboardingRegistration(data.user);
            const sessionUser = {
                id: data.user.id,
                isGuest: false,
                provider: 'email',
                name: cleanName,
                email: cleanEmail,
                photoURL: null,
                createdAt: data.user.created_at || new Date().toISOString()
            };

            // Confirm Email attivo: Supabase restituisce user ma session=null.
            // NON trattare tale utente come autenticato e non associare progressi.
            if(!data.session){
                return {user:null,account:data.user,pendingConfirmation:true};
            }
            this.saveSession(sessionUser);
            return { user: sessionUser, account: data.user,pendingConfirmation:false };
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
            progress: null
        };

        db[cleanEmail] = newAccount;
        this.saveAccountsDB(db);
        this.completeEmailOnboardingRegistration({id:userId,created_at:newAccount.createdAt});

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
    async loginWithGoogle() {
        if (!this.isCloudActive())throw new Error('Accesso Google disponibile solo con Supabase.');
        const redirectUrl=window.location.origin+window.location.pathname;
        const {data,error}=await this.supabaseClient.auth.signInWithOAuth({
            provider:'google', options:{redirectTo:redirectUrl}
        });
        if(error)throw new Error(error.message);
        return data;
    },

    /**
     * Disconnette l'utente e ripristina la modalità Ospite
     */
    async logout() {
        if (this.isCloudActive()) {
            const {error}=await this.supabaseClient.auth.signOut();
            if(error)throw new Error('Disconnessione dal cloud non riuscita: '+error.message);
        }

        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (e) {}

        this.currentUser = this.createGuestUser();
        this._cloudVersion=null;
        this.setSyncStatus('idle','');
        this.notifyListeners();
    },


    // Stato remoto valido solo dopo lettura: un errore non e' un salvataggio vuoto.
    setSyncStatus(kind,message=''){
        this._syncStatus={kind,message};
        if(kind==='synced'){
            try{localStorage.removeItem(this.conflictDismissalKey());}catch(e){}
        }
        window.App?.renderSyncStatus?.(this._syncStatus);
    },
    getSyncStatus(){return this._syncStatus||{kind:'idle',message:''};},
    conflictDismissalKey(){
        return 'gdscript_hero_conflict_dismissed_v1:'+(this.currentUser?.id||'guest');
    },
    isConflictDismissed(){
        const state=this._cloudVersion;
        if(!state?.blocked||state.userId!==this.currentUser?.id)return false;
        try{return localStorage.getItem(this.conflictDismissalKey())===String(state.revision);}
        catch(e){return false;}
    },
    dismissConflictNotice(){
        if(this._cloudVersion?.blocked){
            try{localStorage.setItem(this.conflictDismissalKey(),String(this._cloudVersion.revision));}
            catch(e){}
        }
        if(window.App){
            window.App._forceShowConflictNotice=false;
            window.App.renderSyncStatus?.(this.getSyncStatus());
        }
    },
    showConflictNotice(){
        if(window.App){
            window.App._forceShowConflictNotice=true;
            window.App.renderSyncStatus?.(this.getSyncStatus());
        }
    },
    getSaveRevision(){return this._cloudVersion?.userId===this.currentUser?.id?this._cloudVersion.revision:null;},
    async syncUserProgress(progressData){
        if(this.isGuest()||!this.currentUser?.email||!progressData)return;
        const owner=this.currentUser.id,snapshot=JSON.parse(JSON.stringify(progressData));
        const db=this.getAccountsDB();
        if(db[this.currentUser.email]){
            db[this.currentUser.email].progress=snapshot;
            db[this.currentUser.email].lastSync=new Date().toISOString();
            this.saveAccountsDB(db);
        }
        if(!this.isCloudActive())return;
        if(this._cloudVersion?.userId!==owner){
            this.setSyncStatus('pending','Salvataggio locale protetto: connessione cloud non verificata.');return;
        }
        if(this._cloudVersion.blocked){
            this.setSyncStatus('conflict','Modifiche su due dispositivi: sincronizzazione sospesa. I dati locali sono conservati.');return;
        }
        try{await this.syncToCloud(snapshot);}catch(error){
            this.setSyncStatus(error.code==='GDH_CONFLICT'?'conflict':'error',
                error.code==='GDH_CONFLICT'
                    ?'Due dispositivi hanno modificato i progressi: risolvi il conflitto senza perdere i dati.'
                    :'Cloud non raggiungibile. Il lavoro e salvato sul dispositivo; puoi riprovare.');
            console.warn('[AuthManager] Sincronizzazione fallita:',error);
        }
    },
    async syncToCloud(saveData){
        if(!this.isCloudActive()||this.isGuest())return;
        const owner=this.currentUser.id,snapshot=JSON.parse(JSON.stringify(saveData));
        const previous=this._cloudWriteQueue||Promise.resolve();
        const operation=previous.catch(()=>{}).then(async()=>{
            if(this.isGuest()||this.currentUser?.id!==owner||!this.isCloudActive())return;
            const state=this._cloudVersion;
            if(!state||state.userId!==owner||state.blocked)return;
            const {data:identity,error:identityError}=await this.supabaseClient.auth.getUser();
            if(identityError)throw identityError;
            if(identity?.user?.id!==owner)throw Error('Identita cloud non valida');
            if(this.currentUser?.id!==owner)return;
            this.setSyncStatus('saving','Sincronizzazione in corso…');
            const level=window.ProgressionV2?.levelFromXp?.(snapshot.xp||0)?.tier?.level||1;
            const {data,error}=await this.supabaseClient.rpc('gdh_cas_save_progress',{
                p_expected_revision:state.revision,p_save_data:snapshot,p_level:level
            });
            if(error)throw error;
            if(this.currentUser?.id!==owner)return;
            const result=Array.isArray(data)?data[0]:data;
            if(!result||!Number.isSafeInteger(Number(result.save_revision)))throw Error('Risposta cloud non valida');
            if(!result.applied){
                state.blocked=true;state.remote=result.save_data;state.revision=Number(result.save_revision);
                const conflict=Error('Conflitto tra dispositivi');conflict.code='GDH_CONFLICT';throw conflict;
            }
            state.revision=Number(result.save_revision);
            if(window.App?._saveOwner==='user:'+owner)
                window.App.saveCloudBaseline?.(snapshot,state.revision);
            this.setSyncStatus('synced','Progressi sincronizzati');
        });
        this._cloudWriteQueue=operation.catch(()=>{});
        return operation;
    },
    async fetchFromCloud(){
        if(!this.isCloudActive()||this.isGuest())return null;
        try{
        const owner=this.currentUser.id;
        const {data:identity,error:identityError}=await this.supabaseClient.auth.getUser();
        if(identityError)throw identityError;
        if(identity?.user?.id!==owner)throw Error('Identita cloud non valida');
        const {data,error}=await this.supabaseClient.from('game_saves')
            .select('save_data,save_revision').eq('user_id',owner).maybeSingle();
        if(error)throw error;
        if(this.currentUser?.id!==owner)throw Error('Account cambiato durante il caricamento');
        this._cloudVersion={userId:owner,revision:data?Number(data.save_revision):-1,blocked:false,remote:null};
        this.setSyncStatus('ready','Cloud verificato');
        return data?.save_data||null;
        }catch(error){
            this.setSyncStatus('error','Impossibile leggere il cloud. I progressi locali sono protetti: puoi riprovare.');
            throw error;
        }
    },
    downloadConflictCopies(){
        if(this.isGuest())return;
        const owner=this.currentUser.id;
        const local=window.App?.getSavePayload?.()||window.App?.state;
        let backup=null;
        try{
            const prefix='gdh_cloud_conflict_backup:'+owner+':';
            const keys=Object.keys(localStorage).filter(k=>k.startsWith(prefix)).sort();
            if(keys.length)backup=JSON.parse(localStorage.getItem(keys[keys.length-1]));
        }catch(e){}
        const data=this._cloudVersion?.blocked?
            {owner,local,cloud:this._cloudVersion.remote,created_at:new Date().toISOString()}:
            backup;
        if(!data)return this.exportToFile(local);
        const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
        const url=URL.createObjectURL(blob);
        const link=document.createElement('a');
        link.href=url;link.download='GDScriptHero-conflitto-'+new Date().toISOString().slice(0,10)+'.json';
        document.body.appendChild(link);link.click();link.remove();
        setTimeout(()=>URL.revokeObjectURL(url),1000);
    },
    async retryCloudSync(){
        if(!this.isCloudActive()||this.isGuest())return;
        if(this._cloudVersion?.blocked){
            this.setSyncStatus('conflict','Prima risolvi il conflitto tra dispositivi.');return;
        }
        try{
            if(this._cloudVersion?.userId!==this.currentUser.id){
                const remote=await this.fetchFromCloud();
                await window.App?.integrateCloudSave?.(remote);
            }else await this.syncUserProgress(window.App?.getSavePayload?.()||window.App?.state);
        }catch(error){
            this.setSyncStatus('error','Cloud non raggiungibile: dati locali conservati.');
        }
    },
    async resolveCloudConflict(){
        const state=this._cloudVersion;
        if(!state?.blocked||state.userId!==this.currentUser?.id)return;
        const local=window.App?.getSavePayload?.()||window.App?.state;
        if(!local)return;
        const suffix=new Date().toISOString().replace(/[:.]/g,'-');
        try{
            localStorage.setItem('gdh_cloud_conflict_backup:'+state.userId+':'+suffix,
                JSON.stringify({type:'GDScript Hero - recovery snapshot',
                    created_at:new Date().toISOString(),owner:state.userId,local,cloud:state.remote}));
        }catch(error){
            this.setSyncStatus('conflict','Spazio insufficiente per archiviare le versioni. Esporta prima un backup.');
            return;
        }
        // Merge esplicito, precedenza del codice locale. Entrambe le versioni
        // restano conservate nel backup, incluse le sezioni che divergono.
        const cloudSnapshot=state.remote;
        const merged=this.mergeProgress(cloudSnapshot||{},local);
        if(window.App?._saveOwner==='user:'+this.currentUser.id)
            window.App.saveCloudBaseline?.(cloudSnapshot,state.revision);
        state.blocked=false;state.remote=null;
        // Il login con bozze divergenti lascia volutamente il cloud bloccato.
        // Sbloccare l'invio solo dopo la copia preventiva di entrambe le versioni.
        if(window.App)window.App._cloudHydrationPending=false;
        window.App?.applyImportedState?.(merged,false);
        this.setSyncStatus('pending','Versioni archiviate. Invio della fusione in corso.');
        await this.syncUserProgress(window.App?.getSavePayload?.()||merged);
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
                level: window.ProgressionV2 ? window.ProgressionV2.levelFromXp(p.xp).tier.level : 1,
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
                rewardsV2: appState.rewardsV2 || null,
                streak: appState.streak || 1,
                streakWeeks: appState.streakWeeks || 0,
                streakMode: appState.streakMode || 'rilassato',
                streakGoalSelection: appState.streakGoalSelection || null,
                siteWelcomeSeen: !!appState.siteWelcomeSeen,
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
                lessonTaskProgress: appState.lessonTaskProgress || {},
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
        // Registro ricorrente locale: unione per identificativo, mai somma dei due saldi.
        // Non è una prova server di XP verificati.
        merged.rewardsV2 = window.ProgressionV2
            ? window.ProgressionV2.mergeRewards(current.rewardsV2,imported.rewardsV2,merged.xp)
            : (current.rewardsV2 || imported.rewardsV2 || null);
        merged.streak = Math.max(current.streak || 1, imported.streak || 1);
        merged.streakWeeks = Math.max(current.streakWeeks || 0, imported.streakWeeks || 0);
        // Una nuova registrazione importa anche il ritmo gia' selezionato
        // dall'ospite. La fusione fra dispositivi conserva invece la scelta
        // della settimana piu' recente e non ne crea una nuova.
        const curGoal=current.streakGoalSelection;
        const impGoal=imported.streakGoalSelection;
        if(!curGoal && impGoal){
            merged.streakGoalSelection=impGoal;
            merged.streakMode=imported.streakMode||current.streakMode||'rilassato';
        }else if(curGoal && impGoal && typeof impGoal.week==='string' &&
            typeof curGoal.week==='string' &&
            (() => {
                // Anche le vecchie settimane ISO (es. 2026-W44) devono
                // ordinarsi correttamente rispetto alle nuove date locali.
                const normalize=key=>{
                    if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(key))return key;
                    const match=/^([0-9]{4})-W([0-9]{2})$/.exec(key);
                    if(!match)return '';
                    const jan4=new Date(Date.UTC(Number(match[1]),0,4));
                    jan4.setUTCDate(jan4.getUTCDate()-(jan4.getUTCDay()+6)%7+
                        (Number(match[2])-1)*7);
                    return jan4.toISOString().slice(0,10);
                };
                return normalize(impGoal.week)>normalize(curGoal.week);
            })()){
            merged.streakGoalSelection=impGoal;
            merged.streakMode=imported.streakMode||current.streakMode||'rilassato';
        }
        merged.siteWelcomeSeen=!!(current.siteWelcomeSeen||imported.siteWelcomeSeen);

        const finishedSet = new Set([...(current.finishedLessons || []), ...(imported.finishedLessons || [])]);
        merged.finishedLessons = Array.from(finishedSet).sort((a, b) => a - b);

        const completedSet = new Set([...(current.completedLessons || [1]), ...(imported.completedLessons || [1])]);
        merged.completedLessons = Array.from(completedSet).sort((a, b) => a - b);

        const achSet = new Set([...(current.unlockedAchievements || []), ...(imported.unlockedAchievements || [])]);
        merged.unlockedAchievements = Array.from(achSet);

        merged.userCode = { ...(current.userCode || {}), ...(imported.userCode || {}) };
        merged.lessonTaskProgress=window.LessonPractice?.mergeProgress
            ? window.LessonPractice.mergeProgress(
                current.lessonTaskProgress||{},imported.lessonTaskProgress||{})
            : {...(current.lessonTaskProgress||{}),...(imported.lessonTaskProgress||{})};

        if (imported.profileCustomized) {
            merged.profile = { ...(current.profile || {}), ...(imported.profile || {}) };
            merged.profileCustomized = true;
        }

        // I salvataggi cloud possono arrivare in ritardo rispetto a un clic
        // di riscatto locale. Non sostituire un claimed=true con false
        // per la STESSA giornata, altrimenti torna il pulsante "Riscatta".
        const localQuests = current.dailyQuests;
        const remoteQuests = imported.dailyQuests;
        if (localQuests && remoteQuests &&
            localQuests.date && localQuests.date === remoteQuests.date) {
            const ids = new Set([
                ...Object.keys(localQuests.progress || {}),
                ...Object.keys(remoteQuests.progress || {}),
                ...Object.keys(localQuests.claimed || {}),
                ...Object.keys(remoteQuests.claimed || {})
            ]);
            const progress = {}, claimed = {};
            for (const id of ids) {
                progress[id] = Math.max(
                    Number(localQuests.progress?.[id]) || 0,
                    Number(remoteQuests.progress?.[id]) || 0
                );
                claimed[id] = !!(localQuests.claimed?.[id] ||
                    remoteQuests.claimed?.[id]);
            }
            merged.dailyQuests = {date:localQuests.date,progress,claimed};
        } else if (remoteQuests && (!localQuests ||
            String(remoteQuests.date || '') > String(localQuests.date || ''))) {
            merged.dailyQuests = remoteQuests;
        } else if (localQuests) {
            merged.dailyQuests = localQuests;
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
