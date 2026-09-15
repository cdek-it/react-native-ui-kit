---
name: ui-kit-figma
description: >
  Implement or sync React Native Prime UI Kit components from Figma
  specifications. Use when a Figma node is provided, or when component variants,
  local theme-token bindings, documentation links, or Storybook states must be
  aligned with Figma. This is read-only toward Figma.
---

# UI Kit Figma

Translate Figma component specifications into this repository's public API,
Unistyles implementation, local tokens, tests, and Storybook conventions. Use
the Figma design-to-code skill for tool workflow and `ui-kit-testing` when tests
change.

## Workflow

1. Inspect the component source, public types and barrels, nearest tests and
   stories, and relevant files under `src/theme/tokens`.
2. Call Figma design context on the exact component or variant frame. If a page
   or section returns sparse context, use metadata only to locate the inner
   frame, then call design context on that frame.
3. Read variable definitions for the target frame and map each relevant Figma
   variable to the existing runtime theme path.
4. Implement the smallest compatible source change, following the nearest
   component pattern and root `AGENTS.md`.
5. Update focused behavioral tests and representative Storybook scenarios when
   the public contract or material variants change.
6. Update the component documentation link when its exact Figma frame is known.
7. Run the verification required by root `AGENTS.md`.

## Token Mapping

- Treat Figma variable bindings as the source of token intent. Treat resolved
  pixel and color values as inspection data, not values to copy into source.
- Treat `design-tokens/input/tokens.json` as the latest immutable export from
  the designer. Never edit it during component or Figma synchronization work.
- Treat `src/theme/tokens/**` as immutable generated output. Never edit or
  regenerate these files during component or Figma synchronization work.
- Reuse tokens from `src/theme/tokens`; do not hardcode a resolved value when a
  matching local token exists.
- Prefer a component token when Figma explicitly binds the property to that
  component variable. Use a semantic token only when the design intent is
  semantic or no component binding exists.
- If an exact Figma value has no matching existing token, do not hardcode it,
  change token files, or silently substitute an approximate token. Report the
  gap and explain which part cannot be matched exactly with the current tokens.
- Apply severity, size, state, and theme bindings to every affected layer, not
  only the outer container. Check text, background, border, icon, and shape
  tokens independently.

## Documentation Links

- Link a component to its exact Figma component or variant frame, not merely the
  file, page, or broad section containing it.
- In a bulk link update, inventory the component documentation first. Update
  only confidently matched frames and keep unresolved components explicit.
- Before a requested commit, report updated links first and unresolved links
  second. Commit only when the user explicitly asks.

## Storybook

- Model independently meaningful usage scenarios and interactions. Use controls
  for simple variant axes that do not need dedicated documentation.
- Create separate stories or a composed comparison only when the scenario or
  comparison itself adds documentation value. Do not impose a fixed number or
  layout of stories per component.
- Keep every story's props valid for discriminated unions. Do not expose a
  control that can create an invalid prop combination.
- Hide non-editable or internally composed props with
  `parameters.controls.exclude`. Do not use `control: false` with React Native
  on-device controls because it renders as `Invalid type`.
- Prefer `.tsx` when a story needs JSX composition. If an existing `.ts` file
  must remain `.ts`, use `createElement` and construct typed discriminated props
  before passing them to the component.

## Tests

Use `ui-kit-testing`. Assert rendered data, interaction logic, callbacks,
controlled behavior, accessibility, and public contracts. Do not assert exact
theme-token values, dimensions, colors, or style objects to prove a Figma
mapping.
