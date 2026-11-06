import {
  isValidElement,
  useState,
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
  const [headerHeight, setHeaderHeight] = useState(0)
  const [footerHeight, setFooterHeight] = useState(0)
  const content = children === undefined && Body ? <Body /> : children
  const footer = isValidElement(Footer) ? Footer : Footer ? <Footer /> : null

  const chromeHeight = (header ? headerHeight : 0) + (footer ? footerHeight : 0)

  return (
    <View style={styles.root(width)}>
      <View
        style={styles.header}
        testID='DialogHeaderContainer'
        onLayout={({ nativeEvent }) =>
          setHeaderHeight(nativeEvent.layout.height)
        }
      >
        {header}
      </View>
      {content !== null && content !== undefined && (
        <View style={styles.body(height, chromeHeight)} testID='DialogBody'>
          {content}
        </View>
      )}
      {footer !== null && (
        <View
          style={styles.footer}
          testID='DialogFooterContainer'
          onLayout={({ nativeEvent }) =>
            setFooterHeight(nativeEvent.layout.height)
          }
        >
          {footer}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create(({ components, semantic }) => ({
  root: (width: number) => ({
    width: Math.min(
      semantic.dimension.size[1900],
      width - semantic.dimension.size[450] * 2
    ),
    overflow: 'hidden',
    backgroundColor: components.dialog.root.background,
    borderColor: components.dialog.root.borderColor,
    borderWidth: components.dialog.extend.borderWidth,
    borderRadius: components.dialog.root.borderRadius,
  }),
  header: { flexShrink: 0 },
  body: (height: number, chromeHeight: number) => {
    const padding = components.dialog.content.padding
    const availableHeight =
      height - 100 - chromeHeight - components.dialog.extend.borderWidth * 2
    // Оставляем место хотя бы для одной строки ввода с отступами.
    // Если его нет, ограничиваем body высотой окна и прокручиваем всю поверхность.
    const minimumHeight = padding * 2 + semantic.dimension.size[1200]

    return {
      padding,
      maxHeight: availableHeight >= minimumHeight ? availableHeight : height,
    }
  },
  footer: {
    flexShrink: 0,
    paddingTop: components.dialog.footer.paddingTop,
    paddingBottom: components.dialog.footer.paddingBottom,
    paddingLeft: components.dialog.footer.paddingLeft,
    paddingRight: components.dialog.footer.paddingRight,
  },
}))
