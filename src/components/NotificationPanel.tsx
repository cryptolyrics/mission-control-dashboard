import { notifications } from "@/lib/data";

const levelTone: Record<string, string> = {
  info: "border-primary/40",
  success: "border-success/40",
  warning: "border-warning/40",
};

export default function NotificationPanel() {
  return (
    <section className="bg-card rounded-xl border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button className="text-xs text-text-secondary hover:text-text-primary">Mark all read</button>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-lg border ${levelTone[n.level] || "border-white/10"} bg-background/50 p-3`}>
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs text-text-secondary mt-0.5">{n.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
