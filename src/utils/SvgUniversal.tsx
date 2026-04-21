import {
  type ComponentType,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  memo,
} from 'react'
import { SvgUri, SvgXml, type SvgProps } from 'react-native-svg'
import { withUnistyles } from 'react-native-unistyles'

import type { ThemeType } from '../theme/types'

export type SvgSource =
  | { uri: string }
  | { xml: string }
  | ComponentType<SvgProps>

export interface SvgUniversalProps extends SvgProps {
  /** Источник SVG */
  source: SvgSource
}

/**
 * Компонент для рендера SVG из разных источников
 * Поддерживает:
 * - uri
 * - xml
 * - ComponentType<SvgProps>
 *
 * Подписан на обновления темы Unistyles через uniProps
 * @example
 * <SvgUniversal source={{ uri: 'https://example.com/icon.svg' }} />
 * <SvgUniversal source={{ xml: '<svg><path d="M1 1h1v1H1z" /></svg>' }} />
 * <SvgUniversal source={IconUser} />
 * <SvgUniversal
 *   source={IconUser}
 *   uniProps={(theme) => ({ color: theme.colors.primary })}
 * />
 */
const SvgUniversalRaw = memo<SvgUniversalProps>(({ source, ...rest }) => {
  if ('uri' in source) {
    return <SvgUri testID={SvgUniversalTestId.uri} uri={source.uri} {...rest} />
  }

  if ('xml' in source) {
    return <SvgXml testID={SvgUniversalTestId.xml} xml={source.xml} {...rest} />
  }

  const Component = source

  return <Component testID={SvgUniversalTestId.component} {...rest} />
})

type SvgUniversalType = ForwardRefExoticComponent<
  PropsWithoutRef<
    Partial<SvgUniversalProps> & {
      uniProps?: (
        theme: ThemeType
      ) => Omit<
        Partial<SvgUniversalProps>,
        'style' | 'contentContainerStyle'
      > & { key?: string }
    }
  > &
    RefAttributes<never>
>

export const SvgUniversal: SvgUniversalType = withUnistyles(
  SvgUniversalRaw
) as SvgUniversalType

export const SvgUniversalTestId = {
  component: 'SvgUniversalComponent',
  uri: 'SvgUniversalUri',
  xml: 'SvgUniversalXml',
}
