import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from '@tabler/icons-react-native'
import { memo } from 'react'
import {
  View,
  Text,
  useWindowDimensions,
  type ViewStyle,
  type TextStyle,
  type StyleProp,
  type AccessibilityProps,
  type ViewProps,
} from 'react-native'

import { StyleSheet } from 'react-native-unistyles'

import { type SvgSource, SvgUniversal } from '../../utils/SvgUniversal'

/** @deprecated Используйте primary. Будет удалён в 2.0 после миграции SuperApp */
type DeprecatedTagSeverity = 'basic'

export interface TagProps
  extends AccessibilityProps, Pick<ViewProps, 'testID' | 'collapsable'> {
  /** Текст */
  text: string

  /** true, если необходимо полное скругление углов компонента */
  rounded?: boolean

  /**
   *  Выбор варианта стиля компонента
   *  @default 'primary'
   */
  severity?:
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'secondary'
    | DeprecatedTagSeverity

  /**
   * Показать или скрыть иконку внутри компонента
   * @default true
   */
  showIcon?: boolean

  /** Дополнительная стилизация для контейнера компонента */
  style?: StyleProp<ViewStyle>

  /** SVG-иконка. Заменяет стандартную иконку выбранного severity */
  Icon?: SvgSource
}

type TagSeverity = Exclude<
  NonNullable<TagProps['severity']>,
  DeprecatedTagSeverity
>

const tagIcons: Record<TagSeverity, SvgSource> = {
  primary: IconCheck,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  danger: IconCircleX,
  secondary: IconCircleX,
}

/**
 * Используется для маркировки элементов интерфейса
 * Внутри интерактивного родителя задавайте доступное имя родителю,
 * оставляя Tag без собственного accessibilityLabel
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=21-1238
 */
export const Tag = memo<TagProps>(
  ({
    text,
    rounded,
    severity = 'primary',
    showIcon = true,
    style,
    Icon,
    testID,
    collapsable,
    accessibilityLabel,
    ...rest
  }) => {
    // На iOS пересоздание Text сбрасывает измерения при смене масштаба шрифта.
    const { fontScale } = useWindowDimensions()
    const resolvedSeverity = severity === 'basic' ? 'primary' : severity
    const colorSchemeKey =
      resolvedSeverity === 'warning' ? 'warn' : resolvedSeverity
    const hasAccessibilityLabel = accessibilityLabel !== undefined

    tagStyles.useVariants({ severity: resolvedSeverity })

    return (
      <View
        collapsable={collapsable}
        style={style}
        testID={testID || TagTestId.root}
        {...rest}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={hasAccessibilityLabel ? 'text' : undefined}
        accessible={hasAccessibilityLabel}
      >
        <View
          accessibilityElementsHidden={hasAccessibilityLabel}
          accessible={false}
          collapsable={collapsable}
          importantForAccessibility={
            hasAccessibilityLabel ? 'no-hide-descendants' : 'auto'
          }
          style={[tagStyles.container, rounded && tagStyles.roundedContainer]}
          testID={TagTestId.innerContainer}
        >
          {showIcon ? (
            <SvgUniversal
              accessibilityElementsHidden
              accessible={false}
              importantForAccessibility='no-hide-descendants'
              source={Icon ?? tagIcons[resolvedSeverity]}
              testID={TagTestId.icon}
              uniProps={({ components }) => ({
                color: components.tag.colorScheme[colorSchemeKey].color,
                width: components.tag.icon.size,
                height: components.tag.icon.size,
              })}
            />
          ) : null}
          <Text
            accessibilityRole='text'
            accessible={!hasAccessibilityLabel}
            key={fontScale}
            numberOfLines={1}
            style={tagStyles.text}
            testID={TagTestId.text}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }
)

const tagStyles = StyleSheet.create(({ components, fonts }) => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.tag.root.gap,
    paddingHorizontal: components.tag.root.paddingLeft,
    paddingVertical: components.tag.root.paddingTop,
    borderRadius: components.tag.root.borderRadius,
    variants: {
      severity: {
        primary: {
          backgroundColor: components.tag.colorScheme.primary.background,
        },
        info: { backgroundColor: components.tag.colorScheme.info.background },
        success: {
          backgroundColor: components.tag.colorScheme.success.background,
        },
        warning: {
          backgroundColor: components.tag.colorScheme.warn.background,
        },
        danger: {
          backgroundColor: components.tag.colorScheme.danger.background,
        },
        secondary: {
          backgroundColor: components.tag.colorScheme.secondary.background,
        },
      },
    },
  },
  roundedContainer: { borderRadius: components.tag.root.roundedBorderRadius },
  text: {
    flexShrink: 1,
    fontSize: components.tag.root.fontSize,
    includeFontPadding: false,
    verticalAlign: 'middle',
    fontFamily: fonts.fontFamily.base,
    fontWeight: components.tag.root.fontWeight as TextStyle['fontWeight'],
    lineHeight: fonts.lineHeight[250],
    variants: {
      severity: {
        primary: { color: components.tag.colorScheme.primary.color },
        info: { color: components.tag.colorScheme.info.color },
        success: { color: components.tag.colorScheme.success.color },
        warning: { color: components.tag.colorScheme.warn.color },
        danger: { color: components.tag.colorScheme.danger.color },
        secondary: { color: components.tag.colorScheme.secondary.color },
      },
    },
  },
}))

export const TagTestId = {
  root: 'Tag',
  innerContainer: 'Tag.innerContainer',
  icon: 'Tag.icon',
  text: 'Tag.text',
}
