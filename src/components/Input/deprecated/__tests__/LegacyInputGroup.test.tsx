import { fireEvent, render } from '@testing-library/react-native'
import { createRef, useImperativeHandle } from 'react'
import { TextInput } from 'react-native'

import type { RenderTextInputArgs } from '../InputTextBase/types'
import {
  LegacyInputGroup as InputGroup,
  type LegacyInputGroupProps as InputGroupProps,
} from '../LegacyInputGroup'

describe('LegacyInputGroup', () => {
  test.each<{ name: string; props: InputGroupProps; addons: number }>([
    { name: 'с левым аддоном', props: { left: 'Слева' }, addons: 1 },
    { name: 'с правым аддоном', props: { right: 'Справа' }, addons: 1 },
    {
      name: 'с обоими аддонами',
      props: { left: 'Слева', right: 'Справа' },
      addons: 2,
    },
    { name: 'без аддонов', props: { style: { margin: 10 } }, addons: 0 },
  ])('отображает поле $name', ({ props, addons }) => {
    const { getByLabelText, queryByText, queryAllByTestId } = render(
      <InputGroup {...props} placeholder='Поиск' value='Заказ' />
    )

    expect(getByLabelText('Поиск')).toHaveDisplayValue('Заказ')
    expect(!!queryByText('Слева')).toBe(!!props.left)
    expect(!!queryByText('Справа')).toBe(!!props.right)
    expect(queryAllByTestId('InputGroupAddon_Pressable')).toHaveLength(addons)
  })

  test.each([
    {
      name: 'disabled',
      props: { disabled: true, editable: true, readOnly: false },
      disabled: true,
    },
    { name: 'readOnly', props: { readOnly: true }, disabled: false },
    { name: 'editable=false', props: { editable: false }, disabled: false },
  ])('наследует запрет ввода при $name', ({ props, disabled }) => {
    const { getByLabelText, queryByRole, getAllByTestId } = render(
      <InputGroup
        {...props}
        clearButtonAccessibilityLabel='Очистить поиск'
        left='Слева'
        placeholder='Поиск'
        right='Справа'
        value='Заказ'
      />
    )

    expect(getByLabelText('Поиск')).toHaveProp('editable', false)
    expect(getByLabelText('Поиск')).toHaveProp('readOnly', true)
    expect(getByLabelText('Поиск')).toHaveProp('accessibilityState', {
      disabled,
    })
    expect(queryByRole('button')).not.toBeOnTheScreen()

    for (const addon of getAllByTestId('InputGroupAddon_Pressable')) {
      expect(addon.props.accessibilityState?.disabled ?? false).toBe(disabled)
    }
  })

  test.each<{ name: string; props: InputGroupProps }>([
    { name: 'обычном пути', props: {} },
    {
      name: 'legacy-пути',
      props: { size: 'medium', secureTextEntry: 'toggleable' },
    },
  ])('фокусирует кастомное поле через аддоны и ref при $name', ({ props }) => {
    const focus = jest.fn()
    const inputRef = createRef<TextInput>()
    const CustomInput = ({ inputRef: ref, ...props }: RenderTextInputArgs) => {
      useImperativeHandle(ref, () => ({ focus }) as unknown as TextInput)

      return <TextInput {...props} />
    }
    const { getAllByTestId } = render(
      <InputGroup
        {...props}
        inputRef={inputRef}
        left='Слева'
        renderTextInput={(props) => <CustomInput {...props} />}
        right='Справа'
      />
    )

    for (const addon of getAllByTestId('InputGroupAddon_Pressable')) {
      fireEvent.press(addon)
    }

    inputRef.current?.focus()

    expect(focus).toHaveBeenCalledTimes(3)
  })

  test('передаёт callback очистки и ожидает обновления value', () => {
    const onChangeText = jest.fn()
    const { getByLabelText, getByRole } = render(
      <InputGroup
        clearButtonAccessibilityLabel='Очистить поиск'
        placeholder='Поиск'
        size='small'
        value='Заказ'
        onChangeText={onChangeText}
      />
    )

    fireEvent.press(getByRole('button', { name: 'Очистить поиск' }))

    expect(onChangeText).toHaveBeenCalledWith('')
    expect(getByLabelText('Поиск')).toHaveDisplayValue('Заказ')
  })
})
