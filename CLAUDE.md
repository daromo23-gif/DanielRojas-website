# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Project Architecture

Static HTML website for Daniel Rojas — a personal brand/newsletter site. No build step, no framework.

- `index.html` — homepage (hero, article list, footer). All CSS is inline in `<style>`. All JS is inline in `<script>` at end of `<body>`.
- `sobre-mi.html` — About page, same structure.
- `articulos/` — Individual article pages.
- `Brand_assets/` — Logo (`DR-logomark-dark.png`), photo (`daniel-foto.jpeg`), brand guidelines (`daniel-rojas-brand-guidelines.png`). Always read the guidelines image before designing.
- `serve.mjs` — Static file server on port 3000.
- `screenshot.mjs` — Puppeteer screenshot tool.

## Deployment

Changes go live via: **local edit → git commit → git push → Vercel auto-deploys**.

```bash
git add <files>
git commit -m "description"
git push
```

Vercel is connected to GitHub repo `daromo23-gif/DanielRojas-website` on branch `main`. Every push triggers a redeploy (~30s). Live at `www.danielrojas.co`.

**Node.js is not in the bash PATH.** The `node` command only works from Windows-native terminals (cmd/PowerShell), not from the bash shell used by Claude Code tools. Do not attempt to run `node serve.mjs` or `node screenshot.mjs` via Bash tool — they will fail with "command not found".

## Brand Tokens

Established in `Brand_assets/daniel-rojas-brand-guidelines.png` and `index.html`:

```css
--bg: #0f0f0f          /* page background */
--surface: #161616
--elevated: #1e1e1e
--card: #181818
--border: #242424
--border-light: #2c2c2c
--text: #f0ede9
--text-secondary: #a09d99
--text-muted: #666
--brand: #e8541a       /* primary orange — never substitute */
--brand-hover: #ff6030
```

Fonts: `DM Sans` (headings, UI) + `Inter` (body). Both loaded from Google Fonts.

Brand voice uses `//` prefix as a code-style label (e.g. `// AI Operating System`). Use this pattern for badges and category labels.

## Animation Patterns

The site uses two animation systems implemented in vanilla JS/CSS (no libraries):

**1. Vertical Cut Reveal** (hero heading on load) — JS splits the heading into words, each wrapped in `overflow:hidden` with an inner span that slides up via `@keyframes vcrUp`. Key detail: the wrapper needs `padding-right:0.18em; margin-right:-0.18em` to prevent clipping of italic glyph overhangs.

**2. Scroll Reveal** (sections, post rows, footer) — `IntersectionObserver` adds `.revealed` class to `[data-reveal]` elements. Optional `data-reveal-delay="0.1"` for stagger.

Both systems are re-initialized on `pageshow` with `e.persisted` to handle bfcache (back/forward navigation).

Hero body and form use CSS `animation: heroFadeUp` with delay, controlled by removing/re-adding the `animation` property in JS on replay.

## Local Server & Screenshot Workflow

- Start server: `node serve.mjs` (port 3000) — run from Windows terminal, not bash
- Screenshot: `node screenshot.mjs http://localhost:3000 [label]`
- Screenshots saved to `./temporary screenshots/screenshot-N[-label].png`
- Read screenshots with the Read tool to visually inspect output

## Reference Images & Design

- If a reference image is provided: match layout, spacing, typography, and color exactly. Use `https://placehold.co/WIDTHxHEIGHT` for placeholder images.
- Screenshot, compare, fix mismatches, re-screenshot. Minimum 2 rounds.
- Never screenshot a `file:///` URL — always use localhost.

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette. Use brand tokens above.
- **Shadows:** Layered, color-tinted, low opacity — not flat `shadow-md`.
- **Typography:** DM Sans for headings (`letter-spacing: -0.04em` on large), Inter for body (`line-height: 1.7`).
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Spring-style easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Depth:** Base (`--bg`) → elevated (`--elevated`) → floating (`--card`).
- **Grain:** SVG `feTurbulence` noise overlay on `body::after` at ~3% opacity for depth.

## Hard Rules

- Do not add sections, features, or content not requested
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Do not use `overflow: hidden` on containers that hold italic text at large sizes — it clips glyph overhangs
