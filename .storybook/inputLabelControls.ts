import type { Meta } from '@storybook/react'
import { Alert } from 'react-native'

import type {
  InputLabelInfo,
  InputLabelProps,
} from '../src/components/Input/core/types'

type InputLabelControls = {
  labelMode: 'none' | 'label' | 'floatLabel'
  labelText: string
  labelInfo?: InputLabelInfo
}

export type InputLabelStoryArgs<Props> = Omit<
  Props,
  'label' | 'floatLabel' | 'labelInfo'
> &
  InputLabelControls

export type InputStoryMeta<Props, Args> = Omit<Meta<Args>, 'component'> &
  Pick<Meta<Props>, 'component'>

export const inputLabelControls = {
  labelMode: {
    control: 'radio',
    options: ['none', 'label', 'floatLabel'],
    description:
      'Режим примера: передать label, floatLabel или не передавать подпись. Не свойство компонента.',
  },
  labelText: {
    control: 'text',
    description: 'Текст для выбранного label или floatLabel в этом примере.',
  },
  labelInfo: {
    control: 'select',
    options: ['none', 'info'],
    mapping: {
      none: undefined,
      info: {
        onPress: () =>
          Alert.alert(
            'Подробнее',
            'Пример справки, которую открывает приложение.'
          ),
      },
    },
    if: { arg: 'labelMode', eq: 'label' },
    description:
      'Кнопка ⓘ у обычного label. Обработчик примера открывает справку через Alert.',
  },
} as const

export const getInputLabelProps = ({
  labelMode,
  labelText,
  labelInfo,
}: InputLabelControls): InputLabelProps => {
  switch (labelMode) {
    case 'label':
      return { label: labelText, labelInfo }
    case 'floatLabel':
      return { floatLabel: labelText }
    case 'none':
      return {}
  }
}
