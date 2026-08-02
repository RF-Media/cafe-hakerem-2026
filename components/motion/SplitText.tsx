/**
 * Per-word mask reveal for the hero headline — deliberately NOT a client
 * component.
 *
 * The animation is pure CSS (`.hero-word` in globals.css), so it starts
 * painting from the SSR HTML before any JavaScript loads. A Framer
 * `initial={{ opacity: 0 }}` on an `<h1>` would ship the headline at zero
 * opacity and hold it there until hydration, which puts LCP behind the JS
 * bundle. That trade is never worth it on the largest text on the page.
 *
 * Accessibility / extraction: every span holds a real text node, nothing is
 * `aria-hidden`, and nothing is duplicated. The accessibility tree and any
 * crawler's `textContent` are byte-identical to writing the string plainly.
 * Splitting is on whitespace only, so `ג'חנון` is never broken at the gershayim.
 */

export function SplitText({
  text,
  className,
  /** Milliseconds added before the first word starts. */
  delay = 0,
  stagger = 90,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span className={className}>
      {words.map((word, i) => (
        // The separator sits OUTSIDE `.hero-word`: that span is an
        // inline-block with `overflow: hidden`, which would swallow a
        // trailing space and run the words together.
        <span key={`${word}-${i}`}>
          <span className="hero-word">
            <span style={{ ["--i" as never]: i, animationDelay: `${delay + i * stagger}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
