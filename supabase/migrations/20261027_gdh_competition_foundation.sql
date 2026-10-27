-- GDScript Hero 2.0 — migration to apply AFTER supabase_schema.sql.
-- Not auto-deployed by GitHub Pages. Run in Supabase SQL Editor or via Supabase CLI.
-- CRITICAL: never put the service_role key or a grading secret in the static site.
BEGIN;

CREATE SCHEMA IF NOT EXISTS gdh_private;
REVOKE ALL ON SCHEMA gdh_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA gdh_private TO service_role;

CREATE TABLE IF NOT EXISTS public.gdh_seasons (
  id TEXT PRIMARY KEY CHECK (id ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  opens_at TIMESTAMPTZ NOT NULL,
  closes_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','frozen','closed')),
  CHECK (opens_at < closes_at)
);
CREATE TABLE IF NOT EXISTS public.gdh_challenges (
  id TEXT PRIMARY KEY CHECK (length(id) BETWEEN 4 AND 80),
  season_id TEXT NOT NULL REFERENCES public.gdh_seasons(id),
  week_no SMALLINT NOT NULL CHECK (week_no BETWEEN 1 AND 4),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('base','intermedia','avanzata')),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 5 AND 120),
  task TEXT NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  points_max INTEGER NOT NULL CHECK (points_max IN (100,150,250)),
  xp_once INTEGER NOT NULL CHECK (xp_once IN (10,15,25)),
  grading_version INTEGER NOT NULL DEFAULT 1 CHECK (grading_version >= 1),
  published_at TIMESTAMPTZ NOT NULL,
  state TEXT NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','published','frozen','cancelled')),
  CHECK ((difficulty='base' AND points_max=100 AND xp_once=10)
    OR (difficulty='intermedia' AND points_max=150 AND xp_once=15)
    OR (difficulty='avanzata' AND points_max=250 AND xp_once=25)),
  UNIQUE(season_id,week_no,difficulty),
  UNIQUE(id,season_id)
);
-- Only the worker has access to grader fixtures, never the browser API.
CREATE TABLE IF NOT EXISTS gdh_private.gdh_grading_fixtures (
  challenge_id TEXT PRIMARY KEY REFERENCES public.gdh_challenges(id) ON DELETE CASCADE,
  grading_version INTEGER NOT NULL,
  fixture_json JSONB NOT NULL,
  reviewed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS public.gdh_country_selections (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id TEXT NOT NULL REFERENCES public.gdh_seasons(id),
  country TEXT NOT NULL CHECK (country ~ '^[A-Z]{2}$'),
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,season_id)
);
CREATE TABLE IF NOT EXISTS public.gdh_attempts (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL,
  challenge_id TEXT NOT NULL REFERENCES public.gdh_challenges(id),
  grading_version INTEGER NOT NULL CHECK (grading_version > 0),
  awarded_points INTEGER NOT NULL CHECK (awarded_points BETWEEN 0 AND 250),
  code_sha256 TEXT NOT NULL CHECK (code_sha256 ~ '^[a-f0-9]{64}$'),
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,attempt_id)
);
-- No student source code is persisted on the server.
CREATE TABLE IF NOT EXISTS public.gdh_best_scores (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES public.gdh_challenges(id),
  points INTEGER NOT NULL CHECK (points BETWEEN 0 AND 250),
  grading_version INTEGER NOT NULL,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,challenge_id)
);
CREATE INDEX IF NOT EXISTS gdh_best_scores_challenge_idx ON public.gdh_best_scores(challenge_id);
CREATE TABLE IF NOT EXISTS public.gdh_verified_xp_events (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('arena','lesson','review','quest','streak','project','achievement')),
  amount INTEGER NOT NULL CHECK (amount > 0 AND amount <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id,event_key)
);
-- Never infer Premium status from a browser cookie or paid CSS badge.
CREATE TABLE IF NOT EXISTS gdh_private.gdh_entitlements (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product TEXT NOT NULL CHECK (product = 'premium'),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ NOT NULL,
  provider_reference TEXT,
  PRIMARY KEY(user_id,product),
  CHECK (valid_until > valid_from)
);

ALTER TABLE public.gdh_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdh_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdh_country_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdh_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdh_best_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdh_verified_xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdh_private.gdh_grading_fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdh_private.gdh_entitlements ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.gdh_seasons, public.gdh_challenges, public.gdh_country_selections,
  public.gdh_attempts, public.gdh_best_scores, public.gdh_verified_xp_events FROM PUBLIC,anon,authenticated;
REVOKE ALL ON gdh_private.gdh_grading_fixtures,gdh_private.gdh_entitlements FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.gdh_seasons,public.gdh_challenges TO anon,authenticated;
CREATE POLICY gdh_season_catalog ON public.gdh_seasons FOR SELECT TO anon,authenticated
  USING (status='published' AND opens_at <= now() AND closes_at > now());
CREATE POLICY gdh_active_challenge_catalog ON public.gdh_challenges FOR SELECT TO anon,authenticated
  USING (state='published' AND published_at<=now() AND EXISTS (
    SELECT 1 FROM public.gdh_seasons s WHERE s.id=season_id
      AND s.status='published' AND now()>=s.opens_at AND now()<s.closes_at));
-- Crucial: no general direct SELECT on attempts, scores, verification ledger or archived challenges.

CREATE OR REPLACE FUNCTION public.gdh_confirm_country(p_season TEXT,p_country TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $$
DECLARE v_user UUID := auth.uid(); v_country TEXT := upper(trim(p_country)); v_country_existing TEXT;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Devi effettuare l’accesso'; END IF;
  IF v_country !~ '^[A-Z]{2}$' THEN RAISE EXCEPTION 'Codice paese ISO a due lettere richiesto'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.gdh_seasons
     WHERE id=p_season AND status='published' AND now()>=opens_at AND now()<closes_at)
     THEN RAISE EXCEPTION 'Stagione non attiva'; END IF;
  INSERT INTO public.gdh_country_selections(user_id,season_id,country)
    VALUES(v_user,p_season,v_country) ON CONFLICT DO NOTHING;
  SELECT country INTO v_country_existing FROM public.gdh_country_selections
    WHERE user_id=v_user AND season_id=p_season;
  -- Repeat is idempotent, but a different country cannot replace the existing selection.
  IF v_country_existing IS DISTINCT FROM v_country THEN
    RAISE EXCEPTION 'Paese già confermato per questa stagione';
  END IF;
  RETURN v_country_existing;
END;
$$;
REVOKE ALL ON FUNCTION public.gdh_confirm_country(TEXT,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gdh_confirm_country(TEXT,TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.gdh_my_country(p_season TEXT)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT c.country FROM public.gdh_country_selections c
  WHERE c.user_id=auth.uid() AND c.season_id=p_season $$;
REVOKE ALL ON FUNCTION public.gdh_my_country(TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gdh_my_country(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.gdh_my_premium()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=''
AS $$ SELECT auth.uid() IS NOT NULL AND EXISTS (
  SELECT 1 FROM gdh_private.gdh_entitlements e
  WHERE e.user_id=auth.uid() AND e.product='premium'
    AND now()>=e.valid_from AND now()<e.valid_until
) $$;
REVOKE ALL ON FUNCTION public.gdh_my_premium() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gdh_my_premium() TO authenticated;

-- Archive remains completely inaccessible to anyone without an active entitlement.
-- Even premium users never receive secret fixtures or solutions.
CREATE OR REPLACE FUNCTION public.gdh_premium_archive(p_season TEXT)
RETURNS TABLE(challenge_id TEXT,title TEXT,task TEXT,difficulty TEXT,topics TEXT[])
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=''
AS $$
BEGIN
 IF auth.uid() IS NULL OR NOT public.gdh_my_premium() THEN
   RAISE EXCEPTION 'Abbonamento Premium necessario';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gdh_seasons s
   WHERE s.id=p_season AND s.closes_at<=now() AND s.status IN ('closed','published'))
   THEN RAISE EXCEPTION 'Archivio non disponibile'; END IF;
 RETURN QUERY SELECT c.id,c.title,c.task,c.difficulty,c.topics
   FROM public.gdh_challenges c
   WHERE c.season_id=p_season AND c.state='published'
   ORDER BY c.week_no,c.difficulty;
END;
$$;
REVOKE ALL ON FUNCTION public.gdh_premium_archive(TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gdh_premium_archive(TEXT) TO authenticated;

-- Worker-only transaction. Call only after executing the real Godot 4.4.1 grader
-- and matching private fixture version. Never accept an award from the web page.
CREATE OR REPLACE FUNCTION public.gdh_record_verified_verdict(
  p_user UUID, p_attempt UUID, p_challenge TEXT, p_version INT,
  p_code_sha256 TEXT, p_points INT
) RETURNS TABLE(best_points INT,xp_awarded INT,duplicate_attempt BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $$
DECLARE v_challenge public.gdh_challenges%ROWTYPE;
  v_existing UUID; v_best INT; v_xp INT := 0;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN
   RAISE EXCEPTION 'Verifica ufficiale riservata al worker';
 END IF;
 SELECT c.* INTO v_challenge FROM public.gdh_challenges c JOIN public.gdh_seasons s
   ON s.id=c.season_id
   WHERE c.id=p_challenge AND c.state='published'
      AND s.status='published' AND now()>=s.opens_at AND now()<s.closes_at
      AND now()>=c.published_at;
 IF NOT FOUND THEN RAISE EXCEPTION 'Sfida non attiva'; END IF;
 IF p_version IS DISTINCT FROM v_challenge.grading_version OR
    p_points IS NULL OR p_points<0 OR p_points>v_challenge.points_max OR
    p_code_sha256 !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Verdetto o versione non validi';
 END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gdh_country_selections cs
    WHERE cs.user_id=p_user AND cs.season_id=v_challenge.season_id)
   THEN RAISE EXCEPTION 'Paese della stagione non confermato'; END IF;
 INSERT INTO public.gdh_attempts(user_id,attempt_id,challenge_id,grading_version,awarded_points,code_sha256)
  VALUES(p_user,p_attempt,p_challenge,p_version,p_points,p_code_sha256)
  ON CONFLICT (user_id,attempt_id) DO NOTHING RETURNING attempt_id INTO v_existing;
 IF v_existing IS NULL THEN
   IF NOT EXISTS(SELECT 1 FROM public.gdh_attempts
     WHERE user_id=p_user AND attempt_id=p_attempt AND challenge_id=p_challenge
       AND grading_version=p_version AND code_sha256=p_code_sha256
       AND awarded_points=p_points) THEN
     RAISE EXCEPTION 'Identificativo tentativo già usato con un contenuto diverso';
   END IF;
   SELECT bs.points INTO v_best FROM public.gdh_best_scores bs
     WHERE bs.user_id=p_user AND bs.challenge_id=p_challenge;
   RETURN QUERY SELECT COALESCE(v_best,0),0,TRUE;
   RETURN;
 END IF;
 INSERT INTO public.gdh_best_scores(user_id,challenge_id,points,grading_version)
   VALUES(p_user,p_challenge,p_points,p_version)
 ON CONFLICT (user_id,challenge_id) DO UPDATE SET
   points=GREATEST(public.gdh_best_scores.points,EXCLUDED.points),
   grading_version=EXCLUDED.grading_version,
   awarded_at=CASE WHEN EXCLUDED.points>public.gdh_best_scores.points
     THEN now() ELSE public.gdh_best_scores.awarded_at END;
 IF p_points=v_challenge.points_max THEN
    INSERT INTO public.gdh_verified_xp_events(user_id,event_key,source,amount)
      VALUES(p_user,'arena:'||p_challenge,'arena',v_challenge.xp_once)
      ON CONFLICT (user_id,event_key) DO NOTHING
      RETURNING amount INTO v_xp;
 END IF;
 SELECT bs.points INTO v_best FROM public.gdh_best_scores bs
   WHERE bs.user_id=p_user AND bs.challenge_id=p_challenge;
 RETURN QUERY SELECT v_best,COALESCE(v_xp,0),FALSE;
END;
$$;
REVOKE ALL ON FUNCTION public.gdh_record_verified_verdict(UUID,UUID,TEXT,INT,TEXT,INT)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gdh_record_verified_verdict(UUID,UUID,TEXT,INT,TEXT,INT)
  TO service_role;

-- Both scopes use the same per-challenge best points. No premium weighting.
-- Caller may view global board or their own country, never arbitrary filtered countries.
CREATE OR REPLACE FUNCTION public.gdh_leaderboard(p_season TEXT, p_scope TEXT DEFAULT 'global',
  p_limit INT DEFAULT 50)
RETURNS TABLE(rank BIGINT,user_id UUID,display_name TEXT,country TEXT,points BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=''
AS $$
DECLARE v_country TEXT;
BEGIN
 IF p_scope NOT IN ('global','country') THEN RAISE EXCEPTION 'Ambito non valido'; END IF;
 IF p_scope='country' THEN
    IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Accesso richiesto'; END IF;
    SELECT c.country INTO v_country FROM public.gdh_country_selections c
      WHERE c.user_id=auth.uid() AND c.season_id=p_season;
    IF v_country IS NULL THEN RAISE EXCEPTION 'Paese non ancora confermato'; END IF;
 END IF;
 IF NOT EXISTS (SELECT 1 FROM public.gdh_seasons s
   WHERE s.id=p_season AND s.status<>'draft') THEN
   RAISE EXCEPTION 'Stagione non pubblicata';
 END IF;
 RETURN QUERY
 WITH scores AS (
   SELECT bs.user_id,SUM(bs.points)::BIGINT AS total
   FROM public.gdh_best_scores bs
   JOIN public.gdh_challenges c ON c.id=bs.challenge_id
   WHERE c.season_id=p_season AND c.state='published'
   GROUP BY bs.user_id
 ), board AS (
   SELECT sc.user_id,sc.total,cs.country,
     COALESCE(NULLIF(left(p.name,36),''),'Eroe Godot') AS display_name
   FROM scores sc
   JOIN public.gdh_country_selections cs
     ON cs.user_id=sc.user_id AND cs.season_id=p_season
   LEFT JOIN public.profiles p ON p.id=sc.user_id
   WHERE p_scope='global' OR cs.country=v_country
 )
 SELECT dense_rank() OVER(ORDER BY board.total DESC) AS rank,
   board.user_id,board.display_name,board.country,board.total
 FROM board ORDER BY rank,board.user_id LIMIT LEAST(GREATEST(p_limit,1),100);
END;
$$;
REVOKE ALL ON FUNCTION public.gdh_leaderboard(TEXT,TEXT,INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gdh_leaderboard(TEXT,TEXT,INT) TO anon,authenticated;

-- Prevent ordinary users from writing official ranks, XP, private fixtures, subscription flags.
-- service_role accesses tables through dedicated backend only.
GRANT ALL ON public.gdh_seasons,public.gdh_challenges,public.gdh_country_selections,
  public.gdh_attempts,public.gdh_best_scores,public.gdh_verified_xp_events TO service_role;
GRANT ALL ON gdh_private.gdh_grading_fixtures,gdh_private.gdh_entitlements TO service_role;
COMMIT;
