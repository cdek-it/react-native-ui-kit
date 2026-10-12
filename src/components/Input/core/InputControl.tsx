import type { ReactNode } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'

import { useMakeTestId } from '../../../hooks/useMakeTestId'

import { InputActions } from './InputActions'
import { InputLabel } from './InputLabel'
import { InputPlaceholder } from './InputPlaceholder'
import { styles } from './styles'
import type {
  InputLabelProps,
  InputNativeProps,
  RenderTextInputArgs,
} from './types'
import { useFloatingLabel } from './useFloatingLabel'
import type { useInputTextController } from './useInputTextController'
import { usePlaceholderLayout } from './usePlaceholderLayout'

type InputControlProps = Pick<
  InputNativeProps & InputLabelProps,
  | 'label'
  | 'required'
  | 'size'
  | 'disabled'
  | 'clearable'
  | 'inputStyle'
  | 'renderTextInput'
> & {
  readonly controller: ReturnType<typeof useInputTextController>
  readonly nativeProps: TextInputProps
  readonly isEditable: boolean
  readonly isFloating: boolean
  readonly isDanger: boolean
  readonly testID: string
  readonly action?: ReactNode
}

const renderNativeInput = ({ inputRef, ...props }: RenderTextInputArgs) => (
  <TextInput {...props} ref={inputRef} />
)

export const InputControl = ({
  label,
  required,
  size = 'base',
  disabled,
  clearable,
  inputStyle,
  renderTextInput,
  controller,
  nativeProps,
  isEditable,
  isFloating,
  isDanger,
  testID,
  action,
}: InputControlProps) => {
  const { makeTestId } = useMakeTestId(testID)
  const active = controller.isFocused || !!controller.value
  const isClearVisible = !!clearable && !!controller.value && isEditable
  const hasActions = isClearVisible || !!action
  const placeholderLayout = usePlaceholderLayout()
  const floatText = styles.floatText(isDanger, size)
  const floatingLabel = useFloatingLabel(active, nativeProps, {
    labelTop: styles.floatLabel.top,
    reducedTop: styles[size].paddingVertical,
    labelPadding: styles.floatLabel.paddingVertical,
    reducedPadding: styles.floatReduced.paddingVertical,
    fontSize: floatText.fontSize,
    reducedFontSize: styles.floatReduced.fontSize,
    fontFamily: floatText.fontFamily,
    reducedFontFamily: styles.floatReduced.fontFamily,
    inputPaddingTop: styles.floatInput.paddingTop,
  })
  const textStyle = [
    styles.input,
    styles[size],
    hasActions && styles.inputWithActions,
    disabled && styles.disabledText,
    isFloating && styles.floatInput,
    isFloating && { paddingTop: floatingLabel.inputPaddingTop },
    inputStyle,
  ]
  const textInputProps: RenderTextInputArgs = {
    ...nativeProps,
    accessibilityLabel:
      nativeProps.accessibilityLabel ?? label ?? nativeProps.placeholder,
    accessibilityState: { ...nativeProps.accessibilityState, disabled },
    editable: isEditable,
    readOnly: !isEditable,
    placeholder: '',
    testID,
    style: textStyle,
    value: controller.value,
    inputRef: controller.inputRef,
    onFocus: controller.onFocus,
    onBlur: controller.onBlur,
    onChangeText: controller.onChangeText,
  }

  return (
    <View style={[styles.control, isFloating && styles.floatControl]}>
      <View
        style={[
          styles.inputContainer,
          isFloating ? undefined : { minHeight: placeholderLayout.minHeight },
        ]}
        onLayout={isFloating ? floatingLabel.onContainerLayout : undefined}
      >
        {isFloating && label ? (
          <InputLabel
            allowFontScaling={nativeProps.allowFontScaling}
            floating={floatingLabel}
            hasActions={hasActions}
            isDanger={isDanger}
            isRequired={required}
            label={label}
            maxFontSizeMultiplier={nativeProps.maxFontSizeMultiplier}
            size={size}
            testID={makeTestId('FloatingLabel')}
          />
        ) : null}
        <InputPlaceholder
          isDanger={isDanger}
          isHidden={!!controller.value || (isFloating && !active)}
          nativeProps={nativeProps}
          style={textStyle}
          testID={makeTestId('Placeholder')}
          onLayout={isFloating ? undefined : placeholderLayout.onLayout}
        />
        {(renderTextInput ?? renderNativeInput)(textInputProps)}
      </View>
      {hasActions ? (
        <InputActions
          isClearVisible={isClearVisible}
          size={size}
          testID={makeTestId('ClearButton')}
          onClear={controller.clear}
        >
          {action}
        </InputActions>
      ) : null}
    </View>
  )
}
