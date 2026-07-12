# Content Model

Use this reference when choosing fields, relationships, workflow state, localization, or list behavior.

## Contents

- Posts and response shaping
- Filters and sorting
- Localization
- Authors, categories, and tags
- Media and image delivery
- SEO, revisions, redirects, feed, and sitemap
- Pagination

## Posts

Store post source in `body_markdown`. Create related resources first and assign their stable IDs through:

- `author_profile_ids`
- `category_ids`
- `tag_ids`
- ordered `media_asset_ids`
- `featured_media_asset_id`

Use these statuses: `draft`, `in_review`, `scheduled`, `published`, and `archived`. Treat `status` as canonical. A scheduled post also needs an ISO `scheduled_at` value. Use `expected_version` on concurrent updates.

## Response Shaping

Identity fields `id`, `object`, `content_type`, `organization_id`, and `locale` are always returned.

| Field group | Returned fields |
| --- | --- |
| `summary` | `title`, `slug`, `excerpt`, `is_featured`, `featured_media_asset_id`, `media_asset_ids`, `published_at`, `created_at`, `updated_at` |
| `content` | `body_markdown` |
| `seo` | SEO title/description, canonical URL, focus keyphrase, keywords, robots, Open Graph, X/Twitter, and schema type |
| `workflow` | `status`, `scheduled_at`, `version` |
| `metadata` | integration-defined `metadata` |

Post lists default to `summary`; post retrieval defaults to every field group. Add only the relations the consumer renders:

- `authors`
- `categories`
- `tags`
- `media`
- `translations`

Use `fields: ["summary", "seo"]` plus `include: ["authors"]` for a typical index. Add `content` for a detail page and `workflow` for previews or editorial tools.

## Filters And Sorting

Filter posts by locale, status, featured state, search, authors, categories, or tags. Use IDs when the integration already stores stable references and locale-scoped slugs when routing from a URL.

Relation dimensions combine with AND. Values within a dimension default to `any`; set `author_match`, `category_match`, or `tag_match` to `all` when every requested relation must match. Use `exclude_author_*`, `exclude_category_*`, and `exclude_tag_*` for none-of matching.

Sort by `published_at`, `created_at`, `updated_at`, or `relevance`, with `asc` or `desc`. Use `relevance` with search.

## Localization

Use curated BCP 47 tags returned by `GET /v1/locales`. Omitted locale uses organization defaults; V1 never falls back between locales.

Create a translation by passing the existing localized resource ID as `translation_of_id`. Posts inherit authors, taxonomy concept assignments, and shared media from the source translation unless the create request overrides them. Categories and tags use shared concept IDs with localized names, slugs, descriptions, and SEO fields.

Use `include: ["translations"]` to expose available localized variants. Slug lookups remain locale-scoped.

## Authors

Create public byline profiles before assigning them to posts. Authors include `public_name`, slug, bio, optional avatar media, website, and metadata. Use `member_id` only when deliberately linking the byline to an existing organization member; standalone authors do not need it.

## Categories And Tags

Use categories for hierarchy and navigation and tags for flat topical labels. Categories support a root plus two child levels through `parent_taxonomy_term_id`. Assign the stable shared taxonomy ID to posts so localized variants remain connected.

## Media

Upload files first; do not register external URLs. Cli Blog generates the storage URL and file metadata. Update only editorial metadata such as alt text, caption, and integration metadata.

Keep ordered attachments in `media_asset_ids`. Featured, Open Graph, and X/Twitter media remain separate IDs. Removing an attachment from a post does not delete the media asset.

Public keys receive referenced media from published posts with `include=media`; direct `/v1/media` inventory calls require a private key. Keep provider-specific storage details out of application contracts.

Transform an image by adding documented query parameters to the returned delivery URL; the stored source remains unchanged. Use a small intentional set of variants:

- `width` and `height` for resizing
- `aspect_ratio`, `crop`, `crop_gravity`, or `focus_crop` for placement-specific crops
- `format` with `avif`, `webp`, `jpeg`, `png`, or `gif`
- `quality` from 0 to 100 for lossy formats
- `upscaling`, `sharpen`, and `blur` when the design requires them

Prefer responsive `srcset` widths aligned with layout breakpoints. Preserve transparency with PNG, WebP, or AVIF instead of JPEG. Start photographic quality around 75–85 and inspect the rendered result. Do not generate arbitrary transformation combinations without a real layout need.

Keep the fixed per-file upload ceiling separate from organization storage usage. Do not guess current plan allowances; handle `429 plan_limit_exceeded` and direct the user to current dashboard usage or pricing documentation.

## SEO And Discovery

Use the post or taxonomy SEO fields only when the integration has meaningful values. Prefer a strong title, excerpt, canonical URL, and robots decision over filling every override.

- Set `robots_index: false` to exclude a post from sitemap and feed discovery.
- Use `/v1/sitemap` for indexable published URLs and localized alternate links.
- Use `/v1/feed` for one locale of recent published, indexable posts; feed descriptions use excerpts, not full Markdown.
- Link the sitemap from the product's `robots.txt` and the feed from the document head.
- Resolve a changed post slug through `/v1/posts/slug-redirects/{slug}` and issue the returned status code to the new slug.
- Read revisions for audit or restoration; restore by updating the current post with selected revision content and the current `expected_version`.

## Pagination

Use cursor pagination for agents and background work:

1. Request `limit` from 1 to 100.
2. Process `data`.
3. Pass `next_cursor` as `after` without changing the query.
4. Stop when `has_more` is false.

Use `page` and optional `per_page` only for exact totals. Numbered responses add `page`, `per_page`, `total_items`, and `total_pages`. Never combine `page`/`per_page` with `after`/`limit`.
