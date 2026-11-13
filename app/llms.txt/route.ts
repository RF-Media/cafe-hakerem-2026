/**
 * /llms.txt: a plain-text fact sheet for AI engines, built from the same content
 * files as the site so it can't drift from it.
 */
import { business, clubJoinUrl } from "@/content/business";
import { catering } from "@/content/catering";
import { aboutFAQs, cateringFAQs, clubFAQs, contactFAQs, homeFAQs, jachnunFAQs, mapFAQs, menuFAQs, offersFAQs } from "@/content/faqs";
import { jachnunPackages } from "@/content/jachnun";
import { menuCategories } from "@/content/menu";
import { offers } from "@/content/offers";
import { pages } from "@/content/seo";
import { formatILS } from "@/lib/money";

export const dynamic = "force-static";

const url = (path: string) => (path === "/" ? business.siteUrl : `${business.siteUrl}${path}`);

export function GET() {
  const hours = business.hours
    .map((h) => `- ${h.label.he}: ${h.open && h.close ? `${h.open}-${h.close}` : "סגור"}`)
    .join("\n");
  const menu = menuCategories
    .map(
      (c) =>
        `### ${c.title.he}\n` +
        c.items.map((i) => `- ${i.name}${i.description ? `: ${i.description}` : ""} (${i.price})`).join("\n"),
    )
    .join("\n\n");
  const packages = jachnunPackages.map((p) => `- ${p.title}: ${formatILS(p.totalAgorot)} (${p.units})`).join("\n");
  const trays = catering.options
    .map((o) => `- ${o.title.he}: ${o.serves}${o.fromPrice ? `, ${o.fromPrice}` : ""}`)
    .join("\n");

  // Each answer once: the home list repeats a few facts on purpose for readers.
  const seen = new Set<string>();
  const faqs = [...homeFAQs, ...menuFAQs, ...jachnunFAQs, ...cateringFAQs, ...offersFAQs, ...clubFAQs, ...aboutFAQs, ...contactFAQs, ...mapFAQs]
    .filter((f) => (seen.has(f.q) ? false : (seen.add(f.q), true)))
    .map((f) => `Q: ${f.q}\nA: ${f.a}`)
    .join("\n\n");

  const body = `# ${business.name.he} (${business.name.en})

> ${business.tagline.he}. ${business.address.street.he}, ${business.address.neighborhood.he}, ${business.address.city.he}.

## Facts
- Name: ${business.name.he} / ${business.name.en}
- Address: ${business.address.street.he}, ${business.address.neighborhood.he}, ${business.address.city.he} (${business.address.street.en}, ${business.address.neighborhood.en}, ${business.address.city.en}, Israel)
- Phone: ${business.phone.display}
- Instagram: ${business.socials.instagram}
- Kitchen: dairy, no meat; kosher ingredients, no kashrut certificate because the café opens on Shabbat
- Jachnun: pre-order on the site until Friday 16:00; a rep calls to confirm and take payment, pick up on Saturday 08:00-15:00
- Loyalty club: free, runs on CoffeeStream, ${business.coffeestream.punchesRequired} punches earn ${business.coffeestream.reward.he}: ${clubJoinUrl("llms")}
- Offers: happy hour for club members, 14:00-19:00 daily — 50% off a second coffee, 10% off the whole menu, a glass of wine at ₪30: ${url("/offers")}

## Opening hours (Asia/Jerusalem)
${hours}

## Pages
${Object.values(pages)
  .map((p) => `- [${p.title}](${url(p.path)}): ${p.description}`)
  .join("\n")}

## Jachnun packages
${packages}

## Catering trays
${trays}

## Menu
${menu}

## Questions and answers
${faqs}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
