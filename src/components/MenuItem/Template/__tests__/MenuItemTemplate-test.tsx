import { render } from '@testing-library/react-native'
import React from 'react'

import { MenuItemTemplate } from '../MenuItemTemplate'

it('MenuItemTemplate minimal', () => {
  const minimal = render(<MenuItemTemplate title='Menu item' />)
  expect(minimal.toJSON()).toMatchSnapshot()
})
