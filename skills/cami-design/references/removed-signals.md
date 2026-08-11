# Removed Signals

Deep reference for the half of a diff the review usually never reads: the `-` side. Loaded by `cami-design-engineer` when the diff deletes lines in source, style, or template files. Skip it on an additions-only diff.

A regression is invisible in the post-change state. The code reads fine, because what's wrong about it is what's no longer there. Reading only the `+` side means an `aria-label` dropped during a refactor, or a `prefers-reduced-motion` block lost in a rewrite, ships as a clean review.

**A row below is a lead, never a finding.** Route the removal to the dimension that owns it, check the *Equivalent replacements* list, and report only what survives both. A removal is a regression only when nothing in the change replaces what it did.

## Read the stated intent first

Before the sweep, not after. A change that announces a removal is not regressing — the removal is the point, and reporting it back is the fastest way to make this check look broken.

Read the PR title and body (`gh pr view`), the linked issue, and the commit subjects. Then calibrate:

| The change says | Then a matching removal is |
| --- | --- |
| It removes, retires, or simplifies the thing | **Not a finding.** Say nothing. |
| It removes X, and Y also disappeared | A finding on Y only. Name why it falls outside the stated scope. |
| Nothing about removals | Normal sweep. |
| It is a pure refactor, a rename, a migration, a port | **Raise the bar, don't lower it.** Any removal here is by definition an unstated behavior change. |

That last row is the useful inversion. Intent doesn't only excuse removals, it convicts them: a `refactor:` commit that quietly drops an `aria-label` is worse than a feature commit that does the same, because the label said nothing would change.

Match on the substance, not the wording. "Drop the legacy tooltip" covers that tooltip's `aria-describedby`; it does not cover a focus ring deleted three files away. When in doubt about whether a removal falls inside the stated scope, report it and say which part of the intent you weighed it against — an author correcting your reading costs a sentence, a silent omission costs the check its credibility.

Nothing here overrides the verification bar. An intentional removal is still stated with `file:line` if it needs discussing at all; it just isn't a `Regression`.

## What "route to" means here

It names the dimension that owns the judgement. It is **not** an instruction to load that reference.

Half the rows below point at visual references — `motion.md`, `spacing-layout.md`, `typography.md`, `color.md`, `copy-patterns.md` — and `cami-design-engineer` is forbidden from re-doing design judgement (its NEVER list). That is not a contradiction to resolve by loading them. Reporting *that a signal was removed* is a code-review fact, verifiable from the diff. Deciding whether the replacement feels right is design judgement, and it belongs to the visual modes.

So for a signal outside engineer scope: state what was removed with its `file:line`, name the owning mode, and stop. Don't argue the aesthetics.

> `A2 | 🔴 | Regression | The row's `transition` was deleted (globals.css:253) | Restore it, or confirm the teleport is intended | Hover used to ease; it now snaps. Motion judgement belongs to `cami-design-interaction` — flagging the removal, not the curve. |

These are user-visible by definition, so they fall under Apply mode's existing rule: isolate anything with rendered impact and get sign-off before applying. Never auto-apply a restored transition or a reverted color.

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
- **The element no longer exists.** A deleted file or removed component takes every attribute in it down at once. Nothing regressed; the surface is gone. `--diff-filter=d` in the command below drops deleted files, but a component removed from inside a surviving file still needs this check by eye — it is the single largest source of false regressions.

## Searching the removed side

Every finding needs `file:line` — the verification bar applies here like anywhere else. A grep over raw diff text can't give you that: it strips the `+++` and `@@` headers along with everything else, leaving strings you cannot cite or navigate back to. Track the file and the hunk counter instead:

```bash
git diff -U0 --diff-filter=d origin/<base>...HEAD \
  -- '*.ts' '*.tsx' '*.jsx' '*.css' '*.scss' '*.html' '*.svelte' '*.astro' \
| awk '/^\+\+\+ b\//{f=substr($0,7);next} /^--- /{next} \
       /^@@/{split($2,h,",");l=-h[1];next} \
       /^-/{print f":"l": "substr($0,2);l++}' \
| grep -E 'aria-|role=|alt=|<label|for=|scope=|focus|outline|tabindex|prefers-|transition|will-change|exit|Presence|lang=|dir=|text-wrap|line-clamp|overflow-wrap|tabular-nums|font-feature|margin-(left|right)|padding-(left|right)|var\(--'
```

Output is `path:line: content`, with the line number resolving against the **base** revision — read it with `git show "${BASE}:path/to/file"`, not the working tree, where the line has moved or no longer exists.

Three details that matter, each of which silently drops findings if you simplify them away:

- `--diff-filter=d` excludes deleted files. Without it, deleting one component floods the sweep with every attribute it contained.
- The `/^--- /{next}` rule must come before the `/^-/` rule, or the `--- a/path` header is reported as a removed line.
- Filtering with `^-[^-]` instead of `^-` looks equivalent and isn't: it drops any removed line whose content starts with a dash, which is exactly `--custom-property` definitions and `-webkit-` properties. A deleted token definition is a signal in the table above.

Then read the surrounding hunk before deciding. `-U0` deliberately hides context, and a single removed attribute means nothing without the element it came from.

## Status

A confirmed removal is reported as `Regression`, not as a new mistake — see `review-protocol.md` → Status. The distinction is the point of the check: it tells the author they broke something that worked, which is a different conversation from "you wrote this wrong."

The exception is the one above: when the element itself is gone, nothing regressed and there is no finding at all.

## Attribution

Absorbed from jakubkrehel/skills `interface-review` — removed-signals table and the equivalent-replacements guard. Motion rows (transition, easing, exit, `will-change`) and the DS-fidelity routing for token swaps are additions specific to this skill.
