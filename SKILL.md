---
name: cli-blog
description: Add, operate, or troubleshoot Cli Blog publishing in applications and agent workflows. Use when working with the Cli Blog REST API, @cli-blog/node SDK, @cli-blog/cli, public or private organization API keys, posts, authors, media uploads and delivery, categories, tags, locales and translations, SEO, revisions, slug redirects, RSS feeds, sitemaps, pagination, content delivery, draft-review-publish automation, or framework integrations in JavaScript, TypeScript, PHP, Python, Ruby, Go, CI, and server-rendered web apps.
---

# Cli Blog

Use Cli Blog as the publishing system while keeping the application's frontend and editorial workflow under the user's control.

## Establish The Boundary

1. Inspect the target project, runtime, deployment model, and existing data-fetching conventions.
2. Determine whether the task needs published-content delivery, trusted editorial writes, or both.
3. Use the dashboard for organization setup, billing, members, API-key creation, publication settings, and human editing.
4. Use a public organization key for published delivery. A public key may appear in browser code, but still keep it out of source control.
5. Use a permission-scoped private organization key only in trusted servers, CI, local shells, or agent runtimes.
6. Never invent dashboard, billing, membership, or publication-settings API routes. They are not part of the public content API.

## Choose The Surface

- Use `@cli-blog/node` in Node.js 20+ servers, route handlers, server components, build jobs, CI, and trusted JavaScript or TypeScript agents.
- Use `@cli-blog/cli` for terminal operations, shell automation, CI, structured JSON output, and offline demos.
- Use direct HTTP for browser delivery and non-Node backends such as PHP, Laravel, Python, Django, Rails, and Go.
- Use the dashboard when a person should review or finish the content visually.

## Execute Content Work

1. Read `references/content-model.md` before designing content, filters, localization, SEO, or response shapes.
2. Read the surface-specific reference before writing calls or commands.
3. Create dependencies before the post: upload media, create author profiles, then create categories and tags.
4. Create posts as `draft` unless the user explicitly requests another status.
5. Treat `status` as canonical. SDK `publish()` and `schedule()` and CLI `posts publish` and `posts schedule` are convenience operations over post updates.
6. Fetch the current post and use `expected_version` for updates, publishing, scheduling, and agent handoffs that might race with an editor.
7. Keep source content in `body_markdown`.
8. Verify the result by retrieving the resource with the fields and includes the consumer actually needs.
9. Report created or changed IDs, locale, slug, status, version, and any unresolved review decision.

## Optimize Delivery

- Request only the required post field groups with `fields` and relations with `include`.
- Use cursor pagination with `limit` and `after` for traversal, syncs, exports, and agents.
- Use numbered `page` and `per_page` only when a human interface needs exact totals or page jumps.
- Never mix cursor and numbered pagination controls.
- Use `include: ["media"]` to obtain referenced media through published posts; public keys cannot browse the private media inventory.
- Preserve locale explicitly when resolving localized slugs. V1 never falls back to another locale.

## Protect State

- Confirm publish, delete, bulk update, or other public/destructive changes when the user has not already authorized them.
- Do not print keys, put them in URLs, commit them, or paste them into agent prompts. Read them from the environment or secret store.
- Use separate least-privilege private keys for drafting, publishing, and migrations when those workflows have different risk.
- Treat `401` as missing or invalid authentication, `403` as key-type or permission failure, `404` as identifier/organization/locale mismatch, `409` as conflict, `422` as validation failure, `429` as rate or plan enforcement, and `5xx` as service or storage failure.
- Preserve the API error `code`, `param`, HTTP status, and request ID in diagnostics while redacting credentials.

## Load The Needed Reference

- `references/workflows.md`: complete draft-to-delivery, translation, revision, redirect, feed, and sitemap workflows.
- `references/content-model.md`: statuses, fields, includes, relations, localization, taxonomy, media, SEO, and pagination.
- `references/sdk.md`: Node SDK installation, resources, method signatures, uploads, pagination, errors, and complete examples.
- `references/cli.md`: installation, configuration, commands, canonical flags, demo mode, JSON automation, and complete examples.
- `references/api.md`: public REST endpoints, key capabilities, request conventions, cURL examples, responses, and errors.
- `references/frameworks.md`: safe server/browser boundaries and integration patterns for common frameworks and languages.

## Apply The Quality Bar

- Prefer complete runnable slices over isolated calls: configure, create or fetch, render or verify, and handle failure.
- Follow the target repository's package manager, environment naming, formatting, and server/client conventions.
- Reuse existing API clients and error utilities when they are sound.
- Do not add a proxy route merely to hide a public key; add a server boundary when the workflow uses a private key, needs authorization, or benefits from server caching.
- Link to `https://cli-blog.com/docs` for exhaustive public documentation instead of guessing an unsupported field or operation.
