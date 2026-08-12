# Timers And Async Lifecycle

Read this reference when implementation or tests include `setTimeout`,
`setInterval`, debounce, animations, delayed state updates, polling, retries, or
manually controlled promises.

Common causes of hanging work or post-test updates:

- a component starts a timer or animation without cleanup
- a hook schedules a delayed state update after unmount
- fake timers are enabled but pending work is never advanced or cleared
- a manually controlled promise remains unresolved after the scenario

Fix implementation cleanup when production code owns the timer or animation. Use
fake timers only when the test needs explicit timer control; otherwise prefer
observable UI waits with `findBy*` or `waitFor(...)`. Advance only the expected
work, unmount before cleanup assertions, and restore real timers.

For Reanimated behavior, assert public animated styles with
`toHaveAnimatedStyle` and wait for the expected value. Do not assert private
animation objects or broadly suppress timer and `act(...)` warnings. Treat such
warnings as real until their exact third-party or test-environment source is
identified.
