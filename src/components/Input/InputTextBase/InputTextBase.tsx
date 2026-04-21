/* eslint-disable max-lines */

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
  type FocusEvent,
  type BlurEvent,
  TouchableOpacity,
  Pressable,
  type Insets,
} from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../../hooks/useLoadingRotationAnimation'
import { useMakeTestId } from '../../../hooks/useMakeTestId'
import type { ThemeType } from '../../../theme/types'
import { SvgUniversal } from '../../../utils/SvgUniversal'

import { InputTextBaseTestId } from './testIds'
import type { InputTextBaseProps, RenderTextInputArgs } from './types'
import { inputStyles, useInputContainerMinHeight } from './useInputStyles'

interface PrivateInputTextBaseProps {
  loading?: boolean
}

/**
 * Базовое поле
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5470&m=dev
 * @see InputText
 */
const inputIconUniProps = ({ theme }: ThemeType) => ({
  color: theme.Form.InputText.inputIconColor,
})

export const InputTextBase = memo<
  InputTextBaseProps & PrivateInputTextBaseProps
>(
  // eslint-disable-next-line max-lines-per-function, max-statements
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
    editable = true,
    size,
    ...otherProps
    // TODO: разделить float label и обычный инпут -> добавить во float label поддержку font scale
    // eslint-disable-next-line complexity
  }) => {
    const styles = inputStyles
    const containerMinHeightStyle = useInputContainerMinHeight(size)
    const inputRef = useRef<TextInput>(null)

    const [valueState, setValueState] = useState('')
    const [isFocused, setIsFocused] = useState(otherProps.autoFocus || false)
    const labelAnimation = useSharedValue(0)

    const propsOnFocus = otherProps.onFocus
    const propsOnBlur = otherProps.onBlur
    const propsOnChangeText = otherProps.onChangeText

    const onFocus = useCallback(
      (e: FocusEvent) => {
        setIsFocused(true)
        propsOnFocus?.(e)
      },
      [propsOnFocus]
    )

    const onBlur = useCallback(
      (e: BlurEvent) => {
        setIsFocused(false)
        propsOnBlur?.(e)
      },
      [propsOnBlur]
    )

    const onChangeText = useCallback(
      (nextValue: string) => {
        propsOnChangeText?.(nextValue)
        setValueState(nextValue)
      },
      [propsOnChangeText]
    )

    const clear = useCallback(() => {
      onChangeText('')
    }, [onChangeText])

    const value = useMemo(
      () => otherProps.value ?? valueState,
      [otherProps.value, valueState]
    )

    const showClearButton = useMemo(
      () => clearable && !!value.length && !disabled,
      [clearable, disabled, value.length]
    )

    const onContainerPress = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const loadingAnimatedStyle = useLoadingRotationAnimation(loading)

    // Extract primitive values before the worklet closure to avoid
    // capturing the unistyles HostObject (non-serializable) in the worklet.
    const labelTop = styles.label.top
    const labelReducedTop = styles.labelReducedSize.top
    const labelPaddingVertical = styles.label.paddingVertical
    const labelReducedPaddingVertical = styles.labelReducedSize.paddingVertical
    const labelFontSize = styles.label.fontSize
    const labelReducedFontSize = styles.labelReducedSize.fontSize
    const labelFontFamily = styles.label.fontFamily
    const labelReducedFontFamily = styles.labelReducedSize.fontFamily

    const labelAnimatedStyle = useAnimatedStyle(() => ({
      top: interpolate(
        labelAnimation.value,
        [0, 1],
        [labelTop, labelReducedTop]
      ),
      paddingVertical: interpolate(
        labelAnimation.value,
        [0, 1],
        [labelPaddingVertical, labelReducedPaddingVertical]
      ),
      fontSize: interpolate(
        labelAnimation.value,
        [0, 1],
        [labelFontSize, labelReducedFontSize]
      ),
      fontFamily:
        labelAnimation.value > 0.5 ? labelReducedFontFamily : labelFontFamily,
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

    useImperativeHandle<TextInput | null, TextInput | null>(
      propsInputRef,
      () =>
        inputRef.current ? Object.assign(inputRef.current, { clear }) : null,
      [inputRef, clear]
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

    const showSecureToggle = secureTextEntryProp === 'toggleable'
    const hasRightContent =
      loading || showClearButton || showSecureToggle || disabled

    const isOnlyButton = useMemo(() => {
      return (
        [showClearButton, showSecureToggle].filter((val) => val).length === 1
      )
    }, [showClearButton, showSecureToggle])

    const rightButtonHitSlop = useMemo<Insets>(
      () => ({
        // Большие вертикальные отступы (100) - чтобы компенсировать возможное
        // растягивание инпута по вертикали, при этом область тапа
        // гарантированно не выйдет за пределы инпута
        top: 100,
        bottom: 100,
        left: isOnlyButton
          ? styles.rightContainer.gap
          : styles.rightContainer.gap / 2,
        right: isOnlyButton
          ? styles.rightContainer.gap
          : styles.rightContainer.gap / 2,
      }),
      [styles.rightContainer.gap, isOnlyButton]
    )

    const texInputProps = useMemo<RenderTextInputArgs>(
      () => ({
        ...otherProps,
        allowFontScaling: floatLabel ? false : otherProps.allowFontScaling,
        placeholder: '',
        testID: makeTestId(),
        editable: disabled ? false : editable,
        secureTextEntry,
        style: [
          styles.inputFont,
          floatLabel ? styles.floatLabelInput : styles.input,
          hasRightContent && styles.inputWithRightContent,
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
        editable,
        secureTextEntry,
        hasRightContent,
        value,
        onBlur,
        onChangeText,
        onFocus,
        styles.inputFont,
        styles.floatLabelInput,
        styles.input,
        styles.inputWithRightContent,
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
          containerMinHeightStyle,
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

        {hasRightContent ? (
          <View style={styles.rightContainer}>
            {loading ? (
              <Animated.View
                style={[styles.rightButtonContainer, loadingAnimatedStyle]}
                testID={makeTestId(InputTextBaseTestId.loading)}
              >
                <SvgUniversal
                  {...iconSize}
                  source={IconLoader2}
                  uniProps={inputIconUniProps}
                />
              </Animated.View>
            ) : null}

            {showClearButton ? (
              <TouchableOpacity
                accessibilityLabel={clearButtonAccessibilityLabel}
                hitSlop={rightButtonHitSlop}
                style={styles.rightButtonContainer}
                testID={makeTestId(InputTextBaseTestId.clearButton)}
                onPress={clear}
              >
                <SvgUniversal
                  {...iconSize}
                  source={IconX}
                  uniProps={inputIconUniProps}
                />
              </TouchableOpacity>
            ) : null}

            {showSecureToggle ? (
              <TouchableOpacity
                hitSlop={rightButtonHitSlop}
                style={styles.rightButtonContainer}
                testID={makeTestId(InputTextBaseTestId.secureInputButton)}
                onPress={toggleUserDefinedSecureTextEntry}
              >
                <SvgUniversal
                  {...iconSize}
                  source={userDefinedSecureTextEntry ? IconEye : IconEyeOff}
                  uniProps={inputIconUniProps}
                />
              </TouchableOpacity>
            ) : null}

            {disabled ? (
              <SvgUniversal
                {...iconSize}
                source={IconLock}
                testID={makeTestId(InputTextBaseTestId.disabledIcon)}
                uniProps={inputIconUniProps}
              />
            ) : null}
          </View>
        ) : null}
      </Pressable>
    )
  }
)
