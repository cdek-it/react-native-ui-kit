import { render } from '@testing-library/react-native'

import { Badge } from '../../Badge'

import { Button } from '../Button'
import { ButtonSeverity } from '../ButtonSeverity'
import type { BaseButtonProps } from '../types'

type TestButtonProps = Pick<
  BaseButtonProps<never>,
  'badge' | 'loading' | 'disabled' | 'accessibilityLabel'
>

describe.each([
  {
    name: 'Button',
    createButton: (props: TestButtonProps) => (
      <Button label='Корзина' {...props} />
    ),
  },
  {
    name: 'ButtonSeverity',
    createButton: (props: TestButtonProps) => (
      <ButtonSeverity label='Корзина' severity='danger' {...props} />
    ),
  },
])('$name с badge', ({ createButton }) => {
  test('обновляет бейдж, не изменяя заданное доступное имя кнопки', () => {
    const { getByRole, getByText, queryByRole, queryByText, rerender } = render(
      createButton({
        badge: <Badge accessibilityLabel='Счётчик'>3</Badge>,
        accessibilityLabel: 'Открыть корзину',
      })
    )

    expect(getByText('3', { includeHiddenElements: true })).toBeOnTheScreen()
    expect(getByRole('button')).toHaveAccessibleName('Открыть корзину')
    expect(queryByRole('text', { name: 'Счётчик' })).toBeNull()

    rerender(
      createButton({
        badge: <Badge>4</Badge>,
        accessibilityLabel: 'Открыть корзину',
      })
    )

    expect(queryByText('3', { includeHiddenElements: true })).toBeNull()
    expect(getByText('4', { includeHiddenElements: true })).toBeOnTheScreen()
    expect(getByRole('button')).toHaveAccessibleName('Открыть корзину')

    rerender(createButton({}))

    expect(queryByText('4', { includeHiddenElements: true })).toBeNull()
    expect(getByRole('button')).toHaveAccessibleName('Корзина')
  })

  test.each([
    { name: 'loading', loading: true },
    { name: 'disabled', disabled: true },
  ])('сохраняет точку при $name', ({ name: _name, ...state }) => {
    const { getByRole, getByTestId } = render(
      createButton({ badge: <Badge dot testID='CartBadge' />, ...state })
    )

    expect(
      getByTestId('CartBadge', { includeHiddenElements: true })
    ).toBeOnTheScreen()
    expect(getByRole('button')).toBeDisabled()
  })
})
