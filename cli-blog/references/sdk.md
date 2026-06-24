# Node SDK

Use `@cli-blog/node` in trusted Node.js 20+ runtimes.

Install:

```sh
npm install @cli-blog/node
bun add @cli-blog/node
pnpm add @cli-blog/node
```

Create a client:

```ts
import { CliBlog } from "@cli-blog/node";

const blog = new CliBlog({
  apiKey: process.env.CLI_BLOG_API_KEY!,
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
});
```

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
});

await blog.posts.publish(draft.id, { expected_version: draft.version });
```

Use `AbortSignal.timeout(5000)` only when the user asks for request timeouts. Explain it as a built-in Node timeout/cancel handle.
