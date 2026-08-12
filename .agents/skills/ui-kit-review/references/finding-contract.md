# Finding Contract

Report a finding only when all four elements exist:

- **Symptom:** changed line or concrete evidence inside the declared scope
- **Source:** violated contract, invariant, test, project rule, or boundary
- **Consequence:** realistic failure or maintenance cost
- **Remedy:** scoped action that fixes the cause

Use the strongest available source: runtime or public API contract, invariant,
requirement, regression test, concrete `AGENTS.md` rule, established boundary,
then an optional engineering principle. Never use an author or book as the sole
source. Drop findings based only on thresholds or preference.

## Severity

- **Critical:** credible runtime failure, broken public contract, data loss, or
  a change that cannot safely build or run
- **Warning:** credible defect or maintainability cost in normal use that should
  be fixed before merge
- **Suggestion:** bounded improvement with a concrete benefit and low urgency

Reduce severity when a concern is isolated, reversible, or protected by an
explicit boundary. Numeric thresholds never determine severity.
