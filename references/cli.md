# CLI

Use `@cli-blog/cli` for terminal work, CI, scripts, agent tool calls, and offline demos. The installed command is `cli-blog`.

## Contents

- Install and configure
- Command map
- Draft and publish
- Lists and filters
- Localization, revisions, and redirects
- Demo mode and automation

## Install And Configure

```sh
npm install -g @cli-blog/cli
```

```sh
bun add -g @cli-blog/cli
```

```sh
pnpm add -g @cli-blog/cli
```

Prefer an environment secret in CI and agent runtimes:

```sh
export CLI_BLOG_API_KEY="<private-api-key>"
```

For a trusted local workstation, store configuration through the CLI:

```sh
cli-blog config set --api-key "$CLI_BLOG_API_KEY"
```

Use `CLI_BLOG_API_URL` or `--api-url` only for an intentional non-production target. Avoid `--api-key` in ordinary commands because shell history and process inspection can expose it.

## Command Map

```text
cli-blog posts list|get|create|update|publish|schedule|delete
cli-blog posts revisions list|get <post> [revision]
cli-blog posts redirects get <slug>
cli-blog authors list|get|create|update|delete
cli-blog media list|get|upload|update|delete
cli-blog categories list|get|create|update|delete
cli-blog tags list|get|create|update|delete
cli-blog locales list
cli-blog sitemap get
cli-blog feed get
```

Use `--json` for automation. Destructive real API commands prompt unless the already-authorized workflow passes `--yes`.

## Create A Complete Draft

Create dependencies first and capture their returned IDs:

```sh
cli-blog media upload \
  --file ./release-workflow.png \
  --alt-text "Release workflow from draft through publishing" \
  --json
```

```sh
cli-blog authors create \
  --public-name "Maya Chen" \
  --bio "Writes about engineering systems and releases." \
  --json
```

```sh
cli-blog categories create \
  --name "Engineering" \
  --locale en-US \
  --json
```

```sh
cli-blog tags create \
  --name "Release notes" \
  --locale en-US \
  --json
```

Create the post with canonical field-aligned flags:

```sh
cli-blog posts create \
  --title "How we ship release notes" \
  --locale en-US \
  --status draft \
  --excerpt "A repeatable draft, review, and publish workflow." \
  --body-markdown ./release-notes.md \
  --author-profile-ids author_123 \
  --category-ids category_123 \
  --tag-ids tag_123 \
  --featured-media-asset-id media_123 \
  --media-asset-ids media_123 \
  --seo-description "A practical release-note publishing workflow." \
  --json
```

Retrieve the review shape and note its `version`:

```sh
cli-blog posts get post_123 \
  --locale en-US \
  --fields summary,content,seo,workflow \
  --include authors,categories,tags,media \
  --json
```

Publish only after approval:

```sh
cli-blog posts publish post_123 \
  --locale en-US \
  --expected-version 3 \
  --json
```

Schedule instead of publishing immediately:

```sh
cli-blog posts schedule post_123 \
  --locale en-US \
  --scheduled-at "2026-08-01T16:00:00.000Z" \
  --expected-version 3 \
  --json
```

Refetch before a later state change so `expected_version` stays current.

## List, Search, And Filter

Use cursor pagination by default:

```sh
cli-blog posts list \
  --status published \
  --locale en-US \
  --fields summary,seo \
  --include authors,categories \
  --category-slug engineering,releases \
  --category-match all \
  --exclude-tag-slug internal \
  --sort published_at \
  --direction desc \
  --limit 100 \
  --json
```

Continue with the returned cursor:

```sh
cli-blog posts list \
  --status published \
  --locale en-US \
  --fields summary,seo \
  --include authors,categories \
  --category-slug engineering,releases \
  --category-match all \
  --exclude-tag-slug internal \
  --sort published_at \
  --direction desc \
  --limit 100 \
  --after "<opaque-cursor>" \
  --json
```

Keep the query unchanged when using `after`. Use numbered pagination only for a UI needing exact totals:

```sh
cli-blog posts list --status published --page 2 --per-page 20 --json
```

Do not combine `--page`/`--per-page` with `--after`/`--limit`.

## Localize Content

Check supported locales:

```sh
cli-blog locales list --json
```

Create a post translation linked to an existing post:

```sh
cli-blog posts create \
  --title "Cómo publicamos notas de lanzamiento" \
  --slug "como-publicamos-notas-de-lanzamiento" \
  --locale es-MX \
  --translation-of-id post_123 \
  --status draft \
  --body-markdown ./release-notes.es-MX.md \
  --json
```

Use the same `--translation-of-id` approach for categories and tags. List taxonomy variants with `--include translations`.

## Read Revisions And Redirects

```sh
cli-blog posts revisions list post_123 --locale en-US --limit 20 --json
```

```sh
cli-blog posts revisions get post_123 revision_123 --locale en-US --json
```

```sh
cli-blog posts redirects get old-release-process --locale en-US --json
```

Revision commands are read-only. Restore selected content with `posts update` and the current `--expected-version`.

## Generate Feed And Sitemap

```sh
cli-blog feed get --locale en-US --limit 50 > public/feed.xml
```

```sh
cli-blog sitemap get --limit 50000 > public/sitemap.xml
```

Use a public key for these delivery commands when practical.

## Use Offline Demo Mode

Add `--demo` to supported commands to return representative data without configuration, network access, API keys, or writes:

```sh
cli-blog posts list --demo --json --limit 2
cli-blog posts get demo_post_sf_guide --demo --json
cli-blog media upload --demo --file ./missing.png --json
cli-blog posts revisions list demo_post_sf_guide --demo --json
cli-blog feed get --demo
```

Use demo mode to learn response shapes and test parsers. Do not present it as proof that real credentials, permissions, storage, or publication settings work.

## Handle JSON Errors

With `--json`, failed commands write one structured object to stderr and exit with code `1`:

```json
{
  "error": {
    "code": "version_conflict",
    "message": "Post version conflict",
    "param": "expected_version",
    "request_id": "req_123",
    "status": 409
  }
}
```

Do not retry permission, validation, version-conflict, or plan-limit failures unchanged. Redact keys from command logs and agent transcripts.
