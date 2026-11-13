/**
 * Post-build tracker check. Run via `npm run check:trackers` after `next build`.
 *
 * Fails if a tracker URL appears in the prerendered HTML: a tag there loads
 * before the visitor has chosen. Tracking loads only from
 * components/cookiestream/trackers.ts, after consent.
 */

import { readFileSync } from "fs";
import { globSync } from "glob";

const TRACKER = /googletagmanager\.com|google-analytics\.com|connect\.facebook\.net/;

const files = globSync(".next/server/app/**/*.html");
if (files.length === 0) {
  console.error("✗ No prerendered HTML in .next/server/app. Run `next build` first.");
  process.exit(1);
}

const offenders = files.filter((file) => TRACKER.test(readFileSync(file, "utf8")));

if (offenders.length) {
  console.error("✗ A tracker is in the initial HTML, so it loads before consent:");
  offenders.forEach((file) => console.error(`  ${file}`));
  process.exit(1);
}

console.log(`✓ No tracker in ${files.length} prerendered pages`);
