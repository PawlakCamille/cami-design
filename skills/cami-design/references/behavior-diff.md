# Behavior Diff

Deep reference for the findings that live in *changed* code rather than added or deleted code. Loaded by `cami-design-engineer` when the diff modifies an existing conditional, early return, default value, dependency array, or the signature or return shape of a shared symbol.

`removed-signals.md` catches what was deleted. This catches what was **rewritten** — the line that still exists, still reads fine, and no longer does the same thing. Neither is visible in a review that only asks "is this new code good?", because the new code usually is. The defect is in the delta.

The question is never "does this code look correct." It is: **what did the old path do, and is anything still relying on it?**

## Diff the behavior, not the code

For every changed conditional, early return, default value, dependency array, or guard clause, state the before and the after in plain words, then go looking for who depended on the before.

| Changed | Ask |
| --- | --- |
| A conditional or guard | Which inputs took the other branch before and take this one now? |
| An early return | What used to run after it, and for which callers does it now run — or stop running? |
| A default value or fallback | Who was relying on the old default? An omitted prop, a missing config key, a null from the API |
| A dependency array | What no longer re-runs, or now re-runs on every render? |
| A returned shape | Does every destructuring site still get what it reads? |
| An error path | Was a thrown error swallowed, or a swallowed one now thrown? |

The flows that break are the ones nobody opens while building the feature: empty states, error paths, permission-gated variants, the feature-flag OFF branch, the first render before data arrives, and the logged-out view. Name the flow in the finding — "this breaks the empty state" is actionable, "this conditional changed" is not.

## Hold a refactor to its claim

When the change calls itself a refactor, rename, migration, port, or cleanup, it has promised no observable behavior change. Any behavior change it makes is a finding **by definition**, and a more serious one than the same change in a feature PR: reviewers and QA both read the label and skip the check.

This is the one place where the stated intent raises the bar instead of lowering it. See `removed-signals.md` → Read the stated intent first for the other direction.

## Sweep the consumers of shared code

When the diff modifies something shared — an exported function, hook, component, type, translation key, or CSS utility — the bug is rarely in the file that changed. **A change that is correct for the feature in this PR and wrong for an untouched caller is the classic regression.**

1. **Grep every call site.** Search whatever the review's scope actually is — which for this skill's default (a branch, checked out, possibly with uncommitted and untracked work) is the working tree. `--untracked` is not optional: without it a brand-new file calling the changed symbol is invisible, the same scope leak Preparation step 5 closes.

   ```bash
   git grep -n --untracked "<SymbolName>" -- '*.ts' '*.tsx' '*.js' '*.mjs' '*.cjs' '*.jsx' '*.vue' '*.svelte'
   ```

   Use `-n`, not `-l`: `-l` overrides it and returns bare paths, which then need a second `git show` and still leave you without the line number the verification bar requires. `-n` gives `path:line: content` in one command.

   Only when reviewing a fetched ref you have **not** checked out does the revision belong in the command — and that ref has to be created first, since git does not maintain it:

   ```bash
   git fetch origin "pull/<n>/head:refs/remotes/pr/<n>" --no-tags
   git grep -n "<SymbolName>" refs/remotes/pr/<n> -- '*.ts' '*.tsx'
   ```

   Results then come back as `<rev>:path:line:` and are read with `git show "<rev>:path"` — never the working-tree copy, which on a fork PR is a different file.

   For a token or CSS utility, grep the *name* — consumers reference it and never import it — and pass it after `-e`, or git parses a leading dash as an option and dies with `unknown option`:

   ```bash
   git grep -n --untracked -e '--color-accent' -- '*.css' '*.tsx' 'tailwind.config.*'
   ```

2. **Read each one against the new behavior** — the call, not the filename. Does it pass the argument that just became required? Read the field that just got renamed? Rely on the default that just changed? The mechanics of reading matches rather than scanning them, and of making the next such change fail loudly, are the same as in `cross-file-completeness.md` → The Check, steps 2 and 4. Don't run both sweeps twice over the same symbol.

3. **Order and cap.** Route and layout entry points first, then by how many files reference the symbol, ties broken by proximity. Review the first five and **state how many you did not expand.** An unstated cutoff produces a review that looks complete and is not — the same honesty rule as the nit cap.

4. **Offer the durable fix once** where the consumer can be made to fail loudly next time: a required prop instead of an optional one with a default, an exhaustive `satisfies Record<Union, T>`, a `never` check in a `switch` default.

Pairs with `cross-file-completeness.md`, which covers the neighbouring case: not a changed symbol, but a *new member* added to a union whose consumers were never told.

## Data and clients that outlive the deploy

Behavior changes reach further than the codebase when the change touches something persisted or transported. Check that yesterday's data still parses under today's code:

- A migration, an API response field, or a stored JSON shape: can the new code read rows written by the old one?
- A removed or renamed API field: is anything still sending or reading it?
- Anything assuming every client updates at once. Long-lived clients — a desktop app left open for weeks, a cached bundle, a mobile build pending review — will run the old code against the new data. Flag any change that assumes otherwise.

## Attribution

Distilled from the author's own internal red-flag PR-review skill, generalised here: the behavior-diff questions, the pure-refactor rule, and the consumer sweep. The consumer ordering and the state-what-you-skipped rule come from jakubkrehel/skills `interface-review`, principle 2.
