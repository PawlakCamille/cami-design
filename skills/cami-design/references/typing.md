# Type Safety & Code Clarity

Deep reference for TypeScript discipline and codebase consistency. Loaded by `cami-design-engineer` when the diff touches type annotations, file naming, or comments.

## `as any`

Hides a type error rather than fixing it. Narrow with `unknown` + a type guard, or fix the source type.

## `interface` Where the Project Uses `type Props`

Stay with the project convention. Mixed styles look unintentional.

## Manual Annotations Where Inference Would Do

`const count: number = items.length` — the type is obvious. Drop the annotation.

## Barrel Files in a Project That Avoids Them

New `index.ts` re-export added where the convention is direct imports.

## Comments Explaining What the Code Does

Delete. Keep only comments that explain *why* a non-obvious choice was made (a workaround, a constraint, an invariant).

## Verbose Comments

A comment that survives the *why* test but reads as prose — full sentences, hedging (`likely`, `should`, `probably`), filler (`basically`, `just`, `really`), restating the surrounding code. Rewrite terse: one short line, fragments OK, drop hedging, keep code symbols and error strings exact. Escape hatch: write it out fully when ordering, a multi-step constraint, or a correctness invariant would be ambiguous without conjunctions.

Before: `// We're basically just memoizing this here because otherwise the component would likely re-render on every parent update, which is something we want to avoid for performance reasons.`
After: `// Memoize: parent re-renders cascade otherwise.`

## Comment or JSDoc Describing Old Behavior

The diff changed what the code does but left the comment describing the old behavior — a JSDoc that says `className` lands on the tab list when it now lands on the outer wrapper. A wrong comment is worse than no comment: it actively misleads. When a change alters behavior, update or delete every comment in range.

## Magic Numbers

A `7` or `0.85` in the middle of code with no name. Extract to a named constant.

## Function Name Promises Behavior It Doesn't Deliver

`triggerFileDownload` that builds a blob URL and returns it — triggering nothing; the caller does the download. A name claiming a side effect the function doesn't perform sends every reader looking in the wrong place. Name it for what it does (`buildFileBlobUrl`), or make it do what the name says.

## Files / Directories Not in kebab-case

If the project convention requires kebab-case, rename. Mixed casing causes import friction across OSes.

## `function foo()` Where the Convention Is Arrow Functions

Stay consistent with the project's existing style.

## Test-Only Logic in Production Code

A production module carrying test-mode branches, stub credentials, or `if (import.meta.env.TEST)` paths — a `supabase.ts` that falls back to a stub url/key "so the module loads in tests." The stub belongs at the test boundary (`vi.mock`, a setup file, `.env.test`), not shipped in the module. Test scaffolding in production code is dead weight at best and a wrong-environment hazard at worst.

## Untested Business Logic

Hooks, utilities, or pure functions with branching logic (calculations, conditionals, state machines) and no test file. Don't write the tests yourself, but flag what the tech team should cover, e.g. `"calculateDiscount has 3 branches — needs tests for zero-quantity and expired-coupon cases"`.

## Attribution

Synthesized from common TS review practice; alignment with Vercel Labs `react-best-practices` and Anthropic Code Review guidelines.
