import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { Pressable, View } from 'react-native'

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
  const { onPress, checked = false, disabled = false, indeterminate = false, state } = props

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
    <View>
      {state === 'danger' && <View style={styles.outline} />}
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
    </View>
  )
})

const useStyles = makeStyles(({ theme }) => ({
  outline: {
    position: 'absolute',
    width: theme.Form.Checkbox.checkboxWidth + theme.General.focusShadowWidth * 2,
    height: theme.Form.Checkbox.checkboxHeight + theme.General.focusShadowWidth * 2,
    borderRadius: 7,
    backgroundColor: theme.General.focusOutlineErrorColor,
  },
  icon: {
    height: 14,
    width: 14,
    color: theme.Form.Checkbox.checkboxIconActiveColor,
  },
}))
