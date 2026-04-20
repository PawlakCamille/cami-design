# pwlk-atelier-design

Camille Pawlak's personal Claude Code design skill. A curated collection of principles, references, and modes for building and reviewing interfaces with intent.

## Install

```bash
npm install -g pwlk-atelier-design
```

That's it. Four slash commands are linked into Claude Code automatically.

## Usage

```
/atelier-design        — load shared principles, route to a mode
/atelier-design-layout        — alignment, sizing, spacing, visual hierarchy
/atelier-design-interaction   — animation, hover/press states, micro-interactions
/atelier-design-copy          — microcopy, labels, errors, tone
```

Or let the skills auto-trigger — the frontmatter descriptions are tuned to activate on related work.

## Design Context

Design work produces generic output without project context. Before the first run, create a `.atelier.md` at your project root:

```md
# .atelier.md
Target audience: ...
Use cases: ...
Brand tone: ...
Design system: tokens live in src/styles/tokens.css
```

The skill reads it automatically on each invocation.

## What's inside

```
skills/
├── atelier-design/        # parent: principles, references, context protocol
│   ├── SKILL.md
│   ├── references/        # deep material loaded on demand
│   └── libraries/         # easing curves, palettes, font pairings
├── atelier-design-layout/
├── atelier-design-interaction/
└── atelier-design-copy/
evals/                     # test corpus for iterative improvement
CHANGELOG.md               # what was absorbed, from where, when
NOTICE.md                  # attribution to upstream skills
```

## Evolution

This skill grows by absorbing techniques from upstream sources. The process:

1. Spot a new technique or upstream skill worth absorbing.
2. Run `npm run eval` — baseline the current score.
3. Cherry-pick the specific material into the right reference file.
4. Run evals again — confirm improvement.
5. Log in `CHANGELOG.md` with attribution, bump version in `SKILL.md`.
6. `npm version patch && npm publish --access public && git push`

## Evals

```bash
ANTHROPIC_API_KEY=sk-... npm run eval          # all cases
npm run eval:layout                             # by mode
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
