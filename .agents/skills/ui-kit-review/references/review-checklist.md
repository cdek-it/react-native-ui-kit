# UI Kit Review Checklist

1. Verify public props, exports, rendered states, callbacks, refs,
   accessibility, cleanup, and consumers; flag unplanned API removals or changes
2. Check change propagation, import direction, cycles, internal cross-component
   imports, ownership, and public API leakage
3. Check understandable local responsibilities, names, branches, and state
   transitions; reject speculative abstractions and unused configurability
4. Flag duplicated public rules or theme contracts, not harmless syntax
5. Check TypeScript boundaries for avoidable `any`, invalid representable
   states, lost inference, and accidental contract narrowing
6. Check tests only for changed behavior in diff review. Do not require tests
   for formatting, generated code, documentation, or story-only changes
7. For changed tests, check avoidable mocks, implementation coupling, and
   production APIs introduced only for tests
