import { IconUser } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'

import type { ReactNode } from 'react'
import { View } from 'react-native'

import { Message, type MessageProps, TestId } from '../Message'

const Stub = ({ children }: { readonly children: ReactNode }) => (
  <View>{children}</View>
)

jest.mock('../../Button', () => ({ ButtonSeverity: 'ButtonSeverity' }))
jest.mock('../../Typography', () => ({ Body: 'Body', Caption: 'Caption' }))
jest.mock('../../Timer/Timer', () => ({ Timer: 'Timer' }))

describe('Message', () => {
  const defaultProps: MessageProps = { title: 'Message' }
  const snapshotCases: Array<Partial<MessageProps>> = [
    {},
    {
      severity: 'info',
      body: <Stub>body</Stub>,
      caption: 'caption',
      style: { margin: 10 },
    },
    { severity: 'success', footer: <Stub>footer</Stub>, onClose: jest.fn() },
    {
      severity: 'success',
      footer: <Stub>footer</Stub>,
      onClose: jest.fn(),
      closeLabel: 'Close',
    },
    {
      severity: 'warning',
      body: <Stub>body</Stub>,
      footer: <Stub>footer</Stub>,
    },
    { severity: 'danger' },
    { timerValue: 5, onTimerFinish: jest.fn() },
    { timerValue: 5, Icon: IconUser },
    { Icon: IconUser },
    { hiddenIcon: false },
  ]

  test.each(snapshotCases)('%p', (props) => {
    const { toJSON } = render(<Message {...defaultProps} {...props} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('should handle close', async () => {
    const mockedOnClose = jest.fn()
    const { getByTestId } = render(
      <Message title='Message' onClose={mockedOnClose} />
    )
    const closeButton = getByTestId(TestId.CloseButton)
    const user = userEvent.setup()

    expect(mockedOnClose).not.toHaveBeenCalled()

    await user.press(closeButton)

    expect(mockedOnClose).toHaveBeenCalled()
  })
})
