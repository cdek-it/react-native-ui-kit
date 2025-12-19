import { memo, useMemo, useState } from 'react'
import { TouchableOpacity, type ViewProps, type ViewStyle } from 'react-native'
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated'

import { scheduleOnRN } from 'react-native-worklets'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { makeStyles } from '../../utils/makeStyles'

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
    const styles = useStyles()

    const iconSize = useMemo(() => {
      switch (size) {
        case 'small':
          return styles.iconSmall

        case 'base':
          return styles.iconBase

        case 'large':
          return styles.iconLarge

        case 'xlarge':
          return styles.iconXLarge
      }
    }, [
      size,
      styles.iconBase,
      styles.iconLarge,
      styles.iconSmall,
      styles.iconXLarge,
    ])

    const labelFontSize = useMemo(() => {
      switch (size) {
        case 'small':
          return styles.labelSmall

        case 'base':
          return styles.labelBase

        case 'large':
          return styles.labelLarge

        case 'xlarge':
          return styles.labelXLarge
      }
    }, [
      size,
      styles.labelBase,
      styles.labelLarge,
      styles.labelSmall,
      styles.labelXLarge,
    ])

    const animatedColorStyle = useAnimatedStyle(() => {
      return {
        color: interpolateColor(
          position.value,
          [index - 1, index, index + 1],
          [
            styles.textColor.color,
            styles.checkedTextColor.color,
            styles.textColor.color,
          ]
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
            height={iconSize.height}
            source={Icon}
            style={
              [
                styles.textColor,
                isSelected && styles.checkedTextColor,
                disabled && styles.disabledTextColor,
              ] as ViewStyle[]
            }
            testID='SelectButtonItem_Icon'
            width={iconSize.width}
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

const useStyles = makeStyles(
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
    small: { height: theme.Button.Common.buttonHeightSM },
    base: { height: theme.Button.Common.buttonHeight },
    large: {
      height: theme.Button.Common.buttonHeightLG,
      gap: spacing.Gap['gap-3'],
    },
    xlarge: {
      height: theme.Button.Common.buttonHeightXL,
      gap: spacing.Gap['gap-3'],
    },
    disabledContainer: {
      borderRadius: theme.Form.SelectButton.selectButtonBorderRadius,
      borderWidth: 1,
      borderColor: theme.Button.Disabled.disabledButtonBorderColor,
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
    disabledTextColor: {
      color: theme.Button.Disabled.disabledButtonBorderColor,
    },
  })
)
