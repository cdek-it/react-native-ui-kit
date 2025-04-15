import { IconLink } from '@tabler/icons-react-native'
import { fireEvent, render, userEvent } from '@testing-library/react-native'

import { Anchor, type AnchorProps, AnchorTestId } from '../Anchor'

describe('Body component tests', () => {
  const defaultProps: AnchorProps = { onPress: jest.fn() }

  test('default props', () => {
    const renderedAnchor = render(<Anchor {...defaultProps}>link</Anchor>)

    expect(renderedAnchor.toJSON()).toMatchSnapshot()
  })

  test('левая иконка, base, visited, testID = CustomAnchorId', () => {
    const renderedAnchor = render(
      <Anchor
        {...defaultProps}
        base
        visited
        LeftIcon={IconLink}
        testID='CustomAnchorId'
      >
        link
      </Anchor>
    )

    expect(renderedAnchor.toJSON()).toMatchSnapshot()
  })

  test('правая иконка, noWrapper', () => {
    const renderedAnchor = render(
      <Anchor {...defaultProps} noWrapper RightIcon={IconLink}>
        link
      </Anchor>
    )

    expect(renderedAnchor.toJSON()).toMatchSnapshot()
  })

  test('левая иконка, правая иконка', () => {
    const renderedAnchor = render(
      <Anchor {...defaultProps} LeftIcon={IconLink} RightIcon={IconLink}>
        link
      </Anchor>
    )

    expect(renderedAnchor.toJSON()).toMatchSnapshot()
  })

  test('при нажатии на левую иконку текст подчеркивается', () => {
    const { getByTestId } = render(
      <Anchor {...defaultProps} LeftIcon={IconLink}>
        link
      </Anchor>
    )

    const leftIconPressable = getByTestId(AnchorTestId.leftPressable)
    fireEvent(leftIconPressable, 'pressIn')

    expect(getByTestId(AnchorTestId.text)).toHaveStyle({
      textDecorationLine: 'underline',
    })

    fireEvent(leftIconPressable, 'pressOut')

    expect(getByTestId(AnchorTestId.text)).not.toHaveStyle({
      textDecorationLine: 'underline',
    })
  })

  test('при нажатии на правую иконку текст подчеркивается', () => {
    const { getByTestId } = render(
      <Anchor {...defaultProps} RightIcon={IconLink}>
        link
      </Anchor>
    )

    const rightIconPressable = getByTestId(AnchorTestId.rightPressable)
    fireEvent(rightIconPressable, 'pressIn')

    expect(getByTestId(AnchorTestId.text)).toHaveStyle({
      textDecorationLine: 'underline',
    })

    fireEvent(rightIconPressable, 'pressOut')

    expect(getByTestId(AnchorTestId.text)).not.toHaveStyle({
      textDecorationLine: 'underline',
    })
  })

  test('при нажатии на текст текст подчеркивается', () => {
    const { getByTestId } = render(<Anchor {...defaultProps}>link</Anchor>)

    const text = getByTestId(AnchorTestId.text)
    fireEvent(text, 'pressIn')

    expect(getByTestId(AnchorTestId.text)).toHaveStyle({
      textDecorationLine: 'underline',
    })

    fireEvent(text, 'pressOut')

    expect(getByTestId(AnchorTestId.text)).not.toHaveStyle({
      textDecorationLine: 'underline',
    })
  })

  test('при нажатии на левую, правую иконки, либо на текст, вызывается onPress', async () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <Anchor LeftIcon={IconLink} RightIcon={IconLink} onPress={mockOnPress}>
        link
      </Anchor>
    )
    const user = userEvent.setup()

    expect(mockOnPress).not.toHaveBeenCalled()

    await user.press(getByTestId(AnchorTestId.leftPressable))
    await user.press(getByTestId(AnchorTestId.rightPressable))
    await user.press(getByTestId(AnchorTestId.text))

    expect(mockOnPress).toHaveBeenCalledTimes(3)
  })
})
