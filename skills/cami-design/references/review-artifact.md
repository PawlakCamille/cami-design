# HTML Review Artifact

How to render a visual-design review as an interactive approval artifact, like a design-flavoured PR review. Loaded only when the user picks **Build an HTML review** at the closing. Offered by the visual modes and full audits, never by `cami-design-engineer`.

## When it earns its place

The artifact shines when findings are **auto-renderable** from self-contained code: spacing, radius, color, type, easing and duration, press feedback, copy. Its unique value over the terminal (and over the live preview) is playing a before/after **animation** side by side, in isolation. Reach for it on a full audit with many such findings. For a handful of findings, or a review dominated by things you can't render, the terminal table plus Apply mode is better; say so instead of forcing an artifact.

## The one rule that matters: never fake the current state

You are reviewing a real product you cannot screenshot. Do not fabricate a mockup of the "current" screen and present it as truth. A wrong preview in a *design* review means the reader is judging a hallucination.

For each finding, pick the honest preview:

- **Faithful live preview**, only when the change is fully reproducible from the reviewed code in isolation: an easing/duration change (show both curves *playing*), a press-scale, a radius or spacing value, a color, a copy string. Rebuild just that fragment, exactly.
- **Code diff**, when the change depends on the real app's DOM, data, or layout you can't reproduce. Show before/after code, not a drawn screenshot.

When unsure which case you're in, use the code diff. Honesty over spectacle.

### The surface is part of the preview

A preview is only faithful if the element sits on the **exact surface it ships on**. This is not optional for findings whose verdict depends on the surround: contrast, color, opacity, elevation, borders. Render the fragment on production's real background (the page's actual white / `--surface` / whatever it is), never on a decorative tinted stage or dot-grid.

The failure to avoid: showing muted grey text on a grey preview panel while it ships on white. The stated ratio is computed against the real background, but the eye reads it against the panel, so the number and the preview disagree and the reviewer can't judge. A contrast preview on the wrong ground is worse than a code diff.

Decorative demo stages (a tint, a grid, a checkerboard for transparency) are fine only when the surround is irrelevant to the verdict: easing, spacing, radius. The moment the finding is about how a color reads, the background is production's, exactly.

## Structure

Render a self-contained HTML artifact using whatever artifact/canvas capability the environment provides; if there is none, write a `.html` file to the project and tell the user to open it. Inline all CSS/JS; no external assets.

- **Header**: title naming the reviewed surface, a one-line scope, and live decision tallies (approved / to discuss / denied / left).
- **One card per finding**, in the lettered order of the review: id chip, severity chip (🔴/🟡), dimension tag, title, the one-line *why*, then the preview (live or diff per the rule above), then a decision bar.
- **Decision bar**: an **Approve / Discuss / Deny** segmented control; selecting Discuss or Deny reveals an optional note field. Reflect state on the card (a severity stripe, dimmed when denied) so the page is scannable.
- **Footer**: progress (`N of M decided`) and a **Copy decisions** button, disabled until at least one decision is made.

Design both light and dark, keep it responsive, and respect `prefers-reduced-motion` (do not autoplay motion; gate it behind a replay control the user triggers).

## Styling: wear the reviewed project's clothes

The artifact chrome adopts the **audited project's** design language, so a review of a given product feels native to it rather than generic. Pull from the tokens the Design System Protocol already surfaced: accent, neutrals, type family, radius, shadow, and its light/dark treatment. Match, don't invent.

Two deliberate exceptions:
- **No extractable token set** (or you can't reproduce it cleanly): fall back to a neutral, quiet chrome rather than a broken half-match. A clean neutral beats a wrong brand.
- **Review-decision signals stay fixed**: the approve / discuss / deny colors and the 🔴/🟡 severity chips are review meaning, not project branding. Keep them consistent and legible on both grounds regardless of the project. Borrowing the brand accent for "approve" would make the state ambiguous.

So: the artifact dresses like the project, except the decision affordances, which read the same everywhere.

## Copy-decisions block

The button assembles a plain-text block and copies it to the clipboard (show it in a textarea as a fallback). Pasting it back into the chat re-enters the session and drives Apply mode. Format:

```
Here are my decisions from the cami-design review. Apply the approved items
(stop on anything with visual impact), and open the discuss items with me:

- A1 [APPROVE] Dropdown opens with ease-in, feels sluggish
- A2 [DISCUSS] Primary button has no press feedback (note: only on the CTA, not every button)
- B1 [DENY] Thumbnail radius isn't concentric

Left undecided: C1
```

One line per decided finding (`id [VERB] title`, plus `(note: …)` for Discuss/Deny), then any undecided ids. When it returns, honor it as Apply-mode input: apply the APPROVEs (visual gate still holds, confirm anything user-visible), skip the DENYs, and open the DISCUSSes for conversation.

## Lifecycle

The artifact is a throwaway review surface, not a project deliverable. It must not linger in the codebase.

- **Prefer the hosted artifact capability** when the environment has one; it lives outside the project and pollutes nothing.
- **Only fall back to a file** when there's no such capability, and then write it to a disposable location (system temp, or a gitignored `.cami-review/`), never into tracked source, and never commit it.
- **Clean up when done.** Once the user has pasted their decisions back and Apply mode has run, delete the file and say you did. Keep it only if the user asks.

## Attribution

Interactive approval-artifact flow adapted from a public pattern by @kylezantos (skill-chaining plus an approve/deny/discuss review artifact). The review content and the honesty constraint on previews are this skill's own.
