import { type Icon, IconX } from '@tabler/icons-react-native'
import React, { memo } from 'react'
import { Text, Pressable, type PressableProps } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface ChipProps extends PressableProps {
  /** Иконка из библиотеки Tabler */
  Icon?: Icon

  /** Текст для отображения */
  label: string

  /** Обработчик нажатия на крестик
   * Если не пусто, то у чипса будет отображен крестик
   */
  onRemove?: () => void
}

/** Компонет Нажимабельного тега с возможностью закрытия
 * Используется для представления массива данных в виде меток
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5126&t=jMMaE0JO924pG1ga-4
 */
export const Chip = memo<ChipProps>(({ Icon, label, disabled, testID, onRemove, ...rest }) => {
  const styles = useStyles()

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={[styles.chip, disabled && styles.disabledChip]}
      testID={testID || TestId.Container}
    >
      {Icon && (
        <Icon
          color={disabled ? styles.disabledIcon.color : styles.icon.color}
          height={styles.icon.height}
          width={styles.icon.width}
        />
      )}

      <Text numberOfLines={1} style={[styles.text, disabled && styles.disabledText]}>
        {label}
      </Text>

      {onRemove && (
        <Pressable disabled={disabled} testID={TestId.RemoveButton} onPress={onRemove}>
          <IconX
            color={disabled ? styles.disabledIcon.color : styles.icon.color}
            height={styles.icon.height}
            width={styles.icon.width}
          />
        </Pressable>
      )}
    </Pressable>
  )
})

const useStyles = makeStyles(({ theme, typography }) => ({
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
    borderWidth: 1,

    backgroundColor: theme.Misc.Chip.chipBg,
    borderColor: theme.Misc.Chip.chipBorderColor,
  },
  disabledChip: {
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
    opacity: 0.6,
    mixBlendMode: 'luminosity',
  },
  icon: {
    width: 14,
    height: 14,
    color: theme.Misc.Chip.chipTextColor,
  },
  disabledIcon: {
    color: theme.Button.Disabled.disabledButtonTextColor,
  },
  text: {
    fontSize: typography.Size['text-base'],
    verticalAlign: 'middle',
    color: theme.Misc.Chip.chipTextColor,
    includeFontPadding: false,
  },
  disabledText: {
    color: theme.General.textSecondaryColor,
  },
}))

export enum TestId {
  Container = 'Chip_Container',
  RemoveButton = 'Chip_RemoveButton',
}
