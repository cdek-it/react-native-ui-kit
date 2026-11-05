import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from 'react'
import type {
  BlurEvent,
  FocusEvent,
  TextInput,
  TextInputProps,
} from 'react-native'

type InputTextControllerProps = Pick<
  TextInputProps,
  'value' | 'defaultValue' | 'autoFocus' | 'onFocus' | 'onBlur' | 'onChangeText'
> & { inputRef?: Ref<TextInput | null> }

export const useInputTextController = ({
  value: controlledValue,
  defaultValue = '',
  autoFocus = false,
  onFocus: propsOnFocus,
  onBlur: propsOnBlur,
  onChangeText: propsOnChangeText,
  inputRef: forwardedRef,
}: InputTextControllerProps) => {
  const inputRef = useRef<TextInput>(null)
  const [valueState, setValueState] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(autoFocus)

  const onFocus = useCallback(
    (event: FocusEvent) => {
      setIsFocused(true)
      propsOnFocus?.(event)
    },
    [propsOnFocus]
  )
  const onBlur = useCallback(
    (event: BlurEvent) => {
      setIsFocused(false)
      propsOnBlur?.(event)
    },
    [propsOnBlur]
  )
  const onChangeText = useCallback(
    (value: string) => {
      propsOnChangeText?.(value)

      if (controlledValue === undefined) setValueState(value)
    },
    [controlledValue, propsOnChangeText]
  )
  const clear = useCallback(() => onChangeText(''), [onChangeText])
  const focus = useCallback(() => inputRef.current?.focus(), [])

  const imperativeHandle = useMemo(
    () =>
      new Proxy(
        {},
        {
          get(_, prop) {
            if (prop === 'clear') {
              return clear
            }

            const input = inputRef.current
            const member = input?.[prop as keyof TextInput]

            return typeof member === 'function' ? member.bind(input) : member
          },
        }
      ) as TextInput,
    [clear]
  )

  useImperativeHandle<TextInput | null, TextInput | null>(
    forwardedRef,
    () => (inputRef.current ? imperativeHandle : null),
    [imperativeHandle]
  )

  return {
    inputRef,
    value: controlledValue ?? valueState,
    isFocused,
    onFocus,
    onBlur,
    onChangeText,
    clear,
    focus,
  }
}
