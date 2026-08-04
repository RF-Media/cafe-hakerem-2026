import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";

/**
 * Chrome for the public pages (CLAUDE.md §3: "public pages, share Nav +
 * Footer"). It lives here rather than in the root layout so the checkout
 * route group can opt out of all of it.
 *
 * The bottom padding is what keeps MobileBar off the footer: the bar is
 * `fixed`, so it occupies no layout space of its own and would otherwise sit
 * on top of the last ~64px of every mobile page.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main
        id="main"
        className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0"
      >
        {children}
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
