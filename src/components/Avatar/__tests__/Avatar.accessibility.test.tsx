import { IconUser } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { Avatar, AvatarTestId, type AvatarProps } from '../Avatar'

const variants: Array<{ name: string; props: AvatarProps }> = [
  { name: 'label', props: { type: 'label', children: 'ИИ' } },
  { name: 'icon', props: { type: 'icon', Icon: IconUser } },
  { name: 'image', props: { type: 'image', source: 1 } },
]

describe('Avatar accessibility', () => {
  test.each(variants)(
    'скрывает декоративный $name вместе с именованным содержимым badge',
    ({ props }) => {
      const screen = render(
        <Avatar
          {...props}
          accessible
          aria-hidden={false}
          badge={<Text accessibilityLabel='Статус'>Онлайн</Text>}
          testID='ProfileAvatar'
        />
      )

      expect(screen.queryByRole('image')).toBeNull()
      expect(screen.queryByLabelText('Статус')).toBeNull()
      expect(
        screen.getByTestId('ProfileAvatar', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(
        screen.getByText('Онлайн', { includeHiddenElements: true })
      ).toBeOnTheScreen()
      expect(
        screen.getAllByTestId(
          AvatarTestId[props.type === 'label' ? 'text' : props.type],
          { includeHiddenElements: true }
        )[0]
      ).toBeOnTheScreen()
    }
  )

  test.each(variants)(
    'представляет именованный $name одним image и скрывает содержимое и badge',
    ({ props }) => {
      const screen = render(
        <Avatar
          {...props}
          accessibilityLabel='Иван'
          badge={<Text accessibilityLabel='Статус'>Онлайн</Text>}
        />
      )

      expect(screen.getByRole('image', { name: 'Иван' })).toBeOnTheScreen()
      expect(screen.getAllByRole('image')).toHaveLength(1)
      expect(screen.queryByLabelText('Статус')).toBeNull()
      expect(screen.queryByText('Онлайн')).toBeNull()
      expect(
        screen.getByText('Онлайн', { includeHiddenElements: true })
      ).toBeOnTheScreen()
    }
  )

  test('обновляет доступное имя и скрывает Avatar при удалении имени', () => {
    const props: AvatarProps = { type: 'label', children: 'ИИ' }
    const screen = render(<Avatar {...props} accessibilityLabel='Иван' />)

    expect(screen.getByRole('image', { name: 'Иван' })).toBeOnTheScreen()
    expect(screen.queryByText('ИИ')).toBeNull()
    expect(
      screen.getByText('ИИ', { includeHiddenElements: true })
    ).toBeOnTheScreen()

    screen.rerender(<Avatar {...props} accessibilityLabel='Пётр' />)

    expect(screen.queryByRole('image', { name: 'Иван' })).toBeNull()
    expect(screen.getByRole('image', { name: 'Пётр' })).toBeOnTheScreen()

    screen.rerender(<Avatar {...props} />)

    expect(screen.queryByRole('image')).toBeNull()

    screen.rerender(<Avatar {...props} accessibilityLabel='Иван' />)

    expect(screen.getByRole('image', { name: 'Иван' })).toBeOnTheScreen()
  })

  test('нормализует alias имени и не позволяет заменить роль image', () => {
    const screen = render(
      <Avatar aria-label='Иван' role='button' type='label'>
        ИИ
      </Avatar>
    )

    expect(screen.getByRole('image', { name: 'Иван' })).toBeOnTheScreen()
    expect(screen.queryByRole('button')).toBeNull()

    screen.rerender(
      <Avatar accessibilityLabel='Основное имя' aria-label='Alias' type='label'>
        ИИ
      </Avatar>
    )

    expect(
      screen.getByRole('image', { name: 'Основное имя' })
    ).toBeOnTheScreen()
    expect(screen.queryByRole('image', { name: 'Alias' })).toBeNull()

    screen.rerender(
      <Avatar accessibilityLabel='' aria-label='Alias' type='label'>
        ИИ
      </Avatar>
    )

    expect(screen.queryByRole('image')).toBeNull()
  })

  test.each([
    { name: 'accessible=false', props: { accessible: false } },
    {
      name: 'accessibilityElementsHidden',
      props: { accessibilityElementsHidden: true },
    },
    { name: 'aria-hidden', props: { 'aria-hidden': true } },
    {
      name: 'no-hide-descendants',
      props: { importantForAccessibility: 'no-hide-descendants' as const },
    },
  ])('сохраняет явное скрытие именованного Avatar через $name', ({ props }) => {
    const screen = render(
      <Avatar accessibilityLabel='Иван' type='label' {...props}>
        ИИ
      </Avatar>
    )

    expect(screen.queryByRole('image')).toBeNull()
    expect(screen.queryByText('ИИ')).toBeNull()
    expect(
      screen.getByText('ИИ', { includeHiddenElements: true })
    ).toBeOnTheScreen()
  })

  test('оставляет имя и выбранное состояние только внешнему Pressable', () => {
    const screen = render(
      <Pressable
        accessibilityLabel='Открыть профиль Ивана'
        accessibilityRole='button'
        accessibilityState={{ selected: true }}
      >
        <Avatar
          badge={<Text accessibilityLabel='Статус'>Онлайн</Text>}
          type='label'
        >
          ИИ
        </Avatar>
      </Pressable>
    )

    expect(
      screen.getByRole('button', {
        name: 'Открыть профиль Ивана',
        selected: true,
      })
    ).toBeOnTheScreen()
    expect(screen.queryByRole('image')).toBeNull()
    expect(screen.queryByRole('text')).toBeNull()
    expect(screen.queryByText('Онлайн')).toBeNull()
  })
})
