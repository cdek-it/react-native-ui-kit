# Knowledge Duplication And Component Ownership

Read this card when the scope repeats public behavior or theme rules, introduces
competing names, or moves behavior across components and utilities.

## Knowledge Duplication

Look for the same public contract, controlled-state rule, accessibility rule,
token mapping, or validation in more than one owner; constants that must change
together; and code, tests, stories, or docs that disagree on one rule.

Do not flag repeated syntax, small local setup, intentionally independent
components, or duplication safer than a premature shared abstraction.

## Ownership

Look for design-system decisions in generic utilities, one component reaching
into another component's internals, shared services accumulating unrelated UI
behavior, and types that erase meaningful public states or invariants.

Search the exact rule and consumers before reporting. Name the single component,
hook, theme, or public boundary that should own the knowledge.
