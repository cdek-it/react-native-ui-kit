import { memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import {
  type TextInput,
  View,
  StyleSheet as RNStyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import type { InputTextBaseProps } from './InputTextBase/types'

import {
  LegacyInputGroupAddon as InputGroupAddon,
  type LegacyInputGroupAddonProps as InputGroupAddonProps,
} from './LegacyInputGroupAddon'
import { LegacyInputText as InputText } from './LegacyInputText'

/** @see InputTextBaseProps */
interface InputGroupBaseProps {
  /** Содержимое левого аддона группы */
  left?: InputGroupAddonProps['content']
  /** Содержимое правого аддона группы */
  right?: InputGroupAddonProps['content']
  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
}

export type LegacyInputGroupProps = InputGroupBaseProps & InputTextBaseProps

/**
 * Компонент группы инпута. Позволяет обернуть инпут в группу и добавить кнопки-аддоны слева и справа
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5932&m=dev
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24037-68
 * @see InputTextBase
 * @see LegacyInputGroupAddon
 */
export const LegacyInputGroup = memo<LegacyInputGroupProps>(
  ({
    left,
    right,
    style,
    disabled,
    inputRef: propsInputRef,
    ...otherProps
  }) => {
    const inputRef = useRef<TextInput>(null)

    const focus = useCallback(() => inputRef.current?.focus(), [inputRef])
    useImperativeHandle<TextInput | null, TextInput | null>(
      propsInputRef,
      () => inputRef.current,
      [inputRef]
    )

    const containerStyle = useMemo(() => {
      return RNStyleSheet.flatten([
        styles.inputContainer,
        !!left && styles.inputContainerForLeftAddon,
        !!right && styles.inputContainerForRightAddon,
      ])
    }, [left, right])

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

        <View style={styles.inputWrapper}>
          <InputText
            containerStyle={containerStyle}
            disabled={disabled}
            inputRef={inputRef}
            {...otherProps}
          />
        </View>

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

const styles = StyleSheet.create(() => ({
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
