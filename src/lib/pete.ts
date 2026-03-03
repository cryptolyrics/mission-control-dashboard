export type PeteBet = {
  pick: string;
  odds: string;
  edge_pct: number;
  ev_per_1u: number;
  reason: string;
};

export type PeteLeg = {
  player?: string;
  market?: string;
  direction?: "OVER" | "UNDER" | string;
  line?: number;
  edge_pct?: number;
  pick?: string;
  odds?: string;
};

export type PeteParlay = {
  status: "READY" | "NO_PARLAY" | "NO_PROP_PARLAY" | string;
  legs: PeteLeg[];
  total_odds: number;
  note?: string;
};

export type PeteLogicSummary = {
  signals: string[];
  risk_notes: string[];
};

export type PeteGoalTracker = {
  week_start: string;
  starting_bankroll_usd: number;
  total_staked_usd: number;
  wins: number;
  losses: number;
  pushes: number;
  gross_return_usd: number;
  net_pnl_usd: number;
  roi_pct: number;
  hit_rate_pct: number;
};

export type PetePayload = {
  date: string;
  best_bet: PeteBet;
  team_parlay: PeteParlay;
  player_prop_parlay: PeteParlay;
  logic_summary: PeteLogicSummary;
  goal_tracker: PeteGoalTracker;
};

export type PeteTodayResponse = {
  ok: boolean;
  source: string;
  payload: PetePayload;
  error?: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter((v) => v.trim().length > 0);
}

function normalizeLeg(row: any): PeteLeg {
  return {
    player: row?.player ? String(row.player) : undefined,
    market: row?.market ? String(row.market) : undefined,
    direction: row?.direction ? String(row.direction).toUpperCase() : undefined,
    line: row?.line != null ? toNumber(row.line, 0) : undefined,
    edge_pct: row?.edge_pct != null ? toNumber(row.edge_pct, 0) : undefined,
    pick: row?.pick ? String(row.pick) : undefined,
    odds: row?.odds ? String(row.odds) : undefined,
  };
}

function normalizeParlay(raw: any, emptyStatus: "NO_PARLAY" | "NO_PROP_PARLAY"): PeteParlay {
  const status = raw?.status ? String(raw.status) : emptyStatus;
  const legs = Array.isArray(raw?.legs) ? raw.legs.map(normalizeLeg) : [];
  return {
    status,
    legs,
    total_odds: toNumber(raw?.total_odds, 0),
    note: raw?.note ? String(raw.note) : undefined,
  };
}

function dateAest(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function fallbackPetePayload(): PetePayload {
  return {
    date: dateAest(),
    best_bet: {
      pick: "NO_BET",
      odds: "N/A",
      edge_pct: 0,
      ev_per_1u: 0,
      reason: "No candidate met team edge and EV gates for this slate.",
    },
    team_parlay: {
      status: "NO_PARLAY",
      legs: [],
      total_odds: 0,
      note: "No eligible team legs after filters.",
    },
    player_prop_parlay: {
      status: "NO_PROP_PARLAY",
      legs: [],
      total_odds: 0,
      note: "No eligible player prop legs after filters.",
    },
    logic_summary: {
      signals: ["Tank01 odds + props", "B2B and major-out filters", "Spread/total context weighting"],
      risk_notes: ["No forced wagers when quant gates fail", "Synthetic history used only when matchup history is missing"],
    },
    goal_tracker: {
      week_start: dateAest(),
      starting_bankroll_usd: 0,
      total_staked_usd: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      gross_return_usd: 0,
      net_pnl_usd: 0,
      roi_pct: 0,
      hit_rate_pct: 0,
    },
  };
}

function mapLegacyPayload(candidate: any): PetePayload {
  const fallback = fallbackPetePayload();
  return {
    date: candidate?.date ? String(candidate.date) : fallback.date,
    best_bet: {
      pick: String(candidate?.best_bet?.pick ?? candidate?.bestBet?.pick ?? fallback.best_bet.pick),
      odds: String(candidate?.best_bet?.odds ?? candidate?.bestBet?.odds ?? fallback.best_bet.odds),
      edge_pct: toNumber(candidate?.best_bet?.edge_pct ?? candidate?.bestBet?.edge_pct, fallback.best_bet.edge_pct),
      ev_per_1u: toNumber(candidate?.best_bet?.ev_per_1u ?? candidate?.bestBet?.ev_per_1u, fallback.best_bet.ev_per_1u),
      reason: String(candidate?.best_bet?.reason ?? candidate?.bestBet?.reason ?? fallback.best_bet.reason),
    },
    team_parlay: normalizeParlay(candidate?.team_parlay ?? candidate?.teamParlay, "NO_PARLAY"),
    player_prop_parlay: normalizeParlay(candidate?.player_prop_parlay ?? candidate?.playerPropParlay, "NO_PROP_PARLAY"),
    logic_summary: {
      signals: toArray(candidate?.logic_summary?.signals ?? candidate?.logicSummary?.signals),
      risk_notes: toArray(candidate?.logic_summary?.risk_notes ?? candidate?.logicSummary?.risk_notes),
    },
    goal_tracker: {
      week_start: String(candidate?.goal_tracker?.week_start ?? candidate?.goalTracker?.week_start ?? fallback.goal_tracker.week_start),
      starting_bankroll_usd: toNumber(candidate?.goal_tracker?.starting_bankroll_usd ?? candidate?.goalTracker?.starting_bankroll_usd, fallback.goal_tracker.starting_bankroll_usd),
      total_staked_usd: toNumber(candidate?.goal_tracker?.total_staked_usd ?? candidate?.goalTracker?.total_staked_usd, fallback.goal_tracker.total_staked_usd),
      wins: toNumber(candidate?.goal_tracker?.wins ?? candidate?.goalTracker?.wins, fallback.goal_tracker.wins),
      losses: toNumber(candidate?.goal_tracker?.losses ?? candidate?.goalTracker?.losses, fallback.goal_tracker.losses),
      pushes: toNumber(candidate?.goal_tracker?.pushes ?? candidate?.goalTracker?.pushes, fallback.goal_tracker.pushes),
      gross_return_usd: toNumber(candidate?.goal_tracker?.gross_return_usd ?? candidate?.goalTracker?.gross_return_usd, fallback.goal_tracker.gross_return_usd),
      net_pnl_usd: toNumber(candidate?.goal_tracker?.net_pnl_usd ?? candidate?.goalTracker?.net_pnl_usd, fallback.goal_tracker.net_pnl_usd),
      roi_pct: toNumber(candidate?.goal_tracker?.roi_pct ?? candidate?.goalTracker?.roi_pct, fallback.goal_tracker.roi_pct),
      hit_rate_pct: toNumber(candidate?.goal_tracker?.hit_rate_pct ?? candidate?.goalTracker?.hit_rate_pct, fallback.goal_tracker.hit_rate_pct),
    },
  };
}

export function normalizePetePayload(raw: any): PetePayload {
  if (!raw || typeof raw !== "object") return fallbackPetePayload();
  const candidate = raw.payload ?? raw.data ?? raw.scoreboard ?? raw;
  return mapLegacyPayload(candidate);
}
