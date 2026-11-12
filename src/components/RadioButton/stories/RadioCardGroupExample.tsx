import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Body, Caption } from '../../Typography'

import { RadioButton, type RadioButtonProps } from '../RadioButton'

const cardOptions = [
  {
    value: 'express',
    label: 'Экспресс-доставка',
    caption: 'Стоимость доставки — 349 ₽',
  },
  {
    value: 'standard',
    label: 'Стандартная доставка',
    caption: 'Стоимость доставки — 199 ₽',
  },
]

type ExampleProps = Pick<RadioButtonProps, 'onPress'>

export const RadioCardGroupExample = ({ onPress }: ExampleProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  return (
    <View style={styles.root}>
      <Body size='base' weight='bold'>
        Составные карточки
      </Body>
      <Caption color='secondary'>
        Составные карточки не предусмотрены DS. Это исключительный сценарий;
        возможность сохранена на случай необходимости.
      </Caption>
      <View
        accessibilityLabel='Доставка карточками'
        accessibilityRole='radiogroup'
        style={styles.group}
      >
        {cardOptions.map(({ value, label, caption }) => (
          <Pressable
            accessible
            accessibilityLabel={`${label}, ${caption}`}
            accessibilityRole='radio'
            accessibilityState={{ checked: selectedValue === value }}
            key={value}
            style={styles.card}
            onPress={(event) => {
              onPress?.(event)
              setSelectedValue(value)
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
              <RadioButton
                checked={selectedValue === value}
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
