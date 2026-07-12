# Cli Blog Skill For Claude

Use the bundled `SKILL.md` when the user asks Claude to add or operate Cli Blog in a project.

Relevant tasks include:

- Add blog publishing to an app.
- Integrate the Cli Blog API, `@cli-blog/node`, or `@cli-blog/cli`.
- Fetch published posts, authors, related media, categories, tags, sitemap XML, or feed XML.
- Create draft-review-publish workflows from scripts, CI, backend jobs, or agent runtimes.
- Work with localization, translations, SEO, revisions, redirects, relation filters, and pagination.
- Choose a safe integration pattern for Next.js, React, Astro, Remix, PHP, Laravel, Python, Django, Rails, Go, or another backend.

When using the skill:

1. Read `SKILL.md`.
2. Read `references/content-model.md` for content-shape decisions, then load only the needed surface or workflow reference.
3. Keep private API keys on trusted servers.
4. Prefer examples that the user can paste into their project.
5. Use optimistic concurrency for updates and verify through the intended delivery surface.
