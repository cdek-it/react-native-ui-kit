import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { type AccessibilityProps, Pressable } from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { makeStyles } from '../../utils/makeStyles'

import { usePressableStyles } from './hooks/usePressableStyles'

type CheckboxState = 'default' | 'danger'

export interface CheckboxProps
  extends AccessibilityProps,
    Pick<ViewProps, 'testID'> {
  /** Обработчик нажатия на чекбокс */
  readonly onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  readonly checked?: boolean
  /**
   * true, если необходим компонент в неопределенном состоянии
   * @default false
   */
  readonly indeterminate?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  readonly disabled?: boolean
  /** Выбор состояния компонента */
  readonly state: CheckboxState
}

/**
 * Используется для множественного выбора элементов
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5316
 */
export const Checkbox = memo<CheckboxProps>(
  ({
    onPress,
    checked = false,
    disabled = false,
    indeterminate = false,
    testID,
    state,
  }: CheckboxProps) => {
    const Icon = useMemo(() => {
      if (indeterminate) {
        return IconMinus
      }

      if (checked) {
        return IconCheck
      }

      return null
    }, [indeterminate, checked])

    const pressableStyles = usePressableStyles({
      checked,
      indeterminate,
      disabled,
      state,
    })
    const styles = useStyles()

    return (
      <Pressable
        accessibilityRole='button'
        disabled={disabled}
        hitSlop={10}
        style={pressableStyles}
        testID={testID || 'CheckboxButton_Pressable'}
        onPress={onPress}
      >
        {Icon ? (
          <Icon
            height={styles.icon.height}
            style={styles.icon}
            width={styles.icon.width}
          />
        ) : null}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  icon: {
    height: 14,
    width: 14,
    color: theme.Form.Checkbox.checkboxIconActiveColor,
  },
}))
