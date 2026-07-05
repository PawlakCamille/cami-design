---
name: cami-design-interaction
description: Hover, press, animations, motion. Use when interactions feel sluggish, flat, robotic, or lifeless.
user-invocable: true
argument-hint: "[target]"
---

# Cami — Interaction

## Required reading

Before proceeding, load `../cami-design/references/review-protocol.md` for the shared **Context Gathering Protocol**, **Design System Protocol**, severity scale, and **Review Output Format**. Then load `../cami-design/references/motion.md` — the **Animation Decision Framework** lives there and is the canonical source for the rules below.

---

Tune the parts of an interface that respond to the user: hover, focus, press, enter/exit, feedback. Every motion needs a reason.

## When to Use This Mode

- Animations feel sluggish, janky, or excessive
- Buttons don't feel responsive to press
- Hover states missing or heavy-handed
- Enter/exit transitions are jarring or plays on page load
- User says "make it feel better"
- Adding delight or personality to a flow

## Preparation

1. Check `package.json` for motion libraries (`motion`, `framer-motion`, React Spring, etc.).
2. Identify existing easing and duration conventions in the codebase.
3. Read `../cami-design/references/motion.md` (Animation Decision Framework, performance, scroll-linked motion) and `../cami-design/references/interaction.md` (press, hover, focus, tooltips, mobile/touch).

The Animation Decision Framework — "should this animate? what's the purpose? what easing?" — is documented once, in `references/motion.md`. Apply it as a gate before flagging any motion-related finding.

## Review Dimensions

### Press & Feedback
- Buttons use `scale(0.96)` on `:active` — never smaller than 0.95
- Focus states visible and accessible
- Haptic-feeling transitions (short, specific)
- Stacked clickable rows (sidebar, dropdown, settings sub-nav) use the cursor-continuity pattern — see `../cami-design/references/interaction.md` → *Pointer Continuity in Stacked Rows*

### Enter / Exit
- Split and stagger enter animations (see `motion.md` → Enter Animations for the delay value)
- Exits are subtler than enters (small `translateY`, not full-height)
- Exits are faster than enters — use ~75% of the enter duration
- `initial={false}` on `AnimatePresence` to skip page-load animations

### Specificity
- Never `transition: all` — specify properties (`transition-property: scale, opacity`)
- `will-change` only on `transform`, `opacity`, `filter` — never `will-change: all`
- Only add `will-change` when you notice first-frame stutter

### Icons
- Animate with `opacity`, `scale`, `blur` — never toggle visibility
- Standard values: scale `0.25` → `1`, opacity `0` → `1`, blur `4px` → `0`

### Interruptibility
- Use CSS transitions for interactive state changes (interruptible mid-animation)
- Reserve keyframes for staged sequences that run once

## Accessibility

Reduced-motion fallback is mandatory — see `../cami-design/references/accessibility.md` → *Motion* for the canonical snippet, the rationale (vestibular disorders, what to keep vs. remove), and the application rule.

## Output

Findings as tables with columns `# | Severity | Before | After | Why`, grouped by dimension. Severity is 🔴 (Important) or 🟡 (Nit); see `../cami-design/references/review-protocol.md` → Severity scale for calibration. Skip dimensions with no issues.

Close with the walkthrough offer and (after fixes) the Verify pass. See `../cami-design/references/review-protocol.md` → Closing / Walkthrough mode / Verify pass.

## References

- `../cami-design/references/motion.md` — Animation Decision Framework, performance, scroll-linked motion, advanced techniques
- `../cami-design/references/interaction.md` — press feedback, hover, focus, tooltips, drag & drop, mobile/touch
- `../cami-design/references/accessibility.md` — reduced-motion fallback, vestibular safety
- `../cami-design/references/anti-patterns.md` — sweep last for motion-related "AI slop" tells (bounce easing, glow effects, gratuitous reveals)
- `../cami-design/libraries/easing-curves.json` — canonical easing values consumed by `motion.md`
