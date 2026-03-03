"use client";

import { useEffect, useMemo, useState } from "react";
import type { PeteLeg, PeteTodayResponse } from "@/lib/pete";

function pct(value: number) {
  return `${value.toFixed(2)}%`;
}

function usd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderLegLabel(leg: PeteLeg) {
  if (leg.pick) return leg.pick;
  const market = leg.market ? ` ${leg.market}` : "";
  const direction = leg.direction ? ` ${leg.direction}` : "";
  const line = leg.line != null ? ` ${leg.line}` : "";
  return `${leg.player || "Leg"}${market}${direction}${line}`;
}

export default function PetePage() {
  const [data, setData] = useState<PeteTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/pete/today", { cache: "no-store" });
        const body = (await res.json()) as PeteTodayResponse;
        if (active) setData(body);
      } catch (_error) {
        if (active) {
          setData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const payload = data?.payload;
  const tracker = payload?.goal_tracker;

  const trackerRows = useMemo(
    () =>
      tracker
        ? [
            { label: "Starting Bankroll", value: usd(tracker.starting_bankroll_usd) },
            { label: "Total Staked", value: usd(tracker.total_staked_usd) },
            { label: "Wins / Losses / Pushes", value: `${tracker.wins} / ${tracker.losses} / ${tracker.pushes}` },
            { label: "Gross Return", value: usd(tracker.gross_return_usd) },
            { label: "Net PnL", value: usd(tracker.net_pnl_usd) },
            { label: "ROI", value: pct(tracker.roi_pct) },
            { label: "Hit Rate", value: pct(tracker.hit_rate_pct) },
          ]
        : [],
    [tracker],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Pete Page</h1>
          <p className="text-text-secondary">Daily calls and logic source for 9:00 AM AEST cycle</p>
        </div>
        <div className="text-right text-sm text-text-secondary">
          <p>Date: {payload?.date || "-"}</p>
          <p>Source: {data?.source || "loading"}</p>
        </div>
      </div>

      {loading && <div className="rounded-xl border border-white/10 bg-card p-4 text-text-secondary">Loading Pete output...</div>}

      {!loading && payload && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <section className="rounded-xl border border-white/10 bg-card p-4">
              <h2 className="text-sm uppercase tracking-wide text-text-secondary mb-3">Best Bet Of The Day</h2>
              <p className="text-lg font-semibold text-text-primary">{payload.best_bet.pick}</p>
              <div className="mt-3 text-sm text-text-secondary space-y-1">
                <p>Odds: <span className="text-text-primary">{payload.best_bet.odds}</span></p>
                <p>Edge: <span className="text-text-primary">{pct(payload.best_bet.edge_pct)}</span></p>
                <p>EV/u: <span className="text-text-primary">{payload.best_bet.ev_per_1u.toFixed(2)}</span></p>
                <p className="pt-2">{payload.best_bet.reason}</p>
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-card p-4">
              <h2 className="text-sm uppercase tracking-wide text-text-secondary mb-3">Team Parlay</h2>
              <p className="text-lg font-semibold text-text-primary">{payload.team_parlay.status}</p>
              <p className="text-sm text-text-secondary mt-1">Total odds: {payload.team_parlay.total_odds || 0}x</p>
              <ul className="mt-3 space-y-2 text-sm">
                {payload.team_parlay.legs.length === 0 && <li className="text-text-secondary">No eligible legs.</li>}
                {payload.team_parlay.legs.map((leg, idx) => (
                  <li key={`${idx}-${renderLegLabel(leg)}`} className="rounded-lg bg-background px-3 py-2 text-text-primary">
                    {renderLegLabel(leg)}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-white/10 bg-card p-4">
              <h2 className="text-sm uppercase tracking-wide text-text-secondary mb-3">Player Prop Parlay</h2>
              <p className="text-lg font-semibold text-text-primary">{payload.player_prop_parlay.status}</p>
              <p className="text-sm text-text-secondary mt-1">Total odds: {payload.player_prop_parlay.total_odds || 0}x</p>
              <ul className="mt-3 space-y-2 text-sm">
                {payload.player_prop_parlay.legs.length === 0 && <li className="text-text-secondary">No eligible legs.</li>}
                {payload.player_prop_parlay.legs.map((leg, idx) => (
                  <li key={`${idx}-${renderLegLabel(leg)}`} className="rounded-lg bg-background px-3 py-2 text-text-primary">
                    {renderLegLabel(leg)}
                    {typeof leg.edge_pct === "number" && (
                      <span className="ml-2 text-text-secondary">({pct(leg.edge_pct)})</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <section className="rounded-xl border border-white/10 bg-card p-4">
              <h2 className="text-sm uppercase tracking-wide text-text-secondary mb-3">Logic Summary</h2>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Signals</h3>
              <ul className="space-y-2 text-sm">
                {(payload.logic_summary.signals || []).map((row) => (
                  <li key={row} className="rounded-lg bg-background px-3 py-2 text-text-primary">{row}</li>
                ))}
              </ul>
              <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Risk Notes</h3>
              <ul className="space-y-2 text-sm">
                {(payload.logic_summary.risk_notes || []).map((row) => (
                  <li key={row} className="rounded-lg bg-background px-3 py-2 text-text-secondary">{row}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-white/10 bg-card p-4">
              <h2 className="text-sm uppercase tracking-wide text-text-secondary mb-3">Goal Tracker (Weekly)</h2>
              <div className="space-y-2 text-sm">
                {trackerRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                    <span className="text-text-secondary">{row.label}</span>
                    <span className="text-text-primary font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
