import { useMemo } from 'react'

import { makeStyles } from '../../../utils/makeStyles'

export const useStateStyles = (
  checked = false,
  disabled = false,
  pressed = false
) => {
  const styles = useStyles()

  const borderContainer = useMemo(
    () => [
      styles.borderContainer,
      pressed && styles.pressedBorderContainer,
      checked && styles.checkedBorderContainer,
      checked && pressed && styles.checkedPressedBorderContainer,
      disabled && styles.disabledBorderContainer,
    ],
    [
      checked,
      disabled,
      pressed,
      styles.borderContainer,
      styles.checkedBorderContainer,
      styles.checkedPressedBorderContainer,
      styles.disabledBorderContainer,
      styles.pressedBorderContainer,
    ]
  )

  const contentContainer = useMemo(
    () => [
      styles.contentContainer,
      pressed && styles.pressedContentContainer,
      checked && styles.checkedContentContainer,
      checked && pressed && styles.checkedPressedContentContainer,
      disabled && styles.disabledContentContainer,
    ],
    [
      checked,
      disabled,
      pressed,
      styles.checkedContentContainer,
      styles.checkedPressedContentContainer,
      styles.contentContainer,
      styles.disabledContentContainer,
      styles.pressedContentContainer,
    ]
  )

  const label = useMemo(
    () => [
      styles.label,
      pressed && styles.pressedLabel,
      checked && styles.checkedLabel,
      checked && pressed && styles.checkedPressedLabel,
      disabled && styles.disabledLabel,
    ],
    [
      checked,
      disabled,
      pressed,
      styles.checkedLabel,
      styles.checkedPressedLabel,
      styles.disabledLabel,
      styles.label,
      styles.pressedLabel,
    ]
  )

  return useMemo(
    () => ({ borderContainer, contentContainer, label }),
    [borderContainer, contentContainer, label]
  )
}

const useStyles = makeStyles(({ theme }) => ({
  borderContainer: {
    borderColor: theme.Form.ToggleButton.toggleButtonBorderColor,
  },
  pressedBorderContainer: {
    borderColor: theme.Form.ToggleButton.toggleButtonHoverBg,
  },
  checkedBorderContainer: {
    borderColor: theme.Form.ToggleButton.toggleButtonActiveBorderColor,
  },
  checkedPressedBorderContainer: {
    borderColor: theme.Form.ToggleButton.toggleButtonActiveHoverBorderColor,
  },
  disabledBorderContainer: {
    borderColor: theme.Button.Disabled.disabledButtonBorderColor,
    opacity: 0.6,
  },

  contentContainer: { backgroundColor: theme.Form.ToggleButton.toggleButtonBg },
  pressedContentContainer: {
    backgroundColor: theme.Form.ToggleButton.toggleButtonHoverBg,
  },
  checkedContentContainer: {
    backgroundColor: theme.Form.ToggleButton.toggleButtonActiveBg,
  },
  checkedPressedContentContainer: {
    backgroundColor: theme.Form.ToggleButton.toggleButtonActiveHoverBg,
  },
  disabledContentContainer: {
    backgroundColor: theme.Button.Disabled.disabledButtonBg,
  },

  label: { color: theme.Form.ToggleButton.toggleButtonTextColor },
  pressedLabel: { color: theme.Form.ToggleButton.toggleButtonHoverTextColor },
  checkedLabel: { color: theme.Form.ToggleButton.toggleButtonActiveTextColor },
  checkedPressedLabel: {
    color: theme.Form.ToggleButton.toggleButtonTextActiveHoverColor,
  },
  disabledLabel: { color: theme.Button.Disabled.disabledButtonTextColor },
}))
