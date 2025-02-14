import {
  type Icon,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { type AccessibilityProps, View, type ViewProps, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'
import { ButtonSeverity } from '../Button/ButtonSeverity'
import { Timer } from '../Timer/Timer'
import { Body, Caption } from '../Typography'

export interface MessageProps extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Текст заголовка */
  title: string

  /** Тело сообщения */
  body?: React.ReactNode

  /** Текст подписи */
  caption?: string

  /** Футер сообщения */
  footer?: React.ReactNode

  /**
   * Обработчик нажатия на кнопку закрытия.
   * Кнопка не отображается, если обработчик не передан.
   */
  onClose?: () => void

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
   * Иконка из набора Tabler.
   * Дефолтные значения:
   * <pre>
   * IconInfoCircle для severity='info'
   * IconCircleCheck для severity='success'
   * IconAlertTriangle для severity='warning'
   * IconCircleX для severity='danger'
   * </pre>
   */
  Icon?: Icon
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
    onTimerFinish,
    severity = 'info',
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
          return IconCircleX
      }
    }, [IconProp, severity])

    return (
      <View
        style={[styles.container, styles[severity], style]}
        testID={testID || TestId.Container}
        {...rest}
      >
        <View style={styles.titleRow}>
          {timerValue ? (
            <Timer countFrom={timerValue} onFinish={onTimerFinish} />
          ) : (
            <Icon
              color={styles[severity].borderLeftColor}
              height={styles.iconSize.height}
              width={styles.iconSize.width}
            />
          )}

          <View style={styles.titleTextContainer}>
            <Body base weight='bold'>
              {title}
            </Body>
            {caption && <Caption color='secondary'>{caption}</Caption>}
          </View>

          {onClose && (
            <ButtonSeverity
              iconOnly
              Icon={IconX}
              severity={severity}
              size='small'
              testID={TestId.CloseButton}
              variant='outlined'
              onPress={onClose}
            />
          )}
        </View>
        {body}
        {footer}
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, typography, spacing }) => ({
  container: {
    padding: spacing.Padding['p-4'],
    paddingLeft: 17,
    gap: spacing.Gap['gap-4'],
    borderRadius: theme.General.borderRadius,
    borderWidth: 1,
    borderLeftWidth: 3.5,
    overflow: 'hidden',
  },
  info: {
    borderTopColor: theme.Message.Severities.Info.infoMessageBorderColor,
    borderRightColor: theme.Message.Severities.Info.infoMessageBorderColor,
    borderBottomColor: theme.Message.Severities.Info.infoMessageBorderColor,
    borderLeftColor: theme.Message.Severities.Info.infoMessageIconColor,
    backgroundColor: theme.Message.Severities.Info.infoMessageBg,
  },
  success: {
    borderTopColor: theme.Message.Severities.Success.successMessageBorderColor,
    borderRightColor: theme.Message.Severities.Success.successMessageBorderColor,
    borderBottomColor: theme.Message.Severities.Success.successMessageBorderColor,
    borderLeftColor: theme.Message.Severities.Success.successMessageIconColor,
    backgroundColor: theme.Message.Severities.Success.successMessageBg,
  },
  warning: {
    borderTopColor: theme.Message.Severities.Warning.warningMessageBorderColor,
    borderRightColor: theme.Message.Severities.Warning.warningMessageBorderColor,
    borderBottomColor: theme.Message.Severities.Warning.warningMessageBorderColor,
    borderLeftColor: theme.Message.Severities.Warning.warningMessageIconColor,
    backgroundColor: theme.Message.Severities.Warning.warningMessageBg,
  },
  danger: {
    borderTopColor: theme.Message.Severities.Danger.dangerMessageBorderColor,
    borderRightColor: theme.Message.Severities.Danger.dangerMessageBorderColor,
    borderBottomColor: theme.Message.Severities.Danger.dangerMessageBorderColor,
    borderLeftColor: theme.Message.Severities.Danger.dangerMessageIconColor,
    backgroundColor: theme.Message.Severities.Danger.dangerMessageBg,
  },
  titleRow: {
    flexDirection: 'row',
    gap: spacing.Gap['gap-4'],
  },
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
  Container = 'Message_Container',
  CloseButton = 'Message_CloseButton',
}
