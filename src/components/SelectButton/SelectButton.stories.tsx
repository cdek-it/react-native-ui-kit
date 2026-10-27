import Slider from '@react-native-community/slider'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { IconArrowDownRight } from '@tabler/icons-react-native'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { SelectButton, type SelectButtonProps } from './SelectButton'

const buttons = [
  { label: 'Кнопка', key: '1' },
  { label: 'Выбрана', Icon: IconArrowDownRight, key: '2' },
  { accessibilityLabel: 'Третья кнопка', Icon: IconArrowDownRight, key: '3' },
]

type CommonProps = Pick<
  SelectButtonProps,
  'buttons' | 'disabled' | 'onPress' | 'size' | 'style' | 'testID'
>

const AnimatedExample = ({ buttons, ...props }: CommonProps) => {
  const position = useSharedValue(0)

  return (
    <View style={{ gap: 16 }}>
      <SelectButton {...props} buttons={buttons} position={position} />
      <Slider
        accessibilityLabel='Позиция выбранного сегмента'
        maximumValue={buttons.length - 1}
        minimumValue={0}
        step={0.1}
        value={0}
        onValueChange={(value) => {
          position.value = value
        }}
      />
    </View>
  )
}

const meta: Meta<typeof SelectButton> = {
  title: 'Form/SelectButton',
  component: SelectButton,
  args: { buttons, size: 'base', disabled: false },
  argTypes: {
    size: { control: 'radio', options: ['small', 'base', 'large', 'xlarge'] },
    disabled: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
  parameters: { controls: { include: ['theme', 'size', 'disabled'] } },
}

export default meta

type Story = StoryObj<typeof SelectButton>

export const Uncontrolled: Story = { args: { initialIndex: 1 } }

export const Controlled: Story = {
  args: { selectedIndex: 1 },
  argTypes: {
    selectedIndex: {
      control: { type: 'range', min: 0, max: buttons.length - 1, step: 1 },
    },
  },
  parameters: {
    controls: { include: ['theme', 'size', 'disabled', 'selectedIndex'] },
  },
  render: ({
    buttons,
    disabled,
    onPress,
    selectedIndex = 1,
    size,
    style,
    testID,
  }) => {
    const [, updateArgs] = useArgs()

    return (
      <SelectButton
        buttons={buttons}
        disabled={disabled}
        selectedIndex={selectedIndex}
        size={size}
        style={style}
        testID={testID}
        onPress={(index) => {
          updateArgs({ selectedIndex: index })
          onPress?.(index)
        }}
      />
    )
  },
}

export const Animated: Story = {
  render: (args) => <AnimatedExample {...args} />,
}
