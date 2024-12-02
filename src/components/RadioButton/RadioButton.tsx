import React, { memo, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

import { useStateStyles } from './hooks/useStateStyles'

export interface RadioButtonProps {
  /** Обработчик нажатия на кнопку */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Выбор состояния компонента */
  state?: 'default' | 'danger'
}

export const RadioButton = memo<RadioButtonProps>(({ onPress, checked, disabled, state }) => {
  const styles = useStyles()
  const [pressed, setPressed] = useState(false)
  const stateStyles = useStateStyles(checked, disabled, pressed, state)

  const onPressIn = useCallback(() => setPressed(true), [])
  const onPressOut = useCallback(() => setPressed(false), [])

  return (
    <>
      {!disabled && state === 'danger' && (
        <Animated.View layout={LinearTransition.duration(100)} style={[styles.outline]} />
      )}
      <Pressable
        disabled={disabled}
        style={[styles.container, stateStyles.viewState]}
        testID='RadioButton_Pressable'
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <View style={[styles.center, stateStyles.centerViewBackground]} />
      </Pressable>
    </>
  )
})

const useStyles = makeStyles(({ theme }) => ({
  container: {
    position: 'absolute',
    width: theme.Form.RadioButton.radiobuttonWidth,
    height: theme.Form.RadioButton.radiobuttonHeight,
    borderRadius: theme.Form.RadioButton.radiobuttonWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.General.focusShadowWidth,
    marginTop: theme.General.focusShadowWidth,
  },
  center: {
    width: theme.Form.RadioButton.radiobuttonIconSize,
    height: theme.Form.RadioButton.radiobuttonIconSize,
    borderRadius: theme.Form.RadioButton.radiobuttonIconSize,
  },
  outline: {
    position: 'absolute',
    width: theme.Form.RadioButton.radiobuttonWidth + theme.General.focusShadowWidth * 2,
    height: theme.Form.RadioButton.radiobuttonHeight + theme.General.focusShadowWidth * 2,
    borderRadius: theme.Form.RadioButton.radiobuttonHeight + theme.General.focusShadowWidth * 2,
    backgroundColor: theme.General.focusOutlineErrorColor,
  },
}))
