import { IconCheck } from '@tabler/icons-react-native'
import {
  isHiddenFromAccessibility,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native'
import { Pressable } from 'react-native'
import Svg, { type SvgProps } from 'react-native-svg'

import { Tag, TagTestId } from '../Tag'

const CustomIcon = (props: SvgProps) => (
  <Svg {...props} testID='CustomTagIcon' />
)

describe('Tag', () => {
  test.each([
    { name: 'алиасе basic', severity: 'basic' },
    { name: 'severity warning', severity: 'warning' },
  ] as const)(
    'отображает текст и стандартную иконку при $name',
    ({ severity }) => {
      render(<Tag rounded severity={severity} text='Доставлен' />)

      expect(screen.getByRole('text', { name: 'Доставлен' })).toBeOnTheScreen()
      expect(
        screen.getAllByTestId(TagTestId.icon, { includeHiddenElements: true })
          .length
      ).toBeGreaterThan(0)
    }
  )

  test('заменяет стандартную иконку через Icon и восстанавливает её после удаления пропа', () => {
    const { rerender } = render(<Tag text='Доставлен' />)

    expect(
      screen.getAllByTestId(TagTestId.icon, { includeHiddenElements: true })
        .length
    ).toBeGreaterThan(0)

    rerender(<Tag Icon={CustomIcon} text='Доставлен' />)

    expect(
      screen.getAllByTestId('CustomTagIcon', { includeHiddenElements: true })
        .length
    ).toBeGreaterThan(0)
    expect(
      screen.queryByTestId(TagTestId.icon, { includeHiddenElements: true })
    ).toBeNull()

    rerender(<Tag text='В пути' />)

    expect(
      screen.getAllByTestId(TagTestId.icon, { includeHiddenElements: true })
        .length
    ).toBeGreaterThan(0)
    expect(
      screen.queryAllByTestId('CustomTagIcon', { includeHiddenElements: true })
    ).toHaveLength(0)
    expect(screen.getByRole('text', { name: 'В пути' })).toBeOnTheScreen()
  })

  test('скрывает переданную иконку при showIcon=false', () => {
    render(<Tag Icon={IconCheck} showIcon={false} text='Доставлен' />)

    expect(
      screen.queryByTestId(TagTestId.icon, { includeHiddenElements: true })
    ).toBeNull()
    expect(screen.getByRole('text', { name: 'Доставлен' })).toBeOnTheScreen()
  })

  test('скрывает стандартную иконку и восстанавливает её при изменении showIcon', () => {
    const { rerender } = render(<Tag showIcon={false} text='Доставлен' />)

    expect(
      screen.queryByTestId(TagTestId.icon, { includeHiddenElements: true })
    ).toBeNull()

    rerender(<Tag showIcon text='Доставлен' />)

    expect(
      screen.getAllByTestId(TagTestId.icon, { includeHiddenElements: true })
        .length
    ).toBeGreaterThan(0)
  })

  test('передаёт testID, collapsable и accessibilityHint корневому контейнеру', () => {
    render(
      <Tag
        accessibilityHint='Текущий этап доставки'
        accessibilityLabel='Статус заказа'
        collapsable={false}
        testID='OrderStatus'
        text='Доставлен'
      />
    )

    const root = screen.getByRole('text', { name: 'Статус заказа' })

    expect(root).toBe(screen.getByTestId('OrderStatus'))
    expect(root).toHaveProp('collapsable', false)
    expect(root).toHaveProp('accessibilityHint', 'Текущий этап доставки')
  })

  test('оставляет видимый текст единственным доступным текстовым элементом без accessibilityLabel', () => {
    render(<Tag text='Доставлен' />)

    expect(screen.getAllByRole('text')).toHaveLength(1)
    expect(screen.getByRole('text', { name: 'Доставлен' })).toBeOnTheScreen()
    expect(screen.getByTestId(TagTestId.root)).toHaveProp('accessible', false)
  })

  test('использует accessibilityLabel как единое имя и скрывает дочерний текст', () => {
    const { rerender } = render(
      <Tag
        Icon={IconCheck}
        accessibilityLabel='Статус заказа: доставлен'
        text='Доставлен'
      />
    )

    expect(screen.getAllByRole('text')).toHaveLength(1)
    expect(screen.getByRole('text', { name: 'Статус заказа: доставлен' })).toBe(
      screen.getByTestId(TagTestId.root)
    )
    expect(screen.queryByRole('text', { name: 'Доставлен' })).toBeNull()
    expect(
      screen.getByText('Доставлен', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    rerender(<Tag Icon={IconCheck} text='Доставлен' />)

    expect(screen.getAllByRole('text')).toHaveLength(1)
    expect(screen.getByRole('text', { name: 'Доставлен' })).toBeOnTheScreen()
    expect(
      screen.queryByRole('text', { name: 'Статус заказа: доставлен' })
    ).toBeNull()
  })

  test('скрывает декоративную иконку от accessibility', () => {
    render(<Tag text='Доставлен' />)

    const icons = screen.getAllByTestId(TagTestId.icon, {
      includeHiddenElements: true,
    })

    for (const icon of icons) {
      expect(isHiddenFromAccessibility(icon)).toBeTrue()
    }

    expect(screen.queryByTestId(TagTestId.icon)).toBeNull()
    expect(screen.getAllByRole('text')).toHaveLength(1)
  })

  test('позволяет интерактивному родителю задавать имя и обрабатывать нажатие', async () => {
    const onPress = jest.fn()
    const user = userEvent.setup()

    render(
      <Pressable
        accessibilityLabel='Открыть заказ: доставлен'
        accessibilityRole='button'
        onPress={onPress}
      >
        <Tag Icon={IconCheck} text='Доставлен' />
      </Pressable>
    )

    await user.press(
      screen.getByRole('button', { name: 'Открыть заказ: доставлен' })
    )

    expect(onPress).toHaveBeenCalledOnce()
    expect(screen.getByTestId(TagTestId.root)).toHaveProp('accessible', false)
    expect(screen.getByTestId(TagTestId.root)).not.toHaveProp(
      'accessibilityLabel'
    )
  })
})
