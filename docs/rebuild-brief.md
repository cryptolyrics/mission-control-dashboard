# Mission Control Rebuild Brief

## Purpose
Build a production-grade AI factory mission control platform that can safely orchestrate autonomous and semi-autonomous agents.

Core operating loop:
1. Observe
2. Decide
3. Dispatch
4. Verify

## Vision
Mission Control is a control plane, not a visual dashboard. The UI should present live state and approvals, while orchestration, policy, and execution reliability live in backend services.

## Product outcomes
- Operators can create and run missions with clear state transitions.
- Every task and tool call is traceable in an audit timeline.
- High-risk actions require explicit approval.
- Failures are visible, retryable, and recoverable.

## Constraints
- Existing codebase: Next.js app + local relay/API stubs.
- Must support local development plus remote deployment.
- Must work with OpenClaw gateway integration.
- Security cannot rely on best-effort environment setup.

## Non-goals (v1)
- Perfect UI polish.
- Multi-tenant enterprise billing.
- Complex workflow designer.
- Full historical analytics warehouse.

## v1 scope
- Mission lifecycle: create, queue, run, complete/fail.
- Task dispatch to specific agent targets.
- Event timeline for each mission/run.
- Approval gates for defined risky actions.
- Health/incident panel with actionable errors.

## Success metrics
- 100% mission/run transitions captured as events.
- 0 unauthenticated access to protected routes.
- <2 minutes mean time to detect failed runs.
- >95% successful replay of transient failures via retry policy.

## Delivery principles
- Security first, orchestration second, UI third.
- Typed contracts over implicit payloads.
- Idempotent handlers and deterministic retries.
- Every feature shipped with test coverage and runbook notes.
