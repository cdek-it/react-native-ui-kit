import {
  act,
  fireEvent,
  render,
  userEvent,
  waitFor,
  within,
} from '@testing-library/react-native'
import { useRef, useState } from 'react'
import { Text, type TextInput } from 'react-native'

import { InputOtp, InputOtpTestId } from '../InputOtp'

const hiddenElements = { includeHiddenElements: true }

interface InputOtpErrorRecoveryMockProps {
  readonly validateOtp: (value: string) => Promise<boolean>
}

// Валидация и сброс кода намеренно принадлежат mock-consumer: тест проверяет,
// что публичного API InputOtp достаточно без переноса бизнес-логики в библиотеку.
const InputOtpErrorRecoveryMock = ({
  validateOtp,
}: InputOtpErrorRecoveryMockProps) => {
  const inputRef = useRef<TextInput>(null)
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(false)
  const [selection, setSelection] = useState({ start: 3, end: 3 })
  const [value, setValue] = useState('123')

  const handleChange = async (nextValue: string) => {
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

    if (nextValue.length === 4) {
      inputRef.current?.blur()
      setDisabled(true)

      const isValid = await validateOtp(nextValue)

      setDisabled(false)

      if (!isValid) {
        setError(true)
        setSelection({ start: 0, end: 1 })
      }
    }
  }

  return (
    <>
      <InputOtp
        disabled={disabled}
        error={error}
        inputRef={inputRef}
        length={4}
        selection={selection}
        value={value}
        onChange={handleChange}
      />
      {error ? <Text>Неверный код</Text> : null}
    </>
  )
}

describe('InputOtp: внешний сценарий повторного ввода после ошибки', () => {
  test.each([
    {
      digit: '5',
      name: 'новая цифра отличается от прежней',
      nativeValue: '5234',
    },
    {
      digit: '1',
      name: 'новая цифра совпадает с прежней',
      nativeValue: '1234',
    },
  ])(
    '$name: первый ввод снимает ошибку и очищает остальные цифры',
    async ({ digit, nativeValue }) => {
      const user = userEvent.setup()
      let resolveValidation!: (isValid: boolean) => void
      const validateOtp = jest.fn(
        () =>
          new Promise<boolean>((resolve) => {
            resolveValidation = resolve
          })
      )
      const { getAllByTestId, getByTestId, getByText, queryByText } = render(
        <InputOtpErrorRecoveryMock validateOtp={validateOtp} />
      )
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent(input, 'focus')
      fireEvent.changeText(input, '1234')

      expect(validateOtp).toHaveBeenCalledOnce()
      expect(validateOtp).toHaveBeenCalledWith('1234')

      await waitFor(() => {
        expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
          'editable',
          false
        )
      })

      expect(queryByText('|', hiddenElements)).not.toBeOnTheScreen()

      await act(async () => {
        resolveValidation(false)
      })

      await waitFor(() => {
        expect(getByText('Неверный код')).toBeOnTheScreen()
      })

      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp('selection', {
        start: 0,
        end: 1,
      })
      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'value',
        '1234'
      )

      await user.press(
        getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[3]
      )
      fireEvent(getByTestId(InputOtpTestId.hiddenInput), 'focus')

      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[0]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()

      fireEvent.changeText(getByTestId(InputOtpTestId.hiddenInput), nativeValue)

      await waitFor(() => {
        expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
          'value',
          digit
        )
      })

      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp('selection', {
        start: 1,
        end: 1,
      })
      expect(queryByText('Неверный код')).not.toBeOnTheScreen()

      for (const clearedDigit of '234') {
        expect(queryByText(clearedDigit, hiddenElements)).not.toBeOnTheScreen()
      }

      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[1]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()
    }
  )
})
