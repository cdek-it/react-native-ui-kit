import { IconUser } from '@tabler/icons-react-native'
import { fireEvent, render } from '@testing-library/react-native'

import {
  MenuItemTemplate,
  type MenuItemTemplateProps,
} from '../MenuItemTemplate'

describe('MenuItemTemplate tests', () => {
  const snapshotTestsConfig: Array<[string, MenuItemTemplateProps]> = [
    ['minimal config', { title: 'Menu Item', state: 'default' }],
    [
      'with padding',
      {
        title: 'Menu Item',
        state: 'default',
        contentPaddingTop: 2,
        contentPaddingBottom: 2,
      },
    ],
    [
      'prefix,suffix = right',
      {
        title: 'Menu Item',
        caption: 'Caption',
        prefix: 'right',
        suffix: 'right',
      },
    ],
    [
      'prefix,suffix = down',
      {
        title: 'Menu Item',
        caption: 'Caption',
        prefix: 'down',
        suffix: 'down',
      },
    ],
    ['with icon', { title: 'Menu Item', Icon: IconUser }],
    [
      'with colored icon',
      { title: 'Menu Item', Icon: IconUser, iconColor: 'red' },
    ],
    [
      'with icon and badge',
      { title: 'Menu Item', Icon: IconUser, badgeSeverity: 'warning' },
    ],
    ['with extra', { title: 'Menu Item', extra: <IconUser /> }],
    ['with separator', { title: 'Menu Item', separator: true }],
    [
      'full disabled',
      {
        title: 'Menu Item',
        state: 'disabled',
        caption: 'Caption',
        prefix: 'none',
        Icon: IconUser,
        badgeSeverity: 'danger',
        extra: <IconUser />,
        suffix: 'right',
        separator: true,
      },
    ],
  ]

  const layoutEventProps = { nativeEvent: { layout: { width: 7, height: 7 } } }

  /**
   * Snapshot test with snapshotTestsConfig
   */
  test.each(snapshotTestsConfig)('MenuItemTemplate %s', async (_, props) => {
    const rendered = render(<MenuItemTemplate {...props} />)
    try {
      const badge = rendered.getByTestId('menuItemIconBadge')
      fireEvent(badge, 'layout', layoutEventProps)
    } catch {
      /* empty */
    }

    expect(rendered.toJSON()).toMatchSnapshot()
  })

  /**
   * Behavioral tests
   */
  test('MenuItemTemplate press', () => {
    let pressCount = 0
    const minimal = render(
      <MenuItemTemplate
        state='default'
        title='Menu item'
        onPress={() => {
          pressCount += 1
        }}
      />
    )

    const button = minimal.getByTestId('menuItemButton')
    fireEvent.press(button)

    expect(pressCount).toBe(1)
  })
})
