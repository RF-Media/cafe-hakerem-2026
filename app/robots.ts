import type { MetadataRoute } from "next";
import { business } from "@/content/business";

/**
 * Open to everyone, AI engines included: being cited by them is half the point
 * of this site (§11). /privacy is no longer disallowed: it carries `noindex`,
 * and a crawler blocked here could never read that.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/jachnun/order"] }],
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
