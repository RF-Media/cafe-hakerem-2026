// Dev affordance — a fixed pill that labels the current variant
// and lets reviewers jump back to the /design-lab index. Renders
// only inside variant routes; production code never imports it.
import Link from "next/link";

export function VariantPill({ label }: { label: string }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 print:hidden">
      <Link
        href="/design-lab"
        className="inline-flex items-center gap-2 rounded-pill bg-espresso text-cream text-xs uppercase tracking-[0.2em] px-4 py-2 shadow-float hover:bg-olive transition-colors duration-200 cursor-pointer"
        aria-label="חזרה לאינדקס הוריאנטים"
      >
        <span aria-hidden>←</span>
        <span>Variant: {label}</span>
      </Link>
    </div>
  );
}
