# Security Spot-Check

Deep reference for the security pass in `cami-design-engineer`. Loaded when the diff touches rendered HTML, external links, browser APIs, or logging.

Not a full security audit — that's a specialist's job. This is the short checklist a receiving tech team expects to have been run. Most passes return clean; the value is that the question was asked. Six checks:

## HTML Injection

A new `dangerouslySetInnerHTML`, `innerHTML` assignment, or framework equivalent — especially fed by user input, i18n strings, or API content. Flag it; the content needs sanitizing or the API needs to be a plain string.

## User-Controlled URL in `href` or `src`

An `href`, `src`, or `window.open` target built from user input or API content. A `javascript:` URL executes on click — the XSS vector that `dangerouslySetInnerHTML` scanning misses. Allowlist protocols (`http:`, `https:`, `mailto:`) or sanitize; never interpolate raw input into a URL attribute.

## Secrets in the Client Bundle

A server credential exposed through a client-visible env prefix (`NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`) or hardcoded in shipped code — service-role keys, admin tokens, any non-anon API key. Everything behind these prefixes ships to every browser. The most common prototype leak; check every new env read in the diff. Public-by-design keys (analytics IDs, map keys with referrer locks, Supabase anon keys) are fine.

## External Link Missing `rel`

`target="_blank"` without `rel="noopener noreferrer"`. Evergreen browsers have implied `noopener` on `target="_blank"` since ~2021, so the live risks are legacy browsers and referrer leakage (`noreferrer`). Still add the `rel` — it's free — but calibrate: 🟡 in an evergreen-only project, not 🔴. When the URL is user-controlled, the URL check above is the important finding.

## Browser API Scope

New use of clipboard, file, camera, microphone, or geolocation APIs. Confirm the scope is the minimum the feature needs and that it's gated behind explicit user action, not fired on mount.

## Leaked Values

Tokens, signed URLs, PII, or secrets that get logged (`console.log`), persisted (`localStorage`, a cache with a long TTL), or sent somewhere they shouldn't be. Flag the value and the sink.

## Attribution

Synthesized from the Anthropic Code Review security pass and OWASP front-end basics.
