---
name: ui-kit-public-api
description: >
  Define, change, or check a UI Kit component's public contract and migration.
  Use ui-kit-review for general diffs and ui-kit-component-docs for prose-only
  edits.
---

# UI Kit Public API

Scope work to the requested component and affected consumers. Identify the
repository through `package.json.name`, not a worktree directory name.
Inspection and review requests are read-only; implementation follows the
user-authorized scope and `AGENTS.md`.

## Workflow

1. Read [contract-checklist.md](references/contract-checklist.md). Inspect the
   actual public boundary and record only affected aspects as **current → target
   contract → consumers/verification**. Reuse a contract already settled in the
   conversation rather than reopening it.
2. Resolve the target from the request and current source. Ask one question only
   if a remaining choice changes the contract. Migration follows the agreed
   task; do not default to removing compatibility or editing other repositories.
3. For implementation, use `ui-kit-testing` for changed behavior,
   `ui-kit-storybook` for affected demonstrations, and `ui-kit-component-docs`
   for public Markdown/JSDoc. Load only the skills matching the actual changes.
4. Verify according to `AGENTS.md` and report the contract changes and remaining
   gaps. For read-only review, report evidence, consequence, and scoped remedy;
   missing documentation is a finding, not authorization to create it.

General PR/diff review stays in `ui-kit-review`; add this focused workflow only
when API alignment is specifically in scope.
