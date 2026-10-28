---
name: ui-kit-figma
description: >
  Inspect Figma components, sync UI Kit implementations and theme-token
  bindings, or update exact design links. Read-only toward Figma.
---

# UI Kit Figma

Use the node and file/branch identity from the supplied link; do not substitute
the current selection. Use the Figma design-to-code skill before design-context
calls. Implementation uses existing tokens; token changes or regeneration
require confirmation under `AGENTS.md`.

## Inspect A Design

For identification, description, or a screenshot, inspect the explicit node and
use structural metadata as needed. Return the actual image when a screenshot is
requested. Distinguish visible facts, metadata-backed properties, and behavioral
inference; a static frame does not prove interaction behavior. Skip token
mapping, implementation, tests, and story edits for inspection-only requests.
Report unavailable evidence without inventing results.

## Component Synchronization

1. Inspect the component source, public types and barrels, nearest tests and
   stories, and relevant files under `src/theme/tokens`.
2. Read [token-mapping.md](references/token-mapping.md). Call Figma design
   context on the exact component or variant frame. If a page or section returns
   sparse context, use metadata only to locate the inner frame, then call design
   context on that frame.
3. Read variable definitions for the target frame and map each relevant Figma
   variable to the existing runtime theme path.
4. Implement the smallest compatible source change, following the nearest
   component pattern and root `AGENTS.md`. Use `ui-kit-public-api` when the
   public contract changes.
5. Use `ui-kit-testing` for changed behavior and `ui-kit-storybook` for affected
   public scenarios, controls, and device verification. Compare rendered states
   with the exact frame when visual alignment is in scope. Do not use static
   style assertions to prove a Figma mapping.
6. Update the component documentation link when its exact Figma frame is known.
7. Run the verification required by root `AGENTS.md`.

## Links Only

- Link a component to its exact Figma component or variant frame, not merely the
  file, page, or broad section containing it.
- In a bulk link update, inventory the component documentation first. Update
  only confidently matched frames and keep unresolved components explicit.
- Use supplied exact links directly; inspect Figma metadata to resolve missing
  frames. Fetch design context only if metadata cannot establish the match.
- Skip token mapping, implementation, tests, and story changes unless requested.
  Validate links and document formatting; report updated and unresolved links
  separately, including before a requested commit.
