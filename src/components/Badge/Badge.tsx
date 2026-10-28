import { memo, useCallback, useState } from 'react'
import {
  type LayoutChangeEvent,
  type StyleProp,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { badgeMeasurementStyle, badgeStyles } from './Badge.styles'

import {
  adaptBadgeSeverity,
  type DeprecatedBadgeSeverity,
} from './deprecated/adaptBadgeSeverity'

export type BadgeSeverity =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Сохраняем совместимость публичного API до версии 2.0.
  | DeprecatedBadgeSeverity

export interface BadgeBase extends ViewProps {
  /**
   * Выбор варианта стиля компонента
   * Значение basic устарело; используйте primary
   * @default 'primary'
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
    severity = 'primary',
    size = 'base',
    style,
    testID,
    accessibilityLabel,
    ...rest
  }) => {
    badgeStyles.useVariants({ severity: adaptBadgeSeverity(severity), size })
    // На iOS пересоздание Text сбрасывает старое измерение при уменьшении системного шрифта.
    const { fontScale } = useWindowDimensions()
    const [contentWidth, setContentWidth] = useState<number>()

    // Без minWidth по размеру содержимого обёртка обрезает однострочный Badge
    // в узком родителе.
    const onContentLayout = useCallback(
      ({ nativeEvent }: LayoutChangeEvent) => {
        setContentWidth(nativeEvent.layout.width)
      },
      []
    )

    return (
      <View
        accessibilityLabel={accessibilityLabel ?? children}
        accessibilityRole='text'
        accessible={!dot || accessibilityLabel !== undefined}
        style={[badgeStyles.container, style]}
        {...rest}
      >
        {dot ? (
          <View
            style={[badgeStyles.dot, badgeStyles.dotShape]}
            testID={testID}
          />
        ) : (
          <View
            accessible={false}
            style={[badgeMeasurementStyle, { minWidth: contentWidth }]}
          >
            <View
              style={badgeStyles.textBadgeContainer}
              testID={testID}
              onLayout={onContentLayout}
            >
              <Text
                accessible={false}
                importantForAccessibility='no'
                key={fontScale}
                numberOfLines={1}
                style={badgeStyles.textBadge}
              >
                {children}
              </Text>
            </View>
          </View>
        )}
      </View>
    )
  }
)
