# Architecture v1

## North star
Mission Control acts as a control plane for agent operations with explicit state, policy enforcement, and auditable execution.

## Service boundaries

### 1) `apps/control-ui`
- Next.js frontend.
- Reads from orchestrator query APIs.
- Sends commands to orchestrator command APIs.
- No direct agent execution logic.

### 2) `services/orchestrator-api`
- Source of truth for mission/run/task lifecycle.
- Validates command schema.
- Applies policy and approval gates.
- Emits domain events.

### 3) `services/agent-relay`
- Adapter to OpenClaw gateway.
- Converts orchestrator task requests into gateway calls.
- Reports execution updates back as events.

### 4) `services/event-store`
- Append-only store for domain events.
- Supports replay, timeline views, and audits.

### 5) `services/policy-engine` (can start as orchestrator module)
- Rule evaluation for risky actions.
- Determines: allow, deny, needs approval.

## Domain model
- `Mission`: business objective and scope.
- `Run`: one execution instance of a mission.
- `Task`: unit of work assigned to an agent.
- `Agent`: execution target + capabilities.
- `Approval`: human decision for gated actions.
- `Artifact`: generated output/evidence.
- `Incident`: operational failure needing intervention.

## Event model (examples)
- `mission.created`
- `run.queued`
- `run.started`
- `task.created`
- `task.dispatched`
- `task.started`
- `tool.called`
- `tool.failed`
- `task.completed`
- `task.failed`
- `approval.requested`
- `approval.granted`
- `run.completed`
- `run.failed`

## API contracts (minimum)

### Command APIs
- `POST /missions`
- `POST /missions/{missionId}/runs`
- `POST /runs/{runId}/tasks`
- `POST /tasks/{taskId}/cancel`
- `POST /approvals/{approvalId}/decision`

### Query APIs
- `GET /missions/{missionId}`
- `GET /runs/{runId}`
- `GET /runs/{runId}/timeline`
- `GET /agents`
- `GET /incidents`

## Reliability rules
- Idempotency key required for command writes.
- Retry with exponential backoff for transient failures.
- Dead-letter queue for terminal failures.
- Heartbeat checks for long-running tasks.
- Deterministic run replay from event stream.

## Security baseline
- Mandatory auth for UI and APIs.
- Role-based access (`operator`, `reviewer`, `admin`).
- No default secrets; fail closed on missing secret config.
- Structured audit log for all sensitive operations.
- Secret redaction in logs.

## Observability
- Correlation ID per mission/run/task.
- Metrics: queue depth, success rate, p95 execution latency, incident count.
- Alerts: stuck tasks, relay disconnects, repeated retries.
