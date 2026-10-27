-- Security hardening for pre-existing account infrastructure.
-- Legacy admin aggregate view should not bypass callers' row-level policies.
BEGIN;
ALTER VIEW public.admin_stats_overview SET (security_invoker = true);
REVOKE ALL ON public.admin_stats_overview FROM PUBLIC, anon;
-- Signed-in users retain the view privilege, but only see data allowed by
-- underlying profiles/game_saves RLS. Admin RLS policy remains unchanged.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
COMMIT;
