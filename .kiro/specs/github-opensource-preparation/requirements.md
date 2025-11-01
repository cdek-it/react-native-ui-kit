# Requirements Document

## Introduction

Данный документ описывает требования для подготовки React Native UI Kit проекта к публикации на GitHub в качестве open-source библиотеки. Проект в настоящее время содержит внутренние конфигурации, зависимости от приватных репозиториев CDEK и настройки CI/CD для внутренней инфраструктуры. Необходимо трансформировать проект так, чтобы внешние разработчики могли его клонировать, устанавливать зависимости и разрабатывать компоненты локально без доступа к внутренним ресурсам CDEK.

## Glossary

- **UI_Kit**: React Native библиотека компонентов на основе Prime Faces и Prime Flex
- **Internal_Repository**: Приватный Git репозиторий CDEK, недоступный для внешних разработчиков
- **External_Developer**: Разработчик вне организации CDEK, использующий публичную версию проекта
- **Configuration_File**: Файл настроек для инструментов разработки (ESLint, Prettier, Lefthook и т.д.)
- **CI/CD_Pipeline**: Автоматизированные процессы непрерывной интеграции и развертывания
- **Deployment_Configuration**: Настройки для публикации и распространения приложения (Fastlane, сертификаты)
- **NPM_Registry**: Реестр пакетов для установки зависимостей (публичный npmjs.com или приватный)
- **Development_Environment**: Локальное окружение разработчика для работы с проектом

## Requirements

### Requirement 1

**User Story:** Как внешний разработчик, я хочу клонировать проект и установить зависимости без доступа к внутренним репозиториям CDEK, чтобы начать разработку компонентов локально

#### Acceptance Criteria

1. WHEN External_Developer выполняет `yarn install`, THE UI_Kit SHALL устанавливать все зависимости из публичных источников
2. THE UI_Kit SHALL NOT содержать ссылок на Internal_Repository в файле `.yarnrc.yml`
3. THE UI_Kit SHALL NOT требовать аутентификации в приватном NPM_Registry для установки зависимостей
4. THE UI_Kit SHALL содержать все необходимые Configuration_File в корневой директории проекта
5. WHEN External_Developer клонирует репозиторий, THE UI_Kit SHALL содержать полную документацию по установке в файле README.md

### Requirement 2

**User Story:** Как внешний разработчик, я хочу использовать стандартные инструменты линтинга и форматирования кода, чтобы поддерживать качество кода без зависимости от внутренних конфигураций CDEK

#### Acceptance Criteria

1. THE UI_Kit SHALL содержать полную конфигурацию ESLint в файле `eslint.config.ts` без импорта из Internal_Repository
2. THE UI_Kit SHALL содержать полную конфигурацию Prettier в файле `.prettierrc` без ссылок на Internal_Repository
3. THE UI_Kit SHALL содержать полную конфигурацию Lefthook в файле `lefthook.yml` без удаленных конфигураций из Internal_Repository
4. THE UI_Kit SHALL содержать полную конфигурацию Commitlint в файле `.commitlintrc.json` без зависимости от приватных пакетов
5. WHEN External_Developer выполняет `yarn lint:check`, THE UI_Kit SHALL выполнять проверку кода с использованием локальной конфигурации

### Requirement 3

**User Story:** Как внешний разработчик, я хочу запустить проект локально для разработки и тестирования компонентов, чтобы вносить изменения и проверять их работу

#### Acceptance Criteria

1. WHEN External_Developer выполняет `yarn start`, THE UI_Kit SHALL запускать Storybook без ошибок
2. WHEN External_Developer выполняет `yarn ios`, THE UI_Kit SHALL запускать Storybook на iOS симуляторе
3. WHEN External_Developer выполняет `yarn android`, THE UI_Kit SHALL запускать Storybook на Android эмуляторе
4. WHEN External_Developer выполняет `yarn test`, THE UI_Kit SHALL выполнять тесты без зависимости от внутренних сервисов
5. THE UI_Kit SHALL содержать документацию по локальной разработке в файле README.md

### Requirement 4

**User Story:** Как внешний разработчик, я не хочу видеть внутренние конфигурации CI/CD и deployment, чтобы не путаться с ненужными для меня настройками

#### Acceptance Criteria

1. THE UI_Kit SHALL NOT содержать конфигурации Fastlane для внутренних процессов развертывания
2. THE UI_Kit SHALL NOT содержать сертификаты и ключи подписи приложений
3. THE UI_Kit SHALL NOT содержать GitHub Actions workflows для синхронизации с внутренними системами CDEK
4. THE UI_Kit SHALL NOT содержать ссылки на внутренние системы CDEK в файле `package.json`
5. THE UI_Kit SHALL содержать только необходимые для разработки библиотеки скрипты в `package.json`

### Requirement 5

**User Story:** Как внешний разработчик, я хочу понимать структуру проекта и как вносить вклад, чтобы эффективно работать с open-source проектом

#### Acceptance Criteria

1. THE UI_Kit SHALL содержать файл README.md с описанием проекта для внешних разработчиков
2. THE UI_Kit SHALL содержать файл CONTRIBUTING.md с инструкциями по внесению вклада
3. THE UI_Kit SHALL содержать информацию о лицензии проекта
4. THE UI_Kit SHALL содержать примеры использования компонентов в документации
5. THE UI_Kit SHALL NOT содержать ссылки на внутренние ресурсы CDEK (Confluence, Mattermost, внутренний GitLab) в публичной документации

### Requirement 6

**User Story:** Как внешний разработчик, я хочу использовать стандартные инструменты для управления версиями и коммитами, чтобы следовать общепринятым практикам

#### Acceptance Criteria

1. THE UI_Kit SHALL использовать стандартный пакет `@commitlint/config-conventional` для валидации коммитов
2. THE UI_Kit SHALL NOT зависеть от приватного пакета `@cdek/cz-conventional-mobile` для создания коммитов
3. WHEN External_Developer создает коммит, THE UI_Kit SHALL валидировать его формат с использованием публичных инструментов
4. THE UI_Kit SHALL содержать документацию по соглашениям о коммитах в CONTRIBUTING.md
5. THE UI_Kit SHALL использовать стандартные Git hooks без зависимости от Internal_Repository

### Requirement 7

**User Story:** Как внешний разработчик, я хочу собирать библиотеку для публикации, чтобы использовать её в своих проектах

#### Acceptance Criteria

1. WHEN External_Developer выполняет `yarn build`, THE UI_Kit SHALL создавать готовую к публикации версию библиотеки
2. THE UI_Kit SHALL генерировать TypeScript декларации типов в директории `dist`
3. THE UI_Kit SHALL содержать корректные пути к файлам в поле `publishConfig` файла `package.json`
4. THE UI_Kit SHALL NOT содержать зависимостей от приватных пакетов в секции `dependencies` и `devDependencies`
5. THE UI_Kit SHALL содержать документацию по процессу сборки в README.md
