import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = [
  "LICENSE",
  "README.md",
  "CLAUDE.md",
  "cli-blog/SKILL.md",
  "cli-blog/agents/openai.yaml",
  "cli-blog/agents/claude.md",
  "cli-blog/references/api.md",
  "cli-blog/references/cli.md",
  "cli-blog/references/frameworks.md",
  "cli-blog/references/sdk.md",
];

await Promise.all(required.map((path) => access(resolve(root, path))));
const publicText = (
  await Promise.all(
    required
      .filter((path) => path.endsWith(".md") || path.endsWith(".yaml"))
      .map((path) => readFile(resolve(root, path), "utf8")),
  )
).join("\n");

const forbidden = [
  /AbortSignal/,
  /cli_blog_[ps]k_/,
  /@cli-blog\/cli --demo/,
  /slugRedirects\.resolve/,
  /media\.upload\(file/,
  /post-V1/i,
  /coming soon/i,
];
for (const pattern of forbidden) {
  if (pattern.test(publicText)) throw new Error(`Forbidden or stale public guidance matched ${pattern}`);
}

if (!publicText.includes("~/.codex/skills") || !publicText.includes(".claude/skills")) {
  throw new Error("Provider-specific installation paths are missing");
}

console.log(`Validated ${required.length} Cli Blog skill files`);
