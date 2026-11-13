'use client';

import { useEffect, useId, useRef } from 'react';
import type { CookieChoice, CookieStreamConfig } from './config';

export type CookieStreamView = 'intro' | 'settings';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

// Lucide's sliders-horizontal and chevron-right (ISC licence), inline so no icon package is needed.
const SlidersIcon = () => (
  <svg {...iconProps}>
    <path d="M10 5H3" />
    <path d="M12 19H3" />
    <path d="M14 3v4" />
    <path d="M16 17v4" />
    <path d="M21 12h-9" />
    <path d="M21 19h-5" />
    <path d="M21 5h-7" />
    <path d="M8 10v4" />
    <path d="M8 12H3" />
  </svg>
);

const BackIcon = () => (
  <svg {...iconProps} className="cs-back-icon">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function Toggle({
  checked,
  onChange,
  labelledBy,
  describedBy,
  name,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  labelledBy: string;
  describedBy: string;
  name: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      data-cookiestream-toggle={name}
      onClick={() => onChange(!checked)}
      className="cs-toggle"
    >
      <span className="cs-toggle-knob" />
    </button>
  );
}

export function CookieStreamCard({
  config,
  view,
  draft,
  onDraftChange,
  onAccept,
  onNecessaryOnly,
  onOpenSettings,
  onSave,
  onAcceptAll,
  onBack,
  focusOnMount = false,
  manageFocus = true,
  className,
}: {
  config: CookieStreamConfig;
  view: CookieStreamView;
  draft: CookieChoice;
  onDraftChange: (draft: CookieChoice) => void;
  onAccept: () => void;
  onNecessaryOnly: () => void;
  onOpenSettings: () => void;
  onSave: () => void;
  onAcceptAll: () => void;
  onBack: () => void;
  /** True when a person opened the card. An automatic first appearance doesn't take their focus. */
  focusOnMount?: boolean;
  /** False for a preview embedded in another page (optional/admin). */
  manageFocus?: boolean;
  className?: string;
}) {
  const id = useId();
  const { texts, categories } = config;
  const titleId = `${id}-title`;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const accept = config.classes?.accept ?? 'cs-btn cs-btn--accept';
  const outline = config.classes?.outline ?? 'cs-btn cs-btn--outline';
  const quiet = config.classes?.quiet ?? 'cs-btn cs-btn--quiet';

  // Switching views removes the button that had focus; land keyboard and screen-reader users on the new heading.
  useEffect(() => {
    const isFirst = firstRender.current;
    firstRender.current = false;
    if (manageFocus && (!isFirst || focusOnMount)) titleRef.current?.focus();
  }, [view, manageFocus, focusOnMount]);

  const rows: Array<{ key: 'necessary' | 'analytics' | 'marketing'; label: string; description: string }> = [
    { key: 'necessary', ...categories.necessary },
    { key: 'analytics', ...categories.analytics },
    ...(categories.marketing.enabled ? [{ key: 'marketing' as const, ...categories.marketing }] : []),
  ];

  return (
    <section
      aria-labelledby={titleId}
      dir={config.dir}
      data-cookiestream="card"
      data-view={view}
      className={['cs-card', className].filter(Boolean).join(' ')}
    >
      {view === 'intro' ? (
        <div className="cs-intro">
          <div className="cs-intro-text">
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className="cs-title">
              {texts.title}
            </h2>
            <p className="cs-body">
              {texts.body}{' '}
              <a href={config.privacyHref} target="_blank" rel="noopener noreferrer" className="cs-link">
                {texts.privacyLabel}
                <span className="cs-sr"> {texts.newTab}</span>
              </a>
            </p>
          </div>
          <div className="cs-actions">
            <button type="button" data-cookiestream="accept" onClick={onAccept} className={accept}>
              {texts.accept}
            </button>
            <button type="button" data-cookiestream="necessary" onClick={onNecessaryOnly} className={outline}>
              {texts.necessaryOnly}
            </button>
            <button type="button" data-cookiestream="settings" onClick={onOpenSettings} className={quiet}>
              <SlidersIcon />
              {texts.settingsLink}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cs-settings-head">
            <button type="button" data-cookiestream="back" onClick={onBack} className="cs-back">
              <BackIcon />
              {texts.back}
            </button>
            <span aria-hidden="true" className="cs-divider" />
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className="cs-title">
              {texts.settingsTitle}
            </h2>
          </div>
          <ul className="cs-rows" data-count={rows.length}>
            {rows.map((row) => (
              <li key={row.key} className="cs-row">
                <div className="cs-row-text">
                  <p id={`${id}-${row.key}`} className="cs-row-label">
                    {row.label}
                  </p>
                  <p id={`${id}-${row.key}-desc`} className="cs-row-desc">
                    {row.description}
                  </p>
                </div>
                {row.key === 'necessary' ? (
                  <span className="cs-always">{texts.alwaysOn}</span>
                ) : (
                  <Toggle
                    name={row.key}
                    checked={draft[row.key]}
                    onChange={(on) => onDraftChange({ ...draft, [row.key]: on })}
                    labelledBy={`${id}-${row.key}`}
                    describedBy={`${id}-${row.key}-desc`}
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="cs-footer">
            <button type="button" data-cookiestream="accept-all" onClick={onAcceptAll} className={accept}>
              {texts.acceptAll}
            </button>
            <div className="cs-footer-pair">
              <button type="button" data-cookiestream="necessary" onClick={onNecessaryOnly} className={outline}>
                {texts.necessaryOnly}
              </button>
              <button type="button" data-cookiestream="save" onClick={onSave} className={outline}>
                {texts.save}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
