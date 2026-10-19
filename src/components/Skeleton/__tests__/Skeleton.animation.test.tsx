import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { View } from 'react-native'
import { makeMutable } from 'react-native-reanimated'

import { SkeletonContext } from '../../../utils/SkeletonContext'
import { Skeleton, SkeletonTestId } from '../Skeleton'

describe('Skeleton animation', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('сдвигает градиент с учётом общей координаты и изменений позиции Skeleton', async () => {
    const globalTranslateX = makeMutable(100)
    jest
      .spyOn(View.prototype, 'measure')
      .mockImplementationOnce((callback) => callback(0, 0, 100, 20, 40, 0))
      .mockImplementationOnce((callback) => callback(0, 0, 100, 20, 80, 0))

    const { getByTestId } = render(
      <SkeletonContext.Provider
        value={{
          globalTranslateX,
          registerSkeleton: jest.fn(),
          unregisterSkeleton: jest.fn(),
          skeletonWidth: 400,
        }}
      >
        <Skeleton />
      </SkeletonContext.Provider>
    )
    const gradient = getByTestId(SkeletonTestId.animatedView)
    const root = getByTestId(SkeletonTestId.root)

    expect(gradient).toHaveAnimatedStyle({ transform: [{ translateX: 100 }] })

    act(() => {
      globalTranslateX.value = 200
    })

    await waitFor(() => {
      expect(gradient).toHaveAnimatedStyle({ transform: [{ translateX: 200 }] })
    })

    fireEvent(root, 'layout')

    await waitFor(() => {
      expect(gradient).toHaveAnimatedStyle({ transform: [{ translateX: 160 }] })
    })

    fireEvent(root, 'layout')

    await waitFor(() => {
      expect(gradient).toHaveAnimatedStyle({ transform: [{ translateX: 120 }] })
    })
  })
})
