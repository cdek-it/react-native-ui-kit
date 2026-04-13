import { genericMemo } from '../../../utils/genericMemo'
import type { BaseButtonProps, ButtonSize } from '../types'

import { ButtonActivityIndicator } from './ButtonActivityIndicator'
import { ButtonIcon } from './ButtonIcon'

export interface ButtonLeftAreaProps {
  readonly size: ButtonSize
  readonly iconPosition?: BaseButtonProps<never>['iconPosition']
  readonly loading: boolean
  readonly disabled: boolean
  readonly Icon?: BaseButtonProps<never>['Icon']
}

const ButtonLeftAreaComponent = ({
  size,
  iconPosition,
  Icon,
  loading,
  disabled,
}: ButtonLeftAreaProps) => {
  if (iconPosition === 'left' || iconPosition === 'prefix') {
    if (loading && !disabled) {
      return <ButtonActivityIndicator size={size} />
    }

    return <ButtonIcon {...{ size, disabled, loading, Icon }} />
  }

  return null
}

export const ButtonLeftArea = genericMemo(ButtonLeftAreaComponent)
