---
name: cli-blog
description: Use Cli Blog when adding blog publishing to an app, integrating the Cli Blog API, using the @cli-blog/node SDK, setting up the @cli-blog/cli, publishing Markdown content, wiring posts/authors/media/categories/tags/locales/feed/sitemap, or helping AI agents choose the safest Cli Blog integration path for Next.js, React, Astro, Remix, CI, scripts, or backend projects.
---

# Cli Blog

Cli Blog is an API-first blogging platform for developer products and agent workflows. Use this skill to add or operate durable blog publishing through the public API, first-party Node SDK, or CLI.

## Choose The Integration

- Use the dashboard when a human editor should write, review, publish, or manage API keys.
- Use `@cli-blog/node` in trusted Node.js 20+ runtimes: servers, build jobs, CI, route handlers, server components, and agent runtimes.
- Use `@cli-blog/cli` for terminal workflows, CI smoke tests, scripted publishing, and no-setup demos.
- Use direct HTTP only when the project cannot use the SDK or needs a language other than JavaScript.
- Never put private API keys in browser code. Browser apps should call a server route that uses the SDK or API.

## Workflow

1. Inspect the target project and framework before changing files.
2. Decide whether the user needs read-only delivery, trusted publishing, or both.
3. Use public keys for published-content reads and private keys only in trusted environments.
4. Model content in this order when publishing: authors, media, categories/tags, then posts.
5. Keep post body source as Markdown through `body_markdown`.
6. Use `fields` and `include` on post reads so delivery views request only what they need.
7. Use cursor pagination by default; use numbered `page`/`per_page` only when the integration needs exact page counts.
8. Add error handling for `401`, `403`, `404`, `409`, `429`, and `5xx`.
9. Verify with demo CLI commands or a small read request before declaring the integration done.

## References

Read only the reference needed for the task:

- `references/sdk.md`: Node SDK installation, server usage, resources, filters, and framework examples.
- `references/cli.md`: CLI installation, demo mode, commands, and automation examples.
- `references/api.md`: Direct HTTP API conventions and safety rules.
- `references/frameworks.md`: Integration patterns for Next.js, React/Vite, Astro, Remix, and CI.

## Defaults

- API base URL: `https://api.cli-blog.com`.
- Node SDK package: `@cli-blog/node`.
- CLI package: `@cli-blog/cli`.
- Installed CLI command: `cli-blog`.
- New organizations start with `en-US`; omitted locale controls use the organization's configured primary locale.
- Recommended post list fields for index pages: `["summary", "seo"]`.
- Recommended post list includes for index pages: `["authors"]`, adding `categories`, `tags`, or `media` only when rendered.
- Cursor pagination uses `limit` and `after`. Numbered pagination uses `page` and optional `per_page`; do not mix the two modes.

## Output Style

- Prefer server-side examples that protect secrets.
- Keep examples realistic and complete enough to paste into a project.
- When adding docs, include what the user types, what parameters matter, and the response shape they should expect.
