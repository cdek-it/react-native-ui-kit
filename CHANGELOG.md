# Changelog

All notable changes to this project will be documented in this file. See
[standard-version](https://github.com/conventional-changelog/standard-version)
for commit guidelines.

### [0.0.36](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.35...v0.0.36) (2025-04-22)

### Новый функционал

- **ids:** ids message timer
  ([acb4280](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/acb42801fd5987bf48d9aabeaed454ca539342d2))

### [0.0.35](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.34...v0.0.35) (2025-04-16)

### Новый функционал

- **makeStyles:** добавлена мемоизация стилей
  ([acece28](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/acece28a52bf8137d6c64b46c9aef3e45e033788))

### Исправления багов

- **Message:** поправлены отступы при отсутствующем body
  ([64588a9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/64588a945ce414cfd508b4363faf49237106fad8))
- **Typography:** добавлен экспорт компонента Anchor
  ([28bbb40](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/28bbb40f24f09d3e3774e97bd2d9454f27540659))

### [0.0.34](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.33...v0.0.34) (2025-04-15)

### Новый функционал

- **Typography:** реализован компонент Anchor
  ([576765f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/576765f3c8d746cc4fe264912a9fbaac83defa4e))

### [0.0.33](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.32...v0.0.33) (2025-04-14)

### Новый функционал

- **message-ids:** добавлены айди к мессадж
  ([1dc35d2](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/1dc35d24262508db36e9b31c6935dc70d667c3bf))

### [0.0.32](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.31...v0.0.32) (2025-04-11)

### Исправления багов

- **FloatLabel:** исправлена передача testID
  ([453c05e](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/453c05e4f17309b5da4248b48bd6172a6c0ca7e8))

### [0.0.31](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.30...v0.0.31) (2025-04-04)

### Исправления багов

- **TimeFlip:** исправлено моргание анимации
  ([d6f5e84](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/d6f5e841c0e66ea40cea920e116a366a0d696472))
- **timer:** опять линтер
  ([8ad3b50](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/8ad3b5028cfe488300b6b02ffdf51955a3ea3aaf))
- **timer:** правки по замечанием в ревью
  ([d6ad428](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/d6ad42816b967c198590eb53220d22d423726d0f))
- **timer:** правки по замечаниям линтера
  ([988c48a](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/988c48a6d120256825242bdc0f7739be77568902))
- **timer:** снова линтер
  ([69acfa6](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/69acfa60fe908183295d4af685612b5c04719187))
- **timer:** фикс анимаций таймера MOBILE-76
  ([20d811c](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/20d811c15070aa7a4aa36c7d03e520143eff1871))

### Другое

- **storybook:** исправление команды storybook-generate
  ([7f01454](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/7f01454005fbf7c1a88bf944f292ffbf35fa8df1))
- **timer:** обновление снапшотов
  ([b333e28](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b333e2841856ce590656453f59abfde3b47641a5))
- отключена проверка типов в storybook.requires.ts
  ([553f004](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/553f004488408a7e6e1a367f7b4553e7d1a37fd2))

### [0.0.30](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.29...v0.0.30) (2025-04-02)

### Исправления багов

- **FloatLabel:** исправлена анимация
  ([e2cb264](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e2cb264fb83fda0d2aa3e496bc4e9d27df1df2ba))
- **InputTextBase:** исправлена анимация для корректной работы на Android
  ([5f85832](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5f858326e2ab0ca12fe52e6d89087f46278b42fc))

### Другое

- **eslint:** обновил ESLint до свежей версии
  ([4f1f619](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4f1f619a7e2d95510efd5d286355eb23e962a8ad))
- **lint:** установил конфигурации eslint и prettier
  ([439bfe5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/439bfe5d33c3eb1102cfb180fa70a1049a3df34f))
- **npm:** убрал npmRegistryServer и npmAuditServer из локального конфига
  ([9320d30](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/9320d305a71e64e3fa492b7cd3138a8ef417f30e))
- **packages-check:** установил npm-check-updates локально в репозитории проекта
  ([18a9db9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/18a9db9ce2ec3764d03dc27405b381b6d5e88032))
- **scripts:** исключена установка зависимостей при запуске yarn ios
  ([9f02e11](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/9f02e11ac8b35bfca17cd8f087f6c7c40579fea0))
- **tests:** исправление тестов после правок линтера
  ([2c01634](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/2c01634e0448e1cea58f7212bb22a01e2af92d67))

### [0.0.29](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.28...v0.0.29) (2025-03-19)

### Другое

- **ios:** добавил плагин expo для выставления ensure_bundler в Podfile
  ([0762c5b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/0762c5b9801ab1c625666c5f2ebcdaca1ee6f172))
- **java:** указал конкретную версию JDK
  ([c95cecb](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c95cecb7508414a41326eea04a8b88aad9e98082))
- **node:** указал конкретную версию Node.js
  ([40c0aeb](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/40c0aeb5dcdca27a99086d738d525155c8a8638d))
- **ruby:** указал конкретную версию Ruby
  ([d55d04b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/d55d04b9ea9f895c483cba2fbf412139de456ed8))
- **secrets:** добавил работу с секретами в проекте
  ([45b2d20](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/45b2d2066a6aab802deb73929dd8765a97218d02))
- **xcode:** указал конкретную версию XCode
  ([b92fc0b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b92fc0be139cb60d2620e7f93f7b882d3918d05d))
- обновил cz-conventional-mobile до 1.2.0
  ([c1b659f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c1b659f794dc6dac41861a41675feb63b313bb02))

### Новый функционал

- **message:** в Message добавлено свойство closeLabel
  ([cb29546](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/cb29546ce97532ae9ac0dec2e71ac3e6bc7ac44a))

### Исправления багов

- **message:** убран лишний импорт
  ([17ec164](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/17ec16410a607c9c296ff106e728964e74c695c9))

### Рефакторинг

- **message:** правки по замечаниям линтера
  ([a2b76e3](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a2b76e30c1ace4d7ec916945422304430fda1b26))
- **message:** рефакторинг по замечаниям в ревью
  ([f81a576](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/f81a576260101939e7e8bbcc651e8d5352f8e4f4))

### [0.0.28](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.27...v0.0.28) (2025-03-06)

### Исправления багов

- **float-label:** generalize inputRef type
  ([bc91e64](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/bc91e643a56fa65beeb7e0b48b8e1f4fef52fd55))

### [0.0.27](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.26...v0.0.27) (2025-03-05)

### Исправления багов

- **typography-service:** add missed import
  ([a2b8876](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a2b887665153e502f3b7484da6b151679c36d3c5))
- **typography:** add missed import
  ([5de09d4](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5de09d41db0f96f353a2e3a14f568c8479220c51))

### [0.0.26](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.25...v0.0.26) (2025-03-05)

### Другое

- **eslint:** включил кэширование для команды yarn lint
  ([8f80f65](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/8f80f65c191a043edbc5eb264806e2c0c2a2bfad))
- **eslint:** выключил кэширование линтьера
  ([174897d](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/174897d5bb4abbcf7e0bec0942c797b032fa87c3))
- **eslint:** добавил файл с форматтером в eslintignore
  ([2556bb9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/2556bb9e5dd30ce23a6c189ab75654f66179f094))
- **expo:** добавил динамическую конфигурацию expo
  ([c706aa7](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c706aa779731681daf5e7f464919241d2316d4b9))
- **fastlane:** добавил недостающий для сборок файл .env
  ([f34ed39](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/f34ed39ddbddb34dc38744fef99196d6849fe5c8))
- **jest:** настроил кэширование для запусков юнит тестов
  ([640136a](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/640136ad20f7e7d3e3a914c3bdedce06f3a1b14a))
- **package:** добавил publish config в настройки пакета
  ([5f5f8d7](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5f5f8d7f268dd3f0e092e03964b9ff3839d441a6))
- **package:** добавил в конфигурацию пакета описание и ссылку на репозиторий
  ([4683f44](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4683f44da57b786f31762a093d3da98613570474))
- добавил анализ пакетов в CI
  ([b1d8b9b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b1d8b9b294d30fca61e41fa45180fbcfecd9765d))
- убрал анализатор пакетов из зависимостей репозитория
  ([1168ec3](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/1168ec348d037d6c891c625d6202ece86d9c7ca5))

### Новый функционал

- **typography-service:** implement component
  ([5bea9d1](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5bea9d16751a5366cf5191d7e429a75c8c6cbc78))
- **typography-service:** implement component
  ([25e0ed0](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/25e0ed00ec62d436034092de460c6e7b6c2fa80d))
- update snapshots
  ([6954b34](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/6954b340dd9957fb5ea633bd95e67583bbd733f0))

### [0.0.25](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.24...v0.0.25) (2025-02-24)

### Другое

- **commitizen:** переключил конфигурацию commitizen на собственный адаптер
  ([4d8b6c1](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4d8b6c1ea2b5e55f73fdcac0cabb723698f6d887))
- **repo:** перенёс конфигурацию CI в настройки GitLab, добавил бейджи в ридми
  ([8ab89d5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/8ab89d5e4c9c9ed4127565db945de6d71fdb51ae))

### Рефакторинг

- **skeleton:** изменена передача свойств
  ([e317f92](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e317f924d3c0e70269df9dfc9cedc7021cfcc920))

### [0.0.24](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.23...v0.0.24) (2025-02-21)

### Bug Fixes

- добавлен стиль mixBlendMode у компонентов Chip, RadioButton
  ([8254802](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/82548028f8298508028b53a1346d5aa6c5c8a972))

### [0.0.23](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.22...v0.0.23) (2025-02-14)

### Bug Fixes

- **menu-template-item:** another fix for extra item position
  ([7167aad](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/7167aad7f7f46b7c2c2788bd611636f5a2effc80))

### [0.0.22](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.21...v0.0.22) (2025-02-14)

### Bug Fixes

- **accessibility:** добавлен проброс testID и accessibility свойств
  ([c696d4c](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c696d4cd6b58e2027e8cc0a45f1deb598f85be7e))

### [0.0.21](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.20...v0.0.21) (2025-02-14)

### Bug Fixes

- **menu-item-template:** width of the component is set to 100% of the parent
  ([b5f8344](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b5f8344d18a7587946b7690f7353eaadcd32d683))

### [0.0.20](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.19...v0.0.20) (2025-02-13)

### Features

- **checkbox:** add component
  ([237de41](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/237de41eac5e43a20a8981e07162199fcbfb351b))

### [0.0.19](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.18...v0.0.19) (2025-02-06)

### Bug Fixes

- **ci:** исправления сборки в CI после смены раннера
  ([a1371b8](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a1371b8489728c9b1f068982844a2335551c81b7))
- **ci:** попытка исправить сборку сторибука
  ([a1c358f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a1c358f77c4ea252c275170479b0e23763aca6b6))

### [0.0.18](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.17...v0.0.18) (2025-02-05)

### Features

- **app:** обновил testing library react native
  ([073a54f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/073a54f20c0beac7e2be728b4b88c6c3c6a60468))
- **app:** обновление react-native-reanimated
  ([08dda15](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/08dda152e8488dd131e7ac85215ffb6be852edeb))
- **app:** обновление нативных и ненативных библиотек экосистемы Expo и RN
  ([57e697d](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/57e697d1082e554615ed4322cc9015b6198995f7))

### Bug Fixes

- **app:** исправил ошибки tsc и обновил Podfile.lock
  ([4f37ab6](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4f37ab68e69a736747a5c1c05e6a0911cad337e3))

### [0.0.17](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.16...v0.0.17) (2025-02-04)

### Bug Fixes

- **menuitemtemplateprops:** добавлен экспорт MenuItemTemplateProps
  ([e4eed81](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e4eed818ada0163122c6580b9ebbd3592be93977))

### [0.0.16](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.15...v0.0.16) (2025-01-31)

### Features

- **menuitemtemplate:** добавлен визуальный стиль для нажатого состояния
  ([0609e5d](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/0609e5dde20e73b191286f87fe059a423d55fcc5))

### [0.0.15](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.14...v0.0.15) (2025-01-30)

### [0.0.14](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.13...v0.0.14) (2025-01-30)

### Features

- **menuitemtemplate:** Добавлены свойства для паддингов сверху и снизу от
  контента
  ([f860926](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/f8609267377fd2813ec0245fac4a43835edb2203))
- **slider:** changed on React native gesture handler
  ([94735a8](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/94735a86a7915be5bb8addcfe901ac0dd7771e0c))
- **slider:** fix
  ([96de913](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/96de913b51dc4164561d015975dfe210c9a408a8))
- **slider:** fix
  ([4e6d3eb](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4e6d3eb0c737882708b7768dc02c355e1c45c093))
- **slider:** fix
  ([2d8acc9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/2d8acc95a8f8b19c6787f8835e4aea2e772e224b))
- **slider:** fix
  ([a4c4f4e](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a4c4f4ef270862a37581e0f2d6f7f7a1caec019e))
- **slider:** fix
  ([9c037fd](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/9c037fda92445d7b9e1d08d0dbc3f7842f00e7cc))
- **slider:** fix
  ([20f9d4c](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/20f9d4c5ac137fbe4dddf34d0efeedce8a2b76c6))
- **slider:** implement Slider component
  ([1f715cd](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/1f715cd1484ab17ad0dcfc3ba73628a04579ed8d))
- **tabs:** add highlight when pressed
  ([ed7a3c5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/ed7a3c5eb74cadbbcbb79d291d9c8dacf0988b50)),
  closes
  [#34](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/issues/34)

### [0.0.13](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.12...v0.0.13) (2025-01-24)

### Features

- **buttonbadge:** add component for button with badge
  ([01d51e0](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/01d51e02bd7577ddf9b7b22d2f0aa04b48475600))
- **inputswitch:** add custom switch component
  ([0c20a8b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/0c20a8b82d8a2324d68f76034a85885bb971f9be))
- **ProgressBar:** реализация компонента ProgressBar
  ([6841f60](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/6841f60f84a57f1af4ea51f9481d04eede52b8e7))
- **rating:** add Rating component
  ([5be32e4](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5be32e46a23937ba2427afbc3cf8c215f17577db))
- **rating:** add RatingClear component
  ([18a66d2](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/18a66d26fcc13a0497fb4923007a540e48b3b460))
- **Rating:** add RatingItem component
  ([ffef232](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/ffef23274aacbfadeecc8c112e955014eaa4224c))

### Bug Fixes

- **buttonbadge:** fix storybook props
  ([eb31535](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/eb31535fc0311b8a97b70023837e3da83f9d97f6))

### [0.0.12](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.11...v0.0.12) (2025-01-21)

### Features

- **InputTextBase:** add function for rendering custom input
  ([9dfcd36](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/9dfcd3660ee465c5cdc669d333da1f4a4b0bc28d))

### [0.0.11](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.10...v0.0.11) (2025-01-16)

### [0.0.10](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.9...v0.0.10) (2025-01-16)

### Features

- **chip:** implement Chip component
  ([0c95a9f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/0c95a9fa3abdb0d4d85bc5d74f871a894e670fe8)),
  closes
  [#23](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/issues/23)
- **ProgressSpinner:** implement ProgressSpinner component
  ([90745a5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/90745a5087ebd75d1d0fdad0501ac3aa3e03bf3d))

### Bug Fixes

- **chips:** tests
  ([b677615](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b6776152a06b54bf686452b8f4093ba54f9a9495))

### [0.0.9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.8...v0.0.9) (2024-12-12)

### Features

- **FloatLabel:** implement input with floating label
  ([4d56a0b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4d56a0b1681011f6e61578d10eb7abd4e4df3747))
- **Message:** implement Message component
  ([7b2fee0](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/7b2fee050c0293f323211d2a4f5c806ed5eda118))
- **radiobutton:** implement RadioButton component
  ([6af3de2](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/6af3de24e181662bb98dba0635881995ff5f1996))
- **Skeleton:** implement skeleton loader
  ([b1cd04c](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b1cd04c8cb5c34331c5dec9fab243c67db04632a))
- **theme:** add opportunity for adding custom style tokens
  ([608a29b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/608a29ba1d5c6df88920aaaf82a749d5372e79fa))

### Bug Fixes

- **InputGroupAddon:** fix background color
  ([e798b9d](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e798b9d237a6ac1993929a503c9dd458c995c86c))

### [0.0.8](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.7...v0.0.8) (2024-12-03)

### Features

- **SelectButton:** implement SelectButton component
  ([d14be71](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/d14be71af8e8a352f87c820fefe7cce56fc2ac00))

### [0.0.7](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.6...v0.0.7) (2024-11-26)

### Features

- **Subtitle:** implement Subtitle component
  ([1f4df4b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/1f4df4b6c016b9606e937a9956175a2f9aa0b6a9))

### Bug Fixes

- **Divider:** implement Divider component
  ([186f685](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/186f685c6b5f51b2a3514b6b2a3357536b6445af))
- **menuitemtemplate:** Фикс позиционирования заголовка при отсутствии
  подзаголовка. Добавлен параметр цвета в иконке.
  ([6cd5280](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/6cd52806581d834aa718183c831514e330d17135))
- **Subtitle:** fix passing styles and children
  ([21c050c](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/21c050c50fe8103f1bf9d193102b32d30a6f3352))

### [0.0.6](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.5...v0.0.6) (2024-11-19)

### Bug Fixes

- fix text vertical align for Android
  ([c0928be](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c0928becefa26e3319a4da44dc2e586455f32557))

### [0.0.5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.4...v0.0.5) (2024-11-15)

### Features

- **Tag:** implement Tag component
  ([7d4dec2](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/7d4dec2d5436e304c33e268765ef22a286f6bf28))
- **Tag:** restrict number of lines
  ([5531b21](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/5531b211fe81bb31f187d9251b63312bf7b70b81))

### [0.0.4](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.3...v0.0.4) (2024-11-13)

### Bug Fixes

- **ToggleButton:** fix exports
  ([e9d29ef](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e9d29ef0a91b8b792c4ad1a879524682e985bdb0))

### 0.0.3 (2024-11-11)

### Features

- **button:** add ButtonSeverity component
  ([c16fcfe](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/c16fcfe238467a4f19b211a9632e7dc3e578f0b3))
- **button:** implement base button with all possible states
  ([a2e3303](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a2e33037b799f2cf035207b90f0fd6965cbe8256))
- **button:** use hover state instead of focus for pressed styles
  ([52a55c5](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/52a55c562686100344543017c2dbda9756c8fa2c))
- **menuitemtemplate:** added disabled state
  ([42728cb](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/42728cba1893d815e51eab44214ff0231a8871e5))
- **menuitemtemplate:** added extra content
  ([e2a9bd4](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/e2a9bd4a5f7ec6915951eee4fbfbd3ecc5c835a0))
- **menuitemtemplate:** added icon
  ([23d1a48](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/23d1a48be7cce45af5bb894a123b0b0efb72af35))
- **menuitemtemplate:** added separator
  ([aa2a92e](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/aa2a92e325037459563bdd56ac90712856f4a77d))
- **menuitemtemplate:** badge is positioned according to design
  ([765318b](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/765318b26893c8cf8cba278f852d3232687c30f6))
- **menuitemtemplate:** menu item with text and accessories
  ([392bf89](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/392bf8942dfe1fdd8f6941d82fc19d920fc6f6d1))
- **menuitemtemplate:** right icon is now at right when stretching
  ([ed9740a](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/ed9740ac8073a32261be6bf6982b0c0e78964177))
- **storybook:** change storybook theme for larger text sizes
  ([234bdec](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/234bdec6d069d8611a67fac00d73b7c5f0fa0e26))
- **ToggleButton:** implement ToggleButton component
  ([84cb6e9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/84cb6e99cd7e179b29f093d6d7ecaa1ac9dc60f2))

### Bug Fixes

- **badge:** fix badge layout for iOS
  ([a6498cd](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a6498cd411d3a167482f1c4fbffd18f8105b769e))
- **input:** fix input layouts
  ([a35680f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/a35680fe2a227c6de3f08f37ed0bc9faef6a1a1b))

### [0.0.2](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/compare/v0.0.1...v0.0.2) (2024-10-24)

### Features

- **components:** add Avatar component
  ([f4b54c1](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/f4b54c167c602d6d2741b780de757af0ba9f2840))
- **components:** add Badge component
  ([48590fa](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/48590fae8f52d349096b6ab925a2b20e3249e5b8))
- **components:** added InputText and InputGroup components
  ([28e64cc](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/28e64ccbd5ac92afc32cac4b147e151dde900441))
- **development:** add Storybook
  ([fe1c315](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/fe1c3150e068756c98b67e00b572059c3a3753f8))
- **development:** added Expo project into library for development
  ([1ab12da](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/1ab12da32725740b7c4c97c37be30172203ce562))
- **icons:** added Tabler icons as peer dependency of UI kit
  ([7970de0](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/7970de0a04a6761229a9a261bf9ab826290aba47))
- **storybook:** add icon and splash screen for storybook app
  ([125eac9](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/125eac97c6499c02c315f29ce68cfb1893731e58))

### Bug Fixes

- **build:** fix package build
  ([483496f](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/483496fd18a1822c9bf55e35000c85201cd07af6))
- **ci:** fix CI sh script
  ([f720c91](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/f720c91e9f92ed55448d790d968616edea565e45))
- **dependencies:** add react-native-svg as dev and peer dependency
  ([294ebbf](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/294ebbf388cab2add4f781ac652042ca309d0b2f))
- **package:** add scripts to result package
  ([73c5bfe](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/73c5bfe4a06987d33bfc2b67afb92a70458582db))
- **package:** fix package contents during publishing
  ([3d040ff](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/3d040ff2aadcd4762ef7e5b031d6dd630dd83e22))
- **yarn:** add afterInstall yarn plugin
  ([4b005b0](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/4b005b0f1e9ed58bc7c8a9afdfa2ce3bb23887eb))

### 0.0.1 (2024-10-21)

### Bug Fixes

- **ci:** fix command in ci script
  ([d6220d8](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/d6220d8d29d1947e1613c5dfa5134e5dc25743c0))
- **publish:** add required dependencies to alpha build environment
  ([8551c23](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/8551c2309d67cb84f945a4ca5fdf85305fbf5291))
- **publish:** fix adding comment to Gitlab
  ([b3ea343](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/b3ea3439b68b318d68fe2879ef13b865264fc99b))
- **publish:** fix alpha publish comment
  ([1278829](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/12788296778e36be5dd0413ab3addb99ed24cc45))
- **publish:** fix npm repo
  ([2c2b88d](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/2c2b88dfa13ba795dfb36fef18b9bec3113950c9))
- **publish:** try to fix publishing package
  ([6b3f095](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/6b3f09574489e36ffea23d316c3749c504f2d920))
- **review:** fix review runner config
  ([83c9260](https://gitlab.cdek.ru/react-native/react-native-prime-ui-kit/commit/83c9260b954636dd4e478edcf06191bf7dfd8b5a))
