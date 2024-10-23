import React from 'react'
import { Text, View, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

interface BadgeBase {
  severity?: 'basic' | 'info' | 'success' | 'warning' | 'danger'
  style?: ViewStyle
}

interface BadgeText extends BadgeBase {
  children: string
  dot?: never
}

interface BadgeDot extends BadgeBase {
  dot: true
  children?: never
}

export type BadgeProps = BadgeText | BadgeDot

export const Badge = ({ children, dot, severity = 'basic', style }: BadgeProps) => {
  const styles = useStyles()

  return (
    <View style={[styles.container, style]}>
      {dot ? (
        <View style={[styles.dot, styles[severity]]} />
      ) : (
        <Text style={[styles.textBadge, styles[severity]]}>{children}</Text>
      )}
    </View>
  )
}

const useStyles = makeStyles(({ theme }) => ({
  container: {
    alignItems: 'flex-start',
  },
  dot: {
    width: theme.Misc.Badge.badgeDotSize,
    height: theme.Misc.Badge.badgeDotSize,
    borderRadius: 100,
  },
  textBadge: {
    height: theme.Misc.Badge.badgeHeight,
    paddingHorizontal: theme.Misc.Tag.tagPadding,
    paddingVertical: theme.Misc.Chip.chipPaddingTopBottom,
    borderRadius: 100,
    verticalAlign: 'middle',
    fontFamily: 'Roboto',
    color: theme.Misc.Badge.badgeTextColor,
    fontSize: 10.5,
    fontWeight: 700,
  },
  basic: {
    backgroundColor: theme.Misc.Badge.badgeBg,
  },
  info: {
    backgroundColor: theme.Button.Severity.Info.Basic.infoButtonBg,
  },
  success: {
    backgroundColor: theme.Button.Severity.Success.Basic.successButtonBg,
  },
  warning: {
    backgroundColor: theme.Button.Severity.Warning.Basic.warningButtonBg,
  },
  danger: {
    backgroundColor: theme.Button.Severity.Danger.Basic.dangerButtonBg,
  },
}))
