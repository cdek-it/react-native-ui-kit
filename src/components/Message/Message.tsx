import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { memo, type ComponentProps, type ReactNode, useMemo } from 'react'
import {
  type AccessibilityProps,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../../theme/types'
import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { ButtonSeverity } from '../Button/ButtonSeverity'
import { Timer } from '../Timer/Timer'
import { Body, Caption } from '../Typography'

export interface MessageProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Текст заголовка */
  title: string

  /** Тело сообщения */
  body?: ReactNode

  /** Текст подписи */
  caption?: string

  /** Футер сообщения */
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

  /** Срабатывает при истечении таймера */
  onTimerFinish?: () => void

  /**
   * Выбор варианта стиля компонента
   * @default 'info'
   */
  severity?: 'info' | 'success' | 'warning' | 'danger'

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>

  /** Значение таймера, если нужно отображать таймер вместо иконки */
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
   * Скрыть иконку.
   * Позволяет скрывать установленные или дефолтные иконки
   * Дефолтное значение: false
   */
  hiddenIcon?: boolean
}

type MessageSeverityKey = NonNullable<MessageProps['severity']>

const messageIconColor: Record<
  MessageSeverityKey,
  (t: ThemeType['theme']) => string
> = {
  info: (t) => t.Message.extInfo.color,
  success: (t) => t.Message.extSuccess.color,
  warning: (t) => t.Message.extWarn.color,
  danger: (t) => t.Message.extError.color,
}

/**
 * Унифицированный компонент, который используется для отображения информационных сообщений
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=562-2947
 */
export const Message = memo<MessageProps>(
  ({
    title,
    body,
    caption,
    footer,
    onClose,
    closeLabel,
    onTimerFinish,
    severity = 'info',
    hiddenIcon = false,
    style,
    testID,
    timerValue,
    Icon: IconProp,
    ...rest
  }) => {
    messageStyles.useVariants({ severity })

    const Icon = useMemo(() => {
      if (IconProp) {
        return IconProp
      }

      switch (severity) {
        case 'info':
          return IconInfoCircle

        case 'success':
          return IconCircleCheck

        case 'warning':
          return IconAlertTriangle

        case 'danger':
          return IconAlertCircle
      }
    }, [IconProp, severity])

    const button = useMemo(() => {
      if (!onClose) {
        return null
      }

      const buttonCommonProps: Omit<
        ComponentProps<typeof ButtonSeverity>,
        'iconOnly' | 'Icon' | 'iconPosition' | 'label'
      > = { severity, size: 'small', variant: 'outlined', onPress: onClose }

      if (closeLabel) {
        return (
          <ButtonSeverity
            label={closeLabel}
            {...buttonCommonProps}
            testID={TestId.CloseButton}
          />
        )
      }

      return (
        <ButtonSeverity
          iconOnly
          Icon={IconX}
          {...buttonCommonProps}
          testID={TestId.CloseButton}
        />
      )
    }, [closeLabel, onClose, severity])

    const LeftContent = useMemo(() => {
      if (timerValue) {
        return <Timer countFrom={timerValue} onFinish={onTimerFinish} />
      }

      if (!hiddenIcon) {
        return (
          <SvgUniversal
            {...messageStyles.iconSize}
            source={Icon}
            testID={TestId.Icon}
            uniProps={({ theme }) => ({
              color: messageIconColor[severity](theme),
            })}
          />
        )
      }

      return undefined
    }, [hiddenIcon, Icon, onTimerFinish, severity, timerValue])

    return (
      <View
        accessible
        style={[messageStyles.container, style]}
        testID={testID || TestId.Container}
        {...rest}
      >
        <View style={messageStyles.content}>
          <View style={messageStyles.titleRow}>
            {LeftContent}
            <View style={messageStyles.titleTextContainer}>
              <Body base testID={TestId.Title} weight='bold'>
                {title}
              </Body>
              {caption ? (
                <Caption testID={TestId.Caption}>{caption}</Caption>
              ) : null}
            </View>
            {button}
          </View>
          {body ? <View testID={TestId.Body}>{body}</View> : null}
          {footer}
        </View>
      </View>
    )
  }
)

const messageStyles = StyleSheet.create(
  ({ theme, typography, spacing, border }) => ({
    container: {
      borderRadius: theme.Message.borderRadius,
      borderWidth: border.Width.border,
      overflow: 'hidden',
      variants: {
        severity: {
          info: {
            borderColor: theme.Message.info.borderColor,
            backgroundColor: theme.Message.info.background,
          },
          success: {
            borderColor: theme.Message.success.borderColor,
            backgroundColor: theme.Message.success.background,
          },
          warning: {
            borderColor: theme.Message.warn.borderColor,
            backgroundColor: theme.Message.warn.background,
          },
          danger: {
            borderColor: theme.Message.error.borderColor,
            backgroundColor: theme.Message.error.background,
          },
        },
      },
    },
    content: {
      flexGrow: 1,
      borderLeftWidth: border.Width['border-3'] - border.Width.border,
      padding: spacing.Padding['p-4'],
      paddingLeft: spacing.Padding['p-5'],
      gap: spacing.Gap['gap-4'],
      variants: {
        severity: {
          info: { borderColor: theme.Message.info.borderColor },
          success: { borderColor: theme.Message.success.borderColor },
          warning: { borderColor: theme.Message.warn.borderColor },
          danger: { borderColor: theme.Message.error.borderColor },
        },
      },
    },
    titleRow: { flexDirection: 'row', gap: spacing.Gap['gap-4'] },
    titleTextContainer: {
      flex: 1,
      alignSelf: 'center',
      gap: spacing.Gap['gap-1'],
    },
    iconSize: {
      width: typography.Size['text-4xl'],
      height: typography.Size['text-4xl'],
    },
  })
)

export enum TestId {
  Container = 'MessageContainer',
  CloseButton = 'CloseButton',
  Title = 'Title',
  Caption = 'Caption',
  Body = 'Body',
  Icon = 'Icon',
}
