import { memo } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useMakeTestId } from '../../../../hooks/useMakeTestId'
import { useInputTextController } from '../../core/useInputTextController'
import { usePlaceholderLayout } from '../../core/usePlaceholderLayout'

import { InputTextRightContent } from './InputTextRightContent'
import { InputTextBaseTestId } from './testIds'
import type {
  InputTextCoreProps,
  InputTextPrivateProps,
  RenderTextInputArgs,
} from './types'
import {
  inputStyles as styles,
  useInputContainerMinHeightStyle,
} from './useInputStyles'
import { useLegacyFloatingLabel } from './useLegacyFloatingLabel'

export const InputTextBase = memo<InputTextCoreProps & InputTextPrivateProps>(
  ({
    state,
    clearable = true,
    inputRef,
    disabled = false,
    containerStyle,
    loading,
    renderTextInput,
    renderRightAccessory,
    clearButtonAccessibilityLabel,
    floatLabel = false,
    placeholder,
    editable: editableProp = true,
    readOnly: readOnlyProp = false,
    size,
    ...otherProps
    // eslint-disable-next-line complexity -- Независимые состояния поля централизованно собираются перед рендером
  }) => {
    const controller = useInputTextController({ ...otherProps, inputRef })
    const readOnly = disabled || readOnlyProp || !editableProp
    const editable = !readOnly
    const danger = state === 'danger'
    const showClearButton = clearable && !!controller.value.length && editable
    const hasRightContent =
      loading || showClearButton || renderRightAccessory || disabled
    const containerMinHeightStyle = useInputContainerMinHeightStyle(size)
    const floatingLabel = useLegacyFloatingLabel(
      controller.isFocused || !!controller.value,
      otherProps
    )
    const placeholderLayout = usePlaceholderLayout()
    const { makeTestId } = useMakeTestId(
      otherProps.testID || InputTextBaseTestId.default
    )

    const textInputProps: RenderTextInputArgs = {
      ...otherProps,
      accessibilityLabel: otherProps.accessibilityLabel ?? placeholder,
      accessibilityState: { ...otherProps.accessibilityState, disabled },
      placeholder: '',
      testID: makeTestId(),
      editable,
      readOnly,
      style: [
        styles.inputFont,
        floatLabel ? styles.floatLabelInput : styles.input,
        floatLabel && { paddingTop: floatingLabel.inputPaddingTop },
        hasRightContent && styles.inputWithRightContent,
      ],
      inputRef: controller.inputRef,
      value: controller.value,
      onBlur: controller.onBlur,
      onChangeText: controller.onChangeText,
      onFocus: controller.onFocus,
    }
    const input = renderTextInput ? (
      renderTextInput(textInputProps)
    ) : (
      <TextInput {...textInputProps} ref={controller.inputRef} />
    )
    const visualLabelProps = {
      accessible: false,
      accessibilityElementsHidden: true,
      importantForAccessibility: 'no-hide-descendants' as const,
      allowFontScaling: otherProps.allowFontScaling,
      maxFontSizeMultiplier: otherProps.maxFontSizeMultiplier,
    }

    return (
      <Pressable
        accessible={false}
        disabled={disabled}
        style={[
          styles.container,
          containerMinHeightStyle,
          floatLabel && styles.containerFloatLabel,
          controller.isFocused && styles.containerFocused,
          containerStyle,
          danger && styles.danger,
          disabled && styles.disabled,
        ]}
        testID={makeTestId(InputTextBaseTestId.pressableContainer)}
        onPress={controller.focus}
      >
        <View
          style={[
            styles.inputContainer,
            !floatLabel && { minHeight: placeholderLayout.minHeight },
          ]}
          onLayout={floatLabel ? floatingLabel.onContainerLayout : undefined}
        >
          {floatLabel ? (
            <Animated.Text
              {...visualLabelProps}
              style={[styles.label, floatingLabel.animatedStyle]}
              testID={makeTestId(InputTextBaseTestId.floatingPlaceholder)}
              onLayout={floatingLabel.onLabelLayout}
            >
              {placeholder}
            </Animated.Text>
          ) : (
            <Text
              {...visualLabelProps}
              pointerEvents='none'
              style={[
                styles.inputFont,
                styles.placeholder,
                styles.placeholderTextColor,
                otherProps.placeholderTextColor && {
                  color: otherProps.placeholderTextColor,
                },
                controller.value && styles.hidden,
              ]}
              testID={makeTestId(InputTextBaseTestId.placeholder)}
              onLayout={placeholderLayout.onLayout}
            >
              {placeholder}
            </Text>
          )}

          {input}
        </View>

        {hasRightContent ? (
          <InputTextRightContent
            clearButtonAccessibilityLabel={clearButtonAccessibilityLabel}
            disabled={disabled}
            hasFloatingLabel={floatLabel}
            loading={loading}
            makeTestId={makeTestId}
            renderRightAccessory={renderRightAccessory}
            showClearButton={showClearButton}
            onClear={controller.clear}
          />
        ) : null}
      </Pressable>
    )
  }
)
