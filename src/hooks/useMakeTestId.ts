import { useCallback } from 'react'

export const useMakeTestId = (prefix: string) => {
  const makeTestId = useCallback(
    (postfix = '') => {
      return `${prefix}${postfix}`
    },
    [prefix]
  )

  return { makeTestId }
}
