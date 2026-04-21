import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  StyleSheet as RNStyleSheet,
  Pressable,
  View,
} from 'react-native'
import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleSheet, SvgUniversal } from '../../utils'

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
              color: theme.Form.Checkbox.checkboxIconActiveColor,
            })}
          />
        ) : null}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ theme, border, sizing }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.Form.Checkbox.checkboxWidth,
    height: theme.Form.Checkbox.checkboxHeight,
  },
  background: { ...RNStyleSheet.absoluteFillObject },
  backgroundState: {
    borderRadius: border.Radius['rounded-lg'],
    borderWidth: border.Width.border,
    variants: {
      filled: {
        true: {
          backgroundColor: theme.Form.Checkbox.checkboxActiveBg,
          borderColor: theme.Form.Checkbox.checkboxActiveBorderColor,
        },
        false: {
          backgroundColor: theme.Form.InputText.inputBg,
          borderColor: theme.Form.InputText.inputBorderColor,
        },
      },
      pressed: {
        true: { borderColor: theme.Form.InputText.inputHoverBorderColor },
        false: {},
      },
      state: {
        danger: {
          borderColor: theme.Form.InputText.inputErrorBorderColor,
          outlineStyle: 'solid',
          outlineColor: theme.General.focusOutlineErrorColor,
          outlineWidth: Math.round(theme.General.focusShadowWidth),
        },
      },
      disabled: { true: { outlineWidth: 0 }, false: {} },
    },
    compoundVariants: [
      {
        filled: 'true',
        pressed: 'true',
        styles: {
          backgroundColor: theme.Form.Checkbox.checkboxActiveHoverBg,
          borderColor: theme.Form.Checkbox.checkboxActiveHoverBorderColor,
        },
      },
      {
        filled: 'false',
        disabled: 'true',
        styles: {
          backgroundColor: theme.Button.Disabled.disabledButtonBg,
          borderColor: theme.Form.InputText.inputBorderColor,
          mixBlendMode: 'luminosity',
        },
      },
      {
        filled: 'true',
        disabled: 'true',
        styles: {
          borderColor: theme.Form.Checkbox.checkboxActiveBorderColor,
          opacity: 0.2,
          mixBlendMode: 'luminosity',
        },
      },
    ],
  },
  icon: { height: sizing.Height['h-1'], width: sizing.Width['w-1'] },
}))
