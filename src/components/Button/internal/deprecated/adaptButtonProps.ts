import type { ButtonShape } from '../../types'

export const adaptButtonProps = <
  Props extends { rounded?: boolean; shape?: ButtonShape },
>({
  shape,
  rounded,
  ...props
}: Props) => ({ ...props, rounded: rounded ?? shape === 'circle' })
