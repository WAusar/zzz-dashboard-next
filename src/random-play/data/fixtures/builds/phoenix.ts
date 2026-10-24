// Phoenix — pulled day one 2026-10-20 (M0, signature R1). The generated detail carries discs, sheet and
// goals from the blob; skills/core are missing there because they come from the June Enka showcase, which
// predates her. Those two fields come from the in-game skills screen (10/20 = all Lv 1; refreshed 10/23 from A.'s screenshot).
import type { BuildDetail } from "../../types";
import generated from "./generated.json";

export const phoenix: BuildDetail = {
  ...((generated.details as unknown as Record<string, BuildDetail>).phoenix),
  skillSource: "IN-GAME · 10/23",
  skills: [
    { name: "Basic Attack", level: 12, max: 12 }, { name: "Dodge", level: 2, max: 12 }, { name: "Assist", level: 5, max: 12 },
    { name: "Special Attack", level: 10, max: 12 }, { name: "Chain Attack", level: 10, max: 12 },
  ],
  core: ["A", "B", "C", "D", "E", "F"],
};
