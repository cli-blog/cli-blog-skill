# Node SDK

Use `@cli-blog/node` in trusted Node.js 20+ runtimes.

Install:

```sh
npm install @cli-blog/node
```

```sh
bun add @cli-blog/node
```

```sh
pnpm add @cli-blog/node
```

Create a client:

```js
import { CliBlog } from "@cli-blog/node";

const apiKey = process.env.CLI_BLOG_API_KEY;
if (!apiKey) throw new Error("CLI_BLOG_API_KEY is required");

const blog = new CliBlog({
  apiKey,
});
```

Core resources:

- `blog.posts`: `list`, `paginate`, `get`, `create`, `update`, `publish`, `schedule`, `delete`.
- `blog.posts.revisions`: `list`, `get`.
- `blog.posts.slugRedirects`: `get`.
- `blog.authors`: `list`, `get`, `create`, `update`, `delete`.
- `blog.media`: `list`, `get`, `upload`, `update`, `delete`.
- `blog.categories` and `blog.tags`: `list`, `get`, `create`, `update`, `delete`.
- `blog.locales`: `list`.
- `blog.sitemap` and `blog.feed`: `get`.

Read published posts:

```ts
const posts = await blog.posts.list({
  status: "published",
  locale: "en-US",
  fields: ["summary", "seo"],
  include: ["authors"],
  limit: 20,
  category_match: "all",
  exclude_tag_slug: ["internal"],
});
```

Cursor pagination is the default:

```ts
const firstPage = await blog.posts.list({ limit: 20 });
const nextPage = firstPage.next_cursor
  ? await blog.posts.list({ after: firstPage.next_cursor, limit: 20 })
  : null;
```

Use numbered pagination only when the UI needs exact page counts:

```ts
const numberedPage = await blog.posts.list({
  page: 2,
  per_page: 20,
  status: "published",
  fields: ["summary", "seo"],
});

console.log(numberedPage.total_items, numberedPage.total_pages);
```

Do not mix `page`/`per_page` with `after`/`limit`. SDK `paginate()` helpers are cursor-only.

Publish a post:

```ts
const author = await blog.authors.create({ public_name: "Maya Chen" });
const category = await blog.categories.create({ name: "San Francisco", locale: "en-US" });
const tag = await blog.tags.create({ name: "City Notes", locale: "en-US" });

const draft = await blog.posts.create({
  title: "A developer's guide to San Francisco",
  body_markdown: "## Fog, hills, and neighborhoods\n\nA local story.",
  author_profile_ids: [author.id],
  category_ids: [category.id],
  tag_ids: [tag.id],
  media_asset_ids: ["media_123"],
});

await blog.posts.publish(draft.id, { expected_version: draft.version });
```
