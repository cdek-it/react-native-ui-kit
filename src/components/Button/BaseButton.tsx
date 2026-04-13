import { useCallback, useState } from 'react'
import type { GestureResponderEvent } from 'react-native'

import { genericMemo } from '../../utils/genericMemo'

import type { ButtonProps, ButtonVariant } from './types'
import {
  ButtonLeftArea,
  ButtonRightArea,
  ButtonLabel,
  ButtonContainer,
} from './utils'
import { ButtonPressedContext } from './utils/ButtonPressedContext'

export type BaseButtonComponentProps<Variant extends ButtonVariant> = Omit<
  ButtonProps<Variant>,
  'variant'
> & { readonly variant: Variant }

const BaseButtonComponent = <Variant extends ButtonVariant>({
  size = 'base',
  shape = 'square',
  loading = false,
  variant,
  disabled = false,
  iconOnly,
  iconPosition = 'prefix',
  Icon,
  label,
  style,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  ...props
}: BaseButtonComponentProps<Variant>) => {
  const isDisabled = !!disabled
  const [pressed, setPressed] = useState(false)

  const onPressIn = useCallback(
    (event: GestureResponderEvent) => {
      onPressInProp?.(event)
      setPressed(true)
    },
    [onPressInProp]
  )

  const onPressOut = useCallback(
    (event: GestureResponderEvent) => {
      onPressOutProp?.(event)
      setPressed(false)
    },
    [onPressOutProp]
  )

  return (
    <ButtonPressedContext.Provider value={pressed}>
      <ButtonContainer
        {...{
          size,
          shape,
          disabled: isDisabled,
          loading,
          isIconOnly: !!iconOnly,
          style,
          onPressIn,
          onPressOut,
        }}
        {...props}
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
