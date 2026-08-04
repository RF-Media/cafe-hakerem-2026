"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { getOpenStatus, type OpenStatus } from "@/lib/hours-status";

/**
 * Live open/closed pill for the hero Visit card. Computed client-side at
 * mount (not on the server) so a force-static, 24h-revalidated page never
 * shows a status that went stale hours ago — same reasoning as the
 * client-side jachnun slot computation.
 */
export function OpenStatusBadge() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus(business.hours));
  }, []);

  if (!status) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-cream/80">
      <span
        aria-hidden
        className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-brass" : "bg-cream/30"}`}
      />
      {status.label}
    </span>
  );
}
