# UI Kit Review Checklist

Use this checklist for changed source in diff review and for the explicitly
named scope in specialized modes. Report a concern only when the reviewed scope
contains evidence and the consequence is credible. Keep diff-review findings
anchored to changed lines.

## Review Pass

1. Verify public props, exports, rendered states, callbacks, refs,
   accessibility, cleanup, and integration with existing consumers
2. Check change propagation: unrelated components should not require coordinated
   edits and dependencies should follow library boundaries
3. Check cognitive load: names, branching, state transitions, and module APIs
   should remain understandable in local context
4. Flag duplicated public rules or theme contracts, not harmless syntax
5. Reject speculative abstractions, unused configurability, and wrappers that
   add no useful boundary
6. Check cycles, internal cross-component imports, misplaced ownership, and
   public API distortion
7. Check TypeScript boundaries for avoidable `any`, invalid representable
   states, lost inference, and accidental contract narrowing
8. Check tests only for changed behavior in diff review. Do not require tests
   for formatting, generated code, documentation, or story-only changes
9. For changed tests, check avoidable mocks, implementation coupling, and
   production APIs introduced only for tests
