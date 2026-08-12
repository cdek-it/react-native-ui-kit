# Change Propagation And Dependency Direction

Read this card for public contracts, cross-component changes, dependency
direction, cycles, or unexpectedly broad consumer blast radius.

## Change Propagation

Look for one contract encoded in unrelated components, a local change forcing
coordinated edits elsewhere, consumers depending on undocumented event order or
rendered shapes, and public props that leak animation, native, or theme setup.

Do not flag coordinated edits inside one component boundary, an intentional
stable public API, or explicitly scoped migration work.

## Dependency Direction

Look for cycles, internal imports bypassing component barrels, stable shared
source depending on volatile component details, public types coupled to
implementation libraries, and interfaces whose consumers implement unused
methods. Do not flag composition roots, explicit adapters, or stable facades.

Inspect public exports, static consumers, import edges, declarations, and tests.
Explain which consumer breaks or becomes coupled; file count is not a finding.
