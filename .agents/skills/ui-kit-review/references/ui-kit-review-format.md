# UI Kit Review Format

Return a diff review as one GitLab Markdown comment. Match the user's language;
Russian is the default for a Russian request.

## Rules

- Start with a compact summary that includes `Review mode: Standard|Deep` and
  one concise reason
- State the reviewed scope, skipped paths, and whether sampling was used
- Lead with findings. Sort Critical, Warning, then Suggestion and group by file
- Keep each finding compact while preserving Symptom, Source, Consequence, and
  Remedy. Add code only when it materially clarifies the problem or fix
- When no findings exist, say so and still report verification and residual risk
- Do not praise, score health, or claim merge readiness without required checks

## Template

```markdown
<details>
<summary><strong>Общее резюме по Merge Request</strong></summary>

**Review mode:** Standard|Deep — краткая причина.

[Scope, skipped files, main risk, and residual verification risk.]

</details>

---

### Детальные замечания по файлам

<details>
<summary><code>path/to/file.tsx</code></summary>

> #### Critical | Warning | Suggestion: короткий заголовок
>
> **Строка:** `line`
>
> **Симптом:** что видно в diff.
>
> **Основание:** нарушенный контракт, правило или граница.
>
> **Последствие:** конкретный риск.
>
> **Что сделать:** исправление первопричины.

</details>

## Проверка

- `command` — passed, failed, or not run with reason.
```
