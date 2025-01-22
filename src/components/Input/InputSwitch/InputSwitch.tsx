import React, { memo, useCallback } from 'react'
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
  ({ checked, onCheckedChange, disabled = false, danger = false, ...props }) => {
    const { sliderStyle, onPressedChange } = useSliderStyles(checked, disabled, danger)
    const { handleStyle } = useHandleStyles(checked)

    const handlePress = useCallback(() => {
      onCheckedChange?.(!checked)
    }, [checked, onCheckedChange])

    return (
      <Pressable disabled={disabled} style={onPressedChange} onPress={handlePress} {...props}>
        <Animated.View style={sliderStyle}>
          <Animated.View style={handleStyle} />
        </Animated.View>
      </Pressable>
    )
  }
)
