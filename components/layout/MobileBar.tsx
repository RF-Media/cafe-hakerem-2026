"use client";

/**
 * Sticky bottom action bar: Call, WhatsApp, Navigate, Club. Mobile only.
 * Every action is an `<a>`, so the bar works with JS disabled.
 *
 * Hides on scroll down and returns on scroll up: it is a shortcut, not a
 * permanent fixture, and 64px of a small viewport is too much to spend on
 * something the user is scrolling past. The matching bottom padding on
 * `<main>` (see app/(site)/layout.tsx) is what keeps it off the footer.
 *
 * It also steps aside while anything marked `data-hide-mobile-bar` is on
 * screen: the jachnun order card pins its own summary and primary action to
 * the bottom edge, and two bars stacked there would cover the form.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business } from "@/content/business";
import { IconPhone, IconPin, IconStamp, IconWhatsapp } from "@/components/ui/icons";

export function MobileBar() {
  const [hidden, setHidden] = useState(false);
  const [yielding, setYielding] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setYielding(false);
    const targets = document.querySelectorAll("[data-hide-mobile-bar]");
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setYielding(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        // Stay put near the top, and ignore sub-8px jitter.
        if (y < 120) setHidden(false);
        else if (Math.abs(y - last) >= 8) setHidden(y > last);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const whatsapp =
    `https://wa.me/${business.whatsapp.number}` +
    `?text=${encodeURIComponent(business.whatsapp.prefilledMessage)}`;

  const item =
    "flex flex-col items-center justify-center gap-1 min-h-[56px] py-2 " +
    "text-xs font-medium transition-colors hover:bg-cream-2 active:bg-cream-2";

  return (
    <div
      data-track-area="mobile_bar"
      className={
        "md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream " +
        "border-t border-stroke shadow-md pb-[env(safe-area-inset-bottom)] " +
        "transition-transform duration-[280ms] ease-out-soft " +
        (hidden || yielding ? "translate-y-[110%]" : "translate-y-0")
      }
      role="region"
      aria-label="פעולות מהירות"
    >
      <div className="grid grid-cols-4 divide-x divide-stroke">
        <a href={`tel:${business.phone.tel}`} className={`${item} text-espresso`}>
          <IconPhone className="w-5 h-5" />
          חייגו
        </a>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${item} text-olive`}>
          <IconWhatsapp className="w-5 h-5" />
          וואטסאפ
        </a>
        <a href={business.socials.waze} target="_blank" rel="noopener noreferrer" className={`${item} text-olive`}>
          <IconPin className="w-5 h-5" />
          ניווט
        </a>
        <Link href="/coffee-club" className={`${item} bg-amber text-cs-ink hover:bg-amber active:bg-amber-soft`}>
          <IconStamp className="w-5 h-5" />
          המועדון
        </Link>
      </div>
    </div>
  );
}
