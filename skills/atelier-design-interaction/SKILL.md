---
name: atelier-design-interaction
description: Animation, hover and press states, micro-interactions, and moments of delight. Use when the user mentions animation, transitions, hover effects, click feedback, motion, micro-interactions, delight, feel, "make it feel better", or interactive polish.
version: 0.1.0
user-invocable: true
argument-hint: "[target]"
---

## MANDATORY PREPARATION

Invoke `atelier-design` — it contains the shared principles, references, and **Context Gathering Protocol**. Follow the protocol before proceeding.

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
3. Read `../atelier-design/references/motion.md` and `../atelier-design/references/interaction.md`.

## The Animation Decision Framework

Before writing any animation, answer in order:

### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command palette) | **No animation.** Ever. |
| Tens of times/day (hover, list nav) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare (onboarding, celebrations, first-run) | Can add delight |

**Never animate keyboard-initiated actions.** They are repeated so often that animation feels like latency.

### 2. What is the purpose?

Every animation needs a clear answer to "why does this animate?" Valid purposes:
- **Spatial consistency** (toast enters/exits from the same direction)
- **State indication** (morphing button shows a state change)
- **Feedback** (scale on press confirms the tap)
- **Preventing jarring changes** (elements appearing without transition feel broken)

If the purpose is "it looks cool" and the user sees it often, don't animate.

### 3. What easing?

| Scenario | Easing | Value |
| --- | --- | --- |
| Entering the screen | ease-out — smooth, refined | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Entering the screen | ease-out — snappier | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Entering the screen | ease-out — confident, decisive | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Exiting | ease-in — accelerates out | `cubic-bezier(0.4, 0, 1, 1)` |
| On-screen movement/morph | soft ease-out | `cubic-bezier(0.2, 0, 0, 1)` |
| Spring (if motion lib available) | spring — bounce always 0 | `{ type: "spring", duration: 0.3, bounce: 0 }` |

**Never use bounce or elastic easing** (`cubic-bezier(0.34, 1.56, ...)` etc.) — they feel dated and draw attention to the animation itself rather than the content.

## Review Dimensions

### Press & Feedback
- Buttons use `scale(0.96)` on `:active` — never smaller than 0.95
- Focus states visible and accessible
- Haptic-feeling transitions (short, specific)

### Enter / Exit
- Split and stagger enter animations (~100ms delay per chunk)
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

Always provide a reduced-motion fallback — ignoring this is an accessibility violation, not a suggestion.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Output

Findings as `Before | After | Why` tables, grouped by dimension. Skip dimensions with no issues.

## References

- `../atelier-design/references/motion.md`
- `../atelier-design/references/interaction.md`
- `../atelier-design/libraries/easing-curves.json`
