# Review Protocol

Shared rules inherited by every cami-design mode. Sub-skills load this file for the **Context Gathering Protocol**, **Design System Protocol**, and **Review Output Format** (severity scale, structure, closing, walkthrough, verify). The parent skill also loads it at the start of a full audit. Loading it is not a skill invocation; it is just shared rules.

## Context Gathering Protocol

Design skills produce generic output without project context. Before doing any design work, confirm you have this minimum:

- **Target audience**: Who uses this product, in what context?
- **Use cases**: What jobs are they trying to get done?
- **Brand personality / tone**: How should the interface feel?

**Gathering order:**
1. Check current instructions for a **Design Context** section — if present, proceed.
2. Check `.cami.md` at the project root — if present and sufficient, proceed.
3. Otherwise ask the user directly for the three items above. Do **not** infer from the codebase — code tells you what was built, not who it's for.

**If context is missing, stop and ask — do not run the audit.** A review without context produces generic findings that waste the user's time and miss what actually matters for the product. One focused question upfront beats a skewed audit.

## Design System Protocol

**Before suggesting any value — spacing, color, type size, radius, shadow — check for existing tokens, CSS variables, or component conventions in the codebase.**

Scan for:
- CSS custom properties (`--color-*`, `--space-*`, `--text-*`, `--radius-*`)
- Tailwind config (`tailwind.config.js/ts`) for custom tokens
- Design token files (`tokens.json`, `theme.ts`, etc.)
- Existing component patterns (how are buttons, cards, inputs already built?)

**Rule: propose adjustments using the existing system. Never override — suggest.** If a token exists for something, use it. If a value doesn't exist in the system, note the gap and propose adding it to the design system rather than hardcoding.

This applies to all modes: cami-design-layout, cami-design-interaction, cami-design-copy.

## Review Output Format

Present findings grouped into lettered sections. Each section clusters related issues under a descriptive title. One row per change, numbered within its section.

### Severity scale

Every finding carries a severity emoji so the user can scan the list at a glance.

| Symbol | Label | Meaning |
| --- | --- | --- |
| 🔴 | **Important** | Broken behavior, clear DS violation, accessibility blocker, or a craft miss the user *will* notice. Block-equivalent. |
| 🟡 | **Nit** | Worth fixing for craft and consistency, not blocking. Cap at 5 per section; mention `+N similar` if more. |
| 🟣 | **Pre-existing** | Diff-scoped reviews only (currently `cami-design-engineer`): the issue exists in the codebase but wasn't introduced by the current changes. Surface, don't block. Example: a `useMemo` wrapping `items.length` in a file the current diff touches but didn't create. Visual-design modes don't have a diff scope and use 🔴 / 🟡 only. |

**Cap unit is "section."** A section is one of the lettered output groups (A, B, C…) in the review. It is *not* the same as a review *dimension* (Composition, State, Perf…). Cap at 5 nits per output section regardless of how many dimensions feed into it.

How to calibrate: weigh **Frequency** (how often is this surface or path hit?), **Impact** (how hard to recover when it bites?), and **Persistence** (one-off vs. recurring). High on all three → 🔴. Low on all three → 🟡. Mixed → judgement, lean 🟡 unless it blocks intent.

### Structure

```
## A — [title describing what was found]
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| A1 | 🔴 | ... | ... | ... |
| A2 | 🟡 | ... | ... | ... |

## B — [title describing what was found]
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| B1 | 🔴 | ... | ... | ... |
```

### Section titles

The letter is fixed (A, B, C…) for addressing. The title is generated from what you actually found — never a generic category label.

- ✓ `## A — Concentric radius drift`
- ✓ `## B — Missing hover and focus states`
- ✓ `## C — Vague confirmation copy`
- ✗ `## A — Layout & rhythm` — too generic, tells the user nothing

Use only sections that have findings. Omit empty sections entirely.

### Closing

End every review by proactively offering walkthrough mode with an `AskUserQuestion` call. Do not use a generic sentence — the goal is that the user always knows the option exists without having to remember a keyword.

The question should be phrased naturally, in your own words, based on what the review found. Vary the wording across sessions so it stays human. Examples (not templates to copy verbatim):

- "Want to go through these one at a time, or take the list as it is?"
- "Happy to walk row by row if that's easier. Or leave it with you to pick?"
- "There's a lot here. Want me to help you triage, one decision at a time?"

Options should be: **Walk through** / **Take the list** (plus any contextual third option if it fits).

### Walkthrough mode

When the user chooses to walk through, or when intent is clear from their wording (wanting to decide item by item, asking for help deciding, one at a time), use `AskUserQuestion` per item.

Options per item: **Apply** / **Decline** / **Discuss** / **Stop**

- `Discuss` = user pushes back or proposes a variant; respond, then re-ask the same item.
- Before starting a new section, if its items are closely related, offer `Apply all in [section]` as a single question first — don't force row-by-row when a batch is obvious.
- On `Stop`, summarize what was applied, declined, and what's still open. Example: `Done: A1 and A2. Declined A3. Stopped with B1–B4 still open.`

### Verify pass (after fixes are applied)

Once the user has applied a batch of fixes (whether row-by-row in walkthrough or all at once after taking the list), offer a short Verify pass via `AskUserQuestion`. This is **not** "confirm you did it" — it's a focused second look at the modified code or UI to catch issues the fixes themselves introduced or that the first pass missed.

What to look for during Verify:
- A fix that resolved one issue but created another (e.g. tightening spacing on row A1 broke the rhythm with the unchanged row above)
- A missed adjacent instance of the same issue (the fix was applied in one place but the same pattern survives next door)
- A regression in an unrelated area touched by the same edit

Keep Verify findings in the same lettered-section format. If nothing new is found, say so explicitly — `Verify: clean.` is a valid output.

### Inline code

If an item requires a code snippet, include it inside the After cell. Never break out of the table format to show code separately.
