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
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=24037-68
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
            uniProps={({ components }) => {
              return { color: components.inputgroup.colorScheme.addon.color }
            }}
          />
        )}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
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
    opacity: semantic.effects.opacity[60],
    backgroundColor: semantic.colorScheme.color.bg.neutral.weak.disabled,
  },
  text: {
    fontSize: fonts.fontSize[300],
    color: components.inputgroup.colorScheme.addon.color,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.base,
  },
  icon: {
    width: components.inputgroup.extend.iconSize,
    height: components.inputgroup.extend.iconSize,
  },
}))
