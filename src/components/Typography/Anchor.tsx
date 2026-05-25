import { Fragment, memo, useCallback, useMemo, useState } from 'react'

import {
  Pressable,
  type StyleProp,
  Text,
  type TextProps,
  type TextStyle,
  View,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import type { ThemeType } from '../../theme/types'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

const WORD_JOINER = '\u2060' // символ невидимого пробела, чтобы избежать разрыва строки между текстом и иконкой

export interface AnchorProps extends Omit<
  TextProps,
  'onPressIn' | 'onPressOut'
> {
  readonly onPress: () => void
  /** true, если необходим базовый размер текста ссылки, равный 14 */
  readonly base?: boolean
  /** true, если необходимо состояние посещенной ссылки. Меняет цвет */
  readonly visited?: boolean
  /**
   * Используется для рендера ссылки в составе другого текста.
   * Если true, компонент оборачивается во фрагмент вместо обычного View
   */
  readonly noWrapper?: boolean
  /** Кастомные стили, применяемые к тексту */
  readonly style?: StyleProp<TextStyle>
  readonly LeftIcon?: SvgSource
  readonly RightIcon?: SvgSource
}

/**
 * Используется для ссылок и якорей
 * @see https://www.figma.com/design/2ZnL6XPKEpxAHvrlbRvnMu/Template-Tailwind-CSS--DS-?node-id=1-271
 */
export const Anchor = memo(
  ({
    onPress,
    base,
    visited,
    children,
    noWrapper,
    LeftIcon,
    RightIcon,
    testID,
    style,
    ...other
  }: AnchorProps) => {
    const [pressed, setPressed] = useState(false)
    const onPressIn = useCallback(() => setPressed(true), [])
    const onPressOut = useCallback(() => setPressed(false), [])

    const Wrapper = noWrapper ? Fragment : View
    const containerProps = useMemo(() => {
      if (noWrapper) {
        return {}
      }

      return { style: styles.container, testID: testID || AnchorTestId.root }
    }, [noWrapper, testID])

    const iconSize = base ? styles.iconBase : styles.icon
    const iconUniProps = ({ typography: t }: ThemeType) => ({
      color: visited
        ? t.Color.Service['text-help']
        : t.Color.Service['text-info'],
    })

    return (
      <Wrapper {...containerProps}>
        {LeftIcon ? (
          <Pressable
            style={styles.leftIconContainer}
            testID={AnchorTestId.leftPressable}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <SvgUniversal
              {...iconSize}
              source={LeftIcon}
              testID={AnchorTestId.leftIcon}
              uniProps={iconUniProps}
            />
          </Pressable>
        ) : null}
        <Text
          suppressHighlighting
          style={[
            styles.text,
            pressed && styles.underlined,
            base && styles.base,
            visited && styles.visited,
            style,
          ]}
          testID={AnchorTestId.text}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          {...other}
        >
          {LeftIcon ? WORD_JOINER : null}
          {children}
          {RightIcon ? WORD_JOINER : null}
        </Text>

        {RightIcon ? (
          <Pressable
            style={styles.rightIconContainer}
            testID={AnchorTestId.rightPressable}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <SvgUniversal
              {...iconSize}
              source={RightIcon}
              testID={AnchorTestId.rightIcon}
              uniProps={iconUniProps}
            />
          </Pressable>
        ) : null}
      </Wrapper>
    )
  }
)

const styles = StyleSheet.create(({ spacing, typography, fonts }) => ({
  container: { flexDirection: 'row', alignItems: 'center' },
  text: {
    flexShrink: 1,
    fontSize: typography.Size['text-sm'],
    includeFontPadding: false,
    verticalAlign: 'middle',
    color: typography.Color.Service['text-info'],
    fontFamily: fonts.primary,
  },
  underlined: { textDecorationLine: 'underline' },
  base: { fontSize: typography.Size['text-base'], fontFamily: fonts.secondary },
  visited: { color: typography.Color.Service['text-help'] },
  icon: {
    width: typography.Size['text-base'],
    height: typography.Size['text-base'],
  },
  iconBase: {
    width: typography.Size['text-xl'],
    height: typography.Size['text-xl'],
  },
  leftIconContainer: { paddingRight: spacing.Padding['p-2'] },
  rightIconContainer: { paddingLeft: spacing.Padding['p-2'] },
}))

export const AnchorTestId = {
  root: 'Anchor',
  leftPressable: 'AnchorLeftPressable',
  rightPressable: 'AnchorRightPressable',
  leftIcon: 'LeftIcon',
  rightIcon: 'RightIcon',
  text: 'AnchorText',
}
