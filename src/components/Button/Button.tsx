import React, { useMemo } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle, Pressable, Text } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

interface ButtonProps {
  label: string
  onPress: () => void
  rounded?: boolean
  size?: 'xLarge' | 'large' | 'base' | 'small'
  variant?: 'basic' | 'outlined' | 'text'
}

/**
 *
 * @deprecated TODO: Not ready for use, just an example of theme usage
 */
export const Button = ({
  label,
  onPress,
  rounded,
  size = 'base',
  variant = 'basic',
}: ButtonProps) => {
  const styles = useStyles()

  const containerStyle = useMemo(() => {
    const style: StyleProp<ViewStyle> = [styles.container]

    switch (size) {
      case 'xLarge':
        style.push(styles.xLargeContainer)
        break
      case 'large':
        style.push(styles.largeContainer)
        break
      case 'base':
        style.push(styles.baseContainer)
        break
      case 'small':
        style.push(styles.smallContainer)
        break
      default:
    }

    if (rounded) {
      style.push(styles.roundedContainer)
    }

    switch (variant) {
      case 'outlined':
        style.push(styles.outlinedContainer)
        break
      case 'text':
        style.push(styles.textContainer)
        break
      default:
    }

    return style
  }, [
    rounded,
    size,
    styles.baseContainer,
    styles.container,
    styles.largeContainer,
    styles.outlinedContainer,
    styles.roundedContainer,
    styles.smallContainer,
    styles.textContainer,
    styles.xLargeContainer,
    variant,
  ])

  const labelStyle = useMemo(() => {
    const style: StyleProp<TextStyle> = [styles.label]

    switch (size) {
      case 'xLarge':
        style.push(styles.xLargeLabel)
        break
      case 'large':
        style.push(styles.largeLabel)
        break
      case 'base':
        style.push(styles.baseLabel)
        break
      case 'small':
        style.push(styles.smallLabel)
        break
      default:
    }

    switch (variant) {
      case 'outlined':
        style.push(styles.outlinedLabel)
        break
      case 'text':
        style.push(styles.textLabel)
        break
      default:
    }

    return style
  }, [
    size,
    styles.baseLabel,
    styles.label,
    styles.largeLabel,
    styles.outlinedLabel,
    styles.smallLabel,
    styles.textLabel,
    styles.xLargeLabel,
    variant,
  ])

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  )
}

const useStyles = makeStyles(({ theme }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.Button.Basic.buttonBg,
    borderRadius: theme.General.borderRadius,
  },
  roundedContainer: {
    borderRadius: 100,
  },
  outlinedContainer: {
    borderWidth: 1,
    borderColor: theme.Button.Outlined.outlinedButtonBorderColor,
    backgroundColor: theme.Button.Outlined.outlinedButtonBg,
  },
  textContainer: {
    backgroundColor: theme.Button.Text.textButtonBg,
  },
  xLargeContainer: {
    height: theme.Button.Common.buttonHeightXL,
    paddingHorizontal: 21,
  },
  largeContainer: {
    height: theme.Button.Common.buttonHeightLG,
    paddingHorizontal: 21,
  },
  baseContainer: {
    height: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
  },
  smallContainer: {
    height: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
  },

  label: {
    color: theme.Button.Basic.buttonTextColor,
  },
  outlinedLabel: {
    color: theme.Button.Outlined.outlinedButtonTextColor,
  },
  textLabel: {
    color: theme.Button.Text.textButtonTextColor,
  },
  xLargeLabel: {
    fontSize: 21,
  },
  largeLabel: {
    fontSize: 17.5,
  },
  baseLabel: {
    fontSize: 14,
  },
  smallLabel: {
    fontSize: 12.25,
  },
}))
