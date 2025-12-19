import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { makeStyles } from '../../utils/makeStyles'

import { usePressableStyles } from './hooks/usePressableStyles'

type CheckboxState = 'default' | 'danger'

export interface CheckboxProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
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
    const [isPressed, setIsPressed] = useState(false)

    const Icon = useMemo(() => {
      if (indeterminate) {
        return IconMinus
      }

      if (checked) {
        return IconCheck
      }

      return null
    }, [indeterminate, checked])

    const getPressableStyles = usePressableStyles({
      checked,
      indeterminate,
      disabled,
      state,
    })

    const styles = useStyles()

    const onPressIn = useCallback(() => {
      setIsPressed(true)
    }, [])

    const onPressOut = useCallback(() => {
      setIsPressed(false)
    }, [])

    const pressableStyles = useMemo(() => {
      return getPressableStyles(isPressed)
    }, [getPressableStyles, isPressed])

    return (
      <Pressable
        accessibilityRole='button'
        disabled={disabled}
        hitSlop={10}
        style={styles.container}
        testID={testID || 'CheckboxButton_Pressable'}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={[styles.background, pressableStyles]} />
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

const useStyles = makeStyles(({ theme, sizing }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.Form.Checkbox.checkboxWidth,
    height: theme.Form.Checkbox.checkboxHeight,
  },
  background: { ...StyleSheet.absoluteFillObject },
  icon: {
    height: sizing.Height['h-1'],
    width: sizing.Width['w-1'],
    color: theme.Form.Checkbox.checkboxIconActiveColor,
  },
}))
