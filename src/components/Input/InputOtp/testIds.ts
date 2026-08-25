export const createInputOtpTestIds = (prefix: string) => ({
  root: prefix,
  content: `${prefix}Content`,
  item: `${prefix}Item`,
  itemContainer: `${prefix}ItemContainer`,
  cursorRow: `${prefix}ItemCursorRow`,
  cursor: `${prefix}ItemCursor`,
  hiddenInput: `${prefix}HiddenInput`,
})

export const InputOtpTestId = createInputOtpTestIds('InputOtp')
