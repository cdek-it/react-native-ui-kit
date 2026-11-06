import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHelpCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react-native'
import { useContext, useLayoutEffect, useRef } from 'react'
import { View, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { SvgUniversal, type SvgSource } from '../../utils'
import { Button } from '../Button'
import { Title } from '../Typography'

import { DialogAccessibilityContext } from './DialogAccessibilityContext'
import { DIALOG_CLOSE_ACCESSIBILITY_LABEL } from './strings'

type Severity = 'danger' | 'warning' | 'info' | 'success' | 'help'

/** Шапка Dialog с заголовком, статусной иконкой и кнопкой закрытия. */
export interface DialogHeaderProps {
  /** Заголовок. Визуально сокращается до одной строки, скринридер получает полный текст. */
  readonly title: string
  /** Запрашивает закрытие без native event. При отсутствии callback кнопка скрыта. */
  readonly onClose?: () => void
  /** Имя кнопки для скринридера. По умолчанию «Закрыть диалог». */
  readonly closeAccessibilityLabel?: string
  /** Статусная иконка перед заголовком. По умолчанию отсутствует. Значимый статус также передавайте текстом. */
  readonly severity?: Severity
}

const iconsMap: Record<Severity, SvgSource> = {
  danger: IconCircleX,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
  success: IconCircleCheck,
  help: IconHelpCircle,
}

/**
 * Заголовок модального окна, отдельно доступный скринридеру.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6548
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6928
 */
export const DialogHeader = ({
  title,
  onClose,
  closeAccessibilityLabel = DIALOG_CLOSE_ACCESSIBILITY_LABEL,
  severity,
}: DialogHeaderProps) => {
  const registerHeader = useContext(DialogAccessibilityContext)
  const titleRef = useRef<View>(null)

  useLayoutEffect(() => {
    registerHeader?.({ title, target: titleRef.current })

    return () => registerHeader?.(null)
  }, [registerHeader, title])

  return (
    <View style={styles.header}>
      {severity ? (
        <View
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility='no-hide-descendants'
        >
          <SvgUniversal
            source={iconsMap[severity]}
            uniProps={({ semantic }) => ({
              width: semantic.dimension.size[700],
              height: semantic.dimension.size[700],
              color: semantic.colorScheme.color.fg.status[severity].default,
            })}
          />
        </View>
      ) : null}
      <View
        accessible
        accessibilityLabel={title}
        accessibilityRole='header'
        ref={titleRef}
        style={styles.titleContainer}
      >
        <Title
          accessible={false}
          ellipsizeMode='tail'
          importantForAccessibility='no'
          level='h2'
          numberOfLines={1}
          style={styles.title}
          testID={DialogHeaderTestId.title}
        >
          {title}
        </Title>
      </View>
      {onClose ? (
        <Button
          iconOnly
          rounded
          Icon={IconX}
          accessibilityLabel={closeAccessibilityLabel}
          hitSlop={4}
          size='small'
          testID={DialogHeaderTestId.closeButton}
          variant='text'
          onPress={() => onClose()}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create(({ components, fonts }) => ({
  titleContainer: { flexGrow: 1, flexShrink: 1 },
  title: {
    fontSize: components.dialog.title.fontSize,
    fontWeight: components.dialog.title.fontWeight as TextStyle['fontWeight'],
    lineHeight: fonts.lineHeight[500],
    color: components.dialog.root.color,
  },
  header: {
    flexDirection: 'row',
    flexShrink: 0,
    gap: components.dialog.header.gap,
    alignItems: 'center',
    paddingTop: components.dialog.header.paddingTop,
    paddingBottom: components.dialog.header.paddingBottom,
    paddingLeft: components.dialog.header.paddingLeft,
    paddingRight: components.dialog.header.paddingRight,
    borderBottomWidth: components.dialog.extend.borderWidth,
    borderBottomColor: components.dialog.root.borderColor,
  },
}))

export const DialogHeaderTestId = {
  title: 'DialogTitle',
  closeButton: 'DialogCloseButton',
}
