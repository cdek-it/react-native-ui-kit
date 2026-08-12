# Test Authoring

Read this reference when creating or changing test cases, render helpers,
selectors, accessibility assertions, snapshots, public types, or test names.

## Placement And Helpers

Place component tests in `src/components/<Component>/__tests__/`. Keep helpers
local until more than one suite shares the setup. Create the smallest useful
render helper and add only providers required by the subject or behavior.

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
normal build.

## Snapshots

Snapshot only small, stable output whose complete structure is the behavior.
Prefer explicit assertions for interaction, state, accessibility, layout, and
animations. Update snapshots only for intentional UI changes. Do not snapshot
mocked child trees, large style objects, or ordinary prop forwarding.
