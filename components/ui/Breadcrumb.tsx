import Link from "next/link";

export type BreadcrumbItem = { name: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="ניווט מקום"
      className="mx-auto max-w-container px-6 md:px-10 lg:px-16 pt-6 pb-1 text-xs text-espresso-soft"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-espresso transition-colors">
            דף הבית
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {/* The chevron points visually LEFT: the trail advances in the
                reading direction, which in Hebrew is right-to-left. */}
            <span aria-hidden="true" className="text-brass/60 leading-none">
              ‹
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-espresso transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-espresso">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
