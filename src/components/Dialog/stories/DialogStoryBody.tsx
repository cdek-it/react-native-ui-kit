import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { InputText } from '../../Input'
import { Body } from '../../Typography'

export type DialogBodyVariant = 'text' | 'longText' | 'input'

const MESSAGE = 'Проверьте данные перед сохранением.'

export const DialogStoryBody = ({
  variant,
}: {
  readonly variant: DialogBodyVariant
}) => {
  if (variant === 'longText') {
    return (
      <ScrollView nestedScrollEnabled style={styles.scroll}>
        {Array.from({ length: 12 }, (_, index) => (
          <Body paragraph key={index}>
            {index + 1}. {MESSAGE}
          </Body>
        ))}
      </ScrollView>
    )
  }

  if (variant === 'input') {
    return (
      <View style={styles.form}>
        <Body>Добавьте короткий комментарий к заказу.</Body>
        <InputText
          accessibilityLabel='Комментарий к заказу'
          label='Комментарий'
          placeholder='Например, позвонить заранее'
          returnKeyType='done'
        />
      </View>
    )
  }

  return <Body>{MESSAGE}</Body>
}

const styles = StyleSheet.create(({ semantic }) => ({
  scroll: { flexGrow: 0, flexShrink: 1 },
  form: { gap: semantic.dimension.space[350] },
}))
