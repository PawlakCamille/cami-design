# Copy Patterns

Deep reference for the concrete copy patterns used across the product. Loaded by `cami-design-copy` for before/after tables, principle checklists, and the NEVER list.

## Error Messages

| Avoid | Prefer |
| --- | --- |
| "Something went wrong." | "We couldn't save your changes. Try again, or refresh the page." |
| "Invalid input." | "Email needs an `@` and a domain." |
| "Error 500." | "Our server had a hiccup. We've been notified — try again in a moment." |
| "Failed to save." | "Couldn't save — try again in a moment." |
| "Failed to remove user." | "Couldn't remove this member — try again in a moment." |

**Pattern:** "Failed to…" → "Couldn't…" + next step. Shorter, warmer, always followed by what to do.

## Empty States

| Avoid | Prefer |
| --- | --- |
| "No results." | "Nothing matches *"[query]"*. Try broader terms or clear filters." |
| "No items yet." | "Start by adding your first [item]. [+ button]" |

## CTAs

| Avoid | Prefer |
| --- | --- |
| "Submit" | "Send message" / "Create account" / "Pay $49" |
| "Cancel" + "OK" on destructive modal | "Keep [item]" + "Delete permanently" |

## The 6 Principles

Every piece of copy should pass this checklist:

1. **Specific** — "Enter email" not "Enter value"
2. **Concise** — cut every word that doesn't add meaning (but never sacrifice clarity for brevity)
3. **Active** — "Save changes" not "Changes will be saved"
4. **Human** — "We couldn't save your changes" not "System error encountered" (warm *and* specific; avoid the vague "Oops, something went wrong", which `anti-patterns.md` bans)
5. **Helpful** — tell users what to do, not just what happened
6. **Consistent** — pick one term per concept and never vary it (don't alternate between "workspace" and "project" for variety)

## NEVER

- Use jargon without explanation
- Blame the user ("You made an error" → "This field is required")
- Be vague ("Something went wrong" without explanation or next step)
- Use passive voice when active is possible
- Use placeholder text as the only label — it disappears when the user types
- Vary terminology across the product for stylistic variety — consistency beats cleverness
- Write AI-slop copy (generic loading messages, trailing "successfully", sparkle CTAs, etc.) — see `anti-patterns.md` → *Copy AI Tells*
- Use humor during errors — be empathetic instead
- Assume technical knowledge
