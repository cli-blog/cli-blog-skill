# Complete Workflows

Use these sequences as patterns. Adapt names and fields to the user's project instead of copying demo identifiers.

## Contents

- Draft, review, publish, and deliver
- Translate a published post
- Update without overwriting an editor
- Restore revision content
- Handle a changed slug
- Serve feed and sitemap XML

## Draft, Review, Publish, Deliver

1. Create or reuse a private key with only the resources and actions needed for drafting.
2. Upload referenced media and capture its ID.
3. Create or retrieve an author, category, and tags.
4. Create the post with `status: "draft"`, Markdown, relationships, ordered attachments, and useful SEO fields.
5. Retrieve the draft with `fields: ["summary", "content", "seo", "workflow"]` and the relations needed for review.
6. Return the post ID, slug, locale, status, and version to the user or editor.
7. After explicit approval, publish with the latest `expected_version` using a key that has `posts:publish`.
8. Retrieve the published post with a public key and the lean delivery shape used by the frontend.

```ts
import { readFile } from "node:fs/promises";
import { CliBlog } from "@cli-blog/node";

const blog = new CliBlog({ apiKey: process.env.CLI_BLOG_PRIVATE_API_KEY! });

const imageBytes = await readFile("./release-workflow.png");
const image = await blog.media.upload({
  file: new Blob([imageBytes], { type: "image/png" }),
  filename: "release-workflow.png",
  alt_text: "Release workflow from draft through review and publishing",
});

const author = await blog.authors.create({ public_name: "Maya Chen" });
const category = await blog.categories.create({ name: "Engineering", locale: "en-US" });
const tag = await blog.tags.create({ name: "Release notes", locale: "en-US" });

const draft = await blog.posts.create({
  title: "How we ship release notes",
  locale: "en-US",
  status: "draft",
  excerpt: "A repeatable draft, review, and publish workflow.",
  body_markdown: "## Draft\n\nStart with the change and the reader outcome.",
  author_profile_ids: [author.id],
  category_ids: [category.id],
  tag_ids: [tag.id],
  featured_media_asset_id: image.id,
  media_asset_ids: [image.id],
  seo_title: "How we ship release notes",
  seo_description: "A practical release-note publishing workflow.",
});

const review = await blog.posts.get(draft.id, {
  fields: ["summary", "content", "seo", "workflow"],
  include: ["authors", "categories", "tags", "media"],
});

// Run only after the user or editorial workflow approves publication.
const published = await blog.posts.publish(review.id, {
  expected_version: review.version,
});

console.log({
  id: published.id,
  locale: published.locale,
  slug: published.slug,
  status: published.status,
  version: published.version,
});
```

Use a public client for delivery rather than reusing the private key:

```ts
const delivery = new CliBlog({ apiKey: process.env.CLI_BLOG_PUBLIC_API_KEY! });
const post = await delivery.posts.get("how-we-ship-release-notes", {
  locale: "en-US",
  fields: ["summary", "content", "seo"],
  include: ["authors", "categories", "tags", "media", "translations"],
});
```

## Translate A Published Post

1. Fetch the source with translations and the relations needed for context.
2. Check `GET /v1/locales` before accepting the target locale.
3. Create a new post with the target locale and `translation_of_id` set to the source post ID.
4. Omit authors, taxonomy IDs, and shared media to inherit them, or pass explicit arrays to override them.
5. Keep the translation as a draft for review, then publish it separately.

```ts
const source = await blog.posts.get("how-we-ship-release-notes", {
  locale: "en-US",
  fields: ["summary", "content", "workflow"],
  include: ["translations"],
});

const translation = await blog.posts.create({
  title: "Cómo publicamos notas de lanzamiento",
  slug: "como-publicamos-notas-de-lanzamiento",
  locale: "es-MX",
  translation_of_id: source.id,
  status: "draft",
  body_markdown: "## Borrador\n\nEmpieza con el cambio y el resultado para el lector.",
});
```

Create localized category and tag variants with the same `translation_of_id` pattern and continue assigning their stable shared IDs.

## Update Without Overwriting An Editor

1. Retrieve the post with `workflow` and the fields being edited.
2. Prepare the change against that response.
3. Send `expected_version` with the update.
4. On `409`, fetch again, show the conflict, and merge deliberately instead of retrying blindly.

```ts
const current = await blog.posts.get("how-we-ship-release-notes", {
  locale: "en-US",
  fields: ["summary", "content", "workflow"],
});

await blog.posts.update(
  current.id,
  {
    excerpt: "An updated guide to our draft, review, and publishing workflow.",
    expected_version: current.version,
  },
  { locale: current.locale },
);
```

## Restore Revision Content

List revisions, retrieve the selected snapshot, then update the current post. A revision read does not mutate current content.

```ts
const revisions = await blog.posts.revisions.list("post_123", { limit: 20, locale: "en-US" });
const snapshot = await blog.posts.revisions.get("post_123", revisions.data[0]!.id, { locale: "en-US" });
const current = await blog.posts.get("post_123", { locale: "en-US", fields: ["workflow"] });

await blog.posts.update(
  current.id,
  { body_markdown: snapshot.body_markdown, expected_version: current.version },
  { locale: "en-US" },
);
```

## Handle A Changed Slug

When the frontend receives a not-found result for an old slug, resolve it and redirect to the returned `to_slug` with the returned `status_code`.

```ts
const redirect = await delivery.posts.slugRedirects.get("old-release-process", { locale: "en-US" });
return Response.redirect(`/blog/${redirect.to_slug}`, redirect.status_code);
```

## Serve Feed And Sitemap From The Product Domain

Fetch XML with a public key and proxy or write it to `/feed.xml` and `/sitemap.xml` on the user's domain. Preserve the XML content type and refresh after publication changes.

```ts
const [feedXml, sitemapXml] = await Promise.all([
  delivery.feed.get({ locale: "en-US", limit: 50 }),
  delivery.sitemap.get({ limit: 50_000 }),
]);
```

Return feed XML as `application/rss+xml; charset=utf-8` and sitemap XML as `application/xml; charset=utf-8`. Link `/sitemap.xml` from `robots.txt` and advertise `/feed.xml` with an alternate RSS link in the document head.
