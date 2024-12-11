import { type Icon, IconX } from '@tabler/icons-react-native'
import React, { memo, useCallback } from 'react'
import { Text, Pressable, type PressableProps, type ViewStyle } from 'react-native'

import { makeStyles } from '../../utils/makeStyles'

export interface ChipProps extends PressableProps {
  /** Иконка из библиотеки Tabler */
  Icon?: Icon

  /** Признак доступности для нажатия */
  // disabled?: boolean

  /** Текст для отображения */
  label: string

  /** Признак для отображения крестика внутри компонента */
  removable?: boolean

  /** Обработчик нажатия на крестик */
  onRemove?: () => void
}

/** Компонет Нажимабельного тега с возможностью закрытия
 * Используется для представления массива данных в виде меток
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-5126&t=jMMaE0JO924pG1ga-4
 */
export const Chip = memo<ChipProps>(({ Icon, label, disabled, removable, onRemove, ...rest }) => {
  const styles = useStyles()
  const getPressableStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [
      styles.chip,
      disabled && styles.disabledChip,
      pressed && styles.highlightChip,
    ],
    [styles]
  )

  return (
    <Pressable {...rest} disabled={disabled} style={getPressableStyle}>
      {Icon && (
        <Icon size={styles.icon.height} style={[styles.icon, styles.disabledIcon as ViewStyle]} />
      )}

      <Text numberOfLines={1} style={[styles.text, disabled && styles.disabledText]}>
        {label}
      </Text>

      {removable && (
        <Pressable disabled={disabled} onPress={onRemove}>
          <IconX
            size={styles.icon.height}
            style={[styles.icon, styles.disabledIcon as ViewStyle]}
          />
        </Pressable>
      )}
    </Pressable>
  )
})

const useStyles = makeStyles(({ theme }) => ({
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

    backgroundColor: '#E5E5E5', // theme.Misc.Chip.chipBg, - с прозрачным цветом, тень работать не будет
    borderColor: theme.Misc.Chip.chipBorderColor,
  },
  disabledChip: {
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
  },
  highlightChip: {
    shadowColor: theme.General.focusOutlineColor,
    shadowRadius: 3.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 3,
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
    fontSize: 14,
    verticalAlign: 'middle',
    color: theme.Misc.Chip.chipTextColor,
    includeFontPadding: false,
  },
  disabledText: {
    color: theme.General.textSecondaryColor,
  },
}))
