import { act, render, screen } from '@testing-library/react-native'
import {
  AccessibilityInfo,
  type NativeEventSubscription,
  View,
} from 'react-native'

import { Tooltip, TooltipProvider } from '..'

const anchor: Pick<View, 'measure'> = {
  measure: (callback) => callback(0, 0, 40, 40, 100, 200),
}
const anchorRef = { current: anchor as View }

describe('Tooltip — доступность', () => {
  beforeEach(() => {
    jest
      .spyOn(View.prototype, 'measure')
      .mockImplementation((callback) => callback(0, 0, 360, 740, 0, 0))
  })

  afterEach(() => jest.restoreAllMocks())

  test('не открывает overlay до определения состояния читалки', () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockReturnValue(new Promise<boolean>(jest.fn()))
    render(
      <TooltipProvider>
        <Tooltip
          isVisible
          anchorRef={anchorRef}
          text='Пояснение'
          onClose={jest.fn()}
        />
      </TooltipProvider>
    )

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
  })

  test('не создаёт overlay и не запрашивает закрытие при включённой читалке', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValue(true)
    const onClose = jest.fn()
    render(
      <TooltipProvider>
        <Tooltip
          isVisible
          anchorRef={anchorRef}
          text='Пояснение'
          onClose={onClose}
        />
      </TooltipProvider>
    )
    await act(() => Promise.resolve())

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
    expect(onClose).not.toHaveBeenCalled()
  })

  test('реагирует на включение читалки и удаляет подписку при размонтировании', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
      .mockResolvedValue(false)
    const subscription = jest.spyOn(
      AccessibilityInfo as {
        addEventListener: (
          event: 'screenReaderChanged',
          listener: (enabled: boolean) => void
        ) => NativeEventSubscription
      },
      'addEventListener'
    )
    const onClose = jest.fn()
    const { unmount } = render(
      <TooltipProvider>
        <Tooltip
          isVisible
          anchorRef={anchorRef}
          text='Пояснение'
          onClose={onClose}
        />
      </TooltipProvider>
    )

    await expect(
      screen.findByTestId('TooltipViewport')
    ).resolves.toBeOnTheScreen()

    const nativeSubscription = subscription.mock.results.at(-1)
      ?.value as ReturnType<typeof AccessibilityInfo.addEventListener>
    const remove = jest.spyOn(nativeSubscription, 'remove')
    const listener = subscription.mock.calls.at(-1)?.[1]
    act(() => listener?.(true))

    expect(screen.queryByTestId('TooltipViewport')).not.toBeOnTheScreen()
    expect(onClose).not.toHaveBeenCalled()

    unmount()

    expect(remove).toHaveBeenCalledOnce()
  })
})
