# Notice & Attribution

This skill synthesizes material from several excellent upstream Claude skills and design engineering resources. Credit where due.

## Direct inspirations

### anthropics/skills
- **frontend-design** — minimal SKILL.md pattern, frontmatter discipline
- **skill-creator** — progressive disclosure principle, eval-first iteration, script pattern

Repository: https://github.com/anthropics/skills
License: see upstream

### pbakaus/impeccable
Author: Paul Bakaus

Contributions absorbed:
- Parent/child skill architecture (impeccable + mode sub-skills)
- `Before | After | Why` review table format
- **Context Gathering Protocol** concept
- Topical reference organization (typography, motion, color-and-contrast, etc.)
- "AI slop" anti-pattern catalog
- `user-invocable`, `argument-hint` frontmatter patterns

Repository: https://github.com/pbakaus/impeccable
License: Apache 2.0

### emilkowalski/skill
Author: Emil Kowalski

Contributions absorbed:
- The Animation Decision Framework (should this animate? purpose? easing?)
- "Taste is trained" philosophy
- "Unseen details compound" principle
- Spring bounce = 0 default, popover transform-origin from trigger
- Review table format with `Why` column

Repository: https://github.com/emilkowalski/skill
License: see upstream

### jakubkrehel/make-interfaces-feel-better
Author: Jakub Krehel

Contributions absorbed:
- Concentric border radius rule (outer = inner + padding)
- Tabular numbers for dynamic values
- `scale(0.96)` press feedback — never below `0.95`
- Image outline rule (pure black/white at 0.1 opacity, never tinted)
- Split-and-stagger enter animation pattern
- `initial={false}` on `AnimatePresence` for page-load prevention
- Minimum 40×40px hit areas

Repository: https://github.com/jakubkrehel/make-interfaces-feel-better
License: see upstream

### brotzky/performance-skills — linear-local-first-architecture
Author: Dennis Brotzky

Contributions absorbed (May 2026):
- Three-tier composited / paint-triggering / layout-triggering animation decision table (`references/perf.md`)
- ~100ms cause-and-effect threshold for user-caused motion (`references/motion.md`)
- Asymmetric duration table by intent class — summoned / ambient / transitional (`references/motion.md`)
- Spatial-work test for motion purpose ("where did this come from" vs "look at me") (`references/motion.md`)
- One-delta-one-cell finding — re-renders cascade when state shape is too coarse (`references/state.md`)

Deliberately **not** absorbed: local-first sync architecture, IndexedDB-as-database, optimistic mutation queues, render-first-authenticate-second auth pattern, service-worker route precaching, bundle splitting with per-package `manualChunks`, inlined app-shell + boot script, variable-font preload mechanics, command-palette-over-local-store. These are architecture/build-config decisions outside a review skill's scope.

Repository: https://github.com/brotzky/performance-skills
Source article: https://performance.dev/how-is-linear-so-fast-a-technical-breakdown
License: see upstream.

### zenobi-us/dotfiles — basic-design-principles
Author: zenobi-us

Contributions absorbed:
- Elevation consistency rule ("pick one elevation treatment per hierarchy level — don't mix a shadow-recipe card with a flat-border card in the same list")

Repository: https://github.com/zenobi-us/dotfiles
Skill path: `ai/files/packages/creator/skills/devtools/webdesign/basic-design-principles/SKILL.md`
License: see upstream

## Web platform references

Modern CSS primitives added via progressive-enhancement guidance drawn from MDN and Chrome/Safari/WebKit release notes:
- `scrollbar-gutter: stable` — prevent content shift when scrollbars appear (`references/spacing-layout.md`)
- `interpolate-size: allow-keywords` + `calc-size()` — animate `height`/`width` to/from `auto` (`references/motion.md`)
- `::selection` + relative color syntax (`oklch(from …)`) — branded selection tint (`references/color.md`)

Sources: developer.mozilla.org, developer.chrome.com, webkit.org.

### Anthropic — Claude Code Review docs
Source: https://code.claude.com/docs/en/code-review

Contributions absorbed (May 2026, into `cami-design-engineer`):
- 3-tier severity model: 🔴 Important / 🟡 Nit / 🟣 Pre-existing
- Verification bar — every finding cites `file:line` from real code, no inference from naming
- Re-review convergence — second pass over the same code suppresses new nits, posts Important findings only
- Skip rules: anything CI already enforces, generated files, lockfiles, vendored deps, intentional test-only violations
- Summary shape — open with a one-line tally (`X 🔴 · Y 🟡 · Z 🟣`); lead with `No blocking issues for handoff` when nothing is Important

License: documentation reference, applied as concept absorption.

### vercel-labs/agent-skills — composition-patterns
Source: https://github.com/vercel-labs/agent-skills/tree/main/skills/composition-patterns

Contributions absorbed (May 2026, into `cami-design-engineer` → Component Composition):
- `architecture-avoid-boolean-props` — boolean prop sprawl refactor to `variant` prop or compound parts
- `architecture-compound-components` — slot-shaped UI uses the compound pattern
- `patterns-explicit-variants` — explicit variants over boolean modes
- `patterns-children-over-render-props` — children over `renderX` callbacks
- `react19-no-forwardref` — drop `forwardRef` in React 19+
- `state-decouple-implementation`, `state-context-interface`, `state-lift-state` — provider exposes a stable `{ state, actions }` interface; lift state to share across siblings; children never reach into the storage

License: MIT.

### vercel-labs/agent-skills — react-best-practices
Source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices

Contributions absorbed (May 2026, into `cami-design-engineer` → State & Data Flow + Performance & Rendering):
- Re-render: `rerender-defer-reads`, `rerender-memo`, `rerender-dependencies`, `rerender-derived-state`, `rerender-functional-setstate`, `rerender-lazy-state-init`, `rerender-transitions`
- Rendering: `rendering-animate-svg-wrapper`, `rendering-hoist-jsx`, `rendering-conditional-render`
- Bundle: `bundle-barrel-imports`, `bundle-dynamic-imports`
- Async / data: `async-parallel`, `client-swr-dedup`, `client-event-listeners`
- JS perf: `js-tosorted-immutable`, `js-set-map-lookups`

Deliberately **not** absorbed: all `server-*` and Next-specific async rules (we target Vite SPAs, not Next), micro-opts (`js-cache-*`, `js-combine-iterations`, `js-length-check-first`, `js-early-exit`, `js-hoist-regexp`, `js-min-max-loop`, `js-batch-dom-css`), niche rendering (`rendering-content-visibility`, `rendering-svg-precision`, `rendering-hydration-no-flicker`, `rendering-activity`), advanced ref tricks (`advanced-event-handler-refs`, `advanced-use-latest`), `bundle-conditional`, `bundle-preload`, `bundle-defer-third-party`. 17 of 45 rules absorbed; the rest don't apply to the target stack.

License: MIT.

### wshobson/agents — code-review-excellence
Source: https://github.com/wshobson/agents

Contributions absorbed (May 2026, into `cami-design-engineer`):
- PR size guard — ask the user to scope by feature or file when the diff exceeds ~400 changed lines
- Mutating props anti-pattern — treat props as read-only; notify the parent via callback rather than mutating

License: see upstream.

### mistyhx/frontend-design-audit
Source: https://github.com/mistyhx/frontend-design-audit

Contributions absorbed (May 2026):
- Severity calibration framework — Frequency × Impact × Persistence (now in parent `Review Output Format → Severity scale`)
- Verify pass — focused second look at modified code/UI after fixes are applied (now in parent `Review Output Format → Walkthrough mode`)

License: see upstream.

### Internal CI code-review workflow
A private continuous-integration code-review prompt, maintained by the author.

Contributions absorbed (May 2026, into `cami-design-engineer`):
- Untested business logic flagging — flag hooks/utilities/services with branching logic that lack tests, naming the function and branches that need coverage (don't write the tests; surface the gap for the tech team)
- E2E testid awareness — grep `e2e/` for `data-testid` selectors before flagging refactors that remove or rename them; testid changes break E2E silently

The workflow itself is internal; only its review philosophy informed the engineer skill.

License: internal, used with the author's permission.

### vercel-labs/web-interface-guidelines
Author: Vercel Labs

Contributions absorbed (Apr 2026):
- New `references/forms.md` — input attributes, labels, submit behavior, errors, placeholders, unsaved-changes warnings
- Mobile & Touch section in `references/interaction.md` — `touch-action`, `-webkit-tap-highlight-color`, `overscroll-behavior: contain`, drag patterns, `autoFocus` rules
- Loading minimum-duration rule in `references/interaction.md` (show-delay + min visible time)
- Typographic characters section in `references/typography.md` — `…` vs `...`, curly quotes, `&nbsp;` for glued terms
- `preconnect` guidance for font/asset CDNs in `references/typography.md`
- Native Browser UI section in `references/color.md` — `color-scheme`, `<meta name="theme-color">`, Windows `<select>` bg/color fix
- Safe Areas (mobile notch) section in `references/spacing-layout.md` — `env(safe-area-inset-*)`
- Content Resilience section in `references/spacing-layout.md` — `truncate`, `line-clamp-*`, `break-words`, the `min-w-0` flex gotcha
- Anchored Headings section in `references/spacing-layout.md` — `scroll-margin-top` under sticky headers
- SVG Safari fix in `references/motion.md` — `transform-box: fill-box` on `<g>` wrapper

Deliberately **not** absorbed: URL-as-state, deep-linking, hydration rules, i18n/locale formatting, image/CLS rules (engineering scope), Title Case heading rule (conflicts with cami-design-copy's sentence-case default), forms sub-skill (too heavy — chose reference-only).

Repository: https://github.com/vercel-labs/web-interface-guidelines
License: MIT

## Optional external dependencies

These are skills `cami-design` *can* defer to when they're installed. They are not bundled and not required — sub-skills must skip silently if the dependency is missing.

- **`humanizer` skill** — referenced from `cami-design-copy/SKILL.md`. Strips AI-tell patterns from user-facing copy (synthetic phrasing, sycophancy, padding). Not bundled here. If you maintain a `humanizer` skill you'd like cami-design to integrate with, open an issue; otherwise the soft reference is a no-op when the skill isn't installed.

## License

This skill is released under Apache 2.0. When absorbing from upstream skills with compatible licenses, attribution is maintained here and in the specific reference file where the material lives.

If you are an upstream author and would prefer different attribution or removal of absorbed material, please open an issue.
