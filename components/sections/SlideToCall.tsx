"use client";

/**
 * Slide-to-call pill. Tapping (or Enter) runs the fill across the pill and
 * dials when it lands; dragging the knob fills it under the finger and dials
 * once released past the end. The tap path is the single-pointer alternative
 * WCAG 2.5.7 asks of any drag, and without JS it is a plain `tel:` link.
 * Reduced motion skips the fill and dials on tap.
 */
import { useCallback, useEffect, useRef } from "react";
import { IconPhone } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { track } from "@/lib/analytics";

type Props = {
  tel: string;
  display: string;
  label: string;
};

const PAD = 12;
const FILL_MS = 650;
const SNAP_MS = 320;
const COMPLETE_AT = 0.85;
const DRAG_SLOP = 6;

export function SlideToCall({ tel, display, label }: Props) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLAnchorElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const firing = useRef(false);
  const suppressClick = useRef(false);
  const drag = useRef<{ x: number; travel: number; p: number; moved: boolean } | null>(null);

  const travel = () => {
    const root = rootRef.current;
    const knob = knobRef.current;
    if (!root || !knob) return 0;
    return Math.max(0, root.clientWidth - knob.offsetWidth - PAD * 2);
  };

  const paint = useCallback((p: number, ms: number) => {
    const root = rootRef.current;
    const knob = knobRef.current;
    const fill = fillRef.current;
    if (!root || !knob || !fill) return;
    const t = Math.max(0, root.clientWidth - knob.offsetWidth - PAD * 2);
    const cover = PAD + knob.offsetWidth + p * (t + PAD);
    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    knob.style.transition = ms ? `transform ${ms}ms ${ease}` : "none";
    fill.style.transition = ms ? `clip-path ${ms}ms ${ease}` : "none";
    // RTL: the knob starts at the right edge and travels left.
    knob.style.transform = `translateX(${-p * t}px)`;
    fill.style.clipPath = `inset(0 0 0 ${Math.max(0, root.clientWidth - cover)}px round 9999px)`;
  }, []);

  const dial = useCallback(() => {
    window.location.href = `tel:${tel}`;
    window.setTimeout(() => {
      firing.current = false;
      paint(0, SNAP_MS);
    }, 1500);
  }, [tel, paint]);

  const finish = useCallback(
    (from: number) => {
      firing.current = true;
      const ms = Math.round(FILL_MS * (1 - from));
      paint(1, ms);
      window.setTimeout(dial, ms);
    },
    [paint, dial],
  );

  useEffect(() => {
    paint(0, 0);
    const reset = () => {
      firing.current = false;
      paint(0, 0);
    };
    const onResize = () => {
      if (!firing.current && !drag.current) paint(0, 0);
    };
    window.addEventListener("pageshow", reset);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("resize", onResize);
    };
  }, [paint]);

  // A drag ends in a click on the link. The site-wide click listener would
  // count it as a call, so it is stopped at window, before that listener.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!suppressClick.current) return;
      if (!rootRef.current?.contains(e.target as Node)) return;
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    e.preventDefault();
    if (firing.current) return;
    finish(0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (firing.current || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, travel: travel(), p: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d || d.travel === 0) return;
    const dx = d.x - e.clientX;
    if (!d.moved && Math.abs(dx) < DRAG_SLOP) return;
    d.moved = true;
    d.p = Math.min(1, Math.max(0, dx / d.travel));
    paint(d.p, 0);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 400);
    if (d.p >= COMPLETE_AT) {
      track("phone_call_click", { ui_location: rootRef.current?.closest("[data-track-area]")?.getAttribute("data-track-area") ?? "content" });
      finish(d.p);
    } else {
      paint(0, SNAP_MS);
    }
  };

  const text = (tone: "base" | "fill") => (
    <span className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-start">
      <span className={"text-sm " + (tone === "fill" ? "text-cream/90" : "text-espresso-soft")}>{label}</span>
      <span dir="ltr" className="type-statement text-3xl leading-none tabular-nums md:text-4xl">
        {display}
      </span>
    </span>
  );

  return (
    <a
      ref={rootRef}
      href={`tel:${tel}`}
      aria-label={`${label}: ${display}`}
      onClick={onClick}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="group relative isolate flex min-h-[72px] select-none items-center overflow-hidden rounded-pill bg-cream py-3 pe-[60px] ps-3 text-espresso shadow-lg
                 transition-colors duration-fast ease-out-soft hover:bg-cream-3 sm:pe-8
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-olive"
    >
      <span aria-hidden className="h-12 w-12 shrink-0 md:h-14 md:w-14" />
      <span className="ms-4 flex flex-1">{text("base")}</span>

      <span
        ref={fillRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center bg-olive-soft py-3 pe-[60px] ps-3 text-cream sm:pe-8"
        style={{ clipPath: "inset(0 0 0 100% round 9999px)" }}
      >
        <span className="h-12 w-12 shrink-0 md:h-14 md:w-14" />
        <span className="ms-4 flex flex-1">{text("fill")}</span>
      </span>

      <span
        ref={knobRef}
        aria-hidden
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute start-3 top-1/2 z-10 -mt-6 grid h-12 w-12 cursor-grab touch-none place-items-center rounded-full bg-olive text-cream
                   ring-2 ring-cream active:cursor-grabbing md:-mt-7 md:h-14 md:w-14"
      >
        <IconPhone className="h-6 w-6" />
      </span>
    </a>
  );
}
