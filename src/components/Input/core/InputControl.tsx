import { IconX } from '@tabler/icons-react-native'
import type { ReactNode } from 'react'
import { TextInput, View, type TextInputProps } from 'react-native'

import { useMakeTestId } from '../../../hooks/useMakeTestId'

import { InputIconButton } from './InputIconButton'
import { InputLabel } from './InputLabel'
import { InputPlaceholder } from './InputPlaceholder'
import { InputTrailingContent } from './InputTrailingContent'
import { inputStrings } from './strings'
import { styles } from './styles'
import type {
  InputLabelProps,
  InputNativeProps,
  InputVisualVariant,
  RenderTextInputArgs,
} from './types'
import { useFloatingLabel } from './useFloatingLabel'
import type { useInputTextController } from './useInputTextController'
import { usePlaceholderLayout } from './usePlaceholderLayout'

type InputControlProps = Pick<
  InputNativeProps & InputLabelProps,
  | 'label'
  | 'required'
  | 'disabled'
  | 'clearable'
  | 'inputStyle'
  | 'renderTextInput'
> & {
  readonly controller: ReturnType<typeof useInputTextController>
  readonly nativeProps: TextInputProps
  readonly isEditable: boolean
  readonly variant: InputVisualVariant
  readonly isDanger: boolean
  readonly testID: string
  readonly trailingAction?: ReactNode
}

const renderNativeInput = ({ inputRef, ...props }: RenderTextInputArgs) => (
  <TextInput {...props} ref={inputRef} />
)

// VoiceOver позволяет отключить hint, поэтому обязательность и ошибка входят в имя поля
const getAccessibilityLabel = ({
  nativeProps,
  label,
  required,
  isDanger,
}: Pick<
  InputControlProps,
  'nativeProps' | 'label' | 'required' | 'isDanger'
>) => {
  const name =
    nativeProps['aria-label'] ??
    nativeProps.accessibilityLabel ??
    label ??
    nativeProps.placeholder

  return required || isDanger
    ? [
        name,
        required ? inputStrings.requiredField : undefined,
        isDanger ? inputStrings.fieldError : undefined,
      ]
        .filter(Boolean)
        .join(', ')
    : name
}

export const InputControl = ({
  label,
  required,
  disabled,
  clearable,
  inputStyle,
  renderTextInput,
  controller,
  nativeProps,
  isEditable,
  variant,
  isDanger,
  testID,
  trailingAction,
}: InputControlProps) => {
  const { makeTestId } = useMakeTestId(testID)
  const active = controller.isFocused || !!controller.value
  const isClearVisible = !!clearable && !!controller.value && isEditable
  const isFloating = variant === 'floating'
  const hasActions = isClearVisible || !!trailingAction
  const placeholderLayout = usePlaceholderLayout()
  const floatingLabel = useFloatingLabel(active, nativeProps)
  const textStyle = [
    styles.input,
    isFloating ? styles.floatInput : styles[variant],
    disabled && styles.disabledText,
    hasActions && styles.inputWithActions,
    isFloating && { paddingTop: floatingLabel.inputPaddingTop },
    inputStyle,
  ]
  const { 'aria-label': _ariaLabel, ...inputNativeProps } = nativeProps
  const textInputProps: RenderTextInputArgs = {
    ...inputNativeProps,
    'aria-disabled': disabled,
    accessibilityLabel: getAccessibilityLabel({
      nativeProps,
      label,
      required,
      isDanger,
    }),
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
    <View style={styles.control}>
      <View
        style={[
          styles.inputContainer,
          isFloating && styles.floatingInputContainer,
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
        <InputTrailingContent variant={variant}>
          {isClearVisible ? (
            <InputIconButton
              accessibilityLabel={inputStrings.clearButton}
              getIconColor={({ components }) => components.inputtext.root.color}
              icon={IconX}
              testID={makeTestId('ClearButton')}
              variant={variant}
              onPress={controller.clear}
            />
          ) : null}
          {trailingAction}
        </InputTrailingContent>
      ) : null}
    </View>
  )
}
