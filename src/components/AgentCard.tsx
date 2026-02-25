type Agent = {
  id: string;
  name: string;
  status: "online" | "busy" | "offline";
  currentTask: string | null;
  lastActivity: string;
  avatar: string;
};

interface AgentCardProps {
  agent: Agent;
}

const statusColors = {
  online: "border-l-success",
  busy: "border-l-warning",
  offline: "border-l-error",
};

const statusDot = {
  online: "bg-success",
  busy: "bg-warning",
  offline: "bg-error",
};

const statusText = {
  online: "Online",
  busy: "Busy",
  offline: "Offline",
};

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div
      className={`bg-card rounded-xl p-4 border border-white/5 border-l-4 ${statusColors[agent.status]} hover:border-white/10 transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-card-hover flex items-center justify-center text-lg">
            {agent.avatar}
          </div>
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusDot[agent.status]}`}></span>
              <span className="text-xs text-text-secondary">{statusText[agent.status]}</span>
            </div>
          </div>
        </div>
        <button
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            agent.status === "offline"
              ? "bg-success/20 text-success hover:bg-success/30"
              : "bg-warning/20 text-warning hover:bg-warning/30"
          }`}
          title={agent.status === "offline" ? "Resume" : "Pause"}
        >
          {agent.status === "offline" ? "▶️" : "⏸️"}
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-xs text-text-secondary">Current Task</p>
          <p className="text-sm font-medium truncate">
            {agent.currentTask || "No active task"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Last activity: {agent.lastActivity}</span>
          <button className="text-xs text-primary hover:underline">View Logs</button>
        </div>
      </div>
    </div>
  );
}
