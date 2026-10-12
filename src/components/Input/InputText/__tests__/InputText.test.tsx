import { fireEvent, render } from '@testing-library/react-native'

import { InputText, type InputTextProps } from '../..'

describe('InputText', () => {
  test('отображает реальное поле и передаёт публичные props', () => {
    const onChangeText = jest.fn()
    const props: InputTextProps = {
      placeholder: 'Адрес',
      accessibilityLabel: 'Адрес доставки',
      value: 'Москва',
      size: 'small',
      secureTextEntry: true,
      onChangeText,
    }
    const { getByLabelText, getByRole } = render(<InputText {...props} />)
    const input = getByLabelText('Адрес доставки')

    expect(input).toHaveDisplayValue('Москва')
    expect(input).toHaveProp('secureTextEntry', true)

    fireEvent.changeText(input, 'Казань')

    expect(onChangeText).toHaveBeenLastCalledWith('Казань')
    expect(input).toHaveDisplayValue('Москва')

    fireEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenLastCalledWith('')
  })

  test('передаёт readOnly без визуального disabled', () => {
    const { getByLabelText, queryByRole, queryByTestId } = render(
      <InputText readOnly placeholder='Адрес' value='Москва' />
    )

    expect(getByLabelText('Адрес')).toHaveProp('editable', false)
    expect(getByLabelText('Адрес')).toHaveProp('accessibilityState', {
      disabled: false,
    })
    expect(queryByRole('button')).not.toBeOnTheScreen()
    expect(queryByTestId('InputTextBaseDisabledIcon')).not.toBeOnTheScreen()
  })
})
