import {
  fireEvent,
  isHiddenFromAccessibility,
  render,
  userEvent,
  within,
} from '@testing-library/react-native'
import type { TextInput } from 'react-native'

import { InputOtp, InputOtpTestId, type InputOtpProps } from '../InputOtp'
import { createInputOtpTestIds } from '../testIds'

const hiddenElements = { includeHiddenElements: true }

const renderInputOtp = (props: Partial<InputOtpProps> = {}) => {
  const baseProps: InputOtpProps = { length: 4, onChange: jest.fn(), ...props }
  const result = render(<InputOtp {...baseProps} />)

  return {
    ...result,
    rerenderInputOtp: (nextProps: Partial<InputOtpProps>) =>
      result.rerender(<InputOtp {...baseProps} {...nextProps} />),
  }
}

describe('InputOtp', () => {
  describe('отрисовка и конфигурация', () => {
    test.each([
      { name: 'две ячейки', length: 2, value: '12' },
      { name: 'четыре ячейки', length: 4, value: '1234' },
      { name: 'восемь ячеек', length: 8, value: '12345678' },
    ])('отображает $name', ({ length, value }) => {
      const { getAllByTestId, getByText } = renderInputOtp({ length, value })

      expect(getAllByTestId(InputOtpTestId.item, hiddenElements)).toHaveLength(
        length
      )

      for (const digit of value) {
        expect(getByText(digit, hiddenElements)).toBeOnTheScreen()
      }
    })

    test('нормализует контролируемое значение и ограничивает его длину', () => {
      const { getByTestId, getByText, queryByText } = renderInputOtp({
        value: '1 a2-345',
      })

      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'value',
        '1234'
      )
      expect(queryByText('a', hiddenElements)).not.toBeOnTheScreen()

      for (const digit of '1234') {
        expect(getByText(digit, hiddenElements)).toBeOnTheScreen()
      }
    })

    test('настраивает цифровую клавиатуру и автозаполнение кода', () => {
      const { getByTestId } = renderInputOtp()
      const input = getByTestId(InputOtpTestId.hiddenInput)

      expect(input).toHaveProp('autoComplete', 'one-time-code')
      expect(input).toHaveProp('textContentType', 'oneTimeCode')
      expect(input).toHaveProp('inputMode', 'numeric')
      expect(input).toHaveProp('keyboardType', 'number-pad')
    })

    test('формирует внутренние testID из пользовательского префикса', () => {
      const customTestIds = createInputOtpTestIds('PaymentOtp')
      const { getAllByTestId, getByTestId } = renderInputOtp({
        testID: customTestIds.root,
      })

      expect(getByTestId(customTestIds.root)).toBeOnTheScreen()
      expect(
        getByTestId(customTestIds.content, hiddenElements)
      ).toBeOnTheScreen()
      expect(getByTestId(customTestIds.hiddenInput)).toBeOnTheScreen()
      expect(
        getAllByTestId(customTestIds.itemContainer, hiddenElements)
      ).toHaveLength(4)
    })

    test('передаёт accessibility props скрытому полю ввода', () => {
      const { getAllByTestId, getByTestId, getByText } = renderInputOtp({
        accessibilityHint: 'Введите четыре цифры',
        accessibilityLabel: 'Код из SMS',
        value: '12',
      })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      expect(input).toHaveProp('accessibilityLabel', 'Код из SMS')
      expect(input).toHaveProp('accessibilityHint', 'Введите четыре цифры')
      expect(input).toHaveProp('accessibilityState', { disabled: false })
      expect(isHiddenFromAccessibility(input)).toBeFalse()
      expect(
        isHiddenFromAccessibility(getByText('1', hiddenElements))
      ).toBeTrue()
      expect(getByTestId(InputOtpTestId.root)).toHaveProp('accessible', false)

      for (const item of getAllByTestId(
        InputOtpTestId.itemContainer,
        hiddenElements
      )) {
        expect(item).toHaveProp('accessible', false)
      }
    })
  })

  describe('контролируемый ввод', () => {
    test('игнорирует нецифровой ввод, не изменивший значение', () => {
      const mockedOnChange = jest.fn()
      const { getByTestId } = renderInputOtp({
        onChange: mockedOnChange,
        value: '12',
      })

      fireEvent.changeText(getByTestId(InputOtpTestId.hiddenInput), '12a-')

      expect(mockedOnChange).not.toHaveBeenCalled()
    })

    test('не меняет отображение до обновления контролируемого value', () => {
      const mockedOnChange = jest.fn()
      const { getByTestId, getByText, queryByText, rerenderInputOtp } =
        renderInputOtp({ onChange: mockedOnChange, value: '12' })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent.changeText(input, '123')

      expect(mockedOnChange).toHaveBeenCalledWith('123')
      expect(input).toHaveProp('value', '12')
      expect(queryByText('3', hiddenElements)).not.toBeOnTheScreen()

      rerenderInputOtp({ value: '123' })

      expect(getByText('3', hiddenElements)).toBeOnTheScreen()
      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp('value', '123')
    })

    test('очищает вставленный код от символов и отбрасывает лишние цифры', () => {
      const mockedOnChange = jest.fn()
      const { getByTestId, queryByText, rerenderInputOtp } = renderInputOtp({
        onChange: mockedOnChange,
        value: '',
      })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent(input, 'focus')
      fireEvent.changeText(input, '1 2-3a4 56')

      expect(mockedOnChange).toHaveBeenCalledOnce()
      expect(mockedOnChange).toHaveBeenCalledWith('1234')

      rerenderInputOtp({ value: '1234' })

      expect(queryByText('|', hiddenElements)).not.toBeOnTheScreen()
    })

    test('после последней цифры сохраняет нативный фокус без визуальной каретки', () => {
      const mockedOnBlur = jest.fn()
      const mockedOnChange = jest.fn()
      const { getByTestId, queryByText, rerenderInputOtp } = renderInputOtp({
        onBlur: mockedOnBlur,
        onChange: mockedOnChange,
        value: '123',
      })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent(input, 'focus')
      fireEvent.changeText(input, '1234')

      expect(mockedOnChange).toHaveBeenCalledWith('1234')

      rerenderInputOtp({ value: '1234' })

      expect(mockedOnBlur).not.toHaveBeenCalled()
      expect(queryByText('|', hiddenElements)).not.toBeOnTheScreen()
    })

    test('backspace очищает заполненную и предыдущую пустую позицию', () => {
      const mockedOnChange = jest.fn()
      const { getAllByTestId, getByTestId, rerenderInputOtp } = renderInputOtp({
        onChange: mockedOnChange,
        value: '1234',
      })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent(input, 'focus')
      fireEvent.changeText(input, '123')

      expect(mockedOnChange).toHaveBeenLastCalledWith('123')

      rerenderInputOtp({ value: '123' })

      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[3]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()

      fireEvent.changeText(getByTestId(InputOtpTestId.hiddenInput), '12')

      expect(mockedOnChange).toHaveBeenLastCalledWith('12')

      rerenderInputOtp({ value: '12' })

      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[2]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()
    })
  })

  describe('фокус и selection', () => {
    test('клик по любой ячейке фокусирует первую незаполненную', async () => {
      const user = userEvent.setup()
      let inputRef: TextInput | null = null
      const handleInputRef = (ref: TextInput | null) => {
        inputRef = ref
      }
      const { getAllByTestId, getByTestId } = renderInputOtp({
        inputRef: handleInputRef,
        value: '12',
      })

      if (!inputRef) {
        throw new Error('Input ref was not set')
      }

      const focus = jest.fn()

      Object.assign(inputRef, { focus })
      await user.press(
        getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[3]
      )

      expect(focus).toHaveBeenCalledOnce()

      fireEvent(getByTestId(InputOtpTestId.hiddenInput), 'focus')

      const items = getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)

      expect(
        within(items[2]).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()
      expect(
        within(items[3]).queryByTestId(InputOtpTestId.cursor, hiddenElements)
      ).not.toBeOnTheScreen()
    })

    test('передаёт focus и blur наружу и скрывает каретку после blur', () => {
      const mockedOnBlur = jest.fn()
      const mockedOnFocus = jest.fn()
      const { getByTestId, getByText, queryByText } = renderInputOtp({
        onBlur: mockedOnBlur,
        onFocus: mockedOnFocus,
        value: '12',
      })
      const input = getByTestId(InputOtpTestId.hiddenInput)
      const focusEvent = { nativeEvent: { target: 1 } }
      const blurEvent = { nativeEvent: { target: 1 } }

      fireEvent(input, 'focus', focusEvent)

      expect(mockedOnFocus).toHaveBeenCalledWith(focusEvent)
      expect(getByText('|', hiddenElements)).toBeOnTheScreen()

      fireEvent(input, 'blur', blurEvent)

      expect(mockedOnBlur).toHaveBeenCalledWith(blurEvent)
      expect(queryByText('|', hiddenElements)).not.toBeOnTheScreen()
    })

    test('синхронизирует активную ячейку с переданным selection', () => {
      const selection = { start: 2, end: 3 }
      const { getAllByTestId, getByTestId } = renderInputOtp({
        selection,
        value: '1234',
      })

      fireEvent(getByTestId(InputOtpTestId.hiddenInput), 'focus')

      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'selection',
        selection
      )
      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[2]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()
    })

    test('сообщает повторный ввод выделенной цифры при неизменившемся нативном значении', () => {
      const mockedOnChange = jest.fn()
      const { getByTestId } = renderInputOtp({
        onChange: mockedOnChange,
        selection: { start: 0, end: 1 },
        value: '1234',
      })

      fireEvent.changeText(getByTestId(InputOtpTestId.hiddenInput), '1234')

      expect(mockedOnChange).toHaveBeenCalledOnce()
      expect(mockedOnChange).toHaveBeenCalledWith('1234')
    })

    test('при ошибке отражает управляемый снаружи selection', () => {
      const mockedOnChange = jest.fn()
      const { getAllByTestId, getByTestId, getByText, rerenderInputOtp } =
        renderInputOtp({
          error: true,
          onChange: mockedOnChange,
          selection: { start: 0, end: 1 },
          value: '1234',
        })
      const input = getByTestId(InputOtpTestId.hiddenInput)

      fireEvent(input, 'focus')

      expect(input).toHaveProp('selection', { start: 0, end: 1 })
      expect(
        within(
          getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[0]
        ).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()

      for (const digit of '1234') {
        expect(getByText(digit, hiddenElements)).toBeOnTheScreen()
      }

      for (const item of getAllByTestId(
        InputOtpTestId.itemContainer,
        hiddenElements
      )) {
        expect(item).toHaveStyle({ borderColor: '#db3424' })
      }

      fireEvent.changeText(input, '9234')

      expect(mockedOnChange).toHaveBeenCalledWith('9234')

      rerenderInputOtp({
        error: true,
        selection: { start: 1, end: 2 },
        value: '9234',
      })

      const updatedInput = getByTestId(InputOtpTestId.hiddenInput)
      const items = getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)

      expect(updatedInput).toHaveProp('selection', { start: 1, end: 2 })
      expect(
        within(items[1]).getByTestId(InputOtpTestId.cursor, hiddenElements)
      ).toBeOnTheScreen()
      expect(
        within(items[0]).queryByTestId(InputOtpTestId.cursor, hiddenElements)
      ).not.toBeOnTheScreen()

      fireEvent.changeText(updatedInput, '9834')

      expect(mockedOnChange).toHaveBeenLastCalledWith('9834')

      rerenderInputOtp({
        error: false,
        selection: { start: 2, end: 2 },
        value: '9834',
      })

      expect(
        getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)[0]
      ).toHaveStyle({ borderColor: '#cecfd2' })
    })
  })

  describe('визуальные состояния', () => {
    test('применяет hover только к ячейке под курсором', () => {
      const { getAllByTestId } = renderInputOtp()
      const items = getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)

      fireEvent(items[1], 'hoverIn')

      expect(items[0]).toHaveStyle({ borderColor: '#cecfd2' })
      expect(items[1]).toHaveStyle({ borderColor: '#1dc831' })

      fireEvent(items[1], 'hoverOut')

      expect(items[1]).toHaveStyle({ borderColor: '#cecfd2' })
    })

    test('показывает pressed у всех ячеек через testOnly_pressed', () => {
      const { getAllByTestId } = renderInputOtp({ testOnly_pressed: true })

      for (const item of getAllByTestId(
        InputOtpTestId.itemContainer,
        hiddenElements
      )) {
        expect(item).toHaveStyle({ borderColor: '#1dc831' })
      }
    })

    test('disabled имеет приоритет над error, hover и pressed', () => {
      const { getAllByTestId } = renderInputOtp({
        disabled: true,
        error: true,
        testOnly_pressed: true,
      })
      const items = getAllByTestId(InputOtpTestId.itemContainer, hiddenElements)

      fireEvent(items[0], 'hoverIn')

      for (const item of items) {
        expect(item).toHaveStyle({
          backgroundColor: '#e2e2e4',
          borderColor: '#cecfd2',
          boxShadow: 'none',
          opacity: 0.5,
        })
      }
    })
  })

  describe('запрещённый ввод', () => {
    test('блокирует ячейки и снимает фокус при переходе в disabled', () => {
      let inputRef: TextInput | null = null
      const handleInputRef = (ref: TextInput | null) => {
        inputRef = ref
      }
      const { getAllByTestId, getByTestId, queryByText, rerenderInputOtp } =
        renderInputOtp({ inputRef: handleInputRef, value: '12' })

      fireEvent(getByTestId(InputOtpTestId.hiddenInput), 'focus')

      if (!inputRef) {
        throw new Error('Input ref was not set')
      }

      const blur = jest.fn()

      Object.assign(inputRef, { blur, isFocused: () => true })
      rerenderInputOtp({ disabled: true })

      expect(blur).toHaveBeenCalledOnce()
      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'editable',
        false
      )
      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'accessibilityState',
        { disabled: true }
      )
      expect(queryByText('|', hiddenElements)).not.toBeOnTheScreen()

      for (const item of getAllByTestId(
        InputOtpTestId.itemContainer,
        hiddenElements
      )) {
        expect(item).toBeDisabled()
      }
    })

    test('не фокусирует и визуально блокирует поле при editable=false', async () => {
      const user = userEvent.setup()
      let inputRef: TextInput | null = null
      const handleInputRef = (ref: TextInput | null) => {
        inputRef = ref
      }
      const { getAllByTestId, getByTestId } = renderInputOtp({
        editable: false,
        inputRef: handleInputRef,
      })

      if (!inputRef) {
        throw new Error('Input ref was not set')
      }

      const focus = jest.fn()

      Object.assign(inputRef, { focus })
      await user.press(getByTestId(InputOtpTestId.root))

      expect(focus).not.toHaveBeenCalled()
      expect(getByTestId(InputOtpTestId.hiddenInput)).toHaveProp(
        'editable',
        false
      )

      for (const item of getAllByTestId(
        InputOtpTestId.itemContainer,
        hiddenElements
      )) {
        expect(item).toHaveStyle({ opacity: 0.5 })
      }
    })
  })
})
