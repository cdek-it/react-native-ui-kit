# Mocks And Native UI

Read this reference when adding or changing child, external, native, animated,
or console mocks.

Use the fewest mocks possible. Never mock the subject. When a child is outside
the tested behavior, use the smallest mock that preserves the public props,
children, and interactions exercised by its parent.

Do not mock another UI Kit component when the scenario checks behavior rendered
through it. For external UI components, rely on visible output, accessibility,
`testID`, public props, and events; do not mock a library only to inspect its
internal props.

Mock native or animated infrastructure only when Jest cannot execute the real
implementation reliably. For Reanimated behavior, prefer the project Jest mock
and assert public animated styles with `toHaveAnimatedStyle`.

Suppress only identified third-party or test-environment noise with a narrow
matcher. Never suppress application errors, unknown `act(...)` warnings, timer
leaks, or warnings owned by project code.
