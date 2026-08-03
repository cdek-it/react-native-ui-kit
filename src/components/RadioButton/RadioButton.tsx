import { memo, useCallback, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  View,
  type ViewProps,
} from 'react-native'
import Animated from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export interface RadioButtonProps
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
  /** Выбор состояния компонента */
  state?: 'default' | 'danger'
}

export const RadioButton = memo<RadioButtonProps>(
  ({
    onPress,
    checked = false,
    disabled = false,
    state = 'default',
    testID,
    ...rest
  }) => {
    const [pressed, setPressed] = useState(false)

    radioStyles.useVariants({
      checked: checked ? 'true' : 'false',
      pressed: pressed ? 'true' : 'false',
      state: state === 'danger' ? 'danger' : undefined,
      disabled: disabled ? 'true' : 'false',
    })

    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    return (
      <View>
        <AnimatedPressable
          disabled={disabled}
          style={radioStyles.container}
          testID={testID || 'RadioButton_Pressable'}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          {...rest}
        >
          <Animated.View style={radioStyles.center} />
        </AnimatedPressable>
      </View>
    )
  }
)

const radioStyles = StyleSheet.create(({ semantic, components }) => ({
  container: {
    width: components.radiobutton.root.width,
    height: components.radiobutton.root.height,
    borderRadius: semantic.dimension.borderRadius.max,
    borderWidth: semantic.dimension.borderWidth[100],
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: ['borderColor', 'backgroundColor'],
    transitionDuration: 100,
    variants: {
      checked: {
        true: {
          borderColor: components.radiobutton.root.checkedBorderColor,
          backgroundColor: components.radiobutton.root.checkedBackground,
        },
        false: {
          borderColor: components.radiobutton.root.borderColor,
          backgroundColor: components.radiobutton.root.background,
        },
      },
      pressed: { true: {}, false: {} },
      disabled: {
        true: {
          borderColor: components.radiobutton.root.borderColor,
          backgroundColor: components.radiobutton.root.disabledBackground,
          opacity: semantic.effects.opacity[60],
        },
        false: {},
      },
      state: { danger: {}, default: {} },
    },
    compoundVariants: [
      {
        checked: 'true',
        pressed: 'true',
        styles: {
          borderColor: components.radiobutton.root.checkedHoverBorderColor,
          backgroundColor: components.radiobutton.root.checkedHoverBackground,
        },
      },
      {
        checked: 'true',
        disabled: 'true',
        styles: {
          borderColor: components.radiobutton.root.checkedBorderColor,
          backgroundColor: components.radiobutton.root.checkedBackground,
        },
      },
      {
        state: 'danger',
        disabled: 'false',
        checked: 'false',
        styles: { borderColor: components.radiobutton.root.invalidBorderColor },
      },
      {
        checked: 'false',
        pressed: 'true',
        styles: { borderColor: components.radiobutton.root.hoverBorderColor },
      },
    ],
  },
  center: {
    width: components.radiobutton.icon.size,
    height: components.radiobutton.icon.size,
    borderRadius: semantic.dimension.borderRadius.max,
    backgroundColor: components.radiobutton.root.background,
    transitionProperty: ['opacity'],
    transitionDuration: 100,
    variants: { checked: { false: { opacity: 0 }, true: { opacity: 1 } } },
  },
}))
