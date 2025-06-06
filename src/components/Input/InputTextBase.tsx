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
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../hooks/useLoadingRotationAnimation'
import { useMakeTestId } from '../../hooks/useMakeTestId'
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
  /** Озвучка для кнопки очистки поля */
  clearButtonAccessibilityLabel?: string
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

const withOutlineAnimation = (toValue: number) =>
  withTiming(toValue, { duration: 100 })

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
    clearButtonAccessibilityLabel,
    ...otherProps
  }) => {
    const styles = useStyles()
    const inputRef = useRef<TextInput>(null)
    const focusOutlineWidth = useSharedValue(0)
    const dangerOutlineWidth = useSharedValue(0)
    const [valueState, setValueState] = useState('')

    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusOutlineWidth.value = withOutlineAnimation(
          -styles.outlineWidth.borderWidth
        )
        otherProps.onFocus?.(e)
      },
      [focusOutlineWidth, otherProps, styles.outlineWidth.borderWidth]
    )

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusOutlineWidth.value = withOutlineAnimation(0)
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
      dangerOutlineWidth.value = withOutlineAnimation(
        state === 'danger' ? -styles.outlineWidth.borderWidth : 0
      )
    }, [dangerOutlineWidth, state, styles.outlineWidth.borderWidth])

    useImperativeHandle(propsInputRef, () => inputRef.current)

    const { makeTestId } = useMakeTestId(
      otherProps.testID || InputTextBaseTestId.default
    )

    const texInputProps = useMemo<RenderTextInputArgs>(
      () => ({
        placeholderTextColor: styles.placeholderTextColor.color,
        ...otherProps,
        testID: makeTestId(),
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
        makeTestId,
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
                testID={makeTestId(InputTextBaseTestId.loading)}
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
                accessibilityLabel={clearButtonAccessibilityLabel}
                testID={makeTestId(InputTextBaseTestId.clearButton)}
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
                testID={makeTestId(InputTextBaseTestId.disabledIcon)}
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

export const InputTextBaseTestId = {
  default: 'InputTextBase',
  focusOutline: 'FocusOutline',
  dangerOutline: 'DangerOutline',
  loading: 'Loading',
  clearButton: 'ClearButton',
  disabledIcon: 'DisabledIcon',
}
