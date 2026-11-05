import { memo, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

import { Body, Caption } from '../Typography'

import { styles } from './ToggleSwitch.styles'
import type { ToggleSwitchProps } from './types'

/**
 * Управляемый переключатель с необязательными label и caption.
 * Вся строка — единая область нажатия и один accessibility-элемент.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=19-13673
 */
export const ToggleSwitch = memo<ToggleSwitchProps>(
  ({
    checked,
    onCheckedChange,
    disabled = false,
    danger = false,
    label,
    caption,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    onPress,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    onHoverIn,
    onHoverOut,
    ...rest
  }) => {
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const { theme } = useUnistyles()
    const { root, handle } = theme.components.toggleswitch
    const position = useSharedValue(checked ? 1 : 0)
    const visibleCaption = label === undefined ? undefined : caption

    useEffect(() => {
      position.value = withTiming(checked ? 1 : 0, {
        duration: root.slideDuration,
      })
    }, [checked, position, root.slideDuration])

    const handleAnimation = useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            position.value * (root.width - root.gap * 2 - handle.size),
        },
      ],
    }))

    const textContent = label !== undefined && (
      <View
        accessible={false}
        importantForAccessibility='no-hide-descendants'
        style={styles.content}
      >
        <Body size='base' style={styles.label}>
          {label}
        </Body>
        {visibleCaption !== undefined && (
          <Caption style={styles.caption}>{visibleCaption}</Caption>
        )}
      </View>
    )

    return (
      <Pressable
        {...rest}
        accessible
        accessibilityHint={accessibilityHint ?? visibleCaption}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole='switch'
        accessibilityState={{ ...accessibilityState, checked, disabled }}
        disabled={disabled}
        style={(state) => [
          styles.root,
          typeof style === 'function' ? style(state) : style,
        ]}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onHoverIn={(event) => {
          setHovered(true)
          onHoverIn?.(event)
        }}
        onHoverOut={(event) => {
          setHovered(false)
          onHoverOut?.(event)
        }}
        onPress={(event) => {
          onCheckedChange?.(!checked)
          onPress?.(event)
        }}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {({ pressed }) => (
          <>
            <View
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              style={styles.track(
                checked,
                pressed || hovered,
                disabled,
                focused
              )}
            >
              {!disabled && (danger || focused) ? (
                <View pointerEvents='none' style={styles.ring(danger)} />
              ) : null}
              <Animated.View
                style={[
                  styles.handle(checked, pressed || hovered, disabled),
                  handleAnimation,
                ]}
              />
            </View>
            {textContent}
          </>
        )}
      </Pressable>
    )
  }
)
