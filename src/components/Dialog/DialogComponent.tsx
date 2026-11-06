import {
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react'
import { View, useWindowDimensions } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

/** Немодальное содержимое окна с отдельными шапкой, телом и футером. */
export interface DialogComponentProps {
  /** Основное содержимое. Прокрутку задаёт потребитель через ScrollView или список. */
  readonly children?: ReactNode
  /** @deprecated Передавайте готовое содержимое через children. */
  readonly body?: ComponentType
  /** Готовый футер. Передача ComponentType устарела, используйте <Footer />. */
  readonly footer?: ReactElement | ComponentType | null
  /** Готовая шапка, обычно DialogHeader. */
  readonly header?: ReactNode
}

/**
 * Немодальный вариант Dialog для размещения внутри экрана, без затемнения.
 * Показ, фокус и адаптацию к клавиатуре задаёт потребитель. Для модального показа используйте Dialog.
 * @see https://www.figma.com/design/Q1BWgZ7zoV5UzlBOnjW0cM/UI-Kit--DS--v2.1?node-id=520-6572
 */
export const DialogComponent = ({
  body: Body,
  children,
  footer: Footer,
  header,
}: DialogComponentProps) => {
  const { height } = useWindowDimensions()
  const content = children === undefined && Body ? <Body /> : children
  const footer = isValidElement(Footer) ? Footer : Footer ? <Footer /> : null

  return (
    <View style={styles.root(height)}>
      {header}
      {content !== null && content !== undefined && (
        <View style={styles.body}>{content}</View>
      )}
      {footer !== null && <View style={styles.footer}>{footer}</View>}
    </View>
  )
}

const styles = StyleSheet.create(({ components, semantic }) => ({
  root: (height: number) => ({
    width: semantic.dimension.size[1900],
    maxWidth: '100%',
    maxHeight: height - 100,
    overflow: 'hidden',
    backgroundColor: components.dialog.root.background,
    borderColor: components.dialog.root.borderColor,
    borderWidth: components.dialog.extend.borderWidth,
    borderRadius: components.dialog.root.borderRadius,
  }),
  body: { padding: components.dialog.content.padding, flexShrink: 1 },
  footer: {
    flexShrink: 0,
    paddingTop: components.dialog.footer.paddingTop,
    paddingBottom: components.dialog.footer.paddingBottom,
    paddingLeft: components.dialog.footer.paddingLeft,
    paddingRight: components.dialog.footer.paddingRight,
  },
}))
