# Basal Pay — Home V1

A Next.js/React prototype of the Basal Pay Home V1 screen. The application is a
**mock-only, visual-fidelity implementation**: it has no backend, authentication,
persistence, or production payment flow.

## Start here

Read [`index.md`](./index.md) before changing the code. It records the Figma
sources, current visual baseline, feature boundaries, verification workflow and
rules for adding the next screen.

## Requirements

- Node.js **22.13.0+** (the repository pins `pnpm@11.7.0`, which requires it)
- Corepack enabled: `corepack enable`
- Install a Playwright browser once: `pnpm exec playwright install chromium`

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm run lint
pnpm run typecheck
pnpm run verify:visual
pnpm run verify
```

`verify:visual` starts an isolated local Next.js server, writes ignored output
to `shots/`, runs the Home V1 pixel diff, and exercises the interactive states.
If a managed Playwright browser is unavailable, set `CHROME_BIN` to a compatible
local Chromium executable for the command.
