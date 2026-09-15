import { memo, useCallback } from 'react'
import { Pressable, type PressableProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { useHandleStyles, useSliderStyles } from './styles'

export interface InputSwitchProps extends PressableProps {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  danger?: boolean
}

export const InputSwitch = memo<InputSwitchProps>(
  ({
    checked,
    onCheckedChange,
    disabled = false,
    danger = false,
    ...props
  }) => {
    const { containerStyle, sliderStyle, onPressIn, onPressOut } =
      useSliderStyles(checked, disabled, danger)
    const { handleStyle } = useHandleStyles(checked, disabled)

    const handlePress = useCallback(() => {
      onCheckedChange?.(!checked)
    }, [checked, onCheckedChange])

    return (
      <Pressable
        disabled={disabled}
        style={containerStyle}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...props}
      >
        <Animated.View style={sliderStyle}>
          <Animated.View style={handleStyle} />
        </Animated.View>
      </Pressable>
    )
  }
)
