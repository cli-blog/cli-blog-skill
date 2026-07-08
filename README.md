# Cli Blog Agent Skill

Use this skill to help AI agents add [Cli Blog](https://cli-blog.com) to software projects through the public API, the `@cli-blog/node` SDK, or the `@cli-blog/cli`.

## What It Helps With

- Choosing between the dashboard, Node SDK, CLI, and direct HTTP API.
- Adding blog index and post pages to common frameworks.
- Publishing Markdown posts from scripts, CI, or agent workflows.
- Working with authors, media, categories, tags, locales, sitemap XML, feed XML, revisions, and slug redirects.
- Protecting API keys by keeping private keys on trusted servers and using public keys for published-content reads.

## Install For Codex / OpenAI Agents

Clone the repository:

```sh
git clone https://github.com/cli-blog/cli-blog-skill.git
```

Install it for your user-level Codex configuration:

```sh
mkdir -p ~/.codex/skills
cp -R cli-blog-skill/cli-blog ~/.codex/skills/cli-blog
```

Or install it in one project using the shared agent-skills convention:

```sh
mkdir -p .agents/skills
cp -R cli-blog-skill/cli-blog .agents/skills/cli-blog
```

Restart or reload the agent after installation so it discovers `cli-blog/SKILL.md`. OpenAI-facing metadata lives at `cli-blog/agents/openai.yaml`.

## Install For Claude Code

Claude Code commonly reads `CLAUDE.md` project instructions. This repository includes a root `CLAUDE.md` that tells Claude how to use the bundled skill.

```sh
git clone https://github.com/cli-blog/cli-blog-skill.git
```

Install the skill in a Claude Code project:

```sh
mkdir -p .claude/skills
cp -R cli-blog-skill/cli-blog .claude/skills/cli-blog
```

The root `CLAUDE.md` is optional project guidance for repositories that want to route matching tasks to the installed skill.

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
- Use `cli-blog posts list --demo --json` for a no-setup smoke test.
- Use direct HTTP for PHP, Laravel, Python, Django, Rails, Go, and other non-JavaScript backends.
