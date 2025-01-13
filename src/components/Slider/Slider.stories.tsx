import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

import { Slider, type SliderProps } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  args: {
    disabled: false,
  },
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
        <Text>{positionMinRange.toFixed(0)}</Text>
        <Text>{positionMaxRange.toFixed(0)}</Text>
        <Slider
          {...args}
          range
          maxPointerValueInit={80}
          minPointerValueInit={20}
          onReturnMaxPointerValue={(value) => handleChangeMaxRange(value)}
          onReturnMinPointerValue={(value) => handleChangeMinRange(value)}
        />
      </View>

      <View style={{ gap: 10 }}>
        <Text>{positionMin.toFixed(0)}</Text>
        <Slider
          {...args}
          minPointerValueInit={40}
          range={false}
          onReturnMinPointerValue={(value) => handleChangeMin(value)}
        />
      </View>
    </View>
  )
}

export default meta

type Story = StoryObj<typeof Slider>

const SliderStory: Story = {
  args: {},
}
export { SliderStory as Slider }
