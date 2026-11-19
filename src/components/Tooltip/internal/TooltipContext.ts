import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  type ReactNode,
} from 'react'

import type { Rect } from './placement'

interface TooltipHost {
  viewport?: Rect
  bounds?: Rect
  update: (id: string, content: ReactNode) => void
  remove: (id: string) => void
}

export const TooltipContext = createContext<TooltipHost | null>(null)

export const useTooltipHost = () => {
  const host = useContext(TooltipContext)

  if (!host) throw new Error('Tooltip должен находиться внутри TooltipProvider')

  return host
}

export const TooltipPortal = ({
  children,
}: {
  readonly children: ReactNode
}) => {
  const { update, remove } = useTooltipHost()
  const id = useId()

  useLayoutEffect(() => {
    update(id, children)
  }, [id, children, update])

  useLayoutEffect(() => () => remove(id), [id, remove])

  return null
}
