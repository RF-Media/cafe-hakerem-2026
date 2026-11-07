import Link from "next/link";
import { container } from "./Section";

export type BreadcrumbItem = { name: string; href?: string };

export function Breadcrumb({
  items,
  tone = "light",
  bare = false,
}: {
  items: BreadcrumbItem[];
  /** `dark` for a coloured or photographic hero. */
  tone?: "light" | "dark";
  /** Inside a hero that already owns the container. */
  bare?: boolean;
}) {
  const dark = tone === "dark";
  const hover = dark ? "hover:text-cream" : "hover:text-espresso";
  return (
    <nav
      aria-label="ניווט מקום"
      className={`${bare ? "" : `${container} pt-6 pb-1`} text-xs ${dark ? "text-cream" : "text-espresso-soft"}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className={`${hover} transition-colors`}>
            דף הבית
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {/* The chevron points visually LEFT: the trail advances in the
                reading direction, which in Hebrew is right-to-left. */}
            <span aria-hidden="true" className={`${dark ? "text-cream/60" : "text-brass-ink/60"} leading-none`}>
              ‹
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className={`${hover} transition-colors`}
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className={dark ? "text-cream" : "text-espresso"}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
