# UI Kit Review Rules

Use only for `react-native-prime-ui-kit`.

## Source Precedence

Resolve conflicts in this order: root `AGENTS.md`; current source and executable
config; `package.json` and build declarations; `CONTRIBUTING.md`; migration or
historical docs. Verify `MIGRATION.md` claims against current exports and
config.

## Public Contract

- Flag unplanned removal, rename, or narrowing of public exports and props.
- Preserve TypeScript inference and declarations; model mutually exclusive props
  so invalid states cannot compile.

## Themes And Unistyles

- Do not recommend re-exporting Unistyles APIs unless intentionally changing the
  public contract; current production exports do not expose them.
- Extract required primitives before worklets instead of capturing whole style
  objects, as enforced by `unistyles/no-unistyles-in-worklet`.
- Check both themes when changed styles or tokens differ by theme.

## React Native Behavior

- Review press, disabled, loading, focus, accessibility, refs, and native prop
  forwarding as public behavior.
- Preserve consumer callbacks when internal handlers add state or animation.
- Verify cleanup for timers, subscriptions, listeners, and animations.
- Flag performance only for credible cost; never require memoization
  mechanically.

## Tests And Stories

Use the sibling `ui-kit-testing` skill for test details. Keep snapshots small
and intentional. Require Storybook coverage for new public components and
material visual variants, not internal refactors.

## Dependencies And Build

- Flag moves from peers to runtime dependencies that can duplicate frameworks or
  break host resolution.
- Review runtime dependencies for bundle size, native linking, platforms, and
  peer-version impact.

Do not apply SuperApp-specific FSD, API, navigation, localization, image, or
blanket memoization rules.
