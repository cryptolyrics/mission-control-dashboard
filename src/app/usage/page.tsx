"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  agentId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estCostUsd: number;
  percentUsed: number | null;
  updatedAt: number | null;
};

function fmtUsd(v: number) {
  return `$${v.toFixed(4)}`;
}

export default function UsagePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [source, setSource] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/usage", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setRows(data.rows || []);
        setSource(data.source || "");
      }
    };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.input += r.inputTokens || 0;
        acc.output += r.outputTokens || 0;
        acc.total += r.totalTokens || 0;
        acc.cost += r.estCostUsd || 0;
        return acc;
      },
      { input: 0, output: 0, total: 0, cost: 0 }
    );
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Token Usage by Agent</h1>
        <p className="text-text-secondary">Live usage + estimated costs from OpenClaw gateway stats</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-white/10 rounded-xl p-4"><p className="text-xs text-text-secondary">Input Tokens</p><p className="text-xl font-semibold mt-2">{totals.input.toLocaleString()}</p></div>
        <div className="bg-card border border-white/10 rounded-xl p-4"><p className="text-xs text-text-secondary">Output Tokens</p><p className="text-xl font-semibold mt-2">{totals.output.toLocaleString()}</p></div>
        <div className="bg-card border border-white/10 rounded-xl p-4"><p className="text-xs text-text-secondary">Total Tokens</p><p className="text-xl font-semibold mt-2">{totals.total.toLocaleString()}</p></div>
        <div className="bg-card border border-white/10 rounded-xl p-4"><p className="text-xs text-text-secondary">Est. Cost</p><p className="text-xl font-semibold mt-2">{fmtUsd(totals.cost)}</p></div>
      </div>

      <div className="bg-card border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold">Agent Usage</h2>
          {source && <a className="text-xs text-primary hover:underline" href={source} target="_blank">OpenClaw source</a>}
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-text-secondary bg-background/60">
              <tr>
                <th className="text-left p-3">Agent</th>
                <th className="text-left p-3">Model</th>
                <th className="text-right p-3">Input</th>
                <th className="text-right p-3">Output</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Est. Cost</th>
                <th className="text-right p-3">Context %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.agentId} className="border-t border-white/5">
                  <td className="p-3 font-medium">{r.agentId}</td>
                  <td className="p-3 text-text-secondary">{r.model || "-"}</td>
                  <td className="p-3 text-right">{(r.inputTokens || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">{(r.outputTokens || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">{(r.totalTokens || 0).toLocaleString()}</td>
                  <td className="p-3 text-right">{fmtUsd(r.estCostUsd || 0)}</td>
                  <td className="p-3 text-right">{r.percentUsed ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
