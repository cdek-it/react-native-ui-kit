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
  Text,
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../../hooks/useLoadingRotationAnimation'
import { useMakeTestId } from '../../../hooks/useMakeTestId'

import { InputTextBaseTestId } from './testIds'
import type { InputTextBaseProps, RenderTextInputArgs } from './types'
import { useStyles } from './useStyles'

interface PrivateInputTextBaseProps {
  loading?: boolean
}

/**
 * Базовое поле
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5470&m=dev
 * @see InputText
 */
export const InputTextBase = memo<
  InputTextBaseProps & PrivateInputTextBaseProps
>(
  // eslint-disable-next-line max-lines-per-function
  ({
    state,
    clearable = true,
    secureTextEntry: secureTextEntryProp = false,
    inputRef: propsInputRef,
    disabled,
    containerStyle,
    loading,
    renderTextInput,
    clearButtonAccessibilityLabel,
    floatLabel = false,
    placeholder,
    ...otherProps
  }) => {
    const styles = useStyles()
    const inputRef = useRef<TextInput>(null)

    const [valueState, setValueState] = useState('')
    const [isFocused, setIsFocused] = useState(otherProps.autoFocus || false)
    const labelAnimation = useSharedValue(0)

    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(true)
        otherProps.onFocus?.(e)
      },
      [otherProps]
    )

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false)
        otherProps.onBlur?.(e)
      },
      [otherProps]
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

    const onContainerPress = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const loadingAnimatedStyle = useLoadingRotationAnimation(loading)

    const labelAnimatedStyle = useAnimatedStyle(() => ({
      top: interpolate(
        labelAnimation.value,
        [0, 1],
        [styles.label.top, styles.labelReducedSize.top]
      ),
      paddingVertical: interpolate(
        labelAnimation.value,
        [0, 1],
        [styles.label.paddingVertical, styles.labelReducedSize.paddingVertical]
      ),
      fontSize: interpolate(
        labelAnimation.value,
        [0, 1],
        [styles.label.fontSize, styles.labelReducedSize.fontSize]
      ),
      fontFamily:
        labelAnimation.value > 0.5
          ? styles.labelReducedSize.fontFamily
          : styles.label.fontFamily,
    }))

    useEffect(() => {
      labelAnimation.value = withTiming(isFocused || value ? 1 : 0, {
        duration: 100,
      })
    }, [isFocused, labelAnimation, value])

    const iconSize = useMemo(
      () => (floatLabel ? styles.iconSizeFloatLabel : styles.iconSize),
      [floatLabel, styles.iconSize, styles.iconSizeFloatLabel]
    )

    useImperativeHandle(
      propsInputRef,
      () => (inputRef.current ? inputRef.current : null) as TextInput,
      [inputRef]
    )

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
        ...otherProps,
        allowFontScaling: floatLabel ? false : otherProps.allowFontScaling,
        placeholder: '',
        testID: makeTestId(),
        editable: !disabled,
        secureTextEntry,
        style: [
          styles.inputFont,
          floatLabel ? styles.floatLabelInput : styles.input,
        ],
        inputRef,
        value,
        onBlur,
        onChangeText,
        onFocus,
      }),
      [
        otherProps,
        floatLabel,
        makeTestId,
        disabled,
        secureTextEntry,
        styles.floatLabelInput,
        styles.inputFont,
        styles.input,
        value,
        onBlur,
        onChangeText,
        onFocus,
      ]
    )

    const input = useMemo(
      () =>
        renderTextInput ? (
          renderTextInput(texInputProps)
        ) : (
          <TextInput {...texInputProps} ref={inputRef} />
        ),
      [renderTextInput, texInputProps]
    )

    return (
      <Pressable
        accessible={false}
        disabled={disabled}
        style={[
          styles.container,
          floatLabel && styles.containerFloatLabel,
          isFocused && styles.containerFocused,
          containerStyle,
          state === 'danger' && styles.danger,
          state === 'danger' && isFocused && styles.dangerFocused,
          disabled && styles.disabled,
        ]}
        testID={makeTestId(InputTextBaseTestId.pressableContainer)}
        onPress={onContainerPress}
      >
        {floatLabel ? (
          <>
            <Animated.Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.label, labelAnimatedStyle]}
              testID={makeTestId(InputTextBaseTestId.floatingPlaceholder)}
            >
              {placeholder}
            </Animated.Text>

            {input}
          </>
        ) : (
          <View style={styles.inputContainer}>
            <Text
              pointerEvents='none'
              style={[
                styles.inputFont,
                styles.placeholder,
                styles.placeholderTextColor,
                otherProps.placeholderTextColor && {
                  color: otherProps.placeholderTextColor,
                },
                value && styles.hidden,
              ]}
              testID={makeTestId(InputTextBaseTestId.placeholder)}
            >
              {placeholder}
            </Text>

            {input}
          </View>
        )}

        <View style={styles.rightContainer}>
          {loading ? (
            <Animated.View
              style={loadingAnimatedStyle}
              testID={makeTestId(InputTextBaseTestId.loading)}
            >
              <IconLoader2
                color={styles.rightIcon.color}
                height={iconSize.height}
                width={iconSize.width}
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
                height={iconSize.height}
                width={iconSize.width}
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
                  height={iconSize.height}
                  width={iconSize.width}
                />
              ) : (
                <IconEyeOff
                  color={styles.rightIcon.color}
                  height={iconSize.height}
                  width={iconSize.width}
                />
              )}
            </TouchableOpacity>
          ) : null}

          {disabled ? (
            <IconLock
              color={styles.rightIcon.color}
              height={iconSize.height}
              testID={makeTestId(InputTextBaseTestId.disabledIcon)}
              width={iconSize.width}
            />
          ) : null}
        </View>
      </Pressable>
    )
  }
)
