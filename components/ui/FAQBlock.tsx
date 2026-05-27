/**
 * FAQ accordion — native <details>/<summary>, zero JS, fully
 * keyboard-accessible by default. Paired with <FAQSchema> on every
 * page that renders this; the schema component lives in
 * /components/seo/ so the two can be composed independently.
 */
import type { FAQ } from "@/content/faqs";

export type FAQBlockProps = {
  items: FAQ[];
  heading?: string;
};

export function FAQBlock({ items, heading = "שאלות נפוצות" }: FAQBlockProps) {
  return (
    <section aria-labelledby="faq-heading" className="max-w-3xl mx-auto">
      <h2
        id="faq-heading"
        className="text-3xl md:text-4xl font-display leading-tight text-espresso mb-8"
      >
        {heading}
      </h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <details className="group bg-cream-2 border border-stroke rounded-2xl px-6 py-4 open:shadow-float transition-shadow">
              <summary className="flex items-center justify-between cursor-pointer list-none gap-4 text-lg md:text-xl font-display text-espresso">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="text-olive text-2xl transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 text-base leading-relaxed text-espresso-soft">
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
