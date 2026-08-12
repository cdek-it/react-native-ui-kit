# Test Obscurity And Brittleness

Read this card when tests are difficult to understand or depend on internal
implementation rather than observable behavior.

## Obscurity

Look for names that omit behavior or condition, invisible shared setup,
unrelated assertions, and helpers that hide the action or expected result.

## Brittleness

Look for assertions on private state, internal call order, incidental style
shape, or animation objects; tests that fail on behavior-preserving refactors;
one test covering unrelated behaviors; and exact snapshots used instead of
meaningful interaction, state, or accessibility assertions.

Do not flag exact calls when the callback and payload are the public contract,
or setup required to exercise the real boundary.

State the observable contract and show how the assertion can pass while public
behavior is wrong or fail while behavior is unchanged.
