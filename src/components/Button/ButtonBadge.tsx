import { memo, useMemo } from 'react'
import { View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { Badge } from '../Badge'

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

  const badgeCommonProps = useMemo(
    () => ({ severity: badgeSeverity, testID: ButtonBadgeTestId.badge }),
    [badgeSeverity]
  )

  return (
    <ButtonVariantContext.Provider value={variantContextValue}>
      <View style={styles.root}>
        <View
          style={[
            styles.contentContainer,
            props.iconOnly && styles.iconOnlyContainer,
          ]}
        >
          <BaseButton variant={variant} {...props} />

          {badgeLabel ? (
            <Badge {...badgeCommonProps} style={styles.badge}>
              {badgeLabel}
            </Badge>
          ) : (
            <Badge {...badgeCommonProps} dot style={styles.badgeDot} />
          )}
        </View>
      </View>
    </ButtonVariantContext.Provider>
  )
})

const styles = StyleSheet.create(() => ({
  root: { flexDirection: 'row' },
  contentContainer: { flex: 1 },
  iconOnlyContainer: { flex: 0 },
  badgeDot: { position: 'absolute', top: 0, right: -0.5 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [{ translateX: '50%' }, { translateY: '-50%' }],
  },
}))

export const ButtonBadgeTestId = { badge: 'Badge' }
