import { memo } from 'react'

import { InputField } from '../core/InputField'

import type { InputGroupProps } from './types'

export type { InputGroupProps } from './types'

/**
 * Поле ввода с дополнениями по краям
 *
 * @see InputGroupProps
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/?node-id=437-3505
 */
export const InputGroup = memo<InputGroupProps>((props) => (
  <InputField testID='InputGroup' {...props} />
))
