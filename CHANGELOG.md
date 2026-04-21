# Changelog

Track every absorption, addition, and substantive change. Each entry cites source when material came from an upstream skill.

Format: newest first. Group under a version heading. Include date.

---

## 0.1.12 — 2026-04-21 — Forms, mobile/touch, typographic characters, dark-mode native UI, content resilience

Large absorption pass from Vercel Labs `web-interface-guidelines`.

### Added
- **New `references/forms.md`** — input attributes (`autocomplete`, `type`/`inputmode`, `spellcheck`), don't-block-paste, label patterns (inc. checkbox/radio hit target), submit behavior (don't pre-disable, disable during request), inline errors with focus-first, placeholder ellipsis + example patterns, unsaved-changes warnings. Wired into parent SKILL's references table, `cami-design-interaction`, and `cami-design-copy`.
- `references/interaction.md` — new *Mobile & Touch* section (`touch-action: manipulation`, `-webkit-tap-highlight-color`, `overscroll-behavior: contain`, drag selection/`inert`, `autoFocus` rules). New loading minimum-duration rule (show-delay + min visible time).
- `references/typography.md` — new *Typographic Characters* section (`…` vs `...`, curly quotes, `&nbsp;` for glued terms). Added `preconnect` bullet for font/asset CDNs.
- `references/color.md` — new *Native Browser UI* section (`color-scheme`, `<meta name="theme-color">`, Windows `<select>` bg/color fix).
- `references/spacing-layout.md` — new *Safe Areas* section (`env(safe-area-inset-*)` for mobile notch), new *Content Resilience* section (truncate/line-clamp/break-words + `min-w-0` flex gotcha + UGC resilience), new *Anchored Headings* section (`scroll-margin-top` under sticky headers).
- `references/motion.md` — SVG Safari transform fix (`transform-box: fill-box` on `<g>` wrapper).

### Deliberately skipped
- Forms sub-skill (too heavy — chose reference-only)
- URL-as-state, deep-linking, hydration, i18n — architectural, out of scope for polish
- Image/CLS rules — engineering scope
- Title Case headings — conflicts with existing sentence-case default in `cami-design-copy`

### Sources
- vercel-labs/web-interface-guidelines (command.md, full rule set reviewed)

---

## 0.1.11 — 2026-04-20 — Modern CSS polish primitives

### Added
- `references/spacing-layout.md` — `scrollbar-gutter: stable` section. Prevents horizontal content shift when scrollbars appear in modal bodies, side panels, dynamic containers. Baseline since 2023, zero cost on overlay-scrollbar platforms.
- `references/motion.md` — `interpolate-size: allow-keywords` + `calc-size()` subsection under *Advanced Techniques*. Enables `height` / `width` transitions to/from `auto`, replacing the `max-height: 9999px` workaround. Chrome 129+, Safari 18.2+, Firefox pending — safe as progressive enhancement.
- `references/color.md` — `::selection` section. Branded selection tint via relative color syntax (`oklch(from var(--color-accent) …)`).

### Sources consulted
- MDN web docs, developer.chrome.com, webkit.org — modern CSS baseline/shipping features reviewed for polish-layer fit.
- Other candidates reviewed and rejected: `field-sizing: content` (would require new *Forms & Inputs* section — structural expansion out of scope), `font-optical-sizing: auto` (browser default in most cases, marginal), scroll-driven animations, View Transitions API, container queries, `color-mix()`, `@scope`, scroll-state queries.

---

## 0.1.10 — 2026-04-20 — Elevation consistency rule

### Added
- `references/spacing-layout.md` — "pick one elevation treatment per hierarchy level" principle added to the *Shadows Over Borders* section. Guards against mixing shadow-recipe cards with flat-border cards in the same list.

### Sources consulted
- `zenobi-us/dotfiles` — `basic-design-principles` skill (depth & elevation strategy section). The single absorbed rule; other candidates reviewed and rejected as already-covered, too narrow, or upstream of polish scope.
- `wondelai/skills` — reviewed, nothing absorbed (strategic/foundational scope misalignment with polish layer).
- `shovonsheikh/saas-ui-master` — reviewed, nothing absorbed (design-system generator, orthogonal to polish layer).

---

## 0.1.6 — 2026-04-20 — Naming, evals, npm

### Changed
- Renamed sub-skills to `cami-design-layout`, `cami-design-interaction`, `cami-design-copy` for clear hierarchy in the command picker.
- Sharpened all four skill descriptions to be action-oriented with "use when" framing.

### Added
- npm package `cami-design` — `npm install -g` links all skills automatically.
- `postinstall` / `preuninstall` scripts for safe symlink management with `.bak` backup on conflict.
- Eval corpus: 10 seed cases covering side-stripe border, AI slop loading copy, passive voice errors, missing hover states, ease-in on enter animations, missing `prefers-reduced-motion`, inconsistent spacing, alpha color overuse, `disabled` vs `aria-disabled`, vague confirmation dialogs.
- Eval runner (`scripts/eval.js`) with LLM-as-judge scoring. Run with `npm run eval`.

### Fixed
- SPDX-License-Identifier header in LICENSE so GitHub detects Apache 2.0 correctly.

---

## 0.1.0 — 2026-04-20 — Initial scaffold

First version. Architecture inspired by pbakaus/impeccable's parent/child pattern and anthropics/skill-creator's meta structure.

### Added
- Parent skill `cami-design` with context-gathering protocol, mode router, shared principles, review output format.
- Sub-skill `layout` — alignment, sizing, spacing, hierarchy.
- Sub-skill `interaction` — animation decision framework, feedback, motion.
- Sub-skill `copy` — clarity, actionability, empty states, tone.
- References: typography, spacing-layout, motion, interaction, color, accessibility, anti-patterns, craft.
- Libraries: easing-curves (populated), palettes + font-pairings (empty placeholders).
- Empty eval corpus at `evals/evals.json`.

### Sources consulted
- `anthropics/skills/skills/frontend-design` — minimal SKILL.md pattern
- `anthropics/skills/skills/skill-creator` — progressive disclosure, eval loop, scripts pattern
- `pbakaus/impeccable` — parent/child architecture, review table format, context protocol, topical references
- `emilkowalski/skill` — animation decision framework, taste philosophy, review format
- `jakubkrehel/make-interfaces-feel-better` — concentric radius, tabular numbers, scale-on-press, image outlines, micro-detail principles
