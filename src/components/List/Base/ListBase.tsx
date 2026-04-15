import React, { memo, useMemo } from 'react'
import { View, type ViewProps, Pressable, type ColorValue } from 'react-native'

import { StyleSheet } from '../../../utils'
import { type SvgSource, SvgUniversal } from '../../../utils/SvgUniversal'
import { Subtitle, Body, Caption } from '../../Typography'

/** Свойства ListBase */
export interface ListBaseProps extends ViewProps {
  /** Положение левой иконки - вверху или по центру. Правая иконка всегда по центру. */
  iconAlignment?: 'top' | 'center'
  /** Основной текст */
  text: string
  /** Заголовок */
  title?: string
  /** Пояснение */
  caption?: string
  /** Левая иконка (SVG) */
  LeftIcon?: SvgSource
  leftIconColor?: ColorValue
  /** Правая иконка (SVG) */
  RightIcon?: SvgSource
  rightIconColor?: ColorValue
  /** Дополнительный контент. Выводится между названием и правой иконкой */
  extra?: React.ReactNode
  /** Разделитель - наверху только контента, не захватывая левую иконку, либо наверху всего компонента*/
  divider?: 'content' | 'full'
  disabled?: boolean
  onPress?: () => void
}

/**
 * Базовый элемент списка
 *
 * Фигма https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS-(DS)?node-id=641-2254&m=dev
 */
export const ListBase = memo<ListBaseProps>(
  ({
    iconAlignment = 'top',
    text: title,
    title: subtitle,
    caption,
    LeftIcon,
    leftIconColor,
    RightIcon,
    rightIconColor,
    extra,
    divider,
    disabled = false,
    onPress,
    style,
    testID,
    ...rest
  }) => {
    const leftIconStyle = useMemo(
      () => [
        styles.leftIcon,
        iconAlignment === 'top' ? { alignSelf: 'flex-start' as const } : null,
      ],
      [iconAlignment]
    )

    const fullDivider = divider === 'full' ? styles.divider : {}
    const contentDivider = divider === 'content' ? styles.divider : {}
    const accessibilityLabel = useMemo(
      () => [subtitle, title].join(' '),
      [subtitle, title]
    )

    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityValue={{ text: caption }}
        disabled={disabled}
        testID={testID || ListBaseTestId.root}
        onPress={onPress}
        {...rest}
      >
        {({ pressed }) => (
          <View
            style={[
              style,
              styles.container,
              fullDivider,
              disabled && styles.disabled,
              pressed && styles.pressed,
            ]}
            {...rest}
          >
            {LeftIcon ? (
              <View style={leftIconStyle}>
                <SvgUniversal
                  color={leftIconColor}
                  height={styles.icon.height}
                  source={LeftIcon}
                  testID={ListBaseTestId.leftIcon}
                  width={styles.icon.width}
                />
              </View>
            ) : null}
            <View style={[styles.content, contentDivider]}>
              <View style={styles.labelContainer}>
                {subtitle ? (
                  <Subtitle color='primary'>{subtitle}</Subtitle>
                ) : null}
                <View style={styles.titleContainer}>
                  <Body testID={ListBaseTestId.title}>{title}</Body>
                  {caption ? (
                    <Caption color='secondary'>{caption}</Caption>
                  ) : null}
                </View>
              </View>
              <View style={styles.rightSection}>
                {extra ? (
                  <View style={styles.extraContainer}>{extra}</View>
                ) : null}
                {RightIcon ? (
                  <SvgUniversal
                    color={rightIconColor}
                    height={styles.icon.height}
                    source={RightIcon}
                    testID={ListBaseTestId.rightIcon}
                    width={styles.icon.width}
                  />
                ) : null}
              </View>
            </View>
          </View>
        )}
      </Pressable>
    )
  }
)

const ListBaseTestId = {
  root: 'ListBase',
  leftIcon: 'LeftIcon',
  rightIcon: 'RightIcon',
  title: 'Title',
}

const styles = StyleSheet.create(
  ({ spacing, typography, theme, background }) => ({
    container: {
      flexDirection: 'row',
      paddingLeft: spacing.Padding['p-4'],
      gap: spacing.Padding['p-4'],
      alignItems: 'center',
    },
    pressed: { backgroundColor: background.Common['bg-surface-ground-hover'] },
    disabled: { opacity: 0.6 },
    leftIcon: { paddingVertical: spacing.Padding['p-4'] },
    content: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.Padding['p-2'],
      paddingEnd: spacing.Padding['p-4'],
      gap: spacing.Gap['gap-4'],
    },
    labelContainer: {
      paddingVertical: spacing.Padding['p-2'],
      gap: spacing.Gap['gap-2'],
      flex: 1,
    },
    titleContainer: { gap: spacing.Gap['gap-1'] },
    extraContainer: { paddingVertical: spacing.Padding['p-2'] },
    icon: {
      width: typography.Size['text-2xl'],
      height: typography.Size['text-2xl'],
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.Padding['p-2'],
      gap: spacing.Gap['gap-4'],
    },
    divider: {
      borderTopColor: theme.Surface['surface-border'],
      borderTopWidth: 1,
    },
  })
)
