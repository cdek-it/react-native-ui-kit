import { memo } from 'react'
import { Pressable, Text } from 'react-native'

import { StyleSheet } from '../../utils'
import { SvgUniversal, type SvgSource } from '../../utils/SvgUniversal'

export interface InputGroupAddonProps {
  /** Содержимое аддона инпут группы, текст или SVG-иконка */
  content: string | SvgSource
  /** Расположение аддона слева или справа в группе */
  position: 'left' | 'right'
  /** Управление активностью аддона */
  disabled?: boolean
  /** Обработчик нажатия */
  onPress?: () => void
}

/**
 * Служебный компонент для группировки инпута
 * @link https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5932&m=dev
 * @see InputGroup
 */
export const InputGroupAddon = memo<InputGroupAddonProps>(
  ({ content, onPress, position, disabled }) => {
    return (
      <Pressable
        collapsable={false}
        disabled={disabled}
        style={[
          styles.container,
          styles[position],
          disabled && styles.disabled,
        ]}
        testID='InputGroupAddon_Pressable'
        onPress={onPress}
      >
        {typeof content === 'string' ? (
          <Text style={styles.text}>{content}</Text>
        ) : (
          <SvgUniversal
            {...styles.icon}
            source={content}
            uniProps={({ theme }) => ({
              color: theme.Form.InputGroup.inputGroupTextColor,
            })}
          />
        )}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ theme, typography, fonts }) => ({
  container: {
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    justifyContent: 'center',
    borderRadius: theme.General.borderRadiusXL,
    borderWidth: 1,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Form.InputGroup.inputGroupBg,
  },
  left: {
    borderRightWidth: 0,
    // При меньших значениях возникает баг рендера
    borderTopRightRadius: 0.2,
    borderBottomRightRadius: 0.2,
  },
  right: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
  },
  text: {
    fontSize: typography.Size['text-base'],
    color: theme.Form.InputGroup.inputGroupTextColor,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.secondary,
  },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },
}))
