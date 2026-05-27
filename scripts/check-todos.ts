/**
 * Pre-build TODO check.
 *
 * Run via `npm run check:todos` (wire into the build script).
 * Exits non-zero if any [TODO] marker remains in /content.
 *
 * This is the safety net that prevents shipping a site with
 * placeholder phone numbers, wrong hours, or missing kashrut
 * answers — any of which would actively hurt the café.
 */

import { readFileSync } from "fs";
import { globSync } from "glob";

const files = globSync("content/**/*.ts");
const offenders: { file: string; line: number; text: string }[] = [];

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes("[TODO")) {
      offenders.push({ file, line: i + 1, text: line.trim() });
    }
  });
}

if (offenders.length > 0) {
  console.error(`\n❌ Found ${offenders.length} unresolved [TODO] markers:\n`);
  for (const o of offenders) {
    console.error(`  ${o.file}:${o.line}  ${o.text}`);
  }
  console.error(
    "\nResolve every [TODO] above before deploying to production.\n" +
    "Each marker represents a real fact the café needs to provide.\n"
  );
  process.exit(1);
}

console.log("✅ No [TODO] markers in /content. Safe to build.");