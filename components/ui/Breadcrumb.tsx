import Link from "next/link";

export type BreadcrumbItem = { name: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="ניווט מקום"
      className="mx-auto max-w-container px-6 md:px-10 lg:px-16 py-3 text-xs text-espresso-soft"
    >
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-espresso transition-colors">
            דף הבית
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-stroke">
              /
            </span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-espresso transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
