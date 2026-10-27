# Arena Classificata: server checklist (P3/P4)

Migration: `supabase/migrations/20261027_gdh_competition_foundation.sql`

**Caution:** GitHub Pages does not apply migrations. Do **not** paste any `service_role` secret into `supabase-config.js`, static client code, GitHub Actions logs, or issues. Apply SQL with Supabase CLI using privileged operator credentials, then validate in a staging project first. The existing `supabase_schema.sql` must be applied.

## Implemented server contract

- Monthly `YYYY-MM` UTC seasons, exactly 3 challenges per 4 release groups, score caps 100/150/250 and first-perfect XP 10/15/25.
- First confirmation of `gdh_confirm_country` locks ISO alpha-2 country for the whole season. The browser may suggest a country from a privacy-respecting IP lookup; do not request GPS. A player may confirm a different country once before competing. Reconfirming same country is idempotent.
- Active task descriptions can be read from `gdh_challenges` under its RLS policy. Archive challenge descriptions require `gdh_premium_archive` and a *server-held* valid `gdh_entitlements` record. No subscribed flag in the client, no old source code retained. The archive section must remain closed without Premium.
- Only a **trusted Godot 4.4.1 headless grader worker** may invoke `gdh_record_verified_verdict` via service role; it must NOT accept a passed score/award supplied by browsers. Browser sends code/challenge ID with user's JWT; worker authenticates, rates limits, runs sandboxed Godot and private tests, hashes submitted source, derives score, and records the verdict. The score and XP reward are derived from the DB challenge row by that worker/SQL. The SQL function is deliberately inaccessible to anon/authenticated callers.
- `gdh_leaderboard` exposes global top players or the caller's own confirmed country. Ties share rank using `dense_rank`. Results must be displayed using `textContent`, never interpolated into HTML.
- The legacy `game_saves.xp` and `rewardsV2` are **not trusted** as awards for the leaderboard. Official XP in `gdh_verified_xp_events` is separate, with an idempotent event key; no import may mint it.

## Before enabling official submission

1. Build and deploy the actual Godot 4.4.1 headless evaluator, with isolated per-request container, network disabled, privilege drop, resource and wallclock limits, temporary workspace, no service credentials mounted inside the container, fixtures inaccessible to users, verified Godot build version and deterministic test cases.
2. Put the coordinator (holds service-role credential) OUTSIDE the student-code process; authenticate user JWT on every submission; constrain challenge/season and source size; cap requests. Never expose fixture content in error messages.
3. Validate RLS in a staging Supabase project as anon, authenticated and service_role. Test country locking, replay attempts, 0/partial/full scores, best-of, once-only XP, cutoff UTC, cancellation and tied ranks.
4. Seed *real* season/challenge content with private fixtures only after tests and deployment. Do not create placeholder scores or invented player rows.
5. Add subscription billing and webhook verification to populate `gdh_entitlements`; a billing UI alone does not grant access.

This migration prepares the server data model. It does **not** make the grading service live.
