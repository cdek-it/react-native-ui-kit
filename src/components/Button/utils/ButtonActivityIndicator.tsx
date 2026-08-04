import { ActivityIndicator } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { genericMemo } from '../../../utils/genericMemo'
import type { BaseButtonProps } from '../types'

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
      color={buttonActivityIndicatorStyles.indicator.color}
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
          xlarge: { height: 21 },
          large: { height: 21 },
          base: { height: 17.5 },
          small: { height: 14 },
        },
      },
    },
  })
)
