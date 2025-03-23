import { IconLoader2, IconLock, IconX } from '@tabler/icons-react-native'
import {
  memo,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  TextInput,
  View,
  type TextInputProps,
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native'
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../hooks/useLoadingRotationAnimation'
import { makeStyles } from '../../utils/makeStyles'

interface PrivateInputTextBaseProps {
  inputStyle?: ViewStyle
  loading?: boolean
}

/** @see TextInputProps */
export interface InputTextBaseProps
  extends Omit<TextInputProps, 'style' | 'editable'> {
  /**
   * Управление отображения иконки очистки поля
   * @default true
   */
  clearable?: boolean
  /** Управление стилем контейнера поля ввода */
  containerStyle?: ViewStyle
  /** Управление доступностью поля */
  disabled?: boolean
  /** Ref для управления полем ввода */
  inputRef?: Ref<TextInput | null>
  // Функция для рендера поля ввода.
  // Используется, когда необходимо использовать отличный от стандартного компонент.
  // Например, для реализации масок
  //
  renderTextInput?: (props: RenderTextInputArgs) => ReactNode
  /** Управление состоянием компонента */
  state?: 'default' | 'danger'
}

export type RenderTextInputArgs = TextInputProps & { inputRef: Ref<TextInput> }

/**
 * Базовое поле
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5470&m=dev
 * @see InputText
 */
export const InputTextBase = memo<
  InputTextBaseProps & PrivateInputTextBaseProps
>(
  ({
    state,
    clearable = true,
    inputRef: propsInputRef,
    disabled,
    containerStyle,
    inputStyle,
    loading,
    renderTextInput,
    ...otherProps
  }) => {
    const styles = useStyles()
    const inputRef = useRef<TextInput>(null)
    const focusOutlineWidth = useSharedValue(0)
    const dangerOutlineWidth = useSharedValue(0)
    const [valueState, setValueState] = useState('')

    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusOutlineWidth.value = -styles.outlineWidth.borderWidth
        otherProps.onFocus?.(e)
      },
      [focusOutlineWidth, otherProps, styles.outlineWidth.borderWidth]
    )

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusOutlineWidth.value = 0
        otherProps.onBlur?.(e)
      },
      [focusOutlineWidth, otherProps]
    )

    const onChangeText = useCallback(
      (nextValue: string) => {
        otherProps.onChangeText?.(nextValue)
        setValueState(nextValue)
      },
      [otherProps]
    )

    const clear = useCallback(() => {
      inputRef.current?.clear()
      onChangeText('')
    }, [onChangeText])

    const value = useMemo(
      () => otherProps.value ?? valueState,
      [otherProps.value, valueState]
    )

    const showClearButton = useMemo(
      () => clearable && !!value.length,
      [clearable, value.length]
    )

    const focusOutlineStyles = useAnimatedStyle(() => ({
      top: focusOutlineWidth.value,
      right: focusOutlineWidth.value,
      bottom: focusOutlineWidth.value,
      left: focusOutlineWidth.value,
    }))

    const dangerOutlineStyles = useAnimatedStyle(() => ({
      top: dangerOutlineWidth.value,
      right: dangerOutlineWidth.value,
      bottom: dangerOutlineWidth.value,
      left: dangerOutlineWidth.value,
    }))

    const outlineStyles = useMemo<ViewStyle>(
      () => ({
        borderRadius:
          containerStyle?.borderRadius ?? styles.container.borderRadius,
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
        styles.container.borderRadius,
      ]
    )

    const loadingAnimatedStyle = useLoadingRotationAnimation(loading)

    useEffect(() => {
      dangerOutlineWidth.value =
        state === 'danger' ? -styles.outlineWidth.borderWidth : 0
    }, [dangerOutlineWidth, state, styles.outlineWidth.borderWidth])

    useImperativeHandle(propsInputRef, () => inputRef.current)

    const texInputProps = useMemo<RenderTextInputArgs>(
      () => ({
        placeholderTextColor: styles.placeholderTextColor.color,
        testID: 'InputTextBase_input',
        ...otherProps,
        editable: !disabled,
        style: [styles.input, inputStyle],
        inputRef,
        value,
        onBlur,
        onChangeText,
        onFocus,
      }),
      [
        disabled,
        inputStyle,
        onBlur,
        onChangeText,
        onFocus,
        otherProps,
        styles.input,
        styles.placeholderTextColor.color,
        value,
      ]
    )

    return (
      <>
        {!disabled && (
          <>
            <Animated.View
              layout={LinearTransition.duration(100)}
              style={[
                styles.outline,
                outlineStyles,
                styles.dangerOutline,
                dangerOutlineStyles,
              ]}
              testID='InputTextBase_DangerOutline'
            />
            <Animated.View
              layout={LinearTransition.duration(100)}
              style={[
                styles.outline,
                outlineStyles,
                styles.focusOutline,
                focusOutlineStyles,
              ]}
              testID='InputTextBase_FocusOutline'
            />
          </>
        )}
        <View
          style={[
            styles.container,
            containerStyle,
            state === 'danger' && styles.danger,
            disabled && styles.disabled,
          ]}
        >
          {renderTextInput ? (
            renderTextInput(texInputProps)
          ) : (
            <TextInput {...texInputProps} ref={inputRef} />
          )}

          <View style={styles.rightContainer}>
            {loading ? (
              <Animated.View
                style={loadingAnimatedStyle}
                testID='InputTextBase_Loading'
              >
                <IconLoader2
                  color={styles.rightIcon.color}
                  height={styles.iconSize.height}
                  width={styles.iconSize.width}
                />
              </Animated.View>
            ) : null}

            {showClearButton && !disabled ? (
              <TouchableOpacity
                testID='InputTextBase_ClearButton'
                onPress={clear}
              >
                <IconX
                  color={styles.rightIcon.color}
                  height={styles.iconSize.height}
                  width={styles.iconSize.width}
                />
              </TouchableOpacity>
            ) : null}

            {disabled ? (
              <IconLock
                color={styles.rightIcon.color}
                height={styles.iconSize.height}
                testID='InputTextBase_DisabledIcon'
                width={styles.iconSize.width}
              />
            ) : null}
          </View>
        </View>
      </>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    minHeight: 35,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: theme.General.borderRadius,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Form.InputText.inputBg,
  },
  danger: { borderColor: theme.Form.InputText.inputErrorBorderColor },
  disabled: {
    opacity: 0.6,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
  },
  input: {
    flex: 1,
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    borderRadius: theme.General.borderRadius,
    fontSize: 14,
    color: theme.Form.InputText.inputTextColor,
    overflow: 'hidden',
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  placeholderTextColor: {
    color: theme.Form.InputText.inputPlaceholderTextColor,
  },
  outline: { position: 'absolute' },
  outlineWidth: { borderWidth: theme.General.focusShadowWidth },
  focusOutline: { backgroundColor: theme.General.focusOutlineColor },
  dangerOutline: { backgroundColor: theme.General.focusOutlineErrorColor },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.Form.InputText.inputPaddingLeftRight,
    maxHeight: 54,
    gap: theme.Form.InputText.inputPaddingLeftRight,
    overflow: 'hidden',
  },
  rightIcon: { color: theme.Form.InputText.inputIconColor },
  iconSize: { width: 14, height: 14 },
}))
