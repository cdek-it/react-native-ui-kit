import type { Meta, StoryObj } from '@storybook/react'
import { useCallback } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { DialogComponent, type DialogComponentProps } from './DialogComponent'
import { DialogHeader, type DialogHeaderProps } from './DialogHeader'

const severityMap = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  help: 'help',
  none: undefined,
}

const meta: Meta<DialogComponentProps & DialogHeaderProps> = {
  title: 'Overlay/Dialog Modal=false',
  component: DialogComponent,
  render: (props) => Template(props),
  args: { severity: 'info' },
  argTypes: {
    severity: {
      control: 'radio',
      options: Object.keys(severityMap),
      mapping: severityMap,
    },
  },
}

const Template = ({ severity }: DialogComponentProps & DialogHeaderProps) => {
  const Body = useCallback(() => {
    return (
      <Text>Войдите в приложение, чтобы заказ сохранился в списке заказов</Text>
    )
  }, [])

  const Footer = useCallback(() => {
    return (
      <TouchableOpacity>
        <Text>Войти</Text>
      </TouchableOpacity>
    )
  }, [])

  return (
    <View>
      <DialogComponent
        body={Body}
        footer={Footer}
        header={
          <DialogHeader
            severity={severity}
            title='Найденный заказ не сохранится'
          />
        }
      />
    </View>
  )
}

export default meta

type Story = StoryObj<typeof DialogComponent>

export const NonModal: Story = { name: 'Dialog modal=false', args: {} }
