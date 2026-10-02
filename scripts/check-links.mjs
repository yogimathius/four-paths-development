// Verifies every internal href/src in dist/ resolves to a built file, and that
// no unfilled {{token}} or old yogimathius.dev contact leaked into the output.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
};
walk(dist);

const resolves = (url) => {
  const path = decodeURI(url.split(/[?#]/)[0]);
  if (path === "/") return existsSync(join(dist, "index.html"));
  const base = join(dist, path);
  return [base, `${base}.html`, join(base, "index.html")].some((p) => existsSync(p) && statSync(p).isFile());
};

const problems = [];
if (!files.some((f) => f.endsWith("index.html"))) problems.push("dist/ has no index.html; run the build first");
for (const file of files.filter((f) => f.endsWith(".html") || f.endsWith(".xml"))) {
  const html = readFileSync(file, "utf8");
  const rel = relative(dist, file);
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!url.startsWith("//") && !resolves(url)) problems.push(`${rel}: broken link ${url}`);
  }
  if (/\{\{\s*\w+\s*\}\}/.test(html)) problems.push(`${rel}: unfilled {{token}}`);
  if (html.includes("yogimathius")) problems.push(`${rel}: mentions yogimathius`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`Checked ${files.length} files: all internal links resolve.`);
