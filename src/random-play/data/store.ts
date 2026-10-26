// Adapters for the back-of-store surfaces: Channel Search (A.'s Signal archive) and Staff Picks
// (a profile's pull-priority list). Pure functions over what the dashboard already has.
import { BANGBOO_BY_NAME, EMOTE_ALIAS, PULL_NAME_ALIAS } from "./meta";
import type { Element } from "../tokens";
import type { BossRef, ComboBill, ComboDeal, ComboShelf, Mode, PullOutcome, Run, SignalArchive, SignalChannel, SignalPull, StaffPick } from "./types";

// ---------------------------------------------------------------- Signal
// Accepts the dashboard's own SignalSummary (signal-analytics.ts, pulls carry `record`) OR the trimmed
// playground snapshot (fixtures/signal.json, pulls are flat). The math is the dashboard's; this only
// reshapes, so the two can never disagree about pity or coinflips.
type RawPull = { pity: number; outcome: PullOutcome } & ({ record: { name: string; item_type: string; time: string } } | { name: string; type: string; time: string });
interface RawChannel {
  channel: string; name: string; total: number; sCount: number; aCount: number; avgPityS: number | null;
  currentPity: number; hardPity: number; longestDry: number;
  flipLabel?: string | null; flipWins?: number | null; flipChallenges?: number | null; onGuarantee?: boolean | null;
  sRanks: RawPull[];
}
export interface CoachSignal {
  lastSync?: string; totalPulls: number; totalPolychrome: number; totalS: number;
  firstTime: string | null; lastTime: string | null; channels: RawChannel[];
}

const pull = (p: RawPull, channel: string): SignalPull => {
  const r = "record" in p ? { name: p.record.name, type: p.record.item_type, time: p.record.time } : p;
  return { name: r.name ?? "", type: (r.type ?? "") as SignalPull["type"], time: r.time, pity: p.pity, outcome: p.outcome, channel };
};

export function deriveSignal(raw: CoachSignal, lastSync = raw.lastSync ?? ""): SignalArchive {
  const channels: SignalChannel[] = raw.channels.map((c) => ({
    channel: c.channel, name: c.name, total: c.total, sCount: c.sCount, aCount: c.aCount,
    avgPityS: c.avgPityS, currentPity: c.currentPity, hardPity: c.hardPity, longestDry: c.longestDry,
    flip: c.flipLabel ? { label: c.flipLabel, wins: c.flipWins ?? 0, challenges: c.flipChallenges ?? 0, onGuarantee: !!c.onGuarantee } : null,
    sRanks: c.sRanks.map((p) => pull(p, c.channel)),
  }));
  return { lastSync, totalPulls: raw.totalPulls, totalPolychrome: raw.totalPolychrome, totalS: raw.totalS, firstTime: raw.firstTime, lastTime: raw.lastTime, channels };
}

/** Every S-rank across channels, oldest → newest. */
export const signalLedger = (a: SignalArchive): SignalPull[] =>
  a.channels.flatMap((c) => c.sRanks).sort((x, y) => (x.time < y.time ? -1 : x.time > y.time ? 1 : 0));

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
/** Asset key for a pull's face: agent circle slug, W-engine name, or Bangboo slug. null = no art → honest tile. */
export function pullArt(p: SignalPull): { kind: "circle" | "wengine" | "bangboo"; key: string } | null {
  if (!p.name) return null;
  if (p.type === "Agents") return { kind: "circle", key: PULL_NAME_ALIAS[norm(p.name)] ?? norm(p.name) };
  if (p.type === "W-Engines") return { kind: "wengine", key: p.name };
  if (p.type === "Bangboo") return BANGBOO_BY_NAME[p.name] ? { kind: "bangboo", key: BANGBOO_BY_NAME[p.name] } : { kind: "bangboo", key: norm(p.name) };
  return null;
}

// ---------------------------------------------------------------- Staff Picks
interface RawPick {
  rank: number; name: string; section: string; attribute: string; priority: string; tier: number;
  emotes: string[]; why: string; team: string; upcoming?: boolean; eta?: string; leak?: boolean;
}
export interface CoachPicks { profiles: Record<string, RawPick[]> }

export function derivePicks(raw: CoachPicks, profile = "wife-zzz"): StaffPick[] {
  return (raw.profiles[profile] ?? []).map((p) => ({
    rank: p.rank, name: p.name, section: p.section, attribute: p.attribute, priority: p.priority,
    tier: Math.max(1, Math.min(5, p.tier)),
    emotes: p.emotes.map((e) => EMOTE_ALIAS[e] ?? e),
    why: p.why.split("\n\n").map((s) => s.trim()).filter(Boolean),
    team: p.team.split("\n").map((s) => s.trim()).filter(Boolean),
    upcoming: !!p.upcoming, eta: p.eta ?? null, leak: !!p.leak,
  })).sort((a, b) => a.rank - b.rank);
}

// ---------------------------------------------------------------- Combo Deals
interface RawCombo {
  id: string; shelf?: ComboShelf; name: string; archetype: string; attribute: string;
  members: { slug: string; role: string }[];
  swapNote?: string; field?: string; why: string; room: string; caution?: string;
  swaps?: { team: string; when: string }[]; bangboo?: string; sources?: string[];
}
interface RawBill {
  mode: Mode; label: string; date: string; note: string;
  rooms: { room: number; boss: BossRef; recommended: string[]; resistance: string[]; deal: string | null; note: string; ref?: { team: string[]; score: number } }[];
}
export interface CoachCombos { profiles: Record<string, { deals: RawCombo[]; bill?: RawBill }> }

const byScore = (a: Run, b: Run) => b.score - a.score;
const sameTeam = (a: string[], b: string[]) => a.length === b.length && a.every((s) => b.includes(s));

/**
 * Combo Deals = editorial bundles (the dashboard's combo-deals.ts) + receipts from A.'s logs. The proof
 * level is DERIVED, never typed in: a trio with a logged run is `proven`; one whose carry has a logged
 * shell that shares a second member is `adapted` (the shell is its `kin`); anything else is a `guide` pick.
 * `runs` = A.'s flattened runs (`flattenRuns(…, "andres-zzz")`), because her account has no logs.
 */
export function deriveCombos(raw: CoachCombos, runs: Run[], profile = "wife-zzz"): { deals: ComboDeal[]; bill: ComboBill | null } {
  const p = raw.profiles[profile];
  if (!p) return { deals: [], bill: null };
  const deals = p.deals.map((d): ComboDeal => {
    const order = d.members.map((m) => m.slug);
    const receipts = runs.filter((r) => sameTeam(r.team, order)).sort(byScore);
    const kin = receipts.length ? [] : runs
      .filter((r) => r.team.includes(order[0]) && r.team.filter((s) => order.includes(s)).length >= 2)
      .sort(byScore).slice(0, 4);
    return {
      id: d.id, shelf: d.shelf ?? "house", name: d.name, archetype: d.archetype, attribute: d.attribute as Element | "",
      order, roles: Object.fromEntries(d.members.map((m) => [m.slug, m.role])),
      proof: receipts.length ? "proven" : kin.length ? "adapted" : "guide",
      swapNote: d.swapNote ?? null, field: d.field ?? null,
      why: d.why.split("\n\n").map((s) => s.trim()).filter(Boolean),
      room: d.room, caution: d.caution ?? "", swaps: d.swaps ?? [], bangboo: d.bangboo ?? null,
      receipts, kin, sources: d.sources ?? [],
    };
  });
  const ids = new Set(deals.map((d) => d.id));
  const bill: ComboBill | null = p.bill ? {
    mode: p.bill.mode, label: p.bill.label, date: p.bill.date, note: p.bill.note,
    rooms: p.bill.rooms.map((r) => ({
      room: r.room, boss: r.boss, recommended: r.recommended as Element[], resistance: r.resistance as Element[],
      deal: r.deal && ids.has(r.deal) ? r.deal : null, note: r.note, ref: r.ref ?? null,
    })),
  } : null;
  return { deals, bill };
}
