import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../../Button'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

const deliveryOptions = [
  {
    value: 'courier',
    label: 'Курьером',
    caption: 'Привезём заказ по указанному адресу',
  },
  { value: 'pickup', label: 'В пункт выдачи' },
  { value: 'post', label: 'Почтой России', disabled: true },
]

type ExampleProps = Pick<RadioButtonProps, 'onPress'>

export const RadioButtonGroupExample = ({ onPress }: ExampleProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  return (
    <View style={styles.root}>
      <View
        accessibilityLabel='Способ доставки'
        accessibilityRole='radiogroup'
        style={styles.group}
      >
        {deliveryOptions.map(({ value, label, caption, disabled }) => (
          <RadioButton
            caption={caption}
            checked={selectedValue === value}
            disabled={disabled}
            key={value}
            label={label}
            onPress={(event) => {
              onPress?.(event)
              setSelectedValue(value)
            }}
          />
        ))}
      </View>
      <Button
        disabled={selectedValue === null}
        label='Сбросить выбор'
        size='small'
        variant='secondary'
        onPress={() => setSelectedValue(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { alignItems: 'flex-start', gap: semantic.dimension.space[200] },
  group: { gap: semantic.dimension.space[200] },
}))
