import { memo } from 'react'
import {
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { makeStyles } from '../../utils/makeStyles'

export interface TagProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
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

  /** SVG-иконка */
  Icon?: SvgSource
}

/**
 * Используется для маркировки элементов интерфейса
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4921
 */
export const Tag = memo<TagProps>(
  ({
    text,
    rounded,
    severity = 'basic',
    showIcon = true,
    style,
    Icon,
    testID,
    ...rest
  }) => {
    const styles = useStyles()

    return (
      <View style={style} testID={testID || TagTestId.root} {...rest}>
        <View
          style={[
            styles.container,
            styles[severity],
            rounded && styles.roundedContainer,
          ]}
          testID={TagTestId.innerContainer}
        >
          {showIcon && Icon ? (
            <SvgUniversal
              color={styles[`text${severity}`].color}
              height={styles.icon.height}
              source={Icon}
              testID={TagTestId.icon}
              width={styles.icon.width}
            />
          ) : null}
          <Text
            numberOfLines={1}
            style={[styles.text, styles[`text${severity}`]]}
            testID={TagTestId.text}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }
)

const useStyles = makeStyles(
  ({ theme, border, spacing, typography, fonts }) => ({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.Gap['gap-1'],
      paddingHorizontal: theme.Misc.Tag.tagPadding,
      height: theme.Misc.Tag.tagHeight,
      borderRadius: border.Radius['rounded-lg'],
    },
    roundedContainer: { borderRadius: border.Radius['rounded-full'] },
    icon: {
      width: theme.Misc.Tag.tagFontSize,
      height: theme.Misc.Tag.tagFontSize,
      color: theme.Misc.Badge.badgeTextColor,
    },
    text: {
      flexShrink: 1,
      fontSize: typography.Size['text-xs'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
    },
    textbasic: { color: theme.Misc.Badge.badgeTextColor },
    textinfo: { color: theme.Misc.Badge.badgeInfoTextColor },
    textwarning: { color: theme.Misc.Badge.badgeWarningTextColor },
    textsuccess: { color: theme.Misc.Badge.badgeSuccessTextColor },
    textdanger: { color: theme.Misc.Badge.badgeDangerTextColor },
    textsecondary: { color: theme.Misc.Badge.badgeTextColor },
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
    secondary: { backgroundColor: theme.Surface['surface-border'] },
  })
)

export const TagTestId = {
  root: 'Tag',
  innerContainer: 'Tag.innerContainer',
  icon: 'Tag.icon',
  text: 'Tag.text',
}
