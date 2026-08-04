import type { Metadata } from "next";
import { OrderFlow } from "@/components/order/OrderFlow";
import { orderCopy } from "@/content/jachnun-order";

/**
 * The checkout is per-visitor and time-sensitive (pickup windows shift across
 * the Thursday 18:00 cutoff), so unlike the content pages it is not statically
 * rendered with a 24h revalidate.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: orderCopy.meta.title,
  description: orderCopy.meta.description,
  // A checkout has nothing to rank for and everything to leak: no order page
  // should ever appear in a search result or an AI answer. The sales content
  // lives on /jachnun, which is indexed.
  robots: { index: false, follow: true },
  alternates: { canonical: "/jachnun" },
};

export default function JachnunOrderPage() {
  return <OrderFlow />;
}
