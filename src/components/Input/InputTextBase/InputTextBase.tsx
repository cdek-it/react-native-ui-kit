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
import Animated from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../../hooks/useLoadingRotationAnimation'
import { useMakeTestId } from '../../../hooks/useMakeTestId'

import { Outlines, type OutlinesRef } from './Outlines'
import { InputTextBaseTestId } from './testIds'
import type { InputTextBaseProps, RenderTextInputArgs } from './types'
import { useStyles } from './useStyles'

interface PrivateInputTextBaseProps {
  inputStyle?: ViewStyle
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
    const outlineRef = useRef<OutlinesRef>(null)
    const [valueState, setValueState] = useState('')

    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        outlineRef.current?.focus()
        otherProps.onFocus?.(e)
      },
      [otherProps]
    )

    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        outlineRef.current?.blur()
        otherProps.onBlur?.(e)
      },
      [otherProps]
    )

    useEffect(() => {
      outlineRef.current?.setDanger(state === 'danger')
    }, [state])

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

    const loadingAnimatedStyle = useLoadingRotationAnimation(loading)

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
        <Outlines
          baseBorderRadius={styles.container.borderRadius}
          containerStyle={containerStyle}
          disabled={disabled}
          makeTestId={makeTestId}
          ref={outlineRef}
        />
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
