export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { business } from "@/content/business";
import { homeFAQs } from "@/content/faqs";
import { instagram, instagramSection } from "@/content/instagram";
import { menuCategories } from "@/content/menu";

export const metadata: Metadata = {
  title: "קפה הכרם — בית קפה בוטיקי בגני תקווה",
  description:
    "קפה הכרם — בית קפה בוטיקי ברחוב הכרמל 20, גני תקווה. ארוחות בוקר, קפה איכותי, מאפים טריים, מגשי אירוח וג'חנון של שבת להזמנה מראש.",
};

export default function HomePage() {
  return (
    <>
      <BreadcrumbSchema trail={[]} />

      {/* 1 — Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-grain" aria-hidden />
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-20 md:pb-28 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-6">
            <Eyebrow withRule>Boutique neighborhood café</Eyebrow>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[1.05] tracking-tight text-espresso">
              קפה שכונתי בלב גני תקווה
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-espresso-soft max-w-xl">
              {business.tagline.he}. ארוחות בוקר, קפה טוב, ומאפים טריים — ובסוף השבוע, ג'חנון להזמנה.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="/menu" variant="primary" size="lg">לתפריט המלא</Button>
              <Button as="a" href="/jachnun" variant="secondary" size="lg">להזמנת ג'חנון</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card padding="lg" className="bg-cream">
              <Eyebrow tone="olive">Visit</Eyebrow>
              <div className="mt-3 space-y-2 text-espresso">
                <div className="font-display text-xl">{business.address.street.he}</div>
                <div className="text-espresso-soft">{business.address.neighborhood.he}, {business.address.city.he}</div>
                <div className="pt-2 border-t border-stroke">
                  <a href={`tel:${business.phone.tel}`} className="text-olive hover:text-espresso transition-colors">
                    {business.phone.display}
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2 — Three values */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <SectionHeading
            eyebrow="למה אנחנו"
            title="שלוש סיבות לבוא לקפה הכרם"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "קפה שנטחן במקום", b: "תערובת [TODO] שמגיעה אלינו טרי, נטחנת במכונה לפני כל כוס." },
              { t: "אופים בעצמנו",   b: "מאפים, בורקסים ועוגות — אפייה [TODO: יומית] במטבח שלנו." },
              { t: "שכונה אמיתית",   b: "אנחנו מכירים את הלקוחות בשם. הקפה הוא חלק מהשכונה, לא רשת." },
            ].map((v) => (
              <Card key={v.t} padding="lg" hoverable>
                <div className="font-display text-xl md:text-2xl text-espresso mb-2">{v.t}</div>
                <p className="text-base leading-relaxed text-espresso-soft">{v.b}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Menu bento */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]">
            {/* Copy column */}
            <div className="col-span-6 md:col-span-2 flex flex-col justify-between p-2">
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

            {/* Category pills tile — static form of the design-lab marquee */}
            <div className="col-span-6 md:col-span-4 bg-espresso text-cream rounded-2xl border border-stroke/60 p-6 md:p-8 flex flex-col justify-between gap-6">
              <span className="text-xs uppercase tracking-[0.25em] text-cream/60 font-latin">
                Always rolling
              </span>
              <ul className="flex flex-wrap gap-3 text-sm text-cream/85">
                {menuCategories.map((c) => (
                  <li
                    key={c.id}
                    className="px-4 py-1.5 rounded-pill border border-cream/20"
                  >
                    {c.title.he}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-cream/60 font-latin">
                {menuCategories.length} קטגוריות · {menuCategories.reduce((n, c) => n + c.items.length, 0)} פריטים
              </p>
            </div>

            {/* Four category tiles with hover-reveal chip */}
            {menuCategories.slice(0, 4).map((cat, i) => (
              <a
                key={cat.id}
                href={`/menu#${cat.id}`}
                className={`col-span-3 md:col-span-3 group/cat rounded-2xl border border-stroke p-6 md:p-8 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-float ${
                  i % 2 === 0 ? "bg-cream-2" : "bg-cream"
                }`}
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
                    className="opacity-0 group-hover/cat:opacity-100 translate-x-2 group-hover/cat:translate-x-0 transition-all duration-200 px-3 py-1 rounded-pill bg-olive text-cream text-xs font-latin tracking-wide whitespace-nowrap"
                  >
                    {cat.items.length} items →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Jachnun promo */}
      <section className="bg-jachnun text-cream py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <Eyebrow tone="jachnun" withRule>Saturday morning</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-display leading-tight">
              ג'חנון של שבת — להזמנה מראש
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-90 max-w-xl">
              קפה הכרם אופה ג'חנון תימני לאיסוף בשבת בבוקר. ההזמנה דרך האתר עד יום חמישי 18:00.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <Button as="a" href="/jachnun" variant="secondary" size="lg">להזמנת ג'חנון</Button>
          </div>
        </div>
      </section>

      {/* 5 — Catering — כשמגיעים אורחים */}
      <section className="bg-cream-2/40 border-y border-stroke py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="col-span-12 md:col-span-5">
              <Eyebrow withRule>מגשי אירוח</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display leading-tight text-espresso">
                כשמגיעים אורחים.
              </h2>
              <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-espresso-soft">
                מגשים לבוקר, לישיבה, לאירוע משפחתי. כל מגש נבנה לפי הקבוצה, במטבח של קפה הכרם.
              </p>
              <div className="mt-8">
                <Button variant="primary" as="a" href="/catering" icon={<span aria-hidden>←</span>}>
                  להזמנת מגש
                </Button>
              </div>
            </div>
            <ul className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4">
              {["בוקר", "ישיבה", "מתוק", "קומבינציה"].map((k, i) => (
                <li
                  key={k}
                  className="bg-cream rounded-2xl border border-stroke p-6 aspect-[5/4] flex flex-col justify-between"
                >
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
      </section>

      {/* 6 — About preview */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow withRule>קצת עלינו</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-display leading-tight text-espresso">
              הסיפור של קפה הכרם
            </h2>
            <div className="mt-4 space-y-4 text-base md:text-lg leading-relaxed text-espresso-soft">
              <p>
                קפה הכרם הוא הרבה יותר מבית קפה – הוא פינה שקטה בלב גני תקווה, מקום מפגש לשכנים, חברים ומשפחות, עם קפה משובח, אוכל מפנק ואווירה ביתית שאין בשום מקום אחר.
              </p>
              <p>
                אנחנו כאן כבר שנים, עם צוות חם ומקצועי, תפריט טרי שמתעדכן ואהבה אמיתית למה שאנחנו עושים.
                בין אם אתם קופצים לקפה של בוקר, לארוחת צהריים קלה, למפגש עם חברים או אפילו לאירוח קטן – תדעו שתמיד יש לכם מקום אצלנו.
              </p>
              <p>
                אנחנו מאמינים בקפה טוב, באוכל איכותי וביחס אישי – וזה מה שתמצאו כאן, בכל ביקור.
              </p>
            </div>
            <div className="mt-6">
              <Link href="/about" className="text-olive hover:text-espresso transition-colors">
                לקריאת הסיפור המלא ←
              </Link>
            </div>
          </div>
          <div className="aspect-[4/5] bg-cream border border-stroke rounded-card flex items-center justify-center text-espresso-soft">
            <span className="text-sm">[TODO: תמונה — פנים בית הקפה]</span>
          </div>
        </div>
      </section>

      {/* 7 — Instagram */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <SectionHeading eyebrow={instagramSection.eyebrow} title={instagramSection.title} description={instagramSection.body} />
          {instagram.length === 0 ? (
            <Card padding="lg" className="text-center text-espresso-soft">
              [TODO: 6 פוסטים מאינסטגרם ב-/content/instagram.ts]
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {instagram.map((p, i) => (
                <a
                  key={i}
                  href={p.href ?? "#"}
                  target={p.href ? "_blank" : undefined}
                  rel={p.href ? "noopener noreferrer" : undefined}
                  className="block aspect-square overflow-hidden rounded-card border border-stroke bg-cream-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8 — FAQ + factual paragraph + breadcrumbs */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <FAQBlock items={homeFAQs} />
          <FAQSchema items={homeFAQs} />
          <FactualParagraph focus="הקפה מציע ארוחות בוקר, כריכים, מאפים, מגשי אירוח וג'חנון של שבת להזמנה מראש." />
        </div>
      </section>
    </>
  );
}
