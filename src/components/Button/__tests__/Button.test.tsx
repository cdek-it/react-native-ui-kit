import { IconArrowDownRight } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'
import React from 'react'

import { Button } from '../Button'
import type { IconOnlyButtonProps, IconTextButton } from '../types'

describe('Button component tests', () => {
  const buttonSnapshotCases = generatePropsCombinations<IconTextButton>({
    size: ['base', 'small', 'large', 'xLarge'],
    shape: ['square', 'circle'],
    loading: [true, false],
    variant: ['basic', 'outlined', 'text'],
    disabled: [true, false],
    label: ['Button'],
  })

  test.each(buttonSnapshotCases)(
    'Button with text, size - $size, shape - $shape, variant - $variant, loading - $loading, disabled - $disabled',
    (props) => {
      const renderedButton = render(<Button {...props} />)
      expect(renderedButton.toJSON()).toMatchSnapshot()
    }
  )

  test.each(buttonSnapshotCases)(
    'Button with icon on left, size - $size, shape - $shape, variant - $variant, loading - $loading, disabled - $disabled',
    (props) => {
      const renderedButton = render(
        <Button Icon={IconArrowDownRight} iconPosition='left' {...props} />
      )
      expect(renderedButton.toJSON()).toMatchSnapshot()
    }
  )

  test.each(buttonSnapshotCases)(
    'Button with icon on right, size - $size, shape - $shape, variant - $variant, loading - $loading, disabled - $disabled',
    (props) => {
      const renderedButton = render(
        <Button Icon={IconArrowDownRight} iconPosition='right' {...props} />
      )
      expect(renderedButton.toJSON()).toMatchSnapshot()
    }
  )

  const iconOnlyButtonSnapshotCases = generatePropsCombinations<IconOnlyButtonProps>({
    size: ['base', 'small', 'large', 'xLarge'],
    shape: ['square', 'circle'],
    loading: [true, false],
    variant: ['basic', 'outlined', 'text'],
    disabled: [true, false],
    iconOnly: [true],
    Icon: [IconArrowDownRight],
  })

  test.each(iconOnlyButtonSnapshotCases)(
    'Button with only icon, size - $size, shape - $shape, variant - $variant, loading - $loading, disabled - $disabled',
    ({ ...props }) => {
      const renderedButton = render(<Button {...props} />)
      expect(renderedButton.toJSON()).toMatchSnapshot()
    }
  )

  test('Button default props', () => {
    const renderedBody = render(<Button label='Button' />)
    expect(renderedBody.toJSON()).toMatchSnapshot()
  })
})
