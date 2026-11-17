import type { Meta, StoryObj } from '@storybook/react'
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconPointFilled,
} from '@tabler/icons-react-native'
import { Fragment, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../Button'
import { Caption } from '../Typography'

import { Tooltip as TooltipComponent } from './Tooltip'
import { TooltipProvider } from './TooltipProvider'
import type { TooltipPosition, TooltipProps } from './types'

type StoryArgs = Omit<TooltipProps, 'anchorRef' | 'isVisible' | 'position'>

const verticalPositions = [
  { value: 'flex-start', label: 'Сверху' },
  { value: 'center', label: 'По центру' },
  { value: 'flex-end', label: 'Снизу' },
] as const
const horizontalPositions = [
  { value: 'flex-start', label: 'слева' },
  { value: 'center', label: 'по центру' },
  { value: 'flex-end', label: 'справа' },
] as const

type Alignment = (typeof verticalPositions)[number]['value']

const sideRows = [['top'], ['left', 'right'], ['bottom']] as const
const sideIcons = {
  top: IconArrowUp,
  bottom: IconArrowDown,
  left: IconArrowLeft,
  right: IconArrowRight,
}
const sideLabels = {
  top: 'Сверху',
  bottom: 'Снизу',
  left: 'Слева',
  right: 'Справа',
}
const sampleText = 'Подсказка'

const TooltipDemo = ({ text, onClose }: StoryArgs) => {
  const anchorRef = useRef<View>(null)
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<TooltipPosition>('top')
  const [vertical, setVertical] = useState<Alignment>('center')
  const [horizontal, setHorizontal] = useState<Alignment>('center')
  const trigger = (
    <Button
      accessibilityHint={text}
      label='Показать подсказку'
      pressableRef={anchorRef}
      onPress={() => setVisible(true)}
    />
  )

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.root}
      onScrollBeginDrag={() => setVisible(false)}
    >
      <View style={styles.preview}>
        <TooltipProvider>
          <View
            style={[
              styles.stage,
              { alignItems: horizontal, justifyContent: vertical },
            ]}
          >
            {trigger}
          </View>
          <TooltipComponent
            anchorRef={anchorRef}
            isVisible={visible}
            position={position}
            text={text}
            onClose={() => {
              onClose?.()
              setVisible(false)
            }}
          />
        </TooltipProvider>
      </View>
      <View style={styles.settings}>
        <View style={styles.positionPicker}>
          <Caption color='secondary'>Положение кнопки</Caption>
          {verticalPositions.map((row) => (
            <View key={row.value} style={styles.pickerRow}>
              {horizontalPositions.map((column) => {
                const selected =
                  vertical === row.value && horizontal === column.value

                return (
                  <Button
                    iconOnly
                    Icon={IconPointFilled}
                    accessibilityLabel={`${row.label}, ${column.label}`}
                    accessibilityState={{ selected }}
                    key={column.value}
                    size='small'
                    variant={selected ? 'primary' : 'text'}
                    onPress={() => {
                      setVisible(false)
                      setVertical(row.value)
                      setHorizontal(column.value)
                    }}
                  />
                )
              })}
            </View>
          ))}
        </View>
        <View style={styles.settingsDivider} />
        <View style={styles.positionPicker}>
          <Caption color='secondary'>Сторона</Caption>
          {sideRows.map((row) => (
            <View
              key={row.join('-')}
              style={[styles.pickerRow, styles.sideRow]}
            >
              {row.map((side) => (
                <Fragment key={side}>
                  {side === 'right' ? (
                    <View style={styles.pickerSpacer} />
                  ) : null}
                  <Button
                    iconOnly
                    Icon={sideIcons[side]}
                    accessibilityLabel={`Подсказка: ${sideLabels[side]}`}
                    accessibilityState={{ selected: position === side }}
                    size='small'
                    variant={position === side ? 'primary' : 'text'}
                    onPress={() => {
                      setVisible(false)
                      setPosition(side)
                    }}
                  />
                </Fragment>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const meta: Meta<StoryArgs> = {
  title: 'Overlay/Tooltip',
  tags: ['version:2.0', 'design:pending'],
  component: TooltipDemo,
  args: { text: sampleText },
  argTypes: { text: { control: 'text' }, onClose: { action: 'onClose' } },
  parameters: { controls: { include: [] } },
}

export default meta

export const Tooltip: StoryObj<StoryArgs> = {
  parameters: { controls: { include: ['text'] } },
  render: (args) => <TooltipDemo {...args} />,
}

const styles = StyleSheet.create(({ semantic, components }, rt) => ({
  root: { flex: 1 },
  content: { flexGrow: 1, gap: semantic.dimension.space[600] },
  settings: {
    flexDirection: 'row',
    gap: semantic.dimension.space[400],
    padding: semantic.dimension.space[400],
    borderRadius: semantic.dimension.borderRadius[400],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.colorScheme.color.border.neutral.default,
    backgroundColor:
      rt.themeName === 'dark'
        ? semantic.colorScheme.color.bg.surface.default.default
        : semantic.colorScheme.color.bg.surface.canvas.default,
  },
  settingsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: semantic.colorScheme.color.border.neutral.default,
  },
  positionPicker: {
    gap: semantic.dimension.space[200],
    flex: 1,
    alignItems: 'center',
  },
  sideRow: { justifyContent: 'center' },
  pickerSpacer: {
    width: components.button.root.sm.iconOnlyWidth,
    aspectRatio: 1,
  },
  pickerRow: { flexDirection: 'row', gap: semantic.dimension.space[200] },
  preview: {
    flex: 1,
    minHeight: semantic.dimension.size[1500],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.colorScheme.color.border.neutral.default,
    borderRadius: semantic.dimension.borderRadius[400],
  },
  stage: { flex: 1 },
}))
