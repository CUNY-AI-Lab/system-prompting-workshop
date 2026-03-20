# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- **Always use the frontend-design skill when making changes that impact aesthetics.** This applies to any visual/styling modifications — typography, spacing, backgrounds, component styling, layout adjustments.
- **Never use Co-Authored-By lines in commits.**

## Project Overview

Workshop 1 of a 3-part CUNY AI Lab faculty series (system prompts → knowledge collections → agentic tools). Single-page HTML slide deck, no build system, no dependencies — open `index.html` directly in a browser or visit https://cuny-ai-lab.github.io/system-prompting/

## Architecture

The presentation is a custom deck engine built without any framework.

**Entry point:** `index.html` — all slides live here as `.slide` divs inside `#deck`. Slide content is the source of truth; `SLIDES.md` is a markdown mirror kept in sync manually after edits.

**JS modules** (loaded at bottom of `index.html` in this order):
- `js/tabs.js` — tab component (unused in current slides but loaded)
- `js/carousel.js` — auto-advancing image carousel (Slide 4)
- `js/scrubber.js` — scrubber timeline in the nav bar; exposes `updateScrubber(current, total)`
- `js/deck-engine.js` — core navigation engine; exposes `window.deckEngine`, `window.goTo`, `window.next`, `window.prev`

**CSS files:**
- `css/styles.css` — all layout, components, typography, design tokens, and accessibility utilities
- `css/responsive.css` — breakpoint overrides
- `css/animations.css` — transition/animation definitions + `prefers-reduced-motion` overrides

**Inline script** in `index.html` (before JS tags): `copyTemplate(id)` — clipboard copy for drafting station templates.

## Slide Layouts

Each slide uses one layout class:
- `layout-split` — two-column: `.content` (left, light) + `.stage` (right, panel)
- `layout-content` — single-column, light background
- `layout-full-dark` — centered, dark background (roadmap/model slides)
- `layout-divider` — section break, dark, centered large heading
- `layout-grid` — dark background with `.grid-2` card layout

## Progressive Reveal

Two mechanisms, both managed by `deck-engine.js`:

1. **Step reveal** — elements with `class="step-hidden" data-step` are revealed one at a time on each forward advance. Reset when leaving the slide.
2. **Stream bullets** — `<ul class="stream-list">` items animate in with staggered delay (200ms + 250ms per item) when the slide becomes active.

To hide content until clicked: add `step-hidden data-step` to the element (typically a `<ul>`). The heading above it should have no hidden classes — it stays visible.

## Accessibility Layer

Every slide has `role="group" aria-roledescription="slide" aria-label="Slide N: Title"`. These labels are sequential (Slide 1 through Slide 30) and must be updated when slides are added, removed, or reordered.

Key accessibility infrastructure:
- `#slide-announcer` — `aria-live="polite"` div, updated by `deck-engine.js` on every slide change
- `aria-current="step"` — set/removed on the active slide by JS
- Nav bar is a `<nav aria-label="Slide navigation">` element (not a div)
- Scrubber has `role="slider"` with full ARIA value attributes, updated by JS
- Decorative emoji use `aria-hidden="true"`; adjacent text labels carry the meaning
- `.sr-only` and `.skip-link` utility classes live in `css/styles.css`
- `prefers-reduced-motion` in `css/animations.css` disables all transitions and animations

When adding a new slide: add the `role="group" aria-roledescription="slide" aria-label="Slide N: Title"` attributes and renumber all subsequent slides.

## Conventions

- No em dashes anywhere in slide content
- Tone lines belong as the last bullet under `Constraints:`, not as a separate section
- All three "good prompt" slides follow: role/audience, blank line, core problem, Procedure, Framework, Constraints (tone as last bullet)
- History example uses Wineburg's historical thinking heuristics (sourcing, contextualization, close reading, corroboration) — not SOAPS/SOAPSTone
- Drafting station slides: template first, "Your turn" tip-box after
- `SLIDES.md` must be kept in sync with `index.html` after every content edit
- Commit messages: short, lowercase, no sign-off
- System prompt examples must frame AI as a tool the instructor builds, not as something students use to do homework. The student interacts with the tool; the instructor designs the pedagogy behind it.
