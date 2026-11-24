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
  { key: "home", priority: 1, images: ["/images/barista_shared.jpg", "/images/coffee-duo_shared.jpg", "/images/storefront_shared.jpg", "/images/croissant-macro_shared.jpg", "/images/burekas-eggs_shared.jpg", "/images/jachnun-spread_shared.jpg", "/images/yard_shared.jpg", "/images/courtyard-tall_shared.jpg", "/images/portafilter_shared.jpg", "/images/barista-work_about.jpg", "/images/bread-bags_about.jpg"] },
  { key: "menu", priority: 0.9, images: ["/images/burekas-golden_shared.jpg", "/images/sandwich-seeded_shared.jpg", "/images/cinnamon-rolls_shared.jpg", "/images/cheesecake-basque_shared.jpg", "/images/salad-box_shared.jpg", "/images/pastry-berries_shared.jpg", "/images/juice-orange_shared.jpg", "/images/iced-drinks_shared.jpg", "/images/matcha-iced_shared.jpg", "/images/coffee-shelf_shared.jpg"] },
  { key: "jachnun", priority: 0.9, images: ["/images/jachnun-spread_shared.jpg", "/images/jachnun-plate_jachnun.jpg", "/images/jachnun-closeup_shared.jpg", "/images/jachnun-tray_shared.jpg", "/images/burekas-golden_shared.jpg"] },
  { key: "catering", priority: 0.8, images: ["/images/burekas-table_shared.jpg", "/images/sandwich-box_catering.jpg", "/images/sweet-box_catering.jpg", "/images/burekas-dish_catering.jpg", "/images/burekas-dips_catering.jpg", "/images/sandwich-close_catering.jpg", "/images/cinnamon-rolls_shared.jpg"] },
  { key: "offers", priority: 0.8, images: [] },
  { key: "hanukkah", priority: 0.8, images: ["/images/sufganiyah-dulce-de-leche_hanukkah.jpg", "/images/sufganiyah-strawberry-jam_hanukkah.jpg", "/images/sufganiyah-blueberry-cream_hanukkah.jpg", "/images/sufganiyah-lemon-lime-mascarpone_hanukkah.jpg", "/images/sufganiyah-espresso-chocolate_hanukkah.jpg", "/images/sufganiyah-chai-masala_hanukkah.jpg", "/images/sufganiyah-pecan-caramel_hanukkah.jpg", "/images/sufganiyah-marshmallow-popping-candy_hanukkah.jpg", "/images/sufganiyah-pretzel_hanukkah.jpg", "/images/sufganiyah-cookie-cream_hanukkah.jpg", "/images/sufganiyah-millefeuille_hanukkah.jpg", "/images/sufganiyah-crunch_hanukkah.jpg", "/images/sufganiyah-raspberry_hanukkah.jpg", "/images/sufganiyah-saint-honore_hanukkah.jpg", "/images/sufganiyah-peanut-butter_hanukkah.jpg", "/images/sufganiyot-tea-table_hanukkah.jpg", "/images/jam-sufganiyot-pyramid_hanukkah.jpg", "/images/raspberry-sufganiyah-closeup_hanukkah.jpg", "/images/sufganiyot-garnish_hanukkah.jpg", "/images/marshmallow-sufganiyah-stand_hanukkah.jpg", "/images/sufganiyot-cake-stand_hanukkah.jpg", "/images/millefeuille-sufganiyah_hanukkah.jpg", "/images/sufganiyot-brass-tray_hanukkah.jpg", "/images/sufganiyot-window-plate_hanukkah.jpg", "/images/sufganiyot-spread_hanukkah.jpg", "/images/pecan-sufganiyah_hanukkah.jpg", "/images/sufganiyot-table_hanukkah.jpg", "/images/latte-cinnamon_shared.jpg", "/images/sufganiyah-blueberry-cream-cutout_hanukkah.jpg", "/images/sufganiyah-cookie-cream-cutout_hanukkah.jpg", "/images/sufganiyah-crunch-cutout_hanukkah.jpg", "/images/sufganiyah-espresso-chocolate-cutout_hanukkah.jpg", "/images/sufganiyah-marshmallow-popping-candy-cutout_hanukkah.jpg", "/images/sufganiyah-pecan-caramel-cutout_hanukkah.jpg", "/images/sufganiyah-pretzel-cutout_hanukkah.jpg", "/images/sufganiyah-raspberry-cutout_hanukkah.jpg", "/images/sufganiyah-saint-honore-cutout_hanukkah.jpg", "/images/sufganiyah-strawberry-jam-cutout_hanukkah.jpg"] },
  { key: "club", priority: 0.8, images: ["/images/cup-pastry_coffee-club.jpg"] },
  { key: "about", priority: 0.7, images: ["/images/yard_shared.jpg", "/images/storefront_shared.jpg", "/images/barista_shared.jpg", "/images/courtyard-tall_shared.jpg", "/images/portafilter_shared.jpg", "/images/flat-white_shared.jpg", "/images/coffee-sandwich_shared.jpg", "/images/iced-latte-palms_shared.jpg", "/images/jachnun-closeup_shared.jpg", "/images/jachnun-tray_shared.jpg"] },
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
