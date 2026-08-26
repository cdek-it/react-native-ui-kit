import {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import { createInputOtpTestIds, InputOtpTestId } from './testIds'

export { InputOtpTestId } from './testIds'

export interface InputOtpProps
  extends
    Omit<
      TextInputProps,
      | 'onChangeText'
      | 'onChange'
      | 'ref'
      | 'style'
      | 'inputMode'
      | 'keyboardType'
    >,
    Pick<PressableProps, 'testOnly_pressed'> {
  length: number
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  inputRef?: Ref<TextInput | null>
}

const normalizeOtpValue = (value: string, length: number) =>
  value.replace(/[^0-9]/g, '').slice(0, length)

const getDefaultSelection = (value: string) => ({
  start: value.length,
  end: value.length,
})

const getActiveIndex = (selectionStart: number, length: number) =>
  Math.min(Math.max(selectionStart, 0), length - 1)

/**
 * Поле для ввода одноразового пароля.
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=318-1373
 */
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
    accessibilityState,
    autoComplete = 'one-time-code',
    selection,
    textContentType = 'oneTimeCode',
    editable,
    ...rest
  }) => {
    const [isFocused, setIsFocused] = useState(false)

    const inputRef = useRef<TextInput>(null)
    const isInputEditable = !disabled && editable !== false
    const inputValue = normalizeOtpValue(value, length)
    const inputSelection = selection ?? getDefaultSelection(inputValue)
    const hasSelectedText =
      (inputSelection.end ?? inputSelection.start) > inputSelection.start

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
        const nextValue = normalizeOtpValue(text, length)
        const isSameValueReplacement = hasSelectedText && text === inputValue

        if (nextValue !== inputValue || isSameValueReplacement) {
          onChange(nextValue)
        }
      },
      [hasSelectedText, inputValue, length, onChange]
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

    const activeIndex = getActiveIndex(inputSelection.start, length)
    const testIds = createInputOtpTestIds(testID ?? InputOtpTestId.root)

    return (
      <Pressable
        accessible={false}
        disabled={!isInputEditable}
        style={styles.container}
        testID={testIds.root}
        onPress={handlePress}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility='no-hide-descendants'
          style={styles.content}
          testID={testIds.content}
        >
          {Array.from({ length }, (_, index) => (
            <InputOtpItem
              disabled={!isInputEditable}
              error={error}
              focused={Boolean(
                isFocused && isInputEditable && index === activeIndex
              )}
              key={`Otp-Item-${index}`}
              testIdPrefix={testIds.root}
              testOnly_pressed={testOnly_pressed}
              value={inputValue[index]}
              onPress={handlePress}
            />
          ))}
        </View>
        <TextInput
          {...rest}
          accessibilityState={{
            ...accessibilityState,
            disabled: !isInputEditable,
          }}
          autoComplete={autoComplete}
          editable={isInputEditable}
          inputMode='numeric'
          keyboardType='number-pad'
          ref={inputRef}
          selection={inputSelection}
          style={styles.input}
          testID={testIds.hiddenInput}
          textContentType={textContentType}
          value={inputValue}
          onBlur={handleBlur}
          onChangeText={handleChange}
          onFocus={handleFocus}
        />
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ components }) => ({
  container: {},

  content: { flexDirection: 'row', gap: components.inputotp.root.gap },

  input: { position: 'absolute', width: 1, height: 1, opacity: 0 },
}))
