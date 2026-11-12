import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Body, Caption } from '../../Typography'

import { Checkbox, type CheckboxProps } from '../Checkbox'

const serviceOptions = [
  {
    value: 'packaging',
    label: 'Дополнительная упаковка',
    caption: 'Для хрупких отправлений',
  },
  { value: 'sms', label: 'Уведомления по СМС', caption: 'О статусе доставки' },
]

type ExampleProps = Pick<CheckboxProps, 'onCheckedChange' | 'onPress'>

export const CheckboxCardGroupExample = ({
  onCheckedChange,
  onPress,
}: ExampleProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  return (
    <View style={styles.root}>
      <Body size='base' weight='bold'>
        Составные карточки
      </Body>
      <Caption color='secondary'>
        Составные карточки не предусмотрены DS. Это исключительный сценарий;
        возможность сохранена на случай необходимости.
      </Caption>
      <View style={styles.group}>
        {serviceOptions.map(({ value, label, caption }) => (
          <Pressable
            accessible
            accessibilityLabel={`${label}, ${caption}`}
            accessibilityRole='checkbox'
            accessibilityState={{ checked: selectedValues.includes(value) }}
            key={value}
            style={styles.card}
            onPress={(event) => {
              const checked = !selectedValues.includes(value)
              onCheckedChange?.(checked)
              setSelectedValues((values) =>
                checked
                  ? [...values, value]
                  : values.filter((selected) => selected !== value)
              )
              onPress?.(event)
            }}
          >
            <View
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              style={styles.cardText}
            >
              <Body size='base' weight='bold'>
                {label}
              </Body>
              <Caption>{caption}</Caption>
            </View>
            <View
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              pointerEvents='none'
            >
              <Checkbox
                checked={selectedValues.includes(value)}
                focusable={false}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { alignSelf: 'stretch', gap: semantic.dimension.space[200] },
  group: { gap: semantic.dimension.space[200] },
  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: semantic.dimension.space[300],
    padding: semantic.dimension.space[350],
    borderWidth: semantic.dimension.borderWidth[100],
    borderRadius: semantic.dimension.borderRadius[200],
    borderColor: semantic.colorScheme.color.border.neutral.strong,
  },
  cardText: { flex: 1 },
}))
