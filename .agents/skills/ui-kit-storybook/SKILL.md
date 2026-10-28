---
name: ui-kit-storybook
description: >
  Maintain UI Kit Storybook stories, controls, grouping, and status tags, or run
  requested device checks.
---

# UI Kit Storybook

Inspect the component's public types and nearby stories. Ordinary Storybook work
does not require Figma access.

## Scenarios And Controls

For controls replacing public prop types, composed nodes, or custom controlled
handlers, read [controls-and-render.md](references/controls-and-render.md).

- Default to one interactive story per public component unless the user asks for
  additional stories. Expose variants, states, and optional content through
  controls rather than separate named stories.
- Keep props valid for discriminated unions throughout control changes,
  including dependent required props.
- For nodes, callbacks, and styles, use typed story-only controls and adapt them
  in `render`. Keep these controls out of the public component API.
- Model controlled interactions in consumer state or args, preserving callback
  logging and useful actions such as restarting a timer.
- Show dependent controls conditionally, following existing `argTypes.if` usage.
  Group nested options with short prefixes such as `badge.text`; do not assume
  web-only control grouping works in on-device Storybook.
- Exclude non-editable or internally composed props through
  `parameters.controls.exclude`; `control: false` renders as `Invalid type` in
  this project's on-device controls.
- Follow `AGENTS.md` for JSX and story extensions. Keep wrappers needed to
  demonstrate real usage, without unrelated interactions.

## Status And Cleanup

- Remove obsolete duplicate stories and temporary QA matrices unless their
  retention was requested.
- Automatically include `deprecated` in story metadata when the component is
  explicitly deprecated in its public API (`@deprecated`) or consumer docs.
- For status-tag changes, inspect `.storybook/StorybookTags.tsx` and existing
  metadata. Preserve confirmed tags. When creating story metadata without a
  confirmed status, include `tags: []` as a place for the decision and remind
  the developer in the task result to choose the status tag. Do not invent a
  placeholder tag or infer design, release, or migration status from code,
  neighbouring stories, or absence of usages.
- Add README or documentation links when requested, preserving existing format.

## Verification

After adding, moving, or removing story files, run `yarn storybook-generate` and
check registration for duplicates. Run the applicable checks from `AGENTS.md`;
use `yarn tsc --noEmit` to check stories because `yarn build` excludes them.

Smoke-test changed controls and interactions in the running Storybook when
available. For requested device checks or visual changes, read
[device-verification.md](references/device-verification.md) and choose its
targeted or extended scope. Report unverified rendering separately from source
and type checks.
