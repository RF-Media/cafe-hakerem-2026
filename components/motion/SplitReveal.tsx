/**
 * Per-word mask reveal driven by scroll position: the below-the-fold
 * counterpart to `<SplitText>`. Use on section headings (`h2`/`h3`), never on
 * body copy, FAQ answers or the factual paragraph: those are the exact strings
 * AI engines extract, and they should stay plain text nodes in one container.
 *
 * Same accessibility contract as `SplitText`: real text nodes, no duplication,
 * no `aria-hidden`. Split on whitespace only, so ג'חנון never breaks.
 */
export function SplitReveal({
  text,
  className,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span
      data-rv-words=""
      className={className}
      suppressHydrationWarning
      style={{ "--rs": `${Math.round(stagger * 1000)}ms` } as React.CSSProperties}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
            <span data-rv-word="" className="inline-block" style={{ "--i": i } as React.CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
