import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  View,
  Pressable,
  Modal,
  type AccessibilityProps,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import {
  DialogAccessibilityContext,
  type DialogHeaderAccessibility,
} from './DialogAccessibilityContext'
import { DialogComponent, type DialogComponentProps } from './DialogComponent'
import { DialogKeyboardViewport } from './DialogKeyboardViewport'

const ANIMATION_BACKDROP_DURATION = 200
const ANIMATION_CONTENT_DURATION = 500
const SCALE_INIT_VALUE = 0.9

type DialogAccessibilityProps = Omit<
  AccessibilityProps,
  'accessible' | 'accessibilityRole' | 'role' | 'accessibilityViewIsModal'
>

/** Управляемое модальное окно с независимыми шапкой, содержимым и футером. */
export interface DialogProps
  extends DialogComponentProps, DialogAccessibilityProps {
  /** Видимость окна. Имеет приоритет над isVisible, по умолчанию false. */
  // eslint-disable-next-line react/boolean-prop-naming -- Согласованное публичное имя Dialog.
  readonly visible?: boolean
  /** @deprecated Используйте visible. */
  readonly isVisible?: boolean
  /** Разрешает запрос закрытия по нажатию на фон. По умолчанию true. */
  // eslint-disable-next-line react/boolean-prop-naming -- Согласованное публичное имя Dialog.
  readonly closeOnBackdropPress?: boolean
  /** Адаптирует окно к клавиатуре и разрешает прокрутку всего окна при нехватке высоты с открытой клавиатурой. По умолчанию true. false — для собственной обработки. Не отменяет нативное изменение размера окна Android. */
  // eslint-disable-next-line react/boolean-prop-naming -- Описывает поведение, аналогично closeOnBackdropPress.
  readonly avoidKeyboard?: boolean
  /** Запрашивает закрытие. Для скрытия окна обновите visible в родителе. */
  readonly onClose?: () => void
  /** Вызывается один раз после завершённой анимации закрытия. */
  readonly onHideComplete?: () => void
  /** Доступное имя окна. Без стандартного DialogHeader рекомендуется задать явно. */
  readonly accessibilityLabel?: string
  readonly testID?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/**
 * Показывает окно поверх экрана. Ширина не больше 336, боковые отступы не меньше 16.
 * Прокрутку длинного тела задаёт потребитель. Вложенные кнопки и поля остаются отдельными целями фокуса.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6572
 */
export const Dialog = ({
  visible,
  isVisible,
  // TODO: пересмотреть default закрытия по фону при следующем изменении контракта; true сохраняет совместимость.
  closeOnBackdropPress = true,
  avoidKeyboard = true,
  onClose,
  onHideComplete,
  header,
  footer,
  body,
  children,
  testID,
  accessibilityLabel,
  onAccessibilityEscape,
  ...accessibilityProps
}: DialogProps) => {
  const isOpen = visible ?? isVisible ?? false
  const [showModal, setShowModal] = useState(isOpen)
  const [headerAccessibility, setHeaderAccessibility] =
    useState<DialogHeaderAccessibility | null>(null)
  const modalMounted = useRef(isOpen)
  const transitionId = useRef(0)
  const onHideCompleteRef = useRef(onHideComplete)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(SCALE_INIT_VALUE)

  useLayoutEffect(() => {
    onHideCompleteRef.current = onHideComplete
  }, [onHideComplete])

  const completeClose = useCallback((completedTransition: number) => {
    // Отменённый worklet мог уже поставить завершение в очередь JS.
    if (transitionId.current !== completedTransition) return

    transitionId.current += 1
    modalMounted.current = false
    setShowModal(false)
    onHideCompleteRef.current?.()
  }, [])

  useLayoutEffect(() => {
    transitionId.current += 1
    const currentTransition = transitionId.current

    if (isOpen) {
      modalMounted.current = true
      setShowModal(true)
      opacity.value = withTiming(1, { duration: ANIMATION_BACKDROP_DURATION })
      scale.value = withTiming(1, {
        duration: ANIMATION_CONTENT_DURATION,
        easing: Easing.elastic(1.2),
      })
    } else if (modalMounted.current) {
      opacity.value = withTiming(0, { duration: ANIMATION_BACKDROP_DURATION })
      scale.value = withTiming(
        SCALE_INIT_VALUE,
        { duration: ANIMATION_BACKDROP_DURATION },
        (finished) => {
          if (finished) scheduleOnRN(completeClose, currentTransition)
        }
      )
    }

    return () => {
      transitionId.current += 1
    }
  }, [isOpen, opacity, scale, completeClose])

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))
  const dialogAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const requestClose = () => onClose?.()
  const handleEscape = () => {
    onAccessibilityEscape?.()
    requestClose()
  }
  const handleShow = () => {
    if (isOpen && headerAccessibility?.target) {
      AccessibilityInfo.sendAccessibilityEvent(
        headerAccessibility.target,
        'focus'
      )
    }
  }

  return (
    <Modal
      transparent
      animationType='none'
      visible={showModal}
      onRequestClose={requestClose}
      onShow={handleShow}
    >
      <View style={styles.container} testID={testID ?? DialogTestId.root}>
        <AnimatedPressable
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility='no-hide-descendants'
          style={[styles.backdrop, backdropAnimatedStyle]}
          testID={DialogTestId.backdrop}
          onPress={closeOnBackdropPress ? requestClose : undefined}
        />
        <DialogKeyboardViewport isEnabled={avoidKeyboard}>
          <Animated.View
            {...accessibilityProps}
            accessibilityViewIsModal
            accessibilityLabel={
              accessibilityLabel ?? headerAccessibility?.title
            }
            accessible={false}
            role='dialog'
            style={dialogAnimatedStyle}
            testID={DialogTestId.contentContainer}
            onAccessibilityEscape={handleEscape}
          >
            <DialogComponent
              body={body}
              footer={footer}
              header={
                <DialogAccessibilityContext.Provider
                  value={setHeaderAccessibility}
                >
                  {header}
                </DialogAccessibilityContext.Provider>
              }
            >
              {children}
            </DialogComponent>
          </Animated.View>
        </DialogKeyboardViewport>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create(({ components }) => ({
  container: { flex: 1 },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: components.dialog.extend.backdrop,
  },
}))

export const DialogTestId = {
  root: 'DialogModal',
  backdrop: 'Backdrop',
  contentContainer: 'ContentContainer',
}
