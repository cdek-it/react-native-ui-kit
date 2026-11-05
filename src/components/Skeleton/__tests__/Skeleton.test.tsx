import { render } from '@testing-library/react-native'
import type { SharedValue } from 'react-native-reanimated'

import { SkeletonContext } from '../../../utils/SkeletonContext'
import { SkeletonTestId } from '../Skeleton'
import { Skeleton } from '../index'

describe('Skeleton', () => {
  test('передаёт свойства корневому View и сохраняет пользовательский testID', () => {
    const { getByTestId } = render(
      <Skeleton nativeID='SkeletonPlaceholder' testID='CustomSkeleton' />
    )

    expect(getByTestId('CustomSkeleton')).toHaveProp(
      'nativeID',
      'SkeletonPlaceholder'
    )
  })

  test('остаётся декоративным даже при переданном accessible', () => {
    const { getByTestId } = render(<Skeleton accessible />)

    const root = getByTestId(SkeletonTestId.root)
    const svg = getByTestId(SkeletonTestId.svg)

    expect(root.props.accessible).toBeFalse()
    expect(svg.props.accessible).toBeFalse()
    expect(root.props.accessibilityRole).toBeUndefined()
    expect(root.props.accessibilityLabel).toBeUndefined()
    expect(root.props.accessibilityState).toBeUndefined()
  })

  test('регистрируется при монтировании и снимает регистрацию при удалении', () => {
    const registerSkeleton = jest.fn()
    const unregisterSkeleton = jest.fn()
    const contextValue = {
      globalTranslateX: { value: 0 } as SharedValue<number>,
      registerSkeleton,
      unregisterSkeleton,
      skeletonWidth: 500,
    }
    const { rerender, unmount } = render(
      <SkeletonContext.Provider value={contextValue}>
        <Skeleton />
      </SkeletonContext.Provider>
    )

    expect(registerSkeleton).toHaveBeenCalledOnce()
    expect(unregisterSkeleton).not.toHaveBeenCalled()

    rerender(
      <SkeletonContext.Provider value={contextValue}>
        <Skeleton nativeID='UpdatedSkeleton' />
      </SkeletonContext.Provider>
    )

    expect(registerSkeleton).toHaveBeenCalledOnce()
    expect(unregisterSkeleton).not.toHaveBeenCalled()

    unmount()

    expect(unregisterSkeleton).toHaveBeenCalledOnce()
  })
})
