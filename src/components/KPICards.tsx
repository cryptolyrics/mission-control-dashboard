type KPI = {
  label: string;
  value: string;
  delta: string;
  tone: "primary" | "success" | "warning" | "highlight";
};

const toneMap: Record<KPI["tone"], string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  highlight: "text-highlight",
};

const cards: KPI[] = [
  { label: "Active Agents", value: "6/7", delta: "+1 today", tone: "success" },
  { label: "Running Tasks", value: "12", delta: "+3 in 1h", tone: "primary" },
  { label: "Alerts", value: "2", delta: "watchlist", tone: "warning" },
  { label: "Deploy Health", value: "99.4%", delta: "stable", tone: "highlight" },
];

export default function KPICards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((kpi) => (
        <div key={kpi.label} className="bg-card rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">{kpi.label}</p>
          <p className="text-2xl font-semibold mt-2">{kpi.value}</p>
          <p className={`text-xs mt-1 ${toneMap[kpi.tone]}`}>{kpi.delta}</p>
        </div>
      ))}
    </section>
  );
}
