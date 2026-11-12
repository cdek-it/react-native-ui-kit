import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react'
import type { TextInput } from 'react-native'

import { InputOtp } from './InputOtp'

const OTP_LENGTH = 4

export interface InputOtpErrorRecoveryScenarioProps {
  readonly inputRef?: Ref<TextInput | null>
  readonly validateOtp: (value: string) => Promise<boolean>
}

// Сценарий намеренно имитирует consumer: загрузка, валидация и восстановление
// после ошибки не являются ответственностью библиотечного InputOtp.
export const InputOtpErrorRecoveryScenario = ({
  inputRef: propsInputRef,
  validateOtp,
}: InputOtpErrorRecoveryScenarioProps) => {
  const inputRef = useRef<TextInput>(null)
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [value, setValue] = useState('')

  useImperativeHandle<TextInput | null, TextInput | null>(
    propsInputRef,
    () => inputRef.current
  )

  const onChange = useCallback(
    async (nextValue: string) => {
      if (error) {
        const replacement = nextValue[selection.start] ?? ''
        const cursorPosition = replacement.length

        setError(false)
        setSelection({ start: cursorPosition, end: cursorPosition })
        setValue(replacement)

        return
      }

      const cursorPosition = nextValue.length

      setSelection({ start: cursorPosition, end: cursorPosition })
      setValue(nextValue)

      if (nextValue.length === OTP_LENGTH) {
        inputRef.current?.blur()
        setIsChecking(true)

        const isValid = await validateOtp(nextValue)

        setIsChecking(false)

        if (!isValid) {
          setError(true)
        }
      }
    },
    [error, selection.start, validateOtp]
  )

  const onFocus = useCallback(() => {
    if (error) {
      setSelection({ start: 0, end: 1 })
    }
  }, [error])

  useEffect(() => {
    if (error) {
      inputRef.current?.focus()
    }
  }, [error])

  return (
    <InputOtp
      accessibilityLabel='Код подтверждения'
      disabled={isChecking}
      error={error}
      inputRef={inputRef}
      length={OTP_LENGTH}
      selection={selection}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
  )
}
