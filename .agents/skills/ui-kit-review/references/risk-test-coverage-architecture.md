# Coverage Quality And Test Architecture

Read this card for behavior without credible protection, legacy changes, slow
feedback, or tests placed at the wrong level.

## Coverage Quality

Look for important controlled-state, accessibility, cleanup, ref, error,
boundary, or transition paths left unproved; assertions that execute without
checking the public outcome; and public legacy behavior changed without a
characterization test or stable contract.

Do not require tests for docs, formatting, generated source, stories alone, or
trivial declarative wiring covered by a containing boundary.

## Test Architecture

Look for integration setup where a component test proves the same contract,
isolated tests replacing necessary native or public-boundary coverage, slow or
flaky paths that prevent local feedback, ownership mismatches, and missing seams
that force unrelated infrastructure into every test.

Name the behavior and cheapest level that would fail for the real regression.
Treat duration as a finding only with measured evidence.
