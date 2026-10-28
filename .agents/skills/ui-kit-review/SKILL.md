---
name: ui-kit-review
description: >
  Review UI Kit code diffs and explicit architecture, test-suite, debt, health,
  or agent-instruction audits. Read-only unless fixes are requested.
---

# UI Kit Review

Review handwritten `src/**/*.ts` and `src/**/*.tsx` by default. Include config,
tooling, docs, or native files only when named; respect `AGENTS.md` exclusions.
Select one mode: explicit instruction audits take their own route; supplied
diffs and PRs use Diff Review, including changed tests. Whole-suite and broader
source audits require an explicit request.

For "recheck tests", assess coverage of agreed behavior, duplicate scenarios,
and assertion quality, then run focused tests. Keep the named component or
current diff scope; a passing run alone does not complete this review.

## Mode Routing

| Request                                            | Mode               | Read                                          |
| -------------------------------------------------- | ------------------ | --------------------------------------------- |
| MR, PR, diff, changed files                        | Diff Review        | `references/mode-diff-review.md`              |
| architecture, dependencies, public API, onboarding | Architecture Audit | `references/mode-architecture-audit.md`       |
| existing test-suite quality                        | Test Audit         | `references/mode-test-audit.md`               |
| technical debt or refactoring priorities           | Debt Assessment    | `references/mode-tech-debt.md`                |
| overall source quality or all read-only checks     | Health             | `references/mode-health.md`                   |
| source-wide diagnosis and requested fixes          | Sweep              | `references/mode-sweep.md`                    |
| AGENTS.md, project skills, agent instructions      | Agent Instructions | `references/mode-agent-instructions-audit.md` |

## Shared Workflow

1. Follow root `AGENTS.md` already present in project context. Read it from disk
   only when it is under audit or its exact current text must be verified
2. Read `references/finding-contract.md` in every mode
3. Read `references/review-checklist.md` and
   `references/ui-kit-project-rules.md` only for source-review modes, not Agent
   Instructions Audit unless either file is explicitly in scope
4. Load only the selected mode's conditional references; report sampled,
   inferred, skipped, and unavailable scope

Review is read-only unless the user requests fixes. Assess snapshot intent
through tests without line-reviewing generated snapshots. Health scores belong
only to Health mode; do not write review history files.
