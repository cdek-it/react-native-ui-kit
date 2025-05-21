import { type Icon, IconChevronRight } from '@tabler/icons-react-native'
import React, { useCallback } from 'react'
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import type { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'

import { makeStyles } from '../../utils/makeStyles'

export interface AccordionProps extends ViewProps {
  readonly Icon?: Icon
  readonly title: string
  readonly isExpanded?: boolean
  readonly extra?: React.ReactNode
  readonly children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({
  Icon,
  title,
  isExpanded: initiallyExpanded = false,
  extra,
  testID,
  children,
}) => {
  const styles = useStyles()

  const contentHeight = useSharedValue(0)
  const contentOpenRatio = useSharedValue(initiallyExpanded ? 1 : 0)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      contentHeight.value = event.nativeEvent.layout.height
    },
    [contentHeight]
  )

  const toggle = useCallback(() => {
    contentOpenRatio.value = withTiming(contentOpenRatio.value > 0 ? 0 : 1)
  }, [contentOpenRatio])

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(contentOpenRatio.value, [0, 1], [0, Math.PI / 2])}rad`,
      },
    ],
  }))

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      contentOpenRatio.value,
      [0, 1],
      [0, contentHeight.value]
    ),
    opacity: contentOpenRatio.value,
  }))

  return (
    <View
      style={styles.component}
      testID={testID || AccordionTestids.component}
    >
      <Pressable
        accessible
        accessibilityLabel={title}
        accessibilityRole='button'
        accessibilityState={{ expanded: contentOpenRatio.value > 0 }}
        style={styles.header}
        testID={AccordionTestids.header}
        onPress={toggle}
      >
        <Animated.View
          accessibilityElementsHidden={contentOpenRatio.value === 0}
          importantForAccessibility={
            contentOpenRatio.value === 0 ? 'no-hide-descendants' : 'yes'
          }
          style={arrowAnimatedStyle}
          testID={AccordionTestids.arrow}
        >
          <IconChevronRight {...styles.icon} />
        </Animated.View>
        {Icon ? <Icon {...styles.icon} testID={AccordionTestids.icon} /> : null}
        <Text style={styles.title}>{title}</Text>
        {extra ? <View testID={AccordionTestids.extra}>{extra}</View> : null}
      </Pressable>

      <Animated.View
        style={[styles.contentAnimated, contentAnimatedStyle]}
        testID={AccordionTestids.content}
      >
        <View
          style={styles.contentWrapper}
          testID={AccordionTestids.contentWrapper}
          onLayout={onLayout}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  )
}

export const AccordionTestids = {
  component: 'Accordion',
  header: 'Header',
  arrow: 'Arrow',
  icon: 'TitleIcon',
  extra: 'Extra',
  content: 'Content',
  contentWrapper: 'ContentWrapper',
}

const useStyles = makeStyles(({ theme }) => ({
  component: { width: '100%' },
  header: {
    paddingVertical: theme.Panel.Accordion.accordionHeaderPaddingTopBottom,
    gap: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 17.5,
    height: 17.5,
    color: theme.Panel.Accordion.accordionHeaderTextColor,
  },
  title: {
    fontSize: 15.75,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontWeight: 700,
    color: theme.Panel.Accordion.accordionHeaderTextColor,
  },
  contentAnimated: { overflow: 'hidden' },
  contentWrapper: { position: 'absolute' },
}))
