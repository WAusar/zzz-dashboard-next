// Cosmea's Combo Deals: team recommendations built ONLY from the tapes she owns. Editorial roster
// analysis, like pull-priority.ts, so it lives in code (no imports: random-play's build-fixtures.ts
// imports this file directly to snapshot it for the playground).
//
// Method (the coach doctrine, out/coach/COACH.md): A.'s logs first, guides second. Her account has no
// endgame logs, so every bundle is checked against A.'s Shiyu + Deadly Assault history, and the
// framework DERIVES the proof sticker from those logs (deriveCombos): an exact trio he has run is
// PROVEN, one that shares his carry + a second member is ADAPTED, the rest are GUIDE picks. Never
// type one of A.'s scores in here; receipts come from shiyu.ts / assault.ts.
//
// Two shelves: `house` = House Favorites (the core lanes), `cult` = Cult Classics (rare but real teams
// from Prydwen's player data: low usage, solid scores). `field` = Prydwen's M0 averages, from the
// Shiyu + Deadly Assault analytics pages filtered to her exact roster (3.2.3 data, updated 10/11,
// ~16.7k SD / ~14.2k DA players). Where Prydwen and A.'s benchmarked Laws disagree, the Laws win.
//
// why: "\n\n" = paragraph break. `members` order = carry first. `bill` = the live lockout rotation
// (re-plan it every new Deadly Assault / Shiyu; a stale bill is worse than none, so drop it if unsure).
//
// 2026-10-25: first shelf, 14 bundles over her 20 tapes (Nangong Yu, Velina, Phoenix joined today).

export interface ComboMember { slug: string; role: string }
export interface ComboDealRec {
  id: string;
  shelf: "house" | "cult";
  name: string;
  archetype: string;
  attribute: string;
  members: ComboMember[];
  swapNote?: string;
  field?: string;
  why: string;
  room: string;
  caution?: string;
  swaps?: { team: string; when: string }[];
  bangboo?: string;
  sources?: string[];
}
export interface ComboBillRec {
  mode: "DA" | "Shiyu";
  label: string;
  date: string;
  note: string;
  rooms: {
    room: number;
    boss: { name: string; slug: string; level: number };
    recommended: string[];
    resistance: string[];
    deal: string | null;
    note: string;
    ref?: { team: string[]; score: number };
  }[];
}

const LOGS = "A.'s Shiyu + Deadly Assault logs";
const PRYDWEN = "prydwen.gg/zenless · SD + DA analytics filtered to her roster (3.2.3) + character pages";

export const WIFE_COMBO_DEALS: ComboDealRec[] = [
  // ============================================================ HOUSE FAVORITES
  {
    id: "phoenix-rising",
    shelf: "house",
    name: "Wax Wings",
    archetype: "Anomaly / Disorder · Anomaly + Anomaly + Anomaly",
    attribute: "Fire",
    members: [
      { slug: "remielledan", role: "Carry" },
      { slug: "phoenix", role: "Anomaly" },
      { slug: "velina", role: "Anomaly" },
    ],
    field: "Too new for Prydwen's data · A.'s receipts are the only scores on file",
    why:
      "The trio A. built the week Phoenix dropped, and it's his current Deadly Assault headliner. You just pulled the two missing pieces, so this is yours now, tape for tape.\n\n" +
      "Remielle's passive gives the squad ATK for every Anomaly teammate, and here all three are Anomaly. Phoenix brings Fire (the lane your shelf never had) and Velina's Wind makes Disorder with everything.",
    room: "Anomaly specialty rooms · Fire or Wind welcome · anything that pays Attribute Anomaly DMG",
    caution: "New tapes need discs: until Phoenix and Velina are built, expect less than A.'s numbers. Remielle's own discs grade C right now, so she's the cheapest upgrade here.",
    swaps: [
      { team: "Remielle / Velina / Vivian", when: "Phoenix is needed in another room (Prydwen DA 30,643 · SD 29,541)" },
      { team: "Remielle / Velina / Yanagi", when: "Fire is resisted (Prydwen DA 30,619)" },
    ],
    sources: [LOGS],
  },
  {
    id: "lumiflux-velina",
    shelf: "house",
    name: "Lumiflux Matinee",
    archetype: "Anomaly / Disorder · Anomaly + Anomaly + Anomaly",
    attribute: "Lumiflux",
    members: [
      { slug: "remielledan", role: "Carry" },
      { slug: "velina", role: "Anomaly" },
      { slug: "vivian", role: "Anomaly" },
    ],
    field: "Prydwen M0 avg · DA 30,643 · SD 29,541",
    why:
      "Remielle's best team on your shelf that doesn't need Phoenix. Velina is the piece every top Remielle team shares; A. runs her with Remielle in all three of his Remielle shells.\n\n" +
      "Vivian applies off-field without fighting either of them for screen time, and Ether + Wind is a clean Disorder pair.",
    room: "Anomaly / Disorder rooms · Ether and Wind not resisted",
    caution: "Shares Remielle and Velina with Wax Wings, so in a lockout it's one or the other.",
    swaps: [
      { team: "Remielle / Miyabi / Velina", when: "Ice is welcome (Prydwen DA 30,058 · SD 30,593)" },
      { team: "Remielle / Velina / Yanagi", when: "Vivian is spent (Prydwen DA 30,619 · SD 29,560)" },
    ],
    sources: [LOGS, PRYDWEN],
  },
  {
    id: "physical-hypercarry",
    shelf: "house",
    name: "The Sword Saint",
    archetype: "Attack hypercarry · DPS + Stun + Support",
    attribute: "Honed Edge",
    members: [
      { slug: "yeshunguang", role: "Carry" },
      { slug: "dialyn", role: "Stun" },
      { slug: "sunna", role: "Support" },
    ],
    field: "Prydwen M0 avg · DA 29,857 · SD 32,401 · top 2 on a Deadly Assault boss board",
    why:
      "The most-run team on A.'s account, by a mile. You own the same three tapes with the same signature engines, so his receipts are your ceiling.\n\n" +
      "Dialyn's Ultimate feeds Ye Shunguang 6 Sword Force at once, and Sunna is her best buffer.",
    room: "Physical or no resistance · CRIT DMG / ATK / Ultimate buff rooms · anything with stun windows",
    caution: "Takes Dialyn, who both Rupture bundles also want. In a lockout, give her here first.",
    swaps: [
      { team: "Ye Shunguang / Sunna / Zhao", when: "once Zhao is built: the #1 DA team on Prydwen, and it frees Dialyn" },
      { team: "Ye Shunguang / Dialyn / Astra Yao", when: "Sunna is needed elsewhere (a step down)" },
    ],
    sources: [LOGS, PRYDWEN],
  },
  {
    id: "electric-double",
    shelf: "house",
    name: "Venom & Vanguard",
    archetype: "Electric double-Attack · Attack + Attack (Vanguard) + Support",
    attribute: "Electric",
    members: [
      { slug: "cissia", role: "Carry" },
      { slug: "seed", role: "Vanguard" },
      { slug: "astra", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 30,761 · DA 28,319",
    why:
      "A.'s Electric answer, run eight times, every one an S. Seed's Surprise Strike only switches on with another Attack agent beside her, and Cissia is that partner (and her best one).\n\n" +
      "While Cissia holds Venom the whole squad gets +40% CRIT DMG. Astra Yao adds quick assists, extra chains and healing.",
    room: "Electric recommended · any room that pays CRIT DMG",
    caution: "Never swap Cissia for a stunner: without a second Attack agent, Seed's kit turns off. Skip it against any 'Integrated' boss, whose barrier bounces crit teams (A. measured 8k vs 24k for Anomaly).",
    swaps: [
      { team: "Cissia / Seed / Sunna", when: "Astra is saved for Miyabi (Prydwen SD 29,018)" },
    ],
    sources: [LOGS, PRYDWEN],
  },
  {
    id: "frost-fang",
    shelf: "house",
    name: "Frost Fang",
    archetype: "Hybrid crit-anomaly · Carry + Anomaly-stun + Support",
    attribute: "Frost",
    members: [
      { slug: "miyabi", role: "Carry" },
      { slug: "nangongyu", role: "Stun" },
      { slug: "astra", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 27,559 · DA 24,975 · Yuzuha version: #1 on a Shiyu stage",
    why:
      "A.'s Miyabi shell, run seven times. Nangong Yu stuns while still building Anomaly, which is exactly what a hybrid carry like Miyabi wants.\n\n" +
      "Astra over Yuzuha is A.'s call, not the crowd's: Miyabi scales on ATK and CRIT more than on Anomaly, and he measured the universal buffer beating the Anomaly one for her by 4,332 points.",
    room: "Ice recommended · Anomaly or stun-window rooms where Ice is welcome · ATK / CRIT / EX buffs",
    caution: "Into Ice resistance, bench her. Shares Astra with Venom & Vanguard; in a lockout, Yuzuha covers here.",
    swaps: [
      { team: "Miyabi / Nangong Yu / Yuzuha", when: "Astra is with Seed/Cissia: the most-used Miyabi team on Prydwen (SD 30,376 · DA 27,724)" },
      { team: "Miyabi / Nangong Yu / Sunna", when: "both Astra and Yuzuha are busy (Prydwen DA 32,397, small sample)" },
    ],
    sources: [LOGS, PRYDWEN],
  },
  {
    id: "ether-rupture",
    shelf: "house",
    name: "Ink & Sheer",
    archetype: "Rupture / Sheer · DPS + Stun + Rupture support",
    attribute: "Auric Ink",
    members: [
      { slug: "yixuan", role: "Carry" },
      { slug: "jufufu", role: "Stun" },
      { slug: "lucia", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 29,901 · DA 22,586",
    why:
      "A.'s Rupture shell, run three times with a best of 45,086. Rupture ignores DEF, so it wants the Rupture support (Lucia), not generic buffs.\n\n" +
      "Ju Fufu's Decibel refund gives Yixuan an Ultimate every stun, and it leaves Dialyn free for the Sword Saint, which is why this beats the Dialyn version in a lockout.",
    room: "Sheer / Rupture buff rooms · Ether or Auric Ink not resisted · DEF-ignore favored",
    caution: "An 'Ether DMG +%' room buff barely helps her, because her disc 5 is already Ether DMG (A. measured it twice). Lucia is in both Rupture bundles, so only one runs per lockout.",
    swaps: [
      { team: "Yixuan / Dialyn / Lucia", when: "Dialyn is free: the most-used Yixuan team (Prydwen SD 27,955)" },
      { team: "Yixuan / Lucia / Astra Yao", when: "a generalist third slot" },
    ],
    sources: [LOGS, PRYDWEN],
  },
  {
    id: "ice-rupture",
    shelf: "house",
    name: "Deep Freeze",
    archetype: "Ice Rupture / Sheer · DPS + Stun + Rupture support",
    attribute: "Ice",
    members: [
      { slug: "yidhari", role: "Carry" },
      { slug: "dialyn", role: "Stun" },
      { slug: "lucia", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 28,957 · DA 24,314",
    why:
      "Your Rupture backup for rooms that resist Ether and would stonewall Yixuan. Dialyn is her best stunner and Lucia keeps Ether Veil up. A. has run this exact trio twice.\n\n" +
      "Yidhari is your best-graded Rupture tape, so the build is ready when the room is right.",
    room: "Ice recommended + Sheer / Rupture · rooms where Ether resistance hurts Yixuan",
    caution: "Takes Dialyn and Lucia, so it's hard to fit next to the Sword Saint or Ink & Sheer. If a room pays only Ice Anomaly, Miyabi beats her.",
    swaps: [
      { team: "Yidhari / Ju Fufu / Lucia", when: "Dialyn is with the Sword Saint (Prydwen SD 22,877)" },
    ],
    sources: [LOGS, PRYDWEN],
  },

  // ============================================================ CULT CLASSICS
  {
    id: "remielle-nangong",
    shelf: "cult",
    name: "Angel's Share",
    archetype: "Anomaly + Anomaly-stun · Remielle with a stunner",
    attribute: "Lumiflux",
    members: [
      { slug: "remielledan", role: "Carry" },
      { slug: "velina", role: "Anomaly" },
      { slug: "nangongyu", role: "Stun" },
    ],
    field: "Prydwen M0 avg · DA 40,163 · used by 0.09% of players",
    why:
      "The highest Deadly Assault average of any team you can build, and almost nobody runs it. Nangong Yu counts as Anomaly for Remielle's passive while also giving the team real stun windows.\n\n" +
      "It's a small sample, so treat 40k as 'this works', not as a promise.",
    room: "Deadly Assault bosses with long stun windows · Ether / Wind not resisted",
    caution: "Small sample: under 1 in 1,000 players. Takes Remielle, Velina and Nangong, so it uses up three lanes' worth of tapes.",
    swaps: [{ team: "Remielle / Miyabi / Nangong Yu", when: "Velina is spent (Prydwen SD 28,394)" }],
    sources: [PRYDWEN],
  },
  {
    id: "yanagi-nangong",
    shelf: "cult",
    name: "Thunder Hour",
    archetype: "Anomaly / Disorder · Electric Anomaly + Anomaly-stun + Support",
    attribute: "Electric",
    members: [
      { slug: "yanagi", role: "Carry" },
      { slug: "nangongyu", role: "Stun" },
      { slug: "yuzuha", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 31,470 · DA 30,547 (vs Kusarikku)",
    why:
      "Yanagi as the main carry, which most people never try. Nangong's Ether stuns make Disorder with Yanagi's Electric, and Yuzuha is the strongest Anomaly buffer in the game.\n\n" +
      "The numbers hold up in both modes, which is rare for a team this unpopular.",
    room: "Electric or Ether welcome · Anomaly / Disorder rooms · stun-window bosses",
    swaps: [{ team: "Yanagi / Nangong Yu / Astra Yao", when: "Yuzuha is needed elsewhere" }],
    sources: [PRYDWEN],
  },
  {
    id: "alice-nangong",
    shelf: "cult",
    name: "Starshine Waltz",
    archetype: "Anomaly / Disorder · Physical Anomaly + Anomaly-stun + Support",
    attribute: "Physical",
    members: [
      { slug: "alice", role: "Carry" },
      { slug: "nangongyu", role: "Stun" },
      { slug: "yuzuha", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 29,602 · DA 22,062",
    why:
      "Alice's best team outside the Remielle shells. Nangong builds Ether Anomaly while she stuns, so Alice gets Disorders to cash in, and the stun windows land right where her Polarized Assault hits hardest.\n\n" +
      "Yuzuha speeds up everyone's buildup and buffs the Anomaly damage itself.",
    room: "Physical or Ether welcome · Anomaly rooms with stun bonuses",
    caution: "Alice wants more Anomaly Proficiency from her discs to really sing.",
    swaps: [{ team: "Alice / Vivian / Yuzuha", when: "Nangong is spent (A.'s setlist shell)" }],
    sources: [PRYDWEN],
  },
  {
    id: "double-attack",
    shelf: "cult",
    name: "Twin Blades",
    archetype: "Dual Attack · Vanguard + Attack + Support",
    attribute: "Electric",
    members: [
      { slug: "seed", role: "Carry" },
      { slug: "yeshunguang", role: "Attack" },
      { slug: "sunna", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 30,586 · DA 26,448",
    why:
      "Seed needs another Attack agent beside her, and it doesn't have to be Cissia. Ye Shunguang counts, and Sunna buffs both of them.\n\n" +
      "It's a way to run Seed when Cissia is in another room, or to give Ye Shunguang a partner when Dialyn is busy.",
    room: "Electric or Physical welcome · CRIT DMG rooms",
    caution: "Two on-field carries: Seed is the Vanguard, so let her set up and Ye Shunguang cash out. Not for Integrated bosses.",
    swaps: [{ team: "Seed / Ye Shunguang / Zhao", when: "once Zhao is built" }],
    sources: [PRYDWEN],
  },
  {
    id: "cissia-solo",
    shelf: "cult",
    name: "Venom Solo",
    archetype: "Attack hypercarry · Cissia + Stun + Support",
    attribute: "Electric",
    members: [
      { slug: "cissia", role: "Carry" },
      { slug: "dialyn", role: "Stun" },
      { slug: "astra", role: "Support" },
    ],
    field: "Prydwen M0 avg · SD 30,359 · DA 27,942",
    why:
      "Cissia without Seed. Her passive turns on with a Stun teammate too, and Dialyn's stuns plus Astra's buffs score almost as well as the full Venom & Vanguard.\n\n" +
      "Handy when Seed is in another room.",
    room: "Electric recommended · stun-window bosses",
    caution: "Takes Dialyn away from the Sword Saint.",
    swaps: [{ team: "Cissia / Dialyn / Sunna", when: "Astra is busy (Prydwen SD 27,786)" }],
    sources: [PRYDWEN],
  },
  {
    id: "polarity-disorder",
    shelf: "cult",
    name: "Polarity Disorder",
    archetype: "Anomaly / Disorder · Carry + sub-DPS + Support",
    attribute: "Physical",
    members: [
      { slug: "alice", role: "Carry" },
      { slug: "vivian", role: "Sub-DPS" },
      { slug: "yuzuha", role: "Support" },
    ],
    field: "Prydwen M1+ avg · SD 28,107 (too few M0 runs to average)",
    why:
      "One of A.'s setlist shells. Vivian's quick off-field Disorders feed straight into Alice's, and Yuzuha buffs both.\n\n" +
      "The no-stunner version of Starshine Waltz, for when Nangong is needed elsewhere.",
    room: "Anomaly / Disorder buff rooms · Physical not resisted · rewards off-field application",
    swaps: [
      { team: "Alice / Velina / Yuzuha", when: "Vivian is spent (A.'s variant)" },
      { team: "Alice / Miyabi / Yuzuha", when: "Ice is welcome (Prydwen SD 26,940)" },
    ],
    sources: ["A.'s setlists", PRYDWEN],
  },
  {
    id: "velina-vivian",
    shelf: "cult",
    name: "Crosswind",
    archetype: "Anomaly / Disorder · Wind Anomaly + Ether Anomaly + Support",
    attribute: "Wind",
    members: [
      { slug: "velina", role: "Carry" },
      { slug: "vivian", role: "Anomaly" },
      { slug: "yuzuha", role: "Support" },
    ],
    field: "Prydwen M0 avg · DA 26,866",
    why:
      "A Velina team with no Remielle, for the room after Remielle's. Wind and Ether make Disorder, and Yuzuha keeps the buildup flowing.\n\n" +
      "It's how you get Velina into a second room's worth of value without stealing Remielle.",
    room: "Wind or Ether welcome · Anomaly / Disorder rooms",
    swaps: [{ team: "Velina / Yanagi / Yuzuha", when: "Vivian is spent (Prydwen DA 26,845)" }],
    sources: [PRYDWEN],
  },
];

// Deadly Assault, Blasphemer rotation (from 2026-10-23). Three rooms, no tape twice. Room cards from
// assault.ts; A.'s team in each room rides along for scale.
export const WIFE_COMBO_BILL: ComboBillRec = {
  mode: "DA",
  label: "Deadly Assault · Blasphemer Rotation",
  date: "2026-10-23",
  note: "Deadly Assault locks a tape to one room. These three use nine different agents. Bangboo isn't tracked, so bring your best.",
  rooms: [
    {
      room: 1, boss: { name: "Blasphemer", slug: "blasphemer", level: 70 },
      recommended: ["Fire"], resistance: ["Ice"], deal: "phoenix-rising",
      note: "A.'s exact trio in this exact room. It's an Anomaly room: three different Anomalies put the boss in Wax Wings (+30% Anomaly DMG taken), Blazing Descent gives +50 AP with three Anomaly agents, and Phoenix is the Fire it asks for.",
      ref: { team: ["remielledan", "phoenix", "velina"], score: 56768 },
    },
    {
      room: 2, boss: { name: "Unknown Corruption Complex", slug: "complexcorrupted", level: 70 },
      recommended: ["Electric", "Ether"], resistance: [], deal: "physical-hypercarry",
      note: "A. ran exactly this trio in this exact room: 39,057, all three pips. Radiant Sky's +20% Daze makes Dialyn's stuns come faster.",
      ref: { team: ["yeshunguang", "dialyn", "sunna"], score: 39057 },
    },
    {
      room: 3, boss: { name: "Discordant Solo", slug: "discordantsolo", level: 70 },
      recommended: ["Ether", "Wind"], resistance: ["Fire", "Ice"], deal: "yanagi-nangong",
      note: "Anomaly room with stun bonuses (Perfect Rhythm: +25% Anomaly DMG on stunned enemies), and A. won it with a Nangong + Yuzuha team. Nangong is the Ether it asks for, and Yanagi is free since Remielle went to Room 1. Starshine Waltz (Alice) works here too.",
      ref: { team: ["aria", "nangongyu", "yuzuha"], score: 35027 },
    },
  ],
};

// Per-profile shelf. Only Cosmea has one; A.'s store uses Triple Features.
const BY_PROFILE: Record<string, { deals: ComboDealRec[]; bill?: ComboBillRec }> = {
  "wife-zzz": { deals: WIFE_COMBO_DEALS, bill: WIFE_COMBO_BILL },
};

export function comboDealsFor(profileKey: string): { deals: ComboDealRec[]; bill?: ComboBillRec } {
  return BY_PROFILE[profileKey] ?? { deals: [] };
}
