# Diff Review Mode

Use a supplied diff or file list. Otherwise run
`scripts/resolve-review-scope.sh --base <ref>` for branch changes plus the
working tree, or `--working-tree` for explicitly local-only review. Establish
the branch base from the request or PR metadata; do not guess from an upstream
tracking branch. Ask one question if the base remains unknown. The resolver
rejects a missing or unrelated base rather than silently narrowing the scope.
When `scope=none`, report that no changes were found in the selected scope. Use
`--include-vendor` only to review explicitly named vendored source as data.

## Depth

- **Standard:** a local component or hook change using an established pattern
  with bounded behavior
- **Deep:** elevated integration, lifecycle, public API, theme, build, or
  ownership risk requiring detailed source calibration

Never downgrade a risky change because the diff is small. Select Deep for any
primary signal:

- public barrel, exported type, prop contract, peer dependency, or declaration
- cross-component dependency or library boundary change
- themes, tokens, global configuration, or shared infrastructure
- timers, subscriptions, concurrency, async cleanup, animations, or worklets
- ref forwarding, controlled state, native integration, or accessibility
- a new architectural pattern without a close project precedent

Also select Deep for at least two supporting signals:

- more than one component or subsystem is affected
- more than 10 reviewable files or roughly 400 changed lines
- changed behavior has no nearby focused test
- consumer blast radius or rollback behavior is unclear
- source changes combine with test-harness or build-contract changes

Start Standard otherwise and escalate when new evidence reveals these signals.
State the selected depth and signals in the review summary.

## Review

1. Inspect changed lines plus the minimum unchanged context needed to verify
   integration. Do not report unrelated existing debt
2. In Deep mode, load only matching cards:
   - contracts, dependencies, or cycles:
     `references/risk-propagation-dependency.md`
   - complex logic or abstractions: `references/risk-cognitive-complexity.md`
   - duplicated rules or ownership: `references/risk-duplication-domain.md`
   - test clarity or coupling: `references/risk-test-obscurity-brittleness.md`
   - test duplication or mocks: `references/risk-test-duplication-mocks.md`
   - coverage or test architecture:
     `references/risk-test-coverage-architecture.md`
3. Return concise findings with scope, depth, checks, and remaining verification
   gaps. Preserve the shared Finding Contract without requiring four labelled
   blocks per finding. When no findings exist, say so; do not claim merge
   readiness without required checks. Read `references/ui-kit-review-format.md`
   only when the user requests the expanded GitLab comment template.
