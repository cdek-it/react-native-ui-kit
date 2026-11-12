# Test Authoring

Assert public rendered data, presence or absence, callbacks, refs, hook results,
controlled behavior, accessibility, and type contracts. Do not assert static
colors, dimensions, theme-token values, or style objects to prove appearance.
Time-dependent animated-style checks follow `references/timers-and-async.md`.

## Placement And Helpers

Place component tests in `src/components/<Component>/__tests__/`. Keep helpers
local until more than one suite shares the setup. Create the smallest useful
render helper and add only providers required by the subject or behavior.

When extending a component, run its existing focused tests first. Choose new
cases from agreed requirements and consumer documentation; use implementation to
exercise that contract without inventing additional guarantees. Remove obsolete
cases for intentionally removed behavior, while preserving coverage for
still-public legacy contracts in scope.

When both are tested, put ordinary behavior in `<Component>.test.tsx` and
accessibility in `<Component>.accessibility.test.tsx`. Repeat an interaction in
the accessibility suite only to prove a distinct accessibility contract, without
duplicating ordinary assertions. Use a separate `.timers.test.tsx` or
`.animation.test.tsx` when that behavior needs its own setup.

Put default callbacks as `jest.fn()` inside the helper. Create named mocks only
inside tests that assert them.

## Names, Selectors, And Interactions

Name `describe` after the public component or hook. Write Russian test names as
behavior plus condition. Avoid generic, numbered, or implementation-only names.
Give every `test.each` case a readable `name` and include `$name` in the title.

Prefer selectors in this order: role or accessible name, visible text or label,
then `testID`. Reserve `testID` for layout, animation infrastructure, or an
element without a practical user-visible selector. Follow the root `AGENTS.md`
for `testID` format and migration.

Use `userEvent` for modeled user actions and `fireEvent` for native events such
as `layout`. Assert observable behavior, not internal hook state.

## Controlled Props And Public Types

For a controlled prop, assert that interaction emits the callback without
changing the UI. Rerender with the new prop before asserting the updated state.

Keep compile-time assertions out of Jest. Use `@ts-expect-error` only in a
dedicated CI type-test setup; otherwise validate public declarations through the
normal build. Use that build for declaration and token-access checks; it does
not execute compile-time examples placed in excluded Jest files.

## Snapshots

Do not add or update snapshots for component appearance, structure, styles, or
theme-token values. When a change invalidates a visual snapshot, replace it with
explicit assertions for rendered data, presence or absence, interaction,
controlled state, callbacks, or accessibility. Use a snapshot only when the user
explicitly requests one and the contract cannot be stated more clearly with
behavioral assertions.
