import { IconArrowDownRight } from '@tabler/icons-react-native'
import { render, userEvent } from '@testing-library/react-native'

import {
  ToggleButton,
  type ToggleButtonProps,
  ToggleButtonTestId,
} from '../ToggleButton'

describe('ToggleButton', () => {
  const defaultProps: ToggleButtonProps = { onPress: jest.fn() }

  describe('snapshots', () => {
    const snapshotCases: Array<[string, Partial<ToggleButtonProps>]> = [
      ['default', {}],
      [
        'checked = true, disabled = false, iconOnly = false, size = xlarge, with style, with Icon',
        {
          checked: true,
          disabled: false,
          iconOnly: false,
          size: 'xlarge',
          style: { margin: 10 },
          Icon: IconArrowDownRight,
        },
      ],
      [
        'checked = false, disabled = true, iconOnly = false, size = large, with Icon, with label',
        {
          checked: false,
          disabled: true,
          iconOnly: false,
          size: 'large',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = true, size = base, with Icon, with label',
        {
          checked: false,
          disabled: false,
          iconOnly: true,
          size: 'base',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = false, size = small, with Icon, with label, iconPos = left',
        {
          checked: false,
          disabled: false,
          iconOnly: false,
          size: 'small',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
          iconPos: 'left',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = false, size = small, with Icon, with label, iconPos = right',
        {
          checked: false,
          disabled: false,
          iconOnly: false,
          size: 'small',
          Icon: IconArrowDownRight,
          label: 'ButtonToggle',
          iconPos: 'right',
        },
      ],
      [
        'checked = false, disabled = false, iconOnly = true, size = base, with PNG Icon',
        {
          checked: false,
          disabled: false,
          iconOnly: true,
          size: 'base',
          Image: require('../hotels.png'),
        },
      ],
    ]

    beforeAll(() => {
      jest.mock(
        'react-native/Libraries/Components/Pressable/Pressable',
        () => ({ default: 'Pressable' })
      )
    })

    afterAll(() => {
      jest.unmock('react-native/Libraries/Components/Pressable/Pressable')
    })

    test.each(snapshotCases)('%s', (_, props) => {
      const { toJSON } = render(<ToggleButton {...defaultProps} {...props} />)

      expect(toJSON()).toMatchSnapshot()
    })
  })

  test('should render PNG Icon as Image', () => {
    const { getByTestId } = render(
      <ToggleButton
        {...defaultProps}
        iconOnly
        Image={require('../hotels.png')}
      />
    )
    const icon = getByTestId(ToggleButtonTestId.icon)

    expect(icon.type).toBe('Image')
  })

  test('should render SVG Icon as Svg (uri)', async () => {
    const originalFetch = global.fetch
    jest
      .spyOn(global, 'fetch')
      .mockImplementation()
      .mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          '<svg width="10" height="10"><path d="M0 0h10v10H0z" /></svg>',
      } as Response)

    try {
      const { findByTestId } = render(
        <ToggleButton
          {...defaultProps}
          iconOnly
          Icon={{ uri: 'https://example.com/icon.svg' }}
        />
      )
      const icon = await findByTestId(ToggleButtonTestId.icon)

      expect(icon.type).toBe('RNSVGSvgView')
    } finally {
      global.fetch = originalFetch
    }
  })

  test('should render SVG Icon as Svg (xml)', () => {
    const { getByTestId } = render(
      <ToggleButton
        {...defaultProps}
        iconOnly
        Icon={{
          xml: '<svg width="10" height="10"><path d="M0 0h10v10H0z" /></svg>',
        }}
      />
    )
    const icon = getByTestId(ToggleButtonTestId.icon)

    expect(icon.type).toBe('RNSVGSvgView')
  })

  test('should render non-svg uri Icon as Image', () => {
    const { getByTestId } = render(
      <ToggleButton
        {...defaultProps}
        iconOnly
        Image={{ uri: 'https://example.com/icon.png' }}
      />
    )
    const icon = getByTestId(ToggleButtonTestId.icon)

    expect(icon.type).toBe('Image')
  })

  test('should render numeric Icon as Image', () => {
    const { getByTestId } = render(
      <ToggleButton {...defaultProps} iconOnly Image={1} />
    )
    const icon = getByTestId(ToggleButtonTestId.icon)

    expect(icon.type).toBe('Image')
  })

  test('should handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(<ToggleButton onPress={mockedOnPress} />)
    const pressable = queryByTestId(ToggleButtonTestId.root)
    const user = userEvent.setup()

    await user.press(pressable)

    expect(mockedOnPress).toHaveBeenCalledWith(expect.any(Object))
  })

  test('should NOT handle press', async () => {
    const mockedOnPress = jest.fn()
    const { queryByTestId } = render(
      <ToggleButton disabled onPress={mockedOnPress} />
    )
    const pressable = queryByTestId(ToggleButtonTestId.root)
    const user = userEvent.setup()

    await user.press(pressable)

    expect(mockedOnPress).not.toHaveBeenCalled()
  })
})
