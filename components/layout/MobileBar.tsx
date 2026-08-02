"use client";

/**
 * Sticky bottom action bar — Call, WhatsApp, Navigate. Mobile only.
 * Every action is an `<a>`, so the bar works with JS disabled.
 *
 * Hides on scroll down and returns on scroll up: it is a shortcut, not a
 * permanent fixture, and 64px of a small viewport is too much to spend on
 * something the user is scrolling past. The matching bottom padding on
 * `<main>` (see app/layout.tsx) is what keeps it off the footer.
 */
import { useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
import { business } from "@/content/business";
import { IconPhone, IconPin, IconWhatsapp } from "@/components/ui/icons";

export function MobileBar() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Stay put near the top, and ignore sub-8px jitter.
    if (v < 120) return setHidden(false);
    if (Math.abs(v - previous) < 8) return;
    setHidden(v > previous);
  });

  const waze = !business.socials.waze.startsWith("[TODO")
    ? business.socials.waze
    : `https://waze.com/ul?ll=${business.geo.latitude},${business.geo.longitude}&navigate=yes`;

  const whatsapp =
    `https://wa.me/${business.whatsapp.number}` +
    `?text=${encodeURIComponent(business.whatsapp.prefilledMessage)}`;

  const item =
    "flex flex-col items-center justify-center gap-1 min-h-[56px] py-2 " +
    "text-xs font-medium transition-colors hover:bg-cream-2 active:bg-cream-2";

  return (
    <m.div
      className={
        "md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur " +
        "border-t border-stroke shadow-md pb-[env(safe-area-inset-bottom)]"
      }
      role="region"
      aria-label="פעולות מהירות"
      animate={{ y: hidden ? "110%" : "0%" }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid grid-cols-3 divide-x divide-stroke">
        <a href={`tel:${business.phone.tel}`} className={`${item} text-espresso`}>
          <IconPhone className="w-5 h-5" />
          חייגו לקפה
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} text-olive`}
        >
          <IconWhatsapp className="w-5 h-5" />
          וואטסאפ
        </a>
        <a
          href={waze}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} text-olive`}
        >
          <IconPin className="w-5 h-5" />
          נווטו אלינו
        </a>
      </div>
    </m.div>
  );
}
