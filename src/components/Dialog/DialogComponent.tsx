import {
  isValidElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from 'react'
import { View, useWindowDimensions } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

/** Содержимое окна. Для модального показа используйте Dialog. */
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
 * @deprecated Используйте Dialog с header, children и footer.
 * Сохранён для совместимости немодальных композиций.
 */
export const DialogComponent = ({
  body: Body,
  children,
  footer: Footer,
  header,
}: DialogComponentProps) => {
  const { width, height } = useWindowDimensions()
  const content = children === undefined && Body ? <Body /> : children
  const footer = isValidElement(Footer) ? Footer : Footer ? <Footer /> : null

  return (
    <View style={styles.root(width, height)}>
      {header}
      {content !== null && content !== undefined && (
        <View style={styles.body}>{content}</View>
      )}
      {footer !== null && <View style={styles.footer}>{footer}</View>}
    </View>
  )
}

const styles = StyleSheet.create(({ components, semantic }) => ({
  root: (width: number, height: number) => ({
    width: Math.min(
      semantic.dimension.size[1900],
      width - semantic.dimension.size[450] * 2
    ),
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
