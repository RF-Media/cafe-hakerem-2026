export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { CafeImage } from "@/components/ui/CafeImage";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { Section, container } from "@/components/ui/Section";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { PlaceholderVariant } from "@/components/ui/placeholders";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { JsonLd } from "@/components/seo/JsonLd";
import { FactualParagraph } from "@/components/sections/FactualParagraph";
import { about } from "@/content/about";
import { homeFAQs } from "@/content/faqs";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "הסיפור שלנו | קפה הכרם - בית קפה בגני תקווה",
  description:
    "הסיפור של קפה הכרם - בית קפה בוטיקי בגבעת סביון, גני תקווה. הכירו את הבעלים, המסורת וההערכה של השכונה שהפכה את המקום לחלק מחייה.",
};

function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "הסיפור של קפה הכרם",
    about: { "@id": `${business.siteUrl}/#cafe` },
  };
}

/**
 * `about.gallery` is empty until real photography arrives. Rather than
 * render nothing — which leaves this page as an unbroken column of text —
 * the grid falls back to placeholder art in these slots and each real photo
 * simply takes the slot's place as it is added.
 */
const gallerySlots: { variant: PlaceholderVariant; alt: string; ratio: string }[] = [
  { variant: "interior", alt: "פנים בית הקפה של קפה הכרם", ratio: "aspect-[4/5]" },
  { variant: "cup",      alt: "כוס קפה שנטחן במקום בקפה הכרם", ratio: "aspect-square" },
  { variant: "pastry",   alt: "מאפים טריים מהמטבח של קפה הכרם", ratio: "aspect-square" },
  { variant: "jachnun",  alt: "ג'חנון של שבת מקפה הכרם", ratio: "aspect-[4/5]" },
];

export default function AboutPage() {
  const gallery = about.gallery.length
    ? about.gallery.map((g, i) => ({
        src: g.src,
        alt: g.alt,
        variant: gallerySlots[i % gallerySlots.length].variant,
        ratio: gallerySlots[i % gallerySlots.length].ratio,
      }))
    : gallerySlots.map((s) => ({ src: undefined, ...s }));

  return (
    <>
      <BreadcrumbSchema trail={[{ name: "עלינו", href: "/about" }]} />
      <JsonLd data={aboutSchema()} />

      <Breadcrumb items={[{ name: "עלינו" }]} />

      <section className="relative flex items-center min-h-[70svh] md:min-h-[78svh]">
        <div className={`${container} w-full`}>
          <div className="hero-fade" style={{ ["--d" as never]: 0 }}>
            <Eyebrow withRule>{about.hero.eyebrow}</Eyebrow>
          </div>
          <h1 className="mt-5 type-display text-[2.75rem] leading-[1.03] md:text-7xl lg:text-8xl text-espresso max-w-4xl">
            <SplitText text={about.hero.title} delay={70} />
          </h1>
          <p
            className="hero-fade mt-6 max-w-prose-he type-lede text-base md:text-xl text-espresso-soft"
            style={{ ["--d" as never]: 360 }}
          >
            {about.hero.lede}
          </p>
        </div>
      </section>

      {/* Story, set against a parallax gallery column. */}
      <section className={`${container} py-10 md:py-16`}>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7 space-y-6">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="text-base md:text-lg leading-relaxed text-espresso-soft max-w-prose-he">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {gallery.map((g, i) => (
              // Alternating parallax speed between the two columns is what
              // makes the grid drift rather than slab past.
              <Parallax key={i} speed={i % 2 === 0 ? 0.16 : -0.1} className={i % 2 === 1 ? "mt-8" : ""}>
                <ImageReveal className="rounded-card" delay={i * 0.06}>
                  <CafeImage
                    variant={g.variant}
                    src={g.src}
                    alt={g.alt}
                    ratio={g.ratio}
                    tone={i % 2 === 0 ? "olive" : "brass"}
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />
                </ImageReveal>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* Authorship block — GEO §11.4 */}
      <Section tone="cream-2">
        <Reveal>
          <Eyebrow withRule>מי עומד מאחורי הקפה</Eyebrow>
        </Reveal>
        {/* One founder is the common case, so the grid tracks the count
            instead of always splitting in two and orphaning a card. */}
        <Stagger
          className={
            "mt-6 grid gap-6 " +
            (about.founders.length > 1 ? "md:grid-cols-2" : "max-w-2xl")
          }
          stagger={0.1}
        >
          {about.founders.map((f, i) => (
            <StaggerItem key={i} variant="tile">
              <Card padding="lg" tone="cream-3" elevation="raised" className="h-full">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-20 md:w-24">
                    <CafeImage
                      variant="founder"
                      src={f.photo}
                      alt={`${f.name} - ${f.role} בקפה הכרם`}
                      ratio="aspect-square"
                      tone="olive"
                      sizes="96px"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="type-sub text-xl md:text-2xl text-espresso">{f.name}</div>
                    <div className="mt-1 text-sm text-olive">{f.role}</div>
                    <p className="mt-3 text-base text-espresso-soft leading-relaxed">
                      {f.bioShort}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-sm text-espresso-soft">
          {business.name.he} פועל ב{business.address.city.he} משנת {about.foundedYear}.
        </p>
      </Section>

      <Section>
        <div className="mx-auto text-center max-w-2xl">
          <Reveal>
            <h2 className="type-title text-3xl md:text-4xl text-espresso">{about.cta.title}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 type-lede text-base md:text-lg text-espresso-soft">
              {about.cta.body}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
              <Link href="/menu" className="text-olive hover:text-espresso transition-colors">לתפריט</Link>
              <Link href="/jachnun" className="text-olive hover:text-espresso transition-colors">ג'חנון של שבת</Link>
              <Link href="/contact" className="text-olive hover:text-espresso transition-colors">פרטי הקפה</Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="cream-2">
        <FAQBlock items={homeFAQs} heading="שאלות נפוצות על הקפה" />
        <FAQSchema items={homeFAQs} />
        <FactualParagraph focus="הקפה מנוהל על ידי הבעלים, ופועל כבית קפה שכונתי המגיש ארוחות בוקר, קפה ומאפים." />
      </Section>
    </>
  );
}
