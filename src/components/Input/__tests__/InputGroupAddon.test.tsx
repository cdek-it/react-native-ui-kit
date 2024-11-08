import { IconUser } from '@tabler/icons-react-native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { type InputGroupAddonProps, InputGroupAddon } from '../InputGroupAddon'

jest.mock('react-native/Libraries/Components/Pressable/Pressable', () => ({
  default: 'Pressable',
}))

describe('InputGroup component tests', () => {
  const snapshotCases: Array<[string, InputGroupAddonProps]> = [
    ['content: string, position: left', { content: 'text', position: 'left' }],
    ['content: icon, position: right', { content: IconUser, position: 'right' }],
    ['disabled: true', { content: 'text', position: 'left', disabled: true }],
    ['disabled: false', { content: 'text', position: 'left', disabled: false }],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedInputText = render(<InputGroupAddon {...props} />)
    expect(renderedInputText.toJSON()).toMatchSnapshot()
  })

  test('should handle onPress', () => {
    const onPress = jest.fn()
    const { queryByTestId } = render(
      <InputGroupAddon content='text' position='left' onPress={onPress} />
    )
    const pressable = queryByTestId('InputGroupAddon_pressable')

    fireEvent.press(pressable)
    expect(onPress).toHaveBeenCalled()
  })
})
