import { useMemo, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'

import { useMakeTestId } from '../../../hooks/useMakeTestId'
import { InputCaption } from '../InputCaption/InputCaption'
import { InputGroupAddon } from '../InputGroup/InputGroupAddon'

import { InputControl } from './InputControl'
import { InputGroupContext } from './InputGroupContext'
import { InputLabel } from './InputLabel'
import { styles } from './styles'
import type { InputLabelProps, InputNativeProps } from './types'
import { useInputFontScale } from './useInputFontScale'
import { useInputTextController } from './useInputTextController'

type InputFieldProps = InputNativeProps &
  InputLabelProps & {
    readonly leftAddon?: ReactNode
    readonly rightAddon?: ReactNode
    readonly action?: ReactNode
  }

const addonContent = (node: ReactNode) => {
  if (node === '') return null

  return typeof node === 'string' || typeof node === 'number' ? (
    <InputGroupAddon>{node}</InputGroupAddon>
  ) : (
    node
  )
}

const captionContent = (node: ReactNode) => {
  if (node === '') return null

  return typeof node === 'string' || typeof node === 'number' ? (
    <InputCaption>{node}</InputCaption>
  ) : (
    node
  )
}

const frameStyle = ({
  isFocused,
  isFilled,
  isEditable,
  isDanger,
  disabled,
}: {
  isFocused: boolean
  isFilled: boolean
  isEditable: boolean
  isDanger: boolean
  disabled: boolean
}) => [
  styles.frame,
  isFilled && styles.filled,
  isFocused && styles.focused,
  isFilled && isFocused && styles.filledFocused,
  !isEditable && !disabled && styles.readOnly,
  isDanger && styles.danger,
  isDanger && isFocused && styles.dangerFocused,
  disabled && styles.disabled,
]

export const InputField = ({
  label,
  floatLabel,
  labelInfo,
  caption,
  required,
  size = 'base',
  state = 'default',
  disabled = false,
  clearable = true,
  ref,
  style,
  inputStyle,
  renderTextInput,
  leftAddon,
  rightAddon,
  action,
  readOnly = false,
  testID = 'InputText',
  ...nativeProps
}: InputFieldProps) => {
  const controller = useInputTextController({ ...nativeProps, inputRef: ref })
  const isEditable = !disabled && !readOnly
  const floating = floatLabel !== undefined
  const fontScale = useInputFontScale(nativeProps)
  const labelText = floatLabel ?? label
  const danger = state === 'danger'
  const { makeTestId } = useMakeTestId(testID)
  const leftContext = useMemo(
    () => ({ disabled, size, state, position: 'left' as const }),
    [disabled, size, state]
  )
  const rightContext = useMemo(
    () => ({ disabled, size, state, position: 'right' as const }),
    [disabled, size, state]
  )

  return (
    <View style={[styles.root, style]}>
      {label ? (
        <InputLabel
          allowFontScaling={nativeProps.allowFontScaling}
          disabled={disabled}
          infoTestID={makeTestId('LabelInfo')}
          isDanger={danger}
          isRequired={required}
          label={label}
          labelInfo={labelInfo}
          maxFontSizeMultiplier={nativeProps.maxFontSizeMultiplier}
        />
      ) : null}
      <Pressable
        accessible={false}
        disabled={disabled}
        pointerEvents={disabled ? 'none' : 'auto'}
        style={[
          frameStyle({
            isFocused: controller.isFocused,
            isFilled: floating && !!controller.value,
            isEditable,
            isDanger: danger,
            disabled,
          }),
          floating && styles.floatingFrame(fontScale),
        ]}
        testID={makeTestId('Frame')}
        onPress={controller.focus}
      >
        <View style={[styles.frameClip, floating && styles.floatingFrameClip]}>
          <InputGroupContext.Provider value={leftContext}>
            {addonContent(leftAddon)}
          </InputGroupContext.Provider>
          <InputControl
            action={action}
            clearable={clearable}
            controller={controller}
            disabled={disabled}
            inputStyle={inputStyle}
            isDanger={danger}
            isEditable={isEditable}
            isFloating={floating}
            label={labelText}
            nativeProps={nativeProps}
            renderTextInput={renderTextInput}
            required={required}
            size={size}
            testID={testID}
          />
          <InputGroupContext.Provider value={rightContext}>
            {addonContent(rightAddon)}
          </InputGroupContext.Provider>
        </View>
      </Pressable>
      {captionContent(caption)}
    </View>
  )
}
