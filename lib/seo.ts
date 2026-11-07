import type { Metadata } from "next";
import { business } from "@/content/business";
import { pages, type PageKey } from "@/content/seo";

/**
 * Per-route metadata. The canonical is set here for every page: the root layout
 * used to set one site-wide, which told Google that every page on the site was
 * a duplicate of the home page.
 */
export function pageMetadata(key: PageKey, extra?: Partial<Metadata>): Metadata {
  const page = pages[key];
  const url = page.path === "/" ? business.siteUrl : `${business.siteUrl}${page.path}`;
  const image = { url: page.image, width: 1200, height: 630, alt: page.imageAlt };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName: business.name.he,
      url,
      title: page.title,
      description: page.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.image],
    },
    ...extra,
  };
}
