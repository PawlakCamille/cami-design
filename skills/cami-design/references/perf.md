# Performance & Rendering

Deep reference for React rendering performance. Loaded by `cami-design-engineer` when the diff touches lists, memoization, animation, or heavy state.

## Array Index Used as React `key`

Causes wrong items to update when the list reorders, filters, or has insertions. Use a stable id from the data.

## Static JSX or Constants Created Inside the Component Body

A constant array, an inline `<svg>` recreated on every render. Hoist outside the component.

## Heavy Component Loaded Eagerly

A chart library, a rich-text editor, a markdown renderer always in the bundle even when the feature isn't used. Lazy-load with `lazy()` / `dynamic()`.

## Barrel Imports Pulling in More Than Needed

`import { Button } from '@/components/ui'` where the barrel re-exports 30 components. Import directly when bundle size matters.

## Missing `memo` on a Component Inside a Hot List

Only flag if the list is large *and* the component receives stable props. Don't memoize speculatively — premature `memo` adds noise.

## Inline Function or Object Passed to a Memoized Component

`<MemoCard onClick={() => handle(id)} style={{ padding: 16 }} />` — the inline value is a new reference on every render, silently defeating `memo`. Extract stable callbacks with `useCallback` and objects with `useMemo` at the call site.

## Default Prop Value `{}` or `[]` on a Memoized Component

`function Card({ items = [] })` creates a new array reference on every render. Pull the default outside the component: `const EMPTY: Item[] = []` and use that.

## `useMemo` Wrapping a Trivially Cheap Expression

`useMemo(() => items.length, [items])` — the overhead of `useMemo` itself is higher than the computation. Only memoize when the expression is measurably expensive or produces a referentially stable object that feeds another hook.

## `{value && <Component />}` Where `value` Can Be `0` or `''`

React renders the falsy value instead of skipping. Use a ternary: `{value ? <Component /> : null}`.

## Animation Applied to the `<svg>` Element

Animating the SVG itself is expensive; animate a wrapper `<div>` or use CSS `transform` on the wrapper.

## Animation on a Non-Composited Property

CSS properties fall into three tiers. Only the first runs on the compositor; the others cost main-thread work per frame.

| Tier | Properties | Cost per frame |
| --- | --- | --- |
| Composited | `transform`, `opacity`, `filter` | GPU, off main thread |
| Paint-triggering | `color`, `background-color`, `border-color`, `box-shadow`, `fill` | Repaint, no layout |
| Layout-triggering | `width`, `height`, `top`, `left`, `margin`, `padding`, `inset` | Reflow every subsequent element |

Flag when an animation or transition targets a property below the top tier and a composited equivalent exists. Concrete substitutions:

- `width` / `height` → `transform: scaleX/Y` with `transform-origin`, or FLIP for layout-shaped motion (see `motion.md` → *FLIP*)
- `top` / `left` / `margin` → `transform: translate`
- Framer Motion `animate={{ width, height, padding, margin }}` → `animate={{ scaleX, scaleY }}` or restructure
- `transition: all` → enumerate the composited properties (`transition-property: transform, opacity`)

Paint-tier animations (background-color hover) are acceptable for low-frequency interactive states; flag them only when applied to many simultaneous elements (large lists, scroll-linked).

## Nondeterministic Value in Render Body Causing Hydration Mismatch

`new Date()`, `Math.random()`, `crypto.randomUUID()`, `performance.now()` in the component body produce different values on server and client. Move them into `useEffect`, `useState` initializer, or a server-only context.

## Expensive Computation in `useState` Initial Value

`useState(buildBigList())` runs `buildBigList()` on every render even though only the first call matters. Pass a function: `useState(() => buildBigList())`.

## Heavy State Update Blocking the Input

Filtering a 10k-row list on every keystroke freezes the field. Wrap the heavy update in `startTransition(() => setFiltered(...))` so React keeps typing responsive and updates the list when it can.

## `setState` Inside a High-Frequency Handler

`setState` called directly in `scroll`, `mousemove`, or `wheel` handlers queues a synchronous re-render on every event tick — typically 60–120 times per second. Wrap in `startTransition` for non-urgent updates, or use `useDeferredValue` when the derived value drives a heavy subtree.

## Same Global Listener Attached in Many Components

Multiple components each call `window.addEventListener('scroll' / 'resize' / 'keydown')`. Memory leak risk and duplicated work. Centralize in one custom hook with subscriber callbacks, or attach once at the app root.

## `.includes()` or `.find()` on a Large Array in a Hot Loop

O(n) lookup repeated for every item is O(n²). Build a `Set` (membership) or `Map` (key→value) once, then look up in O(1).

## Skeleton Sized Differently From Its Content

A `Skeleton` or placeholder sits in the same render path as the real content, but its size or radius doesn't match the component that replaces it — `Skeleton size-8 rounded-xl` swapped for `Avatar size="md"`. The mismatch produces a layout shift the moment content loads. Match the skeleton's dimensions and shape to the eventual component's tokens.

## Empty-String Fallback on a DOM Attribute

`<img src={url ?? ''} />` — an empty `src` makes the browser re-request the current page URL and log an error; an empty `href` or `action` carries similar footguns. Return `undefined` and render the attribute (or the whole element) conditionally, instead of falling back to `''`.

## Attribution

Synthesized from Vercel Labs `react-best-practices`, MDN, Anthropic React docs, and brotzky/performance-skills (composited-property tiers).
