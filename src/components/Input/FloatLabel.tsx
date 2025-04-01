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
  Pressable,
  StyleSheet,
  type TextInput,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { makeStyles } from '../../utils/makeStyles'

import { InputTextBase, type InputTextBaseProps } from './InputTextBase'

export interface FloatLabelProps extends InputTextBaseProps {
  /** Текст плейсхолдера */
  placeholder: string
  /** Показать индикатор загрузки в поле */
  loading?: boolean
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
}

/**
 * Компонент для ввода текста с плавающим плейсхолдером
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=2168-9279
 * @see InputTextBaseProps
 */
export const FloatLabel = memo<FloatLabelProps>(
  ({
    style,
    onChangeText: onChangeTextProp,
    multiline,
    disabled,
    state,
    inputRef: inputRefProp,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    value: valueProp,
    placeholder,
    ...otherProps
  }) => {
    const styles = useStyles()
    const labelAnimation = useSharedValue(0)
    const labelColorAnimation = useSharedValue(0)
    const [focused, setFocused] = useState(false)
    const [valueState, setValueState] = useState('')
    const inputRef = useRef<TextInput>(null)

    const value = useMemo(
      () => valueProp ?? valueState,
      [valueProp, valueState]
    )

    useEffect(() => {
      labelAnimation.value = withTiming(focused || value ? 1 : 0, {
        duration: 100,
      })
    }, [focused, labelAnimation, value])

    useEffect(() => {
      labelColorAnimation.value = withTiming(
        focused && state !== 'danger' ? 1 : 0,
        { duration: 100 }
      )
    }, [focused, labelColorAnimation, state])

    const labelAnimatedStyle = useAnimatedStyle(() => {
      const labelBaseStyles = value
        ? styles.labelReducedAnimatedStyles
        : styles.labelAnimatedStyles

      return {
        top: interpolate(
          labelAnimation.value,
          [0, 1],
          [labelBaseStyles.top, styles.labelReducedAnimatedStyles.top]
        ),
        fontSize: interpolate(
          labelAnimation.value,
          [0, 1],
          [labelBaseStyles.fontSize, styles.labelReducedAnimatedStyles.top]
        ),
        opacity: interpolate(
          labelAnimation.value,
          [0, 1],
          [labelBaseStyles.opacity, styles.labelReducedAnimatedStyles.opacity]
        ),
        color: interpolateColor(
          labelColorAnimation.value,
          [0, 1],
          [styles.label.color, styles.labelFocused.color]
        ),
      }
    })

    const onContainerPress = useCallback(() => {
      inputRef.current?.focus()
    }, [])

    const onFocus = useCallback<NonNullable<TextInputProps['onBlur']>>(
      (event) => {
        setFocused(true)
        onFocusProp?.(event)
      },
      [onFocusProp]
    )

    const onBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
      (event) => {
        setFocused(false)
        onBlurProp?.(event)
      },
      [onBlurProp]
    )

    const onChangeText = useCallback<
      NonNullable<TextInputProps['onChangeText']>
    >(
      (nextValue) => {
        setValueState(nextValue)
        onChangeTextProp?.(nextValue)
      },
      [onChangeTextProp]
    )

    useImperativeHandle(inputRefProp, () => inputRef.current, [])

    return (
      <Pressable
        disabled={disabled}
        style={style}
        testID='FloatLabel_PressableContainer'
        onPress={onContainerPress}
      >
        <InputTextBase
          {...otherProps}
          containerStyle={StyleSheet.flatten([
            styles.inputContainer,
            multiline && styles.multilineInputContainer,
          ])}
          disabled={disabled}
          inputRef={inputRef}
          inputStyle={StyleSheet.flatten([
            styles.input,
            multiline && styles.multilineInput,
          ])}
          multiline={multiline}
          placeholder=''
          state={state}
          testID='FloatLabel_InputTextBase'
          value={value}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {placeholder}
        </Animated.Text>
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ spacing, typography }) => ({
  inputContainer: { height: 56 },
  multilineInputContainer: { height: 120 },
  input: { paddingTop: 26, paddingBottom: 13 },
  multilineInput: {
    marginTop: 26,
    marginBottom: 13,
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: spacing.Padding['p-1'],
    left: 10.5,
    color: typography.Color.Common['text-color-secondary'],
  },
  labelAnimatedStyles: { top: 20, fontSize: 14, opacity: 0.6 },
  labelReducedAnimatedStyles: { top: 10.5, fontSize: 12.25, opacity: 1 },
  labelFocused: { color: typography.Color.Common['text-primary'] },
}))
