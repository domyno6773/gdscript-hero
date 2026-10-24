/**
 * ===================================================================
 * GDSCRIPT HERO - CONFIGURAZIONE SUPABASE CLOUD (supabase-config.js)
 * ===================================================================
 * Configurazione per collegare il database cloud gratuito Supabase.
 * Permette:
 *  1. Accesso Google OAuth reale e sincronizzazione tra dispositivi
 *  2. Salvataggio cloud di tutti i progressi e codice scritto
 *  3. Pannello Amministratore per vedere statistiche e utenti registrati
 * 
 * Se i campi sono vuoti, l'app funziona in modalità autonoma locale (offline-ready).
 * Per attivare il Cloud:
 *  - Crea un account gratuito su https://supabase.com
 *  - Crea un nuovo progetto (es. "gdscript-hero")
 *  - Copia l'URL e la chiave 'anon public' da Settings -> API
 * ===================================================================
 */

const SupabaseConfig = {
    // 1. Inserisci qui l'URL del tuo progetto Supabase
    url: '', // Es: 'https://abcdefghijklm.supabase.co'

    // 2. Inserisci qui la chiave Anon pubblica
    anonKey: '', // Es: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

    // 3. Email autorizzate ad accedere al "👑 Pannello Amministratore"
    adminEmails: [
        'admin@godot.it',
        'godot.dev@gmail.com',
        'gianluca@example.com'
    ],

    // Verifica se le credenziali cloud sono attive
    isConfigured() {
        return !!(
            this.url && 
            this.anonKey && 
            typeof this.url === 'string' &&
            this.url.startsWith('https://') && 
            this.anonKey.length > 25
        );
    },

    // Verifica se un'email è abilitata come amministratore
    isAdmin(email) {
        if (!email) return false;
        const clean = email.trim().toLowerCase();
        return this.adminEmails.some(e => e.toLowerCase() === clean);
    }
};

if (typeof window !== 'undefined') {
    window.SupabaseConfig = SupabaseConfig;
}
