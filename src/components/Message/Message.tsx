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
  (t: ThemeType['components']) => string
> = {
  info: (t) => t.message.extend.extInfo.color,
  success: (t) => t.message.extend.extSuccess.color,
  warning: (t) => t.message.extend.extWarn.color,
  danger: (t) => t.message.extend.extError.color,
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
            uniProps={({ components }) => ({
              color: messageIconColor[severity](components),
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

// TODO(tokens-migration): reason=value-mismatch; legacy=border.Width.border-3; value=3; target=components.message.extend.extAccentLine.width; targetValue=4
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-5; value=17.5; target=components.message.content.padding; targetValue=14
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-1; value=3.5; target=components.message.extend.extText.gap; targetValue=4
// TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-4xl; value=31.5; target=components.message.icon.size; targetValue=36
const messageStyles = StyleSheet.create(
  ({ components, typography, spacing, border }) => ({
    container: {
      borderRadius: components.message.root.borderRadius,
      borderWidth: border.Width.border,
      overflow: 'hidden',
      variants: {
        severity: {
          info: {
            borderColor: components.message.colorScheme.info.borderColor,
            backgroundColor: components.message.colorScheme.info.background,
          },
          success: {
            borderColor: components.message.colorScheme.success.borderColor,
            backgroundColor: components.message.colorScheme.success.background,
          },
          warning: {
            borderColor: components.message.colorScheme.warn.borderColor,
            backgroundColor: components.message.colorScheme.warn.background,
          },
          danger: {
            borderColor: components.message.colorScheme.error.borderColor,
            backgroundColor: components.message.colorScheme.error.background,
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
          info: {
            borderColor: components.message.colorScheme.info.borderColor,
          },
          success: {
            borderColor: components.message.colorScheme.success.borderColor,
          },
          warning: {
            borderColor: components.message.colorScheme.warn.borderColor,
          },
          danger: {
            borderColor: components.message.colorScheme.error.borderColor,
          },
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
