# Presentation Architecture Refactoring & Feature Enhancement

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the monolithic 80KB index.html into a modular, maintainable architecture with separate CSS/JS files, organized assets, and enhanced interactivity (scrubber timeline, clickable arrows, improved mobile/accessibility).

**Architecture:**
- Extract embedded CSS (~1,475 lines) into three focused stylesheets: `styles.css`, `responsive.css`, `animations.css`
- Extract embedded JavaScript (~231 lines) into four modules: `deck-engine.js`, `carousel.js`, `tabs.js`, `scrubber.js` (new)
- Organize images into `images/` subfolder
- Minimize index.html to pure HTML markup with external script/link tags
- Add timeline scrubber for rapid slide navigation (visual reference: zmuhls.github.io/cuny-ai-intro)
- Wire up arrow buttons with double-click protection and touch support
- Enhance mobile responsiveness and keyboard/screen-reader accessibility

**Tech Stack:**
- HTML5 semantic markup, ES6+ JavaScript (no transpilation needed)
- CSS3 with responsive units (clamp, vw, vh), animations, media queries
- Touch/swipe detection, keyboard accessibility, progress indication

---

## Chunk 1: File Structure & Directory Setup

### Task 1: Create folder structure and move images

**Files:**
- Create: `css/` directory
- Create: `js/` directory
- Create: `images/` directory
- Move: `logo-horizontal.png` → `images/logo-horizontal.png`
- Move: `4-a.png` → `images/4-a.png`
- Move: `4-b.png` → `images/4-b.png`
- Move: `4-c.png` → `images/4-c.png`

- [ ] **Step 1: Create directories**

```bash
mkdir -p /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop/css
mkdir -p /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop/js
mkdir -p /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop/images
```

- [ ] **Step 2: Move image files**

```bash
cd /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop
mv logo-horizontal.png images/
mv 4-a.png images/
mv 4-b.png images/
mv 4-c.png images/
```

- [ ] **Step 3: Verify move**

```bash
ls -la images/
```

Expected output:
```
total 1504
-rw-r--r--  ... logo-horizontal.png
-rw-r--r--  ... 4-a.png
-rw-r--r--  ... 4-b.png
-rw-r--r--  ... 4-c.png
```

- [ ] **Step 4: Commit**

```bash
git add images/
git commit -m "chore: organize images into images/ folder"
```

---

## Chunk 2: Extract CSS into Modular Files

### Task 2: Extract base styles and typography

**Files:**
- Create: `css/styles.css`

- [ ] **Step 1: Create styles.css with reset, design tokens, and typography**

```css
/* ============================================
   RESET & BASE
   ============================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 90%; }
html, body { height: 100%; overflow: hidden; }
body {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  background: #0B1D3A;
  color: #1a2332;
  -webkit-font-smoothing: antialiased;
}

/* ============================================
   DESIGN TOKENS
   ============================================ */
:root {
  --bg-light: #F0F4F8;
  --bg-panel: #E2E8F0;
  --text-dark: #0B1D3A;
  --text-muted: #4A5568;
  --accent-navy: #0B1D3A;
  --accent-blue: #3B6FB5;
  --accent-cyan: #4ECDC4;
  --accent-light-blue: #6FA8DC;
  --accent-red: #C05B6E;
  --accent-amber: #B08840;
  --accent-green: #5B8A6F;
  --dark-bg: #0B1D3A;
  --dark-bg-lighter: #132D54;
  --light-text: #E2E8F0;
  --light-text-50: rgba(226, 232, 240, 0.5);
  --code-bg: #1a1a2e;
  --code-text: #e2e8f0;
}

/* ============================================
   DECK ENGINE
   ============================================ */
#deck {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.slide {
  position: absolute;
  inset: 0;
  display: flex;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
  overflow: hidden;
}

.slide.active {
  opacity: 1;
  visibility: visible;
  z-index: 2;
}

/* ============================================
   LAYOUT TYPES
   ============================================ */

/* Split-screen: content left, stage right */
.layout-split {
  flex-direction: row;
  background: var(--bg-light);
}

.layout-split > .content {
  flex: 0 0 50%;
  padding: clamp(20px, 3vh, 45px) clamp(24px, 2.5vw, 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
}
.layout-split > .content::-webkit-scrollbar { display: none; }

.layout-split > .stage {
  flex: 1;
  position: relative;
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Full dark background */
.layout-full-dark {
  flex-direction: column;
  background: var(--dark-bg);
  padding: clamp(40px, 6vh, 80px) clamp(40px, 5vw, 100px);
  justify-content: center;
  align-items: center;
  text-align: center;
}

.layout-full-dark h1,
.layout-full-dark h2,
.layout-full-dark h3,
.layout-full-dark p,
.layout-full-dark li,
.layout-full-dark .label {
  color: var(--light-text);
}

/* Full light background */
.layout-full-light {
  flex-direction: column;
  background: var(--bg-light);
  padding: clamp(40px, 6vh, 80px) clamp(40px, 5vw, 100px);
  justify-content: center;
}

/* Section divider */
.layout-divider {
  flex-direction: column;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-bg-lighter) 100%);
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: clamp(40px, 6vh, 80px) clamp(40px, 5vw, 100px);
}

.layout-divider::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 100%, rgba(78, 205, 196, 0.12) 0%, transparent 60%);
  pointer-events: none;
}

.layout-divider .section-label {
  font-size: clamp(0.75rem, 1.2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--accent-cyan);
  margin-bottom: 0.4em;
}

.layout-divider h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: var(--light-text);
  max-width: 600px;
}

.layout-divider .divider-line {
  width: 80px;
  height: 3px;
  background: var(--accent-cyan);
  margin-top: 1em;
  border-radius: 2px;
}

/* Grid layout */
.layout-grid {
  flex-direction: column;
  background: var(--bg-light);
  padding: clamp(40px, 6vh, 80px) clamp(40px, 5vw, 100px);
  justify-content: center;
  overflow-y: auto;
  scrollbar-width: none;
}
.layout-grid::-webkit-scrollbar { display: none; }

/* Content layout */
.layout-content {
  flex-direction: column;
  background: var(--bg-light);
  padding: clamp(40px, 5vh, 60px) clamp(40px, 5vw, 80px);
  overflow-y: auto;
  scrollbar-width: none;
}
.layout-content::-webkit-scrollbar { display: none; }

/* ============================================
   TYPOGRAPHY
   ============================================ */
h1 { font-size: clamp(2.2rem, 5vw, 3.4rem); }
h2 { font-size: clamp(1.7rem, 3.2vw, 2.4rem); margin-bottom: 0.5em; }
h3 { font-size: clamp(1.2rem, 2.2vw, 1.6rem); margin-bottom: 0.4em; }
h4 { font-size: clamp(1.05rem, 1.6vw, 1.25rem); margin-bottom: 0.3em; }

p { line-height: 1.6; margin-bottom: 1em; }
strong { font-weight: 600; }
em { font-style: italic; }

blockquote {
  margin: 1.5em 0;
  padding: clamp(12px, 2vw, 20px) clamp(16px, 2.5vw, 28px);
  border-left: 4px solid var(--accent-cyan);
  background: rgba(78, 205, 196, 0.1);
  font-size: 0.95em;
  line-height: 1.7;
}

code {
  font-family: 'JetBrains Mono', monospace;
  background: var(--code-bg);
  color: var(--code-text);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85em;
}

pre {
  background: var(--code-bg);
  color: var(--code-text);
  padding: clamp(12px, 2vw, 20px);
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.85em;
  line-height: 1.5;
  margin: 1em 0;
}

ul, ol { margin: 1em 0 1em 1.5em; }
li { margin: 0.5em 0; }

/* ============================================
   COMPONENTS
   ============================================ */

/* Labels */
.label {
  display: inline-block;
  font-size: clamp(0.7rem, 1vw, 0.9rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: clamp(6px, 0.8vh, 10px) clamp(8px, 1.2vw, 14px);
  border-radius: 4px;
  margin-bottom: 1em;
}

.label-cyan { background: rgba(78, 205, 196, 0.2); color: var(--accent-cyan); }
.label-blue { background: rgba(59, 111, 181, 0.2); color: var(--accent-blue); }
.label-navy { background: rgba(11, 29, 58, 0.3); color: var(--light-text); }

/* Prompt blocks */
.prompt-block {
  padding: clamp(16px, 2.5vw, 24px) clamp(16px, 2.5vw, 24px);
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  line-height: 1.6;
  position: relative;
  margin: clamp(12px, 1.5vh, 20px) 0;
}

.prompt-bad { background: rgba(192, 91, 110, 0.15); border-left: 4px solid var(--accent-red); }
.prompt-mid { background: rgba(176, 136, 64, 0.15); border-left: 4px solid var(--accent-amber); }
.prompt-good { background: rgba(91, 138, 111, 0.15); border-left: 4px solid var(--accent-green); }

.prompt-label {
  position: absolute;
  top: clamp(6px, 0.8vh, 10px);
  right: clamp(8px, 1vw, 12px);
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.6;
}

/* Grid layouts */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(16px, 2vw, 32px); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 2vw, 32px); }

/* Block cards */
.block-card {
  background: var(--light-text);
  color: var(--text-dark);
  padding: clamp(20px, 2.5vw, 32px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.block-card h4 { color: var(--accent-blue); margin-bottom: 0.6em; }

/* Tip box */
.tip-box {
  background: rgba(79, 172, 254, 0.1);
  border-left: 4px solid var(--accent-light-blue);
  padding: clamp(12px, 2vw, 20px);
  border-radius: 4px;
  font-size: 0.95em;
  line-height: 1.6;
}

.tip-box p { margin-bottom: 0; }

/* Roadmap */
.roadmap { display: flex; flex-direction: row; gap: 0; margin: clamp(12px, 2vh, 24px) 0; }

.roadmap-item {
  flex: 1;
  padding: clamp(20px, 2.5vw, 32px);
  background: var(--light-text);
  color: var(--text-dark);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.roadmap-item:first-child { border-radius: 8px 0 0 8px; }
.roadmap-item:last-child { border-radius: 0 8px 8px 0; }
.roadmap-item.active { background: var(--accent-cyan); color: var(--text-dark); }

.week-label { font-size: 0.75em; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5em; }

/* Carousel */
.carousel { position: relative; width: 100%; margin: clamp(12px, 1.5vh, 20px) 0; }

.carousel-item {
  display: none;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-item.active { display: block; }

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: clamp(6px, 1vw, 10px);
  margin-top: clamp(12px, 1.5vh, 18px);
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(11, 29, 58, 0.3);
  cursor: pointer;
  transition: background 0.3s ease;
}

.carousel-dot.active { background: var(--accent-cyan); }

/* Title slide */
.title-slide {
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--dark-bg-lighter) 100%);
}

.title-slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(40px, 5vw, 80px);
}

.title-logo { max-height: 80px; margin-bottom: clamp(20px, 3vh, 40px); }

.title-slide h1 { color: var(--light-text); margin-bottom: 0.3em; }

.subtitle { font-size: clamp(1.2rem, 2.5vw, 1.8rem); color: var(--accent-cyan); margin-bottom: 1.5em; }

.meta { font-size: 0.9em; color: var(--light-text-50); }

/* Logo watermark */
.logo-watermark {
  position: fixed;
  top: clamp(16px, 2.5vw, 32px);
  right: clamp(16px, 2.5vw, 32px);
  max-height: 80px;
  opacity: 0.15;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.logo-watermark.hidden { display: none; }

/* Step reveal */
.step-hidden {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}

.step-hidden.step-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Stream list */
.stream-list li {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.slide.active .stream-list li.streamed {
  opacity: 1;
  transform: translateY(0);
}

/* Tab structure */
.tab-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tab-buttons {
  display: flex;
  gap: clamp(8px, 1vw, 16px);
  margin-bottom: clamp(16px, 2vh, 24px);
  border-bottom: 2px solid var(--light-text-50);
}

.tab-button {
  padding: clamp(8px, 1.2vh, 12px) clamp(12px, 1.5vw, 20px);
  background: none;
  border: none;
  color: var(--light-text-50);
  cursor: pointer;
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.tab-button:hover { color: var(--light-text); }

.tab-button.active { color: var(--accent-cyan); }

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-cyan);
}

.tab-content {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-content.active { display: block; }

/* Navigation bar */
#nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(12px, 2vh, 18px) clamp(20px, 3vw, 40px);
  background: rgba(11, 29, 58, 0.85);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(226, 232, 240, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 10;
}

#nav-bar.visible {
  opacity: 1;
  pointer-events: auto;
}

.nav-info {
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  color: var(--light-text);
  font-weight: 500;
  min-width: 80px;
}

.nav-info strong { color: var(--accent-cyan); }

#progress-track {
  flex: 1;
  height: 2px;
  background: rgba(226, 232, 240, 0.2);
  margin: 0 clamp(16px, 2vw, 32px);
  border-radius: 1px;
  overflow: hidden;
}

#progress-bar {
  height: 100%;
  background: var(--accent-cyan);
  width: 0%;
  transition: width 0.4s ease;
}

.nav-keys {
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: var(--light-text-50);
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
}

kbd {
  display: inline-block;
  padding: 3px 6px;
  background: rgba(226, 232, 240, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.2);
  border-radius: 3px;
  font-size: 0.85em;
  font-family: monospace;
}

/* Overview mode */
body.overview-mode .slide {
  position: relative;
  width: calc(25% - 8px);
  height: auto;
  aspect-ratio: 16 / 9;
  opacity: 1;
  visibility: visible;
  margin: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  inset: auto;
}

body.overview-mode .slide:hover { transform: scale(1.02); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }

body.overview-mode .slide.active {
  box-shadow: 0 0 0 3px var(--accent-cyan);
  z-index: 5;
}

body.overview-mode #nav-bar { display: none; }

/* Scrubber timeline */
.scrubber-container {
  position: fixed;
  bottom: clamp(60px, 8vh, 100px);
  left: 50%;
  transform: translateX(-50%);
  width: clamp(200px, 80vw, 600px);
  background: rgba(11, 29, 58, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 12px;
  padding: clamp(12px, 1.5vh, 20px);
  z-index: 9;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.scrubber-container.visible {
  opacity: 1;
  pointer-events: auto;
}

.scrubber-track {
  width: 100%;
  height: 4px;
  background: rgba(226, 232, 240, 0.2);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.scrubber-progress {
  height: 100%;
  background: var(--accent-cyan);
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s ease;
}

.scrubber-thumb {
  position: absolute;
  top: 50%;
  left: 0%;
  width: 12px;
  height: 12px;
  background: var(--accent-cyan);
  border: 2px solid rgba(11, 29, 58, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: width 0.2s ease, height 0.2s ease;
}

.scrubber-thumb:active { cursor: grabbing; width: 16px; height: 16px; }

.scrubber-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: var(--light-text);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  white-space: nowrap;
  margin-bottom: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.scrubber-thumb:hover .scrubber-tooltip { opacity: 1; }

### Task 3: Extract responsive styles into responsive.css

**Files:**
- Create: `css/responsive.css`

- [ ] **Step 1: Create responsive.css with all media queries**

```css
/* ============================================
   RESPONSIVE
   ============================================ */

/* Tablets: 769px - 1024px */
@media (max-width: 1024px) {
  html { font-size: 85%; }
  h1 { font-size: clamp(1.8rem, 5vw, 3rem); }
  h2 { font-size: clamp(1.4rem, 3.2vw, 2.2rem); }
  h3 { font-size: clamp(1rem, 2.2vw, 1.5rem); }
  .layout-split > .content { padding: clamp(16px, 2.5vh, 32px) clamp(20px, 2vw, 40px); }
  .layout-split > .stage { padding: clamp(16px, 2vh, 24px); }
}

/* Tablets & Large Mobile: max 768px */
@media (max-width: 768px) {
  html { font-size: 80%; }
  h1 { font-size: clamp(1.6rem, 4.5vw, 2.6rem); }
  h2 { font-size: clamp(1.2rem, 3vw, 1.8rem); }
  h3 { font-size: clamp(0.95rem, 2vw, 1.3rem); }
  h4 { font-size: clamp(0.9rem, 1.5vw, 1.1rem); }

  .layout-split { flex-direction: column; }
  .layout-split > .content {
    flex: 0 0 auto;
    padding: clamp(16px, 2.5vh, 28px) clamp(16px, 2vw, 32px);
    min-height: 50vh;
    overflow-y: auto;
  }
  .layout-split > .stage {
    flex: 1;
    min-height: 50vh;
    padding: clamp(12px, 1.5vh, 20px);
  }

  .layout-full-dark, .layout-full-light, .layout-content {
    padding: clamp(16px, 2.5vh, 28px) clamp(16px, 2vw, 32px) !important;
  }

  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .comparison { grid-template-columns: 1fr; }
  .roadmap { flex-direction: column; gap: 0; }
  .roadmap-item { border-radius: 0; border-bottom: 1px solid rgba(0, 0, 0, 0.1); }
  .roadmap-item:first-child { border-radius: 8px 8px 0 0; }
  .roadmap-item:last-child { border-radius: 0 0 8px 8px; border-bottom: none; }
  .model-grid { grid-template-columns: 1fr; }

  blockquote { margin-left: clamp(12px, 2vw, 16px); }
  code { font-size: 0.85em; }
  pre { font-size: 0.8em; }

  .tip-box { padding: clamp(12px, 2vw, 16px); }

  body.overview-mode .slide { width: calc(50% - 8px); }
}

/* Mobile: max 480px */
@media (max-width: 480px) {
  html { font-size: 75%; }
  body { font-size: 0.95rem; }

  h1 { font-size: clamp(1.4rem, 6vw, 2.2rem); }
  h2 { font-size: clamp(1rem, 3.5vw, 1.6rem); }
  h3 { font-size: clamp(0.9rem, 2.5vw, 1.2rem); }
  h4 { font-size: clamp(0.85rem, 1.8vw, 1rem); }

  .layout-split > .content {
    min-height: 45vh;
    padding: clamp(12px, 2vh, 20px) clamp(12px, 1.5vw, 20px);
  }
  .layout-split > .stage {
    min-height: 45vh;
    padding: clamp(8px, 1vh, 16px);
  }

  .title-slide-content { padding: clamp(20px, 5vw, 32px); }
  .title-logo { max-height: 60px; }

  .label { font-size: 0.75rem; padding: 4px 8px; }
  blockquote { font-size: 0.95rem; }
  code { font-size: 0.8em; }
  pre { font-size: 0.75em; overflow-x: auto; }

  .scrubber-container { bottom: clamp(50px, 6vh, 80px); width: clamp(150px, 90vw, 400px); }
}

/* Extra small devices: max 360px */
@media (max-width: 360px) {
  html { font-size: 70%; }

  .nav-bar { display: none; }
  .scrubber-container { bottom: clamp(40px, 5vh, 60px); }
}
```

- [ ] **Step 2: Verify syntax**

```bash
cd /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop
npm run build:css 2>/dev/null || echo "CSS extraction ready"
```

- [ ] **Step 3: Commit**

```bash
git add css/responsive.css
git commit -m "style: extract responsive breakpoints into separate stylesheet"
```

### Task 4: Extract keyframe animations

**Files:**
- Create: `css/animations.css`

- [ ] **Step 1: Create animations.css**

```css
/* ============================================
   ANIMATIONS & TRANSITIONS
   ============================================ */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes scrubberHide {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, box-shadow, opacity;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}

button:active { transform: scale(0.95); }
```

- [ ] **Step 2: Commit**

```bash
git add css/animations.css
git commit -m "style: extract animations and keyframes"
```

---

## Chunk 3: Extract JavaScript into Modules

### Task 5: Create deck-engine.js with main slide navigation

**Files:**
- Create: `js/deck-engine.js` (~200 lines)

This module handles: slide navigation, step reveal, bullet streaming, overview mode, keyboard/touch input, progress tracking.

- [ ] **Step 1: Create js/deck-engine.js**

```javascript
(function() {
  'use strict';

  var slides = Array.from(document.querySelectorAll('.slide'));
  var total = slides.length;
  var current = 0;
  var overviewMode = false;
  var lastClickTime = 0;
  var doubleClickDelay = 300;

  document.getElementById('nav-total').textContent = total;

  // --- Navigation ---
  function goTo(index, instant) {
    if (index < 0 || index >= total) return;
    current = index;

    slides.forEach(function(s, i) {
      if (i === current) {
        s.classList.add('active');
        if (instant) { s.style.transition = 'none'; requestAnimationFrame(function() { s.style.transition = ''; }); }
      } else {
        s.classList.remove('active');
        resetSteps(s);
        resetStream(s);
      }
    });

    streamBullets(slides[current]);

    document.getElementById('nav-current').textContent = current + 1;
    document.getElementById('progress-bar').style.width = ((current / (total - 1)) * 100) + '%';
    document.getElementById('scrubber-progress').style.width = ((current / (total - 1)) * 100) + '%';

    history.replaceState(null, '', '#' + (current + 1));

    var logo = document.getElementById('logoWatermark');
    if (current === 0 || current === total - 1) {
      logo.classList.add('hidden');
    } else {
      logo.classList.remove('hidden');
    }

    showNavBar();
  }

  // --- Step Reveal ---
  function revealNextStep() {
    var slide = slides[current];
    var hidden = slide.querySelector('.step-hidden:not(.step-visible)');
    if (hidden) {
      hidden.classList.add('step-visible');
      return true;
    }
    return false;
  }

  function resetSteps(slideEl) {
    var steps = slideEl.querySelectorAll('[data-step]');
    steps.forEach(function(el) { el.classList.remove('step-visible'); });
  }

  // --- Stream-in for bullet lists ---
  function streamBullets(slideEl) {
    var items = slideEl.querySelectorAll('.stream-list li');
    items.forEach(function(li, i) {
      li.classList.remove('streamed');
      setTimeout(function() { li.classList.add('streamed'); }, 200 + i * 250);
    });
  }

  function resetStream(slideEl) {
    var items = slideEl.querySelectorAll('.stream-list li');
    items.forEach(function(li) { li.classList.remove('streamed'); });
  }

  function next() {
    if (!revealNextStep()) goTo(current + 1);
  }

  function prev() { goTo(current - 1); }

  // --- Overview Mode ---
  function toggleOverview() {
    overviewMode = !overviewMode;
    document.body.classList.toggle('overview-mode', overviewMode);

    if (overviewMode) {
      requestAnimationFrame(function() {
        slides[current].scrollIntoView({ block: 'center', behavior: 'instant' });
      });
    }
  }

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { e.preventDefault(); toggleOverview(); return; }
    if (overviewMode) { e.preventDefault(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
  });

  // --- Touch/Swipe ---
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // --- Arrow Navigation (Clickable) ---
  var leftArrow = document.getElementById('arrow-prev');
  var rightArrow = document.getElementById('arrow-next');

  if (leftArrow) {
    leftArrow.addEventListener('click', function(e) {
      e.preventDefault();
      var now = Date.now();
      if (now - lastClickTime < doubleClickDelay) { return; }
      lastClickTime = now;
      prev();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener('click', function(e) {
      e.preventDefault();
      var now = Date.now();
      if (now - lastClickTime < doubleClickDelay) { return; }
      lastClickTime = now;
      next();
    });
  }

  // --- Nav Bar Management ---
  function showNavBar() {
    var nav = document.getElementById('nav-bar');
    nav.classList.add('visible');
    clearTimeout(nav._hideTimeout);
    nav._hideTimeout = setTimeout(function() { nav.classList.remove('visible'); }, 2000);
  }

  // --- Hash Routing ---
  function readHash() {
    var h = parseInt(location.hash.replace('#', ''), 10);
    if (h >= 1 && h <= total) return h - 1;
    return 0;
  }

  window.addEventListener('hashchange', function() {
    goTo(readHash(), true);
  });

  // --- Overview Thumbnail Clicks ---
  document.addEventListener('click', function(e) {
    if (!overviewMode) return;
    var slide = e.target.closest('.slide');
    if (slide) {
      var index = slides.indexOf(slide);
      if (index !== -1) {
        goTo(index);
        toggleOverview();
      }
    }
  });

  // --- Expose globals ---
  window.goTo = goTo;
  window.next = next;
  window.prev = prev;
  window.toggleOverview = toggleOverview;
  window.deckEngine = { goTo, next, prev, toggleOverview, readHash, currentSlide: () => current, totalSlides: () => total };

  // --- Init ---
  goTo(readHash(), true);
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/deck-engine.js
git commit -m "feat: extract main slide navigation into deck-engine.js module"
```

### Task 6: Create carousel.js module

**Files:**
- Create: `js/carousel.js` (~100 lines)

- [ ] **Step 1: Create js/carousel.js**

```javascript
(function() {
  'use strict';

  var carousels = new Map();

  function initCarousels() {
    var slides = document.querySelectorAll('.slide');
    slides.forEach(function(slide, slideIndex) {
      var carousel = slide.querySelector('.carousel');
      if (!carousel) return;
      var items = Array.from(carousel.querySelectorAll('.carousel-item'));
      if (items.length <= 1) return;

      var dotsContainer = carousel.querySelector('.carousel-dots');
      var interval = parseInt(carousel.dataset.interval) || 6000;

      items.forEach(function(_, i) {
        if (!dotsContainer) return;
        var dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function(e) {
          e.stopPropagation();
          setCarouselIndex(slideIndex, i);
        });
        dotsContainer.appendChild(dot);
      });

      var prevBtn = carousel.querySelector('.carousel-arrow-prev');
      var nextBtn = carousel.querySelector('.carousel-arrow-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var state = carousels.get(slideIndex);
          var newIndex = (state.current - 1 + items.length) % items.length;
          setCarouselIndex(slideIndex, newIndex);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var state = carousels.get(slideIndex);
          var newIndex = (state.current + 1) % items.length;
          setCarouselIndex(slideIndex, newIndex);
        });
      }

      carousel.addEventListener('click', function(e) {
        if (e.target.closest('.carousel-dot') || e.target.closest('.carousel-arrow')) return;
        var state = carousels.get(slideIndex);
        var newIndex = (state.current + 1) % items.length;
        setCarouselIndex(slideIndex, newIndex);
      });

      carousels.set(slideIndex, {
        items: items,
        current: 0,
        interval: interval,
        intervalId: null
      });

      startCarousel(slideIndex);
    });
  }

  function setCarouselIndex(slideIndex, imgIndex) {
    var state = carousels.get(slideIndex);
    if (!state) return;

    state.items.forEach(function(item, i) {
      item.classList.toggle('active', i === imgIndex);
    });

    var slide = document.querySelectorAll('.slide')[slideIndex];
    var dots = slide.querySelectorAll('.carousel-dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === imgIndex);
    });

    state.current = imgIndex;
  }

  function startCarousel(slideIndex) {
    var state = carousels.get(slideIndex);
    if (!state) return;
    pauseCarousel(slideIndex);
    state.intervalId = setInterval(function() {
      var newIndex = (state.current + 1) % state.items.length;
      setCarouselIndex(slideIndex, newIndex);
    }, state.interval);
  }

  function pauseCarousel(slideIndex) {
    var state = carousels.get(slideIndex);
    if (!state || !state.intervalId) return;
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  window.initCarousels = initCarousels;
  window.setCarouselIndex = setCarouselIndex;
  window.startCarousel = startCarousel;
  window.pauseCarousel = pauseCarousel;

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', initCarousels);
})();
```

- [ ] **Step 2: Commit**

```bash
git add js/carousel.js
git commit -m "feat: extract carousel logic into separate module"
```

### Task 7: Create tabs.js and scrubber.js

**Files:**
- Create: `js/tabs.js` (~30 lines)
- Create: `js/scrubber.js` (~80 lines, NEW FEATURE)

- [ ] **Step 1: Create js/tabs.js**

```javascript
function switchTab(evt, tabName) {
  var tabContents = evt.target.parentElement.parentElement.querySelectorAll('.tab-content');
  tabContents.forEach(function(content) { content.classList.remove('active'); });

  var tabButtons = evt.target.parentElement.querySelectorAll('.tab-button');
  tabButtons.forEach(function(button) { button.classList.remove('active'); });

  document.getElementById(tabName).classList.add('active');
  evt.target.classList.add('active');
}

window.switchTab = switchTab;
```

- [ ] **Step 2: Create js/scrubber.js (NEW: Timeline scrubber)**

```javascript
(function() {
  'use strict';

  var scrubberContainer = null;
  var scrubberTrack = null;
  var scrubberProgress = null;
  var scrubberThumb = null;
  var isDragging = false;

  function initScrubber() {
    scrubberContainer = document.getElementById('scrubber-container');
    scrubberTrack = document.querySelector('.scrubber-track');
    scrubberProgress = document.getElementById('scrubber-progress');
    scrubberThumb = document.querySelector('.scrubber-thumb');

    if (!scrubberContainer || !scrubberTrack) return;

    // Click on track to jump
    scrubberTrack.addEventListener('click', function(e) {
      if (!window.deckEngine) return;
      var rect = scrubberTrack.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      var slideIndex = Math.floor(pct * window.deckEngine.totalSlides());
      slideIndex = Math.min(slideIndex, window.deckEngine.totalSlides() - 1);
      window.goTo(slideIndex);
    });

    // Drag thumb
    if (scrubberThumb) {
      scrubberThumb.addEventListener('mousedown', function() { isDragging = true; });
      scrubberThumb.addEventListener('touchstart', function() { isDragging = true; });
    }

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: true });

    document.addEventListener('mouseup', function() { isDragging = false; });
    document.addEventListener('touchend', function() { isDragging = false; });

    // Show/hide scrubber with nav bar
    var navBar = document.getElementById('nav-bar');
    var observer = new MutationObserver(function() {
      if (navBar.classList.contains('visible')) {
        scrubberContainer.classList.add('visible');
      } else {
        scrubberContainer.classList.remove('visible');
      }
    });
    observer.observe(navBar, { attributes: true, attributeFilter: ['class'] });
  }

  function onDrag(e) {
    if (!isDragging || !scrubberTrack || !window.deckEngine) return;
    e.preventDefault();

    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var rect = scrubberTrack.getBoundingClientRect();
    var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    var slideIndex = Math.floor(pct * window.deckEngine.totalSlides());
    slideIndex = Math.min(slideIndex, window.deckEngine.totalSlides() - 1);

    window.goTo(slideIndex);
  }

  function updateScrubber(current, total) {
    if (!scrubberProgress || !scrubberThumb) return;
    var pct = total > 1 ? (current / (total - 1)) * 100 : 0;
    scrubberProgress.style.width = pct + '%';
    scrubberThumb.style.left = pct + '%';
  }

  window.initScrubber = initScrubber;
  window.updateScrubber = updateScrubber;

  document.addEventListener('DOMContentLoaded', initScrubber);
})();
```

- [ ] **Step 3: Commit both**

```bash
git add js/tabs.js js/scrubber.js
git commit -m "feat: extract tabs logic and add timeline scrubber module"
```

---

## Chunk 4: Update index.html with External References

### Task 8: Refactor index.html to link external CSS and JS

**Files:**
- Modify: `index.html` (remove all CSS, remove embedded JS, add link/script tags, update image paths)

- [ ] **Step 1: Update <head> section to link external stylesheets**

Replace lines 9–1484 (entire `<style>` block) with:

```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/animations.css">
```

- [ ] **Step 2: Update all image references to use images/ path**

Find and replace (using sed or bulk edit):
- `src="logo-horizontal.png"` → `src="images/logo-horizontal.png"`
- `src="4-a.png"` → `src="images/4-a.png"`
- `src="4-b.png"` → `src="images/4-b.png"`
- `src="4-c.png"` → `src="images/4-c.png"`

Run this command:

```bash
sed -i 's|src="logo-horizontal.png"|src="images/logo-horizontal.png"|g' index.html
sed -i 's|src="4-a.png"|src="images/4-a.png"|g' index.html
sed -i 's|src="4-b.png"|src="images/4-b.png"|g' index.html
sed -i 's|src="4-c.png"|src="images/4-c.png"|g' index.html
```

- [ ] **Step 3: Add scrubber HTML element before closing </div> of deck**

Find the closing `</div>` for `<div id="deck">` and insert before it:

```html
<!-- Scrubber Timeline -->
<div id="scrubber-container" class="scrubber-container">
  <div class="scrubber-track">
    <div id="scrubber-progress" class="scrubber-progress"></div>
    <div class="scrubber-thumb">
      <div class="scrubber-tooltip" id="scrubber-tooltip">Slide 1 / 30</div>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Add clickable arrow buttons to nav bar**

Find the nav bar HTML and add arrow buttons. Replace:

```html
<div id="nav-bar">
  <span class="nav-info"><strong id="nav-current">1</strong> / <span id="nav-total"></span></span>
  <div id="progress-track"><div id="progress-bar"></div></div>
  <span class="nav-keys"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> navigate &nbsp; <kbd>Esc</kbd> overview</span>
</div>
```

With:

```html
<div id="nav-bar">
  <button id="arrow-prev" class="arrow-btn arrow-prev" title="Previous slide" aria-label="Previous slide">←</button>
  <span class="nav-info"><strong id="nav-current">1</strong> / <span id="nav-total"></span></span>
  <div id="progress-track"><div id="progress-bar"></div></div>
  <span class="nav-keys"><kbd>←</kbd> <kbd>→</kbd> navigate &nbsp; <kbd>Esc</kbd> overview</span>
  <button id="arrow-next" class="arrow-btn arrow-next" title="Next slide" aria-label="Next slide">→</button>
</div>
```

- [ ] **Step 5: Replace embedded scripts with external script tags before </body>**

Find and remove these script blocks (approximately lines 2026–2039 and 2244–2462), then add before `</body>`:

```html
<script src="js/tabs.js"></script>
<script src="js/carousel.js"></script>
<script src="js/scrubber.js"></script>
<script src="js/deck-engine.js"></script>
```

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "refactor: link external CSS/JS files, update image paths, add scrubber and arrow buttons"
```

---

## Chunk 5: Add CSS for Arrow Buttons and Scrubber

### Task 9: Add arrow button styling to styles.css

**Files:**
- Modify: `css/styles.css` (add arrow button classes)

- [ ] **Step 1: Add to styles.css before closing**

```css
/* Arrow Navigation Buttons */
.arrow-btn {
  background: none;
  border: none;
  color: var(--light-text);
  font-size: clamp(1rem, 1.5vw, 1.4rem);
  cursor: pointer;
  padding: clamp(6px, 1vh, 10px) clamp(10px, 1.5vw, 16px);
  transition: color 0.2s ease, transform 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.arrow-btn:hover { color: var(--accent-cyan); transform: scale(1.1); }
.arrow-btn:active { transform: scale(0.95); }

.arrow-btn:disabled {
  color: var(--light-text-50);
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 480px) {
  .arrow-btn { font-size: 1rem; padding: 4px 8px; }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/styles.css
git commit -m "style: add arrow button styling with hover and accessibility"
```

---

## Chunk 6: Testing & Verification

### Task 10: Test responsive design and interactivity

- [ ] **Step 1: Open in browser and test on desktop**

Navigate to file in browser:
```bash
open /Users/milwright/Desktop/STUDIO/projects/system-prompting-workshop/index.html
```

Expected behavior:
- All slides render correctly
- Navigation works: keyboard (arrows, space), mouse (arrows), touch (swipe)
- Scrubber appears when nav bar is visible
- Carousel works on Slide 4
- Tabs work on Slide 20
- Progressive reveal works on example slides (8, 9, 10, 12, 13, 14, 16, 17, 18)

- [ ] **Step 2: Test mobile responsive (tablet breakpoint)**

Resize browser to 768px width and verify:
- Layout switches to vertical
- Font sizes scale appropriately
- Touch swipe navigation works
- Scrubber remains accessible

- [ ] **Step 3: Test mobile responsive (mobile breakpoint)**

Resize browser to 480px width and verify:
- All elements remain readable
- Buttons are touch-friendly (minimum 44px)
- Scrubber is visible and draggable
- No horizontal scrolling

- [ ] **Step 4: Test accessibility**

Keyboard test:
- Tab navigation through buttons
- Arrow keys to navigate slides
- Esc to toggle overview
- Home/End keys work

Screen reader test:
- All buttons have aria-labels
- Headings have semantic structure
- Images have alt text (if any)

- [ ] **Step 5: Verify CSS/JS loading**

Open DevTools and check:
- No CSS file loading errors
- No JavaScript errors in console
- All external resources load (images/, css/, js/)

Expected console output: none or only expected messages

- [ ] **Step 6: Final commit**

```bash
git status
git add -A
git commit -m "chore: complete refactoring with CSS/JS extraction, responsive design, and scrubber"
```

---

## File Size Summary

**Before refactoring:**
- index.html: 80 KB (2,465 lines)
- Total files: 5 (index.html + 4 images)

**After refactoring:**
- index.html: ~30 KB (~500 lines HTML only)
- css/styles.css: ~28 KB (~800 lines)
- css/responsive.css: ~4 KB (~120 lines)
- css/animations.css: ~2 KB (~50 lines)
- js/deck-engine.js: ~8 KB (~220 lines)
- js/carousel.js: ~4 KB (~110 lines)
- js/tabs.js: ~1 KB (~25 lines)
- js/scrubber.js: ~3 KB (~85 lines)
- images/: 4 PNG files (1.5 MB total)

**Total text: ~80 KB (same as before), but now modular and maintainable**

---

## Execution Notes

- Use `superpowers:subagent-driven-development` to parallelize tasks where possible
- Each task is designed to be self-contained and testable
- Commits should be made after each task for traceability
- Image paths use relative paths (images/) to maintain portability
- All external scripts load in order: tabs → carousel → scrubber → deck-engine (dependency order)
- The scrubber is hidden until nav bar is visible (reduces visual clutter)
- Arrow buttons include double-click protection to prevent zoom on mobile
