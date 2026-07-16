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
  'onLayout' | 'testID'
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

  /** Текст на кнопке */
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
    index,
    position,
    onPress,
    disabled,
    label,
    onLayout,
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
        disabled={disabled}
        style={[
          styles.container,
          styles[size],
          disabled && styles.disabledContainer,
        ]}
        testID='SelectButtonItem_TouchableOpacity'
        onLayout={onLayout}
        onPress={onPress}
      >
        {Icon && showIcon ? (
          <SvgUniversal
            {...iconSize}
            source={Icon}
            testID='SelectButtonItem_Icon'
            uniProps={({ theme }) => ({
              color: disabled
                ? 'transparent'
                : isSelected
                  ? theme.Form.SelectButton.selectButtonIconActiveColor
                  : theme.Form.SelectButton.selectButtonTextColor,
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

const styles = StyleSheet.create(
  ({ theme, typography, border, spacing, fonts }) => ({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.General.inlineSpacing,
      borderWidth: border.Width.border,
      borderColor: 'transparent',
    },
    small: { height: 28 },
    base: { height: 35 },
    large: { height: 49, gap: spacing.Gap['gap-3'] },
    xlarge: { height: 56, gap: spacing.Gap['gap-3'] },
    disabledContainer: {
      borderRadius: theme.Form.SelectButton.selectButtonBorderRadius,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    iconSmall: {
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
    iconBase: {
      width: typography.Size['text-xl'],
      height: typography.Size['text-xl'],
    },
    iconLarge: {
      width: typography.Size['text-2xl'],
      height: typography.Size['text-2xl'],
    },
    iconXLarge: { width: 28, height: 28 },
    label: { flexShrink: 1, fontWeight: 600, fontFamily: fonts.primary },
    labelSmall: { fontSize: typography.Size['text-sm'] },
    labelBase: { fontSize: typography.Size['text-base'] },
    labelLarge: { fontSize: typography.Size['text-xl'] },
    labelXLarge: { fontSize: typography.Size['text-2xl'] },
    textColor: { color: theme.Form.SelectButton.selectButtonTextColor },
    checkedTextColor: {
      color: theme.Form.SelectButton.selectButtonIconActiveColor,
    },
    disabledTextColor: { color: 'transparent' },
  })
)
