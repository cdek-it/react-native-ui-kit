import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import { View, useWindowDimensions } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { TooltipContext } from './internal/TooltipContext'
import { measureInViewport } from './internal/measureInViewport'
import { getTooltipBounds, type Rect } from './internal/placement'

/**
 * Слой подсказок поверх содержимого экрана.
 * Размещайте вокруг экрана вне ScrollView. В native Modal нужен свой провайдер,
 * Android Back обрабатывается через onRequestClose самой модалки.
 */
export const TooltipProvider = ({ children }: PropsWithChildren) => {
  const rootRef = useRef<View>(null)
  const [viewport, setViewport] = useState<Rect>()
  const [overlays, setOverlays] = useState(() => new Map<string, ReactNode>())
  const { width, height } = useWindowDimensions()
  const { theme, rt } = useUnistyles()
  const { top, bottom, left, right } = rt.insets
  const gutter = theme.components.tooltip.root.gutter

  const measure = useCallback(() => {
    const root = rootRef.current

    if (root)
      measureInViewport(root, (rect) => {
        setViewport((previous) =>
          previous?.x === rect.x &&
          previous?.y === rect.y &&
          previous?.width === rect.width &&
          previous?.height === rect.height
            ? previous
            : rect
        )
      })
  }, [])

  useLayoutEffect(measure, [measure, width, height])

  const update = useCallback((id: string, content: ReactNode) => {
    setOverlays((previous) => new Map(previous).set(id, content))
  }, [])
  const remove = useCallback((id: string) => {
    setOverlays((previous) => {
      const next = new Map(previous)
      next.delete(id)

      return next
    })
  }, [])
  const bounds = useMemo(
    () =>
      viewport &&
      getTooltipBounds({
        viewport,
        window: { width, height },
        insets: { top, bottom, left, right },
        gutter,
      }),
    [viewport, width, height, top, bottom, left, right, gutter]
  )
  const host = useMemo(
    () => ({ viewport, bounds, update, remove }),
    [viewport, bounds, update, remove]
  )

  return (
    <TooltipContext.Provider value={host}>
      <View
        collapsable={false}
        ref={rootRef}
        style={styles.root}
        testID='TooltipHost'
        onLayout={measure}
      >
        {children}
        <View pointerEvents='box-none' style={styles.layer}>
          {Array.from(overlays, ([id, content]) => (
            <Fragment key={id}>{content}</Fragment>
          ))}
        </View>
      </View>
    </TooltipContext.Provider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  layer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
})
