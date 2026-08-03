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

// Осознанный обход слоя components: цвет текста — семантическая роль, и своего
// токена у Typography нет (компонент отсутствует в tokens.json).
const styles = StyleSheet.create(({ primitive, semantic, fonts }) => ({
  text: {
    fontSize: primitive.fonts.fontSize[200],
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
    lineHeight: primitive.fonts.lineHeight[300],
    letterSpacing: primitive.fonts.letterSpacing[200],
  },
  textWithIcon: { flexShrink: 1 },
  default: { color: semantic.colorScheme.color.fg.default },
  primary: { color: semantic.colorScheme.color.fg.brand.default },
  secondary: { color: semantic.colorScheme.color.fg.muted },
  disabled: { opacity: semantic.effects.opacity[60] },
  withIconContainer: {
    flexDirection: 'row',
    gap: semantic.dimension.space[100],
  },
  icon: {
    width: semantic.dimension.size[450],
    height: semantic.dimension.size[450],
  },
}))
