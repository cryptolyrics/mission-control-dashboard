import Link from "next/link";
import { agents } from "@/lib/data";

export default function PublicPage() {
  const online = agents.filter((a) => a.status !== "offline").length;
  const offline = agents.length - online;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mission Control</h1>
          <p className="text-text-secondary">Public status board</p>
        </div>
        <Link href="/private" className="px-4 py-2 rounded-lg bg-primary text-background font-medium hover:opacity-90">
          Private Access
        </Link>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-white/10 p-4">
          <p className="text-xs text-text-secondary">Total Agents</p>
          <p className="text-2xl font-bold mt-2">{agents.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-white/10 p-4">
          <p className="text-xs text-text-secondary">Online</p>
          <p className="text-2xl font-bold mt-2 text-success">{online}</p>
        </div>
        <div className="bg-card rounded-xl border border-white/10 p-4">
          <p className="text-xs text-text-secondary">Offline</p>
          <p className="text-2xl font-bold mt-2 text-error">{offline}</p>
        </div>
        <div className="bg-card rounded-xl border border-white/10 p-4">
          <p className="text-xs text-text-secondary">Uptime</p>
          <p className="text-2xl font-bold mt-2 text-primary">99.4%</p>
        </div>
      </section>

      <section className="bg-card rounded-xl border border-white/10 p-5">
        <h2 className="text-lg font-semibold mb-4">Agent Network Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-lg border border-white/10 p-3 bg-background/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{a.avatar}</span>
                <span className="font-medium">{a.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${a.status === "offline" ? "bg-error/20 text-error" : "bg-success/20 text-success"}`}>
                {a.status === "offline" ? "Offline" : "Online"}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-secondary mt-4">Public view intentionally hides tasks, logs, models, and controls.</p>
      </section>
    </div>
  );
}
