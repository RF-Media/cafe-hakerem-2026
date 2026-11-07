import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { IconArrow } from "@/components/ui/icons";
import { container } from "@/components/ui/Section";

export const metadata = {
  title: "העמוד לא נמצא | קפה הכרם",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex-1 bg-espresso-deep text-cream">
      <div className={`${container} grid min-h-[100svh] items-center gap-10 py-16 md:grid-cols-2`}>
        <div>
          <p className="type-index text-brass">404</p>
          <h1 className="mt-4 type-display text-5xl md:text-7xl">הכוס הזאת ריקה.</h1>
          <p className="mt-5 max-w-md type-lede text-lg text-cream/85">
            העמוד שחיפשתם לא נמצא, אבל הקפה של קפה הכרם עדיין חם.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="/" variant="onDark" size="lg" icon={<IconArrow />}>
              לדף הבית
            </Button>
            <Button as="a" href="/menu" variant="onDarkGhost" size="lg">
              לתפריט
            </Button>
          </div>
        </div>
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-card md:block">
          <Image src="/images/takeaway-cup_shared.jpg" alt="כוס קפה ממותגת של קפה הכרם על שולחן בחוץ" fill sizes="50vw" className="object-cover" />
        </div>
      </div>
    </main>
  );
}
