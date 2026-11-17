import { ScrollView, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Body, Caption } from '../../Typography'
import { TooltipBubble } from '../internal/TooltipBubble'
import type { TooltipPosition } from '../types'

const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right']
const sideLabels = {
  top: 'Сверху',
  bottom: 'Снизу',
  left: 'Слева',
  right: 'Справа',
}

const TooltipEdgeExample = ({ text }: { readonly text: string }) => {
  const { theme } = useUnistyles()

  return (
    <View style={styles.edgePreview}>
      <View style={styles.edgeTooltip}>
        <TooltipBubble
          maxWidth={theme.components.tooltip.root.maxWidth}
          position='top'
          text={text}
        />
      </View>
      <View style={styles.anchorLabel}>
        <Caption>Элемент</Caption>
      </View>
    </View>
  )
}

export const TooltipOverview = ({ text }: { readonly text: string }) => {
  const { theme } = useUnistyles()

  return (
    <ScrollView
      contentContainerStyle={styles.overviewContent}
      style={styles.root}
    >
      <View style={styles.section}>
        <Caption color='secondary'>
          Только текст — без кнопок, ссылок и изображений.
        </Caption>
        <Caption color='secondary'>
          Размер стрелки, отступы и скругление заданы компонентом.
        </Caption>
        <Caption color='secondary'>
          Ошибки и обязательные инструкции показывайте сразу на экране.
        </Caption>
      </View>

      <View style={styles.section}>
        <Body weight='bold'>Расположение</Body>
        <View style={styles.gallery}>
          {positions.map((position) => (
            <View key={position} style={styles.example}>
              <Caption color='secondary'>{sideLabels[position]}</Caption>
              <TooltipBubble
                maxHeight={theme.semantic.dimension.size[1600]}
                maxWidth={theme.components.tooltip.root.maxWidth}
                position={position}
                text={text}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Body weight='bold'>Перенос у границы</Body>
        <Caption color='secondary'>
          Нет места снизу — подсказка показана сверху.
        </Caption>
        <TooltipEdgeExample text={text} />
      </View>

      <View style={styles.section}>
        <Body weight='bold'>Длинный текст</Body>
        <TooltipBubble
          maxWidth={theme.components.tooltip.root.maxWidth}
          position='top'
          text='По этому номеру можно отслеживать отправление в приложении или на сайте'
        />
        <Caption color='secondary'>
          Ширина и высота блока зависят от текста.
        </Caption>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create(({ semantic }, rt) => ({
  root: { flex: 1 },
  overviewContent: { gap: semantic.dimension.space[600] },
  section: { gap: semantic.dimension.space[200] },
  edgePreview: {
    minHeight: semantic.dimension.size[1500],
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: semantic.dimension.space[100],
    paddingTop: semantic.dimension.space[400],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.colorScheme.color.border.neutral.default,
    borderRadius: semantic.dimension.borderRadius[400],
  },
  edgeTooltip: { alignSelf: 'center' },
  anchorLabel: {
    paddingHorizontal: semantic.dimension.space[400],
    paddingVertical: semantic.dimension.space[200],
    borderRadius: semantic.dimension.borderRadius[400],
    backgroundColor:
      rt.themeName === 'dark'
        ? semantic.colorScheme.color.bg.surface.default.default
        : semantic.colorScheme.color.bg.surface.canvas.default,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: semantic.dimension.space[500],
  },
  example: { gap: semantic.dimension.space[200], maxWidth: '100%' },
}))
