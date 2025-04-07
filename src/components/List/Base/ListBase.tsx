import type { Icon } from '@tabler/icons-react-native'
import React, { memo, useMemo } from 'react'
import { View, type ViewStyle, type ViewProps, Pressable } from 'react-native'

import { makeStyles } from '../../../utils/makeStyles'
import { Subtitle, Body, Caption } from '../../Typography'

export interface ListBaseProps extends ViewProps {
  iconAlignment?: 'top' | 'center'
  title: string
  subtitle?: string
  caption?: string
  LeftIcon?: Icon
  RightIcon?: Icon
  extra?: React.ReactNode
  divider?: 'content' | 'full'
  disabled?: boolean
  onPress?: () => void
}

export const ListBase = memo<ListBaseProps>(
  ({
    iconAlignment = 'top',
    title,
    subtitle,
    caption,
    LeftIcon,
    RightIcon,
    extra,
    divider,
    disabled = false,
    onPress,
    style,
    testID,
    ...rest
  }) => {
    const styles = useStyles()

    const leftIconStyle: ViewStyle = useMemo(() => {
      if (iconAlignment === 'top') {
        return { ...styles.leftIcon, alignSelf: 'flex-start' }
      }

      return styles.leftIcon
    }, [styles.leftIcon, iconAlignment])

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
        testID={testID || 'ListBase'}
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
                <LeftIcon {...styles.icon} />
              </View>
            ) : null}
            <View style={[styles.content, contentDivider]}>
              <View style={styles.labelContainer}>
                {subtitle ? (
                  <Subtitle color='primary'>{subtitle}</Subtitle>
                ) : null}
                <View style={styles.titleContainer}>
                  <Body>{title}</Body>
                  {caption ? (
                    <Caption color='secondary'>{caption}</Caption>
                  ) : null}
                </View>
              </View>
              <View style={styles.rightSection}>
                {extra ? (
                  <View style={styles.extraContainer}>{extra}</View>
                ) : null}
                {RightIcon ? <RightIcon {...styles.icon} /> : null}
              </View>
            </View>
          </View>
        )}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ spacing, typography, theme, background }) => ({
  container: {
    flexDirection: 'row',
    paddingLeft: spacing.Padding['p-4'],
    gap: spacing.Padding['p-4'],
    alignItems: 'center',
  },
  pressed: { backgroundColor: background.Common['bg-surface-hover'] },
  disabled: { opacity: 0.6 },
  leftIcon: { paddingVertical: spacing.Padding['p-4'] },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.Padding['p-2'],
    paddingEnd: spacing.Padding['p-4'],
    gap: spacing.Gap['gap-4'],
  },
  labelContainer: {
    paddingVertical: spacing.Padding['p-2'],
    gap: spacing.Gap['gap-2'],
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
}))
