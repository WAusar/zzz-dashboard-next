import type { Metadata } from "next";
import { RandomPlayHost } from "@/random-play-host/RandomPlayHost";

export const metadata: Metadata = {
  title: "Combo Deals · Cosmea's ZZZ · Random Play",
  description: "Team recommendations built only from Cosmea's own agents, receipted against A.'s Shiyu and Deadly Assault logs, plus a lockout plan for the live rotation.",
};

// Static entry point: opens Cosmea's store on Combo Deals (her-exclusive section; the bundles are
// editorial data from combo-deals.ts, the proof stickers derive from A.'s logs at render time).
export default function WifeCombos() {
  return <RandomPlayHost initial={{ view: "combos" }} />;
}
