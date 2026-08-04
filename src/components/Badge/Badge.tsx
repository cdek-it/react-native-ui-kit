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
 * @param severiy - Выбор варианта стиля компонента
 * @param style - Дополнительная стилизация для контейнера компонента
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4871&m=dev
 */
export const Badge = memo<BadgeProps>(
  ({ children, dot, severity = 'basic', style, testID, ...rest }) => {
    badgeStyles.useVariants({ severity })
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
            <View
              style={[badgeStyles.dot, badgeStyles.textBadgeContainer]}
              testID={testID}
            >
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
    borderRadius: components.badge.root.borderRadius,
  },
  textBadgeContainer: {
    height: components.badge.root.height,
    paddingHorizontal: components.badge.root.padding,
    justifyContent: 'center',
    borderRadius: semantic.dimension.borderRadius.max,
  },
  textBadge: {
    color: components.badge.colorScheme.primary.color,
    fontSize: components.badge.root.fontSize,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.heading,
  },
  hiddenContainer: {
    width: Dimensions.get('window').width,
    height: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
}))
