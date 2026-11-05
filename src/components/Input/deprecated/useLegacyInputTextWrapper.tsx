import { useCallback, useState } from 'react'

import { InputTextBase } from './InputTextBase/InputTextBase'
import type { InputTextCoreProps } from './InputTextBase/types'
import { inputSizeStyles } from './InputTextBase/useInputStyles'

import { LegacySecureTextEntryButton } from './LegacySecureTextEntryButton'
import { resolveInputTextMinHeight } from './resolveInputTextMinHeight'
import type { InputTextCompatibilityProps } from './types'

export const isInputTextCoreProps = (
  props: InputTextCompatibilityProps
): props is InputTextCoreProps =>
  props.secureTextEntry !== 'toggleable' &&
  props.size !== 'medium' &&
  typeof props.size !== 'number'

export const useLegacyInputTextWrapper = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const toggleSecureTextEntry = useCallback(() => {
    setIsPasswordHidden((hidden) => !hidden)
  }, [])

  return ({
    size = 'base',
    secureTextEntry = false,
    containerStyle,
    floatLabel,
    ...otherProps
  }: InputTextCompatibilityProps) => {
    const hasLegacySize = typeof size === 'number' || size === 'medium'
    const minHeight =
      hasLegacySize && !floatLabel
        ? resolveInputTextMinHeight(size, inputSizeStyles)
        : undefined

    return (
      <InputTextBase
        {...otherProps}
        containerStyle={[
          minHeight !== undefined && { minHeight },
          containerStyle,
        ]}
        floatLabel={floatLabel}
        renderRightAccessory={
          secureTextEntry === 'toggleable'
            ? ({ hitSlop, iconSize, makeTestId }) => (
                <LegacySecureTextEntryButton
                  hitSlop={hitSlop}
                  iconSize={iconSize}
                  isPasswordHidden={isPasswordHidden}
                  testID={makeTestId('SecureInputButton')}
                  onPress={toggleSecureTextEntry}
                />
              )
            : undefined
        }
        secureTextEntry={
          secureTextEntry === 'toggleable' ? isPasswordHidden : secureTextEntry
        }
        size={hasLegacySize ? 'base' : size}
      />
    )
  }
}
