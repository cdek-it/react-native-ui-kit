import { IconInfoCircle } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'
import { Pressable, Text } from 'react-native'

import { InputGroup, InputGroupAddon } from '../..'

describe('InputGroup: новый API', () => {
  test('сохраняет имя, состояние поля и пользовательский testID', () => {
    const { getByLabelText, getByRole } = render(
      <InputGroup
        disabled
        accessibilityLabel='Номер заказа'
        accessibilityState={{ busy: true }}
        label='Заказ'
        labelInfo={{ onPress: jest.fn() }}
        leftAddon='№'
        testID='OrderInput'
        value='123'
      />
    )
    const input = getByLabelText('Номер заказа')
    const info = getByRole('button', { name: 'Заказ. Подробнее' })

    expect(input).toHaveDisplayValue('123')
    expect(input).toHaveProp('testID', 'OrderInput')
    expect(input).toHaveProp('accessibilityState', {
      busy: true,
      disabled: true,
    })
    expect(info).toHaveProp('testID', 'OrderInputLabelInfo')
    expect(info).toBeDisabled()
  })

  test('озвучивает очистку и обновляет поле после изменения value', async () => {
    const onChangeText = jest.fn()
    const props = { label: 'Заказ', leftAddon: '№', onChangeText }
    const { getByLabelText, getByRole, queryByRole, rerender } = render(
      <InputGroup {...props} value='123' />
    )

    await userEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByLabelText('Заказ')).toHaveDisplayValue('123')

    rerender(<InputGroup {...props} value='' />)

    expect(getByLabelText('Заказ')).toHaveDisplayValue('')
    expect(queryByRole('button', { name: 'Очистить поле' })).toBeNull()
  })

  test('размещает добавки и caption с одним полем', () => {
    const { getByText, getAllByDisplayValue } = render(
      <InputGroup
        caption={<Text>Подсказка</Text>}
        label='Заказ'
        leftAddon='№'
        rightAddon={
          <InputGroupAddon Icon={IconInfoCircle}>Статус</InputGroupAddon>
        }
        value='123'
      />
    )

    expect(getAllByDisplayValue('123')).toHaveLength(1)
    expect(getByText('№')).toBeOnTheScreen()
    expect(getByText('Статус')).toBeOnTheScreen()
    expect(getByText('Подсказка')).toBeOnTheScreen()
  })

  test('оставляет действие доступным при readOnly поля', async () => {
    const onPress = jest.fn()
    const { getByRole, getByTestId } = render(
      <InputGroup
        readOnly
        label='Заказ'
        rightAddon={
          <InputGroupAddon onPress={onPress}>Копировать</InputGroupAddon>
        }
      />
    )

    expect(getByTestId('InputGroup')).toHaveProp('editable', false)

    await userEvent.press(getByRole('button', { name: 'Копировать' }))

    expect(onPress).toHaveBeenCalledOnce()
  })

  test('отключает добавку независимо от поля и наследует общий disabled', async () => {
    const onPress = jest.fn()
    const { getByRole, rerender, getByTestId } = render(
      <InputGroup
        label='Заказ'
        rightAddon={
          <InputGroupAddon disabled onPress={onPress}>
            Найти
          </InputGroupAddon>
        }
      />
    )

    expect(getByTestId('InputGroup')).toHaveProp('editable', true)
    expect(getByRole('button', { name: 'Найти' })).toBeDisabled()

    rerender(
      <InputGroup
        disabled
        label='Заказ'
        rightAddon={<InputGroupAddon onPress={onPress}>Найти</InputGroupAddon>}
      />
    )

    expect(getByTestId('InputGroup')).toHaveProp('editable', false)

    await userEvent.press(getByRole('button', { name: 'Найти' }))

    expect(onPress).not.toHaveBeenCalled()
  })

  test.each([
    { name: 'левое', prop: 'leftAddon' as const },
    { name: 'правое', prop: 'rightAddon' as const },
  ])(
    'убирает пустое $name дополнение, сохраняя число 0 и произвольную ноду',
    ({ prop }) => {
      const { getByText, getByTestId, queryByTestId, rerender } = render(
        <InputGroup {...{ [prop]: '' }} label='Заказ' />
      )

      expect(queryByTestId('InputGroupAddon')).toBeNull()

      rerender(<InputGroup {...{ [prop]: 0 }} label='Заказ' />)

      expect(getByText('0')).toBeOnTheScreen()

      rerender(
        <InputGroup
          {...{ [prop]: <Text testID='CustomAddon'>Руб.</Text> }}
          label='Заказ'
        />
      )

      expect(getByTestId('CustomAddon')).toHaveTextContent('Руб.')
      expect(queryByTestId('InputGroupAddon')).toBeNull()

      rerender(<InputGroup label='Заказ' />)

      expect(queryByTestId('CustomAddon')).toBeNull()
    }
  )

  test.each([
    { name: 'disabled', disabled: true, readOnly: false, calls: 0 },
    { name: 'readOnly', disabled: false, readOnly: true, calls: 1 },
  ])(
    'сохраняет явно переданное состояние произвольного дополнения при $name',
    async ({ disabled, readOnly, calls }) => {
      const onPress = jest.fn()
      const { getByRole, getByTestId } = render(
        <InputGroup
          disabled={disabled}
          label='Заказ'
          readOnly={readOnly}
          rightAddon={
            <Pressable
              accessibilityLabel='Копировать'
              accessibilityRole='button'
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={onPress}
            >
              <Text>Копировать</Text>
            </Pressable>
          }
        />
      )
      const button = getByRole('button', { name: 'Копировать' })

      expect(button).toHaveProp('accessibilityState', { disabled })
      expect(getByTestId('InputGroup')).toHaveProp('editable', false)

      await userEvent.press(button)

      expect(onPress).toHaveBeenCalledTimes(calls)
    }
  )
})
