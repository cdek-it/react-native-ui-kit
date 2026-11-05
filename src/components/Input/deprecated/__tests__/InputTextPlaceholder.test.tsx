import { fireEvent, render } from '@testing-library/react-native'
import { StyleSheet, TextInput, View } from 'react-native'

import { InputTextBase } from '../InputTextBase/InputTextBase'
import type { RenderTextInputArgs } from '../InputTextBase/types'

describe('InputTextBase placeholder', () => {
  test.each([
    { name: 'стандартном вводе', renderTextInput: undefined },
    {
      name: 'кастомном вводе',
      renderTextInput: ({ inputRef, ...props }: RenderTextInputArgs) => (
        <TextInput {...props} ref={inputRef} />
      ),
    },
  ])('резервирует место для подписи при $name', ({ renderTextInput }) => {
    const { getByTestId } = render(
      <InputTextBase
        allowFontScaling
        maxFontSizeMultiplier={2}
        placeholder='Длинная подпись поля, которая переносится на несколько строк'
        renderTextInput={renderTextInput}
      />
    )
    const placeholder = getByTestId('InputTextBasePlaceholder', {
      includeHiddenElements: true,
    })
    const inputContainer = () =>
      getByTestId('InputTextBasePressableContainer').find(
        ({ type }: { type: unknown }) => type === View
      )
    const reservedHeight = () =>
      StyleSheet.flatten(inputContainer().props.style).minHeight ?? 0
    const measure = (height: number) =>
      fireEvent(placeholder, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 200, height } },
      })

    const firstHeight = 72
    measure(firstHeight)

    expect(reservedHeight()).toBeGreaterThanOrEqual(firstHeight)

    const grownHeight = firstHeight * 2
    measure(grownHeight)

    expect(reservedHeight()).toBeGreaterThanOrEqual(grownHeight)

    const shrunkHeight = firstHeight / 2
    measure(shrunkHeight)

    expect(reservedHeight()).toBeGreaterThanOrEqual(shrunkHeight)
    expect(reservedHeight()).toBeLessThan(grownHeight)
  })
})
