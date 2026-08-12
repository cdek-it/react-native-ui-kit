# Cognitive Load And Accidental Complexity

Read this card only when in-scope logic is hard to understand locally or adds a
new abstraction without a close project precedent.

## Cognitive Load

Ask whether a reviewer can state the unit's responsibility and verify behavior
without reconstructing unrelated state. Look for interleaved responsibilities,
deep branching, hidden state transitions, parameters that must move together,
magic values that hide invariants, and public props that expose setup details.

Do not flag cohesive long functions, declarative JSX nesting, generated source,
or explicit code that preserves meaningful UI states.

## Accidental Complexity

Look for wrappers that only rename APIs, configuration with no current consumer,
abstractions costlier than bounded duplication, and compatibility layers
unsupported by any public path. Do not flag framework adapters, public library
boundaries, or configurability required by a current variant.

Trace real callers and tests. Report only credible comprehension, modification,
or defect cost; size alone is not proof.
