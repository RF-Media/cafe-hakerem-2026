/**
 * CookieStream configuration. The site owns one object of this type (see examples/),
 * so the copy lives with the site's content and this folder stays identical across sites.
 */

export type CookieChoice = { analytics: boolean; marketing: boolean };

export type CookieStreamPosition = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

export type CookieStreamConfig = {
  /** Raise it to ask everyone again, for example after adding a tracking tool. */
  version: number;
  position: CookieStreamPosition;
  dir: 'rtl' | 'ltr';
  privacyHref: string;
  /** Path prefixes that never show the banner: kiosk screens, pages framed in a preview. */
  hiddenOn?: string[];
  /** POST each decision here (optional/records). Leave out when there is no backend. */
  recordEndpoint?: string;
  /** Empty string switches that tool off. With gtmId set, GA4 is expected to come from the container. */
  ids: { gtmId: string; ga4Id: string; metaPixelId: string };
  /** Use the site's own button classes. Without them the card styles its buttons from the --cs-* variables. */
  classes?: { accept?: string; outline?: string; quiet?: string };
  texts: {
    title: string;
    body: string;
    privacyLabel: string;
    newTab: string;
    accept: string;
    necessaryOnly: string;
    settingsLink: string;
    settingsTitle: string;
    save: string;
    acceptAll: string;
    back: string;
    alwaysOn: string;
  };
  categories: {
    necessary: { label: string; description: string };
    analytics: { label: string; description: string };
    /** Set enabled to false when the site has no marketing tool, so visitors aren't asked about one. */
    marketing: { enabled: boolean; label: string; description: string };
  };
};
