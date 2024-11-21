import { type Icon, IconX } from '@tabler/icons-react-native'
import React from 'react'
import { Text, Pressable, type PressableProps } from 'react-native'

import { makeStyles, type StylesObject } from '../../utils/makeStyles'

export type ChipProps = Omit<PressableProps, 'disabled'> &
  React.PropsWithChildren<{
    /** Иконка из библиотеки Tabler */
    Icon?: Icon
    /**
     * Признак для отображения крестика внутри компонента
     * @default true
     */
    showClose: boolean
    /** Обработчик нажатия на крестик */
    onClose?: () => void
    /** Признак доступности для нажатия */
    disabled?: boolean
  }>

/** Компонет Нажимабельного тега с возможностью закрытия
 * Используется для представления массива данных в виде меток
 */
export const Chip = (props: ChipProps) => {
  const { Icon, showClose, children, disabled = false, onClose, ...rest } = props
  const styles = useStyles()

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        disabled && styles.disabledChip,
        pressed && styles.highlightChip,
      ]}
    >
      {Icon && (
        <Icon
          size={styles.icon.height as number}
          style={[styles.icon, disabled && styles.disabledIcon]}
        />
      )}

      <Text numberOfLines={1} style={[styles.text, disabled && styles.disabledText]}>
        {children}
      </Text>

      {showClose && (
        <IconX
          disabled={disabled}
          size={styles.icon.height as number}
          style={[styles.icon, disabled && styles.disabledIcon]}
          onPress={onClose}
        />
      )}
    </Pressable>
  )
}
const useStyles = makeStyles<StylesObject>(({ theme }) => ({
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
    fontWeight: 400,
    verticalAlign: 'middle',
    color: theme.Misc.Chip.chipTextColor,
  },
  disabledText: {
    color: theme.General.textSecondaryColor,
  },
}))
