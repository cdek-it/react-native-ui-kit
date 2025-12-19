import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, Modal } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'

import { scheduleOnRN } from 'react-native-worklets'

import { DialogComponent, type DialogComponentProps } from './DialogComponent'

const ANIMATION_BACKDROP_DURATION = 200
const ANIMATION_CONTENT_DURATION = 500
const BACKDROP_OPACITY = 0.5
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
  const [showModal, setShowModal] = useState(false)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(SCALE_INIT_VALUE)

  const handleAnimationComplete = useCallback(() => {
    if (onHideComplete) {
      onHideComplete()
    }

    setShowModal(false)
  }, [onHideComplete])

  useEffect(() => {
    if (isVisible) {
      setShowModal(true)
      opacity.value = withTiming(1, { duration: ANIMATION_BACKDROP_DURATION })
      scale.value = withTiming(1, {
        duration: ANIMATION_CONTENT_DURATION,
        easing: Easing.elastic(1.2),
      })
    } else {
      opacity.value = withTiming(0, { duration: ANIMATION_BACKDROP_DURATION })
      scale.value = withTiming(
        SCALE_INIT_VALUE,
        { duration: ANIMATION_BACKDROP_DURATION },
        (finished) => {
          if (finished) {
            scheduleOnRN(handleAnimationComplete)
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

  return (
    <Modal
      transparent
      animationType='none'
      visible={showModal}
      onRequestClose={onClose}
    >
      <View style={styles.container} testID={testID ?? DialogTestId.root}>
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
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'black' },
})

export const DialogTestId = {
  root: 'DialogModal',
  backdrop: 'Backdrop',
  contentContainer: 'ContentContainer',
}
