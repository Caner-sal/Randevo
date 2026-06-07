/**
 * Script: Migrate console.error → logger.error across all API route files.
 *
 * This script:
 * 1. Finds all .ts files under src/app/api that use console.error
 * 2. Adds `import { logger } from "@/lib/logger";` if not already present
 * 3. Replaces `console.error(...)` with `logger.error("route handler error", { err: ... })`
 */

const fs = require("fs");
const path = require("path");

const API_DIR = path.resolve(__dirname, "..", "src", "app", "api");

function walk(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }
  return results;
}

let filesModified = 0;
let replacementsTotal = 0;

const files = walk(API_DIR);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes("console.error")) continue;

  const relative = path.relative(path.resolve(__dirname, ".."), filePath).replace(/\\/g, "/");
  let replacements = 0;

  // Add logger import if not present
  if (!content.includes('from "@/lib/logger"') && !content.includes("from '@/lib/logger'")) {
    // Insert after last import line
    const lines = content.split("\n");
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("import ")) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, 'import { logger } from "@/lib/logger";');
      content = lines.join("\n");
    }
  }

  // Pattern 1: console.error("some string", err); → logger.error("some string", { err });
  content = content.replace(
    /console\.error\(\s*"([^"]+)",?\s*(err|error)\s*\)/g,
    (match, msg, errVar) => {
      replacements++;
      return `logger.error("${msg}", { err: ${errVar} })`;
    }
  );

  // Pattern 2: console.error("some string:", err); → logger.error("some string", { err });
  content = content.replace(
    /console\.error\(\s*"([^"]+):",?\s*(err|error)\s*\)/g,
    (match, msg, errVar) => {
      replacements++;
      return `logger.error("${msg}", { err: ${errVar} })`;
    }
  );

  // Pattern 3: console.error(err); → logger.error("route handler error", { err });
  content = content.replace(
    /console\.error\(\s*(err|error)\s*\)/g,
    (match, errVar) => {
      replacements++;
      // Derive a route name from the file path
      const routeName = relative
        .replace("src/app/api/", "")
        .replace("/route.ts", "")
        .replace(/\[([^\]]+)\]/g, ":$1");
      return `logger.error("${routeName} error", { err: ${errVar} })`;
    }
  );

  if (replacements > 0) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`  ✓ ${relative} — ${replacements} replacement(s)`);
    filesModified++;
    replacementsTotal += replacements;
  }
}

console.log(`\nDone: ${filesModified} files modified, ${replacementsTotal} total replacements.`);
