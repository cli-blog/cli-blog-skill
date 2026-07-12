# Node SDK

Use `@cli-blog/node` in trusted Node.js 20+ runtimes. Keep private-key clients out of browser bundles.

## Contents

- Install and create clients
- Resource methods
- Delivery reads
- Editorial writes and uploads
- Pagination
- Errors

## Install And Create Clients

```sh
npm install @cli-blog/node
```

```sh
bun add @cli-blog/node
```

```sh
pnpm add @cli-blog/node
```

Create separate clients for delivery and editorial work so keys cannot cross boundaries accidentally:

```ts
import { CliBlog } from "@cli-blog/node";

export const deliveryBlog = new CliBlog({
  apiKey: process.env.CLI_BLOG_PUBLIC_API_KEY!,
});

export const editorialBlog = new CliBlog({
  apiKey: process.env.CLI_BLOG_PRIVATE_API_KEY!,
});
```

The default API URL is `https://api.cli-blog.com`. Set `apiUrl` only for an intentional staging, self-hosted, or test target.

## Resource Methods

| Resource | Methods |
| --- | --- |
| `posts` | `list`, `paginate`, `get`, `create`, `update`, `publish`, `schedule`, `delete` |
| `posts.revisions` | `list`, `paginate`, `get` |
| `posts.slugRedirects` | `get` |
| `authors` | `list`, `paginate`, `get`, `create`, `update`, `delete` |
| `media` | `list`, `paginate`, `get`, `upload`, `update`, `delete` |
| `categories` | `list`, `paginate`, `get`, `create`, `update`, `delete` |
| `tags` | `list`, `paginate`, `get`, `create`, `update`, `delete` |
| `locales` | `list` |
| `feed` | `get` |
| `sitemap` | `get` |

Do not call `settings`, billing, organization, member, or API-key resources through this client; they are not public SDK resources.

## Read Published Content

```ts
const posts = await deliveryBlog.posts.list({
  locale: "en-US",
  status: "published",
  fields: ["summary", "seo"],
  include: ["authors", "categories", "tags"],
  sort: "published_at",
  direction: "desc",
  limit: 20,
});
```

Retrieve a post by ID or locale-scoped slug:

```ts
const post = await deliveryBlog.posts.get("how-we-ship-release-notes", {
  locale: "en-US",
  fields: ["summary", "content", "seo"],
  include: ["authors", "categories", "tags", "media", "translations"],
});
```

Use stable relation IDs in stored integrations and slugs for locale-aware routes. Use filters such as `category_match: "all"` and `exclude_tag_slug: ["internal"]` when building archives.

## Create And Update Content

Create a draft first unless the caller explicitly requests another status:

```ts
const draft = await editorialBlog.posts.create({
  title: "How we ship release notes",
  locale: "en-US",
  status: "draft",
  excerpt: "A repeatable draft, review, and publish workflow.",
  body_markdown: "## Draft\n\nStart with the reader outcome.",
  author_profile_ids: ["author_123"],
  category_ids: ["category_123"],
  tag_ids: ["tag_123"],
  media_asset_ids: ["media_123"],
});
```

Fetch the current workflow version before updating:

```ts
const current = await editorialBlog.posts.get(draft.id, {
  fields: ["summary", "content", "workflow"],
});

const updated = await editorialBlog.posts.update(current.id, {
  body_markdown: `${current.body_markdown}\n\n## Review\n\nAdd reviewer notes.`,
  expected_version: current.version,
});
```

`publish()` and `schedule()` are convenience helpers over the canonical status update. Publish immediately:

```ts
await editorialBlog.posts.publish(updated.id, {
  expected_version: updated.version,
});
```

Or schedule that version instead:

```ts
await editorialBlog.posts.schedule(updated.id, "2026-08-01T16:00:00.000Z", {
  expected_version: updated.version,
});
```

Use one of those operations for a given version; refetch before performing a later state change.

## Upload Media

Use native Node.js `Blob` and `FormData` support through the SDK:

```ts
import { readFile } from "node:fs/promises";

const bytes = await readFile("./release-workflow.png");
const media = await editorialBlog.media.upload({
  file: new Blob([bytes], { type: "image/png" }),
  filename: "release-workflow.png",
  alt_text: "Release workflow from draft through publishing",
  metadata: { source: "release-notes" },
});
```

Update editorial metadata without replacing the stored file:

```ts
await editorialBlog.media.update(media.id, {
  alt_text: "Release workflow from draft through editorial approval and publishing",
});
```

## Paginate

Use `paginate()` for cursor traversal without retaining entire pages:

```ts
for await (const post of deliveryBlog.posts.paginate({
  status: "published",
  locale: "en-US",
  fields: ["summary"],
  limit: 100,
})) {
  await indexPost(post);
}
```

Posts, revisions, authors, media, categories, and tags expose cursor iterators. Use `list({ page, per_page })` only for exact totals:

```ts
const page = await deliveryBlog.posts.list({
  status: "published",
  fields: ["summary"],
  page: 2,
  per_page: 20,
});

console.log(page.total_items, page.total_pages);
```

Do not mix `page`/`per_page` with `after`/`limit`. SDK `paginate()` is cursor-only.

## Handle Errors

```ts
import { CliBlogError } from "@cli-blog/node";

try {
  await editorialBlog.posts.update("post_123", {
    title: "Updated title",
    expected_version: 3,
  });
} catch (error) {
  if (error instanceof CliBlogError) {
    console.error({
      code: error.code,
      message: error.message,
      param: error.param,
      requestId: error.requestId,
      status: error.status,
    });
  }
  throw error;
}
```

Never log the client configuration, headers, or key. Handle version conflicts by refetching and merging, not by removing `expected_version`.

The SDK retries safe read requests up to three attempts for network failures, `408`, `425`, retryable `5xx` responses, and `429` responses that include `Retry-After`. It does not automatically retry writes, conflicts, or hard plan-limit responses. Keep write retries deliberate because the public API does not promise an idempotency key for content mutations.

Read `workflows.md` for complete dependency creation, translation, restoration, delivery, feed, and sitemap sequences.
