'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CookieStreamCard, type CookieStreamView } from './CookieStreamCard';
import type { CookieChoice, CookieStreamConfig } from './config';
import { onOpenCookieSettings, readCookieChoice, recordCookieChoice, saveCookieChoice, setConsentState } from './consent';
import { appliedChoice, applyChoice, effectiveChoice, revokeAndReload, trackMetaPageView } from './trackers';

const NOTHING: CookieChoice = { analytics: false, marketing: false };
const EVERYTHING: CookieChoice = { analytics: true, marketing: true };

export function CookieStream({ config }: { config: CookieStreamConfig }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<CookieChoice | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<CookieStreamView>('intro');
  const [draft, setDraft] = useState<CookieChoice>(NOTHING);
  const [requested, setRequested] = useState(false);
  const lastPath = useRef(pathname);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (appliedChoice()) return;
    const stored = readCookieChoice(config.version);
    if (stored) {
      setChoice(stored);
      applyChoice(stored, config);
    } else if (config.hiddenOn?.some((prefix) => pathname?.startsWith(prefix))) {
      setConsentState('denied');
    } else {
      setOpen(true);
    }
  }, [pathname, config]);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackMetaPageView();
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    setRequested(false);
    if (returnFocus.current?.isConnected) returnFocus.current.focus();
    returnFocus.current = null;
  }, []);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setDraft(readCookieChoice(config.version) ?? NOTHING);
        setView('settings');
        setRequested(true);
        setOpen(true);
      }),
    [config.version]
  );

  // A first visit has to be answered. Someone who came back to look at their settings can just leave.
  useEffect(() => {
    if (!open || !choice) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, choice, close]);

  function decide(picked: CookieChoice) {
    // Saved as it takes effect: "accept" while marketing is off must not count as marketing consent later.
    const next = effectiveChoice(picked, config);
    const consentId = saveCookieChoice(next, config.version);
    recordCookieChoice(config.recordEndpoint, consentId, next, config.version);
    close();

    const prior = appliedChoice();
    const revoked = {
      analytics: !!prior?.analytics && !next.analytics,
      marketing: !!prior?.marketing && !next.marketing,
    };
    if (revoked.analytics || revoked.marketing) {
      revokeAndReload(next, revoked, config);
      return;
    }

    setChoice(next);
    applyChoice(next, config);
  }

  if (!open) return null;

  return (
    <div className="cookiestream" data-position={config.position} dir="ltr">
      <div className="cs-panel">
        <CookieStreamCard
          config={config}
          view={view}
          draft={draft}
          focusOnMount={requested}
          onDraftChange={setDraft}
          onAccept={() => decide(EVERYTHING)}
          onNecessaryOnly={() => decide(NOTHING)}
          onOpenSettings={() => {
            setDraft(choice ?? NOTHING);
            setView('settings');
          }}
          onSave={() => decide(draft)}
          onAcceptAll={() => decide(EVERYTHING)}
          onBack={() => setView('intro')}
        />
      </div>
    </div>
  );
}
