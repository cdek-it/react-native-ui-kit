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
  controlled behavior, accessibility, mocks, timers, animations, and public
  TypeScript contracts.
- Use `$ui-kit-figma` to implement or sync components from Figma, map design
  variables to local theme tokens, and align material variants.
- Use `$ui-kit-storybook` to create or update stories, controls, status tags,
  and verify rendered component states on a device.
- Use `$ui-kit-component-docs` for component Markdown and public API JSDoc.
- Use `$ui-kit-review` for diffs and local changes or explicit architecture,
  onboarding, test-suite, debt, health, agent-instruction, and diagnostic
  audits. It is read-only unless the user requests fixes.

Do not load every skill preemptively; use the one matching the request.

## Component Rules

- Use named production exports and expose public components and types through
  the proper barrels.
- Use `StyleSheet.create` from `react-native-unistyles` and existing theme
  tokens. Do not spread or destructure generated Unistyles style objects.
- Before changing token values in `design-tokens/**` or `src/theme/tokens/**`,
  or running token generation, explain the proposed changes and get explicit
  user confirmation unless that operation is already authorized. Component or
  Figma synchronization alone does not authorize it. Do not hand-edit generated
  output; read-only token checks may run normally.
- Controlled interactions emit callbacks; rendered state changes only after the
  controlling prop changes.
- Keep built-in accessibility labels and hints in the component or family's
  internal `strings.ts`, reusing its existing dictionary and named constants.
  Preserve supported consumer overrides and state-dependent action names.
- Keep accessibility guidance advisory unless it is an agreed API requirement.
  Put consumer reminders in component Markdown and relevant public JSDoc; do not
  make optional props required merely to enforce a recommendation.
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
- Agent instructions: run `yarn skills:check`, `yarn skills:test`, and targeted
  Prettier checks. Component documentation only: validate affected links and
  examples, then run targeted Prettier. Runtime checks are unnecessary for both.
- Report successful and unavailable checks before claiming completion.

## Git

Do not commit or push unless explicitly asked. Use Conventional Commits for
requested commits. Keep the conventional type and optional scope in English;
write the commit subject in Russian.

## Safety

Do not read, edit, or output `.secrets/**`, environment files, `*.p8`, `*.jks`,
`*.keystore`, `*.enc`, `ios/**/*.plist`, or `android/app/*.json`. Ask the user
to handle a required secret.

Do not hand-edit `dist/`, `coverage/`, `.expo/`, or
`.storybook/storybook.requires.ts`; approved build or generation commands may
replace them. Modify `ios/` or `android/` only when native changes are
explicitly requested.
