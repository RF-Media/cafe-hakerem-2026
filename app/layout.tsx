import type { Metadata, Viewport } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { business } from "@/content/business";
import "./globals.css";

// Single unified family across the site (CLAUDE.md §5). Bound to all
// three CSS variables so existing `font-body`, `font-display`, and
// `font-latin` utilities resolve to the same family — typographic
// hierarchy comes from weight + size, not from family contrast.
const noto = Noto_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const fontVars = `${noto.className}`;
const fontStyle: React.CSSProperties = {
  // assign the same family to every variable the codebase already uses
  ["--font-body" as never]: noto.style.fontFamily,
  ["--font-display" as never]: noto.style.fontFamily,
  ["--font-latin" as never]: noto.style.fontFamily,
};

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "קפה הכרם — בית קפה בוטיקי בגני תקווה",
    template: "%s",
  },
  description:
    "קפה הכרם — בית קפה בוטיקי ואינטימי ברחוב הכרמל 20, גני תקווה. ארוחות בוקר, קפה איכותי, מאפים טריים, מגשי אירוח וג'חנון של שבת להזמנה מראש.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "קפה הכרם",
    url: business.siteUrl,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: business.siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#f1ebdf",
  width: "device-width",
  initialScale: 1,
};

function globalSchema() {
  const opens = business.hours
    .filter((h) => h.open && h.close && !h.open.startsWith("[TODO") && !h.close.startsWith("[TODO"))
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.day],
      opens: h.open,
      closes: h.close,
    }));

  const sameAs = Object.values(business.socials).filter(
    (v): v is string => typeof v === "string" && v.startsWith("http"),
  );

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${business.siteUrl}/#cafe`,
    name: business.name.he,
    alternateName: business.name.en,
    url: business.siteUrl,
    telephone: business.phone.tel,
    priceRange: business.priceRange,
    servesCuisine: business.servesCuisine,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street.he,
      addressLocality: business.address.city.he,
      addressRegion: business.address.neighborhood.he,
      addressCountry: business.address.country.en,
    },
    geo:
      business.geo.latitude && business.geo.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: business.geo.latitude,
            longitude: business.geo.longitude,
          }
        : undefined,
    openingHoursSpecification: opens.length ? opens : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={fontVars}
      style={fontStyle}
    >
      <body className="font-body bg-cream text-espresso min-h-screen flex flex-col">
        <a href="#main" className="skip-link">דלגו לתוכן</a>
        <JsonLd data={globalSchema()} />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileBar />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
