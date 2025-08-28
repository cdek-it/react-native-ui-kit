import { forwardRef, useImperativeHandle, useMemo } from 'react'
import type { ViewStyle } from 'react-native'

import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

import { makeStyles } from '../../../utils/makeStyles'

import { InputTextBaseTestId } from './testIds'

interface OutlinesProps {
  readonly containerStyle?: ViewStyle
  readonly baseBorderRadius?: number
  readonly disabled?: boolean
  readonly makeTestId: (name: string) => string
}

export interface OutlinesRef {
  focus: () => void
  blur: () => void
  setDanger: (on: boolean) => void
}

const withOutlineAnimation = (toValue: number) =>
  withTiming(toValue, { duration: 100 })

export const Outlines = forwardRef<OutlinesRef, OutlinesProps>(
  ({ disabled, makeTestId, containerStyle, baseBorderRadius }, ref) => {
    const styles = useStyles()
    const focusOutlineWidth = useSharedValue(0)
    const dangerOutlineWidth = useSharedValue(0)

    const focus = () => {
      focusOutlineWidth.value = withOutlineAnimation(
        -styles.outlineWidth.borderWidth
      )
    }

    const blur = () => {
      focusOutlineWidth.value = withOutlineAnimation(0)
    }

    const setDanger = (value: boolean) => {
      dangerOutlineWidth.value = withOutlineAnimation(
        value ? -styles.outlineWidth.borderWidth : 0
      )
    }

    useImperativeHandle(ref, () => ({ focus, blur, setDanger }))

    const focusOutlineAnimatedStyles = useMemo(() => {
      return {
        top: focusOutlineWidth,
        right: focusOutlineWidth,
        bottom: focusOutlineWidth,
        left: focusOutlineWidth,
      }
    }, [focusOutlineWidth])

    const dangerOutlineAnimatedStyles = useMemo(
      () => ({
        top: dangerOutlineWidth,
        right: dangerOutlineWidth,
        bottom: dangerOutlineWidth,
        left: dangerOutlineWidth,
      }),
      [dangerOutlineWidth]
    )

    const outlineStyles = useMemo<ViewStyle>(
      () => ({
        borderRadius: containerStyle?.borderRadius ?? baseBorderRadius,
        borderTopRightRadius: containerStyle?.borderTopRightRadius,
        borderBottomRightRadius: containerStyle?.borderBottomRightRadius,
        borderBottomLeftRadius: containerStyle?.borderBottomLeftRadius,
        borderTopLeftRadius: containerStyle?.borderTopLeftRadius,
      }),
      [
        containerStyle?.borderBottomLeftRadius,
        containerStyle?.borderBottomRightRadius,
        containerStyle?.borderRadius,
        containerStyle?.borderTopLeftRadius,
        containerStyle?.borderTopRightRadius,
        baseBorderRadius,
      ]
    )

    return disabled ? null : (
      <>
        <Animated.View
          style={[
            styles.outline,
            outlineStyles,
            styles.focusOutline,
            focusOutlineAnimatedStyles,
          ]}
          testID={makeTestId(InputTextBaseTestId.focusOutline)}
        />
        <Animated.View
          style={[
            styles.outline,
            outlineStyles,
            styles.dangerOutline,
            dangerOutlineAnimatedStyles,
          ]}
          testID={makeTestId(InputTextBaseTestId.dangerOutline)}
        />
      </>
    )
  }
)

export const useStyles = makeStyles(({ theme }) => ({
  outline: { position: 'absolute' },
  outlineWidth: { borderWidth: theme.General.focusShadowWidth },
  focusOutline: { backgroundColor: theme.General.focusOutlineColor },
  dangerOutline: { backgroundColor: theme.General.focusOutlineErrorColor },
}))
