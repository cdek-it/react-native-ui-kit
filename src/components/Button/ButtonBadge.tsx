import { memo, useCallback, useMemo, useState } from 'react'
import {
  type LayoutChangeEvent,
  type LayoutRectangle,
  View,
  type ViewStyle,
} from 'react-native'

import { Badge } from '../Badge'

import { BaseButton } from './BaseButton'
import { useBasicButtonStyles } from './styles'
import type { ButtonBadgeProps, ButtonProps } from './types'

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
export const ButtonBadge = memo<ButtonProps & ButtonBadgeProps>(
  ({ badgeLabel, badgeSeverity, testID, ...props }) => {
    const buttonStyles = useBasicButtonStyles()
    const [badgeLayout, setBadgeLayout] = useState<LayoutRectangle>()

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

    return (
      <View>
        <BaseButton {...props} {...buttonStyles} />

        <Badge
          severity={badgeSeverity}
          style={badgeContainerStyle}
          testID={testID || 'buttonBadge'}
          onLayout={onLayout}
        >
          {badgeLabel}
        </Badge>
      </View>
    )
  }
)
