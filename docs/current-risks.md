# Current Risks (Top Findings)

## P0

### 1) Auth disabled globally
- File: `src/middleware.ts`
- Risk: Private dashboard and API endpoints are public.
- Impact: Unauthorized control actions and data exposure.
- Required fix: Reinstate auth checks on protected routes and APIs.

### 2) Predictable session secret fallback
- File: `src/lib/auth.ts`
- Risk: Falls back to a static development token when env vars are missing.
- Impact: Session forgery if misconfigured in deployment.
- Required fix: Fail closed when secret is missing; no static fallback.

### 3) Task assignment flow is broken by API contract mismatch
- Files: `src/components/NewTaskModal.tsx`, `local-api/server.mjs`
- Risk: UI sends unsupported `command: "task"`; backend supports only pause/resume.
- Impact: Core mission-control action fails.
- Required fix: Define and enforce one typed command contract shared by UI/API/relay.

## P1

### 4) API path versioning mismatch
- Files: `src/lib/mcApi.ts`, `local-api/server.mjs`
- Risk: `/v1` prefixing logic depends on localhost detection.
- Impact: Tunnel/remote deployments can break with 404s.
- Required fix: Standardize API base and version policy; no hostname heuristics.

### 5) Referenced endpoint not implemented
- Files: `src/app/api/mc/scoreboard/route.ts`, `local-api/server.mjs`
- Risk: Proxy calls `/scoreboard`, local API does not serve it.
- Impact: Broken feature and operator confusion.
- Required fix: Implement endpoint or remove/feature-flag until available.

### 6) Secret hygiene gap
- Files: `.env`, `.gitignore`
- Risk: `.env` can be committed; ignore rules only cover `.env*.local`.
- Impact: Key leakage into git history.
- Required fix: ignore `.env`, rotate any exposed keys, use secret manager conventions.

### 7) Login response leaks configuration hints
- File: `src/app/api/auth/login/route.ts`
- Risk: Error reveals auth setup details.
- Impact: Improves attacker enumeration.
- Required fix: return generic auth errors only.

## P2

### 8) Incorrect status mapping in UI
- File: `src/components/FullDashboard.tsx`
- Risk: `idle` mapped as `busy`.
- Impact: Misleading operational view.
- Required fix: separate `idle` state and metrics.

### 9) Navigation to non-existent pages
- Files: `src/components/Sidebar.tsx`, `src/components/MobileNav.tsx`
- Risk: Links to `/analytics` and `/settings` without routes.
- Impact: 404s and trust erosion.
- Required fix: hide unfinished routes behind feature flags.

### 10) No automated test suite
- Files: `package.json`, repository
- Risk: High regression probability.
- Impact: unsafe refactors and poor release confidence.
- Required fix: add unit, API contract, and smoke e2e tests.

## Stabilization order
1. Security hardening (P0/P1 auth + secrets)
2. Contract alignment and endpoint correctness
3. Remove broken UI paths and mock/real data ambiguity
4. Add test gates in CI
