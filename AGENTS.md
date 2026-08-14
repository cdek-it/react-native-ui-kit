# React Native Prime UI Kit

Take versions and scripts from `package.json`. Respect its `engines` and
`packageManager` declarations; do not use npm or pnpm.

## Boundaries

Treat `src/index.ts`, component barrels, exported props, refs, callbacks,
accessibility behavior, and `peerDependencies` as compatibility-sensitive.
Follow the closest existing component pattern for ordinary implementation work.

## Project Skills

Use only top-level skills under `.agents/skills/`; nested `vendor/` skills are
source material, not runtime instructions.

- Use `$ui-kit-testing` to write or refactor focused Jest/RNTL tests, including
  controlled behavior, accessibility, mocks, timers, animations, snapshots, and
  public TypeScript contracts.
- Use `$ui-kit-review` for diffs and local changes or explicit architecture,
  onboarding, test-suite, debt, health, agent-instruction, and diagnostic
  audits. It is read-only unless the user requests fixes.

Do not load every skill preemptively; use the one matching the request.

## Component Rules

- Use named production exports and expose public components and types through
  the proper barrels.
- Use `StyleSheet.create` from `react-native-unistyles` and existing theme
  tokens. Do not spread or destructure generated Unistyles style objects.
- Controlled interactions emit callbacks; rendered state changes only after the
  controlling prop changes.
- In new source and test files, use `UpperPascalCase` `testID` values. Existing
  IDs are compatibility-sensitive; do not flag or rename them only for format.
- Story files containing JSX must use the `.stories.tsx` extension and JSX. Do
  not use `createElement` to keep them as `.stories.ts`; reserve `.stories.ts`
  for stories without JSX.
- A new public component or material variant normally needs typed source, a
  barrel export, focused tests, and representative Storybook states.

## Verification

- Runtime TypeScript: `yarn build` and `yarn lint:check`.
- Changed behavior or tests: also run focused Jest with
  `--runInBand --coverage=false`.
- Documentation or agent instructions only: validate affected metadata and
  references, run matching agent-script tests, then run targeted Prettier
  checks; runtime checks are unnecessary.
- Report successful and unavailable checks before claiming completion.

## Git

Do not commit or push unless explicitly asked. Use Conventional Commits for
requested commits.

## Safety

Do not read, edit, or output `.secrets/**`, environment files, `*.p8`, `*.jks`,
`*.keystore`, `*.enc`, `ios/**/*.plist`, or `android/app/*.json`. Ask the user
to handle a required secret.

Do not hand-edit `dist/`, `coverage/`, `.expo/`, or
`.storybook/storybook.requires.ts`; approved build or generation commands may
replace them. Modify `ios/` or `android/` only when native changes are
explicitly requested.
