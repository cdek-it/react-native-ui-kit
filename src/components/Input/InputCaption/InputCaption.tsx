import {
  IconAlertCircle,
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconCircleX,
} from '@tabler/icons-react-native'
import type { ReactNode } from 'react'
import { View, type ViewProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { useMakeTestId } from '../../../hooks/useMakeTestId'
import { SvgUniversal, type SvgSource } from '../../../utils/SvgUniversal'
import { Caption } from '../../Typography/Caption'

export interface InputCaptionProps extends ViewProps {
  readonly children: ReactNode
  /**
   * Оформление подписи и стандартная иконка
   * @default 'base'
   */
  readonly variant?: 'base' | 'success' | 'warning' | 'danger' | 'info'
  /**
   * Показывает стандартную или переданную SVG-иконку
   * @default false
   */
  readonly showIcon?: boolean
  /** Переопределяет стандартную иконку выбранного variant */
  readonly Icon?: SvgSource
  readonly testID?: string
}

const icons = {
  base: IconAlertCircle,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  danger: IconCircleX,
} satisfies Record<NonNullable<InputCaptionProps['variant']>, SvgSource>

/**
 * Подпись поля ввода
 *
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/?node-id=25178-77704
 */
export const InputCaption = ({
  children,
  variant = 'base',
  showIcon = false,
  Icon,
  testID = 'InputCaption',
  style,
  ...props
}: InputCaptionProps) => {
  const { makeTestId } = useMakeTestId(testID)

  return (
    <View
      accessible
      accessibilityRole='text'
      {...props}
      style={[styles.row, style]}
      testID={testID}
    >
      {showIcon ? (
        <SvgUniversal
          accessible={false}
          source={Icon ?? icons[variant]}
          testID={makeTestId('Icon')}
          uniProps={({ semantic }) => ({
            width: semantic.dimension.size[400],
            height: semantic.dimension.size[400],
            color:
              variant === 'base'
                ? semantic.colorScheme.color.fg.default
                : semantic.colorScheme.color.fg.status[variant].default,
          })}
        />
      ) : null}
      <Caption accessible={false} style={[styles.text, styles[variant]]}>
        {children}
      </Caption>
    </View>
  )
}

const styles = StyleSheet.create(({ semantic }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: semantic.dimension.space[50],
  },
  text: { flexShrink: 1 },
  base: { color: semantic.colorScheme.color.fg.default },
  success: { color: semantic.colorScheme.color.fg.status.success.default },
  warning: { color: semantic.colorScheme.color.fg.status.warning.default },
  danger: { color: semantic.colorScheme.color.fg.status.danger.default },
  info: { color: semantic.colorScheme.color.fg.status.info.default },
}))
