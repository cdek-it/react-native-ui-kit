import { render } from '@testing-library/react-native'

import { Text } from 'react-native'

import { Dialog, type DialogProps } from '../Dialog'

describe('Dialog component tests', () => {
  const MockBody = () => <Text>This is the dialog body content</Text>
  const MockFooter = () => <Text>This is the dialog footer</Text>

  const snapshotCases: Array<[string, DialogProps]> = [
    [
      'basic dialog with title, body and footer',
      {
        isVisible: true,
        title: 'Dialog Title',
        body: MockBody,
        footer: MockFooter,
        onClose: jest.fn(),
      },
    ],
  ]

  test.each(snapshotCases)('%s', (_, props) => {
    const renderedDialog = render(<Dialog {...props} />)
    expect(renderedDialog.toJSON()).toMatchSnapshot()
  })
})
