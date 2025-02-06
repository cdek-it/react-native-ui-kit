import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { Pressable } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { usePressableStyles } from './hooks/usePressableStyles'

type CheckboxState = 'default' | 'danger'

export interface CheckboxProps {
  /** Обработчик нажатия на чекбокс */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * true, если необходим компонент в неопределенном состоянии
   * @default false
   */
  indeterminate?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Выбор состояния компонента */
  state: CheckboxState
}

/**
 * Используется для множественного выбора элементов
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5316
 */
export const Checkbox = memo<CheckboxProps>((props: CheckboxProps) => {
  const { onPress, checked = false, disabled = false, indeterminate = false } = props

  const Icon = useMemo(() => {
    if (indeterminate) {
      return IconMinus
    }
    if (checked) {
      return IconCheck
    }
    return null
  }, [indeterminate, checked])

  const pressableStyles = usePressableStyles(props)
  const styles = useStyles()
  return (
    <Pressable
      accessibilityRole='button'
      disabled={disabled}
      hitSlop={10}
      style={pressableStyles}
      testID='CheckboxButton_Pressable'
      onPress={onPress}
    >
      {Icon && <Icon height={styles.icon.height} style={styles.icon} width={styles.icon.width} />}
    </Pressable>
  )
})

const useStyles = makeStyles(({ theme }) => ({
  icon: {
    height: 14,
    width: 14,
    color: theme.Form.Checkbox.checkboxIconActiveColor,
  },
}))
