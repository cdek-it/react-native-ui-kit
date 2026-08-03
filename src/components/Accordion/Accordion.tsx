import { IconChevronRight } from '@tabler/icons-react-native'
import React, { useCallback, useState } from 'react'
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface AccordionProps extends ViewProps {
  /** Иконка слева от заголовка */
  readonly Icon?: SvgSource
  /** Текст заголовка */
  readonly title: string
  /** Состояние при первом рендере. true - контент раскрыт, false - контент свернут */
  readonly isInitiallyExpanded?: boolean
  /** Наличие разделитель. Когда true, верхняя граница заголовка становится разделителем */
  readonly withSeparator?: boolean
  /** Отключенное состояние. Когда true компонент рендерится в соответствии со значением isInitiallyExpanded и не реагирует на нажатия */
  readonly disabled?: boolean
  /** Дополнительный элемент справа от заголовка */
  readonly titleExtra?: React.ReactNode
  readonly children: React.ReactNode
}

/**
 * Компонент Гармошка - умеет скрывать и раскрывать контент по нажатию на заголовок
 * @param title - Текст заголовка
 * @param Icon - Иконка слева от заголовка
 * @param isInitiallyExpanded - Состояние при первом рендере. true - контент раскрыт, false - контент свернут
 * @param extra - Дополнительный элемент справа от заголовка
 * @param withSeparator - Наличие разделитель. Когда true, верхняя граница заголовка становится разделителем
 * @param disabled - Отключенное состояние. Когда true компонент рендерится в соответствии со значением isInitiallyExpanded и не реагирует на нажатия
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace--DS-?node-id=1207-1852&m=dev
 */
export const Accordion: React.FC<AccordionProps> = ({
  Icon,
  title,
  isInitiallyExpanded: initiallyExpanded = false,
  withSeparator = false,
  disabled = false,
  titleExtra,
  testID,
  children,
  ...rest
}) => {
  const contentHeight = useSharedValue(0)
  const contentOpenFraction = useSharedValue(initiallyExpanded ? 1 : 0)
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      contentHeight.value = event.nativeEvent.layout.height
    },
    [contentHeight]
  )

  const toggle = useCallback(() => {
    contentOpenFraction.value = withTiming(
      contentOpenFraction.value > 0 ? 0 : 1
    )
    setIsExpanded((value) => !value)
  }, [contentOpenFraction])

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(contentOpenFraction.value, [0, 1], [0, 90])}deg`,
      },
    ],
  }))

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOpenFraction.value,
      [0, 1],
      [0, contentHeight.value]
    ),
    opacity: contentOpenFraction.value,
  }))

  return (
    <View
      style={[styles.component, withSeparator ? styles.separator : {}]}
      testID={testID || AccordionTestIds.component}
      {...rest}
    >
      <Pressable
        accessible
        accessibilityLabel={title}
        accessibilityRole='button'
        accessibilityState={isExpanded ? { expanded: true } : {}}
        disabled={disabled}
        style={[styles.header, disabled ? styles.disabled : {}]}
        testID={AccordionTestIds.header}
        onPress={toggle}
      >
        <Animated.View
          style={arrowAnimatedStyle}
          testID={AccordionTestIds.arrow}
        >
          <SvgUniversal
            {...styles.icon}
            source={IconChevronRight}
            uniProps={({ components }) => ({
              color: components.accordion.header.color,
            })}
          />
        </Animated.View>
        {Icon ? (
          <SvgUniversal
            {...styles.icon}
            source={Icon}
            testID={AccordionTestIds.icon}
            uniProps={({ components }) => ({
              color: components.accordion.header.color,
            })}
          />
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {titleExtra ? (
          <View testID={AccordionTestIds.titleExtra}>{titleExtra}</View>
        ) : null}
      </Pressable>

      <Animated.View
        accessibilityElementsHidden={!isExpanded}
        importantForAccessibility={isExpanded ? 'yes' : 'no-hide-descendants'}
        style={[styles.contentAnimated, contentAnimatedStyle]}
        testID={AccordionTestIds.content}
      >
        <View
          style={styles.contentWrapper}
          testID={AccordionTestIds.contentWrapper}
          onLayout={onLayout}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  )
}

export const AccordionTestIds = {
  component: 'Accordion',
  header: 'Header',
  arrow: 'Arrow',
  icon: 'TitleIcon',
  titleExtra: 'Extra',
  content: 'Content',
  contentWrapper: 'ContentWrapper',
  separator: 'Separator',
}

// TODO(tokens-migration): reason=missing; legacy=spacing.Padding.p-4; value=14
const styles = StyleSheet.create(
  ({ primitive, components, spacing, fonts }) => ({
    component: { width: '100%' },
    header: {
      paddingVertical: spacing.Padding['p-4'],
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-2; value=7; target=components.accordion.extend.extHeader.gap; targetValue=8
      gap: spacing.Gap['gap-2'],
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: components.accordion.colorScheme.header.background,
    },
    icon: { width: 17.5, height: 17.5 },
    title: {
      fontSize: 15.75,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontWeight: primitive.fonts.fontWeight.bold,
      color: components.accordion.header.color,
      fontFamily: fonts.secondary,
    },
    contentAnimated: { overflow: 'hidden' },
    contentWrapper: {
      position: 'absolute',
      width: '100%',
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-7; value=24.5; target=components.accordion.content.paddingLeft; targetValue=24
      paddingLeft: spacing.Padding['p-7'],
      paddingTop: spacing.Padding['p-0'],
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Padding.p-0; value=0; target=components.accordion.content.paddingRight; targetValue=24
      paddingRight: spacing.Padding['p-0'],
      paddingBottom: spacing.Padding['p-4'],
    },
    separator: {
      borderTopColor: components.accordion.panel.borderColor,
      borderTopWidth: 1,
    },
    disabled: { mixBlendMode: 'luminosity', opacity: 0.6 },
  })
)
