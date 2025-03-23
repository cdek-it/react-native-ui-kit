import { render } from '@testing-library/react-native'

import Animated from 'react-native-reanimated'

import { useLoadingRotationAnimation } from '../useLoadingRotationAnimation'

const TestComponent = ({ loading = false }: { readonly loading?: boolean }) => {
  const animatedStyle = useLoadingRotationAnimation(loading)

  return <Animated.View style={animatedStyle} testID='AnimatedView' />
}

describe('useLoadingRotationAnimation', () => {
  test('styles are calculated correctly', () => {
    jest.useFakeTimers()

    const { getByTestId, update } = render(<TestComponent />)

    jest.advanceTimersByTime(500)

    expect(getByTestId('AnimatedView')).toHaveAnimatedStyle(
      { transform: [{ rotate: '0deg' }] },
      { shouldMatchAllProps: true }
    )

    update(<TestComponent loading />)
    jest.advanceTimersByTime(1500)

    expect(getByTestId('AnimatedView')).toHaveAnimatedStyle(
      { transform: [{ rotate: '180deg' }] },
      { shouldMatchAllProps: true }
    )
  })
})
