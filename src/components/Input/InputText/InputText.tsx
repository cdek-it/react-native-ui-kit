import { memo } from 'react'

import { InputField } from '../core/InputField'

import type { InputTextProps } from './types'

export type { InputTextProps } from './types'

/**
 * Текстовое поле ввода
 *
 * @example
 * <InputText floatLabel="Email" placeholder="name@example.com" />
 *
 * @see InputTextProps
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/?node-id=25176-76770
 */
export const InputText = memo<InputTextProps>((props) => (
  <InputField {...props} />
))
