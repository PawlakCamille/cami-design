---
name: cami-design-layout
description: Spacing, alignment, hierarchy, rhythm. Use when something looks crowded, unbalanced, or just doesn't sit right.
version: 0.1.0
user-invocable: true
argument-hint: "[target]"
---

## MANDATORY PREPARATION

Invoke `cami-design` — it contains the shared principles, references, and **Context Gathering Protocol**. Follow the protocol before proceeding.

---

Compose layouts that feel intentional: clear hierarchy, consistent spacing, optical alignment, harmonious proportions.

## When to Use This Mode

- "Something feels off" about spacing or alignment
- Grids feel monotonous or misaligned
- Visual hierarchy is unclear (no primary action, competing elements)
- Elements don't snap to a scale — random 13px gaps, mixed units
- Nested rounded surfaces look wrong
- Need to bring a feature back in line with the design system

## Preparation

1. Identify the spacing scale in use (Tailwind default, custom tokens, etc.).
2. Identify the typographic scale and line-height conventions.
3. Note the grid / breakpoints.
4. Read `../cami-design/references/spacing-layout.md` for the deep material.

## Review Dimensions

Work through these systematically. For each, use the `Before | After | Why` table format.

### Spacing & Rhythm
- All gaps use the scale — no arbitrary values
- Consistent rhythm between repeated elements
- Negative space is intentional, not leftover

### Alignment
- Pixel-perfect to grid
- Optical alignment over geometric where visual weight differs (icons, play triangles, asymmetric shapes)
- Elements on the same axis share a baseline

### Sizing & Proportions
- Components sized to their role in the hierarchy
- Touch targets ≥ 40×40px
- Line length capped at 65-75ch for body text
- Density should match content type: data-dense UIs need tight spacing, content-heavy views need more air. Don't apply the same scale to both.

### Hierarchy
- ONE primary action per view
- Typographic hierarchy uses contrast, not just size (weight, color, spacing)
- Scannable: a user should see the most important element first
- **Squint test**: blur your eyes — can you still identify the primary element, secondary, and clear groupings? If not, hierarchy isn't working.

### Concentric Radius
- Outer radius = inner radius + padding
- Mismatched nested radii is the #1 "feels off" tell

### Composition
- Don't default to card grids for everything — spacing and alignment create visual grouping naturally
- Use cards only when content is truly distinct and actionable
- Never nest cards inside cards — use spacing and dividers for hierarchy within
- Vary card sizes or mix cards with non-card content to break monotonous repetition

### Responsive Consistency
- Spacing, alignment, and hierarchy hold across breakpoints
- No awkward mid-breakpoint states

## Output

Present findings grouped by dimension, each as a `Before | After | Why` table. Omit dimensions that had no issues.

## References

- `../cami-design/references/spacing-layout.md`
- `../cami-design/references/typography.md` (for vertical rhythm, line-height)
- `../cami-design/references/accessibility.md` (for hit areas, contrast)
