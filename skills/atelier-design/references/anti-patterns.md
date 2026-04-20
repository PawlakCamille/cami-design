# Anti-Patterns — "AI Slop" Tells

Things that make an interface look machine-generated. Avoid these unless you have a clear reason.

## The AI Color Palette

- Purple-to-blue gradients
- Saturated cyan + pink + purple combos
- Electric neon on dark navy

If three different AI products use your palette, it's the default — pick something else.

## Gradient Text

- "AI Generated" gradient on headlines
- Multi-color text fills in product UI

Save gradients for marketing moments, never product UI.

## Dark Glows & Neon Borders

- Glowing button borders with `box-shadow: 0 0 40px neon-color`
- Glassmorphism on every card
- Every surface looking like a glass pane

## Hero Metric Layouts

Three giant stat numbers in a row, each with a gradient icon. Every AI-generated dashboard looks like this.

## Identical Card Grids

- 3-up or 4-up card grids with identical padding, identical shadows, identical icon size
- No visual hierarchy between cards
- Rhythm without variation reads as machine output

## Generic Fonts

- Default Inter everywhere
- System UI font as the sole choice
- No stylistic set, no OpenType features

Pick a distinctive display font paired with a refined body font. Use OpenType features.

## "Designed for AI" Buttons

- Primary button labeled "Generate"
- Sparkle emoji before every action
- Everything purple

## Rounded Everything

- Every corner radius at `rounded-full` or `rounded-3xl`
- No hierarchy of roundness
- Pill-shaped everything

## Emoji as Icons

- Random emoji in place of real iconography
- Mixed emoji styles (flat + 3D + skeuomorphic)

## Fake Handwriting / "Authenticity"

- Script fonts used to signal "not AI" (they don't fool anyone)
- "Made with ❤" footers
- Forced imperfection (tilted cards, taped-on looks) at scale

## Side-Stripe Borders

`border-left: 3px+` on cards, list items, callouts, or alerts. One of the most overused "design touches" in admin, dashboard, and medical UIs — it never looks intentional regardless of color or variable name.

```css
/* Never do this */
border-left: 3px solid var(--color-warning);
border-left: 4px solid oklch(...);
```

Reach for something else entirely: full borders, background tints, leading numbers/icons, or no visual indicator. Do not just swap to `box-shadow: inset`.

## Sparklines as Decoration

Tiny inline charts that look sophisticated but convey no meaningful data. If a chart can't be read at its actual size, it's decoration — remove it or give it real estate to breathe.

## Modals by Default

Modals are the right choice for: destructive confirmations, critical blocking decisions, focused quick actions. They become a problem when used as the default for anything that requires user input — multi-step flows, complex forms, content that needs context. Before reaching for a modal, ask: could this be inline, a dedicated page, or a simpler confirmation pattern?

## Theme Choice by Default

Don't choose light or dark because it "looks premium" or "feels safe." Derive it from usage context:
- When is the product used? (Daytime office vs late-night sessions)
- On what device? (Mobile in bright light → light mode reads better)
- For how long? (8h/day → user preference override matters)

Defaulting to dark for aesthetics and light for safety are both lazy. Choose, then commit.

## `h-screen` on Full-height Layouts

`h-screen` compiles to `height: 100vh` — on mobile, `100vh` includes the browser chrome (address bar, bottom nav) which clips your layout. Use `min-h-[100dvh]` instead. `dvh` (dynamic viewport height) adapts to the actual visible area.

```css
/* ✗ */
.page { height: 100vh; }

/* ✓ */
.page { min-height: 100dvh; }
```

```tsx
{/* Tailwind */}
<div className="min-h-[100dvh]">
```

## The Test

If someone said "AI made this," would you believe them immediately? If yes, change it.

## Attribution

Synthesized from: pbakaus/impeccable (impeccable skill "DON'T" guidelines).
