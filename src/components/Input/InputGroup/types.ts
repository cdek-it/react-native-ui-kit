import type { ReactNode } from 'react'

import type { InputLabelProps, InputNativeProps } from '../core/types'

/**
 * Строки и числа в дополнениях оборачиваются в InputGroupAddon, ноды передаются как есть.
 * В произвольное интерактивное дополнение передайте disabled группы.
 *
 * @example
 * <InputGroup
 *   disabled={disabled}
 *   rightAddon={<Button disabled={disabled} label='Найти' onPress={onSearch} />}
 * />
 */
export type InputGroupProps = InputNativeProps &
  InputLabelProps & { leftAddon?: ReactNode; rightAddon?: ReactNode }
