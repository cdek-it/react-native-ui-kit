import { render, userEvent } from '@testing-library/react-native'

import {
  DialogHeader,
  DialogHeaderTestId,
  type DialogHeaderProps,
} from '../DialogHeader'

describe('DialogHeader', () => {
  const title = 'Dialog Title'
  const onClose = jest.fn()

  const snapshotCases = generatePropsCombinations<DialogHeaderProps>({
    title: [title],
    onClose: [onClose, undefined],
    severity: ['danger', 'warning', 'info', 'success', 'help', undefined],
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each(snapshotCases)('%p', (props) => {
    const { toJSON } = render(<DialogHeader {...props} />)

    expect(toJSON()).toMatchSnapshot()
  })

  test('при нажатии на крестик вызывается onClose', async () => {
    const { getByTestId } = render(
      <DialogHeader title={title} onClose={onClose} />
    )

    expect(onClose).not.toHaveBeenCalled()

    const user = userEvent.setup()
    await user.press(getByTestId(DialogHeaderTestId.closeButton))

    expect(onClose).toHaveBeenCalledWith(expect.any(Object))
  })
})
