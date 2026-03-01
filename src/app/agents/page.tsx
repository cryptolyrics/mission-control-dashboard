"use client";

import { useState, useEffect } from "react";
import AgentCard from "@/components/AgentCard";
import type { Agent, AgentStatus } from "@/lib/data";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      
      if (data.ok && data.agents) {
        // Transform the API response to match our Agent type
        const transformed = data.agents.map((a: any) => ({
          id: a.id,
          name: a.name || a.id.charAt(0).toUpperCase() + a.id.slice(1).replace(/-/g, ' '),
          status: (a.status as AgentStatus) || "online",
          role: a.role || "Agent",
          currentTask: a.currentTask || a.current_task || null,
          lastActivity: a.lastActivity || a.last_activity || "recently",
          avatar: a.avatar || "🤖",
          model: a.model || "MiniMax-M2.5",
          workspace: a.workspace || `workspace-${a.id}`,
        }));
        setAgents(transformed);
      } else {
        setError(data.error || "Failed to fetch agents");
      }
    } catch (e) {
      setError("Failed to connect to API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

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
        <div className="flex gap-2">
          <button 
            onClick={fetchAgents}
            className="px-4 py-2 bg-card-hover text-text-primary font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            ↻ Refresh
          </button>
          <button className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity">
            + Import Agent
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-error/20 text-error rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-success">{loading ? "..." : online}</p>
          <p className="text-sm text-text-secondary">Online</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-warning">{loading ? "..." : busy}</p>
          <p className="text-sm text-text-secondary">Busy</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-error">{loading ? "..." : offline}</p>
          <p className="text-sm text-text-secondary">Offline</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-white/10">
          <p className="text-2xl font-bold text-primary">{loading ? "..." : agents.length}</p>
          <p className="text-sm text-text-secondary">Total Agents</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">No agents found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onRefresh={fetchAgents} />
          ))}
        </div>
      )}
    </div>
  );
}
