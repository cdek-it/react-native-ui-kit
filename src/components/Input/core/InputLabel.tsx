import { IconInfoCircle } from '@tabler/icons-react-native'
import { Pressable, Text, View, type TextInputProps } from 'react-native'
import Animated from 'react-native-reanimated'

import { SvgUniversal } from '../../../utils/SvgUniversal'

import { inputStrings } from './strings'
import { styles } from './styles'
import type { InputLabelInfo, InputTextSize } from './types'
import type { useFloatingLabel } from './useFloatingLabel'

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
  readonly size?: InputTextSize
  readonly infoTestID?: string
  readonly testID?: string
}

export const getLabelInfoAccessibilityLabel = (
  label: string,
  labelInfo: InputLabelInfo
) => `${label}. ${labelInfo.accessibilityLabel ?? inputStrings.labelInfoButton}`

export const InputLabel = ({
  label,
  labelInfo,
  disabled = false,
  isRequired,
  isDanger = false,
  floating,
  hasActions = false,
  size = 'base',
  infoTestID,
  testID,
  ...textProps
}: InputLabelProps) => {
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
                styles.floatText(isDanger, size),
                styles.required,
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
            pointerEvents='none'
            style={[
              styles.floatText(isDanger, size),
              floating.animatedTextStyle,
            ]}
          >
            {label}
          </Animated.Text>
        </>
      ) : (
        <>
          {isRequired ? (
            <Text
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
          <Text {...textProps} pointerEvents='none' style={styles.label}>
            {label}
          </Text>
        </>
      )}
      {labelInfo ? (
        <Pressable
          accessibilityLabel={getLabelInfoAccessibilityLabel(label, labelInfo)}
          accessibilityRole='button'
          accessibilityState={{ disabled }}
          disabled={disabled}
          style={styles.labelInfo}
          testID={infoTestID}
          onPress={labelInfo.onPress}
        >
          <SvgUniversal
            accessible={false}
            source={IconInfoCircle}
            uniProps={({ semantic }) => ({
              width: semantic.dimension.size[400],
              height: semantic.dimension.size[400],
              color: semantic.colorScheme.color.fg.default,
            })}
          />
        </Pressable>
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
            left: styles[size].paddingHorizontal,
            right: hasActions
              ? styles.inputWithActions.paddingRight
              : styles[size].paddingHorizontal,
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

  return (
    <View style={styles.labelRow} testID={testID}>
      {content}
    </View>
  )
}
