import { useState, type ComponentProps } from 'react'
import { useWindowDimensions, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Button, ButtonSeverity } from '../Button'

type ManagedButtonProp =
  | 'children'
  | 'onLayout'
  | 'size'
  | 'style'
  | 'rounded'
  | 'shape'

type DialogButtonProps = Omit<
  Extract<ComponentProps<typeof Button>, { label: string }>,
  ManagedButtonProp
> & { readonly severity?: never; readonly appearance?: never }

type DialogSeverityButtonProps = Omit<
  Extract<ComponentProps<typeof ButtonSeverity>, { label: string }>,
  ManagedButtonProp | 'variant'
> & { readonly variant?: never }

/**
 * Действие с обязательной подписью и необязательной иконкой.
 * Button принимает variant, ButtonSeverity — severity и appearance.
 * Размер large и обычная форма (rounded=false) задаются группой.
 */
export type DialogAction = (DialogButtonProps | DialogSeverityButtonProps) & {
  /** Стабильный уникальный ключ действия. */
  readonly key: string
} & Readonly<Partial<Record<ManagedButtonProp, never>>>

export interface DialogActionsProps {
  /** Действия отображаются в переданном порядке, включая расположение столбцом. */
  readonly actions: readonly DialogAction[]
}

type ActionButtonProps = Pick<
  ComponentProps<typeof Button>,
  'style' | 'onLayout'
> & { readonly action: DialogAction; readonly isMeasuring?: boolean }

const ActionButton = ({
  action,
  isMeasuring = false,
  style,
  onLayout,
}: ActionButtonProps) => {
  const { key, variant, severity, appearance, ...props } = action
  const { label, Icon, iconPosition, loading } = props
  const buttonProps = isMeasuring
    ? {
        label,
        Icon,
        iconPosition,
        loading,
        accessible: false,
        testID: `DialogActionsMeasure-${key}`,
      }
    : props

  return severity ? (
    <ButtonSeverity
      {...buttonProps}
      appearance={appearance}
      rounded={false}
      severity={severity}
      size='large'
      style={style}
      onLayout={onLayout}
    />
  ) : (
    <Button
      {...buttonProps}
      rounded={false}
      size='large'
      style={style}
      variant={variant}
      onLayout={onLayout}
    />
  )
}

/**
 * Кнопки large с равной шириной. При нехватке места или шрифте от 200% идут столбцом.
 * Используется в footer Dialog или самостоятельно в контейнере заданной ширины.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM?node-id=26950-132741
 */
export const DialogActions = ({ actions }: DialogActionsProps) => {
  const { theme } = useUnistyles()
  const { fontScale } = useWindowDimensions()
  const [width, setWidth] = useState(0)
  const [actionWidths, setActionWidths] = useState<Record<string, number>>({})
  const gap = theme.components.dialog.footer.gap
  const columnWidth = (width - gap * (actions.length - 1)) / actions.length
  const stacked =
    fontScale >= 2 ||
    actions.some(
      ({ key }) =>
        actionWidths[key] === undefined || actionWidths[key] > columnWidth
    )

  return (
    <View
      style={styles.root(stacked)}
      testID='DialogActions'
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    >
      {/* Измеряем естественную ширину Button до растягивания, без дублирования refs и обработчиков. */}
      <View
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        pointerEvents='none'
        style={styles.measurements}
      >
        {actions.map((action) => (
          <ActionButton
            isMeasuring
            action={action}
            key={action.key}
            onLayout={({ nativeEvent }) => {
              const measuredWidth = nativeEvent.layout.width
              setActionWidths((current) =>
                current[action.key] === measuredWidth
                  ? current
                  : { ...current, [action.key]: measuredWidth }
              )
            }}
          />
        ))}
      </View>
      {actions.map((action) => (
        <View key={action.key} style={styles.action(stacked)}>
          <ActionButton action={action} style={styles.button} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create(({ components }) => ({
  root: (stacked: boolean) => ({
    flexDirection: stacked ? 'column' : 'row',
    gap: components.dialog.footer.gap,
  }),
  action: (stacked: boolean) => ({ flex: stacked ? undefined : 1 }),
  button: { alignSelf: 'stretch' },
  measurements: {
    position: 'absolute',
    opacity: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}))
