import { IconX } from '@tabler/icons-react-native'
import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

import { SvgUniversal } from '../../../utils/SvgUniversal'

import { inputStrings } from './strings'
import { styles } from './styles'
import type { InputTextSize } from './types'

interface InputActionsProps {
  readonly isClearVisible: boolean
  readonly size: InputTextSize
  readonly onClear: () => void
  readonly children?: ReactNode
  readonly testID: string
}

export const InputActions = ({
  isClearVisible,
  size,
  onClear,
  children,
  testID,
}: InputActionsProps) => {
  const actionStyle = styles.actions(size)

  return (
    <View style={actionStyle}>
      {isClearVisible ? (
        <Pressable
          accessibilityLabel={inputStrings.clearButton}
          accessibilityRole='button'
          hitSlop={{
            top: actionStyle.gap * 2,
            bottom: actionStyle.gap * 2,
            left: actionStyle.gap,
            right: actionStyle.gap,
          }}
          style={styles.action}
          testID={testID}
          onPress={onClear}
        >
          <SvgUniversal
            accessible={false}
            source={IconX}
            uniProps={({ components }) => {
              const iconStyle = styles.icon(size)

              return {
                width: iconStyle.width,
                height: iconStyle.height,
                color: components.inputtext.root.color,
              }
            }}
          />
        </Pressable>
      ) : null}
      {children}
    </View>
  )
}
