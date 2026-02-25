"use client";

import { useState } from "react";
import AgentCard from "@/components/AgentCard";
import ActivityFeed from "@/components/ActivityFeed";
import NewTaskModal from "@/components/NewTaskModal";

// Agent roster from AGENTS.md
const mockAgents: Array<{ id: string; name: string; status: "online" | "busy" | "offline"; currentTask: string | null; lastActivity: string; avatar: string }> = [
  { id: "1", name: "JJ", status: "online", currentTask: "COO operations", lastActivity: "now", avatar: "🤖" },
  { id: "2", name: "Vlad", status: "busy", currentTask: "Dev work", lastActivity: "now", avatar: "👨‍💻" },
  { id: "3", name: "Ali", status: "online", currentTask: "Growth", lastActivity: "now", avatar: "🚀" },
  { id: "4", name: "Pete", status: "busy", currentTask: "Quant models", lastActivity: "now", avatar: "📈" },
  { id: "5", name: "Coppa", status: "offline", currentTask: null, lastActivity: "pending", avatar: "🛡️" },
];

// Mock activity feed data
const mockActivities: Array<{ id: string; agent: string; action: string; timestamp: string; type: "error" | "success" | "warning" | "info" }> = [
  { id: "1", agent: "Scout", action: "Completed research task", timestamp: "2 min ago", type: "success" },
  { id: "2", agent: "Bruce", action: "Started code review", timestamp: "30 sec ago", type: "info" },
  { id: "3", agent: "Alison", action: "Processing dataset", timestamp: "5 min ago", type: "info" },
  { id: "4", agent: "System", action: "Agent Max went offline", timestamp: "1 hour ago", type: "warning" },
  { id: "5", agent: "Scout", action: "Found 15 relevant results", timestamp: "10 min ago", type: "success" },
];

export default function Dashboard() {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [agents] = useState(mockAgents);
  const [activities] = useState(mockActivities);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Welcome back, Vlad</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg bg-card hover:bg-card-hover transition-colors" title="Refresh">
            🔄
          </button>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm hover:bg-card-hover transition-colors">
          🤖 Spawn Agent
        </button>
        <button className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm hover:bg-card-hover transition-colors">
          ▶️ Resume All
        </button>
        <button className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm hover:bg-card-hover transition-colors">
          ⏸️ Pause All
        </button>
      </div>

      {/* Agent Status Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Agent Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Activity Feed & Kanban Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-4">Live Activity</h2>
          <ActivityFeed activities={activities} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Task Overview</h2>
          <div className="bg-card rounded-xl p-6 border border-white/5">
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-text-secondary mb-4">
              <div>Plan</div>
              <div>Inbox</div>
              <div>Assign</div>
              <div>Progress</div>
              <div>Test</div>
              <div>Review</div>
              <div>Done</div>
            </div>
            <div className="flex gap-2">
              {[
                { count: 2, color: "bg-text-secondary" },
                { count: 5, color: "bg-warning" },
                { count: 3, color: "bg-primary" },
                { count: 4, color: "bg-highlight" },
                { count: 2, color: "bg-warning" },
                { count: 1, color: "bg-primary" },
                { count: 12, color: "bg-success" },
              ].map((col, i) => (
                <div key={i} className="flex-1">
                  <div className={`h-24 ${col.color} rounded-lg opacity-60 mb-2 flex items-end justify-center pb-2`}>
                    <span className="text-background font-bold">{col.count}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="/tasks" className="block text-center text-primary text-sm mt-4 hover:underline">
              View Full Kanban →
            </a>
          </div>
        </section>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && <NewTaskModal onClose={() => setShowNewTaskModal(false)} />}
    </div>
  );
}
