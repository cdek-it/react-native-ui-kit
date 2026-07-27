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

type TagSeverity = NonNullable<TagProps['severity']>

const tagIconColor: Record<TagSeverity, (t: ThemeType['theme']) => string> = {
  basic: (t) => t.Tag.primary.color,
  info: (t) => t.Tag.info.color,
  success: (t) => t.Tag.success.color,
  warning: (t) => t.Tag.warn.color,
  danger: (t) => t.Tag.danger.color,
  secondary: (t) => t.Tag.secondary.color,
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
    tagStyles.useVariants({ severity })

    return (
      <View style={style} testID={testID || TagTestId.root} {...rest}>
        <View
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
      paddingHorizontal: spacing.Padding['p-2'],
      paddingVertical: spacing.Padding['p-1'],
      borderRadius: border.Radius['rounded-lg'],
      variants: {
        severity: {
          basic: { backgroundColor: theme.Tag.primary.background },
          info: { backgroundColor: theme.Tag.info.background },
          success: { backgroundColor: theme.Tag.success.background },
          warning: { backgroundColor: theme.Tag.warn.background },
          danger: { backgroundColor: theme.Tag.danger.background },
          secondary: { backgroundColor: theme.Tag.secondary.background },
        },
      },
    },
    roundedContainer: { borderRadius: border.Radius['rounded-full'] },
    icon: { width: theme.Tag.icon.size, height: theme.Tag.icon.size },
    text: {
      flexShrink: 1,
      fontSize: typography.Size['text-xs'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
      variants: {
        severity: {
          basic: { color: theme.Tag.primary.color },
          info: { color: theme.Tag.info.color },
          success: { color: theme.Tag.success.color },
          warning: { color: theme.Tag.warn.color },
          danger: { color: theme.Tag.danger.color },
          secondary: { color: theme.Tag.secondary.color },
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
