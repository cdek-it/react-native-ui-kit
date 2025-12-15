import { memo, useEffect } from 'react'
import { View, type ViewProps, Text } from 'react-native'

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { makeStyles } from '../../../utils/makeStyles'

export interface InputOtpItemProps extends Pick<ViewProps, 'testID'> {
  value?: string
  error: boolean
  pressed: boolean
  disabled: boolean
  focused: boolean
}

const CURSOR_ANIMATION_DURATION = 500

export const InputOtpItem = memo<InputOtpItemProps>(
  ({ value, error, pressed, disabled, focused, testID }) => {
    const styles = useStyles()

    const opacity = useSharedValue(1)

    useEffect(() => {
      if (focused) {
        opacity.value = withRepeat(
          withTiming(0.2, {
            duration: CURSOR_ANIMATION_DURATION,
            easing: Easing.ease,
          }),
          -1,
          true
        )
      } else {
        opacity.value = 1
      }
    }, [focused, opacity])

    const cursorBlinking = useAnimatedStyle(() => ({ opacity: opacity.value }))

    return (
      <View
        style={[
          styles.container,
          error && styles.error,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        <Text style={styles.text} testID={testID}>
          {value}
          {focused ? (
            <Animated.Text style={[styles.cursor, cursorBlinking]}>
              |
            </Animated.Text>
          ) : null}
        </Text>
      </View>
    )
  }
)

const useStyles = makeStyles(({ theme, border, fonts, typography }) => ({
  container: {
    minHeight: theme.Button.Common.buttonHeight,
    minWidth: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    borderBottomWidth: border.Width.border,
    borderColor: theme.Form.InputText.inputBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: typography.Size['text-2xl'],
    fontFamily: fonts.secondary,
    fontWeight: '400',
    color: theme.Form.InputText.inputTextColor,
  },

  pressed: { borderColor: theme.Form.InputText.inputHoverBorderColor },

  error: { borderColor: theme.Form.InputText.inputErrorBorderColor },

  disabled: { mixBlendMode: 'luminosity', opacity: 0.6 },

  cursor: { color: theme.Form.InputText.inputFocusBorderColor },
}))
