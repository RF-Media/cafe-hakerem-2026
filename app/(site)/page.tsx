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

      {/* 3 — Menu preview */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <SectionHeading
            eyebrow="התפריט"
            title="מה אופים ומגישים היום"
            description="קפה, ארוחות בוקר, כריכים, סלטים ומאפים — תפריט שנבנה סביב חומרי גלם טריים."
            action={<Button as="a" href="/menu" variant="secondary">לתפריט המלא</Button>}
          />
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

      {/* 5 — Catering promo */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16">
          <SectionHeading
            eyebrow="מגשי אירוח"
            title="מארחים אצלכם? אנחנו מטפלים בכיבוד."
            description="מגשי בוקר, מגשי כריכים ומגשי מתוקים לישיבות עבודה, אירועים משפחתיים וברית."
            action={<Button as="a" href="/catering" variant="primary">לפנייה</Button>}
          />
        </div>
      </section>

      {/* 6 — About preview */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="mx-auto max-w-container px-6 md:px-10 lg:px-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow withRule>Our story</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-display leading-tight text-espresso">
              הסיפור של קפה הכרם
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-espresso-soft">
              [TODO: 1 פסקה קצרה — איך הקפה התחיל, מי הבעלים, מה ייחודי. ראה /content/about.ts.]
            </p>
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
