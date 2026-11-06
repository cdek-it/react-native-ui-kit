import {
  useEffect,
  useRef,
  useState,
  type Context,
  type ReactNode,
} from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

// Body имеет собственную ограниченную область прокрутки: списки внутри неё
// не должны наследовать контекст внешней прокрутки окна. В RN 0.83 этот
// статический Context есть в runtime и generated types, но отсутствует в legacy .d.ts.
const ScrollViewContext = (
  ScrollView as typeof ScrollView & {
    Context: Context<{ horizontal: boolean } | null>
  }
).Context

interface DialogKeyboardViewportProps {
  readonly children: ReactNode
  readonly isEnabled: boolean
}

export const DialogKeyboardViewport = ({
  children,
  isEnabled,
}: DialogKeyboardViewportProps) => {
  const scrollRef = useRef<ScrollView>(null)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(() =>
    Keyboard.isVisible()
  )
  const [viewportHeight, setViewportHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const isScrollEnabled =
    isEnabled &&
    isKeyboardVisible &&
    viewportHeight > 0 &&
    contentHeight > viewportHeight

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    )
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    )

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  useEffect(() => {
    if (!isScrollEnabled) scrollRef.current?.scrollTo({ y: 0, animated: false })
  }, [isScrollEnabled])

  return (
    <KeyboardAvoidingView
      behavior='padding'
      enabled={isEnabled}
      pointerEvents='box-none'
      style={styles.container}
      testID='DialogKeyboardAvoidingView'
    >
      <View pointerEvents='box-none' style={styles.viewport}>
        <ScrollView
          nestedScrollEnabled
          bounces={false}
          contentInsetAdjustmentBehavior='never'
          keyboardShouldPersistTaps='handled'
          overScrollMode='never'
          ref={scrollRef}
          scrollEnabled={isScrollEnabled}
          style={styles.scroll}
          testID='DialogScrollView'
          onContentSizeChange={(_, height) => setContentHeight(height)}
          onLayout={({ nativeEvent }) =>
            setViewportHeight(nativeEvent.layout.height)
          }
        >
          <ScrollViewContext.Provider value={null}>
            {children}
          </ScrollViewContext.Provider>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create(({ semantic }, rt) => ({
  container: { flex: 1 },
  viewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Math.max(rt.insets.top, semantic.dimension.size[450]),
    paddingBottom: Math.max(rt.insets.bottom, semantic.dimension.size[450]),
  },
  scroll: { flexGrow: 0, flexShrink: 1 },
}))
