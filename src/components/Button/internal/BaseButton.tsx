import { useCallback, useEffect, useState } from 'react'
import type { GestureResponderEvent } from 'react-native'

import { genericMemo } from '../../../utils/genericMemo'

import type { ButtonProps, ButtonVariant } from '../types'

import {
  ButtonLeftArea,
  ButtonRightArea,
  ButtonLabel,
  ButtonContainer,
} from './components'
import { ButtonPressedContext } from './contexts/ButtonPressedContext'
import {
  resolveButtonShape,
  resolveButtonVisualState,
} from './resolveButtonProps'

export type BaseButtonComponentProps<Variant extends ButtonVariant> = Omit<
  ButtonProps<Variant>,
  'variant'
> & { readonly variant: Variant }

const BaseButtonComponent = <Variant extends ButtonVariant>({
  size = 'base',
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- Preserve the alias until 2.0.
  shape: deprecatedShape,
  rounded,
  loading = false,
  variant,
  disabled = false,
  iconOnly,
  iconPosition = 'prefix',
  Icon,
  label,
  style,
  accessibilityLabel,
  accessibilityState,
  onPress,
  onLongPress,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  ...props
}: BaseButtonComponentProps<Variant>) => {
  const [pressed, setPressed] = useState(false)
  const interactionDisabled = !!disabled || loading
  const visualState = resolveButtonVisualState(loading, !!disabled, pressed)
  const shape = resolveButtonShape(rounded, deprecatedShape)
  const isDisabled = visualState === 'disabled'

  useEffect(() => {
    if (interactionDisabled) setPressed(false)
  }, [interactionDisabled])

  const onPressIn = useCallback(
    (event: GestureResponderEvent) => {
      onPressInProp?.(event)

      if (!interactionDisabled) setPressed(true)
    },
    [interactionDisabled, onPressInProp]
  )

  const onPressOut = useCallback(
    (event: GestureResponderEvent) => {
      onPressOutProp?.(event)
      setPressed(false)
    },
    [onPressOutProp]
  )

  return (
    <ButtonPressedContext.Provider value={visualState === 'pressed'}>
      <ButtonContainer
        {...props}
        {...{
          size,
          shape,
          disabled: interactionDisabled,
          loading,
          isIconOnly: !!iconOnly,
          style,
          onPressIn,
          onPressOut,
        }}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{
          ...accessibilityState,
          disabled: interactionDisabled,
          busy: loading,
        }}
        onLongPress={interactionDisabled ? undefined : onLongPress}
        onPress={interactionDisabled ? undefined : onPress}
      >
        <ButtonLeftArea
          {...{ size, loading, disabled: isDisabled, Icon, iconPosition }}
        />
        <ButtonLabel
          {...{ size, loading, disabled: isDisabled, iconOnly, label }}
        />
        <ButtonRightArea
          {...{ size, loading, disabled: isDisabled, Icon, iconPosition }}
        />
      </ButtonContainer>
    </ButtonPressedContext.Provider>
  )
}

export const BaseButton = genericMemo(BaseButtonComponent)
