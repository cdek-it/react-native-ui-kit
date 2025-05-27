import { IconCheck, IconList, IconUser } from '@tabler/icons-react-native'
import { fireEvent, render } from '@testing-library/react-native'

import { ListBase, type ListBaseProps } from '../ListBase'

describe('ListBase tests', () => {
  const snapshotTestsConfig: Array<[string, ListBaseProps]> = [
    ['minimal config', { text: 'Menu Item' }],
    [
      'maximal config',
      {
        iconAlignment: 'top',
        text: 'Title',
        title: 'Subtitle',
        caption: 'Caption',
        LeftIcon: IconList,
        leftIconColor: 'red',
        RightIcon: IconUser,
        rightIconColor: 'green',
        extra: <IconCheck />,
        divider: 'content',
      },
    ],
    [
      'centered and full divider',
      {
        iconAlignment: 'center',
        text: 'Title',
        title: 'Subtitle',
        caption: 'Caption',
        LeftIcon: IconList,
        RightIcon: IconUser,
        extra: <IconCheck />,
        divider: 'full',
      },
    ],
    [
      'full disabled',
      {
        iconAlignment: 'center',
        text: 'Title',
        title: 'Subtitle',
        caption: 'Caption',
        LeftIcon: IconList,
        RightIcon: IconUser,
        extra: <IconCheck />,
        divider: 'full',
        disabled: true,
      },
    ],
  ]

  /**
   * Snapshot test with snapshotTestsConfig
   */
  test.each(snapshotTestsConfig)('ListBase %s', async (_, props) => {
    const rendered = render(<ListBase {...props} />)

    expect(rendered.toJSON()).toMatchSnapshot()
  })

  test('Calls onPress when pressed', async () => {
    const onPressMock = jest.fn()
    const { getByText } = render(
      <ListBase text='title' onPress={onPressMock} />
    )

    fireEvent.press(getByText('title'))

    expect(onPressMock).toHaveBeenCalledOnce()
  })
})
