---
name: cami-design
description: UI audit before ship. Spots what's off, routes to layout, interaction, copy, or engineer. Use when reviewing a screen, a flow, or polishing a near-done project.
user-invocable: true
disable-model-invocation: true
argument-hint: "[cami-design-layout|cami-design-interaction|cami-design-copy|cami-design-engineer]"
---

# Cami — Design Skill

A personal, curated collection of design engineering knowledge. The parent skill holds shared principles and references; sub-skills (cami-design-layout, cami-design-interaction, cami-design-copy, cami-design-engineer) handle specific concerns — three for visual design judgement, one for code-side handoff polish.

License: Apache 2.0 — see `LICENSE`. Attribution: see `NOTICE.md`.

## Roles

This file plays two roles. Treat them as separate so they don't recurse into each other.

- **Shared rules** (always). The **Context Gathering Protocol**, **Design System Protocol**, and **Review Output Format** (severity scale, structure, closing, walkthrough, verify) live in `references/review-protocol.md`. Sub-skills load that file directly; run mode loads it too. This file no longer holds those rules inline.
- **Run mode** (only when invoked bare as `/cami-design`). The skill runs a full audit per the **Full Audit Contract** below, after loading `references/review-protocol.md`. If invoked with a sub-skill name as its argument (e.g. `/cami-design cami-design-layout`), skip the full audit and run that sub-skill directly instead.

This skill is invoked explicitly (`/cami-design` or a sub-skill), not auto-selected by the model: with the sub-skills installed, a design query routes to the matching sibling, so autonomous invocation of the parent is disabled.

## Modes (Sub-Skills)

Three visual modes + one code-handoff mode, scheduled differently. Each is invokable on its own.

| Mode | When to use | Read |
| --- | --- | --- |
| **cami-design-layout** | Alignment, sizing, spacing, visual hierarchy, rhythm, harmony | `../cami-design-layout/SKILL.md` |
| **cami-design-interaction** | Animation, hover/press states, micro-interactions, delight, feel | `../cami-design-interaction/SKILL.md` |
| **cami-design-copy** | Microcopy, labels, error messages, tone, clarity | `../cami-design-copy/SKILL.md` |
| **cami-design-engineer** | Code review for handoff: composition, design system fidelity, state, a11y, performance, types | `../cami-design-engineer/SKILL.md` |

When the user describes a concern that maps cleanly to one mode, invoke that mode. If it spans multiple visual-design concerns (e.g. "polish this page"), run them in order: **cami-design-layout → cami-design-interaction → cami-design-copy**.

`cami-design-engineer` is **opt-in, not part of the default visual-design chain**. It runs at a different moment — end of project, before tech-team handoff — and reviews code rather than design. Invoke it on its own, or accept the offer at the end of a full audit (see Full Audit Contract).

---

## Full Audit Contract

When the skill is invoked as `cami-design` (no sub-skill specified), the expectation is a **complete audit**, not a highlight reel. Partial coverage is the failure mode to avoid.

A complete audit requires all of the following.

### 1. All three visual-design sub-skills run

Always run layout, interaction, and copy. Not "one if it spans multiple" — all three, every time. The only exception is when the user explicitly invokes a single sub-skill (`cami-design-layout`, etc.).

`cami-design-engineer` is **not** part of this default chain — see §5 below.

### 2. Conditional reference reads

Load these references when the audit target contains the matching element. Do not read proactively otherwise.

| Read this reference | When the page has |
| --- | --- |
| `references/forms.md` | Any input, textarea, select, or form control |
| `references/accessibility.md` | Any interactive element (always true in practice) |
| `references/interaction.md` | Buttons, toggles, clickable rows, hover states |
| `references/motion.md` | Transitions, animations, reveals, loading indicators |
| `references/color.md` | Non-trivial color decisions or contrast questions |
| `references/typography.md` | Dense text, data tables, or typographic hierarchy work |
| `references/spacing-layout.md` | Any layout review (always true in practice) |
| `references/scroll-containers.md` | Sidebars, modals, dropdowns, command menus, code blocks, chat transcripts, carousels — any inset scrollable region |
| `references/anti-patterns.md` | Always. Run this sweep last. |

### 3. Surface coverage

Each of these surfaces must be either audited or explicitly acknowledged as skipped (with a reason).

- Desktop at rest
- Narrow viewport / mobile
- Modals and overlays present on the page
- Error and failure paths (what the user sees when a mutation fails)
- Empty states (zero items, no data yet)
- Loading and pending states
- Keyboard-only traversal (tab order, focus rings, reachability)
- Screen reader signals for dynamic content (live regions, aria states)

### 4. Scope preamble (before findings)

Start every full audit with a short paragraph stating what was audited and what was not, before any findings. No silent omissions. Format:

> **Scope:** Audited [list]. Did not audit [list] because [reason per item].

Example:

> **Scope:** Audited desktop at rest, keyboard traversal, the two modals on the page, empty and error states, and the anti-patterns sweep. Did not audit narrow viewport (page is marketed as desktop-only per CLAUDE.md) or screen reader behavior (would need to run with VoiceOver, not inferrable from code).

The preamble is a commitment device: it forces the audit to be deliberate about coverage, and gives the user a place to push back before reading the findings.

### 5. Offer the engineer pass at the end

After the three visual-design sub-skills complete and the user has either applied or filed the findings, offer `cami-design-engineer` via `AskUserQuestion`. Phrase naturally — examples (not templates):

- "Want me to also run the code-side review (`cami-design-engineer`)? Useful before passing the project to a tech team."
- "Happy to do a handoff-readiness pass on the code if this is heading to a dev team. Yes / skip?"

Options: **Run it now** / **Skip**.

This keeps design and engineer work as two distinct moments of the same audit. Skip the offer if the user has already invoked `cami-design-engineer` in the session, or if the target is clearly a static design with no code (Figma file, screenshots).

---

## Shared References

Loaded on demand — do not read proactively. Consult when a mode instructs you to, or when the current task requires depth on that topic.

The one exception is `references/review-protocol.md` (context gathering, design system rules, severity scale, output format): every mode loads it, and run mode loads it too. It is the shared protocol, not an on-demand topic.

### Visual-design references (layout, interaction, copy)

| Topic | File | When to read |
| --- | --- | --- |
| Typography | `references/typography.md` | Font choice, hierarchy, sizing, OpenType features, typographic characters |
| Color | `references/color.md` | Color systems, contrast, dark mode, native browser UI |
| Spacing & layout | `references/spacing-layout.md` | Grids, rhythm, concentric radius, safe areas, content resilience |
| Scroll containers | `references/scroll-containers.md` | Scrollbar gutter, tamed native scrollbars, scroll edge mask — inset scrollable regions |
| Motion | `references/motion.md` | Animation Decision Framework, easing, duration, scroll-linked, performance |
| Interaction | `references/interaction.md` | Press, hover, focus, tooltips, drag, mobile/touch |
| Forms | `references/forms.md` | Input attributes, labels, submit behavior, errors, placeholders, confirmations — load when reviewing form controls or form copy |
| Copy patterns | `references/copy-patterns.md` | Before/after tables (errors, empty states, CTAs), 6 Principles, NEVER list — load for any copy work |
| Accessibility | `references/accessibility.md` | Contrast, focus, keyboard, screen readers — canonical home for hit areas, reduced-motion fallback, contrast thresholds |
| Anti-patterns | `references/anti-patterns.md` | "AI slop" tells in visuals and copy, generic aesthetics to avoid |
| Craft | `references/craft.md` | During a Verify pass, when declining or deprioritizing a finding, or when a review needs to re-center on intent. The deep version of Core Principles |

### Engineer-mode references (code handoff)

| Topic | File | When to read |
| --- | --- | --- |
| Component Composition | `references/composition.md` | Component shape, prop surface, state location, compound patterns |
| Design System Fidelity (code) | `references/ds-fidelity.md` | Code-level DS violations — pairs with the Design System Protocol in `review-protocol.md` |
| State & Data Flow | `references/state.md` | Effects, async cleanup, race conditions, fetching, prop mutation |
| Cross-file Completeness | `references/cross-file-completeness.md` | A new union member, or a moved/renamed module — and the unchanged code that referenced it |
| A11y Implementation | `references/a11y-implementation.md` | Code-level a11y findings — pairs with `accessibility.md` principles |
| Internationalization | `references/i18n.md` | Hardcoded user-facing strings, non-locale-aware dates/numbers, English in the a11y tree |
| Performance & Rendering | `references/perf.md` | Keys, memoization, animation cost, hot handlers, list lookups, skeleton parity |
| Security Spot-Check | `references/security.md` | HTML injection, external link `rel`, browser API scope, leaked values |
| Type Safety & Code Clarity | `references/typing.md` | TS discipline, file naming, magic numbers, comments |

## Shared Libraries

Structured data — consult when you need concrete values. Markdown references are the teaching layer; libraries are the data layer for the same content.

| Library | File | Status |
| --- | --- | --- |
| Easing curves | `libraries/easing-curves.json` | Active — canonical values for `references/motion.md` |

---

## Core Principles

These apply across every mode. Keep them in mind whether you are composing a layout, tuning an interaction, or writing copy.

1. **Taste is trained, not innate.** Study why the best interfaces feel the way they do. Reverse engineer. Be curious.
2. **Unseen details compound.** Most details users never consciously notice — that is the point. Aggregate invisible correctness is what people feel.
3. **Beauty is leverage.** In a world of good-enough software, craft is the differentiator.
4. **Intent over intensity.** Bold maximalism and refined minimalism both work. What fails is the middle — the timid, generic default.
5. **Reversibility.** Prefer reversible changes. A subtle refinement that works beats a bold swing that misses.

---

## Review Output Format

The severity scale, lettered-section structure, section-title rules, closing / walkthrough / verify flow, and inline-code rule live in `references/review-protocol.md`. Load it before producing findings (run mode); sub-skills already load it in their required reading.

---

## Meta

- **Version**: the canonical version is `package.json`. Sub-skill `metadata.version` fields are intentionally absent — they never moved in lockstep with absorptions, so they were doing no work. Bump `package.json` on any absorption or substantive change. Log in `CHANGELOG.md`.
- **Evolution**: this skill grows by absorbing techniques from upstream skills. Never copy blindly — run the eval corpus first, then cherry-pick into the relevant reference file, then log in CHANGELOG with attribution.
- **Where new content lands.** Sub-skill SKILL.md files stay short — they index, route, and define output. Depth lives in `references/`. New patterns absorbed from upstream go into the matching reference file, not the sub-skill body.
