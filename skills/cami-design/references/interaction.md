# Interaction

Deep reference for interactive states and feedback. Loaded on demand.

## Press Feedback

- `scale(0.96)` on `:active` is the sweet spot for buttons.
- **Never** below `0.95` — feels exaggerated, like a cartoon.
- Pair with `transition: scale 100ms ease-out` for the release.
- Add a `static` prop to disable when motion would distract.
- **Reserve press scale for CTAs.** Tabs, rows, and list items shouldn't scale on press — the gesture reads as a poor decision on non-action controls. Use color shift or no feedback.
- **Stacked affordances share one slot.** When a control morphs (chevron → confirm checkmark, play → pause), keep it in the same click target instead of swapping in a sibling — the cursor shouldn't have to chase a moving target between states.

## Hover States

- Subtle. Hover is not a celebration — it's a confirmation that an element is interactive.
- Common patterns: background shift (~5-10% lightness), subtle shadow lift, color deepen.
- Avoid: scaling on hover (feels unstable), color shifts > 15% (too dramatic).
- **Hover flicker fix:** when a hover state triggers an animation on the element itself, the cursor can leave the animated area mid-transition and re-trigger the exit — causing flicker. Apply hover on the parent, animate a child inside it:
  ```css
  /* ✗ — cursor leaving the scaled element re-triggers :hover off */
  .btn:hover { transform: scale(1.02); }

  /* ✓ — hover zone stays fixed, inner element animates */
  .btn:hover .btn-inner { transform: scale(1.02); }
  ```
- **Gate hover animations behind a media query** — touch devices trigger hover on tap, causing false positives:
  ```css
  @media (hover: hover) and (pointer: fine) {
    .element:hover { transform: scale(1.02); }
  }
  ```
- **Sticky hover while a child is open.** When a row's context menu is open, or a card is expanded, the trigger stays in its hover/active visual state — don't let it drop to idle while its popover is still on screen.

## Pointer Continuity in Stacked Rows

Lists of stacked clickable rows that read as separated pills (sidebar nav, dropdown options, settings sub-nav) make the OS cursor flicker `pointer → default → pointer` as it crosses the visual gap between rows. Small, but it reads as cheap.

Fix: give each row a 1px transparent border top + bottom, paired with `background-clip: padding-box` so hover/active fill stops at the inner edge.

```css
/* On each row */
border-top: 1px solid transparent;
border-bottom: 1px solid transparent;
background-clip: padding-box;
```

Tailwind: `border-y border-y-transparent bg-clip-padding`

`bg-clip-padding` is mandatory — without it the hover fill bleeds into the border area (default `border-box`) and adjacent filled rows merge with no breathing room. With it, the fill stops at the inner edge and the visible gap between pills is preserved.

**Apply to:** sidebar nav lists, dropdown / combobox rows, settings sub-nav, any list where rows look like separated pills but should feel like one continuous track to the cursor.

**Don't apply to:** tables with real borders (edges already shared), standalone buttons (no siblings), or rows where the gap is intentional UX signal (e.g. group divider — the divider is the message).

Quick check: drag the cursor top-to-bottom of the list at ~50px/s. If it blinks between pointer and arrow, apply the pattern.

## Focus States

- Visible, always. Never `outline: none` without a replacement.
- Match the brand but stay distinct from hover.
- Use `:focus-visible` to show rings only on keyboard nav, not mouse clicks.
- Never animate focus ring transitions — keyboard navigation should feel instant. Animated focus rings make Tab feel broken.

## Hit Areas

See `accessibility.md` → *Touch* for the canonical 40×40 rule and pseudo-element technique. The same content used to live here too; collapsed to a pointer to avoid drift.

## Loading States

- Skeletons > spinners for content that has known structure.
- Spinner only when the action is instant-feeling (< 1s) and you just need to reassure.
- Optimistic UI when safe — update immediately, roll back on error with a clear message.
- **Disable the button while loading** to prevent double-submission — re-enable on success or error.
- **Minimum visible duration.** Add a show-delay (~150–300ms) before a skeleton or spinner renders, and a minimum visible time (~300–500ms) once it does. Prevents flicker on fast responses — a spinner that flashes for 80ms looks like a bug. React's `<Suspense>` can handle this natively.

## Disabled States

- Reduce opacity to ~50%.
- Remove hover/press affordances — don't tease interactivity that isn't there.
- If possible, explain **why** it's disabled (tooltip or inline hint). Never leave the user guessing.

## Destructive Row Actions

- **Reveal progressively:** hidden by default, appear neutral on row hover, escalate to danger color only on precise hover of the control itself. Keeps the UI calm and makes intent explicit.
  ```css
  /* Parent row */ .group/row
  /* Button */ opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100
  /* Icon  */ text-primary-40 group-hover/btn:text-danger
  ```
- **Armed vs. gated state in color, not just opacity.** A destructive button that's gated behind a confirmation step should be muted (danger-40 or primary-40) until the condition is met — then switch to full danger. Opacity alone doesn't communicate state change clearly enough.
- **Match transition durations on paired properties.** When a hover state changes multiple properties together (background + icon color, opacity + scale), all must share the same duration. One transitioning while the other snaps = desync that reads as broken.

## Blur Trick

When a crossfade between two states feels off despite trying different easings and durations, add subtle `filter: blur(2px)` during the transition. Without blur, you see two distinct objects overlapping — blur bridges the visual gap by blending them into a single perceived transformation.

```css
.button-content {
  transition: filter 200ms ease, opacity 200ms ease;
}
.button-content.transitioning {
  filter: blur(2px);
  opacity: 0.7;
}
```

Keep blur under 20px. Heavy blur is expensive, especially in Safari.

## Tooltip Behaviour

- First tooltip: delay before appearing (prevents accidental activation on cursor pass)
- Subsequent tooltips (hovering adjacent elements while one is open): **instant, no animation**

```css
.tooltip { transition: transform 125ms ease-out, opacity 125ms ease-out; }
.tooltip[data-instant] { transition-duration: 0ms; }
```

This makes toolbars and nav feel significantly faster without removing the protective delay.

## Toggle & Selection States

- Toggle switches: smooth slide + color transition (200–300ms)
- Checkbox: scale pulse on check (brief `scale(1.1)` → `scale(1)`) with opacity fade
- On mobile: haptic feedback on toggle/selection change

## Drag & Drop

- **Lift effect on drag start**: `scale(1.02)` + shadow increase — signals the element is "picked up"
- **Drop zone highlight**: subtle background or border change when dragging over a valid target
- **Snap on drop**: brief spring animation settling into final position
- **Undo escape hatch**: toast with undo action if the user drops in the wrong place
- **`transition: none` while dragging.** Any easing/spring on the dragged element makes the cursor and the element drift apart — scrubbing must be 1:1. Restore the transition only on programmatic, non-drag updates (drop snap, cancel return).
- **Drag hit area = the whole section, not just the handle or hovered region.** Unless competing interactions live on the same surface, the row accepts drag from anywhere.
- **Don't shift layout when drag becomes available.** Line height, padding, and alignment must match the non-draggable version — the affordance belongs in cursor and handle, not in the layout.
- **Dismiss on velocity, not distance.** Compute flick speed (`Math.abs(distance) / elapsedMs`) and release past ~0.11 px/ms even if the drag never crossed a distance threshold. A fast flick should be enough; a fixed travel distance makes the gesture feel heavy.
- **Damp past the boundary.** Dragging beyond a natural edge should move less the further it goes (rising resistance), not hit an invisible wall. Friction reads as physical; a hard stop reads as broken.
- **Capture the pointer once dragging starts** (`setPointerCapture`), so the gesture keeps tracking when the pointer leaves the element's bounds. Without it a fast drag drops the moment the cursor exits.
- **Ignore extra touch points mid-drag** (`if (isDragging) return` on new pointers). A second finger landing during a drag otherwise jumps the element.

## Haptics (mobile/native)

- Light tap on primary action success
- Selection change on toggle / picker
- Warning on destructive confirm
- Don't haptic-spam — frequent haptics become noise fast

## Keyboard

- Every interactive element reachable via Tab.
- Standard shortcuts respected (Enter to submit, Esc to close, Arrow keys in lists).
- Focus trap inside modals; restore focus to trigger on close.

## Mobile & Touch

- **`touch-action: manipulation`** on interactive elements — eliminates the 300ms double-tap-zoom delay that makes buttons feel sluggish on mobile Safari.
  ```css
  button, a { touch-action: manipulation; }
  ```
- **`-webkit-tap-highlight-color`** — default is translucent gray that flashes on tap. Either disable it or tint to the accent for branded feedback.
  ```css
  html { -webkit-tap-highlight-color: transparent; }
  ```
- **`overscroll-behavior: contain`** on modals, drawers, sheets, scrollable dropdowns — prevents scroll chaining where scrolling inside the component scrolls the page behind it.
- **Drag interactions:** disable text selection during drag, apply `inert` to the dragged element so selection and hover don't fire simultaneously.
  ```css
  .dragging { user-select: none; }
  ```
- **`autoFocus` sparingly** — desktop only, on a single primary input (login email, search on a search page). Never on mobile — the keyboard opening causes layout shift and disorients the user.

## Forms

See `forms.md` for input attributes, submit behavior, error placement, placeholders, and unsaved-changes warnings.

## Attribution

Synthesized from: pbakaus/impeccable `interaction-design.md`, jakubkrehel/make-interfaces-feel-better, emilkowalski/skill, emilkowalski/review-animations (gesture physics: velocity dismissal, boundary damping, pointer capture, multi-touch protection), vercel-labs/web-interface-guidelines (mobile/touch, loading timing).
