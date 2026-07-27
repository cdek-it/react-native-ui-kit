import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  type StyleProp,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface ToggleButtonProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Обработчик нажатия на кнопку */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Отображение только иконки без текста */
  iconOnly?: boolean
  /**
   * Выбор позиции иконки. 'left' - иконка слева, 'right' - иконка справа, null - иконка скрыта
   * @default 'left'
   */
  iconPos?: 'left' | 'right' | null
  /** Текст на кнопке */
  label?: string
  /**
   * Выбор размера элемента
   * @default 'base'
   */
  size?: 'xlarge' | 'large' | 'base' | 'small'
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
  /** SVG-иконка */
  Icon?: SvgSource
}

/**
 * Используется для выбора нескольких значений с помощью кнопки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4821
 */
export const ToggleButton = memo<ToggleButtonProps>(
  ({
    onPress,
    checked = false,
    disabled = false,
    iconOnly: iconOnlyProp,
    iconPos = 'left',
    label,
    size = 'base',
    style,
    Icon,
    testID,
    ...rest
  }) => {
    const [pressed, setPressed] = useState(false)

    toggleStyles.useVariants({ size, checked, pressed, disabled })

    const iconOnly = useMemo(
      () => iconOnlyProp || !label,
      [iconOnlyProp, label]
    )

    const icon = Icon ? (
      <SvgUniversal
        {...toggleStyles.icon}
        source={Icon}
        testID={ToggleButtonTestId.icon}
      />
    ) : null

    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    return (
      <Pressable
        disabled={disabled}
        style={[toggleStyles.container, style]}
        testID={testID || ToggleButtonTestId.root}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...rest}
      >
        <View
          style={[
            toggleStyles.contentContainer,
            iconOnly && toggleStyles.iconOnly,
          ]}
          testID={ToggleButtonTestId.container}
        >
          {iconOnly ? (
            icon
          ) : (
            <>
              {iconPos === 'left' && icon}
              <Text style={toggleStyles.label} testID={ToggleButtonTestId.text}>
                {label}
              </Text>
              {Icon && iconPos === 'right' ? icon : null}
            </>
          )}
        </View>
      </Pressable>
    )
  }
)

const toggleStyles = StyleSheet.create(
  ({ theme, spacing, border, fonts, typography }) => ({
    container: {
      alignSelf: 'flex-start',
      borderRadius: border.Radius['rounded-full'],
      borderWidth: border.Width.border,
      overflow: 'hidden',
      variants: {
        checked: {
          true: { borderColor: theme.ToggleButton.root.checkedBorderColor },
          false: { borderColor: theme.ToggleButton.root.borderColor },
        },
        pressed: {
          true: { borderColor: theme.ToggleButton.hoverBorderColor },
          false: {},
        },
        disabled: {
          true: { borderColor: 'transparent', opacity: 0.6 },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: { borderColor: theme.ToggleButton.checkedHoverBorderColor },
        },
      ],
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: border.Radius['rounded-full'],
      paddingVertical: theme.Button.paddingY,
      paddingHorizontal: spacing.Padding['p-6'],
      gap: spacing.Gap['gap-3'],
      variants: {
        size: {
          xlarge: { minHeight: 56 },
          large: { minHeight: 49 },
          base: {
            minHeight: 35,
            paddingHorizontal: theme.Button.paddingX,
            gap: spacing.Gap['gap-2'],
          },
          small: {
            minHeight: 28,
            paddingHorizontal: spacing.Padding['p-3'],
            gap: spacing.Gap['gap-2'],
          },
        },
        checked: {
          true: { backgroundColor: theme.ToggleButton.root.checkedBackground },
          false: { backgroundColor: theme.ToggleButton.root.background },
        },
        pressed: {
          true: { backgroundColor: theme.ToggleButton.root.hoverBackground },
          false: {},
        },
        disabled: {
          true: { backgroundColor: theme.Button.disabledBackground },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: {
            backgroundColor: theme.ToggleButton.checkedHoverBackground,
          },
        },
      ],
    },
    iconOnly: {
      aspectRatio: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
      justifyContent: 'center',
    },
    icon: {
      variants: {
        size: {
          xlarge: {
            width: typography.Size['text-4xl'],
            height: typography.Size['text-4xl'],
          },
          large: {
            width: typography.Size['text-2xl'],
            height: typography.Size['text-2xl'],
          },
          base: {
            width: typography.Size['text-xl'],
            height: typography.Size['text-xl'],
          },
          small: {
            width: typography.Size['text-base'],
            height: typography.Size['text-base'],
          },
        },
        checked: {
          true: { color: theme.ToggleButton.root.checkedColor },
          false: { color: theme.ToggleButton.root.color },
        },
        pressed: {
          true: { color: theme.ToggleButton.root.hoverColor },
          false: {},
        },
        disabled: { true: { color: theme.Button.disabledColor }, false: {} },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: { color: theme.ToggleButton.checkedHoverColor },
        },
      ],
    },
    label: {
      flexShrink: 1,
      fontFamily: fonts.primary,
      fontWeight: '600',
      includeFontPadding: false,
      verticalAlign: 'middle',
      variants: {
        size: {
          xlarge: { fontSize: typography.Size['text-2xl'] },
          large: { fontSize: typography.Size['text-xl'] },
          base: { fontSize: typography.Size['text-base'] },
          small: { fontSize: typography.Size['text-sm'] },
        },
        checked: {
          true: { color: theme.ToggleButton.root.checkedColor },
          false: { color: theme.ToggleButton.root.color },
        },
        pressed: {
          true: { color: theme.ToggleButton.root.hoverColor },
          false: {},
        },
        disabled: { true: { color: theme.Button.disabledColor }, false: {} },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: { color: theme.ToggleButton.checkedHoverColor },
        },
      ],
    },
  })
)

export const ToggleButtonTestId = {
  root: 'ToggleButton',
  container: 'ToggleButton.container',
  text: 'ToggleButton.text',
  icon: 'ToggleButton.icon',
}
