# Removed Signals

Deep reference for the half of a diff the review usually never reads: the `-` side. Loaded by `cami-design-engineer` when the diff deletes lines in source, style, or template files. Skip it on an additions-only diff.

A regression is invisible in the post-change state. The code reads fine, because what's wrong about it is what's no longer there. Reading only the `+` side means an `aria-label` dropped during a refactor, or a `prefers-reduced-motion` block lost in a rewrite, ships as a clean review.

**A row below is a lead, never a finding.** Route the removal to the dimension that owns it, check the *Equivalent replacements* list, and report only what survives both. A removal is a regression only when nothing in the change replaces what it did.

## Signals

| Removed from the `-` side | Route to | What to check |
| --- | --- | --- |
| `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role=` | `a11y-implementation.md` | The control or region lost its accessible name, description, or announcement |
| `alt=`, `<label`, `for=`, `scope=` | `a11y-implementation.md` | Image, field, or table cell lost its programmatic association |
| `<button>`, `<a>`, `<nav>`, `<main>`, `<ul>` replaced by `div` or `span` | `a11y-implementation.md` | Keyboard and assistive-technology behavior traded for styling freedom |
| `:focus-visible`, `:focus`, `outline`, `tabindex` | `accessibility.md` | Keyboard users lost the focus indicator, or the element left the tab order |
| `prefers-reduced-motion`, `prefers-contrast` | `accessibility.md` | Motion or contrast now ignores the user's system preference |
| A `transition` or `transition-property` deleted | `motion.md` | A state change that used to ease now teleports — the jar the transition existed to prevent |
| An easing token swapped for a literal, or a named curve for a default | `motion.md` | Motion drifted off the system's curve; `linear` and `ease` are rarely the intended answer |
| `AnimatePresence`, an `exit` prop, or an exit keyframe removed | `motion.md` | The element now pops out instead of leaving; exits are the first thing lost in a refactor |
| `will-change` removed from a surface that still animates | `motion.md` | Only a finding if first-frame stutter returns — verify before flagging |
| Logical properties swapped for `left` / `right` / `margin-left` | `spacing-layout.md` | Direction-aware layout was dropped |
| `lang=`, `dir=` | `typography.md` | Language metadata or text direction was dropped |
| `text-wrap`, `line-clamp`, `overflow-wrap`, `tabular-nums`, `font-feature-settings` | `typography.md` | Text rendering, wrapping, or numeral alignment silently changed |
| A color token swapped for a literal, or for a lighter token | `ds-fidelity.md`, then `color.md` | A DS violation first; then measure whether the rendered contrast pair still passes |
| A user-facing string deleted or shortened | `copy-patterns.md` | A label, error, or empty state lost information it was carrying |
| A translation key or catalogue entry removed | `i18n.md` | The string is now hardcoded, or the locale falls back to a missing key |

## Equivalent replacements

These clear the signal. Check them before routing anything, or the review fills with refactors reported as regressions — the failure mode that makes this whole check untrustworthy.

- `aria-label` giving way to `aria-labelledby` pointing at visible text.
- An explicit `role` dropped because the element became the native equivalent — `role="button"` disappearing as a `div` becomes a `<button>`.
- `outline` replaced by a `box-shadow` focus ring that still meets the focus-indicator rule.
- `tabindex="0"` dropped from an element that is now natively focusable.
- A color literal replaced by a token that measures the same rendered pair.
- A physical property replaced by its logical counterpart — that is the fix, not the regression.
- A string moved into the translation catalogue rather than deleted.
- A CSS transition replaced by a motion-library variant covering the same state change, or the reverse.

## Searching the removed side

Restrict the search to deleted lines, so additions elsewhere in the hunk don't mask a removal:

```bash
git diff -U0 origin/<base>...HEAD -- '*.tsx' '*.jsx' '*.vue' '*.css' \
  | grep -E '^-[^-]' \
  | grep -E 'aria-|role=|alt=|focus|tabindex|prefers-|transition|exit|lang=|dir='
```

Then read the surrounding hunk before deciding. `-U0` deliberately hides context, and a single removed attribute means nothing without the element it came from.

## Status

Every confirmed removal is reported as `Regression`, not as a new mistake — see `review-protocol.md` → Severity scale. The distinction is the point of the check: it tells the author they broke something that worked, which is a different conversation from "you wrote this wrong."

## Attribution

Absorbed from jakubkrehel/skills `interface-review` — removed-signals table and the equivalent-replacements guard. Motion rows (transition, easing, exit, `will-change`) and the DS-fidelity routing for token swaps are additions specific to this skill.
