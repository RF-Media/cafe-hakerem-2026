export const dynamic = "force-static";
export const revalidate = 86400;

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Reveal } from "@/components/motion/Reveal";
import { a11yStatement as s } from "@/content/accessibility";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "הצהרת נגישות | קפה הכרם — בית קפה בגני תקווה",
  description:
    "הצהרת הנגישות של אתר קפה הכרם בגני תקווה: אמצעי הנגישות באתר, תפריט הנגישות, ניווט במקלדת, סייגים ופרטי התקשרות לפניות ולבקשות בנושא נגישות באתר.",
  alternates: { canonical: `${business.siteUrl}/accessibility` },
};

const h2 = "type-title text-2xl text-espresso";
const body = "text-espresso-soft leading-relaxed";

export default function AccessibilityPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: s.title, href: "/accessibility" }]} />
      <Breadcrumb items={[{ name: s.title }]} />
      <article className="mx-auto max-w-3xl px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-20 space-y-8">
        <h1 className="type-display text-4xl md:text-6xl text-espresso">{s.title}</h1>
        <p className="text-sm text-espresso-soft">{s.updated}</p>

        <div className="space-y-4">
          {s.intro.map((p) => (
            <p key={p} className={body}>{p}</p>
          ))}
        </div>

        {s.sections.map((sec) => (
          <Reveal key={sec.heading} as="section" className="space-y-3">
            <h2 className={h2}>{sec.heading}</h2>
            {"lead" in sec && <p className={body}>{sec.lead}</p>}
            {"items" in sec && (
              <ul className={`${body} list-disc ps-5 space-y-1.5`}>
                {sec.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {"paragraphs" in sec && sec.paragraphs.map((p) => <p key={p} className={body}>{p}</p>)}
            {"after" in sec && <p className={body}>{sec.after}</p>}
          </Reveal>
        ))}

        <Reveal as="section" className="space-y-3">
          <h2 className={h2}>{s.contact.heading}</h2>
          <p className={body}>{s.contact.lead}</p>
          <ul className={`${body} space-y-1.5`}>
            <li>
              טלפון:{" "}
              <a href={`tel:${business.phone.tel}`} className="text-olive hover:text-espresso">
                {business.phone.display}
              </a>
            </li>
            <li>
              דוא&quot;ל:{" "}
              <a href={`mailto:${business.email.public}`} className="text-olive hover:text-espresso">
                {business.email.public}
              </a>
            </li>
            <li>
              או דרך <Link href="/contact" className="text-olive hover:text-espresso">עמוד צור קשר</Link>
            </li>
          </ul>
          <p className={body}>{s.contact.after}</p>
        </Reveal>
      </article>
    </>
  );
}
