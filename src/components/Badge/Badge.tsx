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

import { StyleSheet } from '../../utils'

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
  /** Отображать бейджа в форме точки **/
  dot?: false
}

interface BadgeDot extends BadgeBase {
  /** Отображать бейджа в форме точки **/
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
export const Badge = memo(
  ({
    children,
    dot,
    severity = 'basic',
    style,
    testID,
    ...rest
  }: BadgeProps) => {
    badgeStyles.useVariants({ severity })
    const [textLayout, setTextLayout] = useState<LayoutRectangle>()

    const onTextLayout = useCallback((e: LayoutChangeEvent) => {
      setTextLayout(e.nativeEvent.layout)
    }, [])

    return (
      <View style={[badgeStyles.container, style]} {...rest}>
        {dot ? (
          <View style={badgeStyles.dot} testID={testID} />
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

const badgeStyles = StyleSheet.create(
  ({ theme, border, typography, fonts }) => ({
    container: { alignItems: 'flex-start' },
    dot: {
      width: theme.Misc.Badge.badgeDotSize,
      height: theme.Misc.Badge.badgeDotSize,
      borderRadius: border.Radius['rounded-full'],
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
        },
      },
    },
    textBadgeContainer: {
      height: theme.Misc.Badge.badgeHeight,
      paddingHorizontal: theme.Misc.Tag.tagPadding,
      justifyContent: 'center',
      borderRadius: border.Radius['rounded-full'],
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
        },
      },
    },
    textBadge: {
      color: theme.Misc.Badge.badgeTextColor,
      fontSize: typography.Size['text-xs'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.primary,
    },
    hiddenContainer: {
      width: Dimensions.get('window').width,
      height: 0,
      flexDirection: 'row',
      position: 'absolute',
    },
  })
)
