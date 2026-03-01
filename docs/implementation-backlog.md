# Implementation Backlog (Prioritized)

## Priority 0: Security and correctness

### 1) Reinstate route protection
- Description: Re-enable middleware protection for private pages and sensitive APIs.
- Acceptance criteria:
1. Unauthenticated requests to protected pages redirect to login.
2. Unauthenticated API calls return 401.
3. Public endpoints are explicitly whitelisted.

### 2) Remove default session token fallback
- Description: Require explicit session secret in all non-test environments.
- Acceptance criteria:
1. App fails fast when auth secret is missing.
2. No static fallback token in code.
3. Unit test covers missing/valid secret behavior.

### 3) Harden login responses
- Description: Return generic auth errors only.
- Acceptance criteria:
1. Invalid credentials always return same error shape/message.
2. No env or auth-mode hints in response body.

### 4) Secret management cleanup
- Description: Prevent accidental `.env` commits and rotate known dev keys.
- Acceptance criteria:
1. `.env` added to ignore rules.
2. Existing local secrets moved to `.env.local` or secret manager.
3. Documented key rotation checklist.

## Priority 1: Contract and flow alignment

### 5) Define shared command schema
- Description: Create typed command contract for task dispatch/pause/resume.
- Acceptance criteria:
1. Shared schema package consumed by UI + API + relay.
2. Invalid command payloads rejected with 400.
3. New task flow executes successfully end-to-end.

### 6) Normalize API versioning
- Description: Remove hostname-based path-prefix heuristics.
- Acceptance criteria:
1. API base/version configured explicitly.
2. Local and tunneled deployments pass same integration tests.
3. No endpoint 404 from version mismatch.

### 7) Endpoint parity audit
- Description: Implement/remove mismatched endpoints (e.g. scoreboard).
- Acceptance criteria:
1. Every referenced endpoint has an implementation or feature flag.
2. Contract test verifies all wired routes.

## Priority 2: Core orchestration foundations

### 8) Introduce mission/run/task domain model
- Description: Persist lifecycle entities and transitions.
- Acceptance criteria:
1. Mission creation and run creation APIs available.
2. Task assignment stored with status transitions.
3. UI reads live state from orchestrator, not static mocks.

### 9) Add event timeline pipeline
- Description: Emit and persist domain events for every state change.
- Acceptance criteria:
1. Timeline endpoint returns ordered run events.
2. UI activity feed backed by real events.
3. Event schema documented and versioned.

### 10) Implement approval gate for risky actions
- Description: Block high-risk commands until operator approval.
- Acceptance criteria:
1. Policy rule can mark action `needs_approval`.
2. Approval UI + API decision path works.
3. Audit record includes approver + timestamp.

## Priority 3: Quality gates

### 11) Add test pyramid
- Description: Add unit + contract + smoke e2e tests.
- Acceptance criteria:
1. `pnpm test` runs unit tests.
2. Contract tests validate API schema and status codes.
3. Smoke e2e validates login + create mission + assign task flow.

### 12) CI enforcement
- Description: Block merges on lint/typecheck/tests.
- Acceptance criteria:
1. CI runs lint, typecheck, tests on PR.
2. Required checks configured in branch protection.

## Suggested delivery tracks

### 2-week track
1. Tickets 1-7 (security + contract stabilization)
2. Ticket 11 basic unit/contract tests
3. CI baseline from ticket 12

### 6-week track
1. Tickets 8-10 (orchestration/event/approval foundations)
2. Expand ticket 11 to smoke e2e
3. Operational runbooks and incident playbooks
