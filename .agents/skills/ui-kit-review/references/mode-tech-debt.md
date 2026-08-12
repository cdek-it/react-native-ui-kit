# Technical Debt Assessment Mode

Use this mode only for an explicit debt assessment, refactoring roadmap, or
question about source areas that are expensive to change.

1. Resolve the named scope. If developer pain is essential and unavailable, ask
   at most one question; otherwise proceed and state the missing evidence
2. Read the three production risk cards: cognitive complexity, propagation and
   dependency, and duplication and ownership
3. Inventory evidence-backed debt before prioritizing it
4. Record current pain, spread across components or consumers, intentional or
   accidental status, and any visible owner or payback plan
5. Rank P1, P2, or P3 using Pain × Spread only as a planning aid; do not invent
   precision when pain evidence is absent

Output a prioritized table with evidence, affected scope, intent, remedy,
dependencies, and sequence. Separate runtime findings from longer-term debt.
