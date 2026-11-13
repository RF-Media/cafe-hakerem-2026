"use client";

import { useEffect, useState } from "react";
import { getHappyHourStatus, type HappyHourStatus } from "@/lib/happy-hour-status";

/**
 * Live "active now / starts at 14:00" pill for the happy-hour promo.
 * Computed client-side at mount — this page is force-static with a 24h
 * revalidate, so a server-computed status would go stale (same reasoning
 * as `<OpenStatusBadge>`).
 */
export function HappyHourBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<HappyHourStatus | null>(null);

  useEffect(() => {
    setStatus(getHappyHourStatus());
  }, []);

  if (!status) return null;

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <span aria-hidden className="relative flex h-2 w-2">
        {status.isActive ? <span className="seal-ping absolute inset-0 rounded-full bg-brass" /> : null}
        <span className={`relative h-2 w-2 rounded-full ${status.isActive ? "bg-brass" : "bg-current opacity-40"}`} />
      </span>
      {status.label}
    </span>
  );
}
