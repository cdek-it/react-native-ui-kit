# Legacy-токены

Токены ниже сохраняются в `assets`, пока они входят в публичные `lightTheme`,
`darkTheme` и `ThemeType`. Удалять их можно после миграции всех внутренних
потребителей и только как breaking change.

| Миграция        | Legacy-пути                                              | Замена                       | Статус                                                      |
| --------------- | -------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------- |
| Button          | `theme.Button.*`                                         | `components.button`          | Namespace ещё используется другими компонентами             |
| InputSwitch     | `theme.Form.inputSwitch.*`, `theme.custom.inputSwitch.*` | `components.toggleswitch`    | Внутри UI Kit больше не используются, кандидаты на удаление |
| ProgressSpinner | `theme.General.primaryColor`                             | `components.progressspinner` | Общий токен ещё используется другими компонентами           |
