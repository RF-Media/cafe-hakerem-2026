/**
 * Checkout shell.
 *
 * Deliberately bare: no Nav, no Footer, no MobileBar. A kiosk flow has one
 * job per screen and one primary action, and on a phone that action owns the
 * bottom of the viewport — which MobileBar (`fixed`, `z-40`) would otherwise
 * be sitting in. Removing the site nav also removes every competing exit
 * from a funnel the customer has already committed to; the one deliberate
 * way out is the exit link the flow renders in its own header.
 */
export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="flex-1 bg-cream">
      {children}
    </main>
  );
}
