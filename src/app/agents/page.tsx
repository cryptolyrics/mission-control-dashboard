"use client";

import AgentCard from "@/components/AgentCard";
import { agents } from "@/lib/data";

export default function AgentsPage() {
  const online = agents.filter((a) => a.status === "online").length;
  const busy = agents.filter((a) => a.status === "busy").length;
  const offline = agents.filter((a) => a.status === "offline").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Agents</h1>
          <p className="text-text-secondary">Current OpenClaw roster and status</p>
        </div>
        <button className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity">
          + Import Agent
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-success">{online}</p>
          <p className="text-sm text-text-secondary">Online</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-warning">{busy}</p>
          <p className="text-sm text-text-secondary">Busy</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-error">{offline}</p>
          <p className="text-sm text-text-secondary">Offline</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-primary">{agents.length}</p>
          <p className="text-sm text-text-secondary">Total Agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
