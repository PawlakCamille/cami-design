# Composition Patterns

Deep reference for component composition. Loaded by `cami-design-engineer` when the diff touches component shape, prop surface, or state location.

## Boolean Prop Sprawl

Three or more on/off flags on a single component (`isLarge`, `isOutlined`, `hasIcon`, `isLoading`). Replace with an explicit `variant` prop, or split into composable sub-parts using the compound pattern: `<Tabs><Tabs.List><Tabs.Trigger /></Tabs.List></Tabs>`.

The fix scales — variants and sub-parts encode orthogonal concerns separately; booleans collapse them and force every new state into a flag.

## Render Props Where `children` Would Do

A function-as-prop that returns JSX (`renderItem`, `renderHeader`). Pass children directly unless the parent must control the loop (virtualization, recursion, slot ordering).

## `forwardRef` in React 19+ Code

React 19 makes `ref` a normal prop, so the wrapper is no longer needed. Drop the `forwardRef(...)` call. Check `package.json` to confirm React version before flagging.

## Fetch and Render in the Same File

Data-loading and presentation tangled together: hard to test, hard to reuse. Split into a container that fetches and a pure component that displays.

## Same JSX Shape in 3+ Files

Extract to a shared component. Two occurrences? Leave it — premature abstraction is worse than duplication.

## Two Components in One File, One Past ~100 Lines

A file defines two or more components and any of them is over ~100 lines. Extract the large one to a sibling file: one component per file, its `Props` type colocated, and the helpers only it uses moving with it. Shared helpers (used by the parent too) go to a `lib/` neighbor, not re-exported through the child. Prefer flat siblings over a nested directory unless the project already nests.

## Conditional Lookup Duplicated Across Call Sites

The same `condition ? a : b` over a helper's return value — most often `condition ? t(keyA) : t(keyB)` — repeats at 3+ call sites. The branch belongs inside the helper; call sites should be a single call returning the resolved value, not a ternary over two outcomes.

Same 3-occurrence threshold as the JSX-shape rule above. The duplication is decision shape rather than markup shape.

## State Scattered Across Siblings

Two sibling components both manage a piece of the same UI state via prop drilling or duplicated `useState`. Lift the state into a parent provider; children read it via context.

## Children Know How State Is Stored

A compound component where `<Tabs.Trigger>` imports a Zustand store directly or references `useReducer`. The provider should expose a stable interface (`{ state, actions }`); children only consume it.

## Context Exposes Raw Setters Instead of Intent

Context value with `setActiveTab`, `setOpen`, `setValue` instead of `select`, `toggle`, `change`. Refactor to a `{ state, actions, meta }` shape so the provider can be swapped for testing or a different state lib without rewriting consumers.

## `useContext` in React 19 Code

`useContext(Ctx)` still works, but React 19's `use(Ctx)` is the current idiom — it reads context inside conditionals and loops without a rules-of-hooks violation. Prefer `use()` for new context reads in a React 19 codebase.

## A Primitive Owning a Consumer's Concern

A low-level or presentational component reaching into `localStorage`, analytics, routing, or another side-effecting concern the consumer should own — a collapsible-panel primitive that persists its own open/closed state. The primitive should take state and callbacks as props and stay pure; persistence and side effects belong to the feature that mounts it. Otherwise every consumer inherits a behavior it didn't ask for and can't opt out of.

## Conditional Render That Unmounts Children

`{open && <Panel>{children}</Panel>}` fully unmounts the subtree when `open` is false — any child with internal state (an input, a controlled field, scroll position, a running animation) loses it on every toggle. For a reusable component, keep children mounted and hide with `hidden` / `display: none`, so consumers can place stateful content inside without surprise.

## Attribution

Synthesized from Vercel Labs `composition-patterns` skill, with React 19 specifics from Anthropic React docs.
