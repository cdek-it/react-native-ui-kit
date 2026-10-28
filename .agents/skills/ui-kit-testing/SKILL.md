---
name: ui-kit-testing
description: >
  Write or refactor focused UI Kit Jest/RNTL tests and public type checks. Use
  ui-kit-review for whole-suite audits.
---

# UI Kit Testing

Choose cases from the public contract and inspect the implementation, nearest
tests, and existing Jest setup before adding helpers, providers, or mocks.

## Workflow

1. Read `references/test-authoring.md` for test-writing tasks; it owns assertion
   boundaries, selectors, controlled props, public types, and naming
2. Load additional references only as needed:
   - child, external, native, animated, or console mocks:
     `references/mocks-and-native-ui.md`
   - timers, debounce, animations, delayed updates, or manual promises:
     `references/timers-and-async.md`
3. If the user requests tests without cases, derive a concise behavioral set
   from the public contract, state the cases and assumptions, and implement them
   directly. Ask one question only when an unresolved choice would change the
   public contract
4. Before finishing, remove avoidable mocks, oversized helpers, redundant waits,
   and assertions that do not prove the public contract

## Verification

Run focused Jest and the applicable build or lint checks from `AGENTS.md`.
