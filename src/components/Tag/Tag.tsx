import { memo } from 'react'
import {
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../../theme/types'
import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface TagProps
  extends AccessibilityProps, Pick<ViewProps, 'testID' | 'collapsable'> {
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

type TagSeverity = NonNullable<TagProps['severity']>

const tagIconColor: Record<TagSeverity, (t: ThemeType['theme']) => string> = {
  basic: (t) => t.Misc.Badge.badgeTextColor,
  info: (t) => t.Misc.Badge.badgeInfoTextColor,
  success: (t) => t.Misc.Badge.badgeSuccessTextColor,
  warning: (t) => t.Misc.Badge.badgeWarningTextColor,
  danger: (t) => t.Misc.Badge.badgeDangerTextColor,
  secondary: (t) => t.Misc.Badge.badgeTextColor,
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
    collapsable,
    ...rest
  }) => {
    tagStyles.useVariants({ severity })

    return (
      <View
        collapsable={collapsable}
        style={style}
        testID={testID || TagTestId.root}
        {...rest}
      >
        <View
          collapsable={collapsable}
          style={[tagStyles.container, rounded && tagStyles.roundedContainer]}
          testID={TagTestId.innerContainer}
        >
          {showIcon && Icon ? (
            <SvgUniversal
              {...tagStyles.icon}
              source={Icon}
              testID={TagTestId.icon}
              uniProps={({ theme }) => ({
                color: tagIconColor[severity](theme),
              })}
            />
          ) : null}
          <Text
            numberOfLines={1}
            style={tagStyles.text}
            testID={TagTestId.text}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }
)

const tagStyles = StyleSheet.create(
  ({ theme, border, spacing, typography, fonts }) => ({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.Gap['gap-1'],
      paddingHorizontal: theme.Misc.Tag.tagPadding,
      height: theme.Misc.Tag.tagHeight,
      borderRadius: border.Radius['rounded-lg'],
      variants: {
        severity: {
          basic: { backgroundColor: theme.Misc.Badge.badgeBg },
          info: {
            backgroundColor: theme.Button.Severity.Info.Basic.infoButtonBg,
          },
          success: {
            backgroundColor:
              theme.Button.Severity.Success.Basic.successButtonBg,
          },
          warning: {
            backgroundColor:
              theme.Button.Severity.Warning.Basic.warningButtonBg,
          },
          danger: {
            backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
          },
          secondary: { backgroundColor: theme.Surface['surface-border'] },
        },
      },
    },
    roundedContainer: { borderRadius: border.Radius['rounded-full'] },
    icon: {
      width: theme.Misc.Tag.tagFontSize,
      height: theme.Misc.Tag.tagFontSize,
    },
    text: {
      flexShrink: 1,
      fontSize: typography.Size['text-xs'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
      variants: {
        severity: {
          basic: { color: theme.Misc.Badge.badgeTextColor },
          info: { color: theme.Misc.Badge.badgeInfoTextColor },
          success: { color: theme.Misc.Badge.badgeSuccessTextColor },
          warning: { color: theme.Misc.Badge.badgeWarningTextColor },
          danger: { color: theme.Misc.Badge.badgeDangerTextColor },
          secondary: { color: theme.Misc.Badge.badgeTextColor },
        },
      },
    },
  })
)

export const TagTestId = {
  root: 'Tag',
  innerContainer: 'Tag.innerContainer',
  icon: 'Tag.icon',
  text: 'Tag.text',
}
