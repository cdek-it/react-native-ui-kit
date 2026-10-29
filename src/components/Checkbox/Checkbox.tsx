import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import { memo, useState } from 'react'
import { Pressable, type PressableProps, View } from 'react-native'

import { SvgUniversal } from '../../utils'
import { Body, Caption } from '../Typography'

import { styles } from './Checkbox.styles'
import { useCheckboxTextLayout } from './useCheckboxTextLayout'

export interface CheckboxProps extends Omit<
  PressableProps,
  'children' | 'accessible' | 'accessibilityRole' | 'role' | 'aria-checked'
> {
  /**
   * Текущее значение. Меняется только при обновлении prop
   * @default false
   */
  checked?: boolean
  /**
   * Частично выбранное состояние. Переопределяет отображение checked
   * @default false
   */
  indeterminate?: boolean
  /**
   * Блокирует взаимодействие
   * @default false
   */
  disabled?: boolean
  /**
   * Оформление ошибки
   * @default false
   */
  danger?: boolean
  /**
   * Сообщает следующее значение checked: !checked.
   * Потребитель обновляет checked и управляет indeterminate самостоятельно
   */
  onCheckedChange?: (checked: boolean) => void
  /** Текст справа от квадрата. По умолчанию задаёт доступное имя */
  label?: string
  /** Подпись под label. Без label не отображается */
  caption?: string
  /**
   * Расширяет область нажатия без изменения размера компонента.
   * Ограничена границами родителя
   * @default 10
   */
  hitSlop?: PressableProps['hitSlop']
}

/**
 * Управляемый чекбокс с необязательными label и caption.
 * Вся строка — единая область нажатия и один accessibility-элемент.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=16-13529
 */
export const Checkbox = memo<CheckboxProps>(
  ({
    checked = false,
    indeterminate = false,
    disabled = false,
    danger = false,
    onCheckedChange,
    label,
    caption,
    style,
    testID = 'CheckboxButton_Pressable',
    hitSlop = 10,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityHint,
    accessibilityState,
    onPress,
    onFocus,
    onBlur,
    onHoverIn,
    onHoverOut,
    ...rest
  }) => {
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const {
      visibleCaption,
      alignToFirstLine,
      firstLineHeight,
      onLabelTextLayout,
      onCaptionTextLayout,
    } = useCheckboxTextLayout(label, caption)
    const filled = checked || indeterminate
    const Icon = indeterminate ? IconMinus : checked ? IconCheck : null
    const accessibilityChecked = indeterminate ? 'mixed' : checked
    const resolvedAccessibilityLabel =
      accessibilityLabel ??
      (accessibilityLabelledBy === undefined ? label : undefined)

    const textContent = label !== undefined && (
      <View
        accessibilityElementsHidden
        accessible={false}
        importantForAccessibility='no-hide-descendants'
        style={styles.content(firstLineHeight)}
      >
        <Body size='base' style={styles.label} onTextLayout={onLabelTextLayout}>
          {label}
        </Body>
        {visibleCaption !== undefined && (
          <Caption style={styles.caption} onTextLayout={onCaptionTextLayout}>
            {visibleCaption}
          </Caption>
        )}
      </View>
    )

    return (
      <Pressable
        {...rest}
        accessible
        accessibilityHint={accessibilityHint ?? visibleCaption}
        accessibilityLabel={resolvedAccessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy}
        accessibilityRole='checkbox'
        accessibilityState={{
          ...accessibilityState,
          checked: accessibilityChecked,
          disabled,
        }}
        disabled={disabled}
        hitSlop={hitSlop}
        style={(pressState) => [
          styles.root(alignToFirstLine),
          typeof style === 'function' ? style(pressState) : style,
        ]}
        testID={testID}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onHoverIn={(event) => {
          setHovered(true)
          onHoverIn?.(event)
        }}
        onHoverOut={(event) => {
          setHovered(false)
          onHoverOut?.(event)
        }}
        onPress={(event) => {
          onCheckedChange?.(!checked)
          onPress?.(event)
        }}
      >
        {({ pressed }) => {
          const active = pressed || hovered

          return (
            <>
              <View
                accessibilityElementsHidden
                accessible={false}
                importantForAccessibility='no-hide-descendants'
                style={styles.box({
                  filled,
                  active,
                  disabled,
                  focused,
                  danger,
                  firstLineHeight,
                })}
              >
                {!disabled && (focused || danger) ? (
                  <View pointerEvents='none' style={styles.ring(danger)} />
                ) : null}
                {Icon ? (
                  <SvgUniversal
                    source={Icon}
                    uniProps={({ components: { checkbox } }) => ({
                      width: checkbox.icon.size,
                      height: checkbox.icon.size,
                      color: disabled
                        ? checkbox.icon.disabledColor
                        : active
                          ? checkbox.icon.checkedHoverColor
                          : checkbox.icon.checkedColor,
                    })}
                  />
                ) : null}
              </View>
              {textContent}
            </>
          )
        }}
      </Pressable>
    )
  }
)
