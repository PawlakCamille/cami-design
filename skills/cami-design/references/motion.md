# Motion

Deep reference for animation decisions. Loaded on demand.

## The Animation Decision Framework

Before writing any animation, answer in order:

### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day | No animation. |
| Tens of times/day | Remove or drastically reduce. |
| Occasional | Standard animation. |
| Rare / first-time | Can add delight. |

**Raycast has no open/close animation.** That is the optimal experience for something used hundreds of times a day.

### 2. Purpose

Every animation must answer "why does this animate?"
- Spatial consistency (enter/exit from same direction → swipe-to-dismiss feels right)
- State indication (morphing button shows the state change)
- Feedback (press scale confirms the tap)
- Preventing jarring appearance/disappearance

### 3. Easing

| Scenario | Easing | Value |
| --- | --- | --- |
| Entering — smooth, refined | ease-out | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Entering — snappier | ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Entering — confident, decisive | ease-out | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Exiting | ease-in | `cubic-bezier(0.4, 0, 1, 1)` |
| On-screen movement / morph | soft ease-out | `cubic-bezier(0.2, 0, 0, 1)` |
| Spring (motion lib) | spring — bounce always 0 | `{ type: "spring", duration: 0.3, bounce: 0 }` |

**Never use bounce or elastic easing** — they feel dated and draw attention to the animation itself rather than the content.

**Never use ease-in for UI elements.** It starts slow — which is exactly when the user is watching most closely. A dropdown with `ease-in` at 300ms *feels* slower than `ease-out` at the same 300ms, because ease-in delays the initial movement.

### 4. Duration

- Micro (press, hover): 100-150ms
- State change (toggle, small reveal): 200-250ms
- Modal / drawer enter: 250-350ms
- Never > 400ms for UI unless it's a deliberate moment

## Enter Animations

- **Split and stagger.** Don't animate one container. Break content into semantic chunks, stagger each with ~100ms delay.
- Nothing should appear from `scale(0)`. Start at `scale(0.95)` + `opacity: 0`. Real objects don't materialize from nothing.

## Exit Animations

- Softer than enters.
- Prefer small fixed `translateY` (e.g. 4-8px) over full-height moves.
- Faster than the enter — use ~75% of the enter duration. Exits shouldn't linger.

## Page Load

- `initial={false}` on `AnimatePresence` skips enter animations on first render.
- Verify it doesn't break intentional first-run animations.

## Interruptibility

- CSS transitions for interactive state changes (hover, press) — interruptible mid-animation.
- Keyframes only for staged sequences that run once end-to-end.

## Specificity

- **Never** `transition: all`. Specify exact properties: `transition-property: scale, opacity`.
- Tailwind: `transition-transform` covers `transform, translate, scale, rotate`.

## Performance

- `will-change` only on `transform`, `opacity`, `filter` — GPU-compositable.
- **Never** `will-change: all`.
- Only add `will-change` when you observe first-frame stutter. Overuse destroys performance.
- **CSS variables on parents are expensive in animations.** Changing `--swipe-amount` on a container triggers style recalculation on all children. Update `transform` directly on the element instead:
  ```js
  // Bad — recalculates all children
  element.style.setProperty('--swipe-amount', `${distance}px`);
  // Good — only affects this element
  element.style.transform = `translateY(${distance}px)`;
  ```
- **CSS animations beat JS under load.** CSS animations run off the main thread; Framer Motion's `x`/`y` shorthand props use `requestAnimationFrame` and drop frames when the browser is busy. Use `transform: "translateX()"` string syntax for hardware acceleration in Framer Motion when smoothness matters.

## Icon Animations

- Animate with `opacity`, `scale`, `blur` — never toggle visibility.
- Standard values: scale `0.25 → 1`, opacity `0 → 1`, blur `4px → 0`.
- With motion lib: spring as above.
- Without: keep both icons in DOM (one absolute-positioned), cross-fade with `cubic-bezier(0.2, 0, 0, 1)`.

## Popover / Dropdown Origin

Scale from the trigger, not from center:
```css
transform-origin: var(--radix-popover-content-transform-origin);
```

Modals stay centered (they're not anchored).

## Advanced Techniques (use sparingly)

These have real complexity costs. Only reach for them when the benefit is **clearly felt by the user** — not for technical interest. Each one should be a deliberate decision, not a default.

### View Transitions API
Morphs DOM elements between states — a list item expanding into a detail page, a button transforming into a dialog. The browser handles the transition; no custom animation code needed.

```js
document.startViewTransition(() => {
  // update the DOM here
});
```

- Use for **spatially significant transitions** only (navigating between views, expanding into detail)
- Never use to decorate routine state changes
- Browser support: Chrome, Edge, Safari — no Firefox. Always test without it.

### Spring Physics
Already covered in easing section (`bounce: 0` for standard UI). The upgrade: use `bounce: 0.15–0.25` for **explicit celebration moments only** — onboarding completion, first achievement, major milestone. Never on repeated actions.

### Virtual Scrolling
For lists > ~200 items that cause **measurable lag**. Use TanStack Virtual (React) or equivalent.

- Only add when you can observe the performance problem — not by default
- Complexity cost is real: keyboard nav, accessibility, dynamic heights all require extra work
- If the list doesn't lag, don't virtualize it

### `@starting-style`
Animate elements from `display: none` to visible in pure CSS — no JS needed.

```css
@starting-style {
  .dialog { opacity: 0; transform: scale(0.95); }
}
.dialog { opacity: 1; transform: scale(1); transition: opacity 200ms, transform 200ms; }
```

Zero complexity cost, works in all modern browsers. Worth using whenever you'd otherwise reach for a JS animation just to handle the appear transition.

### `interpolate-size` & `calc-size()`
Animate `height` / `width` to/from `auto` directly — kills the `max-height: 9999px` workaround.

```css
:root {
  interpolate-size: allow-keywords;
}

.accordion {
  height: 0;
  overflow: hidden;
  transition: height 300ms cubic-bezier(0.25, 1, 0.5, 1);
}
.accordion.open {
  height: auto;
}
```

Chrome 129+, Safari 18.2+, no Firefox as of April 2026. Falls back to a snap instead of animation — safe as progressive enhancement.

### SVG Transforms (Safari fix)
Safari miscalculates `transform-origin` on direct `<path>` / `<circle>` / `<rect>` elements. Always wrap animated SVG shapes in a `<g>` and set:

```css
g.animated {
  transform-box: fill-box;
  transform-origin: center;
}
```

Without this, scale and rotate animations on SVG shapes fly off-center in Safari while looking fine in Chrome.

## Accessibility

Respecting `prefers-reduced-motion` is an accessibility requirement, not optional. Always provide a non-animated fallback. The snippet lives in `interaction/SKILL.md` — apply it globally at the root level.

## Attribution

Synthesized from: emilkowalski/skill, jakubkrehel/make-interfaces-feel-better `animations.md`, pbakaus/impeccable `motion-design.md`, MDN web docs (`interpolate-size`, `calc-size()`), vercel-labs/web-interface-guidelines (SVG Safari fix).
