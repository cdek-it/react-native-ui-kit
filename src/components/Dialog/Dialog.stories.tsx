import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Dialog, type DialogProps } from './Dialog'
import { DialogHeader, type DialogHeaderProps } from './DialogHeader'

const severityMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  help: 'help',
  none: undefined,
}

const meta: Meta<DialogProps & DialogHeaderProps> = {
  title: 'Dialog',
  component: Dialog,
  render: (props) => Template(props),
  argTypes: {
    severity: {
      control: 'radio',
      options: Object.keys(severityMap),
      mapping: severityMap,
    },
    onClose: { action: 'onClose' },
    onHideComplete: { action: 'onHideComplete' },
  },
}

const Template = ({
  severity,
  onHideComplete,
  onClose,
}: DialogProps & DialogHeaderProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const showDialog = () => {
    setIsVisible(true)
  }

  const hideDialog = useCallback(() => {
    setIsVisible(false)
    onClose?.()
  }, [onClose])

  const Body = useCallback(() => {
    return (
      <Text>Войдите в приложение, чтобы заказ сохранился в списке заказов</Text>
    )
  }, [])

  const Footer = useCallback(() => {
    return (
      <TouchableOpacity onPress={hideDialog}>
        <Text>Войти</Text>
      </TouchableOpacity>
    )
  }, [hideDialog])

  return (
    <View>
      <View>
        <TouchableOpacity onPress={showDialog}>
          <Text>Показать Dialog</Text>
        </TouchableOpacity>
      </View>

      <Dialog
        body={Body}
        footer={Footer}
        header={
          <DialogHeader
            severity={severity}
            title='Найденный заказ не сохранится'
            onClose={hideDialog}
          />
        }
        isVisible={isVisible}
        onClose={hideDialog}
        onHideComplete={onHideComplete}
      />
    </View>
  )
}

export default meta

type Story = StoryObj<typeof Dialog>

const DialogStory: Story = { args: {} }

export { DialogStory as Dialog }
