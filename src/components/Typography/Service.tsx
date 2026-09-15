import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
} from '@tabler/icons-react-native'
import { useMemo } from 'react'
import { Text, View, type TextProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

export interface ServiceProps extends TextProps {
  /**
   * Вариант отображения
   * @default success
   */
  readonly variant?: 'danger' | 'warning' | 'success' | 'info' | 'help'
  /**
   * true, если необходимо показать иконку
   * @default false
   */
  readonly showIcon?: boolean
  /**
   * true, если необходим компонент в базовом стиле
   * @default false
   */
  readonly base?: boolean
  /** SVG-иконка */
  readonly Icon?: SvgSource
}

/**
 * @see https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS-(DS)?node-id=1-284&m=dev
 */
export const Service = ({
  variant = 'success',
  showIcon = true,
  base = true,
  Icon: IconFromProps,
  ...other
}: ServiceProps) => {
  const { Icon, iconSize, textStyles, containerStyle } = useMemo(() => {
    const iconMap = {
      danger: { Icon: IconCircleX, style: styles.danger },
      warning: { Icon: IconAlertTriangle, style: styles.warning },
      success: { Icon: IconCircleCheck, style: styles.success },
      info: { Icon: IconInfoCircle, style: styles.info },
      help: { Icon: IconHelpCircle, style: styles.help },
    }

    return {
      Icon: IconFromProps || iconMap[variant]?.Icon || IconInfoCircle,
      iconSize: base ? styles.iconBase : styles.icon,
      textStyles: [
        styles.textCommon,
        base && styles.textBase,
        iconMap[variant]?.style || styles.info,
      ],
      containerStyle: base ? styles.containerBase : styles.container,
    }
  }, [variant, base, IconFromProps])

  return (
    <View style={containerStyle}>
      {showIcon ? (
        <SvgUniversal
          {...iconSize}
          source={Icon}
          uniProps={({ semantic }) => {
            return {
              color: {
                danger: semantic.colorScheme.color.fg.status.danger.default,
                warning: semantic.colorScheme.color.fg.status.warning.default,
                success: semantic.colorScheme.color.fg.status.success.default,
                info: semantic.colorScheme.color.fg.status.info.default,
                help: semantic.colorScheme.color.fg.status.help.default,
              }[variant],
            }
          }}
        />
      ) : null}
      <Text style={textStyles} {...other} />
    </View>
  )
}

const styles = StyleSheet.create(({ semantic, fonts }) => ({
  iconBase: {
    width: semantic.dimension.size[600],
    height: semantic.dimension.size[600],
  },
  icon: {
    width: semantic.dimension.size[450],
    height: semantic.dimension.size[450],
  },

  containerBase: { flexDirection: 'row', gap: semantic.dimension.space[200] },
  container: { flexDirection: 'row', gap: semantic.dimension.space[100] },

  textCommon: {
    includeFontPadding: false,
    verticalAlign: 'middle',
    flexShrink: 1,
    fontWeight: fonts.fontWeight.regular,
    fontSize: fonts.fontSize[200],
    fontFamily: fonts.fontFamily.base,
    lineHeight: fonts.lineHeight[300],
    letterSpacing: fonts.letterSpacing[200],
  },
  textBase: { lineHeight: undefined, fontSize: fonts.fontSize[300] },

  warning: { color: semantic.colorScheme.color.fg.status.warning.default },
  success: { color: semantic.colorScheme.color.fg.status.success.default },
  info: { color: semantic.colorScheme.color.fg.status.info.default },
  help: { color: semantic.colorScheme.color.fg.status.help.default },
  danger: { color: semantic.colorScheme.color.fg.status.danger.default },
}))
