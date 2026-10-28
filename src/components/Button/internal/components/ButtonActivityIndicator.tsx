import { ActivityIndicator } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { genericMemo } from '../../../../utils/genericMemo'
import type { BaseButtonProps } from '../../types'

export type ButtonActivityIndicatorProps = Pick<
  Required<BaseButtonProps<never>>,
  'size'
>

const ButtonActivityIndicatorComponent = ({
  size,
}: ButtonActivityIndicatorProps) => {
  buttonActivityIndicatorStyles.useVariants({ size })

  return (
    <ActivityIndicator
      accessibilityElementsHidden
      accessible={false}
      color={buttonActivityIndicatorStyles.indicator.color}
      importantForAccessibility='no-hide-descendants'
      size={buttonActivityIndicatorStyles.indicator.height}
      testID='Button_ActivityIndicator'
    />
  )
}

export const ButtonActivityIndicator = genericMemo(
  ButtonActivityIndicatorComponent
)

const buttonActivityIndicatorStyles = StyleSheet.create(
  ({ components: { button } }) => ({
    indicator: {
      color: button.extend.disabledColor,
      variants: {
        size: {
          xlarge: { height: button.extend.iconSize.lg },
          large: { height: button.extend.iconSize.lg },
          base: { height: button.extend.iconSize.md },
          small: { height: button.extend.iconSize.sm },
        },
      },
    },
  })
)
