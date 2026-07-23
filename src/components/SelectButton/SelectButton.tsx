import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type AccessibilityProps,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native'
import Animated, {
  Easing,
  interpolate,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { StyleSheet } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'

import {
  SelectButtonItem,
  type SelectButtonItemProps,
} from './SelectButtonItem'

const DEFAULT_ANIMATION_DURATION = 200 // ms

interface SelectButtonBaseProps
  extends AccessibilityProps, Pick<ViewProps, 'testID'> {
  /** Массив кнопок. Должен содержать как минимум 2 кнопки. */
  buttons: Array<
    Pick<
      SelectButtonItemProps,
      'accessibilityLabel' | 'label' | 'showIcon' | 'Icon'
    > & { key: string }
  >

  /** true - если кнопки недоступны для нажатия */
  disabled?: boolean

  /** Вызывается при нажатии на кнопку */
  onPress?: (index: number) => void

  /**
   * Выбор размера элемента
   * @default 'base'
   */
  size?: 'small' | 'base' | 'large' | 'xlarge'

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>
}

/**
 * `position` имеет приоритет над `selectedIndex`, а `selectedIndex` — над
 * `initialIndex`. Одновременная передача сохранена для обратной совместимости.
 */
export interface SelectButtonProps extends SelectButtonBaseProps {
  /** Индекс выбранной кнопки при первом рендере */
  initialIndex?: number

  /** Индекс выбранной кнопки в контролируемом режиме */
  selectedIndex?: number

  /** Значение позиции для синхронизации с внешней анимацией */
  position?: SharedValue<number>
}

interface UncontrolledSelectButtonModeProps {
  /** Индекс выбранной кнопки при первом рендере */
  initialIndex?: number
  selectedIndex?: never
  position?: never
}

interface ControlledSelectButtonModeProps {
  initialIndex?: never

  /**
   * Индекс выбранной кнопки 0...n-1, где n — количество кнопок.
   * При изменении анимирует внутреннее значение позиции.
   */
  selectedIndex: number
  position?: never
}

interface AnimatedSelectButtonModeProps {
  initialIndex?: never
  selectedIndex?: never

  /**
   * Анимированное значение 0...n-1, где n - это количество кнопок.
   * Используется для синхронизации с внешней анимацией.
   */
  position: SharedValue<number>
}

type StrictSelectButtonProps = SelectButtonBaseProps &
  (
    | UncontrolledSelectButtonModeProps
    | ControlledSelectButtonModeProps
    | AnimatedSelectButtonModeProps
  )

// TODO(next major): экспортировать StrictSelectButtonProps как SelectButtonProps, после миграции удалить адаптер и тесты
const normalizeSelectButtonProps = ({
  initialIndex,
  position,
  selectedIndex,
  ...baseProps
}: SelectButtonProps): StrictSelectButtonProps => {
  if (position !== undefined) {
    return { ...baseProps, position }
  }

  if (selectedIndex !== undefined) {
    return { ...baseProps, selectedIndex }
  }

  return { ...baseProps, initialIndex }
}

const SelectButtonStrict = memo<StrictSelectButtonProps>(
  ({
    buttons,
    disabled,
    initialIndex: initialIndexProp,
    onPress: onPressProp,
    selectedIndex,
    size,
    style,
    testID,
    position: positionProp,
    ...rest
  }) => {
    const buttonsLayoutListRef = useRef<LayoutRectangle[]>([])
    const buttonsLayoutList = useSharedValue<LayoutRectangle[]>([])
    const [frameKey, setFrameKey] = useState(Date.now())

    const initialIndex = useMemo(
      () =>
        initialIndexProp && initialIndexProp < buttons.length
          ? initialIndexProp
          : 0,
      [buttons.length, initialIndexProp]
    )

    const onButtonLayout = useCallback(
      (index: number, event: LayoutChangeEvent) => {
        buttonsLayoutListRef.current[index] = event.nativeEvent.layout

        if (buttonsLayoutListRef.current.length === buttons.length) {
          buttonsLayoutList.value = [...buttonsLayoutListRef.current]
        }
      },
      [buttons.length, buttonsLayoutList]
    )

    useAnimatedReaction(
      () => buttonsLayoutList.value,
      (layoutList, previous) => {
        if (layoutList !== previous) {
          scheduleOnRN(setFrameKey, Date.now())
        }
      }
    )

    const positionInner = useSharedValue(selectedIndex ?? initialIndex)
    const position = useMemo(
      () => positionProp || positionInner,
      [positionInner, positionProp]
    )

    useEffect(() => {
      if (selectedIndex === undefined) {
        return
      }

      positionInner.value = withTiming(selectedIndex, {
        duration: DEFAULT_ANIMATION_DURATION,
        easing: Easing.linear,
      })
    }, [positionInner, selectedIndex])

    const animationInputRange = useMemo(
      () => buttons.map((_, index) => index),
      [buttons]
    )

    const framePositionStyle = useAnimatedStyle(() => {
      const left = interpolate(
        position.value,
        animationInputRange,
        animationInputRange.map(
          (index) => buttonsLayoutList.value[index]?.x ?? 0
        )
      )
      const width = interpolate(
        position.value,
        animationInputRange,
        animationInputRange.map(
          (index) => buttonsLayoutList.value[index]?.width ?? 0
        )
      )

      return { left, width }
    })

    const isUncontrolledComponent =
      positionProp === undefined && selectedIndex === undefined
    const onPress = useCallback(
      (index: number) => {
        if (isUncontrolledComponent) {
          positionInner.value = withTiming(index, {
            duration: DEFAULT_ANIMATION_DURATION,
            easing: Easing.linear,
          })
        }

        onPressProp?.(index)
      },
      [isUncontrolledComponent, onPressProp, positionInner]
    )

    return (
      <View
        collapsable={false}
        style={[styles.container, style]}
        testID={testID}
        {...rest}
      >
        {buttons.map(
          ({ accessibilityLabel, label, Icon, key, showIcon }, index) => (
            <SelectButtonItem
              Icon={Icon}
              accessibilityLabel={accessibilityLabel}
              disabled={disabled}
              index={index}
              key={key}
              label={label}
              position={position}
              showIcon={showIcon}
              size={size}
              testID={`SelectButton_SelectButtonItem_${index}`}
              onLayout={(event) => onButtonLayout(index, event)}
              onPress={() => onPress(index)}
            />
          )
        )}

        {!disabled && (
          <Animated.View
            key={frameKey}
            style={[styles.frame, framePositionStyle]}
            testID='SelectButton_AnimatedFrame'
          />
        )}
      </View>
    )
  }
)

/**
 * Используется для маркировки элементов интерфейса
 * @see https://www.figma.com/design/4TYeki0MDLhfPGJstbIicf/UI-kit-PrimeFace-(DS)?node-id=484-4921
 */
export const SelectButton = memo<SelectButtonProps>((props) => (
  <SelectButtonStrict {...normalizeSelectButtonProps(props)} />
))

const styles = StyleSheet.create(({ theme }) => ({
  container: {
    flexDirection: 'row',
    padding: theme.Form.SelectButton.selectButtonGroupPadding,
    gap: theme.Form.SelectButton.selectButtonGroupPadding,
    borderRadius: theme.General.borderRadiusXL,
    backgroundColor: theme.Form.SelectButton.selectButtonGroupBg,
  },
  frame: {
    position: 'absolute',
    top: theme.Form.SelectButton.selectButtonGroupPadding,
    bottom: theme.Form.SelectButton.selectButtonGroupPadding,
    left: theme.Form.SelectButton.selectButtonGroupPadding,
    borderRadius: theme.Form.SelectButton.selectButtonBorderRadius,
    backgroundColor: theme.Form.SelectButton.selectButtonActiveBg,
    zIndex: -1,
  },
  textColor: { color: theme.Form.SelectButton.selectButtonTextColor },
  checkedTextColor: {
    color: theme.Form.SelectButton.selectButtonIconActiveColor,
  },
}))
