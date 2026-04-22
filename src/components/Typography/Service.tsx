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
        base ? styles.textBase : styles.text,
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
          uniProps={({ typography: t }) => ({
            color: {
              danger: t.Color.Service['text-danger'],
              warning: t.Color.Service['text-warning'],
              success: t.Color.Service['text-success'],
              info: t.Color.Service['text-info'],
              help: t.Color.Service['text-help'],
            }[variant],
          })}
        />
      ) : null}
      <Text style={textStyles} {...other} />
    </View>
  )
}

const styles = StyleSheet.create(({ typography, spacing, fonts }) => ({
  iconBase: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
  },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },

  containerBase: { flexDirection: 'row', gap: spacing.Gap['gap-2'] },
  container: { flexDirection: 'row', gap: spacing.Gap['gap-1'] },

  textCommon: {
    includeFontPadding: false,
    verticalAlign: 'middle',
    flexShrink: 1,
    fontWeight: 400,
  },
  textBase: {
    fontSize: typography.Size['text-base'],
    fontFamily: fonts.secondary,
  },
  text: { fontSize: typography.Size['text-sm'], fontFamily: fonts.primary },

  warning: { color: typography.Color.Service['text-warning'] },
  success: { color: typography.Color.Service['text-success'] },
  info: { color: typography.Color.Service['text-info'] },
  help: { color: typography.Color.Service['text-help'] },
  danger: { color: typography.Color.Service['text-danger'] },
}))
