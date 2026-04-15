import { Text, type TextProps, View } from 'react-native'

import { StyleSheet } from '../../utils'
import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface CaptionProps extends TextProps {
  readonly color?: 'default' | 'secondary' | 'primary'
  readonly disabled?: boolean
  /** SVG-иконка */
  readonly Icon?: SvgSource
}

export const Caption = ({
  color = 'default',
  disabled,
  style,
  Icon,
  ...other
}: CaptionProps) => {
  const text = (
    <Text
      style={[
        styles.text,
        styles[color],
        disabled && styles.disabled,
        Icon && styles.textWithIcon,
        style,
      ]}
      testID={CaptionTestId.text}
      {...other}
    />
  )

  if (Icon) {
    return (
      <View style={styles.withIconContainer}>
        <SvgUniversal
          color={styles[color].color}
          height={styles.icon.height}
          source={Icon}
          testID={CaptionTestId.icon}
          width={styles.icon.width}
        />
        {text}
      </View>
    )
  }

  return text
}

const CaptionTestId = { text: 'CaptionText', icon: 'CaptionIcon' }

const styles = StyleSheet.create(({ theme, spacing, typography, fonts }) => ({
  text: {
    fontSize: typography.Size['text-sm'],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.primary,
  },
  textWithIcon: { flexShrink: 1 },
  default: { color: theme.General.textColor },
  primary: { color: theme.General.primaryColor },
  secondary: { color: theme.General.textSecondaryColor },
  disabled: { opacity: 0.6 },
  withIconContainer: { flexDirection: 'row', gap: spacing.Gap['gap-1'] },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },
}))
