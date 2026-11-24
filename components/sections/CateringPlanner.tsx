"use client";

/**
 * /catering's tray catalogue and the card under it. The trays a visitor marks
 * on the catalogue are the same trays ticked in the inquiry form, so picking
 * one up top and opening the form are one gesture, not two.
 *
 * The card below the catalogue has two faces: the fine print (lead time,
 * payment, cancellation, minimum) and the inquiry form. Its CTA, any
 * `#inquiry` link and a `#inquiry` deep link turn it over. Only one face is
 * mounted at a time, so the card takes the height of the face it shows; the
 * turn is two `rotateY` keyframes (`.flip-out` / `.flip-in`), transform and
 * opacity only, removed by both reduced-motion kill switches (CLAUDE.md §7).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IconArrow, IconCheck } from "@/components/ui/icons";
import { CateringInquiryForm } from "@/components/sections/CateringInquiryForm";
import { track } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { catering } from "@/content/catering";

/** Shared with CateringInquiryForm, which saves the rest of the draft under it. */
export const CATERING_DRAFT_KEY = "hakerem.catering-inquiry.v1";
const TRAY_IDS = catering.options.map((o) => o.id);
const copy = catering.planner;

type Planner = {
  trays: string[];
  setTrays: (next: string[] | ((t: string[]) => string[])) => void;
  toggleTray: (id: string) => void;
  open: boolean;
  openInquiry: () => void;
  closeInquiry: () => void;
};

const PlannerContext = createContext<Planner | null>(null);

/** Tray selection for the form; a local fallback keeps the form usable outside the planner. */
export function useCateringTrays(): Pick<Planner, "trays" | "setTrays"> {
  const ctx = useContext(PlannerContext);
  const [local, setLocal] = useState<string[]>([]);
  return ctx ?? { trays: local, setTrays: setLocal };
}

function readDraft(): Record<string, unknown> | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(CATERING_DRAFT_KEY) ?? "null");
    return saved && typeof saved === "object" ? saved : null;
  } catch {
    return null;
  }
}

export function CateringPlanner({ children }: { children: ReactNode }) {
  const [trays, setTraysState] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const restored = useRef(false);

  useEffect(() => {
    const saved = readDraft();
    if (saved && Array.isArray(saved.trays)) {
      setTraysState(saved.trays.map(String).filter((t) => TRAY_IDS.includes(t)));
    }
    restored.current = true;
  }, []);

  // Keep the stored draft's trays current while the form is closed; the form
  // writes the whole draft itself once it is open.
  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(CATERING_DRAFT_KEY, JSON.stringify({ ...(readDraft() ?? {}), trays }));
    } catch {
      /* private mode */
    }
  }, [trays]);

  const setTrays = useCallback<Planner["setTrays"]>((next) => {
    setTraysState((t) => {
      const value = typeof next === "function" ? next(t) : next;
      return TRAY_IDS.filter((id) => value.includes(id));
    });
  }, []);

  const toggleTray = useCallback(
    (id: string) => setTrays((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id])),
    [setTrays],
  );

  const openInquiry = useCallback(() => setOpen(true), []);
  const closeInquiry = useCallback(() => setOpen(false), []);

  // `#inquiry` from anywhere (the hero, the call band, a deep link) turns the card.
  useEffect(() => {
    if (window.location.hash === "#inquiry") setOpen(true);
    const onHash = () => {
      if (window.location.hash === "#inquiry") setOpen(true);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (a && a.getAttribute("href")?.endsWith("#inquiry")) setOpen(true);
    };
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const value = useMemo(
    () => ({ trays, setTrays, toggleTray, open, openInquiry, closeInquiry }),
    [trays, setTrays, toggleTray, open, openInquiry, closeInquiry],
  );
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

function usePlanner(): Planner {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("CateringPlanner missing");
  return ctx;
}

/** The toggle at the foot of a tray card. Pressed state is also on the card via `has-[[aria-pressed=true]]`. */
export function TrayPick({ id, title }: { id: string; title: string }) {
  const { trays, toggleTray } = usePlanner();
  const on = trays.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={copy.pickAria(title)}
      onClick={() => {
        toggleTray(id);
        if (!on) track("cta_click", { ui_location: "catering_trays", link_text: `${copy.pick} · ${title}` });
      }}
      className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-pill border-2 px-4 text-sm font-medium
                  transition-[background-color,border-color,color,transform] duration-fast ease-out-soft active:scale-95
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2
                  focus-visible:ring-offset-cream-3 ${
                    on
                      ? "border-olive bg-olive text-cream"
                      : "border-stroke bg-cream text-espresso [@media(hover:hover)]:hover:border-olive"
                  }`}
    >
      <span
        aria-hidden
        className={`grid h-5 w-5 place-items-center rounded-full ${on ? "bg-cream text-olive" : "border-2 border-olive/50 text-olive"}`}
      >
        {on ? <IconCheck className="h-3 w-3" /> : <span className="text-sm leading-none">+</span>}
      </span>
      {on ? copy.picked : copy.pick}
    </button>
  );
}

type Face = "front" | "back";
type Phase = "idle" | "out" | "in";

/**
 * The fine print that turns into the form. `front` is server-rendered; the
 * selection line and the CTA are added here because they follow the picks.
 */
export function InquiryFlip({ front }: { front: ReactNode }) {
  const { trays, open, openInquiry, closeInquiry } = usePlanner();
  const reduced = useReducedMotion();
  const [face, setFace] = useState<Face>("front");
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<Face>("front");
  const rootRef = useRef<HTMLDivElement>(null);
  const turned = useRef(false);

  useEffect(() => {
    const want: Face = open ? "back" : "front";
    if (want === target.current) return;
    target.current = want;
    turned.current = true;
    if (reduced) setFace(want);
    else setPhase("out");
  }, [open]);

  // After a turn, bring the card's top into view and hand focus to its heading.
  useEffect(() => {
    if (!turned.current) return;
    const el = rootRef.current;
    if (!el) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 68;
    const top = el.getBoundingClientRect().top;
    if (top < nav || top > window.innerHeight * 0.5) {
      window.scrollBy({ top: top - nav - 12, behavior: reduced ? "instant" : "smooth" });
    }
    el.querySelector<HTMLElement>("[data-flip-focus]")?.focus({ preventScroll: true });
  }, [face]);

  function onAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (phase === "out") {
      setFace(target.current);
      setPhase("in");
    } else if (phase === "in") {
      setPhase("idle");
    }
  }

  const titles = trays.map((id) => catering.options.find((o) => o.id === id)?.title.he).filter(Boolean);

  return (
    // MobileBar collects its hide targets once, at mount, so the marker sits on
    // the wrapper that is always there, not on the face that comes and goes.
    <div id="inquiry" ref={rootRef} data-hide-mobile-bar="" className="[perspective:1800px]">
      <div
        onAnimationEnd={onAnimationEnd}
        className={`rounded-card border border-stroke bg-cream-3 shadow-md ${
          phase === "out" ? "flip-out" : phase === "in" ? "flip-in" : ""
        }`}
        data-track-area={face === "back" ? "catering_inquiry" : "catering_terms"}
      >
        {face === "back" ? (
          <CateringInquiryForm onClose={closeInquiry} />
        ) : (
          <>
            {front}
            <div className="flex flex-col gap-4 border-t border-stroke px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">
              <div aria-live="polite" className="min-w-0 text-base text-espresso">
                {titles.length ? (
                  <>
                    <p className="text-sm text-espresso-soft">{copy.front.chosen(titles.length)}</p>
                    <p className="mt-0.5 font-medium">{titles.join(" · ")}</p>
                  </>
                ) : (
                  <p className="text-espresso-soft">{copy.front.chosenNone}</p>
                )}
              </div>
              <div className="shrink-0 text-center lg:text-end">
                <button
                  type="button"
                  onClick={() => {
                    track("cta_click", { ui_location: "catering_terms", link_text: copy.front.cta });
                    openInquiry();
                  }}
                  className="group inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-pill
                             bg-espresso px-6 text-base font-medium text-cream md:text-lg transition-[background-color,transform] duration-fast
                             ease-out-soft hover:scale-[1.02] hover:bg-olive focus-visible:outline-none focus-visible:ring-2
                             focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream-3 lg:w-auto"
                >
                  {copy.front.cta}
                  <IconArrow className="h-5 w-5 transition-transform duration-fast group-hover:-translate-x-1" />
                </button>
                <p className="mt-2 text-xs text-espresso-soft">{copy.front.ctaNote}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
