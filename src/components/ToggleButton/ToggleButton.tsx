import { memo, useCallback, useMemo, useState } from 'react'
import {
  type AccessibilityProps,
  Pressable,
  Text,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'
import { makeStyles } from '../../utils/makeStyles'

import { useIconSize } from './hooks/useIconSize'
import { useLabelSize } from './hooks/useLabelSize'
import { useStateStyles } from './hooks/useStateStyles'

export interface ToggleButtonProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Обработчик нажатия на кнопку */
  onPress: () => void
  /**
   * true, если необходим компонент в активном состоянии
   * @default false
   */
  checked?: boolean
  /**
   * Управление доступностью компонента
   * @default false
   */
  disabled?: boolean
  /** Отображение только иконки без текста */
  iconOnly?: boolean
  /**
   * Выбор позиции иконки. 'left' - иконка слева, 'right' - иконка справа, null - иконка скрыта
   * @default 'left'
   */
  iconPos?: 'left' | 'right' | null
  /** Текст на кнопке */
  label?: string
  /**
   * Выбор размера элемента
   * @default 'base'
   */
  size?: 'xlarge' | 'large' | 'base' | 'small'
  /** Дополнительная стилизация для контейнера компонента */
  style?: ViewStyle
  /** SVG-иконка */
  Icon?: SvgSource
}

/**
 * Используется для выбора нескольких значений с помощью кнопки
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4821
 */
export const ToggleButton = memo<ToggleButtonProps>(
  ({
    onPress,
    checked,
    disabled,
    iconOnly: iconOnlyProp,
    iconPos = 'left',
    label,
    size = 'base',
    style,
    Icon,
    testID,
    ...rest
  }) => {
    const styles = useStyles()
    const labelSize = useLabelSize(size)
    const iconSize = useIconSize(size)
    const [pressed, setPressed] = useState(false)
    const stateStyles = useStateStyles(checked, disabled, pressed)

    const iconOnly = useMemo(
      () => iconOnlyProp || !label,
      [iconOnlyProp, label]
    )

    const icon = useMemo(() => {
      if (!Icon) {
        return null
      }

      return (
        <SvgUniversal
          height={iconSize.height}
          source={Icon}
          style={stateStyles.label as unknown as ViewStyle}
          testID={ToggleButtonTestId.icon}
          width={iconSize.width}
        />
      )
    }, [Icon, iconSize.height, iconSize.width, stateStyles.label])

    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    return (
      <Pressable
        disabled={disabled}
        style={[styles.container, style, stateStyles.borderContainer]}
        testID={testID || ToggleButtonTestId.root}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...rest}
      >
        <View
          style={[
            styles.contentContainer,
            styles[size],
            iconOnly && styles.iconOnly,
            stateStyles.contentContainer,
          ]}
          testID={ToggleButtonTestId.container}
        >
          {iconOnly ? (
            icon
          ) : (
            <>
              {iconPos === 'left' && icon}
              <Text
                style={[styles.label, labelSize, stateStyles.label]}
                testID={ToggleButtonTestId.text}
              >
                {label}
              </Text>
              {Icon && iconPos === 'right' ? icon : null}
            </>
          )}
        </View>
      </Pressable>
    )
  }
)

const useStyles = makeStyles(({ theme, spacing, border, fonts }) => ({
  container: {
    alignSelf: 'flex-start',
    borderRadius: border.Radius['rounded-full'],
    borderWidth: border.Width.border,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: border.Radius['rounded-full'],
    paddingVertical: theme.Button.Common.buttonPaddingTopBottom,
    paddingHorizontal: spacing.Padding['p-6'],
    gap: spacing.Gap['gap-3'],
  },
  xlarge: { minHeight: theme.Button.Common.buttonHeightXL },
  large: { minHeight: theme.Button.Common.buttonHeightLG },
  base: {
    minHeight: theme.Button.Common.buttonHeight,
    paddingHorizontal: theme.Button.Common.buttonPaddingLeftRight,
    gap: theme.General.inlineSpacing,
  },
  small: {
    minHeight: theme.Button.Common.buttonHeightSM,
    paddingHorizontal: spacing.Padding['p-3'],
    gap: theme.General.inlineSpacing,
  },
  iconOnly: {
    aspectRatio: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
  },
  label: { flexShrink: 1, fontFamily: fonts.primary },
}))

export const ToggleButtonTestId = {
  root: 'ToggleButton',
  container: 'ToggleButton.container',
  text: 'ToggleButton.text',
  icon: 'ToggleButton.icon',
}
