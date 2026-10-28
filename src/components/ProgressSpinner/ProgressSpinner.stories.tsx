import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { ProgressSpinner } from './ProgressSpinner'

const sizes = ['small', 'base', 'large', 'xlarge'] as const

const meta: Meta<typeof ProgressSpinner> = {
  title: 'Misc/ProgressSpinner',
  component: ProgressSpinner,
  args: { size: 'base', fill: 'primary', accessibilityLabel: 'Загрузка' },
  argTypes: {
    fill: { control: 'radio', options: ['primary', 'white'] },
    size: { control: 'radio', options: sizes },
    accessibilityLabel: { control: 'text' },
  },
  parameters: {
    notes: `
Индикатор ожидания без определённого прогресса.

Выберите размер и цвет через Controls. Для \`fill="white"\` используется
контрастный фон. Размеры: small — 16, base — 32, large — 48, xlarge — 56.

По умолчанию компонент доступен как \`progressbar\` с состоянием \`busy: true\`.
При включённом системном Reduce Motion вместо анимации отображается статичная
полуокружность.
`,
  },
}

export default meta

type Story = StoryObj<typeof ProgressSpinner>

const ProgressSpinnerStory: Story = {
  render: (args) => (
    <View
      style={[styles.preview, args.fill === 'white' ? styles.contrast : null]}
    >
      <ProgressSpinner {...args} />
    </View>
  ),
}

export { ProgressSpinnerStory as ProgressSpinner }

const styles = StyleSheet.create(({ global }) => ({
  preview: { minHeight: 88, alignItems: 'center', justifyContent: 'center' },
  contrast: { backgroundColor: global.Neutrals.Black['black-100'] },
}))
