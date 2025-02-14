import type { Icon } from '@tabler/icons-react-native'
import React, { memo } from 'react'
import {
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface TagProps extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Текст */
  text: string

  /** true, если необходимо полное скругление углов компонента */
  rounded?: boolean

  /**
   *  Выбор варианта стиля компонента
   *  @default 'basic'
   */
  severity?: 'basic' | 'info' | 'success' | 'warning' | 'danger' | 'secondary'

  /**
   * Показать или скрыть иконку внутри компонента
   * @default true
   */
  showIcon?: boolean

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>

  /** Иконка из библиотеки Tabler */
  Icon?: Icon
}

/**
 * Используется для маркировки элементов интерфейса
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4921
 */
export const Tag = memo<TagProps>(
  ({ text, rounded, severity = 'basic', showIcon = true, style, Icon, testID, ...rest }) => {
    const styles = useStyles()

    return (
      <View style={style} testID={testID || TagTestId.root} {...rest}>
        <View
          style={[styles.container, styles[severity], rounded && styles.roundedContainer]}
          testID={TagTestId.innerContainer}
        >
          {showIcon && Icon && (
            <Icon
              height={styles.icon.height}
              style={[styles.icon, severity === 'secondary' && (styles.textSecondary as ViewStyle)]}
              testID={TagTestId.icon}
              width={styles.icon.width}
            />
          )}
          <Text
            numberOfLines={1}
            style={[styles.text, severity === 'secondary' && styles.textSecondary]}
            testID={TagTestId.text}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, border, spacing }) => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.Gap['gap-1'],
    paddingVertical: 3.35,
    paddingHorizontal: theme.Misc.Tag.tagPadding,
    borderRadius: theme.General.borderRadius,
  },
  roundedContainer: {
    borderRadius: border.Radius['rounded-full'],
  },
  icon: {
    width: theme.Misc.Tag.tagFontSize,
    height: theme.Misc.Tag.tagFontSize,
    color: theme.Misc.Badge.badgeTextColor,
  },
  text: {
    flexShrink: 1,
    fontSize: theme.Misc.Tag.tagFontSize,
    fontWeight: 700,
    color: theme.Misc.Badge.badgeTextColor,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  textSecondary: {
    color: theme.General.textSecondaryColor,
  },
  basic: {
    backgroundColor: theme.Misc.Badge.badgeBg,
  },
  info: {
    backgroundColor: theme.Button.Severity.Info.Basic.infoButtonBg,
  },
  success: {
    backgroundColor: theme.Button.Severity.Success.Basic.successButtonBg,
  },
  warning: {
    backgroundColor: theme.Button.Severity.Warning.Basic.warningButtonBg,
  },
  danger: {
    backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
  },
  secondary: {
    backgroundColor: theme.Surface['surface-border'],
  },
}))

export const TagTestId = {
  root: 'Tag',
  innerContainer: 'Tag.innerContainer',
  icon: 'Tag.icon',
  text: 'Tag.text',
}
