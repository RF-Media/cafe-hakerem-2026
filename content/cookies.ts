/**
 * The cookie banner (components/cookiestream). Tracking loads from these IDs and
 * nowhere else: never paste a tag snippet into a layout.
 *
 * Raise `version` whenever a tool is added to the site or to the GTM container, or
 * what a tool does changes, so everyone is asked again. Wording changes alone don't
 * need it. Turn `marketing` on only if the container gets Google Ads or Meta tags,
 * and name them in its description and on /privacy.
 */

import type { CookieStreamConfig } from "@/components/cookiestream/config";

export const cookieConsent: CookieStreamConfig = {
  version: 1,
  position: "bottom-center",
  dir: "rtl",
  privacyHref: "/privacy",
  ids: { gtmId: "GTM-56MPGJWD", ga4Id: "G-KHG85VPG1Q", metaPixelId: "" },
  texts: {
    title: "מי לא רוצה עוגיות? 🍪",
    body: "האתר משתמש בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלך ולנתח את התנועה באתר. המשך הגלישה באתר מהווה הסכמה לשימוש בעוגיות בהתאם למדיניות הפרטיות שלנו.",
    privacyLabel: "מדיניות הפרטיות",
    newTab: "(נפתח בכרטיסייה חדשה)",
    accept: "אישור",
    necessaryOnly: "הכרחיות בלבד",
    settingsLink: "הגדרות",
    settingsTitle: "הגדרות עוגיות",
    save: "שמירת הבחירה",
    acceptAll: "אישור הכל",
    back: "חזרה",
    alwaysOn: "תמיד פעיל",
  },
  categories: {
    necessary: {
      label: "הכרחיות",
      description: "שמירת הבחירה בבאנר הזה והעדפות הנגישות שבחרתם. בלעדיהן האתר לא יזכור אותן.",
    },
    analytics: {
      label: "סטטיסטיקה",
      description: "Google Analytics: אילו עמודים נצפים, כדי להבין מה מעניין את המבקרים.",
    },
    marketing: {
      enabled: false,
      label: "שיווק",
      description: "",
    },
  },
};

export const cookieSettingsLabel = "הגדרות עוגיות";
