import { render, userEvent } from '@testing-library/react-native'
import React, { createRef } from 'react'
import type { TextInput } from 'react-native'

import { FloatLabel } from '../FloatLabel'

describe('FloatLabel interactions', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runAllTimers()
  })

  test('should focus on container press', async () => {
    const inputRef = createRef<TextInput>()
    const { getByTestId } = render(<FloatLabel inputRef={inputRef} placeholder='Label' />)
    const pressableContainer = getByTestId('FloatLabel_PressableContainer')
    const user = userEvent.setup()

    expect(inputRef.current?.focus).not.toHaveBeenCalled()
    await user.press(pressableContainer)
    expect(inputRef.current?.focus).toHaveBeenCalled()
  })

  test('should handle focus, blur and onChangeText', async () => {
    const mockedOnFocus = jest.fn()
    const mockedOnBlur = jest.fn()
    const mockedOnChangeText = jest.fn()

    const { getByTestId } = render(
      <FloatLabel
        placeholder='Label'
        onBlur={mockedOnBlur}
        onChangeText={mockedOnChangeText}
        onFocus={mockedOnFocus}
      />
    )
    const textInput = getByTestId('FloatLabel_InputTextBase')
    const user = userEvent.setup()

    expect(mockedOnFocus).not.toHaveBeenCalled()
    expect(mockedOnBlur).not.toHaveBeenCalled()
    expect(mockedOnChangeText).not.toHaveBeenCalled()

    await user.type(textInput, 'text')

    expect(mockedOnFocus).toHaveBeenCalled()
    expect(mockedOnBlur).toHaveBeenCalled()
    expect(mockedOnChangeText).toHaveBeenCalledTimes(4)
    expect(mockedOnChangeText).toHaveBeenLastCalledWith('text')
  })
})
