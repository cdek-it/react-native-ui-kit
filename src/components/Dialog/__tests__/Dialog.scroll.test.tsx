import { render, screen } from '@testing-library/react-native'
import { FlatList, Text } from 'react-native'

import { Dialog } from '../Dialog'

// Штатный mock ScrollView не предоставляет контекст и скрывает конфликт вложенных списков.
jest.unmock('react-native/Libraries/Components/ScrollView/ScrollView')

describe('Dialog: вложенная прокрутка', () => {
  afterEach(() => jest.restoreAllMocks())

  test('показывает список в body без предупреждения о вложенных списках', () => {
    const consoleError = jest.spyOn(console, 'error')
    render(
      <Dialog visible>
        <FlatList
          data={['Первый пункт', 'Второй пункт']}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
      </Dialog>
    )

    expect(screen.getByText('Первый пункт')).toBeOnTheScreen()
    expect(screen.getByText('Второй пункт')).toBeOnTheScreen()
    expect(consoleError).not.toHaveBeenCalled()
  })
})
