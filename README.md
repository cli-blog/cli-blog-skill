# Cli Blog Agent Skill

[![skills.sh](https://skills.sh/b/cli-blog/cli-blog-skill)](https://skills.sh/cli-blog/cli-blog-skill/cli-blog)

Use this skill to help AI agents add [Cli Blog](https://cli-blog.com) to software projects through the public API, the `@cli-blog/node` SDK, or the `@cli-blog/cli`.

## What It Helps With

- Choosing between the dashboard, Node SDK, CLI, and direct HTTP API.
- Adding complete blog index, detail, feed, sitemap, preview, and publishing flows to common frameworks.
- Creating draft-review-publish workflows from scripts, CI, or agent runtimes with optimistic concurrency.
- Working with authors, upload-first media, ordered attachments, categories, tags, locales, translations, SEO, revisions, and slug redirects.
- Building lean delivery queries with field groups, includes, relation filters, and cursor or numbered pagination.
- Protecting API keys by keeping private keys on trusted servers and using public keys for published-content reads.

## Install

Install the skill with the open Agent Skills CLI:

```sh
npx skills add cli-blog/cli-blog-skill
```

The installer detects supported agents such as Codex, Claude Code, Cursor, and OpenCode and lets you choose where to install the skill. Add `-g` to make it available across all projects:

```sh
npx skills add cli-blog/cli-blog-skill -g
```

Browse the skill, check its install count, and review its files on [skills.sh](https://skills.sh/cli-blog/cli-blog-skill/cli-blog).

## Skill Contents

```txt
SKILL.md
agents/
  openai.yaml
  claude.md
references/
  api.md
  cli.md
  content-model.md
  frameworks.md
  sdk.md
  workflows.md
CLAUDE.md
```

## Example Prompts

```txt
Use the Cli Blog skill to add a production-ready blog index, post page, SEO metadata, sitemap, and feed to this Next.js app.
```

```txt
Use the Cli Blog skill to create a release-note draft from CI, return its review details, and publish only after approval.
```

```txt
Use the Cli Blog skill to add localized published posts and category archives to this Django app without exposing a private key.
```

```txt
Use the Cli Blog skill to translate this post to es-MX, inherit its relationships, and leave the translation as a draft for review.
```

## Notes

- Keep private API keys out of browser code.
- Use `@cli-blog/node` in trusted Node.js 20+ runtimes.
- Use `cli-blog posts list --demo --json` for a no-setup smoke test.
- Use direct HTTP for PHP, Laravel, Python, Django, Rails, Go, and other non-JavaScript backends.
