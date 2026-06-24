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

## PHP

Use direct API calls from the server. Keep keys in environment variables.

```php
<?php

$apiKey = getenv('CLI_BLOG_PUBLIC_KEY');
$url = 'https://api.cli-blog.com/v1/posts?status=published&fields=summary,seo&include=authors';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['x-api-key: ' . $apiKey]);

$response = curl_exec($ch);
$posts = json_decode($response, true);
curl_close($ch);
```

## Laravel

Use Laravel's HTTP client from controllers, jobs, or services.

```php
use Illuminate\Support\Facades\Http;

$posts = Http::withHeaders([
    'x-api-key' => config('services.cli_blog.public_key'),
])->get('https://api.cli-blog.com/v1/posts', [
    'status' => 'published',
    'fields' => 'summary,seo',
    'include' => 'authors',
])->json();
```

Store keys in `.env` and expose them through `config/services.php`, not frontend JavaScript.

## Python

Use direct API calls from backend code, scripts, or jobs.

```py
import os
import requests

response = requests.get(
    "https://api.cli-blog.com/v1/posts",
    headers={"x-api-key": os.environ["CLI_BLOG_PUBLIC_KEY"]},
    params={"status": "published", "fields": "summary,seo", "include": "authors"},
    timeout=10,
)
response.raise_for_status()
posts = response.json()
```

## Django

Keep API calls in views, management commands, Celery tasks, or service modules.

```py
import requests
from django.conf import settings
from django.shortcuts import render

def blog_index(request):
    response = requests.get(
        "https://api.cli-blog.com/v1/posts",
        headers={"x-api-key": settings.CLI_BLOG_PUBLIC_KEY},
        params={"status": "published", "fields": "summary,seo", "include": "authors"},
        timeout=10,
    )
    response.raise_for_status()
    return render(request, "blog/index.html", {"posts": response.json()["data"]})
```

## Ruby On Rails

Use server-side HTTP from controllers, jobs, or service objects.

```rb
require "net/http"
require "json"

uri = URI("https://api.cli-blog.com/v1/posts")
uri.query = URI.encode_www_form(status: "published", fields: "summary,seo", include: "authors")

request = Net::HTTP::Get.new(uri)
request["x-api-key"] = ENV.fetch("CLI_BLOG_PUBLIC_KEY")

response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(request) }
posts = JSON.parse(response.body)
```

## Go

Use server-side HTTP clients and pass the API key in the `x-api-key` header.

```go
req, _ := http.NewRequest("GET", "https://api.cli-blog.com/v1/posts?status=published&fields=summary,seo", nil)
req.Header.Set("x-api-key", os.Getenv("CLI_BLOG_PUBLIC_KEY"))

res, err := http.DefaultClient.Do(req)
if err != nil {
  return err
}
defer res.Body.Close()
```
