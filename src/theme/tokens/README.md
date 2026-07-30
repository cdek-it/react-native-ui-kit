# Сгенерированные токены

`semantic` подключается к темам как `ThemeType.semantic`. `components` хранит
внутренние токены компонентов для `ThemeType.components`. В сгенерированных
файлах нет `primitive`; `colorScheme` содержит только выбранную ветку без
вложенных `light` и `dark`. Всё генерируется из
`design-tokens/input/tokens.json` и не редактируется вручную.

Подробности: [генератор токенов](../../../scripts/token-generator/README.md).
