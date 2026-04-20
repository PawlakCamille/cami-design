# Spacing & Layout

Deep reference for composition. Loaded on demand.

## The Spacing Scale

- Use a scale (Tailwind default, 4px-based, 8px-based — pick one and stick to it).
- Never arbitrary values. A stray `13px` gap is the loudest signal of drift.
- Major scale steps: 4, 8, 12, 16, 24, 32, 48, 64, 96.

## Concentric Border Radius

The most common "feels off" tell.

**Rule:** Outer radius = inner radius + padding.

Example: card with `rounded-2xl` (16px) and `p-2` (8px) padding → inner button should be `rounded-lg` (8px).

Mismatched nested radii break the visual relationship between surfaces.

## Optical vs Geometric Alignment

Geometric centering often looks off. Adjust for perceived visual weight.

- **Play triangle in a circle**: nudge right — the triangle's visual center is not its geometric center
- **Button with icon + text**: use slightly less padding on the icon side. Rule of thumb: `icon-side padding = text-side padding - 2px`
  ```tsx
  // Tailwind
  <button className="pl-4 pr-3.5 flex items-center gap-2">
    <span>Continue</span>
    <ArrowRightIcon />
  </button>
  ```
- **Asymmetric icons (stars, arrows, carets)**: best fixed in the SVG directly. Fallback: `margin-left: 1px` or similar
- **Heavy glyph next to a light one**: optical baseline shift

When in doubt, trust your eye over the math.

## Hit Areas

- Minimum 40×40px, regardless of visible element size.
- Extend via pseudo-element if the visible element is smaller.
- Never let hit areas of adjacent interactive elements overlap.

## Shadows Over Borders

For buttons, cards, and containers that use a border for depth or elevation, prefer `box-shadow`. Shadows adapt to any background; solid borders don't. **Do not apply to dividers or layout separators** — those should stay as borders.

### Light mode — 3-layer shadow

```css
--shadow-border:
  0px 0px 0px 1px rgba(0, 0, 0, 0.06),
  0px 1px 2px -1px rgba(0, 0, 0, 0.06),
  0px 2px 4px 0px rgba(0, 0, 0, 0.04);

--shadow-border-hover:
  0px 0px 0px 1px rgba(0, 0, 0, 0.08),
  0px 1px 2px -1px rgba(0, 0, 0, 0.08),
  0px 2px 4px 0px rgba(0, 0, 0, 0.06);
```

### Dark mode — single white ring

```css
--shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.08);
--shadow-border-hover: 0 0 0 1px rgba(255, 255, 255, 0.13);
```

### Usage

```css
.card {
  box-shadow: var(--shadow-border);
  transition-property: box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}
.card:hover { box-shadow: var(--shadow-border-hover); }
```

### When to use shadows vs borders

| Shadows | Borders |
| --- | --- |
| Cards, elevated containers | Dividers between list items |
| Buttons with bordered styles | Table cell boundaries |
| Dropdowns, modals | Form input outlines (accessibility) |
| Elements on varied backgrounds | Hairline separators in dense UI |

## Image Outlines

Add a subtle 1px outline to images for consistent depth.

- Light mode: `rgba(0, 0, 0, 0.1)` — **pure black only**
- Dark mode: `rgba(255, 255, 255, 0.1)` — **pure white only**
- Never use tinted near-blacks (slate-900, zinc-900, `#0a0a0a`) — they pick up the surface color and read as dirt on the image edge

Use `outline` not `border` — it doesn't affect layout. Use `outline-offset: -1px` to keep it inset:

```css
img {
  outline: 1px solid rgba(0, 0, 0, 0.1);
  outline-offset: -1px;
}
/* dark mode */
img {
  outline: 1px solid rgba(255, 255, 255, 0.1);
  outline-offset: -1px;
}
```

```tsx
/* Tailwind */
<img className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" />
```

## Long-form Layouts

### Sticky Section Headers

On any page organized into titled sections where content can overflow the viewport — settings, forms, documentation, detail panels, legal pages — the section title should stick to the top of the scroll container. Without it, the user scrolls into the middle of a section with no anchor — they've lost context of where they are.

```css
.section-title {
  position: sticky;
  top: var(--header-height, 0px); /* offset by any fixed top nav */
  z-index: 1;
  background: var(--surface-page); /* must match page background — sticky without bg is invisible */
}
```

**When to apply:** any section where content height can exceed ~80vh. On shorter sections it does nothing, so it's safe to apply consistently across all section headers.

**Common mistake:** forgetting the background. A sticky element with a transparent background lets content scroll behind it — worse than no sticky at all.

**Tailwind:**
```tsx
<h2 className="sticky top-0 z-10 bg-[--surface-page] py-3 text-sm font-medium text-secondary">
  Security
</h2>
```

## Vertical Rhythm

Align to a baseline grid. Body text leading defines the unit; spacing between blocks follows that unit (1x, 2x, 3x).

## Responsive

- Spacing scales don't shrink linearly on mobile. Define breakpoint-specific steps.
- Line length rule still applies: 65-75ch.
- Touch targets don't shrink on small screens — they get more important.

## Attribution

Synthesized from: pbakaus/impeccable `spatial-design.md`, jakubkrehel/make-interfaces-feel-better `surfaces.md`, emilkowalski/skill.
