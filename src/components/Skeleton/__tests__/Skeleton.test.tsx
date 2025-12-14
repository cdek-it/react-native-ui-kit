import { render } from '@testing-library/react-native'
import { useMemo, type FC, type ReactNode } from 'react'
import { View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

import { SkeletonContext } from '../../../utils/SkeletonContext'
import { Skeleton } from '../Skeleton'

const createTestSharedValue = (value: number): SharedValue<number> =>
  ({ value }) as SharedValue<number>

const registerSkeleton = jest.fn()
const unregisterSkeleton = jest.fn()

const TestWrapper: FC<{
  readonly children: ReactNode
  readonly globalTranslateXValue: number
}> = ({ children, globalTranslateXValue }) => {
  const contextValue = useMemo(
    () => ({
      globalTranslateX: createTestSharedValue(globalTranslateXValue),
      registerSkeleton,
      unregisterSkeleton,
      skeletonWidth: 500,
    }),
    [globalTranslateXValue]
  )

  return (
    <SkeletonContext.Provider value={contextValue}>
      {children}
    </SkeletonContext.Provider>
  )
}

describe('Skeleton', () => {
  test('before animation started', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />, {
      wrapper: ({ children }) => (
        <TestWrapper globalTranslateXValue={-200}>{children}</TestWrapper>
      ),
    })

    expect(toJSON()).toMatchSnapshot('before animation started')
  })

  test('50% animation', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />, {
      wrapper: ({ children }) => (
        <TestWrapper globalTranslateXValue={100}>{children}</TestWrapper>
      ),
    })

    expect(toJSON()).toMatchSnapshot()
  })

  test('100% animation', () => {
    const { toJSON } = render(<Skeleton style={{ height: 50 }} />, {
      wrapper: ({ children }) => (
        <TestWrapper globalTranslateXValue={400}>{children}</TestWrapper>
      ),
    })

    expect(toJSON()).toMatchSnapshot()
  })

  test('skeleton registration', () => {
    registerSkeleton.mockReset()
    unregisterSkeleton.mockClear()

    const { rerender } = render(<Skeleton style={{ height: 50 }} />, {
      wrapper: ({ children }) => (
        <TestWrapper globalTranslateXValue={0}>{children}</TestWrapper>
      ),
    })

    expect(registerSkeleton).toHaveBeenCalledOnce()
    expect(unregisterSkeleton).not.toHaveBeenCalled()

    rerender(<View />)

    expect(unregisterSkeleton).toHaveBeenCalledOnce()
  })
})
