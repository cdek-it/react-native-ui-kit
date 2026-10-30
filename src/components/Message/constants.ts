export const severityKey = {
  info: 'info',
  success: 'success',
  warning: 'warn',
  danger: 'error',
} as const

export type MessageSeverity = keyof typeof severityKey
