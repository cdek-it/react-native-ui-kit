import type { Icon } from '@tabler/icons-react-native'
import { createElement, memo } from 'react'
import { Pressable, Text } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface InputGroupAddonProps {
  /** Содержимое аддона инпут группы, текст или иконка из Tabler */
  content: string | Icon
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
    const styles = useStyles()

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
          createElement(content, {
            style: styles.icon,
            width: styles.icon.width,
            height: styles.icon.height,
          })
        )}
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme }) => ({
  container: {
    paddingVertical: theme.Form.InputText.inputPaddingTopBottom,
    paddingHorizontal: theme.Form.InputText.inputPaddingLeftRight,
    justifyContent: 'center',
    borderRadius: theme.General.borderRadius,
    borderWidth: 1,
    borderColor: theme.Form.InputText.inputBorderColor,
    backgroundColor: theme.Form.InputGroup.inputGroupBg,
  },
  left: {
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
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
    fontSize: 14,
    color: theme.Form.InputGroup.inputGroupTextColor,
    includeFontPadding: false,
    verticalAlign: 'middle',
  },
  icon: {
    width: 14,
    height: 14,
    color: theme.Form.InputGroup.inputGroupTextColor,
  },
}))
