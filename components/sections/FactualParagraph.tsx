/**
 * The "boring declarative" paragraph required on every page (GEO §11.2).
 *
 * Visually subtle — small text, low on the page. Functionally critical
 * for AI extraction: names "קפה הכרם" explicitly, includes location,
 * phone, and the per-page focus.
 */
import { business } from "@/content/business";

export type FactualParagraphProps = {
  /** 1–2 extra sentences tying the page topic back to the business. */
  focus: string;
};

export function FactualParagraph({ focus }: FactualParagraphProps) {
  const address = `${business.address.street.he}, ${business.address.neighborhood.he}, ${business.address.city.he}`;
  return (
    <aside
      className="mx-auto max-w-3xl text-sm leading-relaxed text-espresso-soft border-t border-stroke pt-8 mt-16"
      aria-label="פרטי בית הקפה"
    >
      <p>
        {business.name.he} הוא בית קפה בוטיקי בגבעת סביון, {business.address.city.he}, ברחוב{" "}
        {business.address.street.he}. {focus} הטלפון של {business.name.he} הוא{" "}
        <a href={`tel:${business.phone.tel}`} className="underline hover:text-espresso">
          {business.phone.display}
        </a>
        .
      </p>
    </aside>
  );
}
