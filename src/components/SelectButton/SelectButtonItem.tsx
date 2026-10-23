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
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24035-56
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
            uniProps={({ components, semantic }) => {
              return {
                color: disabled
                  ? semantic.colorScheme.color.border.neutral.strong
                  : isSelected
                    ? components.selectbutton.extend.checkedColor
                    : semantic.colorScheme.color.fg.muted,
              }
            }}
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

// Осознанный обход слоя components: цвет невыбранного пункта — семантическая
// роль «приглушённый текст». Собственного токена у selectbutton нет, а то же
// значение приходит в tabs.tab.color и menu.item.color.
const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: components.selectbutton.extend.gap,
    borderWidth: semantic.dimension.borderWidth[100],
    borderColor: 'transparent',
  },
  small: { height: semantic.dimension.size[800] },
  base: { height: semantic.dimension.size[1100] },
  large: {
    height: semantic.dimension.size[1300],
    gap: components.selectbutton.extend.gap,
  },
  xlarge: {
    height: semantic.dimension.size[1400],
    gap: components.selectbutton.extend.gap,
  },
  disabledContainer: {
    borderRadius: components.selectbutton.extend.ext.borderRadius,
    borderWidth: semantic.dimension.borderWidth[100],
    borderColor: semantic.colorScheme.color.border.neutral.strong,
  },
  iconSmall: {
    width: components.selectbutton.extend.iconSize.sm,
    height: components.selectbutton.extend.iconSize.sm,
  },
  iconBase: {
    width: components.selectbutton.extend.iconSize.md,
    height: components.selectbutton.extend.iconSize.md,
  },
  iconLarge: {
    width: components.selectbutton.extend.iconSize.lg,
    height: components.selectbutton.extend.iconSize.lg,
  },
  // Токена iconSize для xlarge в дизайн-системе нет — размер взят semantic-ролью.
  iconXLarge: {
    width: semantic.dimension.size[800],
    height: semantic.dimension.size[800],
  },
  label: {
    flexShrink: 1,
    fontWeight: fonts.fontWeight.demibold,
    fontFamily: fonts.fontFamily.heading,
  },
  labelSmall: { fontSize: fonts.fontSize[100] },
  labelBase: { fontSize: fonts.fontSize[300] },
  labelLarge: { fontSize: fonts.fontSize[500] },
  labelXLarge: { fontSize: fonts.fontSize[600] },
  textColor: { color: semantic.colorScheme.color.fg.muted },
  checkedTextColor: { color: components.selectbutton.extend.checkedColor },
  disabledTextColor: {
    color: semantic.colorScheme.color.border.neutral.strong,
  },
}))
