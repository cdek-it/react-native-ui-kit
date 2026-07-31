import { Text, type TextProps, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

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
          {...styles.icon}
          source={Icon}
          testID={CaptionTestId.icon}
          uniProps={({ semantic }) => ({
            color: {
              default: semantic.colorScheme.color.fg.default,
              primary: semantic.colorScheme.color.fg.brand.default,
              secondary: semantic.colorScheme.color.fg.muted,
            }[color],
          })}
        />
        {text}
      </View>
    )
  }

  return text
}

const CaptionTestId = { text: 'CaptionText', icon: 'CaptionIcon' }

const styles = StyleSheet.create(
  ({ semantic, spacing, typography, fonts }) => ({
    text: {
      fontSize: typography.Size['text-sm'],
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.secondary,
      lineHeight: 15,
      letterSpacing: -0.25,
    },
    textWithIcon: { flexShrink: 1 },
    default: { color: semantic.colorScheme.color.fg.default },
    primary: { color: semantic.colorScheme.color.fg.brand.default },
    secondary: { color: semantic.colorScheme.color.fg.muted },
    disabled: { opacity: 0.6 },
    withIconContainer: { flexDirection: 'row', gap: spacing.Gap['gap-1'] },
    icon: {
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
  })
)
