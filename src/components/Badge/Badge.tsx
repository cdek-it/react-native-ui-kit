import { memo } from 'react'
import {
  type AccessibilityProps,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { makeStyles } from '../../utils/makeStyles'

export type BadgeSeverity = 'basic' | 'info' | 'success' | 'warning' | 'danger'

interface BadgeBase
  extends AccessibilityProps,
    Pick<ViewProps, 'onLayout' | 'testID'> {
  /**
   * Выбор варианта стиля компонента
   * @default 'basic'
   */
  severity?: BadgeSeverity
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
}

interface BadgeText extends BadgeBase {
  /** Текст внутри бейджа **/
  children: string
  /** Отображать бейдж в форме точки **/
  dot?: never
}

interface BadgeDot extends BadgeBase {
  /** Отображать бейдж в форме точки **/
  dot: true
  /** Текст внутри бейджа **/
  children?: never
}

export type BadgeProps = BadgeText | BadgeDot

/**
 * Компонент Badge
 * @param children - Текст внутри бейджа
 * @param dot - Отображать бейдж в форме точки
 * @param severiy - Выбор варианта стиля компонента
 * @param style - Дополнительная стилизация для контейнера компонента
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4871&m=dev
 */
export const Badge = memo<BadgeProps>(
  ({ children, dot, severity = 'basic', style, ...rest }) => {
    const styles = useStyles()

    return (
      <View style={[styles.container, style]} {...rest}>
        {dot ? (
          <View style={[styles.dot, styles[severity]]} />
        ) : (
          <View style={[styles.textBadgeContainer, styles[severity]]}>
            <Text style={styles.textBadge}>{children}</Text>
          </View>
        )}
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: { alignItems: 'flex-start' },
  dot: {
    width: theme.Misc.Badge.badgeDotSize,
    height: theme.Misc.Badge.badgeDotSize,
    borderRadius: 100,
  },
  textBadgeContainer: {
    height: theme.Misc.Badge.badgeHeight,
    paddingHorizontal: theme.Misc.Tag.tagPadding,
    paddingVertical: theme.Misc.Chip.chipPaddingTopBottom,
    justifyContent: 'center',
    borderRadius: 100,
  },
  textBadge: {
    color: theme.Misc.Badge.badgeTextColor,
    fontSize: 10.5,
    fontWeight: 700,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  basic: { backgroundColor: theme.Misc.Badge.badgeBg },
  info: { backgroundColor: theme.Button.Severity.Info.Basic.infoButtonBg },
  success: {
    backgroundColor: theme.Button.Severity.Success.Basic.successButtonBg,
  },
  warning: {
    backgroundColor: theme.Button.Severity.Warning.Basic.warningButtonBg,
  },
  danger: {
    backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
  },
}))
