---
name: fairy-tale
description: >
  Work in the Fairy-tale-generator Next.js app: where the code lives, how to run
  and test it, and the rules for stories and the Russian/Kazakh interface.
  Use when editing this repository, adding a page, changing generation,
  validation, prompts, or the site language switcher, or when the user runs
  /fairy-tale.
---

# Fairy-tale generator

This is a Next.js App Router app at the repository root. Read `node_modules/next/dist/docs/` before using a Next.js API. Leave the generated block in `AGENTS.md` in place.

Visual rules live in `/fairy-tale-ui`. Do not restate colors or motion here.

## Map

- `src/domain` is pure and tested: catalog, Zod request, prompts, SSE framing, locale, copy.
- `src/server` reads env, Prisma, and the xAI stream. The model key is `XAI_API_KEY` and never reaches the client. Default model is `grok-4.7` (`XAI_MODEL`).
- `src/app` is `/`, `/history`, `/stories/[id]`, and `/api/health`, `/api/stories`, `/api/stories/[id]`.
- The browser talks only to Next.js. Generation streams on `/` through `StoryStudio`. There is no `/generate` route and no `sessionStorage` draft.

## Locale

`ui-locale` is a cookie (`ru` default, `kk` only when the value is exactly `kk`). The server reads it for `lang`, titles, and server-rendered copy. The header control is labeled «Русский» and «Қазақша» in both languages.

The form field «Язык сказки» chooses the language of the generated text. A fresh form defaults that field to the interface locale. Returning from «Параметры» keeps the saved request.

API and SSE errors stay the canonical Russian strings. The client translates the known ones when the interface is Kazakh. The default Zod schema stays Russian so the API and the existing tests do not change; the form builds a locale-specific schema. Prompts stay as ported: Russian and Kazakh, 600–1200 words.

## Checks

```bash
export PATH="$HOME/.local/bin:$PATH"
npm test
npm run lint
```

Tests must not call the live model or the database. Postgres for a manual run is the existing Compose service on port 5432 (`story` / `story` / `storydb`). Do not create a second database. `npm run build` runs `prisma generate` first.

Day-to-day commands live in the justfile. Run `just --list`.

On this machine, Git is `git.exe`. Node is `~/.local/bin`. After adding files, restart `npm run dev` with `WATCHPACK_POLLING` and `CHOKIDAR_USEPOLLING`: Turbopack on `/mnt/c` misses new files. Windows Chrome opens the WSL eth0 address from `hostname -I`, not `127.0.0.1`. A 390px screenshot needs device-metrics emulation, not only `--window-size`. Next dev blocks scripts for that host until the address is added to `allowedDevOrigins` for the session. Remove that address before a commit.

Do not commit, push, or add an API key unless the user asks. Do not restore PHP or Python.
