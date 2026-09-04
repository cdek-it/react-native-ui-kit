import { memo, useMemo } from 'react'
import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { Badge, type BadgeProps } from '../Badge'

import { BaseButton } from './BaseButton'
import type { ButtonBadgeProps, ButtonBaseVariant, ButtonProps } from './types'
import { ButtonVariantContext } from './utils/ButtonVariantContext'

/**
 * Button component with badge
 * @param size - button size
 * @param shape - button shape
 * @param loading - button loading state
 * @param variant - button variant
 * @param disabled - button disabled state
 * @param iconOnly - button with only Icon
 * @param iconPosition - icon position
 * @param Icon - Tabler icon
 * @param label - button label
 * @param style - external style control for component
 * @param badgeSeverity - badge component severity level
 * @param badgeLabel - text label inside badge
 * @see BaseButton
 */
export const ButtonBadge = memo<
  ButtonProps<ButtonBaseVariant> & ButtonBadgeProps
>(({ badgeLabel, badgeSeverity, variant = 'primary', ...props }) => {
  const variantContextValue = useMemo(() => ({ variant }), [variant])

  const badgeCommonProps = {
    severity: badgeSeverity,
    testID: ButtonBadgeTestId.badge,
  }
  const badgeProps: BadgeProps = badgeLabel
    ? { ...badgeCommonProps, children: badgeLabel, style: styles.badge }
    : { ...badgeCommonProps, dot: true, style: styles.badgeDot }

  return (
    <ButtonVariantContext.Provider value={variantContextValue}>
      <View style={styles.container}>
        <BaseButton variant={variant} {...props} />

        <Badge {...badgeProps} />
      </View>
    </ButtonVariantContext.Provider>
  )
})

const styles = StyleSheet.create(() => ({
  container: { alignSelf: 'flex-start' },
  badgeDot: { position: 'absolute', top: 0, right: -0.5 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateX: '50%' }, { translateY: '-50%' }],
  },
}))

export const ButtonBadgeTestId = { badge: 'Badge' }
