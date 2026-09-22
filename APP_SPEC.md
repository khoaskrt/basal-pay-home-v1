# App Spec — Basal Pay Home V1 (Runtime Behavior & Logic)

> **Purpose:** this is the single file that explains **how the app actually
> works at runtime** — screens, state, data flow, and the current interaction
> lock — so any agent can read this one file and understand the whole app
> without re-reading every source file.
>
> This file does **not** duplicate:
> - [`README.md`](./README.md) — install/run/quality-check commands.
> - [`index.md`](./index.md) — worktree map, ownership, import-boundary rules,
>   Figma baseline tracking, checklist for adding a new screen.
> - [`PRODUCT.md`](./PRODUCT.md) — target users, product purpose, brand
>   personality.
> - [`DESIGN.md`](./DESIGN.md) — color/typography/elevation design tokens and
>   design-system rules.
>
> Read those for "why it looks/is positioned this way." Read this for "what
> happens when a user taps something."

## 1. Stack snapshot

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**, `pnpm@11.7.0`,
  Node `>=22.13.0`.
- Everything is a **client component** (`"use client"`); there are no server
  components with real logic and no API routes.
- **Mock-only prototype**: no backend, no authentication, no persistence, no
  real payment execution, no analytics. Every "network" action (refresh,
  deposit, withdraw, mark-as-read, share, report) is simulated with a toast
  message and/or in-memory state change.
- **Styling**: Tailwind CSS v4 is wired into the build pipeline but barely
  used in JSX. Actual UI styling is hand-written CSS per feature
  (`features/home/styles/home.css`, `features/map/styles/map.css`,
  `shared/styles/device.css`, `shared/styles/bottom-sheet.css`), driven by CSS
  custom properties (`--bp-*`) defined in `src/app/globals.css`, 1:1 sourced
  from a fixed 393×852 Figma canvas (see `index.md` for the baseline).
- **State management**: plain React `useState`/`useMemo`/`useCallback`/
  `useRef`/`useEffect`. No Context providers, no Redux/Zustand/Jotai, no
  React Query/SWR. State lives in the top-level screen components and is
  prop-drilled down to dumb children.

## 2. Screens & how they connect

There is exactly **one real route**: `/` (`src/app/page.tsx`, `HomePage`).
"Home" and "Map" are **not separate URLs** — they are two panes swapped by
local component state inside `HomePage`:

```tsx
// src/app/page.tsx
const [screen, setScreen] = useState<"home" | "map">("home");
const [mapMounted, setMapMounted] = useState(false);

function openMap() {
  setMapMounted(true); // Map is lazily mounted on first open, then stays mounted
  setScreen("map");
}
```

- `MapScreen` is loaded via `next/dynamic(..., { ssr: false })` to keep
  `maplibre-gl` out of the initial bundle.
- Once opened, Map is **never unmounted** — going back to Home and re-opening
  Map does not recreate the maplibre instance or reset its state.
- The visual transition is pure CSS in `shared/styles/device.css`, driven by
  a `data-open` attribute on `.app-shell`:
  ```css
  .app-shell__pane--map { transform: translateX(100%); }
  .app-shell[data-open="map"] .app-shell__pane--home { transform: translateX(-14%); }
  .app-shell[data-open="map"] .app-shell__pane--map { transform: translateX(0); }
  ```
  This produces an iOS-style push transition (0.38s), not a route change.

Within **Home**, everything else that looks like "navigation" (Spend,
Deposit, Notifications, Account, All Transactions, Transaction Detail) is
actually a **bottom sheet modal** layered on the same screen — see §4.

Within **Map**, tapping a zone does not navigate anywhere either — it expands
an in-place detail sheet (see §6).

## 3. Component tree

```
RootLayout (src/app/layout.tsx)
└── HomePage (src/app/page.tsx)                — owns: screen, mapMounted
    └── ScreenScaler (shared/ui/ScreenScaler.tsx)   — computes --bp-scale on resize
        └── DeviceFrame (shared/ui/DeviceFrame.tsx) — iPhone Pro Max bezel + Dynamic Island
            └── .app-shell[data-open]
                ├── .app-shell__pane--home
                │   └── HomeScreen (features/home/ui/HomeScreen.tsx)
                │       ├── StatusBar
                │       ├── HomeHeader          (avatar, greeting, bell + unread badge)
                │       ├── BalanceCard          (verified/zone badge, eye toggle, Deposit/Send)
                │       ├── TransactionSheet
                │       │   ├── UtilitiesSection (Map / E-sim / Flights / Tours grid)
                │       │   └── TransactionRow[] (preview list, first 8)
                │       ├── BottomNav            (Home / Spend FAB / Account)
                │       ├── HomeModals           (renders whichever modal is active)
                │       │   └── BottomSheet (shared/ui/BottomSheet.tsx)
                │       └── toast (conditional)
                └── .app-shell__pane--map (mounted only after first openMap())
                    └── MapScreen (features/map/ui/MapScreen.tsx)
                        ├── .map-canvas          (maplibre-gl mount target, via useZoneMap)
                        ├── MapHeader            (back, title, in/out-of-zone pill, group filter chips)
                        ├── button.map-locate    (fly-to-user)
                        ├── ZoneSheet
                        │   └── ZoneListRow[]    (uses useLongPress)
                        ├── ZoneContextMenu (conditional, on long-press)
                        └── toast (conditional)
```

`HomeScreen` and `MapScreen` are the only "smart" components in each feature
— they own state and pass callbacks/data down as props. Everything under
them is presentational, except `UtilitiesSection` (imports `UTILITIES`
directly) and `HomeModals` (imports `NOTIFICATIONS`/`USER` directly).

## 4. Home state & modal system

`HomeScreen` (`src/features/home/ui/HomeScreen.tsx`) owns:

- `hidden: boolean` — whether the balance amount is masked.
- `tab: "home" | "account"` — bottom nav active tab.
- `modal: HomeModal` — which bottom sheet is open. Defined in
  `src/features/home/model/modal.ts` as a discriminated union:
  ```ts
  type HomeModal =
    | { kind: "none" }
    | { kind: "spend" }
    | { kind: "deposit" }
    | { kind: "notifications" }
    | { kind: "account" }
    | { kind: "all" }
    | { kind: "tx"; tx: Transaction };
  ```
  `HomeModals` is a single conditional block keyed on `modal.kind`; only one
  sheet can be open at a time. Closing (via `BottomSheet`'s Escape/backdrop/
  close-button handling) sets `modal` back to `{ kind: "none" }`.
- `toast: string | null` — a message shown briefly (`flash(message)` helper
  sets it, then a `setTimeout` of ~1.8–1.9s clears it). Used for every
  simulated action that doesn't open a modal (e.g. pull-to-refresh).
- `readIds` — set of notification ids marked read; the header's unread badge
  count is derived live from this (not from the `NOTIFICATIONS` fixture's
  static `unread` field).
- `list` — the transactions array (starts as `TRANSACTIONS` fixture,
  `refresh()` re-shuffles/re-dates it to simulate a pull-to-refresh).

## 5. Current interaction-lock mechanism (read this before assuming a control is broken)

**File:** `src/features/home/ui/HomeScreen.tsx`.

A module-level flag currently disables almost every Home-screen control:

```tsx
// TEMPORARY: only the Map utility button should react to taps; every other
// trigger on the home screen is locked. Flip this back to false (or delete
// the guard usages below) to restore normal behavior.
const LOCK_NON_MAP_TRIGGERS = true;
const noop = () => {};
const noopAsync = async () => {};
```

Every handler passed to a child is wrapped in `LOCK_NON_MAP_TRIGGERS ? noop : realHandler`
(or `noopAsync` for the async refresh handler). This is **not** driven by
props, config data, or per-control flags — it's one boolean guarding
individually-wired ternaries at each call site in `HomeScreen`'s JSX.

**Locked (no-op) while the flag is `true`:**
- Header avatar tap → would open Account modal
- Header bell tap → would open Notifications modal + mark all read
- Balance card eye icon → would toggle balance visibility
- Balance card "Deposit" button → would open Deposit modal
- Balance card "Send" button → would open Spend modal
- Transaction row tap → would open transaction detail modal
- "View all" link → would open All-Transactions modal
- Pull-to-refresh → would re-fetch/re-shuffle transactions and show a toast
- Bottom nav (Home/Account tabs, Spend FAB) → would switch tabs / open Spend

**Still live (not gated):** the **Map** tile inside `UtilitiesSection`, wired
through `TransactionSheet`'s `onOpenMap` prop, which is passed straight from
`HomePage`'s `openMap()` and is **not** wrapped by the lock. This is the only
way to reach the Map screen or trigger any state change from the Home screen
right now. (The other three utility tiles — E-sim, Flights, Tours — are
inherently non-interactive regardless of the lock, because their fixture
data sets `soon: true`.)

**To revert:** set `LOCK_NON_MAP_TRIGGERS = false` in `HomeScreen.tsx` (or
remove the ternaries and call the real handlers directly). No other file
needs to change — the real handlers already exist and are fully wired, just
short-circuited.

## 6. Map screen internals

`MapScreen` (`src/features/map/ui/MapScreen.tsx`) owns:

- `selectedId: string | null` — which zone's detail is expanded in the sheet.
- `filter` — active group filter (from `MapHeader`'s chips).
- `toast` — same flash-message pattern as Home.
- Derived data: `zones = withGeo(ZONES, USER)` (enriches each zone with
  `center`, `here: boolean`, `km` distance from the mock user location),
  `hereZone` (the zone the mock user is currently inside, if any),
  `visibleZones` (zones passing the active filter).

**`useZoneMap`** (`src/features/map/ui/useZoneMap.ts`) is an imperative hook
that owns the actual `maplibre-gl` `Map` instance:
- Creates the map once on mount (style: `https://tiles.openfreemap.org/styles/positron`,
  a token-free vector source — the `NEXT_PUBLIC_MAPBOX_TOKEN` env var is
  read but currently unused/dead).
- Adds a GeoJSON `zones` source plus `zones-fill`/`zones-line` layers, colored
  via feature-state (`here` / `selected`).
- Adds one DOM marker per zone label and a pulsing user-location marker.
- Wires click, hover, and a hand-rolled long-press (canvas pointer events) —
  this duplicates the logic in `useLongPress.ts` because it operates on the
  map canvas rather than a DOM list row.
- Exposes an imperative `controllerRef`: `fitAll`, `flyToZone`, `flyToUser`,
  `setSelected`, `setFilter`, `resize`. `MapScreen` calls these from
  `useEffect`s and event handlers instead of re-rendering the map.
- Cleans up all listeners/markers/the map instance on unmount (in practice
  this only happens if the whole app unmounts, since `mapMounted` never goes
  back to `false`).

**`useLongPress`** (`src/features/map/ui/useLongPress.ts`) is a generic
480ms-press-and-hold pointer-event detector (8px move cancels it), reused by
`ZoneListRow` to open `ZoneContextMenu` (Directions / Share / Report — all
mocked with toasts, no real destinations).

**Single source of truth rule:** "is the user inside a zone" is computed with
the same `isInAnyZone` / `isInsidePolygon` functions
(`src/features/map/model/geo.ts`) in **both** `HomeScreen` (for the balance
card's zone badge) and `MapScreen` (for the header pill), against the same
`ZONES`/`USER` fixtures. This is intentional — do not compute this
independently in a new place; import from `features/map/model/geo.ts` and
`features/map/fixtures/zones.ts` instead (this is the one sanctioned
cross-feature import — see `index.md`'s import-boundary rule for the general
case).

## 7. Data & fixtures (all mock, no network)

- `src/features/home/fixtures/home.ts`: `USER`, `BALANCE`
  (`{ usdt, rate, vnd }`), `UTILITIES` (4 tiles: `map` is enabled,
  `esim`/`flights`/`tours` have `soon: true`), `TRANSACTIONS` (10 seeded
  entries), `NOTIFICATIONS` (4 seeded entries).
- `src/features/home/model/types.ts` / `modal.ts`: `Transaction`,
  `Notification`, `UtilityId`, `Utility`, `HomeModal`.
- `src/features/map/fixtures/zones.ts`: `USER: LatLng` (Da Nang coords),
  `GROUPS` (area/airport/resort group metadata), `ZONES` (12 zones with
  polygon + mock nearby places).
- `src/features/map/model/types.ts` / `geo.ts`: zone/place types and the pure
  geo helper functions described in §6.
- `src/shared/lib/format.ts`: `formatAmount`, `formatInt`, `formatMoney`,
  `signedAmount`, `shortAddress`, `mask`.

There are no top-level `constants/`, `hooks/`, or `types/` directories —
everything is colocated per-feature.

## 8. Shared primitives

- **`DeviceFrame` + `ScreenScaler`** (`src/shared/ui/`): together render the
  "iPhone Pro Max preview frame." `ScreenScaler` computes a `--bp-scale` CSS
  variable on resize so the fixed 393×852 canvas fits the viewport;
  `DeviceFrame` renders the bezel/Dynamic Island. The bezel/shadow/radius
  chrome only appears at `min-width: 480px and min-height: 600px` — on an
  actual phone-sized viewport the screen renders full-bleed with no frame.
- **`BottomSheet`** (`src/shared/ui/BottomSheet.tsx`): the generic modal
  primitive used by every Home modal — focus trap, Escape-to-close, backdrop
  click, focus-return to the triggering element, ARIA roles.
- **`icons.tsx`**: every SVG icon used across the app as inline React
  components (no icon sprite/image files).
- All non-avatar visuals (status bar glyphs, balance-card gradient art) are
  inline SVG or CSS gradients, not images. The only runtime image asset is
  `public/assets/home/avatar.png`.

## 9. Non-goals / constraints to keep in mind

- No backend, auth, persistence, analytics, or real payment execution —
  every stateful action is in-memory only and resets on page reload.
- No real client-side routing (`next/navigation` is unused); the entire app
  is one route with state-driven panes/modals.
- Layout is authored as a **fixed 393×852 design**, not a fluid responsive
  layout — responsiveness comes only from `ScreenScaler`'s outer scale
  transform, not from internal reflow. Don't "fix" internal spacing to be
  responsive; that would fight the intended fixed-canvas approach (see
  `index.md`).
- `NEXT_PUBLIC_MAPBOX_TOKEN` is currently dead code — the map style URL is
  hardcoded to a token-free source.

## 10. Maintenance

Update this file whenever any of the following change, since they define
"how the app behaves" for the next agent that reads only this file:
- The screen list, the Home↔Map transition mechanism, or the modal set.
- `HomeModal`'s shape, or any new top-level state added to `HomeScreen`/`MapScreen`.
- **`LOCK_NON_MAP_TRIGGERS`** — if it's reverted to `false` or removed,
  update §5 to say all Home triggers are live again.
- The Map feature's hooks/controller API (`useZoneMap`'s `controllerRef`
  shape) or the zone/here single-source-of-truth pattern in §6.
