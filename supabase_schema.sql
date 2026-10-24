-- ===================================================================
-- GDSCRIPT HERO - SCHEMA DATABASE PER SUPABASE
-- ===================================================================
-- Istruzioni:
-- 1. Vai nella dashboard del tuo progetto su https://supabase.com
-- 2. Clicca su "SQL Editor" nella barra laterale sinistra
-- 3. Clicca su "New query", incolla questo script e premi "Run" (▶)
-- ===================================================================

-- 1. Tabella dei Profili Utente
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT DEFAULT 'Sviluppatore Godot',
    avatar TEXT DEFAULT '🤖',
    color TEXT DEFAULT '#478cbf',
    tag TEXT DEFAULT 'Sviluppatore GDScript',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabella dei Salvataggi di Gioco (Game Saves)
CREATE TABLE IF NOT EXISTS public.game_saves (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    streak_weeks INTEGER DEFAULT 0,
    finished_lessons_count INTEGER DEFAULT 0,
    save_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Abilita Row Level Security (RLS) per la sicurezza dei dati
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

-- 4. Policy di Accesso Profili: Gli utenti possono leggere e aggiornare il proprio profilo
CREATE POLICY "Gli utenti possono leggere il proprio profilo"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Gli utenti possono aggiornare il proprio profilo"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Gli utenti possono inserire il proprio profilo"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5. Policy di Accesso Salvataggi: Gli utenti possono leggere e modificare solo i propri progressi
CREATE POLICY "Gli utenti possono leggere il proprio salvataggio"
    ON public.game_saves FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono salvare i propri progressi"
    ON public.game_saves FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Trigger per creare automaticamente il profilo alla registrazione utente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_emoji', '🤖')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Vista Statistiche Amministratore (Admin Overview)
CREATE OR REPLACE VIEW public.admin_stats_overview AS
SELECT 
    COUNT(*) AS total_registered_users,
    COALESCE(SUM(xp), 0) AS total_xp_distributed,
    COALESCE(AVG(finished_lessons_count), 0) AS avg_lessons_completed,
    COALESCE(MAX(xp), 0) AS max_xp_achieved
FROM public.game_saves;

-- 8. Policy per consentire agli Admin di visualizzare le statistiche di tutti gli utenti
CREATE POLICY "Gli amministratori possono leggere tutti i salvataggi"
    ON public.game_saves FOR SELECT
    USING (
        (auth.jwt() ->> 'email') = 'gianlucachifari@hotmail.com'
    );

CREATE POLICY "Gli amministratori possono leggere tutti i profili"
    ON public.profiles FOR SELECT
    USING (
        (auth.jwt() ->> 'email') = 'gianlucachifari@hotmail.com'
    );
