# Architecture Audit Mode

Use this mode only for an explicit architecture, dependency, public API,
component ownership, or onboarding request. It may inspect beyond a Git diff but
must stay inside the user-named source scope.

## Diagnostic Audit

1. Map entry points, public barrels, components, hooks, themes, utilities, and
   import direction. Sample large areas and state the sample
2. Draw a compact dependency graph when three or more modules interact
3. Read `references/risk-propagation-dependency.md`; inspect cycles, public API
   leakage, internal cross-component imports, and blast-radius hotspots
4. Read `references/risk-duplication-domain.md`; inspect ownership of public
   rules, tokens, themes, helpers, and duplicated component behavior
5. Read `references/risk-cognitive-complexity.md` only when module purpose or
   architectural layers are unclear or speculative
6. Assess testability at public props, native, animation, and theme boundaries

Output scope, dependency map, severity-ordered findings, and a small prioritized
remedy sequence. Apply the shared Finding Contract.

## Onboarding Tour

When the user asks for a codebase tour, explain rather than diagnose. Do not use
severity or findings. Cover entry points, module map, public boundaries, project
conventions, evidence-backed danger zones, and a safe reading order.
