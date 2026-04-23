# Forms

Deep reference for form markup, input behavior, and submission flows. Loaded on demand when the review target contains form controls.

## Input Attributes

- **`autocomplete` + meaningful `name`** on every input. Enables browser autofill; missing these is the #1 reason autofill silently fails for users.
- **Correct `type` + `inputmode`:**
  - `type="email"` — email validation + `@` key on mobile keyboards
  - `type="tel"` — numeric keypad on mobile
  - `type="url"` — URL validation
  - `type="number"` paired with `inputmode="numeric"` — numeric keypad without losing input semantics
- **`spellcheck="false"`** on emails, usernames, codes, tokens, passwords. Wavy underlines on these read as "this is wrong" and confuse users.
- **`autocomplete="off"`** on fields that look like they could be passwords but aren't (search fields accidentally named "password", OTP inputs, API key inputs). Prevents password-manager autofill noise. Use `autocomplete="one-time-code"` for OTP specifically.

## Don't Block Paste

Never `onPaste={e => e.preventDefault()}`. Users paste passwords from managers, confirmation codes from SMS, IDs from other tabs. Blocking paste breaks accessibility and rarely prevents the "security" concern it's meant for.

## Labels

- Every control needs a `<label>` or `aria-label`. Not a placeholder, not a visually-adjacent `<span>`.
- Clicking the label must focus the control:
  - `<label htmlFor="email">Email</label><input id="email" />`
  - or `<label>Email<input /></label>` (wrapping)
- **Checkboxes and radios:** the label and control share one hit target, not just visually adjacent. Clicking anywhere on the row toggles the input. No dead zones between the box and its text.

## Submit Behavior

- **Don't pre-disable submit** based on validation state. Let the user click — show errors inline. Pre-disabling leaves users guessing what's wrong.
- **Disable during the in-flight request.** Once submit fires, disable the button, show a spinner, keep the original label. Re-enable on success or error.
- Include an idempotency key when the same request could fire twice.

## Errors

- Inline, next to the field that failed. Not at the top of the form, not as a toast.
- **On submit, focus the first error field automatically** so keyboard and screen-reader users land where the fix is needed.

## Placeholders

Placeholders are not labels. They disappear the moment the user types.

- Use a placeholder to show an **example or pattern**, not to describe the field.
  - ✗ `placeholder="Email"` (that's the label's job)
  - ✓ `placeholder="name@company.com"`
- Placeholders indicating a pattern end with `…`: `placeholder="sk-012345679…"`
- **Don't default to "e.g. …" prefix.** It's wordy and clinical in most product contexts. A raw example (`name@company.com`, not `e.g. name@company.com`) reads faster and matches the product's voice better. Use "e.g." only when the field genuinely needs to clarify that multiple valid formats exist.

## Unsaved Changes

Warn before navigation when the user has unsaved data.

- Router guard (framework-specific) for in-app navigation
- `beforeunload` event for full page navigations and tab close
- Keep the warning specific: *"Leave this page? Your changes haven't been saved."* Not generic *"Are you sure?"*

## Attribution

Synthesized from Vercel Labs `web-interface-guidelines` (Forms section).
