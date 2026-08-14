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

import type { ComponentTokens } from '../../theme/tokens/index'
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

const tagIconColor: Record<TagSeverity, (t: ComponentTokens) => string> = {
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
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24043-13865
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
              uniProps={({ components }) => {
                return { color: tagIconColor[severity](components) }
              }}
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

const tagStyles = StyleSheet.create(({ components, fonts }) => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.tag.root.gap,
    paddingHorizontal: components.tag.root.paddingLeft,
    paddingVertical: components.tag.root.paddingTop,
    borderRadius: components.tag.root.borderRadius,
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
  roundedContainer: { borderRadius: components.tag.root.roundedBorderRadius },
  icon: { width: components.tag.icon.size, height: components.tag.icon.size },
  text: {
    flexShrink: 1,
    fontSize: components.tag.root.fontSize,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.heading,
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
}))

export const TagTestId = {
  root: 'Tag',
  innerContainer: 'Tag.innerContainer',
  icon: 'Tag.icon',
  text: 'Tag.text',
}
