# Component Contract

## Actual Public Boundary

- Trace implementation, props/unions, component barrels, root exports, and
  package subpaths. An internal export is not automatically public.
- Inspect relevant callers, native props/events, refs, docs, stories, and tests.
  Keep the inventory local to affected aspects rather than auditing the kit.
- Use neighboring components as analogues, not authority to copy unrelated
  props, defaults, icons, or accessibility policies.

## Target And Migration

Record changed names/types/defaults, valid prop combinations, value ownership,
callback payloads, native boundaries, ref target/binding, and accessibility. For
each affected aspect, identify its current and target contract, consumers, and
how the change will be verified; unchanged aspects need no repeated table.

- Preserve existing compatibility unless its removal is part of the agreed
  scope. For an approved transition, name retained props/exports and precedence
  at the public boundary; do not invent a removal version.
- Preserve explicit `false`, `0`, and empty strings where supported; resolve
  fallback precedence through definedness rather than truthiness.
- Change consumers only within authorized repositories and paths. Disclose
  unavailable consumers rather than claiming their migration is complete.
- Reuse the closest wrapper/core/controller/style pattern. Separate `types.ts`,
  `deprecated/`, `memo`, new primitives, and generic resolvers are not
  mandatory.

## State, Events, And Refs

- Controlled interactions emit callbacks and wait for new props. Preserve an
  existing uncontrolled path without making uncontrolled support mandatory.
- Keep domain callbacks distinct from native events. Preserve accepted native
  payloads; do not promise forwarding of excluded component-owned props.
- Verify ref target, methods, and supported object/callback binding. Renaming a
  public prop to `ref` does not itself rename a renderer's `inputRef` argument.
- Respect actual ownership of native/accessibility state. Preserve unrelated
  fields without letting native props contradict component-owned state.

## Accessibility And Composition

Identify the accessible node, name, role, state, hint, and decorative children.
Check duplicate announcements and distinguish a standalone element from one
inside an interactive parent. Visible labels, captions, badge values, and icons
do not automatically establish accessible names or hints.

Follow the agreed component policy for grouping and caption/hint behavior. Keep
recommendations advisory and document consumer reminders according to
`AGENTS.md`; do not strengthen optional props without an agreed requirement.

## Evidence And Delivery

- Select meaningful tests of changed contracts: transitions, state ownership,
  callbacks, disabled/loading, composition, refs, and native boundaries as
  applicable. Reuse `ui-kit-testing`; test-count growth is not a requirement.
- Demonstrations must actually update controlled props and adapt story-only
  controls or external adapters outside the runtime API.
- Update affected component Markdown and public JSDoc in the same implementation
  task. Update an existing family document when it already owns the component
  rather than creating a duplicate. Use `ui-kit-component-docs` for format.
- Token-value changes and regeneration require the confirmation in `AGENTS.md`.
  Token JSON and Jest alone do not establish observed device geometry.
- In read-only review, propose remedies without edits, formatting, generation,
  or a mutating build. Report only checks actually exercised and state sampling
  and unavailable evidence.
