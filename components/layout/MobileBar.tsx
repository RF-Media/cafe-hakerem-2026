import { business } from "@/content/business";

/**
 * Sticky bottom bar — Call + Navigate. Mobile only. Both buttons are
 * `<a>`s so they work without JS.
 */
export function MobileBar() {
  const waze = !business.socials.waze.startsWith("[TODO")
    ? business.socials.waze
    : `https://waze.com/ul?ll=${business.geo.latitude},${business.geo.longitude}&navigate=yes`;

  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-stroke shadow-float"
      role="region"
      aria-label="פעולות מהירות"
    >
      <div className="grid grid-cols-2 divide-x divide-stroke">
        <a
          href={`tel:${business.phone.tel}`}
          className="py-4 text-center text-sm font-medium text-espresso hover:bg-cream-2 transition-colors"
        >
          חייגו לקפה
        </a>
        <a
          href={waze}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 text-center text-sm font-medium text-olive hover:bg-cream-2 transition-colors"
        >
          נווטו אלינו
        </a>
      </div>
    </div>
  );
}
