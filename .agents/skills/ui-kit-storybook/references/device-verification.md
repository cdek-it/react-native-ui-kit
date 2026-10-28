# Device Verification

Use the available `agent-device` tools to inspect the running UI Kit Storybook.
Record the platform, app/build, and story so results identify the implementation
actually exercised.

## Targeted Check

For ordinary story, layout, typography, or theme changes, inspect affected
states and interactions at the current system text size. Check the themes
affected by the change. Do not run the extended matrix for metadata-only edits.

For a new component or a visual change affecting text, state in the task result
whether enlarged system text was checked. If it was not, flag this as remaining
verification for the developer; do not block ordinary story work on it.

## Extended Visual And Text-Scaling Check

Use this scope for a requested full visual or accessibility review, an explicit
text-scaling check, or a fix for font scaling or text clipping. Generic device
checks and focused checks of accessible names, focus, or announcements keep
their requested scope; mentioning accessibility alone does not trigger this
matrix.

- Check affected states in light and dark themes at 100% and 200% system text
  size where supported. Keep the component's actual font-scaling props and
  record the effective scale or native text-size category. If 200% cannot be
  established, report the actual setting and leave that target unverified.
- For inputs, check empty and populated values both blurred and focused,
  including floating-label transitions. For text components, check
  representative and long content under constrained width. Apply states
  supported by the public API rather than all possible prop combinations.
- Inspect text clipping, overlap with labels or icons, and readability. Check
  wrapping or ellipsis against the public behavior. Compare normal scale with
  the exact Figma frame when design alignment was requested and the frame is
  available.

## Reporting And Cleanup

Inspect the rendered result after each transition. Restore system text size and
theme settings afterward. Remove temporary stories unless they add a reusable
scenario requested by the task.

Report the cases actually viewed: platform/build, story and state, theme,
scale/category, and observed result. Attach screenshots for failures when
possible. Mark unavailable tools, builds, platforms, or states as unverified.
These visual checks cover text scaling and layout; they do not establish that
screen-reader names, focus, or announcements work. Report those only when
separately exercised, and keep source or Jest evidence distinct from device
results.
