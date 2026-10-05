import { memo } from 'react'

import { SvgUniversal, type SvgSource } from '../../../../utils/SvgUniversal'

import type { ButtonResolvedStyles } from '../types'

interface ButtonIconProps {
  readonly Icon: SvgSource
  readonly uniProps: ButtonResolvedStyles['icon']
}

export const ButtonIcon = memo<ButtonIconProps>(({ Icon, uniProps }) => (
  <SvgUniversal source={Icon} testID='Button_Icon' uniProps={uniProps} />
))
