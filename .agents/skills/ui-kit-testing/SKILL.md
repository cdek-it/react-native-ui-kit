---
name: ui-kit-testing
description: >
  Write or refactor React Native Prime UI Kit Jest and RNTL tests for
  components, hooks, controlled behavior, timers, animations, snapshots,
  accessibility, and public TypeScript contracts. Do not use for whole-suite
  audits
---

# UI Kit Testing

Test observable behavior with the smallest environment that exercises the real
public contract. Confirm the repository is `react-native-prime-ui-kit`, then
inspect the implementation and nearest tests before choosing helpers or mocks.

## Workflow

1. Search existing tests and Jest setup before adding a helper, mock, provider,
   timer utility, or console suppression
2. Load only the references required by the test:
   - test cases, render helpers, selectors, accessibility, snapshots, types, or
     naming: `references/test-authoring.md`
   - child, external, native, animated, or console mocks:
     `references/mocks-and-native-ui.md`
   - timers, debounce, animations, delayed updates, or manual promises:
     `references/timers-and-async.md`
3. Add only providers and mocks required by the behavior under test. Prefer
   public UI, props, callbacks, refs, and hook results over implementation
   details
4. If the user requests tests without cases, derive a concise behavioral set
   from the public contract, state the cases and assumptions, and implement them
   directly. Ask one question only when an unresolved choice would change the
   public contract
5. Before finishing, remove avoidable mocks, oversized helpers, redundant waits,
   and assertions that do not prove the public contract

## Verification

Run focused Jest and the applicable build or lint checks from `AGENTS.md`.
