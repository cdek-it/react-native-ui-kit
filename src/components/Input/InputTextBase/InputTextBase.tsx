/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import {
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconX,
} from '@tabler/icons-react-native'
import {
  memo,
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
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../../hooks/useLoadingRotationAnimation'
import { useMakeTestId } from '../../../hooks/useMakeTestId'

import { InputTextBaseTestId } from './testIds'
import type { InputTextBaseProps, RenderTextInputArgs } from './types'
import { useStyles } from './useStyles'

interface PrivateInputTextBaseProps {
  inputStyle?: ViewStyle
  loading?: boolean
}

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
    secureTextEntry: secureTextEntryProp = false,
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

    const [userDefinedSecureTextEntry, setUserDefinedSecureTextEntry] =
      useState(true)
    const secureTextEntry = useMemo(
      () =>
        secureTextEntryProp === 'toggleable'
          ? userDefinedSecureTextEntry
          : secureTextEntryProp,
      [secureTextEntryProp, userDefinedSecureTextEntry]
    )
    const toggleUserDefinedSecureTextEntry = useCallback(
      () => setUserDefinedSecureTextEntry((old) => !old),
      []
    )

    const texInputProps = useMemo<RenderTextInputArgs>(
      () => ({
        placeholderTextColor: styles.placeholderTextColor.color,
        ...otherProps,
        testID: makeTestId(),
        editable: !disabled,
        secureTextEntry,
        style: [styles.input, inputStyle],
        inputRef,
        value,
        onBlur,
        onChangeText,
        onFocus,
      }),
      [
        disabled,
        secureTextEntry,
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

            {secureTextEntryProp === 'toggleable' ? (
              <TouchableOpacity
                testID={makeTestId(InputTextBaseTestId.secureInputButton)}
                onPress={toggleUserDefinedSecureTextEntry}
              >
                {userDefinedSecureTextEntry ? (
                  <IconEye
                    color={styles.rightIcon.color}
                    height={styles.iconSize.height}
                    width={styles.iconSize.width}
                  />
                ) : (
                  <IconEyeOff
                    color={styles.rightIcon.color}
                    height={styles.iconSize.height}
                    width={styles.iconSize.width}
                  />
                )}
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
