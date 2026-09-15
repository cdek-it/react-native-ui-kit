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
  /** SVG-иконка. Если передана, то изображение не будет отображаться */
  Icon?: SvgSource
  /** Изображение. Будет отображаться, только если не передана иконка Icon */
  Image?: ImageSourcePropType
}

/**
 * Используется для выбора нескольких значений с помощью кнопки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4821
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24035-60
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

const toggleStyles = StyleSheet.create(({ components, semantic, fonts }) => ({
  container: {
    alignSelf: 'flex-start',
    borderRadius: components.togglebutton.root.borderRadius,
    borderWidth: semantic.dimension.borderWidth[100],
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
        true: { borderColor: components.togglebutton.extend.hoverBorderColor },
        false: {},
      },
      disabled: {
        true: {
          borderColor:
            components.togglebutton.colorScheme.root.disabledBorderColor,
          opacity: semantic.effects.opacity[60],
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
    borderRadius: components.togglebutton.root.borderRadius,
    paddingVertical: components.togglebutton.root.paddingTop,
    paddingHorizontal: semantic.dimension.space[600],
    gap: components.togglebutton.extend.ext.gap,
    variants: {
      size: {
        xlarge: { minHeight: semantic.dimension.size[1400] },
        large: { minHeight: semantic.dimension.size[1300] },
        base: {
          minHeight: semantic.dimension.size[1100],
          paddingHorizontal: components.togglebutton.root.paddingLeft,
          gap: components.togglebutton.root.gap,
        },
        small: {
          minHeight: semantic.dimension.size[800],
          paddingHorizontal: components.togglebutton.root.sm.paddingRight,
          gap: components.togglebutton.root.gap,
        },
      },
      checked: {
        true: {
          backgroundColor:
            components.togglebutton.colorScheme.root.checkedBackground,
        },
        false: {
          backgroundColor: components.togglebutton.colorScheme.root.background,
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
        true: {
          backgroundColor:
            components.togglebutton.colorScheme.root.disabledBackground,
        },
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
    paddingHorizontal: semantic.dimension.space.none,
    paddingVertical: semantic.dimension.space.none,
    justifyContent: 'center',
  },
  icon: {
    variants: {
      size: {
        xlarge: {
          // Токена iconSize.xlg в дизайн-системе нет — размер взят semantic-ролью.
          width: semantic.dimension.size[1000],
          height: semantic.dimension.size[1000],
        },
        large: {
          width: components.togglebutton.extend.iconSize.lg,
          height: components.togglebutton.extend.iconSize.lg,
        },
        base: {
          width: components.togglebutton.extend.iconSize.md,
          height: components.togglebutton.extend.iconSize.md,
        },
        small: {
          width: components.togglebutton.extend.iconSize.sm,
          height: components.togglebutton.extend.iconSize.sm,
        },
      },
      checked: {
        true: { color: components.togglebutton.colorScheme.root.checkedColor },
        false: { color: components.togglebutton.colorScheme.root.color },
      },
      pressed: {
        true: { color: components.togglebutton.colorScheme.root.hoverColor },
        false: {},
      },
      disabled: {
        true: { color: components.togglebutton.colorScheme.root.disabledColor },
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
    fontFamily: fonts.fontFamily.heading,
    fontWeight: fonts.fontWeight.demibold,
    includeFontPadding: false,
    verticalAlign: 'middle',
    variants: {
      size: {
        xlarge: { fontSize: fonts.fontSize[600] },
        large: { fontSize: fonts.fontSize[500] },
        base: { fontSize: fonts.fontSize[300] },
        small: { fontSize: fonts.fontSize[100] },
      },
      checked: {
        true: { color: components.togglebutton.colorScheme.root.checkedColor },
        false: { color: components.togglebutton.colorScheme.root.color },
      },
      pressed: {
        true: { color: components.togglebutton.colorScheme.root.hoverColor },
        false: {},
      },
      disabled: {
        true: { color: components.togglebutton.colorScheme.root.disabledColor },
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
}))

export const ToggleButtonTestId = {
  root: 'ToggleButton',
  container: 'ToggleButton.container',
  text: 'ToggleButton.text',
  icon: 'ToggleButton.icon',
}
