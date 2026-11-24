"use client";

/**
 * The 15 flavours as Instagram-style stories: 9:16 cards on a scroll-snap track,
 * the active one centred and full size, its neighbours stepped back. The active
 * card's progress segment fills over STORY_MS and then the track moves on.
 *
 * Moving the track is always `scrollBy` on the track itself (CLAUDE.md §7). The
 * timer is the fill's own CSS animation, so it pauses with
 * `animation-play-state`, and it only runs when all of these hold: hydrated, on
 * screen, not hovered, focused or touched, not paused with the button, and no
 * reduced motion. Under reduced motion there is no fill and no autoplay at all:
 * the kill switch shortens animations to ~0ms, which would otherwise fire
 * `animationend` at once and spin through the cards.
 *
 * The studio shots are square; a 9:16 crop would cut the donut, so each sits
 * as a 4:5 window faded into the card, the way a story frames a photo.
 */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CafeImage } from "@/components/ui/CafeImage";
import { IconArrow } from "@/components/ui/icons";
import { flavors, hanukkah } from "@/content/hanukkah";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const STORY_MS = 2800;
const copy = hanukkah.stories;

export function SufganiyahStories() {
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusHold, setFocusHold] = useState(false);
  const [touchHold, setTouchHold] = useState(false);
  const touchTimer = useRef<number>();
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Programmatic moves run with snap off: WebKit stutters, or lands with a jump, when a
  // smooth scrollBy fights a mandatory snap. Snap comes back once the track is still.
  const programmatic = useRef(false);
  const restoreSnap = useCallback(() => {
    programmatic.current = false;
    track.current?.style.removeProperty("scroll-snap-type");
  }, []);

  // Every scroll frame: the active card is the one nearest the track's centre, and,
  // unless motion is reduced, each card's scale and opacity follow its distance from
  // that centre, so a swipe moves the cards with the finger rather than popping the
  // new one in when it crosses the middle.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const live = !reduced;
    if (live) el.dataset.live = "";
    else delete el.dataset.live;
    let frame = 0;
    let idle = 0;
    const read = () => {
      frame = 0;
      const t = el.getBoundingClientRect();
      const mid = t.left + t.width / 2;
      const list = cards.current;
      const a = list[0]?.getBoundingClientRect();
      const b = list[1]?.getBoundingClientRect();
      const step = a && b ? Math.abs(b.left - a.left) : t.width;
      let best = 0;
      let dist = Infinity;
      const offsets = list.map((c, i) => {
        if (!c) return 1;
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
        return Math.min(d / step, 1);
      });
      list.forEach((c, i) => {
        const art = c?.firstElementChild as HTMLElement | null;
        if (!art) return;
        if (live) {
          const p = offsets[i];
          art.style.transform = p < 0.001 ? "none" : `scale(${1 - 0.14 * p})`;
          art.style.opacity = String(1 - 0.3 * p);
        } else {
          art.style.removeProperty("transform");
          art.style.removeProperty("opacity");
        }
      });
      setActive(best);
    };
    const settle = () => {
      delete el.dataset.moving;
      if (programmatic.current) restoreSnap();
    };
    const onScroll = () => {
      el.dataset.moving = "";
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 140);
      if (!frame) frame = requestAnimationFrame(read);
    };
    const onTouch = () => {
      // The finger takes over: hand snapping back to it at once.
      if (programmatic.current) restoreSnap();
      // A finger on the track holds autoplay until 3s after the last movement.
      setTouchHold(true);
      window.clearTimeout(touchTimer.current);
      touchTimer.current = window.setTimeout(() => setTouchHold(false), 3000);
    };
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("touchmove", onTouch, { passive: true });
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    read();
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(touchTimer.current);
      window.clearTimeout(idle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, restoreSnap]);

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      const card = cards.current[(i + flavors.length) % flavors.length];
      if (!el || !card) return;
      const r = card.getBoundingClientRect();
      const t = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - (t.left + t.width / 2);
      if (Math.abs(dx) < 1) return;
      if (!reduced) {
        programmatic.current = true;
        el.style.scrollSnapType = "none";
      }
      el.scrollBy({ left: dx, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced],
  );

  const playing = mounted && inView && !hover && !focusHold && !touchHold && !userPaused && !reduced;
  const autoplay = mounted && !reduced;

  const btn =
    "grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-stroke bg-cream-3 text-espresso shadow-sm " +
    "transition-[background-color,border-color,transform] duration-fast hover:border-brass-ink/55 hover:bg-cream active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream-2";

  return (
    <div
      data-track-area="hanukkah_stories"
      // Keyboard focus holds autoplay; a mouse click that focuses the track does not.
      onFocus={(e) => e.target.matches(":focus-visible") && setFocusHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusHold(false);
      }}
    >
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={copy.title}
        tabIndex={0}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}
        onKeyDown={(e) => {
          // Arrow keys follow the visual direction: in RTL, ArrowLeft is "next".
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            goTo(active + (e.key === "ArrowLeft" ? 1 : -1));
          }
        }}
        className="stories-track mx-[calc(50%-50vw)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-4 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-3 md:gap-5">
          <li aria-hidden className="stories-spacer shrink-0" />
          {flavors.map((f, i) => {
            const isActive = i === active;
            return (
              <li
                key={f.id}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                data-active={isActive || undefined}
                aria-roledescription="slide"
                aria-label={copy.position(i + 1, flavors.length)}
                onClick={() => !isActive && goTo(i)}
                className={`story-card w-[var(--story-w)] shrink-0 snap-center snap-always ${isActive ? "" : "cursor-pointer"}`}
              >
                <article className="relative isolate aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#2b2521_0%,#3a322c_45%,#1b1714_100%)] text-cream shadow-lg ring-1 ring-cream/10">
                  <div
                    className="absolute inset-x-0 top-[18%] -z-10 [mask-image:linear-gradient(180deg,transparent_0%,#000_16%,#000_72%,transparent_100%)]"
                  >
                    <CafeImage
                      variant="pastry"
                      src={f.image}
                      alt={f.alt}
                      ratio="aspect-[4/5]"
                      className="!rounded-none"
                      sizes="(min-width: 768px) 320px, 68vw"
                    />
                  </div>

                  {/* Story chrome: progress segments and the account row. */}
                  <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/45 to-transparent px-3 pb-8 pt-3">
                    <div aria-hidden className="flex gap-[3px]" dir="rtl">
                      {flavors.map((_, j) => (
                        <span key={j} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-cream/30">
                          {j < i ? <span className="absolute inset-0 bg-cream" /> : null}
                          {j === i && isActive && autoplay ? (
                            <span
                              key={`fill-${active}`}
                              className="story-fill absolute inset-0 origin-right bg-cream"
                              style={{ animationDuration: `${STORY_MS}ms`, animationPlayState: playing ? "running" : "paused" }}
                              onAnimationEnd={() => goTo(i + 1)}
                            />
                          ) : null}
                          {j === i && isActive && !autoplay ? <span className="absolute inset-0 bg-cream" /> : null}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2" aria-hidden>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[conic-gradient(from_200deg,hsl(var(--brass)),hsl(var(--jachnun-soft)),hsl(var(--brass)))] p-[2px]">
                        <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-cream p-1">
                          <Image src="/images/logo_dark.png" alt="" width={28} height={28} className="h-auto w-full" />
                        </span>
                      </span>
                      <span dir="ltr" className="text-sm font-medium">
                        {copy.handle}
                      </span>
                      <span className="text-xs text-cream/75">· {copy.badge}</span>
                    </div>
                  </div>

                  {/* Reel-style side actions: decoration only. */}
                  <div aria-hidden className="absolute bottom-24 end-3 flex flex-col items-center gap-4 text-cream/90">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" strokeLinejoin="round" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 12a8 8 0 1 1-3.2-6.4A8 8 0 0 1 20 12zM20 20l-2.3-3.3" strokeLinecap="round" />
                    </svg>
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M21 3 3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-4 pb-5 pt-16">
                    <p className="text-xs tabular-nums text-cream/75">{copy.position(i + 1, flavors.length)}</p>
                    <h3 className="type-sub mt-1 text-xl md:text-2xl">{f.name}</h3>
                    <p className="mt-2 inline-flex items-baseline gap-1 rounded-pill bg-cream px-3 py-1 text-espresso">
                      <span className="type-sub text-lg tabular-nums">₪{f.price}</span>
                      <span className="text-xs text-espresso-soft">{copy.each}</span>
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
          <li aria-hidden className="stories-spacer shrink-0" />
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button type="button" className={btn} onClick={() => goTo(active - 1)} aria-label={copy.prev}>
          <IconArrow className="h-5 w-5 rotate-180" />
        </button>
        {autoplay ? (
          <button
            type="button"
            className={btn}
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? copy.play : copy.pause}
            aria-pressed={userPaused}
          >
            {userPaused ? (
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
                <path d="M7 5.5v13l12-6.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor">
                <rect x="6.5" y="5" width="4" height="14" rx="1" />
                <rect x="13.5" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        ) : null}
        <button type="button" className={btn} onClick={() => goTo(active + 1)} aria-label={copy.next}>
          <IconArrow className="h-5 w-5" />
        </button>
        <p className="sr-only" aria-live={playing ? "off" : "polite"}>
          {`${flavors[active].name}, ₪${flavors[active].price}. ${copy.position(active + 1, flavors.length)}`}
        </p>
      </div>
    </div>
  );
}
