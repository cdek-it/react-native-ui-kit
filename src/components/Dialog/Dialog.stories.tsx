import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'
import { useCallback } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../Button'
import { Body } from '../Typography'

import { Dialog as DialogView, type DialogProps } from './Dialog'
import { DialogComponent } from './DialogComponent'
import { DialogHeader, type DialogHeaderProps } from './DialogHeader'

type DialogStoryArgs = DialogProps & Pick<DialogHeaderProps, 'severity'>

const DialogBody = () => (
  <Body>Войдите в приложение, чтобы заказ сохранился в списке заказов</Body>
)

const InlineFooter = () => <Button label='Войти' />

const severityMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  help: 'help',
  none: undefined,
}

const DialogExample = ({
  isVisible,
  severity,
  onHideComplete,
  onClose,
}: DialogStoryArgs) => {
  const [, updateArgs] = useArgs<DialogStoryArgs>()

  const showDialog = () => {
    updateArgs({ isVisible: true })
  }

  const hideDialog = useCallback(() => {
    updateArgs({ isVisible: false })
    onClose?.()
  }, [onClose, updateArgs])

  const Footer = useCallback(() => {
    return <Button label='Войти' onPress={hideDialog} />
  }, [hideDialog])

  const headerProps = { severity, title: 'Найденный заказ не сохранится' }

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <DialogComponent
          body={DialogBody}
          footer={InlineFooter}
          header={<DialogHeader {...headerProps} />}
        />
      </View>
      <Button label='Показать модальный Dialog' onPress={showDialog} />
      <DialogView
        body={DialogBody}
        footer={Footer}
        header={<DialogHeader {...headerProps} onClose={hideDialog} />}
        isVisible={isVisible}
        onClose={hideDialog}
        onHideComplete={onHideComplete}
      />
    </View>
  )
}

const meta: Meta<DialogStoryArgs> = {
  title: 'Overlay/Dialog',
  component: DialogView,
  render: DialogExample,
  args: { severity: 'info', isVisible: false },
  argTypes: {
    severity: {
      control: 'radio',
      options: Object.keys(severityMap),
      mapping: severityMap,
    },
    onClose: { action: 'onClose' },
    onHideComplete: { action: 'onHideComplete' },
  },
  parameters: { controls: { include: ['severity'] } },
}

export default meta

type Story = StoryObj<DialogStoryArgs>

export const Dialog: Story = {}

const styles = StyleSheet.create(({ components, semantic }) => ({
  container: { gap: 16 },
  preview: {
    borderWidth: 1,
    borderColor: semantic.colorScheme.color.border.neutral.default,
    borderRadius: components.dialog.root.borderRadius,
  },
}))
