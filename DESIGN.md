---
name: Basal Pay
description: A USDT wallet for spending crypto across borders — quiet, minimal, trustworthy.
colors:
  page-mist: "#f2f3f8"
  surface-white: "#ffffff"
  nav-ink: "#101727"
  brand-blue: "#2b59ff"
  brand-blue-deep: "#1f4ce8"
  brand-green: "#16bd73"
  brand-pink: "#f863ad"
  text-primary: "#05070c"
  text-heading: "#4a4e56"
  text-muted: "#a0a0a0"
  text-faint: "#90939b"
  chip-in-bg: "#d3e4ff"
  chip-in-fg: "#2c50fd"
  chip-out-bg: "#fcdcf3"
  chip-out-fg: "#f863ad"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "18px"
    letterSpacing: "-0.05px"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15.5px"
    fontWeight: 600
    lineHeight: "22px"
    letterSpacing: "-0.3px"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "-0.2px"
rounded:
  chip: "50%"
  card: "28px"
  sheet: "28px"
  pill: "999px"
spacing:
  gutter: "18px"
  grid-gap: "8px"
components:
  badge-soon:
    backgroundColor: "{colors.nav-ink}"
    textColor: "#ffffff"
    typography:
      fontSize: "9px"
      fontWeight: 600
    rounded: "{rounded.pill}"
    padding: "1.5px 7px"
  btn-primary:
    backgroundColor: "{colors.nav-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
  btn-secondary:
    backgroundColor: "#f7f9f4"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
---

# Design System: Basal Pay

## 1. Overview

**Creative North Star: "The Quiet Ledger"**

Basal Pay reads like a well-kept ledger, not a crypto dashboard: pale mist-grey pages, a single white surface for the money that matters, ink-dark accents used sparingly. Every color earns its place — blue, green, and pink each mark one specific kind of movement (inbound, available-now, outbound) rather than decorating the screen. Density is generous; the balance card and transaction sheet get room to breathe, and nothing competes with them for attention.

This system explicitly rejects the crypto-native maximalism of neon gradients and glass panels, and it rejects the generic "app icon row" — evenly-spaced circular chips with a caption underneath — as a default answer for any list of tappable things. It is closer to a modern digital bank (Revolut, N26) than to a wallet dApp.

**Key Characteristics:**
- Light, restrained, mist-and-ink palette; accent colors are semantic, not decorative
- Flat by default — depth comes from surface color, not shadow
- Generous whitespace, few but confident accent moments
- iOS-native type rhythm (SF Pro stack), tight letter-spacing on headings

## 2. Colors

The palette is a near-neutral mist-and-white base with three semantic accents, each tied to a meaning rather than a section.

### Primary
- **Ink Navy** (`#101727` / `nav-ink`): the app's one dark color — bottom nav, primary buttons, the "Soon" badge. Used deliberately, never as a body background.

### Secondary
- **Ledger Blue** (`#2b59ff` / `brand-blue`, deep `#1f4ce8`): marks inbound movement and the app's primary interactive accent (map/available-now utility, "in" transaction chips).
- **Confirm Green** (`#16bd73` / `brand-green`): reserved for "available / active" state marking.
- **Departure Pink** (`#f863ad` / `brand-pink`): marks outbound movement and playful-but-controlled secondary accents.

### Neutral
- **Page Mist** (`#f2f3f8` / `page-mist`): the app background — never pure white, never grey enough to feel cold.
- **Surface White** (`#ffffff` / `surface-white`): cards, sheets, the one true "foreground" plane.
- **Text Ink** (`#05070c` / `text-primary`): primary text, never pure `#000`.
- **Heading Grey** (`#4a4e56` / `text-heading`), **Muted Grey** (`#a0a0a0`), **Faint Grey** (`#90939b`): a three-step de-emphasis scale for secondary copy, disabled labels, and "Soon" states.

### Named Rules
**The Semantic Accent Rule.** Blue, green, and pink are never chosen for decoration — each one already means something in this app (inbound / available / outbound). Introducing a new accent color for a new feature must first ask "which of these three does this belong to" before reaching for a fourth.

## 3. Typography

**Body Font:** SF Pro Text / SF Pro Display, with system-UI fallback (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`)

**Character:** Tight, confident, iOS-native. Negative letter-spacing at every size keeps headings feeling engineered rather than typed.

### Hierarchy
- **Title** (600, 15.5px, 22px line-height, -0.3px): section headings ("Utilities", "Recent Activity").
- **Body** (400, 14px, 18px line-height, -0.05px): greetings, secondary copy.
- **Label** (500, 12.5px, 16px line-height, -0.2px): captions under icons/chips, list metadata.
- **Micro-label** (600, 9px, uppercase-weight badge use): the "Soon" badge — smallest text in the system, used only for a single-word status.

### Named Rules
**The One Heading Rule.** Any given section has exactly one Title-weight line introducing it. Everything else in that section is Body or Label — no competing bold text.

## 4. Elevation

Basal Pay is flat by design: no drop shadows anywhere in the current system. Depth is conveyed entirely through surface color layering — Page Mist behind, Surface White in front — plus a single 1px inset ring (`box-shadow: 0 0 0 1px rgba(15,23,42,0.06)`) used only where a circular avatar needs a hairline edge against a busy background. New components should follow this: reach for a background-color change before reaching for a shadow.

### Named Rules
**The Flat-By-Default Rule.** Depth is a background-color decision, not a shadow decision. If two elements need visual separation, first try giving the foreground one Surface White and the background Page Mist before adding any shadow.

## 5. Components

Components favor precise edges and restrained color over decoration — "tactile" here means confident hit targets and clear state, not skeuomorphic depth.

### Buttons
- **Shape:** 28px radius (`--bp-card-radius`), matching the card/sheet radius family.
- **Primary** (`btn-primary`): Ink Navy background, white text — used for the single most committcommittal action on screen (Send).
- **Secondary** (`btn-secondary`): near-white (`#f7f9f4`) background, Text Ink foreground — the paired, lower-commitment action (Deposit).

### Chips / Badges
- **Soon badge:** Ink Navy pill, white 9px text, always paired with a 2px Surface White ring so it reads as "on top of" its parent, never "cut into" it.
- **Transaction direction chips:** two-tone pairs (`chip-in-bg` / `chip-in-fg`, `chip-out-bg` / `chip-out-fg`) — background is the pale tint, foreground icon is the saturated version of the same hue. This bg/fg pairing pattern is the template for any new semantic chip (including Utilities).

### Named Rules
**The Tint-and-Ink Pairing Rule.** Any new colored chip uses a pale tint background with its own saturated ink as the foreground glyph color — never a saturated background with white icon, which reads as louder than this system allows.

## 6. Do's and Don'ts

**Do:**
- Keep one Title-weight heading per section, everything else Body/Label.
- Use the tint-and-ink chip pairing for any new status or category marker.
- Convey depth with Page Mist vs. Surface White, not shadow.
- Reserve Ink Navy for the single most-committal action or status per screen.

**Don't:**
- Don't add a fourth "decorative" accent color alongside blue/green/pink.
- Don't reach for glassmorphism, neumorphism, or drop shadows as a default — this system is flat.
- Don't default to an evenly-spaced circular-icon-plus-caption grid for a new row of options; that's the one pattern this system has explicitly moved away from.
- Don't use gradients on cards or text.
