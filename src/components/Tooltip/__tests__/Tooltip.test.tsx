import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { BackHandler, Dimensions, Modal, View } from 'react-native'

import { Tooltip, TooltipProvider } from '..'
import type { TooltipProps } from '../types'

const measureViewport = (callback: Parameters<View['measure']>[0]) =>
  callback(0, 0, 360, 740, 0, 0)
const layout = (width: number, height: number) => ({
  nativeEvent: { layout: { x: 0, y: 0, width, height } },
})
const measureContent = async () => {
  fireEvent(
    await screen.findByTestId('TooltipProbe'),
    'layout',
    layout(120, 40)
  )
}

const show = async () => {
  await measureContent()
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
  const content = (next: Partial<TooltipProps> = {}) => (
    <TooltipProvider>
      <Tooltip {...initialProps} {...next} />
    </TooltipProvider>
  )
  const result = render(content())

  return {
    ...result,
    props: initialProps,
    update: (next: Partial<TooltipProps>) => result.rerender(content(next)),
  }
}

describe('Tooltip', () => {
  beforeEach(() => {
    jest
      .spyOn(Dimensions, 'get')
      .mockReturnValue({ width: 360, height: 740, scale: 1, fontScale: 1 })
    jest.spyOn(View.prototype, 'measure').mockImplementation(measureViewport)
  })

  afterEach(() => jest.restoreAllMocks())

  test('показывает текст после измерения и скрывает при обновлении isVisible', async () => {
    const { update, UNSAFE_queryByType } = setup()
    await measureContent()

    expect(screen.getByTestId('TooltipBubble')).not.toBeVisible()

    fireEvent(screen.getByTestId('TooltipBubble'), 'layout', layout(120, 40))

    expect(screen.getByText('Подсказка')).toBeVisible()
    expect(UNSAFE_queryByType(Modal)).toBeNull()

    update({ isVisible: false })

    expect(screen.queryByText('Подсказка')).not.toBeOnTheScreen()
  })

  test('запрашивает закрытие при начале касания снаружи и ждёт обновления isVisible', async () => {
    const { props, update } = setup()
    await show()
    const touch = { nativeEvent: { pageX: 10, pageY: 10 } }
    fireEvent(screen.getByText('Подсказка'), 'pressIn', touch)

    expect(props.onClose).not.toHaveBeenCalled()

    fireEvent(screen.getByTestId('TooltipBackdrop'), 'pressIn', touch)

    expect(props.onClose).toHaveBeenCalledExactlyOnceWith()
    expect(screen.getByText('Подсказка')).toBeVisible()

    fireEvent.press(screen.getByTestId('TooltipBackdrop'), touch)

    expect(props.onClose).toHaveBeenCalledOnce()

    update({ isVisible: false })

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('запрашивает закрытие по Android Back и удаляет подписку после скрытия', async () => {
    const subscribe = jest.spyOn(BackHandler, 'addEventListener')
    const { props, update } = setup()
    await show()

    const back = subscribe.mock.calls.at(-1)?.[1]
    let handled: boolean | null | undefined
    act(() => {
      handled = back?.()
    })

    expect(handled).toBeTrue()
    expect(props.onClose).toHaveBeenCalledExactlyOnceWith()
    expect(screen.getByText('Подсказка')).toBeVisible()

    const subscription = subscribe.mock.results.at(-1)?.value
    const remove = jest.spyOn(subscription, 'remove')
    update({ isVisible: false })

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
    expect(remove).toHaveBeenCalledOnce()
  })

  test('не показывает подсказку при отсутствующем якоре', async () => {
    setup({ anchorRef: { current: null } })
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('не создаёт overlay для якоря за экраном', async () => {
    const anchor: Pick<View, 'measure'> = {
      measure: (callback) => callback(0, 0, 40, 40, 100, 1000),
    }
    setup({ anchorRef: { current: anchor as View } })
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('не создаёт overlay, пока закрыт', () => {
    setup({ isVisible: false })

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('обновляет текст после повторного измерения', async () => {
    const { update } = setup()
    await show()
    update({ text: 'Новый текст' })
    await measureContent()

    expect(screen.getByTestId('TooltipBubble')).not.toBeVisible()

    fireEvent(screen.getByTestId('TooltipBubble'), 'layout', layout(120, 40))

    expect(screen.getByText('Новый текст')).toBeVisible()
    expect(screen.queryByText('Подсказка')).not.toBeOnTheScreen()
  })

  test('размещает подсказку относительно смещённого провайдера в координатах viewport', async () => {
    jest
      .mocked(View.prototype.measure)
      .mockImplementation((callback) => callback(0, 0, 300, 600, 24, 100))
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
    setup({
      anchorRef: { current: anchor as View },
      testID: 'PositionedTooltip',
    })
    await show()

    expect(measure).toHaveBeenCalledWith(expect.any(Function))
    expect(measureInWindow).not.toHaveBeenCalled()
    expect(screen.getByTestId('PositionedTooltip')).toBeVisible()
    expect(screen.getByTestId('PositionedTooltip')).toHaveStyle({
      left: 96,
      top: 152.5,
    })
  })
})
