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
    const iconUniProps = ({ components }: ThemeType) => ({
      color: disabled
        ? components.button.extend.disabledColor
        : components.chip.colorScheme.root.color,
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
                uniProps={({ components }) => ({
                  color: disabled
                    ? components.button.extend.disabledColor
                    : components.chip.colorScheme.root.color,
                })}
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
// TODO(tokens-migration): reason=missing; legacy=components.button.extend.disabledColor; light=#85888e; dark=#a2a5a9
// TODO(tokens-migration): reason=missing; legacy=components.button.extend.disabledBackground; light=#e2e2e4; dark=#404348
// TODO(tokens-migration): reason=missing; legacy=border.Color.Service.border-success.400; value=#77f48a
// TODO(tokens-migration): reason=missing; legacy=border.Radius.rounded-full; value=100
// TODO(tokens-migration): reason=missing; legacy=border.Width.border-3; value=3
// TODO(tokens-migration): reason=missing; legacy=fonts.secondary; value=Noto Sans
const styles = StyleSheet.create(
  ({ components, typography, spacing, border, fonts }) => ({
    chip: {
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      // TODO(tokens-migration): reason=value-mismatch; legacy=spacing.Gap.gap-2; value=7; target=components.chip.root.gap; targetValue=8
      gap: spacing.Gap['gap-2'],

      paddingHorizontal: components.chip.root.paddingX,
      paddingVertical: components.chip.root.paddingY,

      borderRadius: components.chip.root.borderRadius,
      borderWidth: components.chip.extend.borderWidth,

      backgroundColor: components.chip.colorScheme.root.background,
      borderColor: components.chip.extend.borderColor,
    },
    disabledChip: {
      backgroundColor: components.button.extend.disabledBackground,
      borderColor: 'transparent',
      opacity: 0.6,
      mixBlendMode: 'luminosity',
    },
    icon: {
      // TODO(tokens-migration): reason=value-mismatch; legacy=typography.Size.text-base; value=14; target=components.chip.icon.size; targetValue=16
      width: typography.Size['text-base'],
      height: typography.Size['text-base'],
    },
    text: {
      fontSize: typography.Size['text-base'],
      verticalAlign: 'middle',
      color: components.chip.colorScheme.root.color,
      includeFontPadding: false,
      fontFamily: fonts.secondary,
    },
    disabledText: { color: components.button.extend.disabledColor },
    pressedClose: {
      borderWidth: border.Width['border-3'],
      borderColor: border.Color.Service['border-success'][400],
      borderRadius: border.Radius['rounded-full'],
    },
  })
)

export enum TestId {
  Container = 'Chip_Container',
  RemoveButton = 'Chip_RemoveButton',
}
