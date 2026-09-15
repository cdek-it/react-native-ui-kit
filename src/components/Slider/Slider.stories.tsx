import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Text, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { Slider, type SliderProps } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Form/Slider',
  component: Slider,
  args: { disabled: false },
  render: (args) => Template(args),
}

const Template = (args: SliderProps) => {
  const [positionMin, setPositionMin] = useState<number>(40)

  const [positionMinRange, setPositionMinRange] = useState<number>(20)
  const [positionMaxRange, setPositionMaxRange] = useState<number>(80)

  const handleChangeMin = (value: number) => {
    setPositionMin(value)
  }

  const handleChangeMinRange = (value: number) => {
    setPositionMinRange(value)
  }

  const handleChangeMaxRange = (value: number) => {
    setPositionMaxRange(value)
  }

  return (
    <View style={{ gap: 20 }}>
      <View style={{ gap: 10 }}>
        <Text style={styles.label}>{positionMinRange.toFixed(0)}</Text>
        <Text style={styles.label}>{positionMaxRange.toFixed(0)}</Text>
        <Slider
          {...args}
          range
          maxPointerValueInit={80}
          minPointerValueInit={20}
          onMaxPointerValueChange={(value) => handleChangeMaxRange(value)}
          onMinPointerValueChange={(value) => handleChangeMinRange(value)}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={styles.label}>{positionMin.toFixed(0)}</Text>
        <Slider
          {...args}
          minPointerValueInit={40}
          range={false}
          onMinPointerValueChange={(value) => handleChangeMin(value)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  label: { color: semantic.colorScheme.color.fg.default },
}))

export default meta

type Story = StoryObj<typeof Slider>

const SliderStory: Story = { args: {} }
export { SliderStory as Slider }
