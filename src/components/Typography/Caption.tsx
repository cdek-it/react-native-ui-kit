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

// TODO(tokens-migration): reason=missing; legacy=spacing.Gap.gap-1; value=3.5
// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ primitive, semantic, spacing, fonts }) => ({
  text: {
    fontSize: primitive.fonts.fontSize[200],
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
    width: primitive.fonts.fontSize[300],
    height: primitive.fonts.fontSize[300],
  },
}))
