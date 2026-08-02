"use client";

/**
 * The jachnun band on the home page.
 *
 * On desktop it pins for three viewport-heights and the three steps advance
 * as you scroll, over a background that warms from espresso to terracotta —
 * the sub-brand colour arriving as the story does. On mobile, and under
 * reduced motion, the pin is dropped and the same three steps render as an
 * ordinary stacked list.
 *
 * All copy comes from `content/home.ts` and is server-rendered into the HTML
 * like any other section — this being a client component changes when the
 * motion runs, not what the crawler sees.
 */
import { m, useTransform, type MotionValue } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PinnedScene } from "@/components/motion/PinnedScene";
import { IconArrow } from "@/components/ui/icons";
import { container } from "@/components/ui/Section";
import { homeJachnun } from "@/content/home";

function Step({
  step,
  index,
  progress,
  pinned,
}: {
  step: (typeof homeJachnun.steps)[number];
  index: number;
  progress: MotionValue<number>;
  pinned: boolean;
}) {
  // Each step owns a third of the scroll, fading up as it arrives and
  // dimming — never disappearing — as the next one takes over.
  const start = 0.12 + index * 0.26;
  const opacity = useTransform(
    progress,
    [start - 0.16, start, start + 0.26, start + 0.4],
    [0.25, 1, 1, 0.35],
  );
  const y = useTransform(progress, [start - 0.16, start], [22, 0]);

  return (
    <m.li
      data-motion="scene-step"
      style={pinned ? { opacity, y } : undefined}
      className="flex gap-4 md:gap-5"
    >
      <span className="font-latin text-sm tracking-[0.2em] text-cream/55 pt-1 shrink-0">
        {step.n}
      </span>
      <div>
        <h3 className="type-display text-xl md:text-2xl text-cream">{step.title}</h3>
        <p className="mt-1.5 text-sm md:text-base leading-relaxed text-cream/70 max-w-sm">
          {step.body}
        </p>
      </div>
    </m.li>
  );
}

function Scene({ progress, pinned }: { progress: MotionValue<number>; pinned: boolean }) {
  // espresso-deep → jachnun. The band arrives dark and warms into the
  // sub-brand colour as the steps play out.
  const background = useTransform(
    progress,
    [0, 0.55, 1],
    ["hsl(24 26% 9%)", "hsl(22 58% 38%)", "hsl(22 58% 38%)"],
  );
  const titleY = useTransform(progress, [0, 1], [0, -30]);

  return (
    <m.div
      style={pinned ? { backgroundColor: background } : undefined}
      className={
        "w-full " +
        (pinned
          ? "h-full flex items-center"
          : "bg-jachnun py-20 md:py-28")
      }
    >
      <div className={`${container} grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full`}>
        <m.div style={pinned ? { y: titleY } : undefined} className="space-y-5">
          <Eyebrow tone="cream" withRule>
            {homeJachnun.eyebrow}
          </Eyebrow>
          <h2 className="type-display text-4xl md:text-5xl lg:text-6xl text-cream">
            {homeJachnun.title}
          </h2>
          <p className="type-lede text-base md:text-lg text-cream/80 max-w-xl">
            {homeJachnun.body}
          </p>
          <div className="pt-2">
            <Button
              as="a"
              href="/jachnun"
              variant="onDark"
              size="lg"
              icon={<IconArrow />}
            >
              {homeJachnun.cta}
            </Button>
          </div>
        </m.div>

        <ol className="space-y-8 lg:space-y-10 lg:ps-8 lg:border-s lg:border-cream/15">
          {homeJachnun.steps.map((step, i) => (
            <Step key={step.n} step={step} index={i} progress={progress} pinned={pinned} />
          ))}
        </ol>
      </div>
    </m.div>
  );
}

export function JachnunScene() {
  return (
    <PinnedScene length={3} className="relative">
      {(progress, pinned) => <Scene progress={progress} pinned={pinned} />}
    </PinnedScene>
  );
}
