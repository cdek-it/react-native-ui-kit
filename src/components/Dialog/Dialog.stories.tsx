import type { Meta, StoryObj } from '@storybook/react'
import { IconCheck, IconTrash, IconX } from '@tabler/icons-react-native'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../Button'

import { Dialog as DialogView, type DialogProps } from './Dialog'
import { DialogActions, type DialogAction } from './DialogActions'
import { DialogComponent } from './DialogComponent'
import { DialogHeader, type DialogHeaderProps } from './DialogHeader'
import {
  DialogStoryBody,
  type DialogBodyVariant,
} from './stories/DialogStoryBody'

type ActionIconPosition = NonNullable<DialogAction['iconPosition']> | 'none'

const actionIconControl = {
  control: {
    type: 'select' as const,
    labels: { none: 'Без иконки', prefix: 'Слева', postfix: 'Справа' },
  },
  options: ['none', 'prefix', 'postfix'],
}

type DialogStoryArgs = Pick<
  DialogProps,
  'closeOnBackdropPress' | 'avoidKeyboard' | 'onClose' | 'onHideComplete'
> & {
  readonly headerTitle: string
  readonly showHeader: boolean
  readonly showClose: boolean
  readonly severity: NonNullable<DialogHeaderProps['severity']> | 'none'
  readonly bodyVariant: DialogBodyVariant
  readonly showCancelAction: boolean
  readonly cancelLabel: string
  readonly cancelVariant: NonNullable<DialogAction['variant']>
  readonly cancelIconPosition: ActionIconPosition
  readonly showConfirmAction: boolean
  readonly confirmLabel: string
  readonly confirmVariant: NonNullable<DialogAction['variant']>
  readonly confirmIconPosition: ActionIconPosition
  readonly showDangerAction: boolean
  readonly dangerLabel: string
  readonly dangerAppearance: NonNullable<DialogAction['appearance']>
  readonly dangerIconPosition: ActionIconPosition
  readonly onDelete?: () => void
}

const DialogExample = ({
  closeOnBackdropPress,
  avoidKeyboard,
  onClose,
  onHideComplete,
  headerTitle,
  showHeader,
  showClose,
  severity,
  bodyVariant,
  showCancelAction,
  cancelLabel,
  cancelVariant,
  cancelIconPosition,
  showConfirmAction,
  confirmLabel,
  confirmVariant,
  confirmIconPosition,
  showDangerAction,
  dangerLabel,
  dangerAppearance,
  dangerIconPosition,
  onDelete,
}: DialogStoryArgs) => {
  const [visible, setVisible] = useState(false)
  const close = () => {
    setVisible(false)
    onClose?.()
  }
  const actions: DialogAction[] = []

  if (showCancelAction)
    actions.push({
      key: 'cancel',
      label: cancelLabel,
      variant: cancelVariant,
      Icon: cancelIconPosition === 'none' ? undefined : IconX,
      iconPosition:
        cancelIconPosition === 'none' ? undefined : cancelIconPosition,
      onPress: close,
    })

  if (showConfirmAction)
    actions.push({
      key: 'confirm',
      label: confirmLabel,
      variant: confirmVariant,
      Icon: confirmIconPosition === 'none' ? undefined : IconCheck,
      iconPosition:
        confirmIconPosition === 'none' ? undefined : confirmIconPosition,
      onPress: close,
    })

  if (showDangerAction)
    actions.push({
      key: 'delete',
      label: dangerLabel,
      severity: 'danger',
      appearance: dangerAppearance,
      Icon: dangerIconPosition === 'none' ? undefined : IconTrash,
      iconPosition:
        dangerIconPosition === 'none' ? undefined : dangerIconPosition,
      onPress: () => {
        onDelete?.()
        close()
      },
    })

  const header = showHeader ? (
    <DialogHeader
      severity={severity === 'none' ? undefined : severity}
      title={headerTitle}
      onClose={showClose ? close : undefined}
    />
  ) : null
  const footer = actions.length > 0 ? <DialogActions actions={actions} /> : null
  const body = <DialogStoryBody variant={bodyVariant} />

  return (
    <ScrollView
      nestedScrollEnabled
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps='handled'
    >
      <DialogComponent footer={footer} header={header}>
        {body}
      </DialogComponent>
      <Button
        label='Показать модальный Dialog'
        style={styles.trigger}
        onPress={() => setVisible(true)}
      />
      <DialogView
        accessibilityLabel={showHeader ? undefined : 'Информация о заказе'}
        avoidKeyboard={avoidKeyboard}
        closeOnBackdropPress={closeOnBackdropPress}
        footer={footer}
        header={header}
        visible={visible}
        onClose={close}
        onHideComplete={onHideComplete}
      >
        {body}
      </DialogView>
    </ScrollView>
  )
}

const meta: Meta<DialogStoryArgs> = {
  title: 'Overlay/Dialog',
  component: DialogView,
  render: DialogExample,
  tags: ['version:2.0', 'design:pending'],
  args: {
    closeOnBackdropPress: true,
    avoidKeyboard: true,
    headerTitle: 'Детали заказа',
    showHeader: true,
    showClose: true,
    severity: 'none',
    bodyVariant: 'text',
    showCancelAction: true,
    cancelLabel: 'Отмена',
    cancelVariant: 'tertiary',
    cancelIconPosition: 'none',
    showConfirmAction: false,
    confirmLabel: 'Сохранить',
    confirmVariant: 'primary',
    confirmIconPosition: 'none',
    showDangerAction: false,
    dangerLabel: 'Удалить',
    dangerAppearance: 'filled',
    dangerIconPosition: 'none',
  },
  argTypes: {
    closeOnBackdropPress: { control: 'boolean' },
    avoidKeyboard: { control: 'boolean' },
    showHeader: { control: 'boolean' },
    headerTitle: { control: 'text' },
    showClose: { control: 'boolean' },
    severity: {
      control: { type: 'select', labels: { none: 'Без иконки' } },
      options: ['none', 'danger', 'warning', 'success', 'info', 'help'],
    },
    bodyVariant: {
      control: {
        type: 'radio',
        labels: {
          text: 'Текст',
          longText: 'Большой текст',
          input: 'Текст с инпутом',
        },
      },
      options: ['text', 'longText', 'input'],
    },
    showCancelAction: { control: 'boolean' },
    cancelLabel: { control: 'text', if: { arg: 'showCancelAction' } },
    cancelVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'text', 'link'],
      if: { arg: 'showCancelAction' },
    },
    cancelIconPosition: {
      ...actionIconControl,
      if: { arg: 'showCancelAction' },
    },
    showConfirmAction: { control: 'boolean' },
    confirmLabel: { control: 'text', if: { arg: 'showConfirmAction' } },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'text', 'link'],
      if: { arg: 'showConfirmAction' },
    },
    confirmIconPosition: {
      ...actionIconControl,
      if: { arg: 'showConfirmAction' },
    },
    showDangerAction: { control: 'boolean' },
    dangerLabel: { control: 'text', if: { arg: 'showDangerAction' } },
    dangerAppearance: {
      control: 'select',
      options: ['filled', 'outlined', 'text'],
      if: { arg: 'showDangerAction' },
    },
    dangerIconPosition: {
      ...actionIconControl,
      if: { arg: 'showDangerAction' },
    },
    onClose: { action: 'onClose' },
    onDelete: { action: 'onDelete' },
    onHideComplete: { action: 'onHideComplete' },
  },
  parameters: {
    notes:
      'На маленьком экране диалог располагается сверху, нижняя часть может не поместиться. Прокрутка всего окна доступна при открытой клавиатуре.',
    controls: {
      include: [
        'closeOnBackdropPress',
        'avoidKeyboard',
        'showHeader',
        'headerTitle',
        'showClose',
        'severity',
        'bodyVariant',
        'showCancelAction',
        'cancelLabel',
        'cancelVariant',
        'cancelIconPosition',
        'showConfirmAction',
        'confirmLabel',
        'confirmVariant',
        'confirmIconPosition',
        'showDangerAction',
        'dangerLabel',
        'dangerAppearance',
        'dangerIconPosition',
      ],
    },
  },
}

export default meta

type Story = StoryObj<DialogStoryArgs>

export const Dialog: Story = {}

const styles = StyleSheet.create(({ semantic }) => ({
  container: { alignItems: 'center', gap: semantic.dimension.size[450] },
  trigger: { alignSelf: 'stretch' },
}))
