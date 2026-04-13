import { memo } from 'react'
import {
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'

import { StyleSheet } from '../../utils'
import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface TagProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Текст */
  readonly text: string

  /** true, если необходимо полное скругление углов компонента */
  readonly rounded?: boolean

  /**
   *  Выбор варианта стиля компонента
   *  @default 'basic'
   */
  readonly severity?:
    | 'basic'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'secondary'

  /**
   * Показать или скрыть иконку внутри компонента
   * @default true
   */
  readonly showIcon?: boolean

  /** Дополнительная стилизация для контейнера компонента */
  readonly style?: StyleProp<ViewStyle>

  /** SVG-иконка */
  readonly Icon?: SvgSource
}

/**
 * Используется для маркировки элементов интерфейса
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4921
 */
export const Tag = memo(
  ({
    text,
    rounded,
    severity = 'basic',
    showIcon = true,
    style,
    Icon,
    testID,
    ...rest
  }: TagProps) => {
    tagStyles.useVariants({ severity })

    return (
      <View style={style} testID={testID || TagTestId.root} {...rest}>
        <View
          style={[tagStyles.container, rounded && tagStyles.roundedContainer]}
          testID={TagTestId.innerContainer}
        >
          {showIcon && Icon ? (
            <SvgUniversal
              color={tagStyles.text.color}
              height={tagStyles.icon.height}
              source={Icon}
              testID={TagTestId.icon}
              width={tagStyles.icon.width}
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
