import React, { memo, useCallback, useImperativeHandle, useRef } from 'react'
import { type TextInput, View, StyleSheet, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { InputGroupAddon, type InputGroupAddonProps } from './InputGroupAddon'
import { InputTextBase, type InputTextBaseProps } from './InputTextBase'

/** @see InputTextBaseProps */
export interface InputGroupProps extends InputTextBaseProps {
  /** Содержимое левого аддона группы */
  left?: InputGroupAddonProps['content']
  /** Содержимое правого аддона группы */
  right?: InputGroupAddonProps['content']
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
}

/**
 * Компонент группы инпута. Позволяет обернуть инпут в группу и добавить кнопки-аддоны слева и справа
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5932&m=dev
 * @see InputTextBase
 * @see InputGroupAddon
 */
export const InputGroup = memo<InputGroupProps>(
  ({ left, right, style, inputRef: propsInputRef, disabled, ...otherProps }) => {
    const styles = useStyles()
    const inputRef = useRef<TextInput>(null)

    const focus = useCallback(() => inputRef.current?.focus(), [inputRef])

    useImperativeHandle(propsInputRef, () => inputRef.current, [inputRef])

    return (
      <View style={[styles.container, style]}>
        {left && (
          <InputGroupAddon content={left} disabled={disabled} position='left' onPress={focus} />
        )}

        <View style={styles.inputWrapper}>
          <InputTextBase
            containerStyle={StyleSheet.flatten([
              styles.inputContainer,
              !!left && styles.inputContainerForLeftAddon,
              !!right && styles.inputContainerForRightAddon,
            ])}
            disabled={disabled}
            inputRef={inputRef}
            {...otherProps}
          />
        </View>

        {right && (
          <InputGroupAddon content={right} disabled={disabled} position='right' onPress={focus} />
        )}
      </View>
    )
  }
)

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: 'row',
  },
  inputWrapper: {
    flexGrow: 1,
    zIndex: 10,
  },
  inputContainer: {
    flexGrow: 1,
  },
  inputContainerForLeftAddon: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputContainerForRightAddon: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}))
