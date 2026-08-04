import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react'

import {
  Pressable,
  View,
  TextInput,
  type TextInputProps,
  type PressableProps,
  type FocusEvent,
  type BlurEvent,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { InputOtpItem } from './InputOtpItem'

export interface InputOtpProps
  extends
    Omit<
      TextInputProps,
      'onChangeText' | 'onChange' | 'ref' | 'keyboardType' | 'style'
    >,
    Pick<PressableProps, 'testOnly_pressed'> {
  length: number
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  inputRef?: Ref<TextInput | null>
}

export const InputOtp = memo<InputOtpProps>(
  ({
    length,
    onChange,
    disabled = false,
    error = false,
    testOnly_pressed,
    inputRef: propsInputRef,
    testID,
    value = '',
    onFocus,
    onBlur,
    editable,
    ...rest
  }) => {
    const [isFocused, setIsFocused] = useState(false)

    const inputRef = useRef<TextInput>(null)
    const isInputEditable = !disabled && editable !== false

    useImperativeHandle<TextInput | null, TextInput | null>(
      propsInputRef,
      () => inputRef.current
    )

    useEffect(() => {
      if (!isInputEditable) {
        setIsFocused(false)

        if (inputRef.current?.isFocused()) {
          inputRef.current.blur()
        }
      }
    }, [isInputEditable])

    const handlePress = useCallback(() => {
      if (isInputEditable) {
        inputRef.current?.focus()
      }
    }, [isInputEditable])

    const handleChange = useCallback(
      (text: string) => {
        const sanitizedText = text.replace(/[^0-9]/g, '')
        onChange(sanitizedText)
      },
      [onChange]
    )

    const handleFocus = useCallback(
      (e: FocusEvent) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e: BlurEvent) => {
        setIsFocused(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    const activeIndex = useMemo(
      () => Math.min(value.length, length - 1),
      [value.length, length]
    )

    const renderArray = useMemo(
      () => Array.from({ length }, (_, i) => `Otp-Item-${i}`),
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
              {renderArray.map((key, index) => (
                <InputOtpItem
                  disabled={disabled}
                  error={error}
                  focused={isFocused ? index === activeIndex : false}
                  key={key}
                  pressed={pressed}
                  testID={`${testID}Item`}
                  value={value[index]}
                />
              ))}
            </View>
            <TextInput
              editable={isInputEditable}
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

const styles = StyleSheet.create(({ semantic }) => ({
  container: {},

  content: { flexDirection: 'row', gap: semantic.dimension.space[200] },

  input: { position: 'absolute', width: 1, height: 1, opacity: 0 },
}))
