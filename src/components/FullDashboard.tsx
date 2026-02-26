"use client";

import { useEffect, useMemo, useState } from "react";
import AgentCard from "@/components/AgentCard";
import ActivityFeed from "@/components/ActivityFeed";
import NewTaskModal from "@/components/NewTaskModal";
import KPICards from "@/components/KPICards";
import NotificationPanel from "@/components/NotificationPanel";
import { agents } from "@/lib/data";

const mockActivities: Array<{ id: string; agent: string; action: string; timestamp: string; type: "error" | "success" | "warning" | "info" }> = [
  { id: "1", agent: "Scout", action: "Published discovery brief", timestamp: "1 min ago", type: "success" },
  { id: "2", agent: "Vlad", action: "Pushed Mission Control v2 UI", timestamp: "3 min ago", type: "info" },
  { id: "3", agent: "Pete", action: "Running DFS optimizer checks", timestamp: "7 min ago", type: "warning" },
  { id: "4", agent: "Coach", action: "Prepared goals scaffold", timestamp: "9 min ago", type: "info" },
  { id: "5", agent: "Coppa", action: "Completed policy sweep", timestamp: "12 min ago", type: "success" },
];

export default function FullDashboard() {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [activities] = useState(mockActivities);
  const [liveAgents, setLiveAgents] = useState<any[] | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/agents', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (data?.ok && Array.isArray(data.agents)) setLiveAgents(data.agents);
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const viewAgents = useMemo(() => {
    if (!liveAgents) return agents;
    const map = new Map(liveAgents.map((a) => [a.id, a]));
    return agents.map((a) => {
      const l = map.get(a.id);
      if (!l) return a;
      const status: "online" | "busy" | "offline" = l.status === 'paused' ? 'offline' : l.status === 'idle' ? 'busy' : 'online';
      return { ...a, status };
    });
  }, [liveAgents]);

  const onlineCount = useMemo(() => viewAgents.filter((a) => a.status !== "offline").length, [viewAgents]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mission Control v2 (Private)</h1>
          <p className="text-text-secondary">Dark-grid command center • {onlineCount} active agents</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-lg bg-card hover:bg-card-hover transition-colors text-sm" title="Command Palette">⌘K</button>
          <button className="p-2 rounded-lg bg-card hover:bg-card-hover transition-colors" title="Refresh">🔄</button>
          <button onClick={() => setShowNewTaskModal(true)} className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity">+ New Task</button>
        </div>
      </div>

      <KPICards />

      <section>
        <h2 className="text-lg font-semibold mb-4">Agent Status Grid</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {viewAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Live Activity</h2>
          <ActivityFeed activities={activities} />
        </section>
        <NotificationPanel />
      </div>

      {showNewTaskModal && <NewTaskModal onClose={() => setShowNewTaskModal(false)} />}
    </div>
  );
}
