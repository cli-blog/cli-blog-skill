# Direct API

Use direct HTTP when the project is not JavaScript/Node or when the user explicitly wants raw API calls.

Base URL:

```txt
https://api.cli-blog.com
```

Authentication:

```txt
x-api-key: cli_blog_pk_... or cli_blog_sk_...
```

Rules:

- Use JSON bodies for non-file creates and updates.
- Use multipart upload only for media files.
- Use query parameters for list filters, sorting, pagination, locale, fields, and includes.
- Use `GET` for reads, `POST` for creates/updates, and `DELETE` for deletes.
- Do not expose dashboard-only settings or session APIs as public API-key routes.

Read posts:

```sh
curl "https://api.cli-blog.com/v1/posts?status=published&fields=summary,seo&include=authors" \
  -H "x-api-key: $CLI_BLOG_PUBLIC_KEY"
```

Create a post:

```sh
curl "https://api.cli-blog.com/v1/posts" \
  -H "x-api-key: $CLI_BLOG_PRIVATE_KEY" \
  -H "content-type: application/json" \
  -d '{"title":"A developer'\''s guide to San Francisco","body_markdown":"## Fog, hills"}'
```

Handle `401`, `403`, `404`, `409`, `429`, and `5xx` explicitly.
