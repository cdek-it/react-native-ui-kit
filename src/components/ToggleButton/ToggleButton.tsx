import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  Image,
  type ImageSourcePropType,
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
  /** SVG-иконка */
  Image?: ImageSourcePropType
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
    Image: imageSource,
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
    ) : imageSource ? (
      <Image
        resizeMode='contain'
        source={imageSource}
        style={toggleStyles.icon}
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
          true: {
            borderColor: theme.Form.ToggleButton.toggleButtonActiveBorderColor,
          },
          false: {
            borderColor: theme.Form.ToggleButton.toggleButtonBorderColor,
          },
        },
        pressed: {
          true: { borderColor: theme.Form.ToggleButton.toggleButtonHoverBg },
          false: {},
        },
        disabled: {
          true: {
            borderColor: theme.Button.Disabled.disabledButtonBorderColor,
            opacity: 0.6,
          },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: {
            borderColor:
              theme.Form.ToggleButton.toggleButtonActiveHoverBorderColor,
          },
        },
      ],
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: border.Radius['rounded-full'],
      paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
      paddingHorizontal: spacing.Padding['p-6'],
      gap: spacing.Gap['gap-3'],
      variants: {
        size: {
          xlarge: { minHeight: theme.Button.Common.buttonHeightXL },
          large: { minHeight: theme.Button.Common.buttonHeightLG },
          base: {
            minHeight: theme.Button.Common.buttonHeight,
            paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
            gap: theme.General.inlineSpacing,
          },
          small: {
            minHeight: theme.Button.Common.buttonHeightSM,
            paddingHorizontal: spacing.Padding['p-3'],
            gap: theme.General.inlineSpacing,
          },
        },
        checked: {
          true: {
            backgroundColor: theme.Form.ToggleButton.toggleButtonActiveBg,
          },
          false: { backgroundColor: theme.Form.ToggleButton.toggleButtonBg },
        },
        pressed: {
          true: {
            backgroundColor: theme.Form.ToggleButton.toggleButtonHoverBg,
          },
          false: {},
        },
        disabled: {
          true: { backgroundColor: theme.Button.Disabled.disabledButtonBg },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: {
            backgroundColor: theme.Form.ToggleButton.toggleButtonActiveHoverBg,
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
          true: { color: theme.Form.ToggleButton.toggleButtonActiveTextColor },
          false: { color: theme.Form.ToggleButton.toggleButtonTextColor },
        },
        pressed: {
          true: { color: theme.Form.ToggleButton.toggleButtonHoverTextColor },
          false: {},
        },
        disabled: {
          true: { color: theme.Button.Disabled.disabledButtonTextColor },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: {
            color: theme.Form.ToggleButton.toggleButtonTextActiveHoverColor,
          },
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
          true: { color: theme.Form.ToggleButton.toggleButtonActiveTextColor },
          false: { color: theme.Form.ToggleButton.toggleButtonTextColor },
        },
        pressed: {
          true: { color: theme.Form.ToggleButton.toggleButtonHoverTextColor },
          false: {},
        },
        disabled: {
          true: { color: theme.Button.Disabled.disabledButtonTextColor },
          false: {},
        },
      },
      compoundVariants: [
        {
          checked: 'true',
          pressed: 'true',
          styles: {
            color: theme.Form.ToggleButton.toggleButtonTextActiveHoverColor,
          },
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
