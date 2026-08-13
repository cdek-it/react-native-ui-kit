import { memo, useCallback, useState } from 'react'
import {
  type AccessibilityProps,
  Dimensions,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type StyleProp,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleSheet } from 'react-native-unistyles'

export type BadgeSeverity = 'basic' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeBase
  extends AccessibilityProps, Pick<ViewProps, 'onLayout' | 'testID'> {
  /**
   * Выбор варианта стиля компонента
   * @default 'basic'
   */
  severity?: BadgeSeverity
  /**
   * Выбор размера компонента
   * @default 'base'
   */
  size?: 'base' | 'large' | 'xlarge'
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
}

interface BadgeText extends BadgeBase {
  /** Текст внутри бейджа **/
  children: string
  /** Отображать бейдж в форме точки **/
  dot?: false
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
 * @param severity - Выбор варианта стиля компонента
 * @param size - Выбор размера компонента
 * @param style - Дополнительная стилизация для контейнера компонента
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24043-13668
 */
export const Badge = memo<BadgeProps>(
  ({
    children,
    dot,
    severity = 'basic',
    size = 'base',
    style,
    testID,
    ...rest
  }) => {
    badgeStyles.useVariants({ severity, size })
    const [textLayout, setTextLayout] = useState<LayoutRectangle>()

    const onTextLayout = useCallback((e: LayoutChangeEvent) => {
      setTextLayout(e.nativeEvent.layout)
    }, [])

    return (
      <View style={[badgeStyles.container, style]} {...rest}>
        {dot ? (
          <View
            style={[badgeStyles.dot, badgeStyles.dotShape]}
            testID={testID}
          />
        ) : (
          <>
            <View style={badgeStyles.textBadgeContainer} testID={testID}>
              <Text
                numberOfLines={1}
                style={[badgeStyles.textBadge, { minWidth: textLayout?.width }]}
              >
                {children}
              </Text>
            </View>

            {/* скрытый элемент для подсчета ширины текста в 1 строку */}
            <View
              accessibilityElementsHidden
              importantForAccessibility='no-hide-descendants'
              style={badgeStyles.hiddenContainer}
            >
              <View collapsable={false}>
                <Text
                  numberOfLines={1}
                  style={badgeStyles.textBadge}
                  onLayout={onTextLayout}
                >
                  {children}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    )
  }
)

const badgeStyles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: { alignItems: 'flex-start' },
  dot: {
    variants: {
      severity: {
        basic: {
          backgroundColor: components.badge.colorScheme.primary.background,
        },
        info: {
          backgroundColor: components.badge.extend.extDot.info.background,
        },
        success: {
          backgroundColor: components.badge.extend.extDot.success.background,
        },
        warning: {
          backgroundColor: components.badge.extend.extDot.warn.background,
        },
        danger: {
          backgroundColor: components.badge.extend.extDot.danger.background,
        },
      },
    },
  },
  dotShape: {
    width: components.badge.dot.size,
    height: components.badge.dot.size,
    borderRadius: semantic.dimension.borderRadius.max,
    borderWidth: components.overlaybadge.root.outline.width,
    borderColor: components.overlaybadge.root.outline.color,
    variants: {
      size: {
        base: {},
        large: {
          width: components.badge.extend.extDot.lg.size,
          height: components.badge.extend.extDot.lg.size,
        },
        xlarge: {
          width: components.badge.extend.extDot.xlg.size,
          height: components.badge.extend.extDot.xlg.size,
        },
      },
    },
  },
  textBadgeContainer: {
    height: components.badge.root.height,
    minWidth: components.badge.root.minWidth,
    paddingHorizontal: components.badge.root.padding,
    justifyContent: 'center',
    borderRadius: components.badge.root.borderRadius,
    borderWidth: components.overlaybadge.root.outline.width,
    borderColor: components.overlaybadge.root.outline.color,
    variants: {
      severity: {
        basic: {
          backgroundColor: components.badge.colorScheme.primary.background,
        },
        info: { backgroundColor: components.badge.colorScheme.info.background },
        success: {
          backgroundColor: components.badge.colorScheme.success.background,
        },
        warning: {
          backgroundColor: components.badge.colorScheme.warn.background,
        },
        danger: {
          backgroundColor: components.badge.colorScheme.danger.background,
        },
      },
      size: {
        base: {},
        large: {
          height: components.badge.lg.height,
          minWidth: components.badge.lg.minWidth,
        },
        xlarge: {
          height: components.badge.xl.height,
          minWidth: components.badge.xl.minWidth,
        },
      },
    },
  },
  textBadge: {
    color: components.badge.colorScheme.primary.color,
    fontSize: components.badge.root.fontSize,
    fontWeight: fonts.fontWeight.regular,
    lineHeight: fonts.lineHeight[100],
    letterSpacing: fonts.letterSpacing[500],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.heading,
    variants: {
      severity: {
        basic: { color: components.badge.colorScheme.primary.color },
        info: { color: components.badge.colorScheme.info.color },
        success: { color: components.badge.colorScheme.success.color },
        warning: { color: components.badge.colorScheme.warn.color },
        danger: { color: components.badge.colorScheme.danger.color },
      },
      size: {
        base: {},
        large: {},
        xlarge: { lineHeight: fonts.lineHeight[350] },
      },
    },
  },
  hiddenContainer: {
    width: Dimensions.get('window').width,
    height: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
}))
