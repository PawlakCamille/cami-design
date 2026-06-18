# State & Data Flow

Deep reference for state, effects, async, and data fetching. Loaded by `cami-design-engineer` when the diff touches `useState`, `useEffect`, async work, or shared data.

## Async in `useEffect` Without Cleanup

A fetch that fires, then the component unmounts before it resolves. Use `AbortController` for fetch, or an `ignore` flag for other async work, and return a cleanup function.

## API Call on Every Keystroke

Search inputs, filters, anything user-typed that triggers a request. Add a debounce (~300ms is the common default).

## State Only Read Inside Callbacks But Subscribed at Render

Causes re-renders the component doesn't need. Read the value via a ref or move the read inside the callback.

## Object or Array Dependencies in Effects

Triggers the effect on every render because the reference is new. Depend on primitive fields (`user.id`, not `user`), or memoize the object.

## Derived State Stored as State

A value that can be computed from existing state, kept in a separate `useState`. Compute it inline; don't double-track.

## Race Conditions on Rapid Input

Two requests fired in close succession, the slower one wins and overwrites the faster. Track the latest request id, or abort the previous one.

## Stale State in `setState`

`setCount(count + 1)` reads a stale `count` if multiple updates fire close together. Use the function form `setCount(prev => prev + 1)` whenever the new value depends on the previous.

## `.sort()` on React State

`.sort()` mutates the source array, so the state changes silently and React doesn't re-render. Use `[...arr].sort()` or `arr.toSorted()`. Same trap with `.reverse()` and `.splice()`.

## Independent Requests Fired Sequentially

Two `await`s in a row that don't depend on each other run one after the other. Wrap in `Promise.all([...])` so they run in parallel.

## Same Endpoint Fetched Independently in Multiple Components

Each component fires its own request for the same data. Use a request library that dedupes by key (React Query, SWR), or lift the fetch into a shared parent.

## Non-default React Query Options Without a Why

An override of `staleTime`, `gcTime`, or `refetch*` with no comment defending it. Default-first: a continuously mounted hook rarely remounts, and `refetchOnWindowFocus` already covers the multi-device case, so `staleTime: 0` is usually correct. If the override is real, a one-line comment must name the scenario it solves; otherwise it reads as a magic number a reviewer will question.

## localStorage Cache Over Backend-Canonical Data

A hook persists user-facing state to localStorage while also fetching the same data from the backend. Three questions: is there a pre-server user base whose values need migrating; is offline-first a product requirement; is the cold-load flicker actually disruptive. Three "no"s and you drop localStorage entirely. The flicker is usually invisible, but the seed/mirror/migration roles and their races (seed-vs-server, mirror clobbering) are always real. If one role is genuinely justified, keep that one and document it.

## Mutating Props Inside a Component

`user.lastViewed = new Date()` inside a component modifies data the parent owns — bugs propagate sideways and React doesn't see the change. Treat props as read-only. If something must change, notify the parent via a callback (`onView(user.id)`) and let it update its own state.

## State Moved Between Owners

A piece of state changed hands — local → URL, local → context, child → parent. Every consumer that assumed the old owner is now reasoning about a stale contract: a `to: '.'` route that relied on a local `view` flag, an effect keyed on a prop that's now derived from search params. The move itself is usually correct; the un-updated consumers are the bug. Re-audit all of them.

## Re-renders Cascade When Only One Field Changed

A list item updates one field (status, title, assignee) and the entire list re-renders, or the entire row re-renders when only one cell's data changed. Symptom: typing in a row's title input feels laggy on a long list; toggling one issue's status visibly stutters siblings.

Root cause is usually one of:

- A single `useState` holding a list of objects; updating one item replaces the whole array reference, invalidating every consumer
- A context provider passing a fresh object identity on every render, re-rendering every subscriber
- A parent component reading state that belongs further down the tree, forcing children to re-render when only the parent's sibling changed

The fix isn't `memo` — it's putting the state at the right granularity. Split the array into per-item observables (Zustand/Jotai/Valtio atoms, MobX observable per field, or one `useState` per row when the list is the right shape for it). A change in one field should re-render exactly the components that read that field, no more.

Pairs with the memo-related findings in `perf.md` — those are about *defending* against over-rendering once the shape is set; this is about choosing the shape so the defense isn't needed.

## Attribution

Synthesized from Vercel Labs `react-best-practices`, with stale-state and sort traps from Anthropic React docs, and brotzky/performance-skills (one-delta-one-cell granularity).
