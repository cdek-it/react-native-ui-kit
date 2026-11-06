import {
  isValidElement,
  useState,
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
  const { height: windowHeight } = useWindowDimensions()
  const [headerHeight, setHeaderHeight] = useState(0)
  const [footerHeight, setFooterHeight] = useState(0)
  const content = children === undefined && Body ? <Body /> : children
  const footer = isValidElement(Footer) ? Footer : Footer ? <Footer /> : null

  const headerAndFooterHeight =
    (header ? headerHeight : 0) + (footer ? footerHeight : 0)

  return (
    <View style={styles.root}>
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
        <View
          style={styles.body(windowHeight, headerAndFooterHeight)}
          testID='DialogBody'
        >
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
  root: {
    width: semantic.dimension.size[1900],
    maxWidth: '100%',
    overflow: 'hidden',
    backgroundColor: components.dialog.root.background,
    borderColor: components.dialog.root.borderColor,
    borderWidth: components.dialog.extend.borderWidth,
    borderRadius: components.dialog.root.borderRadius,
  },
  header: { flexShrink: 0 },
  body: (windowHeight: number, headerAndFooterHeight: number) => {
    const padding = components.dialog.content.padding
    const availableHeight =
      windowHeight -
      100 -
      headerAndFooterHeight -
      components.dialog.extend.borderWidth * 2
    // При большой шапке или футере сохраняем место для тела, даже если окно не помещается целиком.
    const minimumBodyHeight = padding * 2 + semantic.dimension.size[1200]

    return {
      padding,
      maxHeight:
        availableHeight >= minimumBodyHeight ? availableHeight : windowHeight,
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
