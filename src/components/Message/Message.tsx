import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { type ComponentProps, memo, type ReactNode, useMemo } from 'react'
import {
  type AccessibilityProps,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { makeStyles } from '../../utils/makeStyles'
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
  style?: ViewStyle

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
    const styles = useStyles()
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
    }, [closeLabel, severity, onClose])

    const LeftContent = useMemo(() => {
      if (timerValue) {
        return <Timer countFrom={timerValue} onFinish={onTimerFinish} />
      }

      if (!hiddenIcon) {
        return (
          <SvgUniversal
            color={styles[`content${severity}`].borderColor}
            height={styles.iconSize.height}
            source={Icon}
            testID={TestId.Icon}
            width={styles.iconSize.width}
          />
        )
      }

      return undefined
    }, [timerValue, hiddenIcon, onTimerFinish, Icon, styles, severity])

    return (
      <View
        accessible
        style={[styles.container, styles[severity], style]}
        testID={testID || TestId.Container}
        {...rest}
      >
        <View style={[styles.content, styles[`content${severity}`]]}>
          <View style={styles.titleRow}>
            {LeftContent}
            <View style={styles.titleTextContainer}>
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

const useStyles = makeStyles(({ theme, typography, spacing, border }) => ({
  container: {
    borderRadius: theme.General.borderRadiusXL,
    borderWidth: border.Width.border,
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    borderLeftWidth: border.Width['border-3'] - border.Width.border,
    padding: spacing.Padding['p-4'],
    paddingLeft: spacing.Padding['p-5'],
    gap: spacing.Gap['gap-4'],
  },
  info: {
    borderColor: theme.Message.Severities.Info.infoMessageBorderColor,
    backgroundColor: theme.Message.Severities.Info.infoMessageBg,
  },
  contentinfo: {
    borderColor: theme.Message.Severities.Info.infoMessageIconColor,
  },
  success: {
    borderColor: theme.Message.Severities.Success.successMessageBorderColor,
    backgroundColor: theme.Message.Severities.Success.successMessageBg,
  },
  contentsuccess: {
    borderColor: theme.Message.Severities.Success.successMessageIconColor,
  },
  warning: {
    borderColor: theme.Message.Severities.Warning.warningMessageBorderColor,
    backgroundColor: theme.Message.Severities.Warning.warningMessageBg,
  },
  contentwarning: {
    borderColor: theme.Message.Severities.Warning.warningMessageIconColor,
  },
  danger: {
    borderColor: theme.Message.Severities.Danger.dangerMessageBorderColor,
    backgroundColor: theme.Message.Severities.Danger.dangerMessageBg,
  },
  contentdanger: {
    borderColor: theme.Message.Severities.Danger.dangerMessageIconColor,
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
}))

export enum TestId {
  Container = 'MessageContainer',
  CloseButton = 'CloseButton',
  Title = 'Title',
  Caption = 'Caption',
  Body = 'Body',
  Icon = 'Icon',
}
