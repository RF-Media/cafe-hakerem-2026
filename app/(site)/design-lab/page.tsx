// /design-lab — index of home-page design variants.
//
// This route is a developer/stakeholder affordance only. It is
// excluded from sitemap.ts and disallowed in robots.ts so it does
// not leak into search results. Three variants render the same home
// content (/content/*.ts) under three different design directions.
// Pick a winner; Stage 2 will promote it and delete this tree.

import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Design Lab — קפה הכרם",
  robots: { index: false, follow: false },
};

const variants = [
  {
    slug: "editorial",
    name: "Editorial boutique",
    pitch:
      "טיפוגרפיה ענקית, רשת א-סימטרית, מרווחים נדיבים. כותרת שמתפרקת מילה־אחר־מילה, צילום בודד בכל סקציה.",
    en: "Magazine-style — oversize headlines, asymmetric 12-col grids, photography as anchor.",
  },
  {
    slug: "bento",
    name: "Warm bento + texture",
    pitch:
      "אריחי בנטו חמים, גודלים משתנים, אריח ג'חנון דומיננטי, מרקיז מתפריט החודש, חשיפה בריחוף.",
    en: "Bento tiles, varied sizes, jachnun as the largest tile, a menu marquee, hover reveals.",
  },
  {
    slug: "quiet",
    name: "Quiet luxury",
    pitch:
      "צילום מלא־רוחב, קו טיפוגרפי אחד למטה, קווי הפרדה דקיקים, זום קן־בורנס איטי, קצב נשימה רגוע.",
    en: "Full-bleed hero, hairline dividers, Ken-Burns zoom, prose column kept narrow.",
  },
] as const;

export default function DesignLabIndex() {
  return (
    <div className="max-w-container mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
      <Eyebrow withRule>Design Lab</Eyebrow>
      <h1 className="mt-4 text-4xl md:text-6xl font-display leading-[1.1] text-espresso">
        שלוש דרכים לחיות
        <br />
        עם קפה הכרם.
      </h1>
      <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-espresso-soft">
        כל וריאנט מציג את אותו עמוד בית — אותו תוכן, אותם פרימיטיבים, אותה
        פלטה. ההבדל הוא הקומפוזיציה, הקצב, והרגע החתום של כל גישה. בחרו אחד —
        Stage 2 יחיל אותו על כל האתר.
      </p>

      <ul className="mt-16 grid gap-6 md:grid-cols-3">
        {variants.map((v, i) => (
          <li key={v.slug}>
            <Link
              href={`/design-lab/${v.slug}`}
              className="group block h-full bg-cream-2 border border-stroke rounded-2xl p-8 transition-shadow duration-200 hover:shadow-float cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-olive">
                  Variant {String.fromCharCode(65 + i)}
                </span>
                <span
                  aria-hidden
                  className="text-olive transition-transform duration-200 group-hover:-translate-x-1"
                >
                  ←
                </span>
              </div>
              <h2 className="mt-6 text-2xl md:text-3xl font-display leading-tight text-espresso">
                {v.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-espresso-soft">
                {v.pitch}
              </p>
              <p className="mt-4 text-sm text-espresso-soft/70 font-latin">
                {v.en}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-16 text-sm text-espresso-soft">
        Excluded from sitemap.xml and disallowed in robots.txt. Delete the
        <code className="px-1.5 py-0.5 mx-1 bg-cream-2 rounded text-espresso">app/(site)/design-lab/</code>
        tree after picking a winner.
      </p>
    </div>
  );
}
