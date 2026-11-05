import { memo } from 'react'

import { Badge, type BadgeProps } from '../Badge'

import { Button } from './Button'
import type { ButtonBadgeProps, ButtonBaseVariant, ButtonProps } from './types'

/** @deprecated Используйте Button с пропом badge. Удаляется в версии 2.0. */
export const ButtonBadge = memo<
  ButtonProps<ButtonBaseVariant> & ButtonBadgeProps & { badge?: never }
>(({ badgeLabel, badgeSeverity, ...props }) => {
  const badgeProps: BadgeProps = badgeLabel
    ? { severity: badgeSeverity, children: badgeLabel }
    : { severity: badgeSeverity, dot: true }

  return (
    <Button
      {...props}
      badge={<Badge {...badgeProps} testID={ButtonBadgeTestId.badge} />}
    />
  )
})

export const ButtonBadgeTestId = { badge: 'Badge' }
