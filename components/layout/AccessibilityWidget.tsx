"use client";

/**
 * Accessibility menu, ported from CoffeeStream's widget: a tab pinned to the
 * physical left edge that opens a non-modal panel of six display toggles.
 * Each toggle sets a class on <html> (see lib/a11y-prefs.ts, globals.css).
 *
 * z-[45] on purpose: above MobileBar and the checkout's sticky bar (z-40),
 * below the Nav header (z-50) so the focus-trapped mobile sheet covers it
 * rather than leaving a control floating over a modal it can't be tabbed to.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionGlobalConfig, m } from "framer-motion";
import clsx from "clsx";
import {
  AArrowUp,
  Accessibility,
  Check,
  Contrast,
  FileText,
  Link2,
  Pause,
  RotateCcw,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { a11yWidget as copy } from "@/content/accessibility";
import { A11Y_DEFAULTS, A11Y_STORAGE_KEY, a11yClasses, type A11yPrefs } from "@/lib/a11y-prefs";
import { sidePanelVariants } from "@/lib/motion";

function loadPrefs(): A11yPrefs {
  try {
    return { ...A11Y_DEFAULTS, ...JSON.parse(window.localStorage.getItem(A11Y_STORAGE_KEY) || "{}") };
  } catch {
    return A11Y_DEFAULTS;
  }
}

function savePrefs(prefs: A11yPrefs) {
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked: the setting still applies for this page view.
  }
}

function applyPrefs(prefs: A11yPrefs) {
  const html = document.documentElement.classList;
  for (const [name, on] of Object.entries(a11yClasses(prefs))) html.toggle(name, on);
  // Framer reads MotionConfig's reducedMotion only when an element mounts,
  // and only for positional keys. This flag is checked as each animation
  // starts, so the toggle also stops reveals already on the page.
  MotionGlobalConfig.skipAnimations = prefs.motion;
}

function Option({
  icon: Icon,
  label,
  hint,
  level,
  pressed,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  /** Stepped options (text size): how many steps above the default, and the current one. */
  level?: { steps: number; current: number };
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={clsx(
        "relative flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-1 rounded-card border-2 px-2 py-2 text-sm font-medium leading-tight transition-colors duration-fast",
        pressed
          ? "border-espresso-deep bg-espresso-deep text-brass"
          : "border-transparent bg-cream-2 text-espresso hover:border-stroke",
      )}
    >
      {/* State is carried by more than the fill: a check mark when on. */}
      {pressed && (
        <span aria-hidden className="absolute end-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brass text-espresso-deep">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
      <Icon size={20} strokeWidth={2.2} aria-hidden />
      {label}
      {hint && (
        <span className={clsx("text-xs font-normal", pressed ? "text-cream" : "text-espresso-soft")}>{hint}</span>
      )}
      {level && (
        <span aria-hidden className="flex gap-1" dir="ltr">
          {Array.from({ length: level.steps }, (_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1 w-4 rounded-pill",
                i < level.current ? "bg-brass" : pressed ? "bg-cream/30" : "bg-stroke",
              )}
            />
          ))}
        </span>
      )}
    </button>
  );
}

export function AccessibilityWidget() {
  const pathname = usePathname();
  const [prefs, setPrefs] = useState<A11yPrefs>(A11Y_DEFAULTS);
  // Read by update() so two taps before a re-render both land.
  const prefsRef = useRef(prefs);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const tabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadPrefs();
    applyPrefs(saved);
    prefsRef.current = saved;
    setPrefs(saved);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) setStatus("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      tabRef.current?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !tabRef.current?.contains(target)) setOpen(false);
    }
    function onFocusIn(e: FocusEvent) {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !tabRef.current?.contains(target)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  function update(next: Partial<A11yPrefs>) {
    const merged = { ...prefsRef.current, ...next };
    prefsRef.current = merged;
    savePrefs(merged);
    applyPrefs(merged);
    setPrefs(merged);
    setStatus("");
  }

  return (
    <div className="print:hidden">
      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={copy.toggle}
        aria-expanded={open}
        aria-controls="a11y-panel"
        className="fixed left-0 top-1/2 z-[45] flex h-12 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-card border border-l-0 border-brass/40 bg-espresso-deep text-brass shadow-md transition-[filter] duration-fast hover:brightness-125"
      >
        <Accessibility size={24} strokeWidth={2.2} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="a11y-panel"
            variants={sidePanelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="pointer-events-none fixed inset-y-0 left-14 z-[45] flex items-center"
          >
            <div
              ref={panelRef}
              id="a11y-panel"
              role="dialog"
              aria-labelledby="a11y-panel-title"
              className="pointer-events-auto max-h-[calc(100svh-2rem)] w-[min(280px,calc(100vw-4.5rem))] overflow-y-auto rounded-card border border-stroke bg-cream-3 p-4 text-espresso shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h2 id="a11y-panel-title" className="type-sub text-base">
                  {copy.title}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    tabRef.current?.focus();
                  }}
                  aria-label={copy.close}
                  className="-me-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-input transition-colors duration-fast hover:bg-cream-2"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Option
                  icon={AArrowUp}
                  label={copy.options.text}
                  hint={copy.textLevels[prefs.text]}
                  level={{ steps: copy.textLevels.length - 1, current: prefs.text }}
                  pressed={prefs.text > 0}
                  onClick={() => update({ text: (prefsRef.current.text + 1) % copy.textLevels.length })}
                />
                <Option icon={Contrast} label={copy.options.contrast} pressed={prefs.contrast} onClick={() => update({ contrast: !prefsRef.current.contrast })} />
                <Option icon={Link2} label={copy.options.links} pressed={prefs.links} onClick={() => update({ links: !prefsRef.current.links })} />
                <Option icon={Pause} label={copy.options.motion} pressed={prefs.motion} onClick={() => update({ motion: !prefsRef.current.motion })} />
                <Option icon={Type} label={copy.options.font} pressed={prefs.font} onClick={() => update({ font: !prefsRef.current.font })} />
                <Option
                  icon={RotateCcw}
                  label={copy.options.reset}
                  onClick={() => {
                    update(A11Y_DEFAULTS);
                    setStatus(copy.resetDone);
                  }}
                />
              </div>

              <p aria-live="polite" className="sr-only">
                {status}
              </p>

              <div className="mt-3 border-t border-stroke pt-2">
                <Link
                  href="/accessibility"
                  className="flex min-h-[44px] w-full items-center gap-2.5 rounded-input px-3 text-sm font-medium text-espresso-soft transition-colors duration-fast hover:bg-cream-2 hover:text-espresso"
                >
                  <FileText size={16} aria-hidden />
                  {copy.statementLink}
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
