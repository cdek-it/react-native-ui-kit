import type { Icon } from '@tabler/icons-react-native'
import { memo, useMemo } from 'react'
import { View, type ViewStyle, type StyleProp } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'
import { Subtitle } from '../Typography'

export interface DividerProps {
  /**
   * Выбор расположения контента относительно линии.
   * В фигме вместо `start/end` используются `left/right`
   * для горизонтальной ориентации и `top/bottom` для вертикальной
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end'

  /**
   * Выбор ориентации компонента (горизонтальная либо вертикальная)
   * @default 'horizontal'
   */
  layout?: 'horizontal' | 'vertical'

  /**
   * Показать или скрыть контейнер контента поверх линии
   * @default true
   */
  showContent?: boolean

  /**
   * Показать или скрыть иконку внутри контейнера с контентом
   * @default true
   */
  showIcon?: boolean

  /** Текст */
  text?: string

  /**
   * Выбор стиля линии
   * @default 'solid'
   */
  type?: 'solid' | 'dash'

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>

  /** Иконка из библиотеки Tabler */
  Icon?: Icon
}

/**
 * Используется для визуального разделения контента
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5178
 */
export const Divider = memo<DividerProps>(
  ({
    align = 'center',
    layout = 'horizontal',
    showContent: showContentProp = true,
    showIcon: showIconProp = true,
    text,
    type = 'solid',
    style,
    Icon,
  }) => {
    const styles = useStyles()
    const isVertical = useMemo(() => layout === 'vertical', [layout])
    const showIcon = useMemo(
      () => !!(showIconProp && Icon),
      [Icon, showIconProp]
    )

    const showContent = useMemo(
      () => !!(showContentProp && (showIcon || text)),
      [showContentProp, showIcon, text]
    )

    const lineStyle = useMemo(
      () => [styles.line, type === 'dash' && styles.lineDash],
      [styles.line, styles.lineDash, type]
    )

    return (
      <View
        style={[
          styles.container,
          isVertical && styles.containerVertical,
          showContent &&
            align === 'end' &&
            (isVertical
              ? styles.containerColumnReverse
              : styles.containerRowReverse),
          style,
        ]}
      >
        {showContent ? (
          <>
            <View
              style={[
                styles.lineContainer,
                align !== 'center' && styles.lineContainerSide,
              ]}
            >
              <View style={lineStyle} />
            </View>

            <View
              style={[styles.content, isVertical && styles.contentVertical]}
            >
              {showIcon && Icon ? (
                <Icon
                  height={styles.icon.height}
                  style={styles.icon}
                  width={styles.icon.width}
                />
              ) : null}
              {text ? (
                <Subtitle color='secondary' style={styles.text}>
                  {text}
                </Subtitle>
              ) : null}
            </View>
          </>
        ) : null}

        <View style={styles.lineContainer}>
          <View style={lineStyle} />
        </View>
      </View>
    )
  }
)

const useStyles = makeStyles(({ spacing, theme, sizing, typography }) => ({
  container: {
    minHeight: sizing.Height['h-2'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerVertical: {
    minWidth: sizing.Width['w-2'],
    flexDirection: 'column',
    flexGrow: 1,
    alignSelf: 'flex-start',
  },
  containerRowReverse: { flexDirection: 'row-reverse' },
  containerColumnReverse: { flexDirection: 'column-reverse' },
  lineContainer: {
    flexGrow: 1,
    flexBasis: spacing.Gap['gap-4'],
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  lineContainerSide: { flexGrow: 0 },
  line: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: theme.General.dividerColor,
  },
  lineDash: { borderStyle: 'dashed' },
  content: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.General.inlineSpacing,
    gap: spacing.Gap['gap-2'],
    backgroundColor: theme.Panel.Panel.Body.panelContentBg,
  },
  contentVertical: {
    paddingHorizontal: 0,
    paddingVertical: theme.General.inlineSpacing,
  },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
    color: theme.General.textSecondaryColor,
  },
  text: { flexShrink: 1 },
}))
