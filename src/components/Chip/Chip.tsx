import { IconX } from '@tabler/icons-react-native'
import { memo } from 'react'

import { Text, Pressable, type PressableProps } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../../theme/types'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

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
    const iconUniProps = ({ theme }: ThemeType) => ({
      color: disabled
        ? theme.Button.disabledColor
        : theme.Misc.Chip.chipTextColor,
    })

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
                uniProps={({ theme }) => ({
                  color: disabled
                    ? theme.Button.disabledColor
                    : theme.Misc.Chip.chipTextColor,
                })}
              />
            )}
          </Pressable>
        ) : null}
      </Pressable>
    )
  }
)

const styles = StyleSheet.create(({ theme, typography, border, fonts }) => ({
  chip: {
    height: theme.Misc.Chip.chipHeight,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.General.inlineSpacing,

    paddingHorizontal: theme.Misc.Chip.chipPaddingLeftRight,
    paddingVertical: theme.Misc.Chip.chipPaddingTopBottom,

    borderRadius: theme.Misc.Chip.chipBorderRadius,
    borderWidth: border.Width.border,

    backgroundColor: theme.Misc.Chip.chipBg,
    borderColor: theme.Misc.Chip.chipBorderColor,
  },
  disabledChip: {
    backgroundColor: theme.Button.disabledBackground,
    borderColor: 'transparent',
    opacity: 0.6,
    mixBlendMode: 'luminosity',
  },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },
  text: {
    fontSize: typography.Size['text-base'],
    verticalAlign: 'middle',
    color: theme.Misc.Chip.chipTextColor,
    includeFontPadding: false,
    fontFamily: fonts.secondary,
  },
  disabledText: { color: theme.General.textSecondaryColor },
  pressedClose: {
    borderWidth: border.Width['border-3'],
    borderColor: border.Color.Service['border-success'][400],
    borderRadius: border.Radius['rounded-full'],
  },
}))

export enum TestId {
  Container = 'Chip_Container',
  RemoveButton = 'Chip_RemoveButton',
}
