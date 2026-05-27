// Variant B — Warm bento + texture.
//
// Design direction: Apple-keynote bento as adapted for a boutique
// Hebrew café. Tiles vary in size; jachnun is the largest tile and
// uses the terracotta as a corner accent rather than a full band.
// Subtle grain per tile keeps the "warm clay" feeling.
//
// Signature moment: one tile in the menu bento is a slow horizontal
// marquee of category names. Under prefers-reduced-motion it falls
// back to a static list. Hover on any tile lifts it (scale 1.02 +
// shadow-float) and reveals a small chip (price-band or status).

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { VariantPill } from "@/components/design-lab/VariantPill";
import { business } from "@/content/business";
import { menuCategories } from "@/content/menu";
import { homeFAQs } from "@/content/faqs";

function Tile({
  children,
  className = "",
  tone = "cream",
  hoverable = true,
  textured = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "cream" | "cream-2" | "espresso" | "jachnun" | "olive";
  hoverable?: boolean;
  textured?: boolean;
}) {
  const tones = {
    cream: "bg-cream text-espresso",
    "cream-2": "bg-cream-2 text-espresso",
    espresso: "bg-espresso text-cream",
    jachnun: "bg-jachnun text-cream",
    olive: "bg-olive text-cream",
  };
  return (
    <div
      className={`relative overflow-hidden rounded-[1.5rem] border border-stroke/60 p-6 md:p-8 ${
        tones[tone]
      } ${
        hoverable
          ? "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-float cursor-pointer"
          : ""
      } ${className}`}
    >
      {textured ? <span className="hero-grain" /> : null}
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function MarqueeRow() {
  const reduced = useReducedMotion();
  const items = [...menuCategories, ...menuCategories]; // duplicate for seamless loop
  if (reduced) {
    return (
      <ul className="flex flex-wrap gap-3 text-sm text-cream/80">
        {menuCategories.map((c) => (
          <li key={c.id} className="px-3 py-1 rounded-pill border border-cream/20">
            {c.title.he}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-hidden -mx-6 md:-mx-8 mask-fade">
      <motion.ul
        className="flex gap-3 whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {items.map((c, i) => (
          <li
            key={`${c.id}-${i}`}
            className="px-4 py-1.5 rounded-pill border border-cream/20 text-sm text-cream/85"
          >
            {c.title.he}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function BentoVariant() {
  return (
    <>
      <VariantPill label="Bento" />
      <style jsx global>{`
        .mask-fade {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
        }
      `}</style>

      {/* ─── Hero bento ─────────────────────────────────────────── */}
      <section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-16 pb-16">
        <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
          {/* Headline tile */}
          <Tile
            tone="cream-2"
            hoverable={false}
            className="col-span-6 md:col-span-4 md:row-span-2 flex flex-col justify-between"
          >
            <Eyebrow withRule>בית קפה בגני תקווה</Eyebrow>
            <div>
              <h1 className="mt-6 text-5xl md:text-7xl font-display font-black leading-[1] text-espresso">
                בוקר טוב,
                <br />
                <span className="text-olive">הכרם.</span>
              </h1>
              <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-espresso-soft">
                בית קפה בוטיקי ואינטימי ברחוב הכרמל 20. קפה שנטחן במקום, מאפים
                של היום, ג׳חנון של שבת.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" as="a" href="/menu" icon={<span aria-hidden>←</span>}>
                  התפריט
                </Button>
                <Button variant="ghost" as="a" href="/contact">
                  שעות ומיקום
                </Button>
              </div>
            </div>
          </Tile>

          {/* Address tile */}
          <Tile tone="espresso" className="col-span-3 md:col-span-2 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-cream/70 font-latin">
              Find us
            </span>
            <div>
              <p className="text-2xl md:text-3xl font-display leading-tight">
                {business.address.street.he}
              </p>
              <p className="mt-1 text-sm text-cream/70">{business.address.city.he}</p>
            </div>
          </Tile>

          {/* Phone tile */}
          <Tile tone="cream" className="col-span-3 md:col-span-2 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-olive font-latin">
              Call
            </span>
            <a
              href={`tel:${business.phone.tel}`}
              className="text-2xl md:text-3xl font-display text-espresso hover:text-olive transition-colors"
            >
              {business.phone.display}
            </a>
          </Tile>
        </div>
      </section>

      {/* ─── Menu bento — with marquee ──────────────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
          <div className="col-span-6 md:col-span-2 flex flex-col justify-between">
            <Eyebrow withRule>התפריט</Eyebrow>
            <div>
              <h2 className="mt-4 text-3xl md:text-4xl font-display leading-tight text-espresso">
                מה אופים השבוע.
              </h2>
              <div className="mt-6">
                <Button variant="secondary" as="a" href="/menu" icon={<span aria-hidden>←</span>}>
                  לתפריט המלא
                </Button>
              </div>
            </div>
          </div>

          {/* Marquee tile — signature moment */}
          <Tile
            tone="espresso"
            className="col-span-6 md:col-span-4 flex flex-col justify-between gap-6"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-cream/60 font-latin">
              Always rolling
            </span>
            <MarqueeRow />
            <p className="text-sm text-cream/60 font-latin">
              7 קטגוריות · {menuCategories.reduce((n, c) => n + c.items.length, 0)} פריטים
            </p>
          </Tile>

          {/* Small category tiles with hover reveal */}
          {menuCategories.slice(0, 4).map((cat, i) => (
            <Tile
              key={cat.id}
              tone={i % 2 === 0 ? "cream-2" : "cream"}
              className="col-span-3 md:col-span-3 lg:col-span-3 group/cat"
            >
              <div className="flex h-full items-end justify-between gap-3">
                <div>
                  <span className="text-xs font-latin tracking-[0.2em] text-olive">
                    № 0{i + 1}
                  </span>
                  <h3 className="mt-2 text-xl md:text-2xl font-display text-espresso">
                    {cat.title.he}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="opacity-0 group-hover/cat:opacity-100 translate-x-2 group-hover/cat:translate-x-0 transition-all duration-200 px-3 py-1 rounded-pill bg-olive text-cream text-xs font-latin tracking-wide"
                >
                  {cat.items.length} items →
                </span>
              </div>
            </Tile>
          ))}
        </div>
      </Section>

      {/* ─── Jachnun + Catering bento ───────────────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
          {/* Jachnun — dominant tile */}
          <Tile
            tone="jachnun"
            className="col-span-6 md:col-span-4 md:row-span-2 flex flex-col justify-between min-h-[420px] md:min-h-[480px]"
          >
            {/* Corner accent — a cream wedge instead of a full band */}
            <span
              aria-hidden
              className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-cream/15 blur-2xl"
            />
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-cream/80 font-latin">
                Shabbat
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-cream/70 font-latin border border-cream/30 rounded-pill px-3 py-1">
                Order by Thu 18:00
              </span>
            </div>
            <div>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.95]">
                ג׳חנון
              </h2>
              <p className="mt-4 max-w-md text-base md:text-lg leading-relaxed text-cream/85">
                מסורת תימנית במטבח של קפה הכרם. הזמנה מראש, איסוף בשבת בבוקר.
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  as="a"
                  href="/jachnun"
                  className="!bg-cream !text-jachnun !border-cream/0"
                  icon={<span aria-hidden>←</span>}
                >
                  להזמנה
                </Button>
              </div>
            </div>
          </Tile>

          {/* Catering — secondary block */}
          <Tile tone="olive" className="col-span-6 md:col-span-2 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-cream/70 font-latin">
              Catering
            </span>
            <div>
              <h3 className="text-2xl md:text-3xl font-display leading-tight">מגשי אירוח</h3>
              <p className="mt-2 text-sm text-cream/80">לבוקר, לישיבה, לאירוע.</p>
            </div>
            <a href="/catering" className="text-sm font-latin underline underline-offset-4 hover:text-cream">
              להזמנת מגש →
            </a>
          </Tile>

          <Tile tone="cream-2" className="col-span-3 md:col-span-1 flex flex-col justify-between">
            <span className="text-xs font-latin tracking-[0.2em] text-olive">№ 01</span>
            <span className="text-base md:text-lg font-display text-espresso">בוקר</span>
          </Tile>
          <Tile tone="cream" className="col-span-3 md:col-span-1 flex flex-col justify-between">
            <span className="text-xs font-latin tracking-[0.2em] text-olive">№ 02</span>
            <span className="text-base md:text-lg font-display text-espresso">ישיבה</span>
          </Tile>
        </div>
      </Section>

      {/* ─── About + factual paragraph + Instagram bento ────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
          <Tile tone="cream-2" hoverable={false} className="col-span-6 md:col-span-3 md:row-span-2">
            <Eyebrow withRule>הסיפור</Eyebrow>
            <h2 className="mt-4 text-3xl md:text-4xl font-display leading-tight text-espresso">
              בית קפה
              <br />
              של השכונה.
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-espresso-soft">
              קפה הכרם נמצא ברחוב הכרמל 20, גבעת סביון, גני תקווה. בית קפה
              שכונתי שמגיש קפה שנטחן במקום, ארוחות בוקר, מאפים, ומגשי אירוח.
              הטלפון של קפה הכרם הוא{" "}
              <a href={`tel:${business.phone.tel}`} className="text-olive">
                {business.phone.display}
              </a>
              .
            </p>
            <div className="mt-6">
              <Button variant="ghost" as="a" href="/about" icon={<span aria-hidden>←</span>}>
                קראו עוד
              </Button>
            </div>
          </Tile>

          {/* Instagram tiles — gradient placeholders, will be Image when assets exist */}
          {["warm", "olive", "cream", "jachnun"].map((tone, i) => (
            <div
              key={i}
              className="col-span-3 md:col-span-1 lg:col-span-1 relative overflow-hidden rounded-[1.5rem] border border-stroke/60 aspect-square bg-gradient-to-br transition-transform duration-200 hover:-translate-y-1 hover:shadow-float cursor-pointer"
              style={{
                backgroundImage:
                  tone === "warm"
                    ? "linear-gradient(135deg, hsl(36 45% 82%), hsl(24 30% 44%))"
                    : tone === "olive"
                    ? "linear-gradient(135deg, hsl(82 25% 65%), hsl(82 22% 28%))"
                    : tone === "cream"
                    ? "linear-gradient(135deg, hsl(36 35% 94%), hsl(36 18% 72%))"
                    : "linear-gradient(135deg, hsl(22 55% 60%), hsl(22 58% 38%))",
              }}
            >
              <span className="hero-grain" />
              <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.2em] text-cream/85 bg-espresso/40 backdrop-blur rounded-pill px-2 py-0.5">
                IG / 0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <FAQBlock items={homeFAQs} />
      </Section>
    </>
  );
}
