// Variant C — Quiet luxury / minimal.
//
// Design direction: stillness. A single full-bleed hero "photograph"
// with one short caption bottom-start, eyebrow top-end. Sections
// below are narrow prose columns separated by hairline dividers and
// generous vertical space. Almost no chrome — no card borders, no
// shadows, lots of cream.
//
// Signature moment: the hero "photo" has a barely-there Ken-Burns
// zoom (1.0 → 1.04 over ~14s). Section entrances animate opacity
// only (no y-translate), a deliberately calmer reveal than the rest
// of the site. Honors prefers-reduced-motion.

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { VariantPill } from "@/components/design-lab/VariantPill";
import { business } from "@/content/business";
import { menuCategories } from "@/content/menu";
import { homeFAQs } from "@/content/faqs";

function KenBurnsHero() {
  const reduced = useReducedMotion();
  return (
    <div className="relative h-[88vh] min-h-[560px] overflow-hidden bg-espresso">
      <motion.div
        className="absolute inset-0"
        initial={reduced ? { scale: 1 } : { scale: 1 }}
        animate={reduced ? { scale: 1 } : { scale: 1.04 }}
        transition={{ duration: 14, ease: "easeOut" }}
        style={{
          backgroundImage:
            "linear-gradient(135deg, hsl(36 30% 78%) 0%, hsl(24 22% 30%) 55%, hsl(24 22% 14%) 100%)",
        }}
      >
        <span className="hero-grain" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/55 via-transparent to-espresso/30" />

      {/* Top-end eyebrow */}
      <div className="absolute top-8 right-6 md:right-10 lg:right-16 z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-cream/85 font-latin">
          Est. {/* [TODO] */} ’__ · HaCarmel 20
        </span>
      </div>

      {/* Bottom-start caption */}
      <div className="absolute bottom-12 md:bottom-16 right-6 md:right-10 lg:right-16 left-6 md:left-auto md:max-w-2xl z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.05] text-cream">
          קפה הכרם.
        </h1>
        <p className="mt-4 text-base md:text-lg text-cream/85 max-w-md leading-relaxed">
          {business.tagline.he}.
        </p>
      </div>

      <div className="absolute bottom-6 left-6 md:left-10 lg:left-16 z-10">
        <span aria-hidden className="block w-px h-12 bg-cream/40" />
      </div>
    </div>
  );
}

function HairlineSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Hairline() {
  return (
    <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16">
      <hr className="border-0 h-px bg-stroke" />
    </div>
  );
}

export default function QuietVariant() {
  return (
    <>
      <VariantPill label="Quiet" />

      <KenBurnsHero />

      {/* ─── Opening line — single column, narrow ───────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-olive font-latin">
            לאט, בכוונה
          </span>
          <p className="mt-8 text-2xl md:text-3xl font-display leading-[1.4] text-espresso">
            בית קפה אחד, פינה אחת, תפריט קטן שמשתנה לפי העונה. אנחנו לא מתחרים
            על תשומת הלב — אנחנו פשוט פתוחים, כל בוקר, מאז שאנחנו פה.
          </p>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── Three values — vertical, sparse ────────────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <div className="max-w-[760px] mx-auto px-6">
          <ul className="space-y-16">
            {[
              {
                t: "קפה שנטחן במקום",
                b: "תערובת אחת, נבחרת בקפידה, נטחנת לכל כוס. לא משנים את זה כי לא צריך.",
              },
              {
                t: "מאפים של היום",
                b: "אופים בבוקר, מגישים עד שנגמר. אם נגמר — היה טוב להגיע מוקדם מחר.",
              },
              {
                t: "ג׳חנון של שבת",
                b: "הזמנה מראש, איסוף בבוקר שבת. מסורת תימנית, מטבח בוטיקי.",
              },
            ].map((v, i) => (
              <li key={i} className="grid md:grid-cols-[80px_1fr] gap-6 md:gap-12 items-baseline">
                <span className="text-sm font-latin tracking-[0.2em] text-olive">
                  0{i + 1} —
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-display text-espresso leading-tight">
                    {v.t}
                  </h3>
                  <p className="mt-3 text-base md:text-lg leading-relaxed text-espresso-soft max-w-[52ch]">
                    {v.b}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── Menu — minimal list ────────────────────────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="flex items-baseline justify-between gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-espresso">התפריט</h2>
            <a
              href="/menu"
              className="text-sm font-latin tracking-wide text-olive hover:text-espresso transition-colors"
            >
              לתפריט המלא →
            </a>
          </div>
          <ul>
            {menuCategories.map((cat) => (
              <li
                key={cat.id}
                className="grid grid-cols-[1fr_auto] gap-6 py-5 border-b border-stroke/70 last:border-b-0"
              >
                <span className="text-lg md:text-xl font-display text-espresso">
                  {cat.title.he}
                </span>
                <span className="text-sm font-latin tracking-wide text-espresso-soft">
                  {cat.items.length} פריטים
                </span>
              </li>
            ))}
          </ul>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── Jachnun — restrained terracotta line ───────────────── */}
      <HairlineSection className="py-24 md:py-32 bg-jachnun/[0.04]">
        <div className="max-w-[760px] mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.3em] text-jachnun font-latin">
            של שבת
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-display leading-[1.1] text-espresso">
            ג׳חנון.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-espresso-soft max-w-[56ch]">
            מסורת תימנית במטבח של קפה הכרם. הזמנות נסגרות ביום חמישי בשעה
            18:00. איסוף בשבת בבוקר.
          </p>
          <div className="mt-8">
            <Button variant="primary" as="a" href="/jachnun" icon={<span aria-hidden>←</span>}>
              להזמנה
            </Button>
          </div>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── Catering — single line ─────────────────────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <div className="max-w-[760px] mx-auto px-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-espresso">
              מגשי אירוח.
            </h2>
            <p className="mt-3 text-base text-espresso-soft max-w-[44ch]">
              לבוקר, לישיבה, לאירוע. מותאם לקבוצה.
            </p>
          </div>
          <Button variant="ghost" as="a" href="/catering" icon={<span aria-hidden>←</span>}>
            להזמנת מגש
          </Button>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── Factual paragraph — small, low on page ─────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <div className="max-w-[640px] mx-auto px-6">
          <p className="text-sm md:text-base leading-relaxed text-espresso-soft">
            קפה הכרם הוא בית קפה בוטיקי בגני תקווה, ברחוב הכרמל 20. הקפה מציע
            ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג׳חנון של שבת להזמנה
            מראש. הטלפון של קפה הכרם הוא{" "}
            <a href={`tel:${business.phone.tel}`} className="text-olive">
              {business.phone.display}
            </a>
            .
          </p>
        </div>
      </HairlineSection>

      <Hairline />

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <HairlineSection className="py-24 md:py-32">
        <FAQBlock items={homeFAQs} />
      </HairlineSection>
    </>
  );
}
