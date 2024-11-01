import { IconUser } from '@tabler/icons-react-native'
import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { MenuItemTemplate } from '../MenuItemTemplate'

it('MenuItemTemplate minimal', () => {
  const minimal = render(<MenuItemTemplate state='default' title='Menu item' />)
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate prefix,suffix = right', () => {
  const minimal = render(
    <MenuItemTemplate caption='Cation' prefix='right' suffix='right' title='Menu item' />
  )
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate prefix,suffix = down', () => {
  const minimal = render(
    <MenuItemTemplate caption='Cation' prefix='down' suffix='down' title='Menu item' />
  )
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate with icon', () => {
  const minimal = render(<MenuItemTemplate Icon={IconUser} title='Menu item' />)
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate with icon and badge', () => {
  const minimal = render(
    <MenuItemTemplate Icon={IconUser} badgeSeverity='warning' title='Menu item' />
  )
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate with extra', () => {
  const minimal = render(<MenuItemTemplate extra={<IconUser />} title='Menu item' />)
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate with separator', () => {
  const minimal = render(<MenuItemTemplate separator title='Menu item' />)
  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate full disabled', () => {
  const minimal = render(
    <MenuItemTemplate
      separator
      Icon={IconUser}
      badgeSeverity='danger'
      caption='Caption'
      extra={<IconUser />}
      prefix='none'
      state='disabled'
      suffix='right'
      title='Menu item'
    />
  )

  const badge = minimal.getByTestId('menuItemIconBadge')
  act(() => {
    fireEvent(badge, 'layout', {
      nativeEvent: {
        layout: {
          width: 7,
          height: 7,
        },
      },
    })
  })

  expect(minimal.toJSON()).toMatchSnapshot()
})

it('MenuItemTemplate press', () => {
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
