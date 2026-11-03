import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { AccessibilityInfo, Dimensions, View } from 'react-native'

import { Tooltip } from '..'
import type { TooltipProps } from '../types'

const measureViewport = (callback: Parameters<View['measure']>[0]) =>
  callback(0, 0, 360, 740, 0, 0)
const layout = (width: number, height: number) => ({
  nativeEvent: { layout: { x: 0, y: 0, width, height } },
})
const show = async () => {
  await expect(
    screen.findByTestId('TooltipViewport')
  ).resolves.toBeOnTheScreen()

  fireEvent(screen.getByTestId('TooltipViewport'), 'layout', layout(360, 740))
  fireEvent(
    await screen.findByTestId('TooltipProbe'),
    'layout',
    layout(120, 40)
  )
  fireEvent(screen.getByTestId('TooltipBubble'), 'layout', layout(120, 40))
}

const setup = (props: Partial<TooltipProps> = {}) => {
  const anchor: Pick<View, 'measure'> = {
    measure: (callback) => callback(0, 0, 60, 40, 150, 300),
  }
  const initialProps: TooltipProps = {
    anchorRef: { current: anchor as View },
    isVisible: true,
    onClose: jest.fn(),
    text: 'Подсказка',
    ...props,
  }
  const result = render(<Tooltip {...initialProps} />)

  return {
    ...result,
    props: initialProps,
    update: (next: Partial<TooltipProps>) =>
      result.rerender(<Tooltip {...initialProps} {...next} />),
  }
}

describe('Tooltip', () => {
  beforeEach(() => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 360, height: 740, scale: 1, fontScale: 1 })
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValue(false)
    jest.spyOn(View.prototype, 'measure').mockImplementation(measureViewport)
  })

  afterEach(() => jest.restoreAllMocks())

  test('показывает текст после измерения и скрывает при обновлении isVisible', async () => {
    const { update } = setup()
    await show()

    expect(screen.getByText('Подсказка')).toBeOnTheScreen()

    update({ isVisible: false })

    expect(screen.queryByText('Подсказка')).not.toBeOnTheScreen()
  })

  test('сохраняет доступные ориентации экрана при открытии', async () => {
    setup()
    const modal = await screen.findByTestId('TooltipModal')

    expect(modal.props.supportedOrientations).toStrictEqual(
      expect.arrayContaining(['portrait', 'landscape-left', 'landscape-right'])
    )
  })

  test('не создаёт overlay при isVisible=false', async () => {
    setup({ isVisible: false })
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('запрашивает закрытие без события и ждёт обновления isVisible', async () => {
    const { props } = setup()
    await show()
    fireEvent.press(screen.getByTestId('TooltipBackdrop'))

    expect(props.onClose).toHaveBeenCalledExactlyOnceWith()
    expect(screen.getByText('Подсказка')).toBeOnTheScreen()

    fireEvent(screen.getByTestId('TooltipModal'), 'requestClose')

    expect(props.onClose).toHaveBeenCalledTimes(2)
  })

  test('не показывает подсказку при отсутствующем якоре', async () => {
    setup({ anchorRef: { current: null } })
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('не создаёт пустой Modal для якоря за экраном', async () => {
    const anchor: Pick<View, 'measure'> = {
      measure: (callback) => callback(0, 0, 40, 40, 100, 1000),
    }
    setup({ anchorRef: { current: anchor as View } })
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipModal')).not.toBeOnTheScreen()
  })

  test('не запрашивает состояние читалки и не подписывается, пока закрыт', async () => {
    const query = jest
      .mocked(AccessibilityInfo.isScreenReaderEnabled)
      .mockClear()
    const subscribe = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockClear()
    setup({ isVisible: false })
    await act(() => Promise.resolve())

    expect(query).not.toHaveBeenCalled()
    expect(subscribe).not.toHaveBeenCalledWith(
      'screenReaderChanged',
      expect.any(Function)
    )
  })

  test('сохраняет Modal при изменении текста', async () => {
    const { update } = setup()
    await show()
    const modal = screen.getByTestId('TooltipModal')
    update({ text: 'Новый текст' })
    await show()

    expect(screen.getByTestId('TooltipModal') === modal).toBeTrue()
  })

  test('сохраняет Modal при изменении предпочтительной стороны', async () => {
    const { update } = setup()
    await show()
    const modal = screen.getByTestId('TooltipModal')
    update({ position: 'bottom' })
    await show()

    expect(screen.getByTestId('TooltipModal') === modal).toBeTrue()
  })

  test('сохраняет Modal при изменении окна до завершения нового измерения якоря', async () => {
    let deferred = false
    let finishMeasurement: Parameters<View['measure']>[0] | undefined
    const anchor: Pick<View, 'measure'> = {
      measure: (callback) => {
        if (deferred) finishMeasurement = callback
        else callback(0, 0, 60, 40, 100, 600)
      },
    }
    setup({ anchorRef: { current: anchor as View } })
    await show()
    const modal = screen.getByTestId('TooltipModal')
    const original = Dimensions.get('window')
    const resized = { width: 740, height: 360, scale: 1, fontScale: 1 }
    deferred = true
    jest.mocked(Dimensions.get).mockReturnValue(resized)
    act(() => Dimensions.set({ window: resized, screen: resized }))

    expect(screen.queryByTestId('TooltipModal') === modal).toBeTrue()

    act(() => finishMeasurement?.(0, 0, 60, 40, 100, 200))

    expect(screen.getByTestId('TooltipModal') === modal).toBeTrue()

    deferred = false
    jest.mocked(Dimensions.get).mockReturnValue(original)
    act(() => Dimensions.set({ window: original, screen: original }))
  })

  test('использует измерение viewport для якоря и overlay', async () => {
    const measure = jest.fn<
      ReturnType<View['measure']>,
      Parameters<View['measure']>
    >()
    measure.mockImplementation((callback) => callback(0, 0, 60, 40, 150, 300))
    const measureInWindow = jest.fn<
      ReturnType<View['measureInWindow']>,
      Parameters<View['measureInWindow']>
    >()
    measureInWindow.mockImplementation((callback) => callback(150, 276, 60, 40))
    const anchor: Pick<View, 'measure' | 'measureInWindow'> = {
      measure,
      measureInWindow,
    }
    setup({ anchorRef: { current: anchor as View } })
    await show()

    expect(measure).toHaveBeenCalledWith(expect.any(Function))
    expect(measureInWindow).not.toHaveBeenCalled()
  })

  test('повторно измеряет изменившийся текст', async () => {
    const { update } = setup()
    await show()
    update({ text: 'Новый текст' })
    await show()

    expect(screen.getByText('Новый текст')).toBeOnTheScreen()
    expect(screen.queryByText('Подсказка')).not.toBeOnTheScreen()
  })
})
