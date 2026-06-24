# CLI

Use `@cli-blog/cli` for terminal workflows, CI, scripted publishing, and offline demos.

Install globally:

```sh
npm install -g @cli-blog/cli
bun add -g @cli-blog/cli
pnpm add -g @cli-blog/cli
```

Run without installing:

```sh
npx @cli-blog/cli posts list --demo --json
bunx @cli-blog/cli posts list --demo --json
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

Use `--json` for automation. Destructive real API commands should use `--yes` only when the script is intentionally non-interactive.
