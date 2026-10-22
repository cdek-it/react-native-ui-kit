import { IconEye, IconEyeOff } from '@tabler/icons-react-native'
import { memo, useState } from 'react'
import { Pressable } from 'react-native'

import { SvgUniversal } from '../../../utils/SvgUniversal'

import { InputField } from '../core/InputField'
import { inputStrings } from '../core/strings'
import { styles } from '../core/styles'

import type { PasswordProps } from './types'

export type { PasswordProps } from './types'

/**
 * Поле ввода пароля.
 *
 * @see PasswordProps
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/?node-id=375-1701
 */
export const Password = memo<PasswordProps>(
  ({
    toggleMask = true,
    disabled = false,
    clearable = false,
    autoCapitalize = 'none',
    autoCorrect = false,
    testID = 'Password',
    ...props
  }) => {
    const [visible, setVisible] = useState(false)
    const Icon = visible ? IconEyeOff : IconEye
    const actionGap = styles.actions(props.size).gap

    return (
      <InputField
        {...props}
        action={
          toggleMask ? (
            <Pressable
              accessibilityLabel={
                visible ? inputStrings.hidePassword : inputStrings.showPassword
              }
              accessibilityRole='button'
              accessibilityState={{ disabled }}
              disabled={disabled}
              hitSlop={{
                top: actionGap * 2,
                bottom: actionGap * 2,
                left: actionGap,
                right: actionGap,
              }}
              style={styles.action}
              testID={`${testID}ToggleMask`}
              onPress={() => setVisible((current) => !current)}
            >
              <SvgUniversal
                accessible={false}
                source={Icon}
                uniProps={({ components }) => {
                  const iconStyle = styles.icon(props.size)

                  return {
                    width: iconStyle.width,
                    height: iconStyle.height,
                    color: components.password.icon.color,
                  }
                }}
              />
            </Pressable>
          ) : undefined
        }
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        clearable={clearable}
        disabled={disabled}
        multiline={false}
        secureTextEntry={!visible}
        testID={testID}
      />
    )
  }
)
