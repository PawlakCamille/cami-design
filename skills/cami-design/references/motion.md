# Motion

Deep reference for animation decisions. Loaded on demand.

## The Animation Decision Framework

Before writing any animation, answer in order:

### 1. Should this animate at all?

| Frequency | Examples | Decision |
| --- | --- | --- |
| 100+ times/day | Keyboard shortcuts, command palette | **No animation.** Ever. |
| Tens of times/day | Hover, list nav | Remove or drastically reduce. |
| Occasional | Modals, drawers, toasts | Standard animation. |
| Rare / first-time | Onboarding, celebrations, first-run | Can add delight. |

**Never animate keyboard-initiated actions.** They are repeated so often that animation feels like latency.

**Raycast has no open/close animation.** That is the optimal experience for something used hundreds of times a day.

### 2. Purpose

Every animation must answer "why does this animate?"

**Default test**: does this motion answer "where did this come from" or "look at me"? Motion that answers the first is doing spatial work; motion that answers the second is decoration. When unsure, cut it.

- Spatial consistency (enter/exit from same direction → swipe-to-dismiss feels right)
- State indication (morphing button shows the state change)
- Feedback (press scale confirms the tap)
- Preventing jarring appearance/disappearance
- **Only one element should animate prominently at a time.** Competing simultaneous animations split attention and neither lands.
- **Context menus get no entrance animation** — high-frequency use makes entrance animations compound into irritation. Exit only.
- **"Remove the transition" rarely means "remove all motion."** A plain ~100ms opacity fade is the floor. Hard cuts read as broken, not restrained.

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

**Linear easing only for progress bars and time-based representations** — never for spatial motion. Linear has no physical equivalent and reads as robotic.

**Never use ease-in for UI elements.** It starts slow — which is exactly when the user is watching most closely. A dropdown with `ease-in` at 300ms *feels* slower than `ease-out` at the same 300ms, because ease-in delays the initial movement.

### 4. Duration

- Micro (press, hover): 100-150ms
- State change (toggle, small reveal): 200-250ms
- Modal / drawer enter: 250-350ms
- Never > 400ms for UI unless it's a deliberate moment

**The ~100ms cause-and-effect threshold.** Below ~100ms, motion reads as the direct consequence of the user's action ("I pressed → it moved"). Above, it starts feeling like a separate event — feedback rather than causation. Default below 100ms for motion the user *causes*; reserve longer durations for motion the system *narrates* (a toast appearing, a modal opening on its own).

**Asymmetric by intent class.** Match the duration to *who* triggered the motion. See the *Frequency* table at the top of this file for the high-frequency floor (keyboard-initiated → no animation); the table below covers the remaining cases:

| Intent class | Example | Appear | Disappear |
| --- | --- | --- | --- |
| Summoned by user | Command palette, tooltip on focus, dropdown on click | Instant or ≤100ms | ~150ms fade |
| Ambient state change | Toast, banner swap, status update | 200-250ms | ~75% of appear |
| Transitional surface | Modal, drawer, sheet | 250-350ms with ease-out | 200-250ms with ease-in |

When in doubt, default toward the shorter end — long durations on repeated actions feel like latency, not polish.

## Enter Animations

- **Split and stagger.** Don't animate one container. Break content into semantic chunks, stagger each with ~50ms delay — beyond that it feels slow, not polished. CSS-only: set `--index` on each item and use `animation-delay: calc(var(--index) * 50ms)`.
- Nothing should appear from `scale(0)`. Start at `scale(0.95)` + `opacity: 0`. Real objects don't materialize from nothing.
- **Pair small movement with small blur.** A 2-3px blur companion to a short translate or scale makes brief motion read clearly. Without it, 8px distances look like "nothing happened."

## Exit Animations

- Softer than enters.
- Prefer small fixed `translateY` (e.g. 4-8px) over full-height moves.
- Faster than the enter — use ~75% of the enter duration. Exits shouldn't linger.
- **Close on a subtler scale than the open started from** (e.g. opens from `scale(0.97)`, closes toward `scale(0.99)`). Exits shouldn't "pop" as much as the entrance did.
- **Sibling state swaps need a transition.** When one banner, toast, or card replaces another in the same slot, hard-swap reads as a bug. Cross-fade with a brief overlap, or pair fade with a small scale shift.

## Page Load

- `initial={false}` on `AnimatePresence` skips enter animations on first render.
- Verify it doesn't break intentional first-run animations.

## Interruptibility

- CSS transitions for interactive state changes (hover, press) — interruptible mid-animation.
- Keyframes only for staged sequences that run once end-to-end.
- **If the motion can be interrupted mid-flight, use a spring.** Easing curves break on interruption; springs resolve naturally from wherever they're stopped.

## Specificity

- **Never** `transition: all`. Specify exact properties: `transition-property: scale, opacity`.
- Tailwind: `transition-transform` covers `transform, translate, scale, rotate`.
- **Animate the inner piece, not the container.** Badge dot, not the trigger button. Page sections, not the wrapper. Animating the container makes the surrounding context move; the changing thing should be the thing that moves.
- **`animation-fill-mode: backwards`** when the keyframes start with a `filter` or `transform` value that shouldn't linger after the sequence ends — otherwise the residual state stays painted.

## Performance

- `will-change` only on `transform`, `opacity`, `filter` — GPU-compositable.
- **Never** `will-change: all`.
- Only add `will-change` when you observe first-frame stutter. Overuse destroys performance.
- **Jittery mid-animation?** Add `will-change: transform` to promote the element to its own compositor layer. Different from first-frame stutter — this is for animations that feel shaky *during* playback, usually caused by concurrent repaints on the same layer.
- **`backdrop-blur` on scrolling containers** forces re-compositing on every scroll frame. Limit it to `position: fixed` or `sticky` elements only. **Cap radius at ~8px**, never animate it on large surfaces, never in loops.
- **Reach for blur last.** Try `opacity` and `translate` first — they're free on the compositor. Use blur only when the effect genuinely needs it.
- **CSS variables on parents are expensive in animations.** Changing `--swipe-amount` on a container triggers style recalculation on all children. Update `transform` directly on the element instead:
  ```js
  // Bad — recalculates all children
  element.style.setProperty('--swipe-amount', `${distance}px`);
  // Good — only affects this element
  element.style.transform = `translateY(${distance}px)`;
  ```
- **CSS animations beat JS under load.** CSS animations run off the main thread; Framer Motion's `x`/`y` shorthand props use `requestAnimationFrame` and drop frames when the browser is busy. Use `transform: "translateX()"` string syntax for hardware acceleration in Framer Motion when smoothness matters.

### FLIP for layout-like motion

To animate something that looks like a layout change (reorder, expand, list reflow), never animate `width`/`height`/`top`/`margin` — they trigger layout per frame. Measure first, apply final state, invert with transform, play.

```js
const first = el.getBoundingClientRect();
el.classList.add('moved');
const last = el.getBoundingClientRect();
el.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
requestAnimationFrame(() => {
  el.style.transition = 'transform 0.3s';
  el.style.transform = '';
});
```

The animation runs on the compositor while reading as layout. View Transitions API does this for navigation; FLIP for in-page rearrangement.

**Batch reads before writes.** Reading layout (`getBoundingClientRect`, `offsetTop`) after a write forces synchronous reflow. Group all reads, then all writes.

## Scroll-linked Motion

- **Use Scroll/View Timelines, not `scroll` listeners.** Listeners fire dozens of times per tick and force sync layout/paint. The CSS timeline API runs on the compositor.
  ```css
  .reveal {
    animation: fade-in linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
  ```
  Baseline: Chrome 115+, Safari 26+, Firefox behind a flag. Write keyframes so the final state is the rest state — unsupported browsers stay there.

- **Pause off-screen animations with IntersectionObserver.** Looping motion (carousels, marquees, ambient backgrounds) running off-screen burns battery and the main thread.
  ```js
  new IntersectionObserver(([e]) =>
    el.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'
  ).observe(el);
  ```

## Icon Animations

- Animate with `opacity`, `scale`, `blur` — never toggle visibility.
- Standard values: scale `0.25 → 1`, opacity `0 → 1`, blur `4px → 0`.
- With motion lib: spring as above.
- Without: keep both icons in DOM (one absolute-positioned), cross-fade with `cubic-bezier(0.2, 0, 0, 1)`.
- **Toggle icons (check ↔ copy) on hover-out**: keep both in DOM through the full crossfade. Re-mounting mid-fade flashes the wrong icon for 1-2 frames.

## Popover / Dropdown Origin

Scale from the trigger, not from center:
```css
transform-origin: var(--radix-popover-content-transform-origin);
```

Modals stay centered (they're not anchored).

**Edge detection: flip when clipped.** A popover that opens off the bottom or right of the viewport must flip to the other side of the trigger, not get cut. Radix, Floating UI, and most modern primitives ship this — verify it's on, don't reinvent it.

**Escape clipping ancestors via the viewport.** If a popover lives inside an ancestor with `overflow: hidden`, `transform`, or `filter`, that ancestor clips it. Render in a portal at `<body>` level, or position `fixed` relative to the viewport with manual placement. Don't try to fight the ancestor's clipping in-place.

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

Reduced-motion fallback: see `accessibility.md` → *Motion* for the canonical snippet, the rationale (vestibular safety, what to keep vs. remove), and the application rule.

## Attribution

Synthesized from: emilkowalski/skill, jakubkrehel/make-interfaces-feel-better `animations.md`, pbakaus/impeccable `motion-design.md`, MDN web docs (`interpolate-size`, `calc-size()`), vercel-labs/web-interface-guidelines (SVG Safari fix), fixing-motion-performance skill (FLIP, scroll timelines, blur ordering), Jakubantalik/transitions-dev (close-scale subtlety, animate-inner-piece, blur+motion pairing), brotzky/performance-skills (cause-and-effect threshold, summoned/ambient/transitional duration classes, spatial-work test).
