# Cross-file Completeness

Deep reference for the one engineer dimension that requires reading code *outside* the diff. Loaded by `cami-design-engineer` when the diff adds a member to an existing union — a variant, status, tab, plan tier, role, or feature flag — or moves or renames a module.

When the diff adds a new member to a union that already has siblings, the bug is rarely in what changed — it's in what *didn't* change but should have. The new value works in the page you built and falls through to a wrong default everywhere else.

## The Check

When you spot a new union member in the diff:

1. **Grep for the sibling values.** The diff adds `"danger"` to `ButtonVariant` → search the repo for `"primary"`, `"secondary"`, `"ghost"`. Every match is a potential consumer.
2. **Read each match — don't just scan filenames.** A `switch (variant)` in a far file, an allowlist `["primary", "secondary"]`, an `if (status === "active" || status === "past_due")`, a config map keyed by the old siblings — each is a place the new value silently falls through.
3. **Flag the gaps with `file:line`.** The fix is "handle the new value here," not "refactor the consumer."
4. **Offer the durable fix once.** Where a consumer can be made exhaustive — `satisfies Record<Union, T>` on config maps, a `never` check in the `switch` default — suggest it, so the next added member fails at compile time instead of needing this grep (rules in `typing.md`).

## Common Shapes

- `switch` / `if-else if` chains keyed on the union, missing a branch for the new member
- Allowlists or filter arrays of sibling values (`["active", "past_due"]`) that omit the new one
- Config maps (`{ primary: ..., secondary: ... }`) where the new key has no entry and access falls through to `undefined`
- Type-narrowing helpers (`isInteractive(variant)`) that need the new case
- Analytics, telemetry, or feature gates that branch on the value

## Module Moved or Renamed — Stale References Left Behind

When the diff moves or renames a module, references to the old path can survive elsewhere — most silently in test files: a `vi.mock('../old/path/to/module')` still pointing at the pre-move location is a dead mock, so the real module runs untested while the suite still passes. Grep the old path and the old name across the repo — test files included — after any move or rename.

### Renames that don't fail the build

A renamed module usually breaks loudly. These don't: the old name lives on in a string, so nothing type-checks it and nothing errors — the feature just stops working somewhere nobody looked.

| Renamed or removed | Where the old name survives |
| --- | --- |
| A translation key | Locale catalogues for every *other* language, and any key built by concatenation |
| An analytics or telemetry event | Dashboards and funnels outside the repo — flag it, you can't grep it |
| A URL query param or route segment | Saved links, redirects, deep links from email, e2e specs |
| An API request or response field | Sibling repos and clients built against the old shape |
| A `data-testid` | The e2e suite, which keeps passing while asserting nothing |
| A prop or exported symbol | Barrel files and re-exports, which forward a name that no longer exists |

Grep the old name as a **string**, not as an identifier, and include locale files, test specs, and config. When the value crosses a network or a storage boundary, say so plainly in the finding: the fix isn't only in this repo.

Behavior that changed rather than moved — a conditional, a default, a returned shape — belongs to `behavior-diff.md`.

## Attribution

Absorbed from garrytan/gstack `review` — Enum & Value Completeness. Module-move check added from production PR review feedback.
