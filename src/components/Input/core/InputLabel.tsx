import { IconInfoCircle } from '@tabler/icons-react-native'
import { Pressable, Text, View, type TextInputProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { SvgUniversal } from '../../../utils/SvgUniversal'

import { inputStrings } from './strings'
import { styles } from './styles'
import type { InputLabelInfo } from './types'
import type { useFloatingLabel } from './useFloatingLabel'
import { useInputFontScale } from './useInputFontScale'

interface InputLabelProps extends Pick<
  TextInputProps,
  'allowFontScaling' | 'maxFontSizeMultiplier'
> {
  readonly label: string
  readonly labelInfo?: InputLabelInfo
  readonly disabled?: boolean
  readonly isRequired?: boolean
  readonly isDanger?: boolean
  readonly floating?: ReturnType<typeof useFloatingLabel>
  readonly hasActions?: boolean
  readonly infoTestID?: string
  readonly testID?: string
}

export const InputLabel = ({
  label,
  labelInfo,
  disabled = false,
  isRequired,
  isDanger = false,
  floating,
  hasActions = false,
  infoTestID,
  testID,
  ...textProps
}: InputLabelProps) => {
  const fontScale = useInputFontScale(textProps)
  const content = (
    <>
      {floating ? (
        <>
          {isRequired ? (
            <Animated.Text
              {...textProps}
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              pointerEvents='none'
              style={[
                styles.floatText(isDanger, true),
                floating.animatedTextStyle,
              ]}
            >
              *
            </Animated.Text>
          ) : null}
          <Animated.Text
            {...textProps}
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility='no-hide-descendants'
            numberOfLines={floating.fontScale > 1 ? undefined : 1}
            pointerEvents='none'
            style={[styles.floatText(isDanger), floating.animatedTextStyle]}
          >
            {label}
          </Animated.Text>
        </>
      ) : (
        <>
          {isRequired ? (
            <Text
              key={`Required${fontScale}`}
              {...textProps}
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              pointerEvents='none'
              style={[styles.label, styles.required, styles.labelRequired]}
            >
              *
            </Text>
          ) : null}
          <Text
            // Native Text сохраняет старые метрики строки после смены Dynamic Type
            key={`Label${fontScale}`}
            {...textProps}
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility='no-hide-descendants'
            pointerEvents='none'
            style={styles.label}
          >
            {label}
          </Text>
        </>
      )}
      {labelInfo ? (
        <View style={[styles.labelInfo, floating && styles.floatLabelInfo]}>
          <SvgUniversal
            accessible={false}
            source={IconInfoCircle}
            uniProps={({ semantic }) => ({
              width: semantic.dimension.size[400],
              height: semantic.dimension.size[400],
              color: semantic.colorScheme.color.fg.default,
            })}
          />
        </View>
      ) : null}
    </>
  )

  if (floating) {
    return (
      <Animated.View
        pointerEvents='box-none'
        style={[
          styles.floatLabel,
          {
            left: styles.floatInput.paddingHorizontal,
            right: hasActions
              ? styles.inputWithActions.paddingRight
              : styles.floatInput.paddingHorizontal,
          },
          floating.animatedContainerStyle,
        ]}
        testID={testID}
        onLayout={floating.onLabelLayout}
      >
        {content}
      </Animated.View>
    )
  }

  if (labelInfo) {
    return (
      <Pressable
        accessible
        accessibilityLabel={`${label}. ${labelInfo.accessibilityLabel ?? inputStrings.labelInfoButton}`}
        accessibilityRole='button'
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={styles.labelRow}
        testID={infoTestID}
        onPress={labelInfo.onPress}
      >
        {content}
      </Pressable>
    )
  }

  return (
    <View
      accessibilityElementsHidden
      accessible={false}
      importantForAccessibility='no-hide-descendants'
      style={styles.labelRow}
      testID={testID}
    >
      {content}
    </View>
  )
}
