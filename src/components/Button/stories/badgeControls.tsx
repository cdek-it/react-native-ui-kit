import type { ArgTypes } from '@storybook/react'

import { Badge, type BadgeProps } from '../../Badge'

export interface BadgeStoryArgs {
  showBadge: boolean
  'badge.dot': boolean
  'badge.text': string
  'badge.size': NonNullable<BadgeProps['size']>
  'badge.severity': NonNullable<BadgeProps['severity']>
}

export const badgeArgs: BadgeStoryArgs = {
  showBadge: false,
  'badge.dot': false,
  'badge.text': '3',
  'badge.size': 'large',
  'badge.severity': 'danger',
}

export const badgeArgTypes: ArgTypes<BadgeStoryArgs> = {
  showBadge: { control: 'boolean' },
  'badge.dot': { control: 'boolean', if: { arg: 'showBadge' } },
  'badge.text': { control: 'text', if: { arg: 'showBadge' } },
  'badge.size': {
    control: 'radio',
    options: ['base', 'large', 'xlarge'],
    if: { arg: 'showBadge' },
  },
  'badge.severity': {
    control: 'radio',
    options: ['primary', 'info', 'success', 'warning', 'danger'],
    if: { arg: 'showBadge' },
  },
}

export const createBadge = ({
  showBadge,
  'badge.dot': badgeDot,
  'badge.text': badgeText,
  'badge.size': badgeSize,
  'badge.severity': badgeSeverity,
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
