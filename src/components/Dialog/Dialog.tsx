import { Portal } from '@gorhom/portal'
import React, { useCallback, useEffect } from 'react'
import { View, StyleSheet, BackHandler, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated'

import { DialogComponent, type DialogComponentProps } from './DialogComponent'

const ANIMATION_DURATION = 200
const BACKDROP_OPACITY = 0.5
const SCALE_DAMPING = 5
const SCALE_STIFFNESS = 50
const SCALE_INIT_VALUE = 0.9

export interface DialogProps extends DialogComponentProps {
  readonly isVisible: boolean
  readonly onClose?: () => void
  readonly onHideComplete?: () => void
  readonly testID?: string
}

// eslint-disable-next-line import-x/no-deprecated
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const Dialog: React.FC<DialogProps> = ({
  isVisible,
  onClose,
  onHideComplete,
  header,
  footer,
  body,
  testID,
}) => {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(SCALE_INIT_VALUE)

  const handleAnimationComplete = useCallback(() => {
    if (onHideComplete) {
      onHideComplete()
    }
  }, [onHideComplete])

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: ANIMATION_DURATION })
      scale.value = withSpring(1, {
        damping: SCALE_DAMPING,
        stiffness: SCALE_STIFFNESS,
      })
    } else {
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION })
      scale.value = withTiming(
        SCALE_INIT_VALUE,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) {
            runOnJS(handleAnimationComplete)()
          }
        }
      )
    }
  }, [isVisible, opacity, scale, handleAnimationComplete])

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(opacity.value, [0, 1], [0, BACKDROP_OPACITY]),
    }
  })

  const dialogAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value, transform: [{ scale: scale.value }] }
  })

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isVisible) {
          onClose?.()

          return true
        }

        return false
      }
    )

    return subscription.remove
  }, [isVisible, onClose])

  return (
    <Portal>
      <View
        style={[
          styles.container,
          !isVisible && styles.containerNoPointerEvents,
        ]}
        testID={testID ?? DialogTestId.root}
      >
        <AnimatedPressable
          style={[styles.backdrop, backdropAnimatedStyle]}
          testID={DialogTestId.backdrop}
          onPress={onClose}
        />
        <Animated.View
          style={dialogAnimatedStyle}
          testID={DialogTestId.contentContainer}
        >
          <DialogComponent body={body} footer={footer} header={header} />
        </Animated.View>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 999,
    pointerEvents: 'auto',
  },
  containerNoPointerEvents: { pointerEvents: 'none' },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
})

export const DialogTestId = {
  root: 'DialogModal',
  backdrop: 'Backdrop',
  contentContainer: 'ContentContainer',
}
