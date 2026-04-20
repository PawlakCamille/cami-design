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

## License

This skill is released under Apache 2.0. When absorbing from upstream skills with compatible licenses, attribution is maintained here and in the specific reference file where the material lives.

If you are an upstream author and would prefer different attribution or removal of absorbed material, please open an issue.
