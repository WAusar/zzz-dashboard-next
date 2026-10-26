"use client";
// COMBO DEALS: team recommendations for a profile with no endgame logs of its own, as the video-store
// thing for it: shrink-wrapped three-tape bundles on a plank. Every bundle is built only from tapes on
// the profile's wall; the proof sticker is derived from A.'s logs (deriveCombos), never typed in. The
// ticket strip is "tonight's bill": the live lockout rotation, one bundle per room.
import type { CSSProperties } from "react";
import { useAssets } from "../context";
import { DA_CAP } from "../data/meta";
import type { Agent, ComboBill, ComboDeal, ComboProof, ComboShelf, Run } from "../data/types";
import { ELEMENT_COLORS, type Element } from "../tokens";
import { CastCircles, ElementChips, fmt, shortDate, useTake } from "./endgame";
import { GradeSticker } from "./primitives";
import { SquadCard } from "./TripleFeatures";

const elColor = (attr: string) => ELEMENT_COLORS[attr as Element] ?? "#8A7E6E";
const PROOF: Record<ComboProof, { label: string; long: string }> = {
  proven: { label: "PROVEN", long: "A. runs this exact trio" },
  adapted: { label: "ADAPTED", long: "A.'s shell, your tapes swapped in" },
  guide: { label: "GUIDE PICK", long: "From the guides, not run here yet" },
};
const SHELVES: { id: ComboShelf; label: string; hint: string }[] = [
  { id: "house", label: "HOUSE FAVORITES", hint: "The core lanes" },
  { id: "cult", label: "CULT CLASSICS", hint: "Rare teams that score" },
];
const tilt = (i: number) => ((i * 53) % 5 - 2) * 0.7;

function proofLine(d: ComboDeal) {
  if (d.proof === "proven") return `${d.receipts.length}× IN A.'S LOGS · BEST ${fmt(d.receipts[0].score)}`;
  if (d.proof === "adapted") return `FROM A.'S ${fmt(d.kin[0].score)} SHELL`;
  return "NOT RUN HERE YET";
}

/** One shrink-wrapped bundle: three closed spines, a belly band, a proof sticker. */
export function ComboPack({ deal: d, roster, on, onPick, index }: { deal: ComboDeal; roster: Record<string, Agent>; on: boolean; onPick: () => void; index: number }) {
  const assets = useAssets();
  return (
    <button className={`rp-pack is-${d.proof}${on ? " is-on" : ""}`} aria-pressed={on} onClick={onPick}
      style={{ "--rp-tilt": `rotate(${tilt(index)}deg)`, "--rp-pack-el": elColor(d.attribute), animationDelay: `${index * 70}ms` } as CSSProperties}
      aria-label={`${d.name}: ${d.order.map((s) => roster[s]?.name ?? s).join(", ")}. ${PROOF[d.proof].long}`}>
      <span className="rp-pack__spines">
        {d.order.map((s) => <span key={s} className="rp-pack__spine"><img src={assets.jacket(s)} alt="" /></span>)}
      </span>
      <span className="rp-pack__wrap" aria-hidden="true" />
      <span className="rp-pack__band">
        <span className="rp-pack__name">{d.name}</span>
        <span className="rp-pack__meta">{d.attribute.toUpperCase()} · 3-PACK</span>
      </span>
      <span className="rp-pack__sticker"><b>{PROOF[d.proof].label}</b></span>
    </button>
  );
}

function RunRow({ r }: { r: Run }) {
  return (
    <div className={`rp-run${r.mode === "DA" && r.score >= DA_CAP ? " is-cap" : ""}`}>
      <div className="rp-run__top"><span className="rp-run__score">{fmt(r.score)}</span><span className="rp-run__when">{r.mode} · {shortDate(r.date)}</span></div>
      <div className="rp-run__bar"><div style={{ width: `${Math.min(100, (r.score / DA_CAP) * 100)}%` }} /></div>
      <div className="rp-run__boss">{(r.boss || "Boss not logged").toUpperCase()}</div>
    </div>
  );
}

function Bill({ bill, deals, current, onPick, names }: { bill: ComboBill; deals: ComboDeal[]; current: string; onPick: (i: number) => void; names: Record<string, string> }) {
  const assets = useAssets();
  return (
    <div className="rp-bill">
      <div className="rp-bill__label">
        <span className="rp-bill__kicker">TONIGHT'S BILL</span>
        <b>{bill.label}</b>
        <span className="rp-bill__date">FROM {shortDate(bill.date)} · ONE TAPE, ONE ROOM</span>
      </div>
      {bill.rooms.map((r) => {
        const i = deals.findIndex((d) => d.id === r.deal);
        const d = deals[i];
        return (
          <button key={r.room} className={`rp-ticket${d && d.id === current ? " is-on" : ""}`} disabled={!d} onClick={() => d && onPick(i)}
            aria-label={`Room ${r.room}, ${r.boss.name}: ${d ? d.name : "nothing on the shelf fits"}`}>
            <span className="rp-ticket__stub"><small>ROOM</small><b>{r.room}</b></span>
            <span className="rp-ticket__boss"><img src={assets.enemy(r.boss.slug)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /></span>
            <span className="rp-ticket__body">
              <span className="rp-ticket__name">{r.boss.name}</span>
              <span className="rp-ticket__els">
                <ElementChips label="REC" elements={r.recommended} />
                {r.resistance.length > 0 && <ElementChips label="RES" elements={r.resistance} />}
              </span>
              <span className="rp-ticket__deal">
                {d ? <><CastCircles team={d.order} bangboo={null} names={names} size="sm" /><span>{d.name}</span></> : <span>NOTHING ON THE SHELF FITS</span>}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export interface ComboDealsProps {
  deals: ComboDeal[];
  bill: ComboBill | null;
  current: number;
  onPick: (i: number) => void;
  roster: Record<string, Agent>;
  onOpenAgent: (slug: string) => void;
  forName: string;
  staff: string;
  open: boolean;
}

export function ComboDeals({ deals, bill, current, onPick, roster, onOpenAgent, forName, staff, open }: ComboDealsProps) {
  const take = useTake(open);
  const d = deals[current];
  const names = Object.fromEntries(Object.values(roster).map((a) => [a.slug, a.name]));
  const billRoom = bill?.rooms.find((r) => r.deal === d?.id);
  const proven = deals.filter((x) => x.proof === "proven").length;
  const shelf = d?.shelf ?? "house";
  const onShelf = deals.map((x, i) => ({ x, i })).filter(({ x }) => x.shelf === shelf);
  return (
    <section className={`rp-view rp-combos rp-peg${open ? " is-in" : ""}`} aria-label="Combo deals: teams from your own tapes" aria-hidden={!open}>
      {!d ? (
        <div className="rp-placeholder rp-combos__empty"><b>No combo deals</b>Nobody's bundled teams for this profile yet.</div>
      ) : (
        <>
          <div key={`head-${take}`} className="rp-combos__head">
            <div>
              <div className="rp-combos__kicker">COMBO DEALS · TEAMS FROM YOUR OWN TAPES · FOR {forName.toUpperCase()}</div>
              <h2 className="rp-combos__title">Combo Deals</h2>
              <div className="rp-combos__sub">Every bundle uses only tapes on your wall. {proven} of {deals.length} are trios A. has actually run: the stickers are receipts, not vibes.</div>
            </div>
            <div className="rp-combos__aisles" role="tablist" aria-label="Shelves">
              {SHELVES.filter((a) => deals.some((x) => x.shelf === a.id)).map((a) => (
                <button key={a.id} role="tab" aria-selected={a.id === shelf} className={`rp-aisle is-${a.id}${a.id === shelf ? " is-on" : ""}`}
                  onClick={() => a.id !== shelf && onPick(deals.findIndex((x) => x.shelf === a.id))}>
                  <b>{a.label}</b><small>{deals.filter((x) => x.shelf === a.id).length} BUNDLES · {a.hint.toUpperCase()}</small>
                </button>
              ))}
            </div>
            <div className="rp-combos__sign">Bundled by<b>{staff}</b></div>
          </div>

          <div key={`shelf-${shelf}-${take}`} className={`rp-combos__shelf is-${shelf}`}>
            {onShelf.map(({ x, i }, n) => <ComboPack key={x.id} deal={x} roster={roster} index={n} on={i === current} onPick={() => onPick(i)} />)}
          </div>

          {bill && <Bill key={`bill-${take}`} bill={bill} deals={deals} current={d.id} onPick={onPick} names={names} />}

          <article key={`card-${d.id}-${take}`} className={`rp-combo is-${d.proof}${bill ? "" : " is-tall"}`} style={{ "--rp-pack-el": elColor(d.attribute) } as CSSProperties}>
            <div className="rp-combo__stage">
              <div className="rp-combo__kicker">COMBO DEAL · {d.attribute.toUpperCase()} · {d.archetype.split(" · ")[0].toUpperCase()}</div>
              <h3 className="rp-combo__name">{d.name}</h3>
              <div className="rp-combo__arch">{d.archetype}</div>
              <div className="rp-combo__proof">
                <span className="rp-combo__seal">{PROOF[d.proof].label}</span>
                <span>{proofLine(d)}</span>
              </div>
              <div className="rp-combo__lineup">
                {d.order.map((s, i) => roster[s] && <SquadCard key={s} agent={roster[s]} index={i} role={d.roles[s] ?? roster[s].section} onOpen={() => onOpenAgent(s)} />)}
              </div>
              <div className="rp-combo__checks" aria-label="Your builds">
                {d.order.map((s) => roster[s] && (
                  <button key={s} className="rp-combo__check" onClick={() => onOpenAgent(s)} title={roster[s].suggestion ?? ""}>
                    <GradeSticker grade={roster[s].grade} small />
                    <span><b>{roster[s].spine}</b>{roster[s].pct != null ? `YOUR BUILD · ${roster[s].pct!.toFixed(1)}%` : "NOT BUILT YET"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rp-combo__notes">
              <div className="rp-combo__label">WHY IT WORKS</div>
              <div className="rp-combo__prose">{d.why.map((p, i) => <p key={i}>{p}</p>)}</div>
              <div className="rp-combo__label">PLAYS BEST IN</div>
              <div className="rp-combo__prose"><p>{d.room}</p></div>
              {d.caution && <><div className="rp-combo__label">HANDLE WITH CARE</div><div className="rp-combo__prose"><p>{d.caution}</p></div></>}
              {billRoom && (
                <div className="rp-combo__tonight"><b>TONIGHT · ROOM {billRoom.room}</b>{billRoom.note}</div>
              )}
            </div>

            <div className="rp-combo__side">
              {d.proof === "proven" ? (
                <>
                  <div className="rp-combo__label">A.'S RECEIPTS · THIS EXACT TRIO</div>
                  {d.receipts.slice(0, 2).map((r) => <RunRow key={`${r.mode}${r.date}${r.score}`} r={r} />)}
                </>
              ) : d.kin.length ? (
                <>
                  <div className="rp-combo__label">A.'S VERSION{d.swapNote ? ` · ${d.swapNote.toUpperCase()}` : ""}</div>
                  <div className="rp-combo__kin"><CastCircles team={d.kin[0].team} bangboo={null} names={names} size="sm" /></div>
                  {d.kin.slice(0, 2).map((r) => <RunRow key={`${r.mode}${r.date}${r.score}`} r={r} />)}
                </>
              ) : (
                <>
                  <div className="rp-combo__label">NO RECEIPTS YET</div>
                  <div className="rp-combo__prose"><p>A. hasn't run this one, so it comes from other players' clears. Your first run is the first receipt.</p></div>
                </>
              )}
              {d.field && <><div className="rp-combo__label" style={{ marginTop: 10 }}>IN THE WILD</div><div className="rp-combo__field">{d.field}</div></>}
              {d.swaps.length > 0 && (
                <>
                  <div className="rp-combo__label" style={{ marginTop: 12 }}>SWAP-INS FROM YOUR SHELF</div>
                  {d.swaps.slice(0, 2).map((v) => <div key={v.team} className="rp-variant"><b>{v.team}</b> — {v.when}</div>)}
                </>
              )}
              <div className="rp-combo__src">{d.sources.join(" · ")}</div>
            </div>
            <div className="rp-combo__sig">— {staff} ♡</div>
          </article>
        </>
      )}
    </section>
  );
}
