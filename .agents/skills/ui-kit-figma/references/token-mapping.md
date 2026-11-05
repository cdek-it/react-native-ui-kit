# Token Mapping

- Treat Figma variable bindings as the source of token intent. Resolved pixels
  and colors are inspection data, not values to copy into source.
- Use `design-tokens/input/tokens.json` as the latest designer export and
  `src/theme/tokens/**` as generated output. Follow `AGENTS.md` for explicit
  confirmation before changing token values or regenerating output; ordinary
  synchronization does not grant that approval.
- Reuse existing runtime theme paths; do not hardcode resolved values when a
  matching local token exists.
- Prefer a component token when Figma explicitly binds that property to a
  component variable. Use a semantic token when the intent is semantic or no
  component binding exists.
- If an exact value has no matching token, report the gap and the part that
  cannot be matched with current tokens. Do not hardcode it, silently substitute
  an approximate token, or change token data without the required confirmation.
- Apply severity, size, state, and theme bindings to every affected layer: text,
  background, border, icon, and shape, not only the outer container.
