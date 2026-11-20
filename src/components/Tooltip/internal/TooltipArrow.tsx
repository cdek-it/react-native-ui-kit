import { Path, Svg, type SvgProps } from 'react-native-svg'
import { StyleSheet } from 'react-native-unistyles'

// Размеры исходного SVG из Figma, без масштабирования при повороте.
export const ARROW_WIDTH = 7
export const ARROW_DEPTH = 3.5

export const TooltipArrow = ({
  color,
  style,
}: Pick<SvgProps, 'color' | 'style'>) => (
  <Svg
    color={color}
    fill='none'
    height={ARROW_DEPTH}
    preserveAspectRatio='none'
    style={[styles.root, style]}
    viewBox='0 0 7 3.5'
    width={ARROW_WIDTH}
  >
    <Path d='M3.5 3.5L7 0H0L3.5 3.5Z' fill='currentColor' />
  </Svg>
)

const styles = StyleSheet.create({ root: { overflow: 'visible' } })
