import { business } from "@/content/business";
import { pages, type PageKey } from "@/content/seo";

export const dynamic = "force-static";

/**
 * A route handler rather than `app/sitemap.ts`: Next 14.2's sitemap type drops
 * the `images` field silently, so the image sitemap never reached Google.
 *
 * Privacy stays out: it is `noindex`, and a sitemap listing a page that asks
 * not to be indexed is a conflict Search Console reports as an error.
 */
const indexed: { key: PageKey; priority: number; images: string[] }[] = [
  { key: "home", priority: 1, images: ["/images/barista_shared.jpg", "/images/coffee-duo_shared.jpg", "/images/storefront_shared.jpg"] },
  { key: "menu", priority: 0.9, images: ["/images/burekas-golden_shared.jpg", "/images/sandwich-seeded_shared.jpg", "/images/cinnamon-rolls_shared.jpg", "/images/cheesecake-basque_shared.jpg"] },
  { key: "jachnun", priority: 0.9, images: ["/images/jachnun-spread_shared.jpg", "/images/jachnun-closeup_shared.jpg", "/images/jachnun-tray_shared.jpg"] },
  { key: "catering", priority: 0.8, images: ["/images/burekas-table_shared.jpg", "/images/sandwich-box_catering.jpg", "/images/sweet-box_catering.jpg"] },
  { key: "offers", priority: 0.8, images: [] },
  { key: "club", priority: 0.8, images: ["/images/cup-pastry_coffee-club.jpg"] },
  { key: "about", priority: 0.7, images: ["/images/yard_shared.jpg", "/images/storefront_shared.jpg"] },
  { key: "contact", priority: 0.7, images: ["/images/storefront_shared.jpg"] },
  { key: "map", priority: 0.6, images: ["/images/storefront_shared.jpg"] },
  { key: "accessibility", priority: 0.2, images: [] },
];

export function GET() {
  const lastmod = new Date().toISOString();
  const urls = indexed.map(({ key, priority, images }) => {
    const loc = pages[key].path === "/" ? `${business.siteUrl}/` : `${business.siteUrl}${pages[key].path}`;
    const changefreq = key === "home" || key === "menu" ? "weekly" : "monthly";
    const imageTags = images.map((src) => `<image:image><image:loc>${business.siteUrl}${src}</image:loc></image:image>`).join("");
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${imageTags}</url>`;
  });
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls.join("\n") +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
