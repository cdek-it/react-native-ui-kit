import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Body } from '../../Typography'

export type DialogBodyVariant = 'text' | 'longText'

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

  return <Body>{MESSAGE}</Body>
}

const styles = StyleSheet.create(() => ({
  scroll: { flexGrow: 0, flexShrink: 1 },
}))
