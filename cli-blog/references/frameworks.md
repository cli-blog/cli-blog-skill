# Framework Patterns

## Next.js App Router

Use the SDK in server components, route handlers, or server actions.

```ts
import { CliBlog } from "@cli-blog/node";

const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_KEY! });

export default async function BlogPage() {
  const posts = await blog.posts.list({
    status: "published",
    fields: ["summary", "seo"],
    include: ["authors"],
  });

  return posts.data.map((post) => <article key={post.id}>{post.title}</article>);
}
```

## React Or Vite

Do not use private keys in browser code. Create a backend route and fetch it from React.

```tsx
const response = await fetch("/api/blog/posts");
const posts = await response.json();
```

## Astro

Use the SDK in frontmatter for server-rendered pages.

```astro
---
import { CliBlog } from "@cli-blog/node";

const blog = new CliBlog({ apiKey: import.meta.env.CLI_BLOG_PUBLIC_KEY });
const posts = await blog.posts.list({ status: "published", fields: ["summary"] });
---

{posts.data.map((post) => <article><h2>{post.title}</h2></article>)}
```

## Remix Or React Router

Use the SDK in loaders/actions.

```ts
import { CliBlog } from "@cli-blog/node";

export async function loader() {
  const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_KEY! });
  return blog.posts.list({ status: "published", fields: ["summary"] });
}
```

## CI

Use the CLI with `CLI_BLOG_API_KEY` from repository secrets. Use `--demo` in smoke tests that should not mutate real content.
