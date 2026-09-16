# Basal Pay Home V1 — Worktree Index

> **Last audited:** September 14, 2026  
> **Status:** UI prototype / visual-fidelity implementation. Mock data only; no
> API, authentication, persistence, analytics, deployment, or payment execution.

## Design sources

| Purpose | Figma source | Local artifact | Status |
| --- | --- | --- | --- |
| Design workspace | [Basal Pay App revamp UI — node 1671-3912](https://www.figma.com/design/rh4bwIoO7aqCjZlEOGBEHO/%F0%9F%94%B5-Basal-pay---App-revamp-UI?node-id=1671-3912&p=f&m=dev) | — | Canonical design workspace |
| Home V1 visual baseline | [Home node 1671-3913](https://www.figma.com/design/rh4bwIoO7aqCjZlEOGBEHO/%F0%9F%94%B5-Basal-pay---App-revamp-UI?node-id=1671-3913&p=f&m=dev) | `reference/home/v1/node-1671-3913.png` | Current 393 × 852 baseline; re-export and re-approve before replacing |

Baseline SHA-256: `4cd15c7ba9d74d49180895e7d07eb74803a27ed08fbb1ab5297571455869baf3`.

The two nodes have different roles: node `1671-3912` is the design workspace;
node `1671-3913` is the Home V1 frame used by local pixel regression. Do not
claim that a local implementation matches a newer Figma revision until its
export has replaced the tracked baseline deliberately.

## Worktree map and ownership

```text
src/
├── app/                       # Next.js routes, metadata, global tokens/reset
├── features/
│   └── home/                  # Home-only UI, modal state/types, fixtures, styles
│       ├── fixtures/          # Explicit demo data; never production API clients
│       ├── model/             # Home domain and UI-state types
│       ├── styles/            # Home class styles and design geometry
│       └── ui/                # Home composition and Home-only components
└── shared/                    # Reusable primitives only; must not import features
    ├── lib/                   # Stateless utilities
    ├── styles/                # Device canvas and dialog styles
    └── ui/                    # Bottom sheet, device scaler, SVG icons

public/assets/home/            # Runtime Home assets
reference/home/v1/             # Versioned, tracked visual baselines
scripts/visual-regression/home/# Deterministic visual and interaction tooling
shots/                         # Ignored generated screenshots/diffs only
```

### Import boundary

- `app` may import `features` and `shared`.
- A feature may import only itself and `shared`.
- `shared` must never import from `features` or `app`.
- Put a component in `shared` only when it is genuinely reusable now; do not
  create speculative entity, API, store, or design-system layers.

## Development and quality gate

The repository uses `pnpm@11.7.0`, which requires Node.js **22.13.0+**. Use
`.nvmrc` (or an equivalent version manager), then enable Corepack and install
the Playwright browser once.

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev                         # http://localhost:3000
pnpm run lint                    # local ESLint binary
pnpm run typecheck               # local TypeScript binary, no emit
pnpm run verify:visual           # isolated server + pixel diff + interactions
pnpm run verify                  # lint → typecheck → visual verification
```

`verify:diff`, `verify:interactions`, `verify:text`, and `verify:regions` are
lower-level commands. They expect an already-running application URL through
`URL`; use `verify:visual` for the standard local check. If the managed browser
is unavailable, set `CHROME_BIN` to a compatible local Chromium executable.

## Audit findings and decisions

| Area | Decision |
| --- | --- |
| Source structure | Feature-first, minimum-refactor layout. Route `/` and current UI behavior stay unchanged. |
| Styling | Global CSS contains only tokens/reset; device, dialog, and Home styles are owned by their relevant layers. Existing class names and measured geometry remain intact for fidelity. |
| UI state | Home modal union and transaction types are colocated in `features/home/model`; mock content stays in `features/home/fixtures`. |
| Accessibility | Bottom sheet preserves native button semantics, Escape close, visible focus, reduced-motion support, plus focus containment and trigger-focus return. |
| Visual checks | Reference PNG is tracked; `shots/` is generated/ignored. Do not commit diff outputs or temporary fit previews. |
| Tooling | Node/Pnpm compatibility is pinned through `.nvmrc`, `engines`, and `packageManager`; quality commands use local installed binaries. |

## Adding the next screen or feature

1. Confirm the specific Figma node and its intended visual baseline before writing UI.
2. Create `src/features/<feature>/` with `ui/`, `model/`, `fixtures/`, and
   `styles/` only when those folders have real content.
3. Keep route composition in `src/app/`; do not import a feature from `shared`.
4. Add runtime assets beneath `public/assets/<feature>/`; keep Figma export
   baselines under `reference/<feature>/<version>/` with node ID in the name.
5. Add/update interaction and visual checks under
   `scripts/visual-regression/<feature>/`; generated screenshots stay in `shots/`.
6. Run `pnpm run verify` and inspect the intended Figma frame before review.
