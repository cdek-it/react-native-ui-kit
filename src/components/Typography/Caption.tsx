import type { Icon } from '@tabler/icons-react-native'
import { Text, type TextProps, View } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface CaptionProps extends TextProps {
  readonly color?: 'default' | 'secondary' | 'primary'
  readonly disabled?: boolean
  /** Иконка из набора Tabler */
  readonly Icon?: Icon
}

export const Caption = ({
  color = 'default',
  disabled,
  style,
  Icon,
  ...other
}: CaptionProps) => {
  const styles = useStyles()
  const text = (
    <Text
      style={[
        styles.text,
        styles[color],
        disabled && styles.disabled,
        Icon && styles.textWithIcon,
        style,
      ]}
      {...other}
    />
  )

  if (Icon) {
    return (
      <View style={styles.withIconContainer}>
        <Icon {...styles[color]} {...styles.icon} />
        {text}
      </View>
    )
  }

  return text
}

const useStyles = makeStyles(({ theme, spacing, typography }) => ({
  text: { fontSize: 12.25, includeFontPadding: false, verticalAlign: 'middle' },
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
