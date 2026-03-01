# Instructions for Vlad (Head Developer)

## Objective
Rebuild Mission Control into a production-grade AI factory control plane.

Use these docs as source of truth:
1. `docs/rebuild-brief.md`
2. `docs/current-risks.md`
3. `docs/architecture-v1.md`
4. `docs/implementation-backlog.md`
5. `docs/handoff.md`

## Current status (what has already been done)
1. Initial architecture and rebuild strategy documented.
2. Top risks identified and prioritized.
3. Backlog created with acceptance criteria and delivery tracks.
4. Security-first delivery order established.

## Critical note from Jax
1. The API endpoints currently in code may be from an older API structure.
2. Existing keys/tokens may be incorrect.
3. You (Vlad) should confirm the current authoritative API and update contracts/envs accordingly.

## Required execution approach
1. Work one backlog ticket per PR.
2. Security and contract stability first.
3. No UI-only PRs that bypass backend correctness.
4. Every PR must include:
   - Summary of changes
   - Why the change is needed
   - Test evidence
   - Risks and rollback steps

## Phase 1 (must complete first)
1. Re-enable auth protection for private routes/APIs.
2. Remove default session-secret fallback and fail closed.
3. Make login responses generic (no config hints).
4. Fix `.env` handling and secret hygiene.
5. Align endpoint contracts across UI/API/relay.

## API and key alignment checklist
1. Produce a current endpoint matrix:
   - route
   - method
   - request schema
   - response schema
   - auth requirement
2. Remove hostname-based path heuristics and define explicit versioning.
3. Confirm canonical env var names and required/optional status.
4. Validate all keys/tokens in each environment.
5. Document final contract in repo (`docs/api-contract.md` suggested).

## Definition of done (per ticket)
1. Acceptance criteria from `implementation-backlog.md` met.
2. Tests added/updated and passing.
3. No known broken route in nav/UI.
4. Handoff log updated with PR details.

## First actionable PR order
1. PR-1: Auth + secret fail-closed hardening.
2. PR-2: API contract normalization + endpoint parity.
3. PR-3: Fix broken task dispatch flow end-to-end.
4. PR-4: Establish baseline tests + CI required checks.

## Communication protocol
1. If API contract is uncertain, pause feature work and resolve contract first.
2. If key/token mismatch is found, rotate and document immediately.
3. Keep `docs/handoff.md` current after each merged PR.
