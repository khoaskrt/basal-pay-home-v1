# Product

## Register

product

## Users

People who hold and spend USDT/crypto while traveling or transacting across borders — the kind of user who wants their crypto wallet to also smooth out travel logistics (connectivity, getting around, booking trips). They're on a phone, often mid-errand or mid-trip, and expect a native-feeling iOS money app, not a crypto-exchange-style dashboard.

## Product Purpose

Basal Pay is a USDT wallet app (balance, deposit/send, transaction history). The "Utilities" section on the home screen is a quick-access row to travel-adjacent services — Map, E-sim, Flights, Tours — for users spending crypto abroad. Some utilities ship later ("Soon"). Success looks like: users immediately understand what's tappable now vs. coming later, and the row reads as a natural extension of a trustworthy money app rather than a bolted-on feature grid.

## Brand Personality

Minimal, trustworthy, lean. Reference lane: Revolut / N26 — clean, generous whitespace, restrained color, modern digital-bank confidence. Not playful/gimmicky, not maximalist crypto-native.

## Anti-references

- The current implementation itself: four evenly-spaced circular icon chips with a label underneath, one per column. Do not reproduce this pattern — it reads as a dated, generic app-icon row.
- Heavy glassmorphism / neumorphism (2021-Dribbble-style frosted blur and 3D soft shadows).
- Gradient-drenched SaaS cards (purple-to-pink gradient tiles, marketing-page clichés).

## Design Principles

- Stay light-minimal and consistent with the rest of the app (`--bp-page`, `--bp-surface`, existing text/accent tokens) — this section upgrades layout and interaction, not the app's overall color system.
- Restrained color: accents identify each utility, they don't compete with the balance card above for attention.
- Hierarchy communicates state (available now vs. "Soon") through structure and weight, not just a small badge — the current tappable utility (Map) should read as clearly primary.
- Avoid template affordances — no uniform icon-in-circle grids, no repeated identical cards as the only idea.
- Travel-utility context should read as premium and trustworthy, in keeping with a money app, not a playful lifestyle-app gimmick.

## Accessibility & Inclusion

Standard good practice: WCAG AA contrast, minimum ~44px tap targets on mobile, respect `prefers-reduced-motion`. No unusual requirements beyond that.
