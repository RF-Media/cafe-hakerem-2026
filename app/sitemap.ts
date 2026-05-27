import type { MetadataRoute } from "next";
import { business } from "@/content/business";

const routes = ["/", "/menu", "/about", "/jachnun", "/catering", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${business.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
