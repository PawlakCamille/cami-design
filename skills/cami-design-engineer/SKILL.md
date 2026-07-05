---
name: cami-design-engineer
description: Composition, DS fidelity, state, cross-file completeness, a11y, i18n, perf, security, types. Use before handoff to a tech team or for a senior front-end code review.
user-invocable: true
argument-hint: "[target]"
---

# Cami — Engineer

## Required reading

Before proceeding, load `../cami-design/references/review-protocol.md` for the shared **Context Gathering Protocol**, **Design System Protocol**, severity scale, and **Review Output Format**, then continue here.

---

A code review for design engineers, not for engineers. The goal is a clean handoff: design system kept honest, components compose without boolean sprawl, state wired without races, a11y real, types tight. Replaces the usual stack of `/review` + composition-pattern review + "review this like a senior FE" prompts.

## When to Use This Mode

- End of a project, before the tech team takes it over
- A polish pass on a vibe-coded prototype that "works but isn't ready to ship"
- The same JSX shape shows up in 3+ files and needs consolidating
- You want one pass that covers composition, design system, state, cross-file completeness, a11y, i18n, perf, security, and types

This skill reviews **code**. For visual judgement (spacing, motion, copy), use `cami-design-layout`, `cami-design-interaction`, or `cami-design-copy`.

## Preparation

1. Read `package.json` to identify the framework and version. React 18 vs 19 changes some rules (`forwardRef`, `use()`).
2. Read the linter/formatter config (biome, eslint, prettier). **Skip anything CI already enforces.**
3. Locate the design system: tokens file, Tailwind config, DS components directory, any `DESIGN.md`.
4. Check type strictness: `tsconfig.json`, project convention on `type` vs `interface`, presence of `as any`.
5. Validate the diff base, then scope. Run `git rev-parse <base> origin/<base>` — if the local base ref is behind the remote, `git fetch` and diff against `origin/<base>`, or recommend a rebase; a stale base inflates the apparent diff and hides commits the branch is missing. Then scope to changed code (`git diff <base>...HEAD`), excluding generated files, lockfiles, vendored dependencies, and test fixtures. Full-file review only if the user asks.
6. If the diff exceeds ~400 changed lines (excluding generated and lockfiles), ask the user to scope the review by feature or file before continuing. Wide reviews lose signal. Exception: when the PR's stated scope is "migrate N call sites to a new pattern," search *every* site even past the cap — the output still caps at 5 nits per section, but a `+N similar` count must be real, not sampled.
7. If the project has an E2E test suite (`e2e/`, `playwright/`, `cypress/`…), grep it for `data-testid` selectors before flagging refactors. Removing or renaming a referenced testid breaks the test silently. Note any testid changes in the review.
8. If the review target is a PR, read its body (`gh pr view`) and compare the scope it claims against the actual diff. A description that says something is deferred when it's bundled — or vice-versa — sets the reviewer up on a wrong premise. Flag the mismatch as a pre-merge action item.

## Check Codebase Precedent First

Before flagging anything as "should be X", search the repo for existing implementations of the same need. The most common review failure is proposing a "better" version of something the project already has in a different style — that introduces parallel approaches and breaks consistency.

The check, on every finding:

1. **Does the codebase already solve this?** Utilities, hooks, components, state libraries, naming conventions — search before recommending.
2. **If yes, align with what exists.** The finding becomes "reuse X" not "introduce Y."
3. **If the new code diverges from established conventions without an explicit reason, flag the divergence** so the author can decide intentionally rather than by accident.

Especially relevant for: utilities and hooks (`useDebounce`, `cn`, formatters), component patterns (modals, forms, tables), state management style, and file naming conventions.

When a finding offers two options, both have to be real. If option B is "…or leave it with a comment," it needs a concrete trigger — a named condition under which it's the correct answer, not a way to defer the call. If you can't name the trigger, drop B and state the recommendation.

## Review Dimensions

Nine dimensions. Each has a dedicated reference file with the concrete findings to flag. Load a dimension's reference when the diff touches that area; skip dimensions with no signal.

| Dimension | Reference | Load when |
| --- | --- | --- |
| Component Composition | `../cami-design/references/composition.md` | Component shape, prop surface, state location, compound patterns |
| Design System Fidelity | `../cami-design/references/ds-fidelity.md` | New or modified styled components, raw color/spacing values, DS imports, public API changes |
| State & Data Flow | `../cami-design/references/state.md` | `useState`, `useEffect`, async work, shared data fetching, state changing owner |
| Cross-file Completeness | `../cami-design/references/cross-file-completeness.md` | The diff adds a union member — variant, status, tab, plan tier, role, feature flag — or moves/renames a module |
| A11y Implementation | `../cami-design/references/a11y-implementation.md` | Any interactive element, form, modal, image, custom widget |
| Internationalization | `../cami-design/references/i18n.md` | User-facing strings, dates, numbers, `aria-label`/`alt` text in a project with a translation layer |
| Performance & Rendering | `../cami-design/references/perf.md` | Lists, memoization, animations, heavy state, hot handlers, loading skeletons |
| Security Spot-Check | `../cami-design/references/security.md` | `dangerouslySetInnerHTML`, external links, clipboard/file/camera APIs, logged or persisted values |
| Type Safety & Code Clarity | `../cami-design/references/typing.md` | TypeScript annotations, file naming, comments, magic numbers |

Each finding goes into the `Before | After | Why` table format defined in **Output**.

### Always check, regardless of dimension signal

- **Comment hygiene.** Scan every added or changed comment in the diff and flag any that restate the code, run verbose, or carry private/internal content (rules in `typing.md`). Run this even when the diff shows no other type or naming signal, so the check never depends on `typing.md` being loaded for another reason. It is also exempt from the re-review nit suppression below: verbose comments are most often introduced *during* fixes, exactly when a second pass would otherwise silence them.

## Output

### Severity scale

See `../cami-design/references/review-protocol.md` → Severity scale for the full table and calibration rules. Engineer mode uses all three symbols:

- 🔴 Important — bug, broken a11y, DS violation that ships inconsistent UI. Block handoff.
- 🟡 Nit — craft and maintainability. Cap at 5 per output section; `+N similar` for the rest.
- 🟣 Pre-existing — issue exists in the codebase but wasn't introduced by the current diff. Surface, don't block.

### Verification bar

Every finding cites `file:line` from the actual code. No flagging based on naming or inference. If you can't point to the line, drop the finding.

The same bar applies in the other direction — to **non-findings**. Don't make positive safety claims you haven't checked. If you write "this pattern is safe," cite the line that proves it; if you write "handled elsewhere," read that elsewhere and cite it. Never "likely handled," "probably tested," "should be fine." Either verify with a citation or flag it as unverified. *"This looks fine"* is not a finding — and it is not a clean bill of health either.

### Re-review convergence

Second pass over the same code: suppress new nits, post Important findings only.

### Format

Open with a one-line tally:

> **Tally:** X 🔴 important · Y 🟡 nit · Z 🟣 pre-existing.

If nothing is Important, lead with `No blocking issues for handoff.` before the tally. When the audit is clean of Important findings, you may also add a short `## Verified` block listing 3–5 conventions or invariants that were checked and held — Conventional Commits, DS tokens, React 19 idioms, no AI attribution. For a handoff review, naming what was checked and passed reassures the receiving team. Keep it factual, not a victory lap.

Then group findings using the lettered-section format from `review-protocol.md`. Title each section from what was actually found, not from the dimension name.

```
## A — Boolean prop sprawl on <Tabs>
| #  | Severity | Before | After | Why |
|----|----------|--------|-------|-----|
| A1 | 🔴 | `<Tabs isVertical isLazy isFitted hasDivider>` (src/views/contacts/tabs.tsx:42) | `<Tabs orientation="vertical" lazy fitted><Tabs.Divider /></Tabs>` | Five boolean props mix orthogonal concerns. A variant prop plus compound parts scales; booleans don't. |
| A2 | 🟡 | … | … | … |
```

Inline code snippets go inside the After cell — never break out of the table.

Always close with a **Test coverage** line, whatever the severity counts: enumerate the testable surfaces the diff introduced — hooks, utilities, pure functions with branching — by name and `file:line`, e.g. `formatPrice (3 branches), useFilteredList edge cases`. Don't write the tests; the named list is the deliverable for the tech team. "No tests written" can be acceptable for the PR — an empty enumeration is not.

### Apply mode

**After presenting the findings, default to applying them** unless the user asked for a report only, or chose walkthrough. Don't walk through item by item. Use judgement: apply the findings worth applying, not necessarily all of them. Leave a nit when the fix costs more than it's worth, and state which you skipped and why. Apply code-level findings directly.

**Isolate any finding with user-visible impact** (layout, spacing, color, motion, copy the user reads) and get explicit sign-off before applying it. This division is the contract of a *design* engineer review: the reviewer is trusted on code quality; the designer decides anything visual. When in doubt whether a change is visible, treat it as visible and ask.

### Closing

Apply mode is the default close: apply the non-visual findings, then list any visual ones awaiting sign-off. Offer Walkthrough instead when the user wants to decide item by item, and run the Verify pass after fixes land. See `../cami-design/references/review-protocol.md` → Closing / Walkthrough mode / Verify pass.

## NEVER

- Flag formatting / lint / type-error issues — CI does that.
- Flag findings in generated files (`*.gen.ts`, `dist/`, `build/`), lockfiles (`*.lock`, `package-lock.json`), or vendored dependencies (`node_modules/`, `vendor/`).
- Flag in test files when the violation is intentional (mocks, fixtures, edge-case scenarios).
- Flag without a `file:line` citation.
- Suggest abstractions for code that appears fewer than 3 times.
- Refactor for hypothetical future requirements.
- Add comments explaining what well-named code already shows.
- Post more than 5 nits per output section — summarize the rest as `+N similar`. (Output sections are the lettered groups A, B, C…, not review dimensions.)
- Surface new nits on a re-review pass; only Important findings the second time around.
- Re-do design judgement (spacing, motion, copy) — that belongs in the other three sub-skills.

## References

The nine dimension references are listed in the *Review Dimensions* table above — load each when the diff touches its area. Two shared references also apply:

- `../cami-design/references/accessibility.md` — a11y principles (contrast, focus, screen readers) that pair with `a11y-implementation.md`
- `../cami-design/references/anti-patterns.md` — generic / "AI slop" tells, some apply at code level (`h-screen` → `100dvh`, mixed icon stroke weights, etc.)

External upstream sources (Anthropic Code Review, Vercel Composition Patterns, Vercel React Best Practices) are credited in `NOTICE.md`.
