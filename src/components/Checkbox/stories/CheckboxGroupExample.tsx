import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../../Button'
import { Body } from '../../Typography'

import { Checkbox, type CheckboxProps } from '../Checkbox'

const notificationOptions = [
  {
    value: 'status',
    label: 'О статусе заказа',
    caption: 'Сообщать об изменениях в доставке',
  },
  { value: 'offers', label: 'О новых предложениях' },
  { value: 'promotions', label: 'О специальных акциях', disabled: true },
]

type ExampleProps = Pick<CheckboxProps, 'onCheckedChange' | 'onPress'>

export const CheckboxGroupExample = ({
  onCheckedChange,
  onPress,
}: ExampleProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  return (
    <View style={styles.root}>
      <Body size='base' weight='bold'>
        Уведомления
      </Body>
      <View style={styles.group}>
        {notificationOptions.map(({ value, label, caption, disabled }) => (
          <Checkbox
            caption={caption}
            checked={selectedValues.includes(value)}
            disabled={disabled}
            key={value}
            label={label}
            onCheckedChange={(checked) => {
              onCheckedChange?.(checked)
              setSelectedValues((values) =>
                checked
                  ? [...values, value]
                  : values.filter((selected) => selected !== value)
              )
            }}
            onPress={onPress}
          />
        ))}
      </View>
      <Button
        disabled={selectedValues.length === 0}
        label='Сбросить выбор'
        size='small'
        variant='secondary'
        onPress={() => setSelectedValues([])}
      />
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { alignSelf: 'stretch', gap: semantic.dimension.space[200] },
  group: { alignSelf: 'stretch', gap: semantic.dimension.space[200] },
}))
