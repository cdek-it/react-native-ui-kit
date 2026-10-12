import { IconInfoCircle } from '@tabler/icons-react-native'
import { render } from '@testing-library/react-native'

import { Caption } from '../Caption'

describe('Caption', () => {
  test('отображает текст и передаёт нативные props', () => {
    const { getByLabelText, queryByTestId } = render(
      <Caption accessibilityLabel='Подсказка' numberOfLines={2}>
        Подсказка к полю
      </Caption>
    )

    expect(getByLabelText('Подсказка')).toHaveTextContent('Подсказка к полю')
    expect(getByLabelText('Подсказка')).toHaveProp('numberOfLines', 2)
    expect(queryByTestId('CaptionIcon')).not.toBeOnTheScreen()
  })

  test('показывает и убирает SVG-иконку при изменении props', () => {
    const { getByText, getAllByTestId, queryByTestId, rerender } = render(
      <Caption Icon={IconInfoCircle}>Подсказка к полю</Caption>
    )

    expect(getByText('Подсказка к полю')).toBeOnTheScreen()
    expect(getAllByTestId('CaptionIcon')[0]).toBeOnTheScreen()

    rerender(<Caption>Подсказка к полю</Caption>)

    expect(getByText('Подсказка к полю')).toBeOnTheScreen()
    expect(queryByTestId('CaptionIcon')).not.toBeOnTheScreen()
  })
})
