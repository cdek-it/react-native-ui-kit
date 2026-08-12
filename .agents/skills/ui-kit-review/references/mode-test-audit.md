# Test Quality Audit Mode

Use this mode only for an explicit audit of an existing test suite or directory.
Use `ui-kit-testing` when writing or refactoring individual tests.

1. Map test locations, component ownership, helpers, Jest setup, snapshots, and
   unit/integration boundaries. Counts provide context, not quality evidence
2. Sample high-change, high-risk, shared, controlled, animated, and public API
   areas; state the sample
3. Read all three test risk cards
4. Check whether tests communicate observable behavior, survive
   behavior-preserving refactors, mock real boundaries, cover important state
   transitions, and match production ownership
5. Require measured history or timings before claiming flakiness or slow
   feedback

Output the suite map, sampled scope, findings by project severity, and a
prioritized improvement sequence. Apply the shared Finding Contract.
