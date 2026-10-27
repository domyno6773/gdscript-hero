# Godot 4.4.1 — trusted Arena grading coordinator

This service is **source code only**, not deployed. Until it has a reachable HTTPS endpoint, a configured private fixture directory, a migrated Supabase project and secured Docker host, it MUST remain absent from the public website's official submission path.

## Why two processes

`coordinator.js` holds Supabase service credentials and expected solutions/case values in private fixture files. `godot/grader.gd` executes **one** input case per temporary Docker container. No expected values, private fixtures, network access, Docker socket or Supabase credentials are passed to the student process. No student code is retained in the DB: only its SHA-256 hash and score are stored.

The frontend currently uses Godot 4.4.1 WebAssembly; the server image downloads Godot 4.4.1 Linux. **Keep these versions aligned.**

## Start locally (administrator)

1. Apply `supabase/migrations/20261027_gdh_competition_foundation.sql` to a **staging** Supabase project first. The repository cannot apply it to your hosted Supabase automatically.
2. Build container image: `docker build -t gdh-godot-grader:4.4.1 server/arena/godot`.
3. Set **private** environment variables `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GDH_PRIVATE_FIXTURES_DIR` (absolute and NOT inside the public web root), `GDH_ALLOWED_ORIGIN` (HTTPS exact origin), `HOST` (default localhost), `PORT` (default 8787). Never commit secrets.
4. Create a private fixture `<challengeId>-v<grading_version>.json`. Each fixture is:
```json
{
  "challenge_id": "2026-11-base-1",
  "grading_version": 1,
  "method": "double_value",
  "tests": [
    {"args":[4],"expected":8,"points":35,"requirement":"Positive input"},
    {"args":[0],"expected":0,"points":35,"requirement":"Zero input"},
    {"args":[-2],"expected":-4,"points":30,"requirement":"Negative input"}
  ]
}
```
This fixture is an **illustrative example only**. Real published challenges must have separately reviewed private fixtures outside GitHub. The sum of case points must match the DB `points_max` and the fixture version must equal DB `grading_version`.
5. Run `node server/arena/coordinator.js` on an isolated host or deployment behind an HTTPS reverse proxy. Never expose its HTTP port directly.
6. `POST /api/arena/submit` with `Authorization: Bearer <valid Supabase user JWT>` and JSON `{"challengeId":"...","attemptId":"random UUID v4","code":"..."}`. It authenticates the user, checks country/season/challenge, grades in Docker, and calls `gdh_record_verified_verdict` with the service role.

**No official submission, seasonal score or XP feature should be switched on until the host, auth, database, and private test integration are independently verified end-to-end.**

## Security & operational notes

- The Docker process is short-lived, runs as uid 65534, read-only, without network, capabilities or privilege escalation, with CPU/RAM/PID limits and a small tmpfs. The coordinator is separate from the process running untrusted Godot code; never mount its own source, secret environment or fixture directory into the container.
- Each case runs in a separate process to prevent cross-case state. The server only reveals feedback by *requirement group*, never input/output of hidden tests.
- User code may attempt to print forged records or terminate Godot. Output is rejected if it contains ambiguous markers or if process exits abnormally. This is defense-in-depth, **not a mathematical guarantee against adversarial scripts**. Before production, do a sandbox escape audit and consider restricting file and OS facilities of GDScript beyond container boundaries.
- Limit API traffic at the HTTPS proxy too: the built-in limiter is in-memory per user and per process, not suitable alone for horizontally scaled deployment. Limit body size, concurrent requests and wallclock. Container image is a starting configuration: production needs pinned base-image digest, verified binary checksum, Docker host isolation, monitoring and log redaction.
- Never enable score submission by adding an API URL to the static site until production rollout is approved. Monthly season must be seeded only with actual reviewed challenges, not placeholders.
- CI includes a headless Godot integration smoke using `tests/native_godot` fixtures, plus Node static/mocked tests. It cannot verify production Docker/Supabase credentials.

## Outstanding before public leaderboard launch

Deployment, private case review, actual Supabase migration, real verified test results on staging, replay/race testing, IP-based country suggestion with manual correction, Premium billing/entitlements, and long-term auditing.
