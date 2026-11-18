import { business } from "@/content/business";
import { JsonLd } from "./JsonLd";

export type Crumb = { name: string; href: string };

/**
 * Renders BreadcrumbList JSON-LD. The home crumb is added
 * automatically; callers pass only the deeper crumbs. An empty trail (the home
 * page) renders nothing: Google rejects a BreadcrumbList with fewer than two items.
 */
export function BreadcrumbSchema({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;
  const full: Crumb[] = [{ name: "דף הבית", href: "/" }, ...trail];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: full.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.href.startsWith("http") ? c.href : `${business.siteUrl}${c.href}`,
        })),
      }}
    />
  );
}
