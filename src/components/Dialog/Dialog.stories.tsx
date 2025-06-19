import type { Meta, StoryObj } from '@storybook/react'
import { useCallback, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Dialog } from './Dialog'

const meta: Meta<typeof Dialog> = {
  title: 'Dialog',
  component: Dialog,
  render: () => Template(),
}

const Template = () => {
  const [isVisible, setIsVisible] = useState(false)

  const showDialog = () => {
    setIsVisible(true)
  }

  const hideDialog = () => {
    setIsVisible(false)
  }

  const handleHideComplete = () => {
    console.log('Dialog hide animation completed')
  }

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
  }, [])

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
        isVisible={isVisible}
        title='Найденный заказ не сохранится'
        onClose={hideDialog}
        onHideComplete={handleHideComplete}
      />
    </View>
  )
}

export default meta

type Story = StoryObj<typeof Dialog>

const DialogStory: Story = { args: {} }

export { DialogStory as Dialog }
