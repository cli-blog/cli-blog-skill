# CLI

Use `@cli-blog/cli` for terminal workflows, CI, scripted publishing, and offline demos.

Install globally:

```sh
npm install -g @cli-blog/cli
```

```sh
bun add -g @cli-blog/cli
```

```sh
pnpm add -g @cli-blog/cli
```

Run without installing:

```sh
npx @cli-blog/cli posts list --demo --json
```

```sh
bunx @cli-blog/cli posts list --demo --json
```

```sh
pnpm dlx @cli-blog/cli posts list --demo --json
```

Configure:

```sh
cli-blog config set --api-key "$CLI_BLOG_PRIVATE_KEY"
```

Prefer `CLI_BLOG_API_KEY` in CI.

Demo mode:

```sh
cli-blog posts list --demo --json
cli-blog posts create --demo --title "A developer's guide to San Francisco" --json
cli-blog media upload --demo --file ./missing.png --json
cli-blog feed get --demo
```

Common publishing flow:

```sh
cli-blog authors create --public-name "Maya Chen" --json
cli-blog categories create --name "San Francisco" --locale en-US --json
cli-blog tags create --name "City Notes" --locale en-US --json
cli-blog posts create --title "A developer's guide to San Francisco" --body-markdown ./post.md --json
cli-blog posts publish post_123 --expected-version 1 --json
```

Use `--limit` and `--after` for cursor pagination:

```sh
cli-blog posts list --limit 20 --json
```

Use `--page` and optional `--per-page` when a numbered UI needs exact totals:

```sh
cli-blog posts list --page 2 --per-page 20 --json
cli-blog authors list --page 1 --per-page 50 --json
cli-blog media list --page 1 --per-page 25 --json
cli-blog categories list --page 1 --per-page 20 --json
cli-blog tags list --page 1 --per-page 20 --json
cli-blog posts revisions list post_123 --page 1 --per-page 20 --json
```

Do not mix `--page`/`--per-page` with `--after`/`--limit`.

Use relation flags such as `--category-match all`, exclusion flags such as `--exclude-tag-slug internal`, and `--media-asset-ids` for ordered post attachments.

Use `--json` for automation. Destructive real API commands should use `--yes` only when the script is intentionally non-interactive.
