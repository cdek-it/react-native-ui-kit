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

const tagIconColor: Record<
  TagSeverity,
  (t: ThemeType['components']) => string
> = {
  basic: (t) => t.tag.colorScheme.primary.color,
  info: (t) => t.tag.colorScheme.info.color,
  success: (t) => t.tag.colorScheme.success.color,
  warning: (t) => t.tag.colorScheme.warn.color,
  danger: (t) => t.tag.colorScheme.danger.color,
  secondary: (t) => t.tag.colorScheme.secondary.color,
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
              uniProps={({ components }) => ({
                color: tagIconColor[severity](components),
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
  ({ primitive, components, border, spacing, fonts }) => ({
    container: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-1; value=3.5; target=components.tag.root.gap; targetValue=4
      gap: spacing.Gap['gap-1'],
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-2; value=7; target=components.tag.root.paddingLeft; targetValue=8
      paddingHorizontal: spacing.Padding['p-2'],
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-1; value=3.5; target=components.tag.root.paddingTop; targetValue=4
      paddingVertical: spacing.Padding['p-1'],
      // TODO(tokens-migration): reason=value-mismatch; legacy=border.Radius.rounded-lg; value=7; target=components.tag.root.borderRadius; targetValue=8
      borderRadius: border.Radius['rounded-lg'],
      variants: {
        severity: {
          basic: {
            backgroundColor: components.tag.colorScheme.primary.background,
          },
          info: { backgroundColor: components.tag.colorScheme.info.background },
          success: {
            backgroundColor: components.tag.colorScheme.success.background,
          },
          warning: {
            backgroundColor: components.tag.colorScheme.warn.background,
          },
          danger: {
            backgroundColor: components.tag.colorScheme.danger.background,
          },
          secondary: {
            backgroundColor: components.tag.colorScheme.secondary.background,
          },
        },
      },
    },
    // TODO(tokens-migration): reason=value-mismatch; legacy=border.Radius.rounded-full; value=100; target=components.tag.root.roundedBorderRadius; targetValue=1600
    roundedContainer: { borderRadius: border.Radius['rounded-full'] },
    icon: { width: components.tag.icon.size, height: components.tag.icon.size },
    text: {
      flexShrink: 1,
      // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-xs; value=10.5; target=components.tag.root.fontSize; targetValue=12
      fontSize: primitive.fonts.fontSize[100],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
      variants: {
        severity: {
          basic: { color: components.tag.colorScheme.primary.color },
          info: { color: components.tag.colorScheme.info.color },
          success: { color: components.tag.colorScheme.success.color },
          warning: { color: components.tag.colorScheme.warn.color },
          danger: { color: components.tag.colorScheme.danger.color },
          secondary: { color: components.tag.colorScheme.secondary.color },
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
