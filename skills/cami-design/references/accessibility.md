# Accessibility

Deep reference. Loaded on demand. Canonical home for: contrast ratios, hit areas, reduced-motion fallback, focus rules, screen-reader semantics.

## Contrast (WCAG) — canonical

These thresholds are referenced from `color.md` and `typography.md` — update here, the others point to this section.

- Body text: ≥ 4.5:1
- Large text (≥ 18.66px or 14px bold): ≥ 3:1
- Interactive element boundaries: ≥ 3:1
- Focus indicators: ≥ 3:1 against adjacent colors
- Placeholder text: ≥ 4.5:1 (commonly missed — the default light gray usually fails)

## Focus

- Every interactive element must have a visible focus state.
- Use `:focus-visible` to show rings on keyboard navigation only (not mouse clicks).
- Never `outline: none` without a replacement.
- Focus order follows visual order.
- Focus trap inside modals; restore focus to the trigger on close.
- **The ring must read at a glance.** A faint ring on a neutral hue (e.g. `ring-neutral/20`) technically passes the 3:1 contrast check but disappears in real use against busy backgrounds. Build the ring from an active brand or accent token, and tune the alpha so it stays unambiguous once you're a step back from the screen.

## Keyboard

- Everything interactive reachable via Tab.
- Enter submits forms; Space activates buttons; Esc closes dialogs.
- Arrow keys navigate within composite widgets (menus, listboxes, radio groups).
- Skip-to-content link at top of page for long navigations.

## Screen Readers

- Semantic HTML first (`<button>`, `<nav>`, `<main>`, not `<div onclick>`).
- ARIA only when semantics can't do the job.
- Label every form field (`<label for>` or `aria-label`).
- Icon-only buttons need `aria-label`.
- Decorative images: `alt=""`. Meaningful: descriptive alt.
- Live regions (`aria-live`) for async updates the user should hear. Use `polite` for non-urgent updates (success messages, counts); `assertive` for critical errors only — it interrupts immediately.
- Prefer `aria-disabled="true"` over the `disabled` attribute for buttons that should stay in the tab order (e.g. a submit button that's temporarily blocked). `disabled` removes the element from keyboard navigation entirely.

## Motion — canonical reduced-motion fallback

Respect `prefers-reduced-motion`. Reduced motion ≠ no motion — keep opacity and color transitions that aid comprehension; remove movement, position changes, and large transforms. Vestibular disorders are real; parallax and big transforms can cause nausea.

Apply this once at the root, not per-component:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Referenced from `motion.md` and `cami-design-interaction/SKILL.md`.

## Touch — canonical hit area rule

- Minimum 40×40px hit areas, regardless of visible element size.
- Adequate spacing between interactive elements — 8px minimum between tap targets.
- Never overlap hit areas of adjacent interactive elements.
- Extend via pseudo-element when the visible element is smaller:

```css
position: relative;
&::before {
  content: '';
  position: absolute;
  inset: -8px; /* expands hit area */
}
```

Referenced from `spacing-layout.md` and `interaction.md`.

## Color

- Never rely on color alone to convey meaning. Pair with icon, text, or shape.
- Test with a color-blindness simulator.

## Language

- `<html lang="...">` always set.
- `dir="..."` for RTL languages.

## Attribution

Standard accessibility practice, synthesized against pbakaus/impeccable and WCAG 2.2.
