# Design Document: GitHub Open Source Preparation

## Overview

Данный документ описывает архитектуру и подход к трансформации React Native UI Kit проекта из внутреннего проекта CDEK в публичную open-source библиотеку на GitHub. Основная цель - сделать проект полностью автономным, удалив все зависимости от внутренней инфраструктуры CDEK, при этом сохранив функциональность для разработки и тестирования компонентов.

### Ключевые принципы

1. **Автономность**: Проект должен работать без доступа к внутренним ресурсам CDEK
2. **Прозрачность**: Все конфигурации должны быть явными и находиться в репозитории
3. **Стандартизация**: Использование общепринятых инструментов и практик open-source
4. **Минимализм**: Удаление всего, что не относится к разработке библиотеки компонентов

## Architecture

### Текущее состояние проекта

Проект имеет следующие зависимости от внутренней инфраструктуры CDEK:

1. **Приватные NPM пакеты**:
   - `@cdek/eslint-config-mobile` - конфигурация ESLint
   - `@cdek/prettier-config-mobile` - конфигурация Prettier
   - `@cdek/cz-conventional-mobile` - инструмент для создания коммитов

2. **Удаленные Git конфигурации**:
   - Lefthook конфигурация из `git@gitcode.cdek.ru:cdek-it/reactnative/conventions/lefthook-config.git`
   - Fastlane конфигурация из `git@gitcode.cdek.ru:cdek-it/reactnative/ci/fastlane-config.git`

3. **Приватный NPM Registry**:
   - `.yarnrc.yml` содержит ссылку на `https://repo.cdek.ru/repository/npm-private`

4. **CI/CD инфраструктура**:
   - GitHub Actions для синхронизации с внутренним Hub репозиторием
   - Fastlane конфигурация для deployment
   - Сертификаты и ключи подписи

### Целевая архитектура

```
react-native-prime-ui-kit/
├── .github/
│   └── workflows/          # Только публичные workflows (CI для тестов)
├── src/                    # Исходный код компонентов (без изменений)
├── .storybook/            # Storybook конфигурация (без изменений)
├── configs/               # Новая директория для явных конфигураций
│   ├── eslint.base.js     # Базовая ESLint конфигурация
│   ├── prettier.config.js # Prettier конфигурация
│   └── lefthook.config.yml # Lefthook конфигурация
├── .eslintrc.js           # Корневая ESLint конфигурация
├── .prettierrc.js         # Корневая Prettier конфигурация
├── lefthook.yml           # Локальная Lefthook конфигурация
├── .yarnrc.yml            # Без ссылок на приватный registry
├── package.json           # Без приватных зависимостей
├── README.md              # Документация для внешних разработчиков
├── CONTRIBUTING.md        # Руководство по внесению вклада
└── LICENSE                # Лицензия проекта
```

## Components and Interfaces

### 1. Dependency Management

**Проблема**: Проект зависит от приватных NPM пакетов `@cdek/*`

**Решение**: 
- Извлечь конфигурации из приватных пакетов и поместить их в проект
- Использовать публичные альтернативы где возможно
- Создать локальные конфигурационные файлы

**Компоненты**:

#### ESLint Configuration
- Создать `eslint.config.ts` с полной конфигурацией на основе `@cdek/eslint-config-mobile`
- Использовать публичные плагины: `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-native`
- Определить правила явно в файле конфигурации

#### Prettier Configuration
- Создать `.prettierrc.js` с полной конфигурацией на основе `@cdek/prettier-config-mobile`
- Использовать стандартные опции Prettier
- Определить правила явно в файле конфигурации

#### Commitizen Configuration
- Удалить зависимость от `@cdek/cz-conventional-mobile`
- Использовать стандартный `cz-conventional-changelog`
- Обновить `package.json` для использования публичного адаптера

### 2. Git Hooks Management

**Проблема**: Lefthook загружает конфигурацию из внутреннего репозитория

**Решение**:
- Получить содержимое удаленной конфигурации
- Создать локальный `lefthook.yml` с полной конфигурацией
- Удалить секцию `remotes` из конфигурации

**Компоненты**:

#### Lefthook Configuration
```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{js,ts,jsx,tsx}"
      run: yarn lint:check {staged_files}
    prettier:
      glob: "*.{js,ts,jsx,tsx,json,md}"
      run: yarn prettier:check {staged_files}

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

### 3. Package Registry Configuration

**Проблема**: `.yarnrc.yml` содержит ссылку на приватный NPM registry

**Решение**:
- Удалить секцию `npmScopes.cdek` из `.yarnrc.yml`
- Убедиться, что все зависимости доступны в публичном npm registry
- Сохранить остальные настройки Yarn (plugins, packageExtensions)

**Изменения в `.yarnrc.yml`**:
```yaml
# Удалить:
npmScopes:
  cdek:
    npmRegistryServer: 'https://repo.cdek.ru/repository/npm-private'

# Сохранить:
nodeLinker: node-modules
enableGlobalCache: false
# ... остальные настройки
```

### 4. CI/CD Cleanup

**Проблема**: Проект содержит конфигурации для внутренних процессов CDEK

**Решение**:
- Удалить GitHub Actions workflows для синхронизации с Hub
- Удалить всю директорию `fastlane/`
- Создать простой GitHub Actions workflow для публичного CI (опционально)

**Файлы для удаления**:
- `.github/workflows/auto-assign-by-label.yml`
- `.github/workflows/sync-status-in-satellite.yml`
- `fastlane/` (вся директория)

**Опциональный публичный CI workflow**:
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn lint:check
      - run: yarn test
      - run: yarn build
```

### 5. Documentation Update

**Проблема**: README.md содержит ссылки на внутренние ресурсы CDEK

**Решение**:
- Переписать README.md для внешних разработчиков
- Удалить badges от внутреннего GitLab
- Удалить ссылки на Confluence, Mattermost, Redmine
- Добавить четкие инструкции по установке и разработке
- Создать CONTRIBUTING.md с руководством по внесению вклада

**Структура нового README.md**:
```markdown
# React Native Prime UI Kit

Open-source UI component library for React Native based on Prime Faces and Prime Flex.

## Installation

## Quick Start

## Development

## Components

## Contributing

## License
```

### 6. Package.json Cleanup

**Проблема**: `package.json` содержит ссылки на внутренние ресурсы и приватные пакеты

**Решение**:
- Обновить `name`, `homepage`, `repository` для GitHub
- Удалить приватные пакеты из `devDependencies`
- Добавить публичные альтернативы
- Обновить `config.commitizen` для использования публичного адаптера

**Изменения**:
```json
{
  "name": "react-native-prime-ui-kit",
  "homepage": "https://github.com/cdek-it/react-native-prime-ui-kit",
  "repository": {
    "type": "git",
    "url": "https://github.com/cdek-it/react-native-prime-ui-kit.git"
  },
  "devDependencies": {
    // Удалить:
    // "@cdek/cz-conventional-mobile": "1.2.0",
    // "@cdek/eslint-config-mobile": "1.1.9",
    // "@cdek/prettier-config-mobile": "1.1.0",
    
    // Добавить публичные альтернативы:
    "cz-conventional-changelog": "^3.3.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-native": "^4.1.0"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

## Data Models

### Configuration Files Mapping

| Текущий файл | Источник | Целевой файл | Действие |
|--------------|----------|--------------|----------|
| `eslint.config.ts` | `@cdek/eslint-config-mobile` | `eslint.config.ts` | Развернуть конфигурацию |
| `.prettierrc` | `@cdek/prettier-config-mobile` | `.prettierrc.js` | Развернуть конфигурацию |
| `lefthook.yml` | Remote Git | `lefthook.yml` | Локализовать конфигурацию |
| `.yarnrc.yml` | - | `.yarnrc.yml` | Удалить npmScopes.cdek |
| `package.json` | - | `package.json` | Заменить зависимости |

### Files to Remove

| Файл/Директория | Причина удаления |
|-----------------|------------------|
| `fastlane/` | Deployment конфигурация |
| `.github/workflows/auto-assign-by-label.yml` | Внутренний workflow |
| `.github/workflows/sync-status-in-satellite.yml` | Внутренний workflow |
| `CHANGELOG.md` (опционально) | Содержит ссылки на внутренний GitLab |

## Error Handling

### Сценарий 1: Отсутствие приватных пакетов при установке

**Проблема**: После удаления ссылки на приватный registry, `yarn install` может не найти `@cdek/*` пакеты

**Решение**: 
1. Сначала развернуть все конфигурации из приватных пакетов
2. Затем удалить зависимости из `package.json`
3. Проверить, что `yarn install` работает без ошибок

### Сценарий 2: Несовместимость конфигураций

**Проблема**: Развернутые конфигурации могут конфликтовать с существующим кодом

**Решение**:
1. Запустить `yarn lint:check` после разворачивания конфигураций
2. Исправить найденные проблемы
3. Убедиться, что все тесты проходят

### Сценарий 3: Отсутствие документации

**Проблема**: Внешние разработчики не смогут начать работу без документации

**Решение**:
1. Создать подробный README.md с примерами
2. Добавить CONTRIBUTING.md с инструкциями
3. Добавить примеры использования в Storybook

## Testing Strategy

### Этап 1: Подготовка конфигураций

1. Создать ветку `opensource-preparation`
2. Развернуть конфигурации из приватных пакетов
3. Проверить, что линтинг работает: `yarn lint:check`
4. Проверить, что форматирование работает: `yarn prettier:check`

### Этап 2: Очистка зависимостей

1. Удалить приватные пакеты из `package.json`
2. Обновить `.yarnrc.yml`
3. Удалить `node_modules` и `yarn.lock`
4. Выполнить `yarn install`
5. Проверить, что установка прошла успешно

### Этап 3: Проверка функциональности

1. Запустить тесты: `yarn test`
2. Запустить сборку: `yarn build`
3. Запустить Storybook: `yarn start`
4. Проверить на iOS: `yarn ios`
5. Проверить на Android: `yarn android`

### Этап 4: Очистка CI/CD

1. Удалить внутренние GitHub Actions workflows
2. Удалить директорию `fastlane/`
3. Создать простой публичный CI workflow (опционально)
4. Проверить, что проект не содержит чувствительных данных

### Этап 5: Обновление документации

1. Переписать README.md
2. Создать CONTRIBUTING.md
3. Добавить LICENSE файл
4. Удалить ссылки на внутренние ресурсы

### Этап 6: Финальная проверка

1. Клонировать репозиторий в новую директорию
2. Выполнить `yarn install` с чистого листа
3. Запустить все команды разработки
4. Убедиться, что проект работает автономно

### Критерии успеха

- ✅ `yarn install` работает без доступа к внутренним ресурсам
- ✅ `yarn lint:check` выполняется успешно
- ✅ `yarn test` выполняется успешно
- ✅ `yarn build` создает готовую библиотеку
- ✅ `yarn start` запускает Storybook
- ✅ Проект не содержит ссылок на внутренние ресурсы CDEK
- ✅ Документация понятна для внешних разработчиков

## Implementation Notes

### Порядок выполнения

Важно выполнять изменения в правильном порядке, чтобы избежать поломки проекта:

1. **Сначала добавить** - развернуть конфигурации в проект
2. **Затем заменить** - обновить ссылки на локальные конфигурации
3. **Потом удалить** - убрать зависимости от приватных пакетов
4. **В конце очистить** - удалить ненужные файлы и обновить документацию

### Резервное копирование

Перед началом работы рекомендуется:
1. Создать backup текущих конфигураций
2. Сохранить содержимое приватных пакетов для справки
3. Документировать все изменения

### Совместимость

Необходимо убедиться, что:
1. Версии публичных пакетов совместимы с текущим кодом
2. Правила линтинга не слишком строгие для существующего кода
3. Форматирование не требует массовых изменений в коде
