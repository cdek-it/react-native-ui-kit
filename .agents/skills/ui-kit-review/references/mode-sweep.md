# Full Sweep Mode

Use this mode only when the user explicitly requests both source-wide diagnosis
and code modifications. A read-only request belongs to Health mode.

## Preflight

1. State the exact directory, approximate eligible file count, excluded paths,
   expected verification, and that files will be edited without commit or push
2. Ask for one confirmation only when repository-wide edits were not clearly
   authorized
3. Preserve existing user changes and obey `AGENTS.md`

## Passes

Run sequentially:

1. production source using the shared checklist and production risk cards
2. tests using the three test risk cards and `ui-kit-testing`
3. debt prioritization from observed pain and spread
4. architecture mapping for public API, component dependencies, theme ownership,
   and testability seams

Classify remedies as Safe (local and reversible), Extended-safe (coordinated,
verified, and without a public contract break), or Residual (ambiguous intent,
public redesign, missing protection, or authority beyond the request).

Apply Safe and Extended-safe remedies in small batches and verify each batch
with `AGENTS.md`. Never apply a Residual remedy without user direction. Stop
after three failed attempts at one remedy or three non-critical rounds without
meaningful new progress.

Output changed files, checks, applied fixes, retired attempts, and Residual
items. Do not commit or push.
