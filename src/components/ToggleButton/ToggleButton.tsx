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

// TODO(tokens-migration): reason=value-mismatch; legacy=border.Radius.rounded-full; value=100; target=components.togglebutton.root.borderRadius; targetValue=1600
// TODO(tokens-migration): reason=missing; legacy=border.Width.border; value=1
// TODO(tokens-migration): reason=value-mismatch; legacy=theme.Button.Disabled.disabledButtonBorderColor; light=#a2a5a9; dark=#56595f; target=components.togglebutton.colorScheme.root.disabledBorderColor; targetValue=#e2e2e4
// TODO(tokens-migration): reason=value-mismatch; legacy=theme.Button.Common.buttonPaddingTopBottom; value=0; target=components.togglebutton.root.paddingTop; targetValue=8
// TODO(tokens-migration): reason=missing; legacy=spacing.Padding.p-6; value=21
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-3; value=10.5; target=components.togglebutton.extend.ext.gap; targetValue=14
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-2; value=7; target=components.togglebutton.root.gap; targetValue=8
// TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-3; value=10.5; target=components.togglebutton.root.sm.paddingRight; targetValue=14
// TODO(tokens-migration): reason=value-mismatch; legacy=theme.Button.Disabled.disabledButtonBg; light=#e2e2e4; dark=#404348; target=components.togglebutton.colorScheme.root.disabledBackground; targetValue=#e2e2e4
// TODO(tokens-migration): reason=value-mismatch; legacy=theme.Button.Disabled.disabledButtonTextColor; light=#85888e; dark=#f0f0f1; target=components.togglebutton.colorScheme.root.disabledColor; targetValue=#85888e
// TODO(tokens-migration): reason=missing; legacy=theme.Button.Common.buttonPaddingLeftRight; value=14
const toggleStyles = StyleSheet.create(
  ({ primitive, components, theme, spacing, border, fonts }) => ({
    container: {
      alignSelf: 'flex-start',
      borderRadius: border.Radius['rounded-full'],
      borderWidth: border.Width.border,
      overflow: 'hidden',
      variants: {
        checked: {
          true: {
            borderColor:
              components.togglebutton.colorScheme.root.checkedBorderColor,
          },
          false: {
            borderColor: components.togglebutton.colorScheme.root.borderColor,
          },
        },
        pressed: {
          true: {
            borderColor: components.togglebutton.extend.hoverBorderColor,
          },
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
            borderColor: components.togglebutton.extend.checkedHoverBorderColor,
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
          xlarge: { minHeight: 56 },
          large: { minHeight: 49 },
          base: {
            minHeight: 35,
            paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
            gap: spacing.Gap['gap-2'],
          },
          small: {
            minHeight: 28,
            paddingHorizontal: spacing.Padding['p-3'],
            gap: spacing.Gap['gap-2'],
          },
        },
        checked: {
          true: {
            backgroundColor:
              components.togglebutton.colorScheme.root.checkedBackground,
          },
          false: {
            backgroundColor:
              components.togglebutton.colorScheme.root.background,
          },
        },
        pressed: {
          true: {
            backgroundColor:
              components.togglebutton.colorScheme.root.hoverBackground,
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
            backgroundColor:
              components.togglebutton.extend.checkedHoverBackground,
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
            width: primitive.fonts.fontSize[700],
            height: primitive.fonts.fontSize[700],
          },
          large: {
            width: primitive.fonts.fontSize[600],
            height: primitive.fonts.fontSize[600],
          },
          base: {
            width: primitive.fonts.fontSize[500],
            height: primitive.fonts.fontSize[500],
          },
          small: {
            width: primitive.fonts.fontSize[300],
            height: primitive.fonts.fontSize[300],
          },
        },
        checked: {
          true: {
            color: components.togglebutton.colorScheme.root.checkedColor,
          },
          false: { color: components.togglebutton.colorScheme.root.color },
        },
        pressed: {
          true: { color: components.togglebutton.colorScheme.root.hoverColor },
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
          styles: { color: components.togglebutton.extend.checkedHoverColor },
        },
      ],
    },
    label: {
      flexShrink: 1,
      fontFamily: fonts.primary,
      fontWeight: primitive.fonts.fontWeight.demibold,
      includeFontPadding: false,
      verticalAlign: 'middle',
      variants: {
        size: {
          xlarge: { fontSize: primitive.fonts.fontSize[600] },
          large: { fontSize: primitive.fonts.fontSize[500] },
          base: { fontSize: primitive.fonts.fontSize[300] },
          small: { fontSize: primitive.fonts.fontSize[100] },
        },
        checked: {
          true: {
            color: components.togglebutton.colorScheme.root.checkedColor,
          },
          false: { color: components.togglebutton.colorScheme.root.color },
        },
        pressed: {
          true: { color: components.togglebutton.colorScheme.root.hoverColor },
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
          styles: { color: components.togglebutton.extend.checkedHoverColor },
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
