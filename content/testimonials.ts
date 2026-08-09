/**
 * Video-testimonial content for the home page's "מגשי אירוח" section —
 * the fixed-panel crossfade accordion in
 * `components/sections/VideoTestimonialAccordion.tsx`.
 *
 * `videoSrc` is optional and left `undefined` until the café supplies real
 * vertical (9:16) event clips. This mirrors `<CafeImage>`'s own `src?`
 * pattern (CLAUDE.md 2026-08-02 decision, placeholder art instead of a
 * literal not-yet-provided marker) rather than the usual "resolve before
 * launch" sentinel: a missing clip is a deferred asset the café will
 * upload later, not a content gap that should block a deploy.
 */

export type CateringTestimonial = {
  id: string;
  eventType: string; // short Hebrew label, e.g. "חצר בית · 15 איש"
  caption: string; // one sentence, shown over the gradient
  posterAlt: string; // required even with no photo — CafeImage's own contract
  posterPhoto?: string; // /public path, optional
  videoSrc?: string; // undefined until real clips exist
  videoAlt?: string; // required alongside videoSrc — describes the motion content
};

export const cateringTestimonials: CateringTestimonial[] = [
  {
    id: "backyard-15",
    eventType: "חצר בית · 15 איש",
    caption: "יום הולדת קטן וחם, עם מגש בוקר וקפה טוב.",
    posterAlt: "שולחן ערוך בחצר בית עם מגש אירוח של קפה הכרם, יום הולדת משפחתי",
  },
  {
    id: "office-meeting",
    eventType: "ישיבת עבודה",
    caption: "מגש כריכים באמצע פגישה שהתארכה.",
    posterAlt: "מגש כריכים של קפה הכרם על שולחן ישיבות במשרד",
  },
  {
    id: "engagement",
    eventType: "אירוסין",
    caption: "מגש מתוק לצד ברכות.",
    posterAlt: "מגש מתוקים של קפה הכרם באירוע אירוסין",
  },
  {
    id: "small-venue-120",
    eventType: "אולם קטן · 120 איש",
    caption: "כשהאירוע גדול, אנחנו מגיעים עם כמה מגשים יחד.",
    posterAlt: "שולחן מגשי אירוח מרובים של קפה הכרם באולם אירועים קטן",
  },
];

export const testimonialSection = {
  eyebrow: "מהאירועים שלנו",
  title: "רגעים מהשטח",
  lede: "קצרצרים מאירועים אמיתיים. לחצו או העבירו עכבר על כרטיס להצצה.",
};
