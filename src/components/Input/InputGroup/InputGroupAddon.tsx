import { useContext } from 'react'
import { Pressable, Text, type PressableProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal, type SvgSource } from '../../../utils/SvgUniversal'

import { InputGroupContext } from '../core/InputGroupContext'
import { styles as inputStyles } from '../core/styles'

export interface InputGroupAddonProps extends PressableProps {
  /** Имя для скринридера; по умолчанию берётся из строкового или числового children */
  readonly accessibilityLabel?: string
  /** SVG-иконка; для кнопки только с иконкой задайте accessibilityLabel */
  readonly Icon?: SvgSource
}

/**
 * Дополнение поля; при переданном onPress становится кнопкой.
 * Наследует оформление и disabled группы; может быть отключен отдельно
 *
 * @link https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/?node-id=436-3089
 */
export const InputGroupAddon = ({
  children,
  Icon,
  disabled: disabledProp,
  onPress,
  style,
  testID = 'InputGroupAddon',
  ...props
}: InputGroupAddonProps) => {
  const group = useContext(InputGroupContext)
  const disabled = !!(group?.disabled || disabledProp)
  const hasTextChildren =
    typeof children === 'string' || typeof children === 'number'

  return (
    <Pressable
      {...props}
      accessibilityLabel={
        props.accessibilityLabel ??
        (hasTextChildren ? String(children) : undefined)
      }
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ ...props.accessibilityState, disabled }}
      accessible={!!onPress}
      disabled={disabled}
      style={(state) => [
        styles.addon,
        group && styles[group.position],
        group?.state === 'danger' && styles.danger,
        disabledProp && !group?.disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      testID={testID}
      onPress={onPress}
    >
      {({ pressed }) => (
        <>
          {Icon ? (
            <SvgUniversal
              accessible={false}
              source={Icon}
              uniProps={({ components }) => {
                const iconStyle = inputStyles.icon(group?.size)

                return {
                  width: iconStyle.width,
                  height: iconStyle.height,
                  color: components.inputgroup.colorScheme.addon.color,
                }
              }}
            />
          ) : null}
          {hasTextChildren ? (
            <Text style={[styles.text, styles[group?.size ?? 'base']]}>
              {children}
            </Text>
          ) : typeof children === 'function' ? (
            children({ pressed })
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  addon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: semantic.dimension.space[100],
    padding: components.inputgroup.addon.padding,
    backgroundColor: components.inputgroup.colorScheme.addon.background,
    borderColor: components.inputtext.root.borderColor,
  },
  left: { borderRightWidth: components.inputtext.extend.borderWidth },
  right: { borderLeftWidth: components.inputtext.extend.borderWidth },
  small: { fontSize: components.inputtext.root.sm.fontSize },
  base: { fontSize: fonts.fontSize[300] },
  large: { fontSize: components.inputtext.root.lg.fontSize },
  xlarge: { fontSize: components.inputtext.extend.extXlg.fontSize },
  danger: { borderColor: components.inputtext.root.invalidBorderColor },
  disabled: { opacity: semantic.effects.opacity[60] },
  text: {
    fontFamily: fonts.fontFamily.base,
    fontSize: fonts.fontSize[300],
    color: components.inputgroup.colorScheme.addon.color,
  },
}))
