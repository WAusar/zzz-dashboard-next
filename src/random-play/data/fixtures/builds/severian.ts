// Severian — Cosmea's roster only (pulled 2026-11-11, M0, no signature). A. doesn't own him, so there is
// no generated detail to spread: his discs, sheet and goals come live from her blob in the dashboard.
// This fixture carries only what the blob can't yet: skills and core, read off her in-game skills screen
// (photo, 2026-11-11). She had his materials pre-farmed, so three skills and the whole core are maxed.
import type { BuildDetail } from "../../types";

export const severian: BuildDetail = {
  slug: "severian",
  sheetSource: "NOT IN THIS SNAPSHOT · LIVE FROM HER BLOB", // no sheet here on purpose; the dashboard labels its own
  skillSource: "IN-GAME · 11/11",
  skills: [
    { name: "Basic Attack", level: 12, max: 12 }, { name: "Dodge", level: 2, max: 12 }, { name: "Assist", level: 3, max: 12 },
    { name: "Special Attack", level: 12, max: 12 }, { name: "Chain Attack", level: 12, max: 12 },
  ],
  core: ["A", "B", "C", "D", "E", "F"],
};
