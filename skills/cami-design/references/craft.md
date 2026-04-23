# Craft — The Philosophy

Why the details matter. Loaded when you need to re-center on intent.

## Taste Is Trained, Not Innate

Good taste isn't personal preference. It's a trained instinct: the ability to see past the obvious and recognize what elevates. You develop it by surrounding yourself with great work, thinking about why something feels good, and practicing relentlessly.

When building, don't just make it work. Study why the best interfaces feel the way they do. Reverse engineer animations. Inspect interactions. Be curious.

## Unseen Details Compound

Most details users never consciously notice. That's the point. When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought. That's the goal.

> "All those unseen details combine to produce something that's just stunning, like a thousand barely audible voices all singing in tune." — Paul Graham

Every design decision exists because the aggregate of invisible correctness creates interfaces people love without knowing why.

## Beauty Is Leverage

People choose tools based on the overall experience, not just functionality. Good defaults and good animations are real differentiators. Beauty is underutilized in software. Use it as leverage to stand out.

## Intent Over Intensity

Bold maximalism and refined minimalism both work. What fails is the middle — the timid, generic default that tries to offend no one and excites no one.

Commit. Pick a direction. Execute it with precision.

## Reversibility

Prefer reversible choices. A subtle refinement that works beats a bold swing that misses. The less reversible the decision, the higher the bar for boldness.

## Perceived Performance Is Real Performance

Speed in design is not just about actual speed — it's about how fast things *feel*. A fast-spinning spinner makes loading feel faster even when load time is identical. A 180ms animation feels more responsive than a 400ms one. `ease-out` at 200ms feels faster than `ease-in` at 200ms because the user sees immediate movement.

The perception of speed matters as much as the measurement. Design for both.

## Cohesion Over Individual Decisions

Every individual decision can be correct and the result can still feel off — if the decisions don't align on a shared vibe. Easing, duration, type weight, color temperature, border radius, copy tone — they should all pull in the same direction.

Ask: do all these choices feel like they came from the same hand? If the animations feel snappy but the typography feels leisurely, something is out of tune.

## Good Defaults Beat Options

Most users never customize. Ship beautiful out of the box. The default state — default easing, default spacing, default copy — is what 90% of people experience 100% of the time. Make the default excellent before adding configurability.

## Visual Difference ≠ Inconsistency

Before flagging something as inconsistent, ask: does this visual difference encode a semantic difference? Two controls that look different because they *do* different things should stay different. Forcing visual parity across semantically distinct elements erases meaningful signal.

Common false positives: toggle vs. tab selector, upload button vs. outline CTA, destructive icon vs. neutral icon in the same row. Check function before flagging form.

## Review Culture

Be ruthless in review, kind in delivery. A design review that doesn't find anything is a review that wasn't trying. A design review that attacks the person isn't a review, it's a vent.

**Review your work the next day.** You notice imperfections with fresh eyes that were invisible during development. Play animations in slow motion. Step through states you skipped. The gap between "done" and "right" is almost always visible the morning after.

## Attribution

Synthesized from: emilkowalski/skill (core philosophy), pbakaus/impeccable (craft.md), Paul Graham essays.
