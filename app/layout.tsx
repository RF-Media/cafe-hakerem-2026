import type { Metadata, Viewport } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { JsonLd } from "@/components/seo/JsonLd";
import { AccessibilityWidget } from "@/components/layout/AccessibilityWidget";
import { business } from "@/content/business";
import { CREAM_HEX } from "@/lib/theme";
import { A11Y_BOOT_SCRIPT } from "@/lib/a11y-prefs";
import { MOTION_RUNTIME } from "@/lib/motion-runtime";
import "./globals.css";

// Single unified family across the site (CLAUDE.md §5). Bound to all
// three CSS variables so existing `font-body`, `font-display`, and
// `font-latin` utilities resolve to the same family — typographic
// hierarchy comes from weight + size, not from family contrast.
const noto = Noto_Sans_Hebrew({
  // Only Hebrew is preloaded. Latin still loads when a page needs it, through
  // its unicode-range, but stays out of the critical first requests.
  subsets: ["hebrew"],
  // No `weight`: the variable file covers 300-900 in one download, where the
  // five static weights this listed were five separate files per subset.
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
    default: "קפה הכרם - בית קפה בוטיקי בגני תקווה",
    template: "%s",
  },
  description:
    "קפה הכרם - בית קפה בוטיקי ואינטימי ברחוב הכרמל 20, גני תקווה. ארוחות בוקר, קפה איכותי, מאפים טריים, מגשי אירוח וג'חנון של שבת להזמנה מראש.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "קפה הכרם",
    images: [{ url: "/images/og_home.jpg", width: 1200, height: 630, alt: "קפה הכרם, גני תקווה" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og_home.jpg"] },
  robots: { index: true, follow: true },
  // No `alternates.canonical` here. Set at this level it was inherited by every
  // page, telling search engines the whole site was a duplicate of the home
  // page. Each page sets its own through lib/seo.ts.
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

  const url = business.siteUrl;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: business.name.he,
        alternateName: business.name.en,
        inLanguage: "he",
        publisher: { "@id": `${url}/#cafe` },
      },
      {
        "@type": "CafeOrCoffeeShop",
        "@id": `${url}/#cafe`,
        name: business.name.he,
        alternateName: business.name.en,
        description: business.tagline.he,
        url,
        telephone: business.phone.tel,
        email: business.email.public,
        logo: `${url}/images/logo_dark.png`,
        image: [
          `${url}/images/storefront_shared.jpg`,
          `${url}/images/barista_shared.jpg`,
          `${url}/images/yard_shared.jpg`,
        ],
        priceRange: business.priceRange,
        servesCuisine: business.servesCuisine,
        currenciesAccepted: "ILS",
        hasMenu: `${url}/menu`,
        address: {
          "@type": "PostalAddress",
          streetAddress: business.address.street.he,
          addressLocality: business.address.city.he,
          postalCode: business.address.postalCode,
          addressCountry: business.address.country.en,
        },
        containedInPlace: { "@type": "Place", name: business.address.neighborhood.he },
        areaServed: { "@type": "Place", name: `${business.address.city.he} והסביבה` },
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "ישיבה בחוץ", value: true },
        ],
        geo:
          business.geo.latitude && business.geo.longitude
            ? {
                "@type": "GeoCoordinates",
                latitude: business.geo.latitude,
                longitude: business.geo.longitude,
              }
            : undefined,
        hasMap: `${url}/map`,
        openingHoursSpecification: opens.length ? opens : undefined,
        // Only the profile confirmed against the café's CoffeeStream shop. Map
        // links are not identity claims, and Facebook is still unverified.
        sameAs: [business.socials.instagram],
        hasMemberProgram: {
          "@type": "MemberProgram",
          "@id": `${url}/#club`,
          name: "מועדון הלקוחות של קפה הכרם",
          url: `${url}/coffee-club`,
          description: `כרטיסיית ניקובים דיגיטלית בחינם: ניקוב ראשון במתנה, ו${business.coffeestream.reward.he} בניקוב העשירי.`,
        },
      },
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={fontVars}
      style={fontStyle}
      // The a11y boot script below adds classes to <html> before hydration.
      suppressHydrationWarning
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
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT_SCRIPT }} />
        {/*
          Reveals start hidden in CSS, so without JS every below-fold section
          would stay at `opacity: 0`. This hands the content back. Scoped to
          the reveal attributes rather than `*`, so genuinely hidden UI (hover
          chips, the closed nav sheet) stays hidden.
        */}
        <noscript>
          <style>{`[data-motion],[data-rv],[data-rv-item],[data-rv-word],[data-rv-inner],[data-stamp]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">דלגו לתוכן</a>
        <JsonLd data={globalSchema()} />
        <AccessibilityWidget />
        {children}
        {/* After the content, so everything it observes is already parsed. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_RUNTIME }} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
