import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
} from '@tabler/icons-react-native'
import { useMemo } from 'react'
import { Text, View, type TextProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

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
}

/**
 * @see https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS-(DS)?node-id=1-284&m=dev
 */
export const Service = ({
  variant = 'success',
  showIcon = true,
  base = true,
  ...other
}: ServiceProps) => {
  const styles = useStyles()

  const { Icon, variantStyle, iconSize, textStyles, containerStyle } =
    useMemo(() => {
      const iconMap = {
        danger: { Icon: IconCircleX, style: styles.danger },
        warning: { Icon: IconAlertTriangle, style: styles.warning },
        success: { Icon: IconCircleCheck, style: styles.success },
        info: { Icon: IconInfoCircle, style: styles.info },
        help: { Icon: IconHelpCircle, style: styles.help },
      }

      return {
        Icon: iconMap[variant]?.Icon || IconInfoCircle,
        variantStyle: iconMap[variant]?.style || styles.info,
        iconSize: base ? styles.iconBase : styles.icon,
        textStyles: [
          styles.textCommon,
          base ? styles.textBase : styles.text,
          iconMap[variant]?.style || styles.info,
        ],
        containerStyle: base ? styles.containerBase : styles.container,
      }
    }, [variant, base, styles])

  return (
    <View style={containerStyle}>
      {showIcon ? (
        <Icon
          color={variantStyle.color}
          height={iconSize.height}
          width={iconSize.width}
        />
      ) : null}
      <Text style={textStyles} {...other} />
    </View>
  )
}

const useStyles = makeStyles(({ typography, spacing }) => ({
  iconBase: { width: 17.5, height: 17.5 },
  icon: { width: 14, height: 14 },

  containerBase: { flexDirection: 'row', gap: spacing.Gap['gap-2'] },
  container: { flexDirection: 'row', gap: spacing.Gap['gap-1'] },

  textCommon: {
    includeFontPadding: false,
    verticalAlign: 'middle',
    flexShrink: 1,
    fontWeight: 400,
  },
  textBase: { fontSize: 14 },
  text: { fontSize: 12.25 },

  warning: { color: typography.Color.Service['text-warning'] },
  success: { color: typography.Color.Service['text-success'] },
  info: { color: typography.Color.Service['text-info'] },
  help: { color: typography.Color.Service['text-help'] },
  danger: { color: typography.Color.Service['text-danger'] },
}))
