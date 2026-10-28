import { fireEvent, render, userEvent } from '@testing-library/react-native'
import type { useWindowDimensions } from 'react-native'

import { InputText, type InputTextSize } from '../..'

const ReactNative = jest.requireActual<{
  useWindowDimensions: typeof useWindowDimensions
}>('react-native')

const mockFontScale = (fontScale: number) =>
  jest
    .spyOn(ReactNative, 'useWindowDimensions')
    .mockReturnValue({ width: 390, height: 844, scale: 3, fontScale })

describe('Input: floating label', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('сохраняет ввод при изменении масштаба обычной подписи без перезапуска', async () => {
    mockFontScale(1)
    const user = userEvent.setup()
    const onChangeText = jest.fn()
    const props = { label: 'Email', maxFontSizeMultiplier: 2, onChangeText }
    const { getByLabelText, getByText, rerender } = render(
      <InputText {...props} />
    )
    const input = getByLabelText('Email')

    await user.type(input, 'test@example.com')

    for (const fontScale of [2, 1]) {
      mockFontScale(fontScale)
      rerender(<InputText {...props} />)

      expect(getByLabelText('Email')).toBe(input)
      expect(input).toHaveDisplayValue('test@example.com')
      expect(
        getByText('Email', { includeHiddenElements: true })
      ).toBeOnTheScreen()
    }

    expect(onChangeText).toHaveBeenLastCalledWith('test@example.com')
  })

  test.each<InputTextSize>(['small', 'base', 'large', 'xlarge'])(
    'сохраняет поле и подпись при измерении, фокусе, вводе и очистке в размере %s',
    async (size) => {
      mockFontScale(1)
      const user = userEvent.setup()
      const onFocus = jest.fn()
      const onBlur = jest.fn()
      const { getByLabelText, getByTestId, getByRole, getByText } = render(
        <InputText
          floatLabel='Email'
          size={size}
          testID='FloatingInput'
          onBlur={onBlur}
          onFocus={onFocus}
        />
      )
      const input = getByLabelText('Email')
      const label = getByText('Email', { includeHiddenElements: true })
      const labelContainer = getByTestId('FloatingInputFloatingLabel', {
        includeHiddenElements: true,
      })

      fireEvent(labelContainer, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 150, height: 26 } },
      })
      await user.type(input, 'test@example.com')
      fireEvent(labelContainer, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 150, height: 15 } },
      })

      expect(input).toHaveDisplayValue('test@example.com')
      expect(getByLabelText('Email')).toBe(input)
      expect(label).toHaveProp('numberOfLines', 1)

      await user.press(getByRole('button', { name: 'Очистить поле' }))
      fireEvent(input, 'blur', { nativeEvent: {} })

      expect(input).toHaveDisplayValue('')
      expect(label).toBeOnTheScreen()
      expect(getByLabelText('Email')).toBe(input)
      expect(onFocus).toHaveBeenCalledWith(
        expect.objectContaining({ nativeEvent: expect.any(Object) })
      )
      expect(onBlur).toHaveBeenCalledWith({ nativeEvent: {} })
    }
  )

  test.each([
    { name: 'обычный шрифт', fontScale: 1, props: {}, lines: 1 },
    { name: 'шрифт 200%', fontScale: 2, props: {}, lines: undefined },
    {
      name: 'отключённое масштабирование',
      fontScale: 2,
      props: { allowFontScaling: false },
      lines: 1,
    },
    {
      name: 'ограничение масштаба до 100%',
      fontScale: 2,
      props: { maxFontSizeMultiplier: 1 },
      lines: 1,
    },
    {
      name: 'неограниченный масштаб',
      fontScale: 2,
      props: { maxFontSizeMultiplier: 0 },
      lines: undefined,
    },
  ])(
    'учитывает $name при переносе длинной подписи',
    ({ fontScale, props, lines }) => {
      mockFontScale(fontScale)
      const label = 'Длинная подпись поля, для которой требуется больше места'
      const { getByText, getByLabelText } = render(
        <InputText floatLabel={label} {...props} />
      )

      const floatingLabel = getByText(label, { includeHiddenElements: true })

      expect(floatingLabel.props.numberOfLines).toBe(lines)
      expect(getByLabelText(label)).toHaveDisplayValue('')
    }
  )
})
