# Cli Blog Agent Skill

Use this skill to help AI agents add [Cli Blog](https://cli-blog.com) to software projects through the public API, the `@cli-blog/node` SDK, or the `@cli-blog/cli`.

## What It Helps With

- Choosing between the dashboard, Node SDK, CLI, and direct HTTP API.
- Adding blog index and post pages to common frameworks.
- Publishing Markdown posts from scripts, CI, or agent workflows.
- Working with authors, media, categories, tags, locales, sitemap XML, feed XML, revisions, and slug redirects.
- Protecting API keys by keeping private keys on trusted servers and using public keys for published-content reads.

## Install For Codex / OpenAI Agents

Copy or install the `cli-blog/` folder as a skill in your agent skills directory.

```sh
git clone https://github.com/cli-blog/cli-blog-skill.git
```

Then point your agent at:

```txt
cli-blog/SKILL.md
```

The OpenAI-facing metadata lives at:

```txt
cli-blog/agents/openai.yaml
```

## Install For Claude Code

Claude Code commonly reads `CLAUDE.md` project instructions. This repository includes a root `CLAUDE.md` that tells Claude how to use the bundled skill.

```sh
git clone https://github.com/cli-blog/cli-blog-skill.git
```

In Claude Code, open the cloned repository or copy `CLAUDE.md` and the `cli-blog/` folder into the workspace where you want Claude to use the skill.

The Claude-facing helper note lives at:

```txt
cli-blog/agents/claude.md
```

## Skill Contents

```txt
cli-blog/
  SKILL.md
  agents/
    openai.yaml
    claude.md
  references/
    api.md
    cli.md
    frameworks.md
    sdk.md
CLAUDE.md
```

## Example Prompts

```txt
Use the Cli Blog skill to add a blog index and post page to this Next.js app.
```

```txt
Use the Cli Blog skill to publish Markdown posts from CI with the CLI.
```

```txt
Use the Cli Blog skill to integrate published posts into this Django app.
```

## Notes

- Keep private API keys out of browser code.
- Use `@cli-blog/node` in trusted Node.js 20+ runtimes.
- Use `@cli-blog/cli --demo` for no-setup smoke tests.
- Use direct HTTP for PHP, Laravel, Python, Django, Rails, Go, and other non-JavaScript backends.
