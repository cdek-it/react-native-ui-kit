import { type TextInputProps, useWindowDimensions } from 'react-native'

export const useInputFontScale = ({
  allowFontScaling,
  maxFontSizeMultiplier,
}: Pick<TextInputProps, 'allowFontScaling' | 'maxFontSizeMultiplier'>) => {
  const { fontScale } = useWindowDimensions()

  return allowFontScaling === false
    ? 1
    : Math.min(
        fontScale,
        maxFontSizeMultiplier && maxFontSizeMultiplier > 0
          ? maxFontSizeMultiplier
          : Infinity
      )
}
