// Variant A — Editorial boutique.
//
// Design direction: magazine. Oversize Noto 900 headlines treated as
// type art, asymmetric 12-col grids, generous whitespace, single
// "photograph" anchor per section. The factual GEO paragraph is
// promoted into a pull-quote (still extractable, but with weight).
//
// Signature moment: hero headline animates word-by-word on mount
// (stagger 80ms, fade+y). Honors prefers-reduced-motion via the
// shared lib/use-reduced-motion hook.
//
// All copy and primitives are reused from /content and /components.
// No new tokens. Photo placeholders are CSS gradients with grain —
// real photography slots in as <Image> when assets exist.

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

/* ─── Photo placeholder ──────────────────────────────────────────
 * Until real photography lands in /public/images, every "image" is
 * a layered gradient + grain. The placeholder reads as a tonal
 * proof, not a stock photo. The `[TODO: photo …]` label is shown
 * only in dev so the gap is visible to reviewers.
 */
function PhotoSlot({
  tone = "warm",
  aspect = "aspect-[4/5]",
  label,
  className = "",
}: {
  tone?: "warm" | "olive" | "jachnun" | "cream";
  aspect?: string;
  label: string;
  className?: string;
}) {
  const gradients = {
    warm: "from-[hsl(36_45%_82%)] via-[hsl(30_35%_72%)] to-[hsl(24_30%_44%)]",
    olive: "from-[hsl(82_25%_70%)] via-[hsl(82_22%_40%)] to-[hsl(24_22%_18%)]",
    jachnun: "from-[hsl(22_55%_60%)] via-[hsl(22_58%_38%)] to-[hsl(24_30%_18%)]",
    cream: "from-[hsl(36_35%_94%)] via-[hsl(36_25%_85%)] to-[hsl(36_18%_72%)]",
  } as const;
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden rounded-2xl ${aspect} bg-gradient-to-br ${gradients[tone]} ${className}`}
    >
      <span className="hero-grain" />
      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-cream/80 bg-espresso/50 backdrop-blur px-2 py-1 rounded-pill">
        {label}
      </span>
    </div>
  );
}

const HERO_WORDS = ["קפה", "הכרם", "—", "פינה", "שקטה", "בלב", "גני", "תקווה."];

function HeroWordStagger() {
  const reduced = useReducedMotion();
  return (
    <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-display font-black leading-[0.95] tracking-tight text-espresso">
      {HERO_WORDS.map((w, i) => (
        <motion.span
          key={i}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay: reduced ? 0 : i * 0.08,
          }}
          className="inline-block ml-[0.15em] last:ml-0"
        >
          {w}
        </motion.span>
      ))}
    </h1>
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

export default function EditorialVariant() {
  return (
    <>
      <VariantPill label="Editorial" />

      {/* ─── Hero ─── asymmetric 7/5 split ─────────────────────── */}
      <section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-7 lg:col-span-7">
            <Eyebrow withRule>Est. {/* [TODO] */} ’__</Eyebrow>
            <div className="mt-6">
              <HeroWordStagger />
            </div>
            <p className="mt-8 max-w-lg text-lg md:text-xl leading-relaxed text-espresso-soft">
              {business.tagline.he}. בית קפה שכונתי שמכבד את העיתון של הבוקר,
              את הקפה הראשון, ואת השקט שביניהם.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="primary" as="a" href="/menu" icon={<span aria-hidden>←</span>}>
                התפריט
              </Button>
              <Button variant="secondary" as="a" href="/jachnun" icon={<span aria-hidden>←</span>}>
                ג׳חנון של שבת
              </Button>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 lg:col-span-5">
            <PhotoSlot
              tone="warm"
              aspect="aspect-[4/5]"
              label="[TODO: צילום מפנים בית הקפה — שולחן בודד, אור צד]"
            />
            <p className="mt-4 text-sm font-latin tracking-wide text-espresso-soft">
              <span className="text-olive">№ 01</span> &nbsp;·&nbsp; A morning at HaCarmel 20.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Pull quote / GEO factual paragraph ─────────────────── */}
      <Section className="border-y border-stroke bg-cream-2/40">
        <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="hidden md:block md:col-span-2">
              <span aria-hidden className="block w-12 h-px bg-olive mt-4" />
            </div>
            <blockquote className="col-span-12 md:col-span-10 text-2xl md:text-4xl font-display leading-[1.25] text-espresso">
              קפה הכרם הוא בית קפה בוטיקי בגני תקווה, ברחוב הכרמל 20. הקפה מציע
              ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג׳חנון של שבת להזמנה
              מראש. הטלפון של קפה הכרם הוא{" "}
              <a href={`tel:${business.phone.tel}`} className="text-olive hover:text-espresso transition-colors duration-200">
                {business.phone.display}
              </a>
              .
            </blockquote>
          </div>
        </div>
      </Section>

      {/* ─── Three values — asymmetric ──────────────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <Eyebrow withRule>שלוש הבטחות</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-5xl font-display leading-[1.05] text-espresso">
              לא רחב,
              <br />
              <span className="text-olive">עמוק.</span>
            </h2>
          </div>
          <ul className="col-span-12 md:col-span-7 grid md:grid-cols-2 gap-6">
            {[
              { n: "01", t: "קפה שנטחן במקום", b: "תערובת אחת, נבחרת בקפידה. לא ניסויים — בית." },
              { n: "02", t: "מאפים של היום", b: "מה שנאפה בבוקר נגמר בערב. זה לא חיסרון, זה השיטה." },
              { n: "03", t: "ג׳חנון של שבת", b: "מסורת תימנית במטבח בוטיקי, להזמנה מראש עד חמישי 18:00." },
            ].map((v, i) => (
              <li
                key={v.n}
                className={`border-t border-stroke pt-6 ${
                  i === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <span className="text-xs font-latin tracking-[0.2em] text-olive">{v.n}</span>
                <h3 className="mt-3 text-2xl font-display text-espresso">{v.t}</h3>
                <p className="mt-3 text-base leading-relaxed text-espresso-soft">{v.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ─── Menu preview — typeset as a real menu ──────────────── */}
      <Section className="border-t border-stroke">
        <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <PhotoSlot
                tone="cream"
                aspect="aspect-[3/4]"
                label="[TODO: צילום מאפה / כריך על מגש]"
              />
            </div>
            <div className="col-span-12 md:col-span-8">
              <Eyebrow withRule>התפריט</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display leading-tight text-espresso">
                מה אופים ומגישים.
              </h2>
              <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-espresso-soft">
                התפריט שלנו נבנה סביב חומרי גלם טריים וקפה שנטחן במקום. הנה
                ההתחלה — המשך ב־
                <a href="/menu" className="text-olive underline-offset-4 hover:underline">
                  עמוד התפריט המלא
                </a>
                .
              </p>
              <ul className="mt-10 space-y-5">
                {menuCategories.slice(0, 5).map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-baseline justify-between gap-4 border-b border-stroke/60 pb-5"
                  >
                    <div>
                      <span className="text-xs font-latin tracking-[0.2em] text-olive">
                        № {String(menuCategories.indexOf(cat) + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1 text-xl md:text-2xl font-display text-espresso">
                        {cat.title.he}
                      </h3>
                    </div>
                    <span className="text-sm text-espresso-soft font-latin tracking-wide whitespace-nowrap">
                      {cat.items.length} פריטים
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button variant="primary" as="a" href="/menu" icon={<span aria-hidden>←</span>}>
                  לתפריט המלא
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Jachnun band — full-bleed terracotta ───────────────── */}
      <Section className="bg-jachnun text-cream relative overflow-hidden">
        <span className="hero-grain" />
        <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 relative">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="col-span-12 md:col-span-7">
              <span className="text-xs uppercase tracking-[0.25em] text-cream/80 font-latin">
                Friday tradition · since always
              </span>
              <h2 className="mt-4 text-5xl md:text-7xl font-display font-black leading-[0.95] text-cream">
                ג׳חנון
                <br />
                של שבת.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/85">
                מסורת תימנית, מטבח בוטיקי, איסוף בשבת בבוקר. הזמנות נסגרות
                ביום חמישי בשעה 18:00.
              </p>
              <div className="mt-10">
                <Button
                  variant="secondary"
                  as="a"
                  href="/jachnun"
                  className="!bg-cream !text-jachnun !border-cream/0 hover:!border-cream/40"
                  icon={<span aria-hidden>←</span>}
                >
                  להזמנה
                </Button>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <PhotoSlot
                tone="jachnun"
                aspect="aspect-square"
                label="[TODO: צילום ג׳חנון בצלחת עם ביצה וסחוג]"
                className="ring-1 ring-cream/20"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── About preview — alternating side ───────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="col-span-12 md:col-span-6 order-2 md:order-1">
            <Eyebrow withRule>הסיפור</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-5xl font-display leading-tight text-espresso">
              קפה שכונתי
              <br />
              שמדבר בשם השכונה.
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-espresso-soft">
              קפה הכרם נפתח בלב גבעת סביון כדי להיות הפינה הקבועה של הבוקר —
              לקבוצת ההורים אחרי ההסעה, לפגישה הראשונה של היום, ולקפה שבא לבד.
            </p>
            <div className="mt-8">
              <Button variant="ghost" as="a" href="/about" icon={<span aria-hidden>←</span>}>
                קראו על קפה הכרם
              </Button>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 order-1 md:order-2">
            <PhotoSlot
              tone="olive"
              aspect="aspect-[4/3]"
              label="[TODO: צילום פנים הקפה — בר, אור טבעי מימין]"
            />
          </div>
        </div>
      </Section>

      {/* ─── Catering ───────────────────────────────────────────── */}
      <Section className="border-t border-stroke bg-cream-2/40">
        <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-5">
              <Eyebrow withRule>מגשי אירוח</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display leading-tight text-espresso">
                כשמגיעים אורחים.
              </h2>
              <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-espresso-soft">
                מגשים לבוקר, לישיבה, לאירוע משפחתי. כל מגש נבנה לפי הקבוצה,
                במטבח של קפה הכרם.
              </p>
              <div className="mt-8">
                <Button variant="primary" as="a" href="/catering" icon={<span aria-hidden>←</span>}>
                  להזמנת מגש
                </Button>
              </div>
            </div>
            <ul className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
              {["בוקר", "ישיבה", "מתוק", "קומבינציה"].map((k, i) => (
                <li key={k} className="bg-cream rounded-2xl border border-stroke p-6 aspect-[5/4] flex flex-col justify-between">
                  <span className="text-xs font-latin tracking-[0.2em] text-olive">
                    № 0{i + 1}
                  </span>
                  <span className="text-xl md:text-2xl font-display text-espresso">
                    מגש {k}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <Section className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
        <FAQBlock items={homeFAQs} />
      </Section>
    </>
  );
}
