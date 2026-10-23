import { memo } from 'react'
import { Pressable, View, type PressableStateCallbackType } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import type { BaseButtonProps } from '../types'

import { ButtonActivityIndicator } from './components/ButtonActivityIndicator'
import { ButtonIcon } from './components/ButtonIcon'
import { ButtonLabel } from './components/ButtonLabel'
import type { ButtonStyleResolver, ButtonVisualState } from './types'

type BaseButtonComponentProps = Omit<
  BaseButtonProps<never>,
  'variant' | 'shape'
> & { readonly resolveStyles: ButtonStyleResolver }

const getButtonState = ({
  loading,
  disabled,
  pressed,
}: Pick<BaseButtonProps<never>, 'loading' | 'disabled'> &
  PressableStateCallbackType): ButtonVisualState => {
  if (loading) return 'loading'

  if (disabled) return 'disabled'

  return pressed ? 'pressed' : 'default'
}

export const BaseButton = memo<BaseButtonComponentProps>(
  ({
    size = 'base',
    rounded = false,
    loading = false,
    resolveStyles,
    disabled = false,
    iconOnly,
    iconPosition = 'prefix',
    Icon,
    label,
    badge,
    style,
    pressableRef,
    accessibilityLabel,
    accessibilityState,
    onPress,
    onLongPress,
    ...props
  }) => {
    const interactionDisabled = disabled || loading
    const getStyles = ({ pressed }: PressableStateCallbackType) => {
      const state = getButtonState({ loading, disabled, pressed })

      return resolveStyles({ size, rounded, iconOnly: !!iconOnly, state })
    }

    return (
      <Pressable
        accessibilityRole='button'
        {...props}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{
          ...accessibilityState,
          disabled: interactionDisabled,
          busy: loading,
        }}
        disabled={interactionDisabled}
        ref={pressableRef}
        style={(state) => [
          getStyles(state).container,
          typeof style === 'function' ? style(state) : style,
        ]}
        onLongPress={interactionDisabled ? undefined : onLongPress}
        onPress={interactionDisabled ? undefined : onPress}
      >
        {(state) => {
          const styles = getStyles(state)
          const icon = loading ? (
            <ButtonActivityIndicator size={size} />
          ) : Icon ? (
            <ButtonIcon Icon={Icon} uniProps={styles.icon} />
          ) : null

          return (
            <>
              {iconPosition === 'prefix' && icon}
              {!iconOnly && <ButtonLabel label={label} style={styles.label} />}
              {iconPosition === 'postfix' && icon}
              {!!badge && (
                <View
                  accessibilityElementsHidden
                  accessible={false}
                  importantForAccessibility='no-hide-descendants'
                  pointerEvents='none'
                  style={badgeStyles.overlay}
                >
                  {badge}
                </View>
              )}
            </>
          )
        }}
      </Pressable>
    )
  }
)

const badgeStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateX: '50%' }, { translateY: '-50%' }],
  },
})
