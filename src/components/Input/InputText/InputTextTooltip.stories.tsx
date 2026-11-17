import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Tooltip } from '../../Tooltip'
import { Body } from '../../Typography'

import { InputText, type InputTextProps } from './InputText'

type StoryArgs = InputTextProps & { tooltipText: string }

const InputTooltipDemo = ({ tooltipText }: Pick<StoryArgs, 'tooltipText'>) => {
  const anchorRef = useRef<View>(null)
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps='handled'
      style={styles.root}
      onScrollBeginDrag={() => setVisible(false)}
    >
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <View>
        <InputText
          autoFocus
          required
          accessibilityHint={tooltipText}
          caption='Введите имя без сокращений'
          label='Имя получателя'
          labelInfo={{ iconRef: anchorRef, onPress: () => setVisible(true) }}
          placeholder='Как в документе'
          value={value}
          onChangeText={setValue}
        />
      </View>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Body>
        Установите курсор в поле, затем нажмите ⓘ. Подсказка появляется над
        иконкой, клавиатура остаётся открытой. Продолжите ввод.
      </Body>
      <Tooltip
        anchorRef={anchorRef}
        isVisible={visible}
        position='top'
        text={tooltipText}
        onClose={() => setVisible(false)}
      />
    </ScrollView>
  )
}

const meta: Meta<StoryArgs> = {
  title: 'Form Input/InputText',
  tags: ['version:2.0', 'design:pending'],
  component: InputText,
  args: { tooltipText: 'Имя должно совпадать с документом получателя.' },
  argTypes: { tooltipText: { control: 'text' } },
  parameters: { controls: { include: ['theme', 'tooltipText'] } },
  render: ({ tooltipText }) => <InputTooltipDemo tooltipText={tooltipText} />,
}

export default meta
export const TooltipWithKeyboard: StoryObj<StoryArgs> = {
  name: 'InputText with Tooltip',
}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { flex: 1 },
  content: { flexGrow: 1, gap: semantic.dimension.space[350] },
}))
