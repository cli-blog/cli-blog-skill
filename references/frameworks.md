# Framework Patterns

Use the target framework's existing server, caching, routing, and error conventions. Keep private operations behind the application's own authorization boundary.

## Contents

- Choose a delivery boundary
- Next.js App Router
- React and Vite
- Astro
- Remix and React Router
- Express and Node servers
- PHP and Laravel
- Python and Django
- Ruby on Rails
- Go
- CI and static builds

## Choose A Delivery Boundary

Use one of these patterns deliberately:

| Need | Pattern |
| --- | --- |
| Published content only, no server, acceptable public key exposure | Call REST from the browser with a public key |
| Server rendering, caching, preview logic, or one controlled origin | Call SDK or REST from the server |
| Drafts, writes, private media inventory, or revisions | Call from an authenticated server route with a private key |
| Publishing automation | Use the SDK or CLI in CI with a scoped private key |

Do not add a proxy only to pretend a public key is secret. Add a server boundary when it provides authorization, private-key protection, caching, validation, or operational control.

## Next.js App Router

Use the SDK in a server component for published delivery:

```tsx
import { CliBlog } from "@cli-blog/node";
import Link from "next/link";

const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_API_KEY! });

export default async function BlogPage() {
  const posts = await blog.posts.list({
    status: "published",
    locale: "en-US",
    fields: ["summary", "seo"],
    include: ["authors"],
    limit: 20,
  });

  return (
    <main>
      <h1>Blog</h1>
      {posts.data.map((post) => (
        <article key={post.id}>
          <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  );
}
```

Use `generateStaticParams` or the framework cache only when that matches the product's freshness requirements. Fetch the detail page with `content` and the relations it renders.

Put private writes in a route handler or server action protected by the application's session and role checks:

```ts
import { CliBlog } from "@cli-blog/node";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await requirePublisher(request);
  const input = await readAndValidateDraftInput(request, user);
  const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PRIVATE_API_KEY! });
  const draft = await blog.posts.create({ ...input, status: "draft" });
  return NextResponse.json(draft, { status: 201 });
}
```

Treat `requirePublisher` and `readAndValidateDraftInput` as application responsibilities; do not invent insecure placeholders in production code.

## React And Vite

For a browser-only published-content view, call REST with a public key:

```ts
const url = new URL("https://api.cli-blog.com/v1/posts");
url.searchParams.set("status", "published");
url.searchParams.set("fields", "summary,seo");
url.searchParams.set("include", "authors");

const response = await fetch(url, {
  headers: { "x-api-key": import.meta.env.VITE_CLI_BLOG_PUBLIC_API_KEY },
});

if (!response.ok) throw new Error(`Cli Blog returned ${response.status}`);
const posts = await response.json();
```

The `VITE_` prefix exposes the value to the browser, so use only a public key. Route all writes through an authenticated backend.

## Astro

Use the SDK in server-rendered frontmatter:

```astro
---
import { CliBlog } from "@cli-blog/node";

const blog = new CliBlog({ apiKey: import.meta.env.CLI_BLOG_PUBLIC_API_KEY });
const posts = await blog.posts.list({
  status: "published",
  fields: ["summary"],
  include: ["authors"],
  limit: 20,
});
---

<main>
  <h1>Blog</h1>
  {posts.data.map((post) => (
    <article>
      <a href={`/blog/${post.slug}`}><h2>{post.title}</h2></a>
      <p>{post.excerpt}</p>
    </article>
  ))}
</main>
```

For static output, regenerate after publication changes or use an on-demand build hook.

## Remix And React Router

Use the SDK in loaders and actions. Loaders may use a public key; actions that write require a private key plus application authorization.

```ts
import { CliBlog } from "@cli-blog/node";

export async function loader() {
  const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_API_KEY! });
  return blog.posts.list({
    status: "published",
    fields: ["summary", "seo"],
    include: ["authors"],
    limit: 20,
  });
}
```

## Express And Node Servers

Create the SDK client once per key and reuse it. Do not create a new client inside every request unless configuration varies per request.

```ts
import { CliBlog } from "@cli-blog/node";
import express from "express";

const app = express();
const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_API_KEY! });

app.get("/api/blog/posts", async (_request, response, next) => {
  try {
    const posts = await blog.posts.list({
      status: "published",
      fields: ["summary", "seo"],
      include: ["authors"],
      limit: 20,
    });
    response.json(posts);
  } catch (error) {
    next(error);
  }
});
```

## PHP And Laravel

Use direct HTTP from server code. In Laravel, keep the public or private key in `config/services.php` and call through the HTTP client:

```php
use Illuminate\Support\Facades\Http;

$response = Http::withHeaders([
    'x-api-key' => config('services.cli_blog.public_key'),
])->get('https://api.cli-blog.com/v1/posts', [
    'status' => 'published',
    'locale' => 'en-US',
    'fields' => 'summary,seo',
    'include' => 'authors',
    'limit' => 20,
]);

$response->throw();
$posts = $response->json('data');
```

For plain PHP, use an established HTTP client when the project already has one. If using cURL directly, check both transport errors and HTTP status before decoding JSON.

## Python And Django

Keep requests in a service module so views, commands, and jobs share error handling:

```py
import os
import requests

def list_published_posts():
    response = requests.get(
        "https://api.cli-blog.com/v1/posts",
        headers={"x-api-key": os.environ["CLI_BLOG_PUBLIC_API_KEY"]},
        params={
            "status": "published",
            "locale": "en-US",
            "fields": "summary,seo",
            "include": "authors",
            "limit": 20,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["data"]
```

Call the service from a Django view, management command, or Celery task. Use a private key only in trusted server processes.

## Ruby On Rails

Use a service object with `Net::HTTP` or the project's existing HTTP library:

```rb
require "json"
require "net/http"

uri = URI("https://api.cli-blog.com/v1/posts")
uri.query = URI.encode_www_form(
  status: "published",
  locale: "en-US",
  fields: "summary,seo",
  include: "authors",
  limit: 20,
)

request = Net::HTTP::Get.new(uri)
request["x-api-key"] = ENV.fetch("CLI_BLOG_PUBLIC_API_KEY")

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }
raise "Cli Blog returned #{response.code}" unless response.is_a?(Net::HTTPSuccess)
posts = JSON.parse(response.body).fetch("data")
```

## Go

Use a reusable `http.Client` with a timeout and decode the list envelope:

```go
client := &http.Client{Timeout: 10 * time.Second}
req, err := http.NewRequest("GET", "https://api.cli-blog.com/v1/posts?status=published&locale=en-US&fields=summary%2Cseo&include=authors&limit=20", nil)
if err != nil {
    return err
}
req.Header.Set("x-api-key", os.Getenv("CLI_BLOG_PUBLIC_API_KEY"))

res, err := client.Do(req)
if err != nil {
    return err
}
defer res.Body.Close()
if res.StatusCode < 200 || res.StatusCode >= 300 {
    return fmt.Errorf("cli blog returned %s", res.Status)
}
```

## CI And Static Builds

- Store keys in the CI provider's encrypted environment settings.
- Use a public key for builds that only fetch published content.
- Use a narrowly scoped private key for draft or publish automation.
- Use `expected_version` when updating an existing post.
- Emit IDs, slugs, locale, status, and safe request IDs as artifacts; never emit credentials.
- Use CLI `--demo` only for parser and workflow smoke tests, then run a real non-destructive read against the intended environment before release.
