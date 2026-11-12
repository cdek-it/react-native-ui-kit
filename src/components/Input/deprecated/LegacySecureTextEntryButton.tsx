import { IconEye, IconEyeOff } from '@tabler/icons-react-native'
import { type Insets, TouchableOpacity } from 'react-native'

import { SvgUniversal } from '../../../utils/SvgUniversal'

import {
  inputIconUniProps,
  inputStyles as styles,
} from './InputTextBase/useInputStyles'

interface LegacySecureTextEntryButtonProps {
  readonly isPasswordHidden: boolean
  readonly hitSlop: Insets
  readonly iconSize: { readonly width: number; readonly height: number }
  readonly testID: string
  readonly onPress: () => void
}

export const LegacySecureTextEntryButton = ({
  isPasswordHidden,
  hitSlop,
  iconSize,
  testID,
  onPress,
}: LegacySecureTextEntryButtonProps) => (
  <TouchableOpacity
    hitSlop={hitSlop}
    style={styles.rightButtonContainer}
    testID={testID}
    onPress={onPress}
  >
    <SvgUniversal
      height={iconSize.height}
      source={isPasswordHidden ? IconEye : IconEyeOff}
      uniProps={inputIconUniProps}
      width={iconSize.width}
    />
  </TouchableOpacity>
)
