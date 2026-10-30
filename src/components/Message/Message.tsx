import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react-native'
import { Children, memo, type ReactNode } from 'react'
import {
  type AccessibilityProps,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { Body, Caption } from '../Typography'

import { styles } from './Message.styles'
import { MessageCloseButton } from './MessageCloseButton'
import { type MessageSeverity, severityKey } from './constants'
import { Timer } from './internal/Timer'
import { TestId } from './testIds'

export interface MessageProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Заголовок */
  title: string
  /** Произвольное содержимое тела компонента */
  body?: ReactNode
  /** Подпись под заголовком */
  caption?: string
  /** Независимая нода под содержимым, чаще всего кнопки */
  footer?: ReactNode

  /**
   * Обработчик нажатия на кнопку закрытия.
   * Кнопка не отображается, если обработчик не передан.
   */
  onClose?: () => void

  /**
   * Текст на кнопке закрытия тоста
   * Если не указан, в кнопке отображается иконка "крестик"
   * Это свойство игнорируется если onClose = undefined
   */
  closeLabel?: string
  /** Доступное имя крестика, по умолчанию «Закрыть». Для текстовой кнопки игнорируется */
  closeAccessibilityLabel?: string
  /** Обработчик истечения таймера. Вызывается однократно после окончания отсчёта. Сообщение остаётся видимым */
  onTimerFinish?: () => void

  /**
   * Выбор варианта стиля компонента
   * @default 'info'
   */
  severity?: MessageSeverity

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
  /** Положительная длительность в секундах. Таймер заменяет иконку, 0 выключает отсчёт */
  timerValue?: number

  /**
   * SVG-иконка.
   * Дефолтные значения:
   * <pre>
   * IconInfoCircle для severity='info'
   * IconCircleCheck для severity='success'
   * IconAlertTriangle для severity='warning'
   * IconCircleX для severity='danger'
   * </pre>
   */
  Icon?: SvgSource

  /**
   * Признак скрытия иконки пользовательской или дефолтной. Не скрывает работающий таймер
   * @default false
   */
  hiddenIcon?: boolean
}

const icons = {
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  danger: IconAlertCircle,
}

const decorativeProps = {
  accessible: false,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const

/**
 * Сообщение со статусом, произвольным содержимым и необязательными действиями.
 * Вложенные действия доступны отдельно. Объявление сообщения обеспечивает потребитель.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=15963-3163&m=dev
 */
export const Message = memo<MessageProps>(
  ({
    title,
    body,
    caption,
    footer,
    onClose,
    closeLabel,
    closeAccessibilityLabel,
    onTimerFinish,
    severity = 'info',
    hiddenIcon = false,
    style,
    testID,
    timerValue,
    Icon = icons[severity],
    ...rest
  }) => {
    return (
      <View
        style={[styles.container(severity), style]}
        testID={testID || TestId.Container}
        {...rest}
      >
        <View
          {...decorativeProps}
          pointerEvents='none'
          style={styles.accent(severity)}
        />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            {timerValue !== undefined && timerValue > 0 ? (
              <Timer
                countFrom={timerValue}
                severity={severity}
                onFinish={onTimerFinish}
              />
            ) : hiddenIcon ? null : (
              <View
                {...decorativeProps}
                style={styles.icon}
                testID={TestId.Icon}
              >
                <SvgUniversal
                  source={Icon}
                  uniProps={({ components }) => ({
                    width: components.message.icon.size,
                    height: components.message.icon.size,
                    color:
                      components.message.colorScheme[severityKey[severity]]
                        .iconColor,
                  })}
                />
              </View>
            )}
            <View style={styles.titleTextContainer}>
              <Body
                size='lg'
                style={styles.title(severity)}
                testID={TestId.Title}
                weight='bold'
              >
                {title}
              </Body>
              {caption ? (
                <Caption
                  style={styles.caption(severity)}
                  testID={TestId.Caption}
                >
                  {caption}
                </Caption>
              ) : null}
            </View>
            <MessageCloseButton
              closeAccessibilityLabel={closeAccessibilityLabel}
              closeLabel={closeLabel}
              severity={severity}
              onClose={onClose}
            />
          </View>
          {Children.toArray(body).length > 0 ? (
            <View testID={TestId.Body}>{body}</View>
          ) : null}
          {Children.toArray(footer).length > 0 ? (
            <View style={styles.footer}>{footer}</View>
          ) : null}
        </View>
      </View>
    )
  }
)
