import { memo, useCallback, useMemo, useRef, useState } from 'react'

import {
  Pressable,
  View,
  TextInput,
  type TextInputProps,
  type PressableProps,
} from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'

import { InputOtpItem } from './InputOtpItem'

export interface InputOtpProps
  extends Omit<
      TextInputProps,
      | 'onChangeText'
      | 'onChange'
      | 'onFocus'
      | 'onBlur'
      | 'ref'
      | 'keyboardType'
      | 'style'
    >,
    Pick<PressableProps, 'testOnly_pressed'> {
  length: number
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export const InputOtp = memo<InputOtpProps>(
  ({
    length,
    onChange,
    disabled = false,
    error = false,
    testOnly_pressed,
    testID,
    value = '',
    ...rest
  }) => {
    const styles = useStyles()
    const [isFocused, setIsFocused] = useState(false)

    const inputRef = useRef<TextInput>(null)

    const handlePress = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const handleChange = useCallback(
      (text: string) => {
        const sanitizedText = text.replace(/[^0-9]/g, '')
        onChange(sanitizedText)
      },
      [onChange]
    )

    const handleFocus = useCallback(() => {
      setIsFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
      setIsFocused(false)
    }, [])

    const activeIndex = useMemo(
      () => Math.min(value.length, length - 1),
      [value.length, length]
    )

    const renderArray = useMemo(
      () => Array.from({ length }).fill(null),
      [length]
    )

    return (
      <Pressable
        disabled={disabled}
        style={styles.container}
        testID={testID}
        testOnly_pressed={testOnly_pressed}
        onPress={handlePress}
      >
        {({ pressed }) => (
          <>
            <View style={styles.content}>
              {renderArray.map((_, index) => (
                <InputOtpItem
                  disabled={disabled}
                  error={error}
                  focused={isFocused ? index === activeIndex : false}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  pressed={pressed}
                  testID={`${testID}Item`}
                  value={value[index]}
                />
              ))}
            </View>
            <TextInput
              keyboardType='number-pad'
              maxLength={length}
              ref={inputRef}
              style={styles.input}
              testID={`${testID}HiddenInput`}
              value={value}
              onBlur={handleBlur}
              onChangeText={handleChange}
              onFocus={handleFocus}
              {...rest}
            />
          </>
        )}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ spacing }) => ({
  container: {},

  content: { flexDirection: 'row', gap: spacing.Gap['gap-2'] },

  input: { position: 'absolute', width: 1, height: 1, opacity: 0 },
}))
