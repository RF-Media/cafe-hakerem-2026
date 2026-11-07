/**
 * The workhorse entrance. Fades and translates its children into view and
 * reverses when scrolled back out through the bottom of the viewport.
 *
 * A server component: it only writes `data-rv` and a few CSS variables. The
 * transition lives in globals.css, the trigger in lib/motion-runtime.ts, so it
 * costs no client JavaScript at all. It also renders fine inside a client
 * component, because it holds no state.
 */
import { offsetFor, type Direction } from "@/lib/motion";

export type RevealProps = {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({
  children,
  direction = "up",
  distance = 24,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const { x = 0, y = 0 } = offsetFor(direction, distance) as { x?: number; y?: number };
  return (
    <Tag
      data-rv=""
      className={className}
      suppressHydrationWarning
      style={
        {
          "--rx": `${x}px`,
          "--ry": `${y}px`,
          "--rd": `${Math.round(delay * 1000)}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
