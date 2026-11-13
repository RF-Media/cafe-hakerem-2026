import type { MetadataRoute } from "next";
import { business } from "@/content/business";
import { pages, type PageKey } from "@/content/seo";

/** Privacy stays out: it is `noindex`, and a sitemap listing a page that asks
 *  not to be indexed is a conflict Search Console reports as an error. */
const indexed: { key: PageKey; priority: number; images: string[] }[] = [
  { key: "home", priority: 1, images: ["/images/barista_shared.jpg", "/images/coffee-duo_shared.jpg", "/images/storefront_shared.jpg"] },
  { key: "menu", priority: 0.9, images: ["/images/burekas-golden_shared.jpg", "/images/sandwich-seeded_shared.jpg", "/images/cinnamon-rolls_shared.jpg", "/images/cheesecake-basque_shared.jpg"] },
  { key: "jachnun", priority: 0.9, images: ["/images/jachnun-closeup_shared.jpg", "/images/jachnun-tray_shared.jpg"] },
  { key: "catering", priority: 0.8, images: ["/images/burekas-table_shared.jpg", "/images/sandwich-box_catering.jpg", "/images/sweet-box_catering.jpg"] },
  { key: "offers", priority: 0.8, images: ["/images/coffee-duo_shared.jpg"] },
  { key: "club", priority: 0.8, images: ["/images/cup-pastry_coffee-club.jpg"] },
  { key: "about", priority: 0.7, images: ["/images/yard_shared.jpg", "/images/storefront_shared.jpg"] },
  { key: "contact", priority: 0.7, images: ["/images/storefront_shared.jpg"] },
  { key: "map", priority: 0.6, images: ["/images/storefront_shared.jpg"] },
  { key: "accessibility", priority: 0.2, images: [] },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return indexed.map(({ key, priority, images }) => ({
    url: pages[key].path === "/" ? business.siteUrl : `${business.siteUrl}${pages[key].path}`,
    lastModified: now,
    changeFrequency: key === "home" || key === "menu" ? "weekly" : "monthly",
    priority,
    images: images.map((src) => `${business.siteUrl}${src}`),
  }));
}
