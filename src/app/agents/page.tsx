"use client";

import AgentCard from "@/components/AgentCard";

const agents = [
  { id: "1", name: "JJ", status: "online" as const, currentTask: "COO operations", lastActivity: "now", avatar: "🤖" },
  { id: "2", name: "Vlad", status: "busy" as const, currentTask: "Dev work", lastActivity: "now", avatar: "👨‍💻" },
  { id: "3", name: "Ali", status: "online" as const, currentTask: "Growth", lastActivity: "now", avatar: "🚀" },
  { id: "4", name: "Pete", status: "busy" as const, currentTask: "Quant models", lastActivity: "now", avatar: "📈" },
  { id: "5", name: "Coppa", status: "offline" as const, currentTask: null, lastActivity: "pending", avatar: "🛡️" },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Agents</h1>
          <p className="text-text-secondary">Manage your AI agents</p>
        </div>
        <button className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity">
          + Import Agent
        </button>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-white/5">
          <p className="text-2xl font-bold text-success">3</p>
          <p className="text-sm text-text-secondary">Online</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/5">
          <p className="text-2xl font-bold text-warning">1</p>
          <p className="text-sm text-text-secondary">Busy</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/5">
          <p className="text-2xl font-bold text-error">1</p>
          <p className="text-sm text-text-secondary">Offline</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/5">
          <p className="text-2xl font-bold text-primary">5</p>
          <p className="text-sm text-text-secondary">Total Tasks</p>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
