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
export function OpenStatusBadge({ className = "text-cream/90" }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus(business.hours));
  }, []);

  if (!status) return null;

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <span aria-hidden className="relative flex h-2 w-2">
        {status.isOpen ? (
          <span className="seal-ping absolute inset-0 rounded-full bg-[hsl(140_60%_55%)]" />
        ) : null}
        <span className={`relative h-2 w-2 rounded-full ${status.isOpen ? "bg-[hsl(140_60%_55%)]" : "bg-current opacity-40"}`} />
      </span>
      {status.label}
    </span>
  );
}
