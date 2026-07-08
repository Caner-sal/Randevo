import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// REDESIGN-9: scans the whole app/component tree (not just dashboard/admin/
// staff) so any new page or component regresses this repo-wide, permanently,
// on every `npm test` / `phase:gate` / CI run — no separate script to forget
// to wire up.
const TARGET_DIRS = [
  path.join(process.cwd(), "src", "app"),
  path.join(process.cwd(), "src", "components"),
];

const FORBIDDEN = [
  // `(?!\/)` excludes opacity modifiers like `bg-white/10` — an intentional,
  // theme-agnostic translucent overlay pattern (e.g. LanguageSwitcher's glass
  // pill trigger over the hero's colored background), not the light-mode bug.
  /bg-white(?!\/)/,
  /text-gray-\d{2,3}/,
  /border-gray-\d{2,3}/,
  // Raw light-palette status colors (bg-yellow-100, bg-blue-100, ...) that only
  // read correctly under OS-level prefers-color-scheme, decoupled from this
  // app's own always-dark theme (see docs/ui-redesign-audit.md §4 / REDESIGN-7).
  /bg-(?:yellow|blue|green|red|orange|purple|indigo)-(?:50|100)(?!\d)/,
  /text-(?:yellow|blue|green|red|orange|purple|indigo)-[6-9]00(?!\d)/,
  /border-(?:yellow|blue|green|red|orange|purple|indigo)-(?:50|100|200)(?!\d)/,
];

function collectTsxFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsxFiles(fullPath, acc);
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".tsx")) {
      acc.push(fullPath);
    }
  }
  return acc;
}

describe("repo-wide theme class audit", () => {
  it("avoids hard-coded light-mode gray/white utility classes", () => {
    const violations: string[] = [];

    for (const root of TARGET_DIRS) {
      for (const file of collectTsxFiles(root)) {
        const content = fs.readFileSync(file, "utf8");
        for (const rule of FORBIDDEN) {
          if (rule.test(content)) {
            violations.push(`${path.relative(process.cwd(), file)} -> ${rule}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
