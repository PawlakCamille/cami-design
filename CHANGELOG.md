# Changelog

Track every absorption, addition, and substantive change. Each entry cites source when material came from an upstream skill.

Format: newest first. Group under a version heading. Include date.

---

## 0.4.4 — 2026-08-11 — engineer: stated intent, and the code that changed rather than moved

0.4.3 taught the review to read deleted lines. It had no idea *why* they were deleted, so a PR titled "retire the legacy tooltip" would report its own purpose back as a wall of regressions. And it still only looked at lines added or removed — never at the line that survived the diff and quietly stopped meaning the same thing.

- **`references/removed-signals.md` — read the stated intent first.** Before the sweep, not after. PR title, body, linked issue, commit subjects, then calibrate: an announced removal is the change working and is not a finding; a removal outside the announced scope is a finding on that part only. Matching is on substance, not wording — "drop the legacy tooltip" covers that tooltip's `aria-describedby`, not a focus ring deleted three files away.
- **Intent convicts as well as excuses.** A change calling itself a refactor, rename, migration, or port has promised no observable behavior change, so any removal in it is an unstated behavior change *by definition* — the bar goes up, not down. Reviewers and QA both read the label and skip the check, which is exactly why it's worth more scrutiny, not less.
- **Preparation step 8 promoted.** Reading the PR body was a one-shot scope check; it now calibrates findings through the whole review.

### `references/behavior-diff.md` (new dimension, the tenth)

The complement to removed signals: not what was deleted, but what was **rewritten** — the line that still exists, still reads fine, and no longer does the same thing.

- **Diff the behavior, not the code.** For every changed conditional, early return, default value, dependency array, or returned shape: state what the old path did, then find what relied on it. The flows that break are the ones nobody opens while building the feature — empty states, error paths, permission-gated variants, the feature-flag OFF branch, first render before data. Name the flow in the finding.
- **Sweep the consumers of shared code.** A change correct for the feature in this PR and wrong for an untouched caller is the classic regression. Grep every call site against the reviewed revision rather than the working tree, read each call rather than the filename, order route entry points first then by reference count, review five and **state how many you skipped**.
- **Data that outlives the deploy.** Migrations, stored JSON, API fields: can the new code read rows the old one wrote? Flag anything assuming every client updates at once.

### `references/cross-file-completeness.md` — renames that don't fail the build

A renamed module breaks loudly. A renamed translation key, analytics event, query param, API field, or `data-testid` does not: the old name survives in a string, nothing type-checks it, and the feature stops working where nobody looked. Grep the old name as a *string* including locale files, specs and config — and when it crosses a network or storage boundary, say so, because the fix isn't only in this repo.

Distilled from the author's own internal red-flag review skill, generalised out of its project specifics. Consumer ordering and the state-what-you-skipped rule from jakubkrehel/skills `interface-review` principle 2, absorbed here after being deliberately skipped in 0.4.3.

---

## 0.4.3 — 2026-08-11 — engineer: read the removed side of the diff

The review read only the post-change state, so anything a refactor dropped shipped clean. An `aria-label` removed while restyling a control, a `transition` deleted in a rewrite, a `prefers-reduced-motion` block lost in a merge — all invisible to a reviewer looking only at the `+` side, because what's wrong about the code is what's no longer in it.

- **`references/removed-signals.md`** (new). Sweeps the `-` side when the diff deletes lines, routing each signal to the dimension that owns it: a11y attributes and semantics, focus and reduced-motion, deleted transitions and exits, logical properties, `lang`/`dir` and text-rendering, token-to-literal swaps, dropped strings and translation keys. Skipped entirely on an additions-only diff.
- **Equivalent replacements guard.** A signal is a lead, not a finding. `aria-label` → `aria-labelledby` on visible text, `outline` → a compliant `box-shadow` ring, a literal → a token measuring the same pair, a physical property → its logical counterpart: all clear the signal. Without this list the check reports refactors as regressions and stops being trustworthy.
- **Routing is naming, not loading.** Half the signals are owned by visual references engineer is forbidden to re-judge. It reports the removal with `file:line` and names the owning mode; it does not load `motion.md` to argue about the curve. These findings are user-visible by definition, so they fall under Apply mode's existing sign-off gate and are never auto-applied.
- **`references/review-protocol.md` — status as its own axis.** Severity says how bad; status says who caused it. `Introduced` (unmarked default) / `Regression` (marked) / `Pre-existing`. Carried in a `Status` column that diff-scoped reviews add after `Severity`; visual modes omit it. Status is decided by what the diff *touched* — a line the change never touched is pre-existing even three lines from a hunk. Resolved by blaming `HEAD` and testing whether the commit falls in the branch range; blaming the base ref cannot answer the question, since everything reachable there predates the change by definition.

### Two scope leaks in engineer Preparation

Both produced a review that claimed coverage it hadn't delivered.

- **Untracked files were invisible.** `git diff HEAD` reports tracked changes only, so a new component or stylesheet never `git add`ed was silently outside a review scoped to the working tree. Now paired with `git ls-files --others --exclude-standard`.
- **Branch and uncommitted were either/or.** On a branch with commits *and* a dirty tree, only the branch diff was reviewed and the dirty files were dropped without a word. Now both, with the two counts stated separately.

Source: jakubkrehel/skills `interface-review`. The motion rows (deleted transitions, easing-token swaps, removed exits, `will-change`) and the DS-fidelity routing for token swaps are additions, not upstream. What was deliberately left behind is recorded in `NOTICE.md`.

---

## 0.4.2 — 2026-07-06 — engineer: exhaustive mode + visible nit cap

The nit cap was silently swallowing minor findings, which read as the review arbitrarily limiting itself.

- **`cami-design-engineer/SKILL.md` — exhaustive mode.** Invoke with `all` (`/cami-design-engineer all`), or ask to see everything, to lift the 5-nit-per-section cap and list every finding. Default stays capped for scannability. `all` lifts only the nit cap, not the >400-line diff scoping.
- **Cap is now announced.** When it fires, the review names the real count (`Showing 5 of 12 nits in this section; run with \`all\` for the rest`) instead of a bare `+N similar`, so hidden findings are visible as a number. 🔴 Important and 🟣 Pre-existing were never capped and still aren't.

### Review heuristics from real use

Four findings the skill (or its author) missed on real reviews this month, now encoded. Rules with provenance.

- **`references/composition.md` — presentational component that self-suppresses on an optional prop.** An optional input plus an internal `if (!x) return null` is a smell; make the input required and lift the condition to the caller. From a real component-API review.
- **`references/state.md` — a merge that can outgrow its input, feeding a count or primary.** `[...a, ...b]` where one source isn't a subset of the payload is invisible on a list but drifts any derived count or primary; intersect with the canonical set. Caught downstream by a bot reviewer after this skill missed it.
- **`references/typing.md` — same comment rationale in more than one place.** State a reason once at its canonical spot; duplicated rationale across files drifts on refactor.
- **`cami-design-engineer/SKILL.md`** — comment-hygiene check now says to treat itself as a genuine second read, not a rubber-stamp (dedupe cross-file rationale, re-check after refactors); and Preparation says to gather the minimum load-bearing context and deliver, not spelunk a small PR for many rounds first.

---

## 0.4.1 — 2026-07-06 — review artifact: real-surface previews + cleanup

First-real-use hardening of the review artifact, both fixes in `references/review-artifact.md`.

- **The surface is part of the preview.** A contrast finding rendered its before/after text on the artifact's decorative grey stage while the copy ships on white, so the stated ratio (computed against the real background) disagreed with what the eye saw on the panel, and the change couldn't be judged. New rule: for any finding whose verdict depends on the surround (contrast, color, opacity, elevation, borders), render the fragment on production's exact background, never a decorative tint or grid. Demo stages stay allowed only when the surround is irrelevant (easing, spacing, radius).
- **Lifecycle.** The artifact is a throwaway review surface, not a deliverable. Prefer the hosted artifact capability (lives outside the project); the file fallback goes to a disposable, gitignored location, is never committed, and is deleted once decisions are pasted back and Apply mode has run.

---

## 0.4.0 — 2026-07-06 — HTML review artifact mode (opt-in)

A new, opt-in way to *deliver* a visual review: an interactive approval artifact, like a design-flavoured PR review. Additive only — the default closing (Walk through / Take the list, and Apply mode in engineer) is unchanged.

- **`references/review-protocol.md`** — the closing now offers a fourth option, **Build an HTML review**, for the visual modes and full audits only (`cami-design-engineer` keeps apply-by-default; code diffs gain little from a rendered artifact). Scoped to reviews with many auto-renderable findings.
- **`references/review-artifact.md`** — new reference, loaded only when the option is chosen. Specifies the artifact: one card per finding with a live before/after preview, per-item approve / discuss / deny, and a copy-decisions block that pastes back to drive Apply mode. Its load-bearing rule: **never fabricate the current state** — render a faithful live preview only when the change is reproducible from the reviewed code in isolation (easing/duration played side by side, press-scale, radius, spacing, color, copy), otherwise show the code diff. Honesty over spectacle.

Pattern credit: adapted from a public approve/deny/discuss review-artifact flow shared by @kylezantos. The review content and the no-fabricated-previews constraint are this skill's own.

Second absorption pass over `emilkowalski/skills` (now five skills). `review-animations` was mined in 0.2.10; `emil-design-eng` is the repack of the original `emilkowalski/skill` and its catalog was ~95% already covered. Four surgical additions survive the duplication filter.

### Interaction

- **`cami-design-interaction/SKILL.md` — Missed Opportunities** new additive dimension (from `improve-animations`). The existing dimensions are corrective; this one flags places that *don't* animate but should: teleporting state changes, spatially-connected UI with no origin motion, rare high-emotion moments with unused delight budget. Own output section, a handful at most, grounded in observed seams.
- **`references/interaction.md` — Auto-dismiss Timers** new finding (from `emil-design-eng` / Sonner). Timed UI pauses its countdown while the tab is hidden and while hovered; a toast that expires in a background tab was never seen.

### Motion

- **`references/motion.md` — near-duplicate curves/durations are a consolidation finding** (from `improve-animations`). Hand-typed cubic-beziers that almost match belong in `--ease-*`/`--duration-*` tokens; the design-system-first rule applied to motion.
- **`references/motion.md` — off-screen surfaces travel by their own size** (from `emil-design-eng`). `translateY(100%)` percentages over hardcoded pixel offsets for drawers/toasts.

### Deliberately not absorbed

- **`improve-animations`' advisor workflow** (audit → self-contained plans in `plans/` for cheap executors): orthogonal to this skill's Apply-mode modality, where the reviewer applies its own findings.
- **Subtle bounce (0.1–0.3)**: third consecutive rejection; crisp-by-default `bounce: 0` stands.
- **`animation-vocabulary`**: a naming glossary, a different job than reviewing; no review content to mine. Install Emil's skill directly for that use case.
- **`apple-design`**: opinionated HIG styling, not this skill's bar.
- Marginal deltas rejected as not-our-practice or near-duplicates: decorative mouse-tracking springs, direction-aware transitions, settled-decisions rule (covered by Check Codebase Precedent First), prompt-injection guard (platform-level concern).

---

## 0.3.3 — 2026-07-06 — engineer-mode audit response

Response to a three-lens audit (skill architecture, content integrity, runtime behavior) of `cami-design-engineer`. Fixes contradictions with the shared protocol, a broken git recipe, and the highest-value content gaps.

**`cami-design-engineer/SKILL.md`:**

- **Protocol precedence declared:** two explicit engineer-mode overrides at Required reading — Context Gathering never gates a code review, and Closing follows Apply mode rather than the protocol's ask-every-time walkthrough offer. Previously the skill and its mandatory shared protocol ordered incompatible closes with no tiebreaker.
- **Stale-base git recipe fixed:** `git rev-parse <base> origin/<base>` compared two SHAs, which shows divergence, not "behind" — and only works after a fetch it sequenced too late. Now: fetch first, diff `origin/<base>...HEAD`, detect "behind" with `git rev-list --count`. `<base>` is defined (PR base, else default branch) and the no-branch-diff path (working tree vs `HEAD`) is spelled out for the prototype use case.
- **`$ARGUMENTS` wired up:** the frontmatter promised a `[target]` the body never consumed. A Target paragraph in Preparation now maps PR/branch/path targets to the diff scope.
- **Description rewritten for triggering:** action-first ("Senior design-engineer code review of front-end code…"), natural trigger words (review, front-end, React, UI code), no more verbless keyword-list opening.
- **Table robustness:** escape `\|` in cells (union types sheared the columns on the skill's own cross-file dimension), `<br>` for line breaks, fenced-block fallback for fixes that can't read at two lines.
- **Anti-fabrication escape hatches:** the Test-coverage line may state "no testable surfaces" for pure markup/styling diffs instead of being forbidden to be empty; the Verified block may only name checks actually run (dropped the Conventional Commits / AI-attribution examples nothing defines).
- **CI assumption fixed:** "skip anything CI already enforces" now requires confirming a workflow actually runs the tool; with no CI, type errors are in scope (the NEVER item previously suppressed them on exactly the no-CI prototypes the skill advertises).
- **Smaller:** re-review defined (same conversation or user-declared, comment-hygiene carve-out now present in both statements of the rule); headless fallback for the 400-line scoping gate; i18n load trigger got a detection procedure; visible-vs-code-level definition for Apply mode; severity bullets deduplicated into a pointer at the protocol's table; portability fallback note for `../cami-design/` resolution; marketing sentence trimmed.

**`references/review-protocol.md`:** Context Gathering hard-stop scoped to the design-judgement modes; DS Protocol mode list now includes `cami-design-engineer` (it was omitted); Closing defers to a mode's own closing when one is defined.

**Reference content (engineer dimensions):**

- `security.md`: four checks → six — user-controlled URL in `href`/`src` (`javascript:` XSS) and secrets behind client env prefixes (`VITE_*`, `NEXT_PUBLIC_*`); `rel="noopener"` advice updated for implied-noopener browsers.
- `i18n.md`: added concatenation/interpolation-outside-`t()` with plural forms, and locale-blind sorting.
- `perf.md`: React Compiler gate before the manual-memoization findings; list-virtualization check added; fixed the wrong claim that React renders `''` (it's `0`/`NaN`); "memory leak" claim on duplicated listeners corrected to duplicated work.
- `typing.md`: `@ts-ignore`/`@ts-expect-error` and non-null `!` join `as any`; new loose-config-map finding (`satisfies Record<Union, T>`, `never` checks).
- `state.md`: new async-with-no-error-state finding; the ref-read advice got mechanics (sync the ref or read imperatively — a bare ref trades re-renders for stale reads).
- `composition.md`: the keep-children-mounted rule now names when unmounting is correct (effect/focus reset, heavy subtree) and adds `inert` for hidden subtrees.
- `cross-file-completeness.md`: step 4 offers the durable exhaustiveness fix so the grep is one-time.
- `ds-fidelity.md`: stale "parent SKILL.md" pointer → `review-protocol.md`; hardcoded canonical import path made an example.

**Evals:** four new engineer cases covering the added content — `engineer-010` (javascript: href XSS), `engineer-011` (service key behind `VITE_*`), `engineer-012` (concatenated count string / plurals), `engineer-013` (fetch with no error state). Corpus version → 0.3.3.

Known gaps deliberately deferred: repo-shaped eval fixtures that exercise the diff-based workflow end-to-end (`evals/fixtures/` exists but is empty), and trigger/no-trigger description evals.

---

## 0.3.2 — 2026-06-23 — public-face polish

Cleanup for the public repo. No skill-content changes.

- **CHANGELOG hygiene:** the 0.3.0 entry named the internal identifiers it announced scrubbing, and the 0.2.8 entry printed an employer reverse-DNS agent label. Both genericized; the 0.2.8 uninstall command now uses a glob that still matches the real plist without naming the domain.
- **README accuracy:** dropped the deleted placeholder libraries from the structure tree, added `review-protocol.md`, and corrected the invocation note (the four sub-skills auto-trigger; `/cami-design` is explicit-only since it carries `disable-model-invocation`).

---

## 0.3.1 — 2026-06-23 — extract shared review protocol (audit W6)

Structural refactor, no behavior change. The **Context Gathering Protocol**, **Design System Protocol**, and **Review Output Format** (severity scale, structure, closing, walkthrough, verify) moved out of the parent `cami-design/SKILL.md` into `references/review-protocol.md`.

- **Why:** every sub-skill loaded the full 284-line parent just to inherit these rules, dragging ~110 lines of run-mode-only content (Full Audit Contract, Modes table, Meta) into every invocation. Sub-skills now load the 113-line protocol reference instead. Parent SKILL.md drops 284 → 175 lines; the per-invocation read-mode surface drops by roughly 40%.
- **Rewired:** all four sub-skills' required reading and their severity/closing cross-references now point at `references/review-protocol.md`; the parent keeps run-mode content and points to the protocol for the shared rules. The "recursive invocation" caveat is gone since sub-skills now load a plain reference, not a skill.
- **Eval harness:** `scripts/eval.js` now injects `review-protocol.md` into every case's system prompt, since the shared rules no longer live in the parent SKILL.md it already loaded. Verified structurally: an assembled sub-skill prompt still contains the severity scale, both protocols, and the walkthrough/verify rules.

---

## 0.3.0 — 2026-06-23 — audit response: drift fixes, eval harness, install robustness, hygiene

Response to an independent audit of the skill. Fixes verified defects rather than adding content. (One audit item, extracting the shared review protocol out of the parent SKILL.md to cut the per-invocation read-mode cost, is deferred to its own PR since it restructures the parent.)

### Content drift (contradictions between sub-skill checklists and canonical references)

- **`cami-design-interaction/SKILL.md` stagger delay** was `~100ms`, contradicting `motion.md`'s canonical `~50ms`. Replaced the number with a pointer to `motion.md` → Enter Animations so the value lives in one place.
- **`references/copy-patterns.md` Principle 4 ("Human")** used `"Oops, something went wrong"` as the good example while `anti-patterns.md` bans that exact string as a vague AI-tell. Rewrote the example to be warm *and* specific, with a note pointing at the ban.

### Eval harness

- **`scripts/eval.js` now loads reference files.** The system prompt was parent + mode SKILL.md only, so cases targeting a reference (nearly all content since 0.2.0) measured base-model knowledge, not the skill. Cases now declare `references: [...]` and the runner injects them.
- Model is configurable (`--model` / `CAMI_EVAL_MODEL`, default a current model) instead of a hardcoded id that ages out; `max_tokens` raised so the mandated table format isn't truncated.
- **`evals/evals.json`** version aligned to package; `references` added to every case; six cases added for previously-uncovered references (concentric radius, scroll edge mask, typography tabular figures, cross-file completeness, i18n, security) plus a drift-guard case for the "Oops" error string.

### Install robustness

- **`scripts/install.js`** now uses `lstatSync` and self-heals broken/stale symlinks instead of crashing with `EEXIST` on reinstall after an uninstall (npm 7+ does not run `preuninstall`, so dangling links were common). Real files/dirs are still backed up to `.bak`.

### Public-repo hygiene

- Scrubbed employer-internal identifiers from two published references: an internal locale filename and date hook in `references/i18n.md`, and an internal DS token scale in `references/interaction.md`'s destructive-row snippet. All genericized.

### Frontmatter, references, housekeeping

- **`cami-design/SKILL.md`** parent: `disable-model-invocation: true` (parent had measured 0% auto-trigger recall with sub-skills installed; it is an explicit-invocation skill), and run mode now handles the `argument-hint` it advertises (`/cami-design <sub-skill>` delegates).
- **`references/craft.md`** given an operational load trigger (Verify pass / declining findings / re-centering) instead of a non-firing one.
- Removed the empty placeholder libraries (`palettes.json`, `font-pairings.json`) and their table rows; re-add when populated.
- **CHANGELOG** repaired: added the missing `## 0.2.5` heading. For the record, versions 0.1.1–0.1.5, 0.1.7–0.1.9, and 0.1.14–0.1.16 predate consistent logging and have no entries.

---

## 0.2.11 — 2026-06-23 — comment hygiene always-on, Apply mode

Two engineer-mode wiring fixes. Both address findings that were defined but didn't reliably fire.

### Engineer

- **`cami-design-engineer/SKILL.md` — comment hygiene promoted to an always-on check.** The verbose/private/code-restating comment rules live in `typing.md`, which only loaded when the diff showed type/naming signal, so comment issues slipped through. Added an *Always check, regardless of dimension signal* item that runs comment hygiene unconditionally and exempts it from re-review nit suppression (verbose comments are usually introduced during fixes, exactly when the second pass silences new nits).
- **`cami-design-engineer/SKILL.md` — Apply mode** new closing mode, and the **default** close. After presenting the findings the reviewer applies the ones worth applying by judgement (not necessarily all), and isolates any user-visible change for explicit sign-off before touching it (when unsure whether a change is visible, it treats it as visible and asks). Encodes the design-engineer contract: trusted on code, defers to the human on anything visual. Walkthrough remains available when the user wants to decide item by item.

---

## 0.2.10 — 2026-06-18 — gesture physics, clip-path reveals, WAAPI, remedial fix order

Targeted absorption from `emilkowalski/review-animations` (animations.dev, repackaged as a review skill). Most of its catalog was already covered by the earlier `emilkowalski/skill` pass; only the genuinely new material was taken. Deliberately *not* absorbed: its wider bounce stance (subtle bounce for drag-to-dismiss / playful). Our crisp-by-default `bounce: 0` rule stands, with bounce reserved for explicit celebration moments.

### Interaction

- **`references/interaction.md` — Drag & Drop** four gesture-physics findings added: dismiss on velocity not distance (flick > ~0.11 px/ms), boundary damping over hard stops, pointer capture once dragging starts, and multi-touch protection mid-drag.

### Motion

- **`references/motion.md` — Clip-path Reveals** new section. `clip-path: inset()` for reveal-on-scroll, hold-to-delete fills, seamless tab color transitions, and comparison sliders; compositor-run, no extra DOM.
- **`references/motion.md` — WAAPI** added to *Interruptibility*. JS control with CSS-compositor performance for predetermined-but-JS-fired motion; an alternative to rAF loops and library springs.
- **`references/motion.md` — iOS drawer curve** `cubic-bezier(0.32, 0.72, 0, 1)` added to the easing table for drawers/sheets.
- **`references/motion.md` — remedial fix order** new step in the decision framework: when motion is wrong, prefer delete > reduce > fix easing > fix origin > interruptible > GPU > asymmetric > polish.

---

## 0.2.9 — 2026-06-18 — sub-component splits, React Query defaults, localStorage discipline, private-comment channel

Four findings from a real-world senior FE review: three engineer-mode nits and a comment-content guard.

### Composition

- **`references/composition.md` — Two Components in One File, One Past ~100 Lines** new finding. A file holding 2+ components where one exceeds ~100 lines: extract it to a sibling with its own `Props` type; shared helpers move to a `lib/` neighbor.

### State

- **`references/state.md` — Non-default React Query Options Without a Why** new finding. Flag `staleTime`/`gcTime`/`refetch*` overrides with no comment defending them; default-first reasoning for continuously mounted hooks.
- **`references/state.md` — localStorage Cache Over Backend-Canonical Data** new finding. Three-question test (migration, offline-first, flicker) before caching backend-canonical data; default is to drop it.

### Typing

- **`references/typing.md` — Private Reasoning in a Source Comment** new finding. Source comments are public; route who-asked / internal backstory / customer names to the PR description or a personal note, not inline.

---

## 0.2.8 — 2026-06-14 — remove background auto-updater

Removed the launchd auto-update mechanism. Installing the package no longer registers a daily background job that runs `npm install -g cami-design@latest`. Updating is now an explicit, user-initiated `npm install -g cami-design@latest`.

### Packaging

- **Deleted `scripts/auto-update.js`** and the `autoUpdate` calls in `install.js` / `uninstall.js`. Silently installing a persistent launchd agent is surprising behavior for a public package; updates should be opt-in. Existing installs that already have the launchd plist can remove it with `launchctl unload ~/Library/LaunchAgents/*cami-design*update.plist && rm ~/Library/LaunchAgents/*cami-design*update.plist` (the agent label used a reverse-DNS prefix).
- **`README.md`** — dropped the auto-update section, documented manual update instead.

---

## 0.2.7 — 2026-06-02 — locale defaults, duplicated conditional lookups, calibrated A/B options

Two patterns caught by a senior FE on a recent review, plus a calibration note. Meta-lesson: when a finding offers "either A or B," option B has to be a real escape hatch with a concrete trigger, not a way to dodge the call.

### i18n

- **`references/i18n.md` — Display Helper Called With an Empty Locale Parameter** new finding. Locale-shaped parameters (locale, country, currency, timezone) passed as `undefined` / `null` / a hardcoded default — wire from the locale source the codebase already has. Empty is valid only on genuinely unlocalizable input, not as a default escape.

### Composition

- **`references/composition.md` — Conditional Lookup Duplicated Across Call Sites** new finding. `condition ? a : b` over a helper's return value, repeated at 3+ sites: the branch belongs inside the helper. Parallel to the existing JSX-shape rule — decision shape rather than markup shape, same 3-occurrence threshold.

### Engineer

- **`cami-design-engineer/SKILL.md` — A/B option calibration** appended to *Check Codebase Precedent First*. When a finding offers two options, option B needs a named trigger; otherwise drop it and state the recommendation.

### Typing

- **`references/typing.md` — Verbose Comments** new finding (from #18). Targets comments that pass the *why* test but read as AI prose — full sentences, hedging (`likely`, `should`), filler (`basically`, `just`), restating the surrounding code. Prescribes a terse style with an escape hatch for ordering or correctness invariants that need full prose.

---

## 0.2.6 — 2026-05-25 — composited-property tiers, duration intent classes, granular re-renders

Absorption pass on `brotzky/performance-skills` (sourced from performance.dev "How's Linear so fast? A technical breakdown"). The upstream skill is architecture-heavy and mostly out of scope for a review skill; three review-shaped findings were extracted, the rest (local-first sync, IndexedDB-as-DB, service-worker precaching, bundle splitting, app-shell inlining, font preload mechanics) was deliberately not absorbed.

### Performance

- **`references/perf.md` — Animation on a Non-Composited Property** replaces the narrower "Animation on Layout Properties in Framer Motion". Three-tier decision table (composited / paint-triggering / layout-triggering) with concrete substitutions covering `width`/`height`, `top`/`left`/`margin`, Framer Motion props, and `transition: all`. Gives the reviewer a checklist instead of a single Framer-shaped rule.

### Motion

- **`references/motion.md` — ~100ms cause-and-effect threshold** added to the Duration section. Below ~100ms motion reads as the direct consequence of the user's action; above it reads as a separate event. Anchors the existing 100-150ms "Micro" fork with a cognitive reason.
- **`references/motion.md` — Asymmetric by intent class** added to Duration. Table separates summoned-by-user (instant→150ms fade), ambient state changes (200-250ms→~75%), and transitional surfaces (250-350ms ease-out→200-250ms ease-in).
- **`references/motion.md` — Spatial-work test** added to §2 Purpose of the Animation Decision Framework. "Does this motion answer 'where did this come from' or 'look at me'?" — a quick filter against decorative motion that complements the existing purpose criteria.

### State

- **`references/state.md` — Re-renders Cascade When Only One Field Changed** new finding. Different from the memo-related items in `perf.md`: addresses state *shape* (single `useState` over a list, context with fresh object identity, state living too high) rather than rendering defense. Pairs with `perf.md` rather than overlapping.

---

## 0.2.5 — 2026-05-22 — small absorptions from external rules dumps

Small absorptions from two external rules dumps (a portfolio project and an audit of past sessions), filtered against what was already covered and what was project-specific. Net: 12 new bullets across 4 references, no new files, no new sections.

### Motion

- **Popover edge detection** + **escape clipping ancestors via the viewport** in `motion.md` → *Popover / Dropdown Origin*. Popovers that open off the viewport edge must flip, not clip. Popovers inside `overflow: hidden` / `transform` / `filter` ancestors need a portal or `position: fixed` — don't fight the ancestor in-place.
- **"Remove the transition" rarely means "remove all motion"** in §2 Purpose of the Animation Decision Framework. A plain ~100ms opacity fade is the floor.
- **Sibling state swaps need a transition** in *Exit Animations*. Banner-to-banner, toast-to-toast, card-to-card in the same slot — hard-swap reads as a bug.
- **`animation-fill-mode: backwards`** in *Specificity*. Prevents `filter` or `transform` residue after the keyframes resolve.
- **Toggle icons (check ↔ copy) on hover-out keep both in DOM** in *Icon Animations*. Re-mounting mid-fade flashes the wrong icon for 1-2 frames.

### Interaction

- **`transition: none` while dragging** + **drag hit area covers the whole section** + **don't shift layout when drag becomes available** in *Drag & Drop*.
- **Reserve press scale for CTAs** + **stacked affordances share one slot** in *Press Feedback*. Tabs and rows shouldn't scale on press; a control that morphs (chevron → checkmark) stays in the same click target.
- **Sticky hover while a child is open** in *Hover States*. Trigger keeps its hover/active state while its popover or expanded panel is on screen.

### Accessibility

- **Focus rings must read at a glance** in *Focus*. A faint neutral ring technically passes 3:1 but disappears in real use — build from a brand/accent token at an unambiguous alpha.

---

## 0.2.4 — 2026-05-21 — pointer continuity in stacked rows

Small addition surfaced from production use. Stacked clickable rows that read as separated pills (sidebar nav, dropdown options, settings sub-nav) make the OS cursor flicker `pointer → default → pointer` as it crosses the gap between rows. A 1px transparent border on each row plus `background-clip: padding-box` claims the gap as hit area and stops the flicker, without merging the pills visually.

### New pattern

- **Pointer Continuity in Stacked Rows** in `references/interaction.md`. Sits between Hover States and Focus States. Tailwind one-liner, why `bg-clip-padding` is mandatory, apply / don't-apply lists, and a verification step (drag at ~50px/s, watch for cursor blink). Source: production usage.

### Cross-ref

- One line added to `cami-design-interaction/SKILL.md` → *Review Dimensions / Press & Feedback* pointing to the new section.

---

## 0.2.3 — 2026-05-20 — extract scroll-containers reference and add scroll edge mask

`spacing-layout.md` had grown to 331 lines, twice the next-largest reference, and its scrollbar-related sections were starting to read as their own topic. Split them out and added a third pattern that completes the set.

### New reference

- **`references/scroll-containers.md`.** Three rules that make an inset scroll container feel intentional: scrollbar gutter, tamed native scrollbars, and scroll edge mask. Loaded on demand, indexed in both conditional-reads and shared-references tables of the parent SKILL.

### New pattern

- **Scroll Edge Mask** in `scroll-containers.md`. CSS-only fade on scrollable edges using `mask-image` and `animation-timeline: scroll()`. Signals scrollability without copy or JS. Includes the sticky-children pitfall and a `@supports` gate for Safari and Firefox. Source: twilson.net/scroll-mask.

### Moved (no content change)

- *Scrollbar Gutter* and *Tame Native Scrollbars* moved from `spacing-layout.md` into the new file. The host file keeps a one-line pointer. Cross-references updated in `anti-patterns.md` and `cami-design-layout/SKILL.md`.

---

## 0.2.2 — 2026-05-14 — engineer skill: absorb review-quality findings

Three sources, one release. (1) Skill-comparison reports — `cami-design-engineer` run head-to-head with `/review` and `vercel-composition-patterns` on real-world feature PRs. (2) `5988d0c`, an unpushed local commit from 2026-05-09 that absorbed three patterns from garrytan/gstack but never reached `main`. (3) Code-review feedback collected across a batch of production PRs. `vercel-composition-patterns` surfaced almost nothing net-new; the comparison reports, gstack, and the production review feedback carried the signal.

### New dimensions

- **Security Spot-Check** → `references/security.md`. Four checks only — HTML injection, external link `rel`, browser API scope, leaked values. Not a full audit, just the checklist a receiving tech team expects to have been run. Source: Anthropic Code Review security pass, surfaced by the comparison reports.
- **Cross-file Completeness** → `references/cross-file-completeness.md`. The one dimension that requires reading code outside the diff: when the diff adds a union member (variant, status, tier, flag) or moves/renames a module, grep the siblings and read the consumers — `switch` chains, allowlists, config maps, stale test mocks that silently drop the new value. Source: garrytan/gstack `review` (Enum & Value Completeness); module-move check from production PR review feedback.
- **Internationalization** → `references/i18n.md`. Hardcoded user-facing strings, non-locale-aware date/number formats, and English leaking into the a11y tree (`aria-label`, `alt`) — for codebases with a translation layer. Source: production PR review feedback.

The engineer skill now has nine dimensions, up from six.

### Reference additions

- **`ds-fidelity.md` → Spec Doc Drift After an API Change.** When the diff changes a component's public API, grep `DESIGN.md` / docs for the component and update it in the same pass — a stale source-of-truth doc undoes the API change. Surfaced by a comparison report: an a11y refactor made a component prop optional while the spec doc still listed it as required.
- **`ds-fidelity.md` → `!important` in New CSS.** Almost always a specificity escape hatch covering a DS conflict that should be resolved properly. Source: garrytan/gstack `review`.
- **`perf.md` → Skeleton Sized Differently From Its Content.** A skeleton whose size or radius doesn't match the component that replaces it produces a layout shift on load. Surfaced in review: a 32px skeleton placeholder swapped for a 20px component.
- **`state.md` → State Moved Between Owners.** When state changes hands (local ↔ URL ↔ context ↔ props), re-audit every consumer that assumed the old contract. From a routing-contract edge case found in review.
- **`composition.md` → `useContext` in React 19 Code.** Prefer `use(Ctx)` over `useContext(Ctx)` in React 19. The one net-new angle from the `vercel-composition-patterns` comparison.

### Engineer SKILL.md — process

- **Base-ref validation** (Preparation 5). `git rev-parse <base> origin/<base>` before scoping — a stale local base inflates the diff. From a review where the local base branch was dozens of commits behind the remote.
- **Exhaustive coverage for migration PRs** (Preparation 6). For "migrate N sites" PRs, search every site; a `+N similar` count must be real, not sampled.
- **PR-description-vs-diff check** (Preparation 8). Read the PR body, flag scope claims that disagree with the diff.
- **Verification bar extended to non-findings** (Output). No positive safety claims without a citation — no "likely handled," "probably fine." Either cite the line or flag it unverified. Source: garrytan/gstack `review`.
- **Test-coverage closer** (Output). Every review now closes with a named enumeration of the testable surfaces the diff introduced — a recurring miss flagged across multiple reviews. The list is the deliverable, not the tests.
- **Optional `## Verified` opener** (Output). When clean of Important findings, the review may list 3–5 conventions checked and held — reassurance for handoff.

### From production PR review feedback

Patterns that came up repeatedly in code review on production PRs. The recurring themes — test-coverage enumeration, description-vs-diff drift — were already covered by the items above; these are the net-new ones:

- **`typing.md` → Test-Only Logic in Production Code.** Stub credentials or test-mode branches shipped in a production module belong at the test boundary (`vi.mock`, a setup file).
- **`typing.md` → Comment or JSDoc Describing Old Behavior.** A change that alters behavior must update or delete the comments in range — a wrong comment misleads.
- **`typing.md` → Function Name Promises Behavior It Doesn't Deliver.** A `triggerX` that triggers nothing.
- **`composition.md` → A Primitive Owning a Consumer's Concern.** A presentational component reaching into `localStorage` / analytics / routing the consumer should own.
- **`composition.md` → Conditional Render That Unmounts Children.** `{open && children}` silently drops child state on toggle — keep mounted, hide with `hidden`.
- **`cross-file-completeness.md` → Module Moved or Renamed.** Stale references left behind, most silently in test mocks pointing at the old path.
- **`perf.md` → Empty-String Fallback on a DOM Attribute.** `<img src={url ?? ''} />` re-requests the page; return `undefined` and render conditionally.

---

## 0.2.1 — 2026-05-14 — v2 self-audit (finish what v1 started)

Re-ran the audit on the v1 state. The refactor introduced one broken pointer, left three duplications uncollapsed, and didn't apply its own "sub-skill bodies stay short" convention to copy. This release closes those gaps.

### Fixed — broken cross-reference

- **`interaction.md` → `forms.md` pointer.** Used `../cami-design/references/forms.md` from a file already inside `cami-design/references/` — would resolve to a non-existent path. Now just `forms.md`. Caught by the v2 audit; introduced during the v1 collapse.

### Finished collapsing rule duplication

- **"Apply at the root, not per-component"** (reduced-motion application rule) was said in three places. Now lives only in `accessibility.md` → *Motion*; `motion.md` and `cami-design-interaction/SKILL.md` are pure pointers.
- **"Strip 'successfully'"** rule lived in `cami-design-copy/SKILL.md` and `anti-patterns.md`. Now only in `anti-patterns.md` → *Copy AI Tells*; copy SKILL.md points there.
- **"No exclamation marks on routine status"** same story. Same fix.

### Architecture — applied v1 convention to copy

- **New `references/copy-patterns.md`.** Extracted Patterns tables (errors, empty states, CTAs) + 6 Principles + NEVER list out of `cami-design-copy/SKILL.md` into a dedicated reference. Copy sub-skill drops from 144 → ~80 lines, matching layout/interaction. Sub-skill bodies stay short; depth lives in `references/` — the convention now holds for all four sub-skills.

### Engineer skill polish

- **Description** updated to list all 6 dimensions explicitly. Was: *"Composition, state, a11y, perf, types, codebase fit."* Now: *"Composition, DS fidelity, state, a11y, perf, types."* "Codebase fit" was ambiguous — it could read as either DS Fidelity or the *Check Codebase Precedent First* section.
- **Collapsed two parallel tables** of the same 6 dimensions into one. The Review Dimensions table is now the single source; References section only lists the two cross-cutting refs (accessibility principles + anti-patterns).
- **Three new eval fixtures** added to close the dimension-coverage gap: `engineer-004` (state — missing `AbortController` cleanup), `engineer-005` (typing — `as any` cast), `engineer-006` (DS fidelity — arbitrary Tailwind values where tokens exist). Engineer now has eval coverage on all 6 dimensions (one fixture each).

### Documentation polish

- **`spacing-layout.md` ToC** entry for Hit Areas now reads `[Hit Areas (→ accessibility.md → Touch)]` so the section's reduced status is visible from the ToC, not a surprise on click.
- **README evolution workflow** notes when to use `npm version patch` vs `minor` (patch for absorption-only bumps, minor for substantive restructuring like v0.2.0).
- **Severity scale 🟣 entry** gained an example (`useMemo` wrapping `items.length` in a touched-but-not-created file) to match the format of 🔴 and 🟡.

---

## 0.2.0 — 2026-05-14 — Self-audit pass (v1 cleanup)

Full audit of the skill against itself surfaced 20 findings across architecture, rule overlaps, frontmatter drift, and library advertising. This release lands fixes for all of them in one pass. No new content absorbed from upstream — the change is structural.

### Architecture

- **Clarified parent's dual role.** Added a `## Roles` section to `cami-design/SKILL.md` distinguishing **read mode** (sub-skill loads parent for shared rules) from **run mode** (`/cami-design` invoked bare runs a full audit). Sub-skills no longer say "MANDATORY PREPARATION: Invoke cami-design" — they now say "Required reading: load `../cami-design/SKILL.md`," which removes the recursion ambiguity flagged in the audit.

### Rule duplication collapsed

The same rule existed in multiple files for several topics. Each now has one canonical home; the others point to it.

- **Animation Decision Framework** → `references/motion.md` (was duplicated in `cami-design-interaction/SKILL.md`)
- **Hit areas (40×40)** → `references/accessibility.md` → *Touch* (was in `spacing-layout.md` + `interaction.md` + `accessibility.md`)
- **Reduced-motion fallback snippet** → `references/accessibility.md` → *Motion* (was in `cami-design-interaction/SKILL.md` + `motion.md` + `accessibility.md`)
- **Contrast thresholds (WCAG)** → `references/accessibility.md` → *Contrast — canonical* (was in `color.md` + `typography.md` + `accessibility.md`)
- **"Check tokens first" Design System rule** → parent SKILL.md → *Design System Protocol* (was in parent + `color.md` + `cami-design-engineer`)
- **Form copy patterns** (instructions before field, confirmation wording, destructive labels) → `references/forms.md` (was in `cami-design-copy/SKILL.md`)
- **Copy AI tells** (generic loading copy, "successfully" trailing, sparkle CTAs) → `references/anti-patterns.md` → *Copy AI Tells* (was inlined in `cami-design-copy/SKILL.md`)

### Engineer skill rebuilt as a router

`cami-design-engineer/SKILL.md` dropped from 194 lines of inlined dimension content to a thin router pointing at six new reference files — matching the pattern used by the visual sub-skills. Future absorptions for the engineer pass now have somewhere to land that isn't the SKILL.md body.

- New `references/composition.md` — boolean prop sprawl, render-prop overuse, compound patterns, lifted state
- New `references/state.md` — effects, async cleanup, race conditions, request dedup, prop mutation
- New `references/perf.md` — keys, memoization traps, hot handlers, list lookups, animation cost
- New `references/typing.md` — `as any`, project conventions, magic numbers, kebab-case
- New `references/a11y-implementation.md` — code-level a11y findings (pairs with `accessibility.md` principles)
- New `references/ds-fidelity.md` — code-level DS violations (pairs with parent's *Design System Protocol*)

### Engineer eval coverage

Engineer mode had no eval cases. Added three (`engineer-001` boolean prop sprawl, `engineer-002` index-as-key, `engineer-003` `<div onClick>`) and a `npm run eval:engineer` script. Fixed a pre-existing bug in the eval runner: the per-mode npm scripts passed short names (`--mode layout`) that never matched the long-form `mode` field in fixtures; runner now normalises both.

### Severity scale normalised

- Single source of truth in parent `Review Output Format → Severity scale`. Engineer skill no longer duplicates the scale — it references the parent and only documents the 🟣 case.
- Clarified the cap unit. The rule is "5 nits per output **section**" (the lettered groups A, B, C…), not "per **dimension**." A short note explains the difference. Engineer dimensions feed into output sections, not the other way around.
- 🟣 *Pre-existing* now explicitly scoped to diff-based reviews (currently only engineer mode) so visual-design audits don't try to use it.

### Frontmatter and library cleanup

- **Dropped `metadata.version` from sub-skills.** They never moved in lockstep with absorptions, so they were doing no work. The canonical version is now `package.json`. Documented in parent `Meta` section.
- **Dropped the free-form `license:` frontmatter line** from the parent — `LICENSE` and `NOTICE.md` already cover this.
- **Aligned descriptions** on `[topics]. Use when [trigger].` voice across all five SKILL.md files.
- **Added H1 to each sub-skill** so file structure is consistent (was missing on all four sub-skills).
- **Marked empty libraries placeholder.** `palettes.json` and `font-pairings.json` are now flagged as placeholder in the parent's Shared Libraries table. `easing-curves.json` gained a `consumed_by` cross-reference so it's clear it's the canonical source for `motion.md`'s easing table.

### Cross-references added

- Each visual sub-skill now lists `anti-patterns.md` in its References, with a note to run it last — solo sub-skill runs previously skipped the anti-pattern sweep entirely (only full audits picked it up via the parent's conditional reads).
- Each sub-skill explicitly mentions the **Walkthrough offer** and **Verify pass** in its Output section, pointing at the parent for the canonical wording.
- Engineer external URLs (Anthropic Code Review, Vercel skills) removed from the SKILL.md References list — they were already credited in `NOTICE.md`, where attribution belongs.
- `humanizer` dependency now noted in `NOTICE.md` under "Optional external dependencies."

### Meta — version policy

Added a `Meta → Where new content lands` note: sub-skill SKILL.md bodies stay short, depth lives in `references/`. New absorptions go into the matching reference file, not the sub-skill body. The engineer rebuild is the first place this convention is fully applied.

---

## 0.1.23 — 2026-05-09 — Absorb react-doctor into engineer skill

### Added — 6 patterns absorbed from millionco/react-doctor

Audited the full react-doctor rule set (~30 rules) against the existing skill. The majority were already covered or belonged to the visual design sub-skills. Six patterns were genuinely new to `cami-design-engineer`:

- **Inline props defeating memoization** — inline functions, objects, or arrays passed to `memo`'d components silently break the cache on every render.
- **Default `{}`/`[]` prop values on memoized components** — `function Card({ items = [] })` creates a new reference each render; the fix is a module-level constant.
- **`useMemo` on trivial expressions** — wrapping `items.length` in `useMemo` costs more than it saves; clarified when memoization is actually warranted.
- **Nondeterministic values in render body** — `new Date()`, `Math.random()`, `crypto.randomUUID()` cause server/client hydration mismatches in Next.js. Move into `useEffect` or a server context.
- **`setState` in high-frequency handlers** — `scroll`/`mousemove`/`wheel` fire at 60–120Hz; direct `setState` queues a synchronous re-render on every tick. Use `startTransition` or `useDeferredValue`.
- **Framer Motion layout property animation** — `animate={{ width, height, padding }}` forces layout recalculation every frame; use `scaleX`/`scaleY` with `transformOrigin` instead.

Source: [millionco/react-doctor](https://github.com/millionco/react-doctor)

---

## 0.1.22 — 2026-05-09 — Audit pass via skill-creator

Pass through the skill via Anthropic's `skill-creator` surfaced two structural improvements (frontmatter standardization, codebase-precedent rule for the engineer pass) and one structural finding that the description loop validated empirically (the parent `cami-design` description should not be optimized further — see "Description loop findings" below).

### Changed — frontmatter cleanup

`skill-creator`'s validator flagged the custom `version` key as non-standard. Moved into `metadata:` across all five SKILL.md files (`cami-design`, `cami-design-layout`, `cami-design-interaction`, `cami-design-copy`, `cami-design-engineer`).

`argument-hint` and `user-invocable` deliberately kept at top level — both are documented Claude Code skill features. Moving them into `metadata` would silently break slash-command behavior to satisfy a stricter validator. Trade-off accepted.

### Added — Engineer skill: "Check Codebase Precedent First"

New section in `cami-design-engineer/SKILL.md`, between Preparation and Review Dimensions. Before flagging any "should be X", the engineer pass must first search the repo for existing implementations of the same need.

The most common review failure is proposing a "better" version of something the project already has in a different style — introducing parallel approaches and breaking consistency. The new section formalizes the three-step check (does it exist? align with it. flag divergences as intentional choices). Especially relevant for utilities, component patterns, state management style, and naming conventions.

### Changed — three description polishes

After the loop finished, applied three aesthetic improvements to the descriptions even though the loop didn't validate them empirically (the test mechanism turned out to measure slash-command auto-invocation rather than skill registry triggering, so its null result wasn't conclusive).

- **`cami-design`** — adds "before shipping" to anchor the moment of use, swaps "figures out what's wrong" for the more measured "spots what's off". 111 → 101 chars.
- **`cami-design-interaction`** — replaces "button feedback" (slightly engineer-coded) with "press" (more natural designer vocabulary), adds "robotic" as a recognized symptom. 106 → 98 chars.
- **`cami-design-engineer`** — drops "design system fidelity" (was overlapping with the visual sub-skills), replaces with "codebase fit" (ties to the new Codebase Precedent rule), broadens trigger context beyond "end of project". 142 → 103 chars.

`cami-design-layout` and `cami-design-copy` left unchanged — both were already balanced.

### Added — Table of contents on `spacing-layout.md`

The file passed the 300-line threshold (`skill-creator` recommends a TOC for references >300 lines) after the recent absorptions. Flat list of all 15 sections with anchor links at the top so an LLM consulting the reference can scan-and-jump rather than read top-to-bottom.

### Description loop findings (no code change)

Ran `skill-creator`'s description optimization loop on the parent `cami-design` skill (5 iterations, 12-train / 8-test split, 3 runs per query). Result: **no proposed description beat the original**. Recall stayed at 0% across all 5 iterations regardless of phrasing.

The loop confirmed that the parent's triggering issue is structural, not a wording problem: when sub-skills are also installed, queries like "audit my settings panel" route to the most specific sibling (`cami-design-layout` etc.) before reaching the parent. The parent is best invoked explicitly via `/cami-design`, which is already the supported entry path.

Run artifacts in `cami-design-workspace/description-loop/2026-05-09_003308/` (gitignored) for future reference.

---

## 0.1.21 — 2026-05-08 — cami-design-engineer + severity column + Verify pass

Adds a fourth sub-skill for the code-side handoff moment, propagates a severity column across all sub-skills, and introduces a Verify pass to walkthrough mode.

### Added — `cami-design-engineer`

New sub-skill for end-of-project code review before tech-team handoff. Replaces the manual stack of `/review` + composition-patterns + "review like a senior FE" prompts.

Six dimensions:
- **Component Composition** — boolean prop sprawl, render props vs children, `forwardRef` in React 19+, fetch+render coupling, premature abstraction, provider/context patterns (lift state, decouple implementation, context interface)
- **Design System Fidelity** — hardcoded values vs tokens, DS components mixed with hand-rolled, canonical import paths, generic Tailwind utilities where typed scales exist
- **State & Data Flow** — `useEffect` cleanup, debounce, defer reads, primitive deps, derived state, race conditions, functional `setState`, immutable sort, parallel requests, request dedup, props mutation
- **A11y Implementation** — `<div onClick>`, icon-only buttons, label/input wiring, alt/aria-hidden, modal focus trap, color-only signals, keyboard handlers
- **Performance & Rendering** — array-index keys, hoist JSX, lazy load, barrel imports, memoization, falsy-AND, SVG animation, lazy state init, transitions, global listener dedup, Set/Map lookups
- **Type Safety & Code Clarity** — `as any`, props convention, inference, barrels, comment hygiene, magic numbers, file casing, function declaration style, untested business logic flagging

### Added — Severity column across all sub-skills

Every finding now carries a severity emoji:
- 🔴 **Important** — broken behavior, DS violation, a11y blocker, craft miss the user will notice
- 🟡 **Nit** — worth fixing for craft, not blocking; cap ~5 per section
- 🟣 **Pre-existing** — issue exists but wasn't introduced by current changes (engineer mode only — visual-design audits don't have a diff scope)

Calibration documented as **Frequency × Impact × Persistence** in `cami-design/SKILL.md → Review Output Format → Severity scale`. The three visual-design sub-skills reference the parent's scale instead of duplicating the definition.

### Added — Verify pass in walkthrough mode

After fixes are applied, walkthrough now offers a Verify pass: a focused second look at the modified code/UI to catch issues introduced by the fixes themselves or missed adjacent instances. `Verify: clean.` is a valid output.

### Added — Engineer offer at the end of full audit

When `cami-design` runs as a full audit (3 visual-design sub-skills), it now offers `cami-design-engineer` via `AskUserQuestion` at the end. Keeps design and engineer as two distinct moments of the same audit. Skipped when the target is a static design or the engineer skill already ran in the session.

### Sources

- **Anthropic Code Review docs** — severity model, verification bar, re-review convergence, skip rules, summary shape
- **vercel-labs/agent-skills/composition-patterns** (MIT) — 8 of 8 applicable rules
- **vercel-labs/agent-skills/react-best-practices** (MIT) — 17 of 45 rules; Next/SSR-only and micro-opts deliberately skipped
- **wshobson/agents/code-review-excellence** — PR size guard, props mutation
- **mistyhx/frontend-design-audit** — severity calibration framework, Verify step
- **Internal CI code-review workflow** (maintained by the author) — untested business logic flagging, E2E testid awareness

### Reviewed and not absorbed

- `obra/superpowers/requesting-code-review` and `receiving-code-review` (74K + 59K installs) — wrong audience (requester / receiver, not reviewer)
- `wshobson/agents/code-review-excellence` soft-skill content — feedback tone catchphrases skipped per editorial direction
- `onewave-ai/claude-skills/code-review-pro` — backend-flavored security checklist (SQL injection, CSRF) doesn't fit a frontend SPA scope
- `anthropics/knowledge-work-plugins/design-handoff` — different deliverable type (specs generation); flagged as a future 5th sub-skill `cami-design-handoff`
- `vercel-labs/agent-skills/web-design-guidelines` — out of scope
- 28 of 45 vercel-react-best-practices rules — Next-specific (`server-*`, `async-suspense`), SSR (`hydration-no-flicker`), or micro-opt (`js-cache-*`, `js-combine-iterations`, etc.)

---

## 0.1.20 — 2026-05-03 — Motion craft: blur+motion, close-subtlety, animate-inner

Three small craft principles absorbed from `Jakubantalik/transitions-dev` (the agent-skill packaging of the transitions.dev snippet collection).

### Added
- `references/motion.md > Enter Animations` — new bullet: pair small movement with small blur (2-3px). Short translates and scales need a blur companion to read as motion; without it 8px distances feel like nothing happened. Pattern is consistent across the transitions-dev library.
- `references/motion.md > Exit Animations` — new bullet: close on a subtler scale than the open started from (e.g. opens from `scale(0.97)`, closes toward `scale(0.99)`). Exits shouldn't "pop" as much as entrances did.
- `references/motion.md > Specificity` — new bullet: animate the inner piece, not the container. Badge dot, not trigger button. Page sections, not wrapper. The changing thing should be the thing that moves.

### Reviewed and not absorbed
- The 9 transition snippets themselves (card resize, number pop-in, notification badge, text swap, dropdown, modal, panel reveal, page slide, icon swap) — they're a paste-ready library, not polish-layer principles. cami-design's scope is review, not snippet distribution.
- The shared `:root` block with ~50 tuned variables — that's their design system, not a principle.
- The "transition: all" anti-pattern from their Common Mistakes — already in cami's Specificity section.
- The reflow trick (`void el.offsetHeight`) — engineering implementation detail.

---

## 0.1.19 — 2026-05-01 — Content resilience: length × viewport × locale

Recurring polish miss in product QA: text behavior under length and space variation. The existing Content Resilience section in `spacing-layout.md` had the CSS techniques but not the review methodology. This expansion turns it from snippets into an audit framework.

### Added
- **3-axis framing** in the section intro — length (1 char to 200), viewport (360px to 1920px+), locale (text expands across languages). Surfaces only pass when no single axis breaks the layout.
- **Decision matrix** mapping surface type to text behavior (truncate / wrap / break-anywhere / never truncate). The audit answer for "what should this text do here" is now a lookup, not a judgement call.
- **Discoverability rule** — truncated identifying or actionable content (names, IDs, amounts, errors) must expose the full value via tooltip, click-to-expand, or detail panel. Decorative truncation can drop without recovery.
- **Audit matrix** replacing the old "test 3 chars vs 200 chars" line. Now tests combinations across length × viewport × locale, with explicit failure modes (layout breaks, silent info loss, over-truncation).
- **Locale expansion budget** — static labels need 30–50% headroom (FR ~+25%, DE ~+50% vs EN). Width planning anchored on the longest expected locale.
- One CSS snippet added: `[overflow-wrap:anywhere]` as a last resort for unbreakable strings that defeat `break-words`.

### Why
Text behavior is a recurring QA failure that nothing in the skill explicitly audited. Reviews caught the symptoms (weird wrap, silent truncation) without naming the rule. This makes the audit deliberate.

---

## 0.1.18 — 2026-04-29 — FLIP, scroll-linked motion, blur ordering

Three additions to `motion.md` after reviewing the `fixing-motion-performance` skill. Two other skills (`interface-design`, `baseline-ui`, `redesign-existing-projects`) were reviewed in the same pass and rejected — already covered or out of scope.

### Added
- `references/motion.md > Performance` — new bullet on reaching for blur last (try `opacity`/`translate` first, blur is paint-heavy). Existing `backdrop-blur` bullet extended with the cap rule (~8px max, never on large surfaces, never in loops).
- `references/motion.md > Performance` — new sub-section *FLIP for layout-like motion*. Covers the measure-first / animate-via-transform pattern for reorder, expand, and reflow effects. Includes the "batch reads before writes" rule to avoid synchronous reflow.
- `references/motion.md` — new top-level section *Scroll-linked Motion*. Two rules: prefer Scroll/View Timelines over `scroll` listeners (compositor vs main-thread), and use IntersectionObserver to pause looping motion when off-screen.

### Sources
- `fixing-motion-performance` skill — FLIP pattern, scroll timeline preference, blur ordering and cap.

---

## 0.1.17 — 2026-04-27 — Tame native scrollbars

Default OS scrollbars on inset containers (sidebars, modal bodies, command menus, dropdowns) read as "design stopped at the container edge." Two CSS rules fix it and tie scrollbars into the design system.

### Added
- `references/spacing-layout.md` — new *Tame Native Scrollbars* section, sibling to the existing *Scrollbar Gutter* rule. Leads with the standards `scrollbar-width` + `scrollbar-color` two-liner using a token (`var(--border)`), not hardcoded gray. Notes the scope rule (inset containers only, leave the document scrollbar alone) because thin scrollbars are harder to grab on long-form pages. Webkit prefixed fallback included for codebases that still support pre-2024 Safari, but framed as optional rather than canonical.
- `references/anti-patterns.md` — one-line entry flagging default-styled scrollbars on inset containers as a polish miss, pointing at the spacing-layout reference.

### Sources
- [@raunofreiberg](https://x.com/raunofreiberg/status/2048057305439039535) — the standards two-liner
- [@iamncdai](https://x.com/iamncdai/status/2048387918868443145) — token-bound Tailwind/shadcn variant

### Why this version (and not 0.1.14)
Version bumps 0.1.14, 0.1.15, 0.1.16 happened in absorption PRs (#5, #6, #7) without changelog entries. SKILL.md frontmatter was also lagging at 0.1.13. Both files realigned to 0.1.17 here.

---

## 0.1.13 — 2026-04-21 — Full Audit Contract + proactive walkthrough offer

Tightens what `cami-design` is accountable for when invoked as the top-level skill, and makes walkthrough mode discoverable instead of hidden behind a keyword.

### Added
- **Full Audit Contract** section in `skills/cami-design/SKILL.md`: the top-level `cami-design` invocation must run all three sub-skills (layout, interaction, copy), load conditional references based on what the target contains, cover a fixed list of surfaces (desktop, narrow viewport, modals, error paths, empty states, loading, keyboard, screen reader signals), and open every review with a **Scope preamble** declaring what was audited and what was explicitly skipped.

### Changed
- Walkthrough mode is now proactively offered at the end of every review via `AskUserQuestion`, with natural, varied phrasing, instead of a single boilerplate sentence. Intent-based triggering still applies when the user signals it earlier.

### Why
First real test of `cami-design` on a live product page produced a partial review that skipped keyboard, a11y, error states, modals, and mobile, without flagging the gaps. The skill described output format but not coverage obligations. Walkthrough mode existed but was invisible unless the user knew the phrasing. Both addressed here.

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
