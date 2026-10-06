import type { BadgeSeverity } from '../Badge'

/** @deprecated Используйте primary. Удаляется в версии 2.0. */
export type DeprecatedBadgeSeverity = 'basic'

export const adaptBadgeSeverity = (severity: BadgeSeverity) =>
  severity === 'basic' ? 'primary' : severity
