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
   * Размер текстового бейджа и точки
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large'
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
 * Текстовый счётчик или точка для обозначения статуса.
 * Для точки с самостоятельным смыслом задайте accessible и accessibilityLabel.
 * В интерактивном родителе включайте значение бейджа в доступное имя родителя.
 * @param children - Текст внутри бейджа
 * @param dot - Отображать бейдж в форме точки
 * @param severity - Выбор варианта стиля компонента
 * @param size - Размер текстового бейджа и точки, по умолчанию small
 * @param style - Дополнительная стилизация для контейнера компонента
 * @see https://www.figma.com/design/HOLKdvQJ8jCLeX17s9d0Yf/UI-Kit--DS--v2.0?node-id=21-1193
 */
export const Badge = memo<BadgeProps>(
  ({
    children,
    dot,
    severity = 'basic',
    size = 'small',
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

const badgeStyles = StyleSheet.create(({ theme, fonts }) => ({
  container: { alignItems: 'flex-start' },
  dot: {
    variants: {
      severity: {
        basic: { backgroundColor: theme.Misc.Badge.badgeBg },
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
      },
    },
  },
  dotShape: {
    width: theme.Misc.Badge.badgeDotSize,
    height: theme.Misc.Badge.badgeDotSize,
    borderRadius: theme.Misc.Badge.badgeBorderRadius,
    variants: {
      size: {
        small: {},
        medium: {
          width: theme.Misc.Badge.badgeDotLgSize,
          height: theme.Misc.Badge.badgeDotLgSize,
        },
        large: {
          width: theme.Misc.Badge.badgeDotXlSize,
          height: theme.Misc.Badge.badgeDotXlSize,
        },
      },
    },
  },
  textBadgeContainer: {
    minHeight: theme.Misc.Badge.badgeHeight,
    minWidth: theme.Misc.Badge.badgeMinWidth,
    paddingHorizontal: theme.Misc.Badge.badgePaddingX,
    paddingVertical: theme.Misc.Badge.badgePaddingY,
    justifyContent: 'center',
    borderRadius: theme.Misc.Badge.badgeBorderRadius,
    variants: {
      size: {
        small: {},
        medium: {
          minHeight: theme.Misc.Badge.badgeLgHeight,
          minWidth: theme.Misc.Badge.badgeLgMinWidth,
          paddingHorizontal: theme.Misc.Badge.badgeLgPaddingX,
          paddingVertical: theme.Misc.Badge.badgeLgPaddingY,
        },
        large: {
          minHeight: theme.Misc.Badge.badgeXlHeight,
          minWidth: theme.Misc.Badge.badgeXlMinWidth,
          paddingHorizontal: theme.Misc.Badge.badgeXlPaddingX,
          paddingVertical: theme.Misc.Badge.badgeXlPaddingY,
        },
      },
    },
  },
  textBadge: {
    color: theme.Misc.Badge.badgeTextColor,
    fontSize: theme.Misc.Badge.badgeFontSize,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.primary,
    variants: {
      size: {
        small: {},
        medium: { fontSize: theme.Misc.Badge.badgeLgFontSize },
        large: { fontSize: theme.Misc.Badge.badgeXlFontSize },
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
