import { act, renderHook } from '@testing-library/react-native'
import { useContext } from 'react'

import {
  SKELETON_ANIMATION_DURATION,
  SkeletonContext,
  SkeletonContextProvider,
} from '../SkeletonContext'

// Mock Dimensions API
const mockDimensions = { width: 400, height: 800, scale: 2, fontScale: 2 }

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.Dimensions.get = () => mockDimensions

  return RN
})

describe('SkeletonContext', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderSkeletonHook = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SkeletonContextProvider>{children}</SkeletonContextProvider>
    )
    const { result } = renderHook(() => useContext(SkeletonContext), {
      wrapper,
    })

    return result
  }

  test('should provide initial values', () => {
    const result = renderSkeletonHook()

    expect(result.current.skeletonWidth).toBe(mockDimensions.width)
    expect(result.current.globalTranslateX.value).toBe(-mockDimensions.width)
  })

  test('should start animation on first registration and stop on last un-registration', () => {
    const result = renderSkeletonHook()

    expect(result.current.globalTranslateX.value).toBe(-mockDimensions.width)

    act(() => {
      result.current.registerSkeleton()
    })

    act(() => {
      jest.advanceTimersByTime(SKELETON_ANIMATION_DURATION / 2)
    })

    expect(result.current.globalTranslateX.value).not.toBe(
      -mockDimensions.width
    )
    expect(result.current.globalTranslateX.value).not.toBe(mockDimensions.width)

    act(() => {
      jest.advanceTimersByTime(SKELETON_ANIMATION_DURATION / 2)
    })

    expect(result.current.globalTranslateX.value).toBe(mockDimensions.width)

    act(() => {
      result.current.unregisterSkeleton()
    })

    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(result.current.globalTranslateX.value).toBe(-mockDimensions.width)
  })

  test('should handle multiple registrations and un-registrations', () => {
    const result = renderSkeletonHook()

    act(() => {
      result.current.registerSkeleton()
      result.current.registerSkeleton()
    })

    act(() => {
      jest.advanceTimersByTime(SKELETON_ANIMATION_DURATION / 2)
    })

    expect(result.current.globalTranslateX.value).not.toBe(
      -mockDimensions.width
    )

    act(() => {
      result.current.unregisterSkeleton()
    })

    act(() => {
      jest.advanceTimersByTime(SKELETON_ANIMATION_DURATION / 2)
    })

    expect(result.current.globalTranslateX.value).not.toBe(
      -mockDimensions.width
    )

    act(() => {
      result.current.unregisterSkeleton()
    })
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(result.current.globalTranslateX.value).toBe(-mockDimensions.width)
  })
})
