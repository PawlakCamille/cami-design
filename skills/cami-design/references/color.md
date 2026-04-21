# Color

Deep reference for color decisions. Loaded on demand.

## Design System First

Before touching any color value, check for existing tokens, CSS variables, or theme config. Propose changes using the existing system — never override.

## Color Space: Use OKLCH

**Stop using HSL.** HSL is not perceptually uniform — 50% lightness in yellow looks bright while 50% lightness in blue looks dark. Equal steps don't look equal.

OKLCH is perceptually uniform: `oklch(lightness% chroma hue)`.
- `lightness`: 0–100%
- `chroma`: roughly 0–0.4 (higher = more saturated)
- `hue`: 0–360

To build a scale: hold chroma + hue constant, vary lightness. **Reduce chroma as you approach white or black** — high chroma at extreme lightness looks garish.

Don't reach for blue (hue ~250) or warm orange (hue ~60) by reflex — those are the dominant AI-design defaults.

## Systems Over Swatches

- Work in a scale (e.g. 50, 100, 200 ... 900, 950) per hue.
- **Two token layers**: primitives (`--blue-500`) + semantic (`--color-primary: var(--blue-500)`). Components reference semantic tokens only. For dark mode, redefine only the semantic layer — primitives stay the same.
- A theme swap should never require touching components.

## Contrast

- Body text: ≥ 4.5:1 against background (WCAG AA).
- Large text (≥ 18.66px or 14px bold): ≥ 3:1.
- Interactive elements: ≥ 3:1 for the element boundary.
- Focus rings: must meet 3:1 against adjacent colors.
- **Placeholder text still needs 4.5:1.** That light gray placeholder everywhere? Usually fails WCAG.
- **Gray text on colored backgrounds** looks washed out and dead. Use a darker shade of the background color, or transparency — never a generic gray.

Test with actual tooling (Stark, Contrast app, browser devtools). Don't eyeball.

## Dark Mode

- Not a simple invert. Shift hues, not just lightness.
- Reduce saturation on dark backgrounds — saturated colors glow and fatigue the eye.
- **Elevation via lighter surfaces, not shadows.** Build a 3-step surface scale: `oklch(15% / 20% / 25% chroma hue)` — higher elevation = lighter background. Shadows become invisible on dark.
- Reduce body text weight slightly in dark mode (e.g. 350 instead of 400) — light text on dark reads as heavier.
- White text on dark: add `0.05–0.1` to line-height — light type reads as lighter weight and needs breathing room.
- Redefine only the semantic token layer for dark mode — never touch primitive tokens.

## Accent Color & 60/30/10

- One primary accent, used sparingly. An interface where everything pops has nothing that pops.
- Save the accent for the primary action and critical signals.
- **60/30/10 rule** (visual weight, not pixel count):
  - 60% — neutral backgrounds, white space, base surfaces
  - 30% — text, borders, inactive states
  - 10% — accent: CTAs, highlights, focus states
- Common mistake: using the accent everywhere because "it's the brand color." Overuse kills its power.

## Selection Color

Override the default browser selection highlight with a tint of the accent. Small polish detail, reinforces brand without effort.

```css
::selection {
  background: oklch(from var(--color-accent) l c h / 0.25);
  color: inherit; /* let alpha handle contrast */
}
```

Test dark mode explicitly — accent on a dark background often needs a different alpha to stay legible.

## Neutral Palette

- **Pure gray is dead.** A neutral with zero chroma feels lifeless next to a brand color. Add a tiny chroma (`0.005–0.015` in OKLCH) tinted toward **this project's brand color** — not generically warm or cool. The tint is subtle enough not to read as "colored" consciously, but creates subconscious cohesion.
- Never pure black backgrounds for text — use `oklch(12–18% chroma hue)` or `#0A0A0A`. Pure black + pure white is too harsh for long reads.

## Semantic Colors

- Success: green that isn't too saturated
- Warning: amber/yellow, legible
- Danger: red that isn't screaming
- Info: blue that isn't the brand color (if the brand is blue, use a different blue or a neutral)

## Alpha Transparency — Use Sparingly

Heavy use of `rgba` / `hsla` / opacity is usually a sign of an incomplete palette. Alpha creates unpredictable contrast across different backgrounds, performance overhead, and visual inconsistency.

- Define explicit overlay colors for each context instead of relying on transparency
- Exception: focus rings, interactive states, and overlays where see-through is intentional

## Gradients

- Subtle and directional, or don't bother.
- Avoid rainbow gradients in serious UI — they read as "AI slop" or marketing.
- Text gradients: skip them in product UI. Keep for marketing moments.

## Native Browser UI

Several native UI elements render in system defaults unless you tell the browser otherwise. For polish — especially when shipping dark mode — set these explicitly.

- **`color-scheme`** on `<html>` tells the browser the page's theme. Affects native scrollbars (Firefox/Safari), default `<input>` / `<select>` styling, autofill colors, and form validation popups. Without it, a dark page shows **bright white scrollbars** and form controls that break the theme.
  ```css
  :root { color-scheme: light; }
  [data-theme="dark"] { color-scheme: dark; }
  /* If you support both automatically: */
  :root { color-scheme: light dark; }
  ```
- **`<meta name="theme-color">`** sets mobile browser chrome (iOS Safari address bar, Chrome Android nav) to match your background. **Worth setting even on light-only products** — match your page background exactly so the chrome blends in.
  ```html
  <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
  ```
- **Windows native `<select>` dark mode bug** — renders with broken contrast. Always set `background-color` and `color` explicitly on native `<select>`.
  ```css
  select {
    background-color: var(--surface);
    color: var(--text);
  }
  ```

## Attribution

Synthesized from: pbakaus/impeccable `color-and-contrast.md`, anthropics/frontend-design, MDN web docs (`::selection`, relative color syntax), vercel-labs/web-interface-guidelines (native browser UI rules).
