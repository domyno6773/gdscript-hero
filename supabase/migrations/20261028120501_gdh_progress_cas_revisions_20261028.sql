-- Applied to Supabase on 2026-10-28, migration 20261028120501.
-- Preserves existing game_saves: the five previous rows start at revision 0.
ALTER TABLE public.game_saves
 ADD COLUMN IF NOT EXISTS save_revision bigint NOT NULL DEFAULT 0;

-- Legacy clients that use unconditional upsert cannot silently overwrite a
-- revisioned save. Reloading the modern frontend restores cloud syncing.
CREATE OR REPLACE FUNCTION public.gdh_progress_revision_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
BEGIN
 IF TG_OP='INSERT' AND NEW.save_revision <> 1 THEN
   RAISE EXCEPTION 'Salvataggio obsoleto: aggiorna GDScript Hero prima di sincronizzare' USING ERRCODE='P0001';
 ELSIF TG_OP='UPDATE' AND NEW.save_revision <> OLD.save_revision+1 THEN
   RAISE EXCEPTION 'Revisione cloud non valida: aggiornamento rifiutato' USING ERRCODE='P0001';
 END IF;
 RETURN NEW;
END;
$fn$;
DROP TRIGGER IF EXISTS gdh_progress_revision_guard_trigger ON public.game_saves;
CREATE TRIGGER gdh_progress_revision_guard_trigger
BEFORE INSERT OR UPDATE ON public.game_saves
FOR EACH ROW EXECUTE FUNCTION public.gdh_progress_revision_guard();

-- Atomic, optimistic concurrency using the authenticated user's RLS.
-- expected=-1 means "no remote row" and creates revision 1.
-- Otherwise an UPDATE succeeds only if the observed revision still matches.
CREATE OR REPLACE FUNCTION public.gdh_cas_save_progress(
 p_expected_revision bigint,p_save_data jsonb,p_level integer DEFAULT 1
)
RETURNS TABLE(applied boolean,save_revision bigint,save_data jsonb)
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE
 v_user uuid:=auth.uid();
 v_revision bigint;
 v_xp integer;
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Autenticazione richiesta'; END IF;
 IF p_expected_revision IS NULL OR p_expected_revision < -1 THEN
   RAISE EXCEPTION 'Revisione cloud non valida';
 END IF;
 IF p_save_data IS NULL OR jsonb_typeof(p_save_data)<>'object' OR
    octet_length(p_save_data::text)>4194304 THEN
   RAISE EXCEPTION 'Salvataggio non valido o troppo grande (limite 4 MB)';
 END IF;
 v_xp:=GREATEST(0,LEAST(2147483647,COALESCE((p_save_data->>'xp')::bigint,0)))::integer;
 INSERT INTO public.game_saves AS saved
  (user_id,email,xp,level,streak,streak_weeks,finished_lessons_count,save_data,updated_at,save_revision)
 VALUES (v_user,auth.jwt()->>'email',v_xp,
    GREATEST(1,LEAST(COALESCE(p_level,1),10000)),
    GREATEST(0,COALESCE((p_save_data->>'streak')::integer,0)),
    GREATEST(0,COALESCE((p_save_data->>'streakWeeks')::integer,0)),
    CASE WHEN jsonb_typeof(p_save_data->'finishedLessons')='array'
      THEN jsonb_array_length(p_save_data->'finishedLessons') ELSE 0 END,
    p_save_data,clock_timestamp(),1)
 ON CONFLICT(user_id) DO UPDATE SET
    email=excluded.email,xp=excluded.xp,level=excluded.level,
    streak=excluded.streak,streak_weeks=excluded.streak_weeks,
    finished_lessons_count=excluded.finished_lessons_count,
    save_data=excluded.save_data,updated_at=clock_timestamp(),
    save_revision=saved.save_revision+1
 WHERE saved.save_revision=p_expected_revision
 RETURNING saved.save_revision INTO v_revision;
 IF FOUND THEN
   RETURN QUERY SELECT true,v_revision,p_save_data;
 ELSE
   RETURN QUERY SELECT false,gs.save_revision,gs.save_data
    FROM public.game_saves gs WHERE gs.user_id=v_user;
 END IF;
END;
$fn$;
REVOKE ALL ON FUNCTION public.gdh_cas_save_progress(bigint,jsonb,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gdh_cas_save_progress(bigint,jsonb,integer) TO authenticated;
