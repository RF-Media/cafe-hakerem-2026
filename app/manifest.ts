import type { MetadataRoute } from "next";
import { business } from "@/content/business";
import { CREAM_HEX } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name.he,
    short_name: business.name.he,
    description: "בית קפה בוטיקי בגני תקווה - ארוחות בוקר, קפה, מאפים, מגשי אירוח וג'חנון של שבת.",
    start_url: "/",
    display: "browser",
    background_color: CREAM_HEX,
    theme_color: CREAM_HEX,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
