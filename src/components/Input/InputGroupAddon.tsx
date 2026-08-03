import { memo } from 'react'
import { Pressable, Text } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

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
            uniProps={({ components }) => ({
              color: components.inputgroup.colorScheme.addon.color,
            })}
          />
        )}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(
  ({ primitive, components, semantic, fonts }) => ({
    container: {
      padding: components.inputgroup.addon.padding,
      justifyContent: 'center',
      borderRadius: components.inputgroup.addon.borderRadius,
      borderWidth: components.inputgroup.extend.borderWidth,
      borderColor: components.inputgroup.colorScheme.addon.borderColor,
      backgroundColor: components.inputgroup.colorScheme.addon.background,
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
      backgroundColor: semantic.colorScheme.color.bg.neutral.weak.disabled,
    },
    text: {
      fontSize: primitive.fonts.fontSize[300],
      color: components.inputgroup.colorScheme.addon.color,
      includeFontPadding: false,
      verticalAlign: 'middle',
      fontFamily: fonts.secondary,
    },
    icon: {
      width: components.inputgroup.extend.iconSize,
      height: components.inputgroup.extend.iconSize,
    },
  })
)
