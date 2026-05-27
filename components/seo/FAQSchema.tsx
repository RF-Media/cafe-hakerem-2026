/**
 * FAQPage JSON-LD. Always rendered alongside <FAQBlock> with the
 * same items array — same questions visible to people and to
 * extractors. Skips any Q/A whose answer is still a [TODO] (a
 * placeholder cited by AI engines is worse than no citation).
 */
import type { FAQ } from "@/content/faqs";
import { JsonLd } from "./JsonLd";

export function FAQSchema({ items }: { items: FAQ[] }) {
  const real = items.filter((i) => !i.a.includes("[TODO"));
  if (real.length === 0) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: real.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}
