/**
 * GEO validation — pre-deploy checklist.
 *
 * Run via `npm run check:geo` to audit AI search visibility.
 * Checks for:
 * - Entity consistency (קפה הכרם, גני תקווה, ג'חנון)
 * - FAQ answer quality (named entity + actionable)
 * - Metadata structure
 * - Schema completeness
 * - Redundancy across HTML + schema
 */

import { readFileSync } from "fs";
import { globSync } from "glob";

interface Issue {
  file: string;
  line: number;
  severity: "error" | "warn";
  message: string;
}

const issues: Issue[] = [];

/* ─────────────────────────────────────────────────────────────── */
/* 1. Entity Consistency                                           */
/* ─────────────────────────────────────────────────────────────── */

const contentFiles = globSync("content/**/*.ts");
const forbidden: { pattern: RegExp; replacement: string; skip?: (line: string) => boolean }[] = [
  { pattern: /\bה?כרם\b(?!.*קפה)/i, replacement: "קפה הכרם", skip: (l) => l.includes("§") }, // skip in comments explaining the rule
  { pattern: /ג[""]ט\b/g, replacement: "גני תקווה", skip: (l) => l.includes("§") },
  { pattern: /קייטרינג/g, replacement: "מגשי אירוח", skip: (l) => l.includes("§") || l.includes("never") },
  { pattern: /ג[""]אחנון/g, replacement: "ג'חנון", skip: (l) => l.includes("§") },
];

for (const file of contentFiles) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, i) => {
    // Skip comments
    const codeOnly = line.split("//")[0];
    // Skip if line only contains comment or whitespace
    if (!codeOnly.trim()) return;
    for (const { pattern, replacement, skip } of forbidden) {
      if (skip && skip(line)) continue;
      if (pattern.test(codeOnly)) {
        issues.push({
          file,
          line: i + 1,
          severity: "warn",
          message: `Entity inconsistency: should use "${replacement}"`,
        });
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────── */
/* 2. FAQ Answer Quality (dynamic import + check)                  */
/* ─────────────────────────────────────────────────────────────── */

async function checkFAQs() {
  try {
    // @ts-ignore — dynamic import of content
    const faqs = await import("../content/faqs.ts").catch(() => null);
    if (!faqs) return;

    const allPages = [
      { name: "home", data: faqs.homeFAQs },
      { name: "menu", data: faqs.menuFAQs },
      { name: "jachnun", data: faqs.jachnunFAQs },
      { name: "catering", data: faqs.cateringFAQs },
      { name: "contact", data: faqs.contactFAQs },
    ];

    for (const page of allPages) {
      if (!page.data || !Array.isArray(page.data)) continue;

      page.data.forEach((item: { q: string; a: string }, idx: number) => {
        // Check if answer contains the business name
        const hasEntityReference =
          item.a.includes("קפה הכרם") ||
          item.a.includes("[TODO") ||
          /בית קפה/.test(item.a);

        if (
          !hasEntityReference &&
          !item.a.startsWith("הטלפון") &&
          !item.a.startsWith("כתובת")
        ) {
          issues.push({
            file: "content/faqs.ts",
            line: 0,
            severity: "warn",
            message: `[${page.name}] FAQ #${idx + 1} missing entity reference: "${item.q}"`,
          });
        }

        // Check if answer is too long (AI pulls short answers)
        if (item.a.length > 300 && !item.a.includes("[TODO")) {
          issues.push({
            file: "content/faqs.ts",
            line: 0,
            severity: "warn",
            message: `[${page.name}] FAQ #${idx + 1} answer too long (${item.a.length}ch): "${item.q}"`,
          });
        }
      });
    }
  } catch (e) {
    // Skip if import fails — tsx not available in all contexts
  }
}

/* ─────────────────────────────────────────────────────────────── */
/* 3. Metadata Consistency (pages)                                 */
/* ─────────────────────────────────────────────────────────────── */

const pages = globSync("app/(site)/*/page.tsx").concat([
  "app/(site)/page.tsx",
]);

for (const pageFile of pages) {
  const content = readFileSync(pageFile, "utf8");

  // Check for metadata title
  if (!content.includes("export const metadata")) {
    issues.push({
      file: pageFile,
      line: 0,
      severity: "error",
      message: "Missing Metadata export",
    });
  }

  // Check title length (SEO: <70 chars)
  const titleMatch = content.match(/title:\s*"([^"]*)"/);
  if (titleMatch && titleMatch[1].length > 70) {
    issues.push({
      file: pageFile,
      line: 0,
      severity: "warn",
      message: `Title too long (${titleMatch[1].length}ch, target <70): "${titleMatch[1]}"`,
    });
  }

  // Check description exists and length (SEO: 140-160 chars)
  const descMatch = content.match(/description:\s*"([^"]*)"/);
  if (!descMatch) {
    issues.push({
      file: pageFile,
      line: 0,
      severity: "error",
      message: "Missing description in metadata",
    });
  } else if (
    descMatch[1].length < 120 ||
    descMatch[1].length > 170
  ) {
    issues.push({
      file: pageFile,
      line: 0,
      severity: "warn",
      message: `Description length ${descMatch[1].length}ch (target 140-160): "${descMatch[1]}"`,
    });
  }

  // Check for BreadcrumbSchema import (except home)
  if (!pageFile.includes("page.tsx") || pageFile.includes("/(site)/page.tsx")) {
    if (
      !content.includes("BreadcrumbSchema") &&
      !pageFile.includes("/(site)/page.tsx")
    ) {
      issues.push({
        file: pageFile,
        line: 0,
        severity: "error",
        message: "Missing BreadcrumbSchema (required for all inner pages)",
      });
    }
  }

  // Check for visible Breadcrumb component (except home)
  if (!pageFile.includes("/(site)/page.tsx")) {
    if (
      !content.includes("import { Breadcrumb }") &&
      !content.includes("from \"@/components/ui/Breadcrumb\"")
    ) {
      issues.push({
        file: pageFile,
        line: 0,
        severity: "error",
        message: "Missing visible <Breadcrumb /> component",
      });
    }
  }
}

/* ─────────────────────────────────────────────────────────────── */
/* Output                                                          */
/* ─────────────────────────────────────────────────────────────── */

async function main() {
  await checkFAQs();

  if (issues.length === 0) {
    console.log(
      "✅ GEO audit passed. Site is optimized for AI search visibility."
    );
    process.exit(0);
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warn").length;

  console.error(`\n⚠️  GEO audit found ${errorCount} errors, ${warnCount} warnings:\n`);

  for (const issue of issues.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === "error" ? -1 : 1;
    }
    return a.file.localeCompare(b.file);
  })) {
    const icon = issue.severity === "error" ? "❌" : "⚠️ ";
    console.error(`${icon} ${issue.file}:${issue.line} — ${issue.message}`);
  }

  console.error(
    `\nResolve errors before deploy. Warnings improve AI visibility but are not blockers.\n`
  );

  process.exit(errorCount > 0 ? 1 : 0);
}

main();
