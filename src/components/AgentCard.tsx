"use client";

import { useState } from "react";
import type { Agent } from "@/lib/data";

interface AgentCardProps {
  agent: Agent;
  onRefresh?: () => void;
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

export default function AgentCard({ agent, onRefresh }: AgentCardProps) {
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePauseResume = async () => {
    setLoading(true);
    setError(null);
    try {
      const action = agent.status === "offline" ? "resume" : "pause";
      const res = await fetch(`/api/agents/${agent.id}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Action failed");
      } else {
        onRefresh?.();
      }
    } catch (e) {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = async () => {
    setShowLogs(true);
    setLogsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/agents/${agent.id}/logs`);
      const data = await res.json();
      if (data.ok && data.logs) {
        setLogs(data.logs);
      } else {
        setLogs([data.error || "No logs available"]);
      }
    } catch (e) {
      setLogs(["Failed to fetch logs"]);
    } finally {
      setLogsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`bg-card rounded-xl p-4 border border-white/10 border-l-4 ${statusColors[agent.status]} hover:border-white/20 transition-all`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-card-hover flex items-center justify-center text-lg">
              {agent.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{agent.name}</h3>
              <p className="text-xs text-text-secondary">{agent.role}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${statusDot[agent.status]}`}></span>
                <span className="text-xs text-text-secondary">{statusText[agent.status]}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handlePauseResume}
            disabled={loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm disabled:opacity-50 ${
              agent.status === "offline"
                ? "bg-success/20 text-success hover:bg-success/30"
                : "bg-warning/20 text-warning hover:bg-warning/30"
            }`}
            title={agent.status === "offline" ? "Resume" : "Pause"}
          >
            {loading ? "⏳" : agent.status === "offline" ? "▶️" : "⏸️"}
          </button>
        </div>

        {error && (
          <div className="mb-2 px-2 py-1 bg-error/20 text-error text-xs rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div>
            <p className="text-xs text-text-secondary">Current Task</p>
            <p className="text-sm font-medium truncate">{agent.currentTask || "No active task"}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{agent.model}</span>
            <span>{agent.workspace}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Last activity: {agent.lastActivity}</span>
            <button 
              onClick={handleViewLogs}
              className="text-xs text-primary hover:underline"
            >
              View Logs
            </button>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-white/10 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold">{agent.name} - Logs</h3>
              <button 
                onClick={() => setShowLogs(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-xs">
              {logsLoading ? (
                <div className="text-text-secondary">Loading logs...</div>
              ) : logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="py-1 border-b border-white/5">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-text-secondary">No logs available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
