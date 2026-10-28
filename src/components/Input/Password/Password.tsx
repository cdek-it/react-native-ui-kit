import { IconEye, IconEyeOff } from '@tabler/icons-react-native'
import { memo, useState } from 'react'

import { InputField } from '../core/InputField'
import { InputIconButton } from '../core/InputIconButton'
import { inputStrings } from '../core/strings'

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

    return (
      <InputField
        {...props}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        clearable={clearable}
        disabled={disabled}
        multiline={false}
        renderTrailingAction={
          toggleMask
            ? (variant) => (
                <InputIconButton
                  accessibilityLabel={
                    visible
                      ? inputStrings.hidePassword
                      : inputStrings.showPassword
                  }
                  disabled={disabled}
                  getIconColor={({ components }) =>
                    components.password.icon.color
                  }
                  icon={Icon}
                  testID={`${testID}ToggleMask`}
                  variant={variant}
                  onPress={() => setVisible((current) => !current)}
                />
              )
            : undefined
        }
        secureTextEntry={!visible}
        testID={testID}
      />
    )
  }
)
