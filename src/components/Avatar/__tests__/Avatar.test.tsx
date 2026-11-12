import { IconUser } from '@tabler/icons-react-native'
import { fireEvent, render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { Avatar, AvatarTestId, type AvatarProps } from '../Avatar'

const hidden = { includeHiddenElements: true }

describe('Avatar', () => {
  test('обновляет инициалы и удаляет прежний контент при смене типа', () => {
    const screen = render(<Avatar type='label'>ИИ</Avatar>)

    expect(screen.getByText('ИИ', hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar type='label'>ПП</Avatar>)

    expect(screen.queryByText('ИИ', hidden)).toBeNull()
    expect(screen.getByText('ПП', hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar Icon={IconUser} type='icon' />)

    expect(screen.queryByText('ПП', hidden)).toBeNull()
    expect(
      screen.getAllByTestId(AvatarTestId.icon, hidden)[0]
    ).toBeOnTheScreen()
    expect(screen.queryByTestId(AvatarTestId.image, hidden)).toBeNull()

    screen.rerender(
      <Avatar source={{ uri: 'https://example.com/avatar.png' }} type='image' />
    )

    expect(screen.queryByTestId(AvatarTestId.icon, hidden)).toBeNull()
    expect(screen.getByTestId(AvatarTestId.image, hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar type='label'>ИИ</Avatar>)

    expect(screen.queryByTestId(AvatarTestId.image, hidden)).toBeNull()
    expect(screen.getByText('ИИ', hidden)).toBeOnTheScreen()
  })

  test('заменяет содержимое badge и удаляет его при badge=null', () => {
    const props: AvatarProps = { type: 'label', children: 'ИИ' }
    const screen = render(<Avatar {...props} />)

    expect(screen.queryByTestId(AvatarTestId.badgeContainer, hidden)).toBeNull()

    screen.rerender(<Avatar {...props} badge={null} />)

    expect(screen.queryByTestId(AvatarTestId.badgeContainer, hidden)).toBeNull()

    screen.rerender(<Avatar {...props} badge={<Text>Онлайн</Text>} />)

    expect(screen.getByText('Онлайн', hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar {...props} badge={<Text>Не в сети</Text>} />)

    expect(screen.queryByText('Онлайн', hidden)).toBeNull()
    expect(screen.getByText('Не в сети', hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar {...props} badge={null} />)

    expect(screen.queryByText('Не в сети', hidden)).toBeNull()
    expect(screen.queryByTestId(AvatarTestId.badgeContainer, hidden)).toBeNull()
  })

  test('сохраняет действие showBadge=false при повторном переключении', () => {
    const props: AvatarProps = {
      type: 'label',
      children: 'ИИ',
      badge: <Text>Онлайн</Text>,
    }
    const screen = render(<Avatar {...props} showBadge={false} />)

    expect(screen.queryByText('Онлайн', hidden)).toBeNull()

    screen.rerender(<Avatar {...props} showBadge />)

    expect(screen.getByText('Онлайн', hidden)).toBeOnTheScreen()

    screen.rerender(<Avatar {...props} showBadge={false} />)

    expect(screen.queryByText('Онлайн', hidden)).toBeNull()
  })

  test('вызывает onError при ошибке загрузки изображения', () => {
    const onError = jest.fn()
    const screen = render(
      <Avatar
        source={{ uri: 'file:///__avatar_missing__.png' }}
        type='image'
        onError={onError}
      />
    )

    fireEvent(screen.getByTestId(AvatarTestId.image, hidden), 'error', {
      nativeEvent: { error: 'missing avatar' },
    })

    expect(onError).toHaveBeenCalledOnce()
  })
})
