import { memo } from 'react'
import { Pressable, type PressableStateCallbackType } from 'react-native'

import type { BaseButtonProps } from '../types'

import { ButtonActivityIndicator } from './components/ButtonActivityIndicator'
import { ButtonIcon } from './components/ButtonIcon'
import { ButtonLabel } from './components/ButtonLabel'
import type { ButtonLayoutProps, ButtonStyleResolver } from './types'

type BaseButtonComponentProps = Omit<
  BaseButtonProps<never>,
  'variant' | 'shape'
> & { readonly resolveStyles: ButtonStyleResolver }

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
      const state: ButtonLayoutProps['state'] = loading
        ? 'loading'
        : disabled
          ? 'disabled'
          : pressed
            ? 'pressed'
            : 'default'

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
            </>
          )
        }}
      </Pressable>
    )
  }
)
