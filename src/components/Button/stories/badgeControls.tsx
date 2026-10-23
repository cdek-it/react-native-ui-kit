import type { ArgTypes } from '@storybook/react'

import { Badge, type BadgeProps } from '../../Badge'

export interface BadgeStoryArgs {
  showBadge: boolean
  badgeDot: boolean
  badgeText: string
  badgeSize: NonNullable<BadgeProps['size']>
  badgeSeverity: NonNullable<BadgeProps['severity']>
}

export const badgeArgs: BadgeStoryArgs = {
  showBadge: false,
  badgeDot: false,
  badgeText: '3',
  badgeSize: 'large',
  badgeSeverity: 'danger',
}

export const badgeArgTypes: ArgTypes<BadgeStoryArgs> = {
  showBadge: { control: 'boolean' },
  badgeDot: { control: 'boolean', if: { arg: 'showBadge' } },
  badgeText: { control: 'text', if: { arg: 'showBadge' } },
  badgeSize: {
    control: 'radio',
    options: ['base', 'large', 'xlarge'],
    if: { arg: 'showBadge' },
  },
  badgeSeverity: {
    control: 'radio',
    options: ['primary', 'info', 'success', 'warning', 'danger'],
    if: { arg: 'showBadge' },
  },
}

export const createBadge = ({
  showBadge,
  badgeDot,
  badgeText,
  badgeSize,
  badgeSeverity,
}: BadgeStoryArgs) => {
  if (!showBadge) return undefined

  return badgeDot ? (
    <Badge dot severity={badgeSeverity} size={badgeSize} />
  ) : (
    <Badge severity={badgeSeverity} size={badgeSize}>
      {badgeText}
    </Badge>
  )
}
