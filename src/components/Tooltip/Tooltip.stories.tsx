import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { ScrollView, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Button } from '../Button'
import { Body, Caption } from '../Typography'

import { Tooltip as TooltipComponent } from './Tooltip'
import { TooltipBubble } from './internal/TooltipBubble'
import type { TooltipPosition, TooltipProps } from './types'

type AnchorPosition =
  | 'center'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'

type StoryArgs = TooltipProps & { anchorPosition: AnchorPosition }

const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right']
const scrollDemoText = 'Просто текст для имитации контента. '.repeat(47)

const TooltipDemo = ({
  args,
  onVisibleChange,
}: {
  readonly args: StoryArgs
  readonly onVisibleChange: (isVisible: boolean) => void
}) => {
  const anchorRef = useRef<View>(null)
  const { theme } = useUnistyles()
  const trigger = (
    <Button
      accessibilityHint={args.text}
      label='Показать подсказку'
      pressableRef={anchorRef}
      onPress={() => onVisibleChange(true)}
    />
  )

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.root}
      onScrollBeginDrag={() => onVisibleChange(false)}
    >
      <View style={styles.section}>
        <Body weight='bold'>Отображение</Body>
        <View style={styles.gallery}>
          {positions.map((position) => (
            <View key={position} style={styles.example}>
              <Body>{position}</Body>
              <TooltipBubble
                maxHeight={theme.semantic.dimension.size[1600]}
                maxWidth={theme.components.tooltip.root.maxWidth}
                position={position}
                text={args.text}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.interactive}>
        <Body weight='bold'>Показ по нажатию</Body>
        <Body>Выберите сторону и положение кнопки в Controls</Body>
        <View style={styles.stage}>
          {args.anchorPosition === 'center' ? trigger : null}
        </View>
      </View>
      {args.anchorPosition === 'center' ? null : (
        <View
          style={[
            styles.corner,
            args.anchorPosition.startsWith('top') ? styles.top : styles.bottom,
            args.anchorPosition.endsWith('Left') ? styles.left : styles.right,
          ]}
        >
          {trigger}
        </View>
      )}
      <TooltipComponent
        anchorRef={anchorRef}
        isVisible={args.isVisible}
        key={args.anchorPosition}
        position={args.position}
        text={args.text}
        onClose={() => {
          args.onClose?.()
          onVisibleChange(false)
        }}
      />

      <View style={styles.interactive}>
        <Caption color='secondary'>{scrollDemoText}</Caption>
      </View>
    </ScrollView>
  )
}

const meta: Meta<StoryArgs> = {
  title: 'Overlay',
  tags: ['version:2.0', 'design:pending'],
  component: TooltipComponent,
  args: {
    text: 'Дополнительная информация',
    position: 'top',
    isVisible: false,
    anchorPosition: 'center',
  },
  argTypes: {
    text: { control: 'text' },
    position: { control: 'radio', options: positions },
    isVisible: { control: 'boolean' },
    anchorPosition: {
      control: 'select',
      options: ['center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    },
    onClose: { action: 'onClose' },
  },
  parameters: {
    controls: {
      include: ['theme', 'text', 'position', 'isVisible', 'anchorPosition'],
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs<StoryArgs>()

    return (
      <TooltipDemo
        args={args}
        onVisibleChange={(isVisible) => updateArgs({ isVisible })}
      />
    )
  },
}

export default meta
export const Tooltip: StoryObj<StoryArgs> = {}

const styles = StyleSheet.create(({ semantic }) => ({
  root: { flex: 1 },
  content: { flexGrow: 1, gap: semantic.dimension.space[600] },
  section: { gap: semantic.dimension.space[300] },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: semantic.dimension.space[500],
  },
  example: { gap: semantic.dimension.space[200], maxWidth: '100%' },
  interactive: { flex: 1, gap: semantic.dimension.space[300] },
  corner: { position: 'absolute', maxWidth: '100%' },
  top: { top: 0 },
  bottom: { bottom: 0 },
  left: { left: 0 },
  right: { right: 0 },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: semantic.dimension.size[1500],
  },
}))
