import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Button } from '../../Button'
import { InputText } from '../../Input'
import { Body } from '../../Typography'

import { DialogActions } from '../DialogActions'
import { DialogComponent } from '../DialogComponent'
import { DialogHeader } from '../DialogHeader'

export const DialogInputExample = () => {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const close = () => setVisible(false)

  return (
    <View style={styles.example}>
      <Body>
        Пример управления клавиатурой на стороне потребителя. Dialog не
        реализует это поведение.
      </Body>
      <Button label='Открыть пример' onPress={() => setVisible(true)} />
      <Modal
        transparent
        animationType='fade'
        visible={visible}
        onRequestClose={close}
      >
        <Pressable
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility='no-hide-descendants'
          style={styles.backdrop}
          onPress={close}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents='box-none'
          style={styles.keyboard}
        >
          <View pointerEvents='box-none' style={styles.viewport}>
            <View
              accessibilityViewIsModal
              accessibilityLabel='Комментарий к заказу'
              accessible={false}
              role='dialog'
              style={styles.surface}
              onAccessibilityEscape={close}
            >
              <DialogComponent
                footer={
                  <DialogActions
                    actions={[{ key: 'done', label: 'Готово', onPress: close }]}
                  />
                }
                header={<DialogHeader title='Комментарий' onClose={close} />}
              >
                <InputText
                  accessibilityLabel='Комментарий к заказу'
                  label='Комментарий'
                  placeholder='Например, позвонить заранее'
                  returnKeyType='done'
                  value={value}
                  onChangeText={setValue}
                  onSubmitEditing={close}
                />
              </DialogComponent>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create(({ components, semantic }, rt) => ({
  example: { gap: semantic.dimension.size[450] },
  keyboard: { flex: 1 },
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: semantic.dimension.size[450],
    paddingTop: Math.max(rt.insets.top, semantic.dimension.size[450]),
    paddingBottom: Math.max(rt.insets.bottom, semantic.dimension.size[450]),
  },
  surface: {
    width: '100%',
    maxWidth: semantic.dimension.size[1900],
    flexShrink: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: components.dialog.extend.backdrop,
  },
}))
