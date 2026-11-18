import { IconChevronRight, IconUser } from '@tabler/icons-react-native'
import { fireEvent, render } from '@testing-library/react-native'

import {
  MenuItemTemplate,
  type MenuItemTemplateProps,
} from '../MenuItemTemplate'

describe('MenuItemTemplate tests', () => {
  const snapshotTestsConfig: Array<[string, MenuItemTemplateProps]> = [
    ['minimal config', { title: 'Menu Item' }],
    [
      'with padding',
      { title: 'Menu Item', style: { paddingTop: 2, paddingBottom: 2 } },
    ],
    [
      'prefix,suffix = right',
      {
        title: 'Menu Item',
        caption: 'Caption',
        PrefixIcon: IconChevronRight,
        SuffixIcon: IconChevronRight,
      },
    ],
    ['with icon', { title: 'Menu Item', Icon: IconUser }],
    [
      'не применяет устаревший iconColor',
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
        disabled: true,
        caption: 'Caption',
        Icon: IconUser,
        badgeSeverity: 'danger',
        extra: <IconUser />,
        SuffixIcon: IconChevronRight,
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
  test('вызывает onPress при нажатии', () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <MenuItemTemplate title='Menu item' onPress={onPress} />
    )

    fireEvent.press(getByRole('button', { name: 'Menu item' }))

    expect(onPress).toHaveBeenCalledOnce()
  })

  test('отражает selected в доступном состоянии', () => {
    const { getByRole, rerender } = render(
      <MenuItemTemplate
        aria-selected
        accessibilityState={{ selected: true }}
        selected={false}
        title='Menu item'
      />
    )

    expect(getByRole('button', { selected: false })).toBeOnTheScreen()

    rerender(
      <MenuItemTemplate
        selected
        accessibilityState={{ selected: false }}
        aria-selected={false}
        title='Menu item'
      />
    )

    expect(getByRole('button', { selected: true })).toBeOnTheScreen()
  })
})
