/**
 * FAQ accordion — native <details>/<summary>, zero JS, fully
 * keyboard-accessible by default. Paired with <FAQSchema> on every
 * page that renders this; the schema component lives in
 * /components/seo/ so the two can be composed independently.
 *
 * The answer text is a plain text node inside a plain container: no split
 * spans, no wrapper motion component. These strings are exactly what AI
 * engines quote, and they stay boring on purpose.
 */
import type { FAQ } from "@/content/faqs";

export type FAQBlockProps = {
  items: FAQ[];
  heading?: string;
  /** Distinguishes multiple blocks on one page — two would otherwise both
   *  claim `id="faq-heading"` and produce duplicate ids. */
  id?: string;
};

export function FAQBlock({ items, heading = "שאלות נפוצות", id = "faq-heading" }: FAQBlockProps) {
  return (
    <section aria-labelledby={id} className="max-w-3xl mx-auto">
      <h2 id={id} className="type-display text-3xl md:text-4xl text-espresso mb-8">
        {heading}
      </h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <details
              className={
                "group rounded-card border border-stroke bg-cream-2 px-5 md:px-6 py-4 " +
                "transition-[background-color,box-shadow,border-color] duration-base ease-out-soft " +
                "hover:border-brass/40 open:bg-cream-3 open:shadow-sm"
              }
            >
              <summary
                className={
                  "flex items-center justify-between gap-4 list-none cursor-pointer " +
                  "min-h-[44px] text-lg md:text-xl font-display font-bold text-espresso " +
                  "[&::-webkit-details-marker]:hidden"
                }
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={
                    "shrink-0 grid place-items-center w-7 h-7 rounded-full " +
                    "border border-brass/40 text-brass text-lg leading-none " +
                    "transition-transform duration-base ease-out-soft group-open:rotate-45"
                  }
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
