import { IconUser } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'

import { Chip, type ChipProps, TestId } from '../Chip'

describe('Chip component tests', () => {
  const snapshotCases: Array<[string, ChipProps]> = [
    [
      'onRemove, icon: empty, disabled: empty/false',
      { onRemove: jest.fn(), label: 'Chip' },
    ],
    [
      'onRemove, icon: empty, disabled: true',
      { onRemove: jest.fn(), disabled: true, label: 'Chip' },
    ],

    [
      'onRemove, icon: IconUser, disabled: empty/false',
      { onRemove: jest.fn(), Icon: IconUser, label: 'Chip' },
    ],
    [
      'onRemove, icon: IconUser, disabled: true',
      { onRemove: jest.fn(), Icon: IconUser, disabled: true, label: 'Chip' },
    ],

    ['onRemove: empty, icon: empty, disabled: empty/false', { label: 'Chip' }],
    [
      'onRemove: empty, icon: empty, disabled: true',
      { disabled: true, label: 'Chip' },
    ],

    [
      'onRemove: empty, icon: IconUser, disabled: empty/false',
      { Icon: IconUser, label: 'Chip' },
    ],
    [
      'onRemove: empty, icon: IconUser, disabled: true',
      { Icon: IconUser, disabled: true, label: 'Chip' },
    ],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedChip = render(<Chip {...props} />)

    expect(renderedChip.toJSON()).toMatchSnapshot()
  })

  test('should handle tap on chip', async () => {
    const mockedOnTapChip = jest.fn()
    const { getByTestId } = render(
      <Chip label='Chip' onPress={mockedOnTapChip} />
    )
    const container = getByTestId(TestId.Container)
    const user = userEvent.setup()

    expect(mockedOnTapChip).not.toHaveBeenCalled()

    await user.press(container)

    expect(mockedOnTapChip).toHaveBeenCalled()
  })

  test('should handle tap on remove button', async () => {
    const mockedOnClose = jest.fn()
    const { getByTestId } = render(
      <Chip label='Chip' onRemove={mockedOnClose} />
    )
    const closeButton = getByTestId(TestId.RemoveButton)
    const user = userEvent.setup()

    expect(mockedOnClose).not.toHaveBeenCalled()

    await user.press(closeButton)

    expect(mockedOnClose).toHaveBeenCalled()
  })
})
