import { IconX } from '@tabler/icons-react-native'
import { memo } from 'react'

import { Text, Pressable, type PressableProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import {
  type SvgSource,
  SvgUniversal,
  type SvgUniversalTheme,
} from '../../utils/SvgUniversal'

export interface ChipProps extends PressableProps {
  /** SVG-иконка */
  Icon?: SvgSource
  /** Текст для отображения */
  label: string
  /**
   * Показывать или скрыть кнопку для скрытия компонента
   * @default true если onClose задан, иначе false
   */
  showClose?: boolean
  /**
   * Показывать или скрыть иконку внутри компонента
   * @default true
   */
  showIcon?: boolean
  /** Обработчик нажатия на кнопку скрытия компонента */
  onClose?: () => void
}

/**
 * Компонет Нажимабельного тега с возможностью закрытия
 * Используется для представления массива данных в виде меток
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5126&t=jMMaE0JO924pG1ga-4
 */
export const Chip = memo<ChipProps>(
  ({
    Icon,
    label,
    disabled,
    testID,
    onClose,
    showClose = !!onClose,
    showIcon = true,
    ...rest
  }) => {
    const iconUniProps = ({ components, semantic }: SvgUniversalTheme) => {
      return {
        color: disabled
          ? semantic.colorScheme.color.fg.muted
          : components.chip.colorScheme.root.color,
      }
    }

    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={[styles.chip, disabled && styles.disabledChip]}
        testID={testID || TestId.Container}
      >
        {showIcon && Icon ? (
          <SvgUniversal
            {...styles.icon}
            source={Icon}
            uniProps={iconUniProps}
          />
        ) : null}

        <Text
          numberOfLines={1}
          style={[styles.text, disabled && styles.disabledText]}
        >
          {label}
        </Text>

        {showClose ? (
          <Pressable
            disabled={disabled}
            testID={TestId.RemoveButton}
            onPress={onClose}
          >
            {({ pressed }) => (
              <SvgUniversal
                {...styles.icon}
                source={IconX}
                style={pressed ? styles.pressedClose : null}
                uniProps={({ components, semantic }) => {
                  return {
                    color: disabled
                      ? semantic.colorScheme.color.fg.muted
                      : components.chip.colorScheme.root.color,
                  }
                }}
              />
            )}
          </Pressable>
        ) : null}
      </Pressable>
    )
  }
)

// `transparent` здесь — отсутствие границы, а не цвет дизайн-системы:
// у chip.root нет borderColor, прозрачность не выражена semantic-токеном.
const styles = StyleSheet.create(({ components, semantic, fonts }) => ({
  chip: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: components.chip.root.gap,

    paddingHorizontal: components.chip.root.paddingX,
    paddingVertical: components.chip.root.paddingY,

    borderRadius: components.chip.root.borderRadius,
    borderWidth: components.chip.extend.borderWidth,

    backgroundColor: components.chip.colorScheme.root.background,
    borderColor: components.chip.extend.borderColor,
  },
  disabledChip: {
    backgroundColor: semantic.colorScheme.color.bg.neutral.weak.disabled,
    borderColor: 'transparent',
    opacity: semantic.effects.opacity[60],
    mixBlendMode: 'luminosity',
  },
  icon: { width: components.chip.icon.size, height: components.chip.icon.size },
  text: {
    fontSize: fonts.fontSize[300],
    verticalAlign: 'middle',
    color: components.chip.colorScheme.root.color,
    includeFontPadding: false,
    fontFamily: fonts.fontFamily.base,
  },
  disabledText: { color: semantic.colorScheme.color.fg.muted },
  pressedClose: {
    borderWidth: semantic.dimension.borderWidth[300],
    borderColor: semantic.colorScheme.color.border.status.success.strong,
    borderRadius: semantic.dimension.borderRadius.max,
  },
}))

export enum TestId {
  Container = 'Chip_Container',
  RemoveButton = 'Chip_RemoveButton',
}
