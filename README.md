# cami-design

Camille Pawlak's personal Claude Code design skill. A curated collection of principles, references, and modes for building and reviewing interfaces with intent.

## Install

```bash
npm install -g cami-design
```

That's it. Five slash commands are linked into Claude Code automatically.

To update, re-run `npm install -g cami-design@latest`.

## Usage

```
/cami-design               — load shared principles, route to a mode
/cami-design-layout        — alignment, sizing, spacing, visual hierarchy
/cami-design-interaction   — animation, hover/press states, micro-interactions
/cami-design-copy          — microcopy, labels, errors, tone
/cami-design-engineer      — code review for tech-team handoff (composition, DS fidelity, state, a11y, perf, types)
```

Or let the skills auto-trigger — the frontmatter descriptions are tuned to activate on related work.

The first three modes audit visual design. `cami-design-engineer` is the code-side handoff pass — run it at the end of a project before passing the codebase to a tech team. A full `/cami-design` audit will offer it at the end.

## Design Context

Design work produces generic output without project context. Before the first run, create a `.cami.md` at your project root:

```md
# .cami.md
Target audience: ...
Use cases: ...
Brand tone: ...
Design system: tokens live in src/styles/tokens.css
```

The skill reads it automatically on each invocation.

## What's inside

```
skills/
├── cami-design/              # parent: shared rules (Roles: read vs run mode)
│   ├── SKILL.md
│   ├── references/           # deep material loaded on demand
│   │   ├── typography.md  color.md  spacing-layout.md
│   │   ├── motion.md  interaction.md  forms.md
│   │   ├── accessibility.md  anti-patterns.md  craft.md
│   │   └── composition.md  state.md  perf.md
│   │       typing.md  a11y-implementation.md  ds-fidelity.md
│   └── libraries/            # easing-curves.json (active); palettes/font-pairings (placeholder)
├── cami-design-layout/       # visual: alignment, sizing, hierarchy
├── cami-design-interaction/  # visual: hover, press, motion
├── cami-design-copy/         # visual: labels, errors, tone
└── cami-design-engineer/     # code-side handoff pass (router into references/)
evals/                        # test corpus for iterative improvement
CHANGELOG.md                  # what was absorbed, from where, when
NOTICE.md                     # attribution to upstream skills + optional external deps
```

Sub-skill SKILL.md files stay short — they index, route, and define output. Depth lives in `references/`. New absorptions go into the matching reference file, not the sub-skill body.

## Evolution

This skill grows by absorbing techniques from upstream sources. The process:

1. Spot a new technique or upstream skill worth absorbing.
2. Run `npm run eval` — baseline the current score.
3. Cherry-pick the specific material into the right reference file.
4. Run evals again — confirm improvement.
5. Log in `CHANGELOG.md` with attribution.
6. `npm version <patch|minor> && npm publish --access public && git push` — `patch` for absorption-only bumps, `minor` for substantive restructuring (e.g. the v0.2.0 audit cleanup). The canonical version lives in `package.json`; sub-skill SKILL.md files no longer carry their own `metadata.version`.

## Evals

```bash
ANTHROPIC_API_KEY=sk-... npm run eval          # all cases
npm run eval:layout                             # by mode (layout / interaction / copy / engineer)
npm run eval -- --id interaction-002 --verbose  # single case, full output
```

## Inspirations

- [anthropics/skills](https://github.com/anthropics/skills) — frontend-design, skill-creator
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — parent/child architecture, review format
- [emilkowalski/skill](https://github.com/emilkowalski/skill) — animation decision framework
- [jakubkrehel/make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better) — micro-detail catalog

See `NOTICE.md` for full attribution.

## License

Apache 2.0. See `LICENSE`.
