---
name: brooks-test
description: >
  Audit an existing test suite for brittleness, mock abuse, speed, readability,
  and coverage quality. Do not use for writing or refactoring individual tests.
---

# Brooks-Lint — Test Quality Review

## Setup

1. Read `../_shared/common.md` for the Iron Law, Project Config, Report Template, and Health Score rules
2. Read `../_shared/source-coverage.md` for book-level coverage, exceptions, and tradeoffs
3. Read `../_shared/test-decay-risks.md` for test-space symptom definitions and source attributions
4. Read `test-guide.md` in this directory for the test quality review framework

## Process

**If the user has not shared test files or pointed to a test directory:** apply Auto
Scope Detection from `../_shared/common.md` to determine the review scope before proceeding.

1. Build the test suite map (guide's "Before You Start" section)
2. Scan for each test decay risk in the order specified (Steps 1–4 of the guide)
3. Apply the Iron Law and output using the Report Template (Step 5 of the guide)

**Mode line in report:** `Test Quality Review`
