import Image from "next/image";
import { Placeholder, type PlaceholderVariant } from "./placeholders";

/**
 * The single image slot on the site — one swap point for the whole gallery.
 *
 * With a `src`, it renders `next/image` with the quality and loading rules
 * from CLAUDE.md §8. Without one, it renders the matching placeholder
 * illustration. Dropping real photography in later is a one-line change per
 * call site: add `src`, keep the `alt` that's already written.
 *
 * The placeholder branch is `aria-hidden` and carries no `alt` — describing
 * art that isn't the real subject would be worse than silence for a screen
 * reader.
 */

export type CafeImageProps = {
  variant: PlaceholderVariant;
  /** Hebrew alt text. Required even before the photo exists, so the swap
   *  never ships an unlabelled image. */
  alt: string;
  src?: string;
  /** Above the fold: `priority` + higher quality. */
  priority?: boolean;
  className?: string;
  /** Tailwind aspect class, e.g. `aspect-[4/5]`. */
  ratio?: string;
  sizes?: string;
  /** Ink colour for the placeholder line art. */
  tone?: "olive" | "espresso" | "jachnun" | "brass" | "cream";
};

const toneClasses: Record<NonNullable<CafeImageProps["tone"]>, string> = {
  olive: "text-olive/45",
  espresso: "text-espresso/35",
  jachnun: "text-jachnun/45",
  brass: "text-brass-ink/55",
  cream: "text-cream/45",
};

export function CafeImage({
  variant,
  alt,
  src,
  priority = false,
  className = "",
  ratio = "aspect-[4/3]",
  sizes = "(max-width: 768px) 100vw, 50vw",
  tone = "olive",
}: CafeImageProps) {
  const frame = `relative overflow-hidden rounded-card ${ratio} ${className}`;

  if (src) {
    return (
      <div className={frame}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={priority ? 85 : 75}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${frame} bg-cream-2 border border-stroke`} aria-hidden>
      <div className="hero-grain" />
      <div className={`absolute inset-0 grid place-items-center p-[14%] ${toneClasses[tone]}`}>
        <Placeholder variant={variant} />
      </div>
    </div>
  );
}
