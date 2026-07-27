import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  StyleSheet as RNStyleSheet,
  Pressable,
  View,
} from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal } from '../../utils'

type CheckboxState = 'default' | 'danger'

export interface CheckboxProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
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
export const Checkbox = memo<CheckboxProps>(
  ({
    onPress,
    checked = false,
    disabled = false,
    indeterminate = false,
    testID,
    state,
  }) => {
    const [isPressed, setIsPressed] = useState(false)

    const filled = checked || indeterminate

    styles.useVariants({
      filled: filled ? 'true' : 'false',
      pressed: isPressed ? 'true' : 'false',
      state: state === 'danger' ? 'danger' : undefined,
      disabled: disabled ? 'true' : 'false',
    })

    const Icon = useMemo(() => {
      if (indeterminate) {
        return IconMinus
      }

      if (checked) {
        return IconCheck
      }

      return null
    }, [indeterminate, checked])

    const onPressIn = useCallback(() => {
      setIsPressed(true)
    }, [])

    const onPressOut = useCallback(() => {
      setIsPressed(false)
    }, [])

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
        <View style={[styles.background, styles.backgroundState]} />
        {Icon ? (
          <SvgUniversal
            {...styles.icon}
            source={Icon}
            uniProps={({ theme }) => ({
              color: theme.Checkbox.icon.checkedColor,
            })}
          />
        ) : null}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ theme, sizing }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.Checkbox.width,
    height: theme.Checkbox.height,
  },
  background: { ...RNStyleSheet.absoluteFillObject },
  backgroundState: {
    borderRadius: theme.Checkbox.borderRadius,
    borderWidth: theme.Checkbox.extend.borderWidth,
    variants: {
      filled: {
        true: {
          backgroundColor: theme.Checkbox.checkedBackground,
          borderColor: theme.Checkbox.checkedBorderColor,
        },
        false: {
          backgroundColor: theme.Checkbox.background,
          borderColor: theme.Checkbox.borderColor,
        },
      },
      pressed: {
        true: { borderColor: theme.Checkbox.hoverBorderColor },
        false: {},
      },
      // v2 не содержит error-outline токена для checkbox — danger сводится к
      // смене цвета рамки на invalidBorderColor (web-only outline не переносим).
      state: { danger: { borderColor: theme.Checkbox.invalidBorderColor } },
      // Объявление нужно для типизации useVariants; сами стили — в compoundVariants.
      disabled: { true: {}, false: {} },
    },
    compoundVariants: [
      {
        filled: 'true',
        pressed: 'true',
        styles: {
          backgroundColor: theme.Checkbox.checkedHoverBackground,
          borderColor: theme.Checkbox.checkedHoverBorderColor,
        },
      },
      {
        filled: 'false',
        disabled: 'true',
        styles: {
          backgroundColor: theme.Checkbox.disabledBackground,
          borderColor: theme.Checkbox.borderColor,
          mixBlendMode: 'luminosity',
        },
      },
      {
        filled: 'true',
        disabled: 'true',
        styles: {
          borderColor: theme.Checkbox.checkedBorderColor,
          opacity: 0.2,
          mixBlendMode: 'luminosity',
        },
      },
    ],
  },
  icon: { height: sizing.Height['h-1'], width: sizing.Width['w-1'] },
}))
