import {
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react-native'
import { createRef } from 'react'
import type { TextInput } from 'react-native'

import { InputOtpTestId } from '../InputOtp'
import { InputOtpErrorRecoveryScenario } from '../InputOtpErrorRecoveryScenario'

const hiddenElements = { includeHiddenElements: true }

describe('InputOtp: внешний сценарий повторного ввода после ошибки', () => {
  test('после ошибки фокусирует первую ячейку и заменяет код первой новой цифрой', async () => {
    const inputRef = createRef<TextInput>()
    let resolveValidation!: (isValid: boolean) => void
    const validateOtp = jest.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveValidation = resolve
        })
    )
    const { getAllByTestId, getByTestId } = render(
      <InputOtpErrorRecoveryScenario
        inputRef={inputRef}
        validateOtp={validateOtp}
      />
    )
    const input = getByTestId(InputOtpTestId.hiddenInput)

    if (!inputRef.current) {
      throw new Error('Input ref was not set')
    }

    const focus = jest.fn()

    Object.assign(inputRef.current, { focus })

    fireEvent(input, 'focus')
    fireEvent.changeText(input, '1234')

    expect(validateOtp).toHaveBeenCalledOnce()
    expect(validateOtp).toHaveBeenCalledWith('1234')

    await waitFor(() => {
      expect(input).toHaveProp('editable', false)
    })

    await act(async () => {
      resolveValidation(false)
    })

    await waitFor(() => {
      expect(focus).toHaveBeenCalledOnce()
    })

    expect(input).toHaveProp('editable', true)
    expect(input).toHaveProp('selection', { start: 4, end: 4 })

    // RNTL не генерирует native focus event при вызове focus() через ref.
    // Отдельно эмулируем ответ платформы на программный фокус consumer-а.
    fireEvent(input, 'focus')

    await waitFor(() => {
      expect(input).toHaveProp('selection', { start: 0, end: 1 })
    })

    expect(
      within(
        getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[0]
      ).getByTestId(InputOtpTestId.cursor, hiddenElements)
    ).toBeOnTheScreen()

    fireEvent.changeText(input, '5234')

    await waitFor(() => {
      expect(input).toHaveProp('value', '5')
    })

    expect(input).toHaveProp('selection', { start: 1, end: 1 })
  })
})
