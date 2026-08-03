import { memo, useMemo, useState } from 'react'
import { TouchableOpacity, type ViewProps } from 'react-native'
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface SelectButtonItemProps extends Pick<
  ViewProps,
  'accessibilityLabel' | 'onLayout' | 'testID'
> {
  /** Индекс кнопки */
  index: number

  /** Обработчик нажатия на кнопку */
  onPress: () => void

  /**
   * Анимированное значение 0...n-1, где n - это количество кнопок.
   * Кнопка считается выбранной, если значение position равно индексу кнопки.
   */
  position: SharedValue<number>

  /** true - если кнопка недоступна для нажатия */
  disabled?: boolean

  /** Текст на кнопке. Может быть опущен для сегмента только с иконкой. */
  label?: string

  /**
   * Выбор размера элемента
   * @default 'base'
   */
  size?: 'small' | 'base' | 'large' | 'xlarge'

  /**
   * Показать или скрыть иконку внутри компонента
   * @default true
   */
  showIcon?: boolean

  /** SVG-иконка */
  Icon?: SvgSource
}

/**
 * Дочерний элемент компонента SelectButton. Не используется отдельно от SelectButton.
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=481-4393
 */
export const SelectButtonItem = memo<SelectButtonItemProps>(
  ({
    accessibilityLabel,
    index,
    position,
    onPress,
    disabled,
    label,
    onLayout,
    testID,
    size = 'base',
    showIcon = true,
    Icon,
  }) => {
    const sizeMap = useMemo(
      () => ({
        small: { icon: styles.iconSmall, label: styles.labelSmall },
        base: { icon: styles.iconBase, label: styles.labelBase },
        large: { icon: styles.iconLarge, label: styles.labelLarge },
        xlarge: { icon: styles.iconXLarge, label: styles.labelXLarge },
      }),
      []
    )

    const iconSize = sizeMap[size].icon
    const labelFontSize = sizeMap[size].label

    // Extract primitive color values before the worklet closure to avoid
    // capturing the unistyles HostObject (non-serializable) in the worklet.
    const textColor = styles.textColor.color
    const checkedTextColor = styles.checkedTextColor.color

    const animatedColorStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          position.value,
          [index - 1, index, index + 1],
          [textColor, checkedTextColor, textColor]
        ),
      }
    })

    const [isSelected, setIsSelected] = useState(false)

    useAnimatedReaction(
      () => position.value,
      (value, prevValue) => {
        if (value !== prevValue) {
          scheduleOnRN(setIsSelected, value === index)
        }
      }
    )

    return (
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ disabled, selected: isSelected }}
        disabled={disabled}
        style={[
          styles.container,
          styles[size],
          disabled && styles.disabledContainer,
        ]}
        testID={testID || 'SelectButtonItem_TouchableOpacity'}
        onLayout={onLayout}
        onPress={onPress}
      >
        {Icon && showIcon ? (
          <SvgUniversal
            {...iconSize}
            source={Icon}
            testID='SelectButtonItem_Icon'
            uniProps={({ components, semantic, theme }) => ({
              color: disabled
                ? theme.Button.Disabled.disabledButtonBorderColor
                : isSelected
                  ? components.selectbutton.extend.checkedColor
                  : semantic.colorScheme.color.fg.muted,
            })}
          />
        ) : null}
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            labelFontSize,
            styles.textColor,
            disabled ? styles.disabledTextColor : animatedColorStyle,
          ]}
          testID='SelectButtonItem_Text'
        >
          {label}
        </Animated.Text>
      </TouchableOpacity>
    )
  }
)

// TODO(tokens-migration): reason=missing; legacy=theme.Button.Disabled.disabledButtonBorderColor; light=#a2a5a9; dark=#56595f
// TODO(tokens-migration): reason=missing; legacy=border.Width.border; value=1
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-3; value=10.5; target=components.selectbutton.extend.gap; targetValue=4
// TODO(tokens-migration): reason=missing; legacy=semantic.colorScheme.color.fg.muted; light=#85888e; dark=#a2a5a9
const styles = StyleSheet.create(
  ({
    primitive,
    components,
    semantic,
    theme,

    border,
    spacing,
    fonts,
  }) => ({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-2; value=7; target=components.selectbutton.extend.gap; targetValue=4
      gap: spacing.Gap['gap-2'],
      borderWidth: border.Width.border,
      borderColor: 'transparent',
    },
    small: { height: 28 },
    base: { height: 35 },
    large: { height: 49, gap: spacing.Gap['gap-3'] },
    xlarge: { height: 56, gap: spacing.Gap['gap-3'] },
    disabledContainer: {
      borderRadius: components.selectbutton.extend.ext.borderRadius,
      borderWidth: 1,
      borderColor: theme.Button.Disabled.disabledButtonBorderColor,
    },
    iconSmall: {
      width: primitive.fonts.fontSize[300],
      height: primitive.fonts.fontSize[300],
    },
    iconBase: {
      width: primitive.fonts.fontSize[500],
      height: primitive.fonts.fontSize[500],
    },
    iconLarge: {
      width: primitive.fonts.fontSize[600],
      height: primitive.fonts.fontSize[600],
    },
    iconXLarge: { width: 28, height: 28 },
    label: {
      flexShrink: 1,
      fontWeight: primitive.fonts.fontWeight.demibold,
      fontFamily: fonts.primary,
    },
    labelSmall: { fontSize: primitive.fonts.fontSize[100] },
    labelBase: { fontSize: primitive.fonts.fontSize[300] },
    labelLarge: { fontSize: primitive.fonts.fontSize[500] },
    labelXLarge: { fontSize: primitive.fonts.fontSize[600] },
    textColor: { color: semantic.colorScheme.color.fg.muted },
    checkedTextColor: { color: components.selectbutton.extend.checkedColor },
    disabledTextColor: {
      color: theme.Button.Disabled.disabledButtonBorderColor,
    },
  })
)
