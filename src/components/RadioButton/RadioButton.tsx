import { memo, useState } from 'react'
import { Pressable, type PressableProps, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

import { Body, Caption } from '../Typography'

import { styles } from './RadioButton.styles'
import { useRadioButtonTextLayout } from './useRadioButtonTextLayout'

export interface RadioButtonProps extends Omit<
  PressableProps,
  'children' | 'accessible' | 'accessibilityRole' | 'role' | 'aria-checked'
> {
  /**
   * Выбран ли вариант. Меняется только при обновлении prop
   * @default false
   */
  checked?: boolean
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
   * Обработчик нажатия. Выбором и исключением остальных вариантов управляет
   * потребитель. Повторное нажатие не снимает checked самостоятельно
   */
  onPress?: PressableProps['onPress']
  /** Текст справа от круга. По умолчанию задаёт доступное имя */
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
 * Управляемая радиокнопка с необязательными label и caption.
 * Вся строка — единая область нажатия и один accessibility-элемент.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=17-13535
 */
export const RadioButton = memo<RadioButtonProps>(
  ({
    checked = false,
    disabled = false,
    danger = false,
    label,
    caption,
    style,
    testID = 'RadioButton_Pressable',
    hitSlop = 10,
    accessibilityLabel,
    accessibilityLabelledBy,
    accessibilityHint,
    accessibilityState,
    onFocus,
    onBlur,
    onHoverIn,
    onHoverOut,
    ...rest
  }) => {
    const [focused, setFocused] = useState(false)
    const [hovered, setHovered] = useState(false)
    // Обход Unistyles: нативное обновление цветов при смене темы
    // key={rt.themeName} пересоздаёт только внутренний Animated.View с актуальной палитрой
    // https://github.com/jpudysz/react-native-unistyles/issues/1007 исправление в Unistyles 3.6.0
    const { rt } = useUnistyles()
    const {
      visibleCaption,
      alignToFirstLine,
      firstLineHeight,
      onLabelTextLayout,
      onCaptionTextLayout,
    } = useRadioButtonTextLayout(label, caption)
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
        accessibilityRole='radio'
        accessibilityState={{ ...accessibilityState, checked, disabled }}
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
      >
        {({ pressed }) => {
          const active = pressed || hovered

          return (
            <>
              <Animated.View
                accessibilityElementsHidden
                accessible={false}
                focusable={false}
                importantForAccessibility='no-hide-descendants'
                key={rt.themeName}
                pointerEvents='none'
                style={styles.circle({
                  checked,
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
                <Animated.View
                  style={styles.center({ checked, active, disabled })}
                />
              </Animated.View>
              {textContent}
            </>
          )
        }}
      </Pressable>
    )
  }
)
