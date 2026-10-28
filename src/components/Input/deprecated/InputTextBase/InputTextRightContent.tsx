import { IconLoader2, IconLock, IconX } from '@tabler/icons-react-native'
import { TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../../../../hooks/useLoadingRotationAnimation'
import type { useMakeTestId } from '../../../../hooks/useMakeTestId'
import { SvgUniversal } from '../../../../utils/SvgUniversal'

import { InputTextBaseTestId } from './testIds'
import type { RenderInputTextRightAccessory } from './types'
import { inputIconUniProps, inputStyles as styles } from './useInputStyles'

interface InputTextRightContentProps {
  readonly disabled: boolean
  readonly loading?: boolean
  readonly hasFloatingLabel: boolean
  readonly showClearButton: boolean
  readonly clearButtonAccessibilityLabel?: string
  readonly renderRightAccessory?: RenderInputTextRightAccessory
  readonly makeTestId: ReturnType<typeof useMakeTestId>['makeTestId']
  readonly onClear: () => void
}

export const InputTextRightContent = ({
  disabled,
  loading,
  hasFloatingLabel,
  showClearButton,
  clearButtonAccessibilityLabel,
  renderRightAccessory,
  makeTestId,
  onClear,
}: InputTextRightContentProps) => {
  const loadingAnimatedStyle = useLoadingRotationAnimation(loading)
  const iconSize = hasFloatingLabel
    ? styles.iconSizeFloatLabel
    : styles.iconSize
  const horizontalHitSlop =
    showClearButton === !!renderRightAccessory
      ? styles.rightContainer.gap / 2
      : styles.rightContainer.gap
  const hitSlop = {
    // Родитель ограничивает область тапа даже при росте высоты поля
    top: 100,
    bottom: 100,
    left: horizontalHitSlop,
    right: horizontalHitSlop,
  }

  return (
    <View style={styles.rightContainer}>
      {loading ? (
        <Animated.View
          style={[styles.rightButtonContainer, loadingAnimatedStyle]}
          testID={makeTestId(InputTextBaseTestId.loading)}
        >
          <SvgUniversal
            {...iconSize}
            source={IconLoader2}
            uniProps={inputIconUniProps}
          />
        </Animated.View>
      ) : null}

      {showClearButton ? (
        <TouchableOpacity
          accessibilityLabel={clearButtonAccessibilityLabel || 'Очистить поле'}
          accessibilityRole='button'
          hitSlop={hitSlop}
          style={styles.rightButtonContainer}
          testID={makeTestId(InputTextBaseTestId.clearButton)}
          onPress={onClear}
        >
          <SvgUniversal
            {...iconSize}
            source={IconX}
            uniProps={inputIconUniProps}
          />
        </TouchableOpacity>
      ) : null}

      {renderRightAccessory?.({ hitSlop, iconSize, makeTestId })}

      {disabled ? (
        <SvgUniversal
          {...iconSize}
          source={IconLock}
          testID={makeTestId(InputTextBaseTestId.disabledIcon)}
          uniProps={inputIconUniProps}
        />
      ) : null}
    </View>
  )
}
