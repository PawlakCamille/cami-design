# Design System Fidelity (Code)

Deep reference for code-level design-system adherence. Loaded by `cami-design-engineer` when the diff introduces or modifies styled components.

Pairs with the **Design System Protocol** in `review-protocol.md` (the principle "check for tokens before suggesting any value") — this file lists the concrete code-level violations to flag.

## Hardcoded Values Where a Token Exists

`bg-[#xxx]`, `text-[14px]`, `gap-[13px]`, inline `style={{ color: '...' }}`. Replace with the matching token (`bg-primary-100`, `text-body-13`, `gap-3`).

## DS Component Next to a Hand-Rolled Equivalent

A DS `Button` and a raw `<button>` in the same view. Pick the DS one.

## DS Primitives Imported From the Wrong Path

Import from the project's canonical entry (e.g. `@/components/ui`), not a legacy folder or a component's internal file. The canonical path is whatever the project's own convention says — found in Preparation, not assumed.

## New Token Introduced Inline

A one-off color or spacing value used in code that isn't in the DS. Flag as a gap to add to the DS file rather than hardcoding.

## `cn()` Overrides on a DS Variant

Conditional classes that fight the DS defaults. Use the variant prop the DS already exposes.

## `!important` in New CSS

Almost always a specificity escape hatch covering a conflict with the design system's own rules. Resolve the specificity properly — refactor the selector, fix the cascade order, or use the DS variant prop — rather than nailing the override in place. Rare legitimate uses (utility classes, third-party overrides) should carry a comment with the reason.

## Generic Tailwind Utilities Where the Project Has a Typed Scale

`font-bold`, `text-sm` on a project that defines `text-body-13`, `text-heading-24`. Use the typed scale.

## Spec Doc Drift After an API Change

The diff changed a component's public API — a prop removed, made optional, renamed, a signature changed — but `DESIGN.md` (or `docs/`, `README.md`) still describes the old shape. Grep the spec for the component name and update it in the same pass. A stale source-of-truth doc quietly undoes the API improvement.

## Attribution

Synthesized from common DS-fidelity review patterns. Pairs with the parent skill's **Design System Protocol**.
