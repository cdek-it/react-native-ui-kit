import { memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import { type TextInput, View, StyleSheet, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

import { FloatLabel, type FloatLabelProps } from './FloatLabel'
import { InputGroupAddon, type InputGroupAddonProps } from './InputGroupAddon'
import { InputTextBase, type InputTextBaseProps } from './InputTextBase'

/** @see InputTextBaseProps */
interface InputGroupBaseProps {
  /** Содержимое левого аддона группы */
  left?: InputGroupAddonProps['content']
  /** Содержимое правого аддона группы */
  right?: InputGroupAddonProps['content']
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
}

export type InputGroupProps =
  | (InputGroupBaseProps & { input: 'FloatLabel' } & FloatLabelProps)
  | (InputGroupBaseProps & { input: 'InputTextBase' } & InputTextBaseProps)

/**
 * Компонент группы инпута. Позволяет обернуть инпут в группу и добавить кнопки-аддоны слева и справа
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5932&m=dev
 * @see InputTextBase
 * @see InputGroupAddon
 */
export const InputGroup = memo<InputGroupProps>(
  ({
    left,
    right,
    style,
    disabled,
    inputRef: propsInputRef,
    input = 'InputTextBase',
    ...otherProps
  }) => {
    const styles = useStyles()
    const inputRef = useRef<TextInput>(null)

    const focus = useCallback(() => inputRef.current?.focus(), [inputRef])
    useImperativeHandle(propsInputRef, () => inputRef.current, [inputRef])

    const containerStyle = useMemo(() => {
      return StyleSheet.flatten([
        styles.inputContainer,
        !!left && styles.inputContainerForLeftAddon,
        !!right && styles.inputContainerForRightAddon,
      ])
    }, [
      left,
      right,
      styles.inputContainer,
      styles.inputContainerForLeftAddon,
      styles.inputContainerForRightAddon,
    ])

    const renderInput = useCallback(() => {
      if (input === 'FloatLabel') {
        return (
          <FloatLabel
            containerStyle={containerStyle}
            disabled={disabled}
            inputRef={inputRef}
            placeholder={otherProps.placeholder || ''}
            {...otherProps}
          />
        )
      }

      return (
        <InputTextBase
          containerStyle={containerStyle}
          disabled={disabled}
          inputRef={inputRef}
          {...otherProps}
        />
      )
    }, [input, inputRef, containerStyle, disabled, otherProps])

    return (
      <View style={[styles.container, style]}>
        {left ? (
          <InputGroupAddon
            content={left}
            disabled={disabled}
            position='left'
            onPress={focus}
          />
        ) : null}

        <View style={styles.inputWrapper}>{renderInput()}</View>

        {right ? (
          <InputGroupAddon
            content={right}
            disabled={disabled}
            position='right'
            onPress={focus}
          />
        ) : null}
      </View>
    )
  }
)

const useStyles = makeStyles(() => ({
  container: { flexDirection: 'row' },
  inputWrapper: { flexGrow: 1, zIndex: 10 },
  inputContainer: { flexGrow: 1 },
  inputContainerForLeftAddon: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  inputContainerForRightAddon: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}))
