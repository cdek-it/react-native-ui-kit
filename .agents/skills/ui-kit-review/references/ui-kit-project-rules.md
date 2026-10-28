# UI Kit Review Rules

Resolve conflicts in this order: root `AGENTS.md`; current source and executable
config; `package.json` and build declarations; `CONTRIBUTING.md`; migration or
historical docs. Verify `MIGRATION.md` claims against current exports and
config.

- Do not recommend re-exporting Unistyles APIs unless intentionally changing the
  public contract; current production exports do not expose them.
- Extract required primitives before worklets instead of capturing whole style
  objects, as enforced by `unistyles/no-unistyles-in-worklet`.
- Check both themes when changed styles or tokens differ by theme.
- Preserve consumer callbacks when internal handlers add state or animation.
- Flag performance only for credible cost; never require memoization
  mechanically.
- Flag moves from peers to runtime dependencies that can duplicate frameworks or
  break host resolution.
- Review runtime dependencies for bundle size, native linking, platforms, and
  peer-version impact.

For test-policy questions, read only the relevant testing reference:
[test-authoring.md](../../ui-kit-testing/references/test-authoring.md) for
snapshots and static styles, or
[timers-and-async.md](../../ui-kit-testing/references/timers-and-async.md) for
animation checks. Existing snapshots alone are not a finding.

Do not apply SuperApp-specific FSD, API, navigation, localization, image, or
blanket memoization rules.
