export default function CoachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Coach</h1>
        <p className="text-text-secondary">Goals and execution tracking</p>
      </div>

      <section className="bg-card border border-white/10 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-2">Goals (pending input)</h2>
        <p className="text-sm text-text-secondary">
          Goal definitions will be added once provided. This page is ready for target metrics,
          milestones, and progress snapshots.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Goals", value: "0" },
          { label: "Completed", value: "0" },
          { label: "Weekly Progress", value: "0%" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-white/10 rounded-xl p-4">
            <p className="text-xs text-text-secondary">{item.label}</p>
            <p className="text-2xl font-semibold mt-2">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
