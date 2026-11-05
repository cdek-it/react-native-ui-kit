import {
  act,
  fireEvent,
  render,
  userEvent,
} from '@testing-library/react-native'
import { createRef, useImperativeHandle } from 'react'
import { TextInput } from 'react-native'

import { InputTextBase } from '../InputTextBase/InputTextBase'
import type {
  InputTextCoreProps,
  RenderTextInputArgs,
} from '../InputTextBase/types'

describe('InputTextBase', () => {
  test.each<{
    name: string
    props: InputTextCoreProps
    editable: boolean
    disabled: boolean
  }>([
    { name: 'по умолчанию', props: {}, editable: true, disabled: false },
    {
      name: 'при readOnly',
      props: { readOnly: true },
      editable: false,
      disabled: false,
    },
    {
      name: 'при editable=false',
      props: { editable: false },
      editable: false,
      disabled: false,
    },
    {
      name: 'при disabled',
      props: { disabled: true },
      editable: false,
      disabled: true,
    },
    {
      name: 'при disabled и editable=true',
      props: { disabled: true, editable: true, readOnly: false },
      editable: false,
      disabled: true,
    },
    {
      name: 'при readOnly и editable=true',
      props: { readOnly: true, editable: true },
      editable: false,
      disabled: false,
    },
    {
      name: 'при editable=false и readOnly=false',
      props: { editable: false, readOnly: false },
      editable: false,
      disabled: false,
    },
    {
      name: 'при danger',
      props: { state: 'danger' },
      editable: true,
      disabled: false,
    },
    {
      name: 'при danger и disabled',
      props: { state: 'danger', disabled: true },
      editable: false,
      disabled: true,
    },
  ])('согласует состояния $name', ({ props, editable, disabled }) => {
    const { getByLabelText, queryAllByTestId, queryByRole } = render(
      <InputTextBase
        {...props}
        clearButtonAccessibilityLabel='Очистить поле'
        placeholder='Поле'
        value='Текст'
      />
    )
    const input = getByLabelText('Поле')

    expect(input).toHaveProp('editable', editable)
    expect(input).toHaveProp('readOnly', !editable)
    expect(input).toHaveProp('accessibilityState', { disabled })
    expect(queryAllByTestId('InputTextBaseDisabledIcon').length > 0).toBe(
      disabled
    )
    expect(!!queryByRole('button', { name: 'Очистить поле' })).toBe(editable)
  })

  test('восстанавливает ввод после изменения readOnly', () => {
    const props = {
      placeholder: 'Поле',
      value: 'Текст',
      clearButtonAccessibilityLabel: 'Очистить поле',
    }
    const { getByLabelText, getByRole, queryByRole, rerender } = render(
      <InputTextBase {...props} readOnly />
    )

    expect(queryByRole('button')).not.toBeOnTheScreen()

    rerender(<InputTextBase {...props} readOnly={false} />)

    expect(getByLabelText('Поле')).toHaveProp('editable', true)
    expect(getByRole('button', { name: 'Очистить поле' })).toBeOnTheScreen()
  })

  test.each([
    {
      name: 'при clearable=false',
      clearButtonAccessibilityLabel: 'Очистить поле',
      clearable: false,
      value: 'Текст',
    },
    {
      name: 'при пустом значении',
      clearButtonAccessibilityLabel: 'Очистить поле',
      clearable: true,
      value: '',
    },
  ])(
    'скрывает очистку $name',
    ({ clearButtonAccessibilityLabel, clearable, value }) => {
      const { queryByRole } = render(
        <InputTextBase
          clearButtonAccessibilityLabel={clearButtonAccessibilityLabel}
          clearable={clearable}
          value={value}
        />
      )

      expect(queryByRole('button')).not.toBeOnTheScreen()
    }
  )

  test.each([
    {
      name: 'без подписи',
      clearButtonAccessibilityLabel: undefined,
      accessibleName: 'Очистить поле',
    },
    {
      name: 'с пустой подписью',
      clearButtonAccessibilityLabel: '',
      accessibleName: 'Очистить поле',
    },
    {
      name: 'с локализованной подписью потребителя',
      clearButtonAccessibilityLabel: 'Clear input',
      accessibleName: 'Clear input',
    },
  ])(
    'показывает доступную кнопку очистки $name',
    ({ clearButtonAccessibilityLabel, accessibleName }) => {
      const onChangeText = jest.fn()
      const { getByRole } = render(
        <InputTextBase
          clearButtonAccessibilityLabel={clearButtonAccessibilityLabel}
          value='Текст'
          onChangeText={onChangeText}
        />
      )

      fireEvent.press(getByRole('button', { name: accessibleName }))

      expect(onChangeText).toHaveBeenCalledWith('')
    }
  )

  test('обновляет неуправляемое значение при вводе и очистке', async () => {
    const onChangeText = jest.fn()
    const user = userEvent.setup()
    const { getByLabelText, getByRole, queryByRole } = render(
      <InputTextBase
        clearButtonAccessibilityLabel='Очистить поле'
        placeholder='Поле'
        onChangeText={onChangeText}
      />
    )
    const input = getByLabelText('Поле')

    expect(queryByRole('button')).not.toBeOnTheScreen()

    await user.type(input, 'Текст')

    expect(input).toHaveDisplayValue('Текст')
    expect(onChangeText).toHaveBeenLastCalledWith('Текст')

    await user.press(getByRole('button', { name: 'Очистить поле' }))

    expect(input).toHaveDisplayValue('')
    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(queryByRole('button')).not.toBeOnTheScreen()
  })

  test('ожидает обновления управляемого value после ввода и очистки', () => {
    const onChangeText = jest.fn()
    const props = {
      placeholder: 'Поле',
      onChangeText,
      clearButtonAccessibilityLabel: 'Очистить поле',
    }
    const { getByLabelText, getByRole, queryByRole, rerender } = render(
      <InputTextBase {...props} value='Первое' />
    )
    const input = getByLabelText('Поле')

    fireEvent.changeText(input, 'Второе')

    expect(onChangeText).toHaveBeenLastCalledWith('Второе')
    expect(input).toHaveDisplayValue('Первое')

    rerender(<InputTextBase {...props} value='Второе' />)

    expect(input).toHaveDisplayValue('Второе')

    fireEvent.press(getByRole('button', { name: 'Очистить поле' }))

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(input).toHaveDisplayValue('Второе')
    expect(getByRole('button', { name: 'Очистить поле' })).toBeOnTheScreen()

    rerender(<InputTextBase {...props} value='' />)

    expect(input).toHaveDisplayValue('')
    expect(queryByRole('button')).not.toBeOnTheScreen()
  })

  test('передаёт события focus и blur', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const event = { nativeEvent: { target: 1 } }
    const { getByLabelText } = render(
      <InputTextBase placeholder='Поле' onBlur={onBlur} onFocus={onFocus} />
    )

    fireEvent(getByLabelText('Поле'), 'focus', event)
    fireEvent(getByLabelText('Поле'), 'blur', event)

    expect(onFocus).toHaveBeenCalledWith(event)
    expect(onBlur).toHaveBeenCalledWith(event)
  })

  test.each([false, true])(
    'использует placeholder как единственное имя при floatLabel=%s',
    (floatLabel) => {
      const { getByLabelText, queryAllByLabelText, getByTestId } = render(
        <InputTextBase floatLabel={floatLabel} placeholder='Адрес' />
      )
      const label = getByTestId(
        floatLabel
          ? 'InputTextBaseFloatingPlaceholder'
          : 'InputTextBasePlaceholder',
        { includeHiddenElements: true }
      )

      expect(getByLabelText('Адрес')).toHaveProp('placeholder', '')
      expect(queryAllByLabelText('Адрес')).toHaveLength(1)
      expect(label).toHaveTextContent('Адрес')
      expect(label).toHaveProp('accessible', false)
      expect(label).toHaveProp('accessibilityElementsHidden', true)
      expect(label).toHaveProp(
        'importantForAccessibility',
        'no-hide-descendants'
      )
    }
  )

  test.each(['Адрес доставки', ''])(
    'сохраняет явно заданное accessibilityLabel=%s',
    (accessibilityLabel) => {
      const { getByTestId } = render(
        <InputTextBase
          accessibilityLabel={accessibilityLabel}
          placeholder='Адрес'
        />
      )

      expect(getByTestId('InputTextBase')).toHaveProp(
        'accessibilityLabel',
        accessibilityLabel
      )
    }
  )

  test.each([false, true])(
    'сохраняет остальные accessibilityState при disabled=%s',
    (disabled) => {
      const { getByLabelText } = render(
        <InputTextBase
          accessibilityState={{
            disabled: !disabled,
            busy: true,
            selected: true,
            expanded: false,
            checked: 'mixed',
          }}
          disabled={disabled}
          placeholder='Поле'
        />
      )

      expect(getByLabelText('Поле')).toHaveProp('accessibilityState', {
        disabled,
        busy: true,
        selected: true,
        expanded: false,
        checked: 'mixed',
      })
    }
  )

  test.each([
    {
      name: 'по умолчанию',
      allowFontScaling: undefined,
      maxFontSizeMultiplier: undefined,
    },
    {
      name: 'с разрешённым масштабированием',
      allowFontScaling: true,
      maxFontSizeMultiplier: 2,
    },
    {
      name: 'с отключённым масштабированием',
      allowFontScaling: false,
      maxFontSizeMultiplier: 1,
    },
  ])(
    'сохраняет настройки масштабирования $name',
    ({ allowFontScaling, maxFontSizeMultiplier }) => {
      const { getByLabelText, getByTestId } = render(
        <InputTextBase
          floatLabel
          allowFontScaling={allowFontScaling}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          placeholder='Длинная подпись'
          value='Текст'
        />
      )
      const label = getByTestId('InputTextBaseFloatingPlaceholder', {
        includeHiddenElements: true,
      })

      for (const element of [getByLabelText('Длинная подпись'), label]) {
        expect(element.props.allowFontScaling).toBe(allowFontScaling)
        expect(element.props.maxFontSizeMultiplier).toBe(maxFontSizeMultiplier)
      }

      expect(label.props.numberOfLines).toBeUndefined()
    }
  )

  test('передаёт нормализованные props и события в renderTextInput', () => {
    const onChangeText = jest.fn()
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const renderTextInput = jest.fn(
      ({ inputRef, ...props }: RenderTextInputArgs) => (
        <TextInput {...props} ref={inputRef} />
      )
    )
    const { getByLabelText, rerender } = render(
      <InputTextBase
        disabled
        editable
        accessibilityState={{ busy: true }}
        placeholder='Поле маски'
        readOnly={false}
        renderTextInput={renderTextInput}
        value='123'
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
    )

    expect(renderTextInput).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: '123',
        placeholder: '',
        accessibilityLabel: 'Поле маски',
        editable: false,
        readOnly: true,
        accessibilityState: { busy: true, disabled: true },
        inputRef: expect.objectContaining({ current: expect.anything() }),
        onChangeText: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
      })
    )

    rerender(
      <InputTextBase
        placeholder='Поле маски'
        renderTextInput={renderTextInput}
        value='123'
        onBlur={onBlur}
        onChangeText={onChangeText}
        onFocus={onFocus}
      />
    )
    const input = getByLabelText('Поле маски')
    fireEvent.changeText(input, '123-45')
    fireEvent(input, 'focus')
    fireEvent(input, 'blur')

    expect(onChangeText).toHaveBeenCalledWith('123-45')
    expect(input).toHaveDisplayValue('123')
    expect(onFocus).toHaveBeenCalledOnce()
    expect(onBlur).toHaveBeenCalledOnce()
  })

  test('сохраняет методы inputRef и очищает значение через ref', () => {
    const inputRef = createRef<TextInput>()
    const focus = jest.fn()
    const onChangeText = jest.fn()
    const nativeInput = {
      focus,
      isFocused() {
        return this === nativeInput
      },
    } as unknown as TextInput
    const CustomInput = ({ inputRef: ref, ...props }: RenderTextInputArgs) => {
      useImperativeHandle(ref, () => nativeInput)

      return <TextInput {...props} />
    }
    const { getByLabelText, getByTestId } = render(
      <InputTextBase
        inputRef={inputRef}
        placeholder='Поле'
        renderTextInput={(props) => <CustomInput {...props} />}
        onChangeText={onChangeText}
      />
    )

    expect(inputRef.current?.isFocused()).toBeTrue()

    fireEvent.press(getByTestId('InputTextBasePressableContainer'))

    expect(focus).toHaveBeenCalledOnce()

    fireEvent.changeText(getByLabelText('Поле'), 'Текст')
    act(() => inputRef.current?.clear())

    expect(onChangeText).toHaveBeenLastCalledWith('')
    expect(getByLabelText('Поле')).toHaveDisplayValue('')
  })

  test.each([false, true])(
    'передаёт boolean secureTextEntry=%s без toggle',
    (secureTextEntry) => {
      const { getByTestId, queryByTestId } = render(
        <InputTextBase secureTextEntry={secureTextEntry} />
      )

      expect(getByTestId('InputTextBase')).toHaveProp(
        'secureTextEntry',
        secureTextEntry
      )
      expect(
        queryByTestId('InputTextBaseSecureInputButton')
      ).not.toBeOnTheScreen()
    }
  )

  test('отображает загрузку без блокировки ввода', () => {
    const { getByTestId } = render(<InputTextBase loading />)

    expect(getByTestId('InputTextBaseLoading')).toBeOnTheScreen()
    expect(getByTestId('InputTextBase')).toHaveProp('editable', true)
  })
})
