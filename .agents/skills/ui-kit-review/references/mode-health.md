# Codebase Health Mode

Use this mode only when the user explicitly requests an overall read-only
quality assessment or all review dimensions.

1. Resolve the source scope and state sampling limits
2. Run four bounded dimensions:
   - changed-source quality when a diff exists: shared checklist plus selected
     production risk cards
   - architecture: public/module map plus propagation and dependency risk
   - debt: evidence from all three production risk cards
   - tests: representative samples using all three test risk cards
3. Cap the report at the most consequential evidence-backed findings and do not
   repeat one root cause across dimensions
4. Use Healthy, Watch, or At Risk by default. Compute numeric scores only when
   explicitly requested
5. If scoring is requested, label it heuristic, show confidence and missing
   evidence, and weight architecture 30%, changed source 25%, debt 25%, and
   tests 20%; redistribute changed-source weight when no diff exists

Output scope and confidence, dimension summaries, an architecture map when it
helps, top findings, and the next three actions. Do not write history files or
compare scores without a real previous measurement.
