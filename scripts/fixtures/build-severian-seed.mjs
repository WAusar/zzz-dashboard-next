// One-off: build Severian's seed for wife-zzz (2026-11-11).
//   node scripts/fixtures/build-severian-seed.mjs <seed-agent.json>   → writes scripts/fixtures/severian-2026-11-11.json
//
// A. doesn't own Severian, so there is no build to clone. This seeds him from Cosmea's character
// screen (photo, 2026-11-11) with two PLACEHOLDERS, both hers to replace in the Scenes tab:
//   - W-Engine: Cordis Germina (her Seed's signature, which she has on him for now)
//   - discs: a copy of her Seed's six pieces, only so the editor has pieces to edit
// `base` is back-solved against those placeholder discs (derive-bases math), so the sheet shows her
// real screen today. Once her real discs are in, base must be back-solved AGAIN from the same screen.
import fs from "node:fs";
import { discAccum, setSheetAccum, weaponAdvanceAccum, resolveWengine, computeSheet } from "../../src/lib/grading/grading.js";

const cfg = JSON.parse(fs.readFileSync(new URL("../../src/lib/grading/grading-config.json", import.meta.url)));
const raw = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const seedAgent = raw.agent ?? raw;

const screen = {
  "HP": "12,364", "ATK": "2,945", "DEF": "790", "Impact": "94", "CRIT Rate": "69.8%", "CRIT DMG": "122%",
  "Anomaly Mastery": "91", "Anomaly Proficiency": "90", "PEN Ratio": "32%", "Energy Regen": "1.2",
};
const num = (v) => parseFloat(String(v).replace(/[^0-9.\-]/g, "")) || 0;

const agent = {
  rank: "S",
  level: 60,
  faction: "Public Security: Metropolitan Order Division",
  section: "ATTACK",
  attribute: "Wind",
  mindscape: "M0",
  wengine: { name: "Cordis Germina", rank: "S", refine: "R1" },
  relevant: ["ATK", "CRIT Rate", "CRIT DMG"], // the three lit gold on her screen
  mainStats: Object.entries(screen).map(([stat, value]) => ({ stat, value })),
  discs: { pieces: JSON.parse(JSON.stringify(seedAgent.discs.pieces)) },
};

const s = Object.fromEntries(agent.mainStats.map((r) => [r.stat, num(r.value)]));
const d = discAccum(agent.discs.pieces, cfg);
const ss = setSheetAccum(agent.discs.pieces, cfg);
const wa = weaponAdvanceAccum(resolveWengine(agent.wengine, cfg));
agent.base = {
  "ATK": (s["ATK"] - d.flatAtk - ss.flatAtk) / (1 + (d.atkPct + ss.atkPct + wa.atkPct) / 100),
  "HP": (s["HP"] - d.flatHp - ss.flatHp) / (1 + (d.hpPct + ss.hpPct + wa.hpPct) / 100),
  "DEF": (s["DEF"] - d.flatDef - ss.flatDef) / (1 + (d.defPct + ss.defPct + wa.defPct) / 100),
  "CRIT Rate": s["CRIT Rate"] - d.crPct - ss.crPct,
  "CRIT DMG": s["CRIT DMG"] - d.cdPct - ss.cdPct,
  "Anomaly Proficiency": s["Anomaly Proficiency"] - d.apFlat - ss.apFlat,
  "Anomaly Mastery": s["Anomaly Mastery"] / (1 + (d.amPct + ss.amPct + wa.amPct) / 100),
  "Impact": s["Impact"] / (1 + (d.impactPct + ss.impactPct + wa.impactPct) / 100),
  "Energy Regen": s["Energy Regen"] / (1 + (d.erPct + ss.erPct + wa.erPct) / 100),
  "PEN Ratio": s["PEN Ratio"] - d.penRatio - ss.penRatio,
};
for (const k of Object.keys(agent.base)) agent.base[k] = +agent.base[k].toFixed(3);

const fwd = computeSheet(agent, cfg);
let worst = 0;
for (const k of Object.keys(s)) {
  const err = Math.abs((fwd[k] ?? NaN) - s[k]);
  console.log(`${k.padEnd(20)} screen ${String(s[k]).padStart(8)}  sheet ${String(+(fwd[k] ?? NaN).toFixed(2)).padStart(8)}  base ${agent.base[k]}`);
  if (!(err <= worst)) worst = err;
}
console.log(`worst error: ${worst}`);
console.log(`engine resolved: ${JSON.stringify(resolveWengine(agent.wengine, cfg)?.advanced ?? null)}`);
console.log(`placeholder sets: ${[...new Set(agent.discs.pieces.map((p) => p.set))].join(", ")}`);

const out = new URL("./severian-2026-11-11.json", import.meta.url);
fs.writeFileSync(out, JSON.stringify(agent, null, 1) + "\n");
console.log("wrote", out.pathname);
