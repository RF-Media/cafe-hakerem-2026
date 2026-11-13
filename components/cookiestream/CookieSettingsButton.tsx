'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { openCookieSettings } from './consent';

/**
 * Lets a visitor change their mind. Withdrawing has to be as easy as agreeing, so
 * put one in the footer and on the privacy page. Renders nothing until JavaScript
 * runs: without it there's no banner to open and no tracking to refuse.
 */
export function CookieSettingsButton({ className, children }: { className?: string; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
