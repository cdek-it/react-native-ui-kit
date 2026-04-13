import { memo, useCallback, useMemo, useState } from 'react'
import {
  type LayoutChangeEvent,
  type LayoutRectangle,
  View,
  type ViewStyle,
} from 'react-native'

import { StyleSheet } from '../../utils'
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
export const ButtonBadge = memo(
  ({
    badgeLabel,
    badgeSeverity,
    variant = 'primary',
    ...props
  }: ButtonProps<ButtonBaseVariant> & ButtonBadgeProps) => {
    const [badgeLayout, setBadgeLayout] = useState<LayoutRectangle>()
    const variantContextValue = useMemo(() => ({ variant }), [variant])

    const badgeContainerStyle = useMemo<ViewStyle>(
      () => ({
        position: 'absolute',
        top: badgeLayout ? -Math.round(badgeLayout.height / 2) : 0,
        right: badgeLayout ? -Math.round(badgeLayout.width / 2) : 0,
      }),
      [badgeLayout]
    )

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => setBadgeLayout(e.nativeEvent.layout),
      []
    )

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
              <Badge
                {...badgeCommonProps}
                style={badgeContainerStyle}
                onLayout={onLayout}
              >
                {badgeLabel}
              </Badge>
            ) : (
              <Badge {...badgeCommonProps} dot style={styles.badgeDot} />
            )}
          </View>
        </View>
      </ButtonVariantContext.Provider>
    )
  }
)

const styles = StyleSheet.create(() => ({
  root: { flexDirection: 'row' },
  contentContainer: { flex: 1 },
  iconOnlyContainer: { flex: 0 },
  badgeDot: { position: 'absolute', top: 0, right: -0.5 },
}))

export const ButtonBadgeTestId = { badge: 'Badge' }
