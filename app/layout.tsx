import type { Metadata, Viewport } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { JsonLd } from "@/components/seo/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { business } from "@/content/business";
import { CREAM_HEX } from "@/lib/theme";
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
  // Derived from the --cream token rather than hardcoded, so the browser
  // chrome can't drift from the page background.
  themeColor: CREAM_HEX,
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
      {/*
        No `overflow-x: hidden` here on purpose: setting it on <body> turns
        the body into a scroll container, which changes what the sticky nav
        and every pinned scene stick to. Horizontal overflow is contained at
        the section level instead.

        This layout deliberately owns no chrome. `app/(site)/layout.tsx`
        renders Nav/Footer/MobileBar for the public pages; the checkout at
        `app/(order)/` renders its own, because a kiosk flow with a sticky
        pay button cannot share the bottom of a phone screen with MobileBar.
      */}
      <body className="font-body bg-cream text-espresso min-h-screen flex flex-col">
        {/*
          Framer Motion writes its `initial` state as an inline style into
          the SSR HTML, so without JS every below-fold section would stay at
          `opacity: 0` — the page would render as a hero and nothing else.
          Each motion wrapper carries a `data-motion` attribute purely so
          this rule can find it and hand the content back. Scoped to that
          attribute rather than `*`, so genuinely hidden UI (hover chips,
          the closed nav sheet) stays hidden.
        */}
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">דלגו לתוכן</a>
        <JsonLd data={globalSchema()} />
        <MotionProvider>{children}</MotionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
