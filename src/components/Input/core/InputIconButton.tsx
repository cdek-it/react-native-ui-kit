import { Pressable } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'

import {
  SvgUniversal,
  type SvgSource,
  type SvgUniversalProps,
  type SvgUniversalTheme,
} from '../../../utils/SvgUniversal'

import { styles } from './styles'
import type { InputVisualVariant } from './types'

interface InputIconButtonProps {
  readonly variant: InputVisualVariant
  readonly icon: SvgSource
  readonly getIconColor: (
    theme: SvgUniversalTheme
  ) => SvgUniversalProps['color']
  readonly accessibilityLabel: string
  readonly disabled?: boolean
  readonly testID: string
  readonly onPress: () => void
}

export const InputIconButton = ({
  variant,
  icon,
  getIconColor,
  accessibilityLabel,
  disabled = false,
  testID,
  onPress,
}: InputIconButtonProps) => {
  const { theme } = useUnistyles()
  const horizontalHitSlop = theme.semantic.dimension.space[100]
  const verticalHitSlop = theme.semantic.dimension.space[200]

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={{
        top: verticalHitSlop,
        bottom: verticalHitSlop,
        left: horizontalHitSlop,
        right: horizontalHitSlop,
      }}
      style={styles.iconButton}
      testID={testID}
      onPress={onPress}
    >
      <SvgUniversal
        accessible={false}
        source={icon}
        uniProps={(theme) => {
          const iconStyle = styles.icon(variant)

          return {
            width: iconStyle.width,
            height: iconStyle.height,
            color: getIconColor(theme),
          }
        }}
      />
    </Pressable>
  )
}
