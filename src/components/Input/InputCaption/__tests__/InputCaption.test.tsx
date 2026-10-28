import { render } from '@testing-library/react-native'
import Svg, { Circle, type SvgProps } from 'react-native-svg'

import { InputCaption } from '../InputCaption'

const CustomIcon = (props: SvgProps) => (
  <Svg {...props}>
    <Circle cx={7} cy={7} r={5} testID='CustomCaptionCircle' />
  </Svg>
)

describe('InputCaption', () => {
  test('по умолчанию показывает текст подписи без иконки', () => {
    const { getByText, queryByTestId, queryByRole } = render(
      <InputCaption>Подсказка к полю</InputCaption>
    )

    expect(getByText('Подсказка к полю')).toBeOnTheScreen()
    expect(queryByTestId('InputCaptionIcon')).toBeNull()
    expect(queryByRole('button')).toBeNull()
  })

  test.each([
    { name: 'без иконки', showIcon: false },
    { name: 'с иконкой', showIcon: true },
  ])('объединяет подпись $name в доступный контейнер', ({ showIcon }) => {
    const { getByRole, getByTestId, getByText, getAllByRole } = render(
      <InputCaption showIcon={showIcon}>Подсказка к полю</InputCaption>
    )

    expect(getByRole('text', { name: 'Подсказка к полю' })).toBe(
      getByTestId('InputCaption')
    )
    expect(getAllByRole('text')).toHaveLength(1)
    expect(getByText('Подсказка к полю')).toHaveProp('accessible', false)
  })

  test('showIcon управляет показом независимо от переданного SVG, а очистка Icon возвращает стандартную иконку', () => {
    const { getAllByTestId, getByText, queryByTestId, rerender } = render(
      <InputCaption Icon={CustomIcon} variant='warning'>
        Проверьте адрес
      </InputCaption>
    )

    expect(queryByTestId('InputCaptionIcon')).toBeNull()
    expect(queryByTestId('CustomCaptionCircle')).toBeNull()

    rerender(
      <InputCaption showIcon Icon={CustomIcon} variant='warning'>
        Проверьте адрес
      </InputCaption>
    )

    expect(getAllByTestId('InputCaptionIcon')[0]).toBeOnTheScreen()
    expect(getAllByTestId('InputCaptionIcon')[0]).toHaveProp(
      'accessible',
      false
    )
    expect(getAllByTestId('CustomCaptionCircle')[0]).toBeOnTheScreen()

    rerender(
      <InputCaption showIcon variant='warning'>
        Проверьте адрес
      </InputCaption>
    )

    expect(getAllByTestId('InputCaptionIcon')[0]).toBeOnTheScreen()
    expect(queryByTestId('CustomCaptionCircle')).toBeNull()

    rerender(
      <InputCaption showIcon={false} variant='warning'>
        Проверьте адрес
      </InputCaption>
    )

    expect(queryByTestId('InputCaptionIcon')).toBeNull()
    expect(getByText('Проверьте адрес')).toBeOnTheScreen()
  })

  test('передаёт заданные приложением accessibility props подписи', () => {
    const { getByRole } = render(
      <InputCaption
        accessible
        accessibilityLabel='Ошибка сервера'
        accessibilityLiveRegion='polite'
        accessibilityRole='alert'
        variant='danger'
      >
        Попробуйте позже
      </InputCaption>
    )

    expect(getByRole('alert', { name: 'Ошибка сервера' })).toHaveProp(
      'accessibilityLiveRegion',
      'polite'
    )
  })
})
