import { normalizeTree } from './normalization'
import { resolveReferences } from './resolution'
import { mergeTrees, resolvePath } from './tree'
import {
  isTokenTree,
  type CompiledTokens,
  type ThemeTokens,
  type TokenTree,
  type TokenValue,
} from './types'
import { assertSameShape, assertValidOutput } from './validation'

type ColorScheme = keyof ThemeTokens

const compileGroup = (
  input: TokenValue,
  group: 'semantic' | 'components',
  scheme: 'light' | 'dark'
): TokenTree => {
  const normalized = normalizeTree(input, group)

  if (!isTokenTree(normalized)) {
    throw new Error(
      `Expected an object at "${group}" in ${scheme} input tokens`
    )
  }

  assertValidOutput(normalized, `${scheme}.${group}`)

  return normalized
}

const getGroup = (
  source: TokenTree,
  group: 'primitive' | 'semantic' | 'components'
): TokenTree => {
  const value = resolvePath(source, group)

  if (!isTokenTree(value)) {
    throw new Error(`Expected an object at "${group}" in input tokens`)
  }

  return value
}

const compileFonts = (primitive: TokenTree): TokenTree => {
  const fonts = resolvePath(primitive, 'fonts')

  if (!isTokenTree(fonts)) {
    throw new Error('Expected an object at "primitive.fonts" in input tokens')
  }

  const resolvedFonts = resolveReferences(fonts, primitive, 'fonts')
  const normalizedFonts = normalizeTree(resolvedFonts, 'fonts')

  if (!isTokenTree(normalizedFonts)) {
    throw new Error('Expected an object at "fonts" in output tokens')
  }

  assertValidOutput(normalizedFonts, 'fonts')

  return normalizedFonts
}

const selectColorScheme = (
  group: TokenTree,
  scheme: ColorScheme,
  tokenPath: string
): TokenTree => {
  const { colorScheme } = group
  const selectedScheme = isTokenTree(colorScheme)
    ? colorScheme[scheme]
    : undefined

  if (!isTokenTree(selectedScheme)) {
    throw new Error(
      `Expected an object at "${tokenPath}.colorScheme.${scheme}"`
    )
  }

  return Object.fromEntries(
    Object.entries(group).map(([key, value]) => [
      key,
      key === 'colorScheme' ? mergeTrees({}, selectedScheme) : value,
    ])
  )
}

const selectComponentColorSchemes = (
  components: TokenTree,
  scheme: ColorScheme
): TokenTree =>
  Object.fromEntries(
    Object.entries(components).map(([componentName, component]) => {
      if (!isTokenTree(component)) {
        throw new Error(`Expected an object at "components.${componentName}"`)
      }

      const { colorScheme, ...base } = component

      if (colorScheme === undefined) {
        return [componentName, mergeTrees({}, base)]
      }

      const selectedScheme = isTokenTree(colorScheme)
        ? colorScheme[scheme]
        : undefined

      if (!isTokenTree(selectedScheme)) {
        throw new Error(
          `Expected an object at "components.${componentName}.colorScheme.${scheme}"`
        )
      }

      return [
        componentName,
        Object.fromEntries(
          Object.entries(component).map(([key, value]) => [
            key,
            key === 'colorScheme' ? mergeTrees({}, selectedScheme) : value,
          ])
        ),
      ]
    })
  )

const unwrapColorScheme = (group: TokenTree, tokenPath: string): TokenTree => {
  const { colorScheme, ...base } = group

  if (!isTokenTree(colorScheme)) {
    throw new Error(`Expected an object at "${tokenPath}.colorScheme"`)
  }

  return mergeTrees(base, colorScheme)
}

const createReferenceRoot = (
  primitive: TokenTree,
  semantic: TokenTree
): TokenTree => {
  const duplicateKeys = Object.keys(primitive).filter((key) => key in semantic)

  if (duplicateKeys.length > 0) {
    throw new Error(
      `Duplicate primitive and semantic namespaces: ${duplicateKeys.join(', ')}`
    )
  }

  return { ...primitive, ...semantic }
}

const compileScheme = (
  primitive: TokenTree,
  semanticSource: TokenTree,
  componentsSource: TokenTree,
  scheme: ColorScheme
): { semantic: TokenTree; components: TokenTree } => {
  const selectedSemantic = selectColorScheme(semanticSource, scheme, 'semantic')
  const semanticForReferences = unwrapColorScheme(selectedSemantic, 'semantic')
  const semanticReferences = createReferenceRoot(
    primitive,
    semanticForReferences
  )
  const resolvedSemanticForReferences = resolveReferences(
    semanticForReferences,
    semanticReferences,
    `${scheme}.semantic`
  )
  const resolvedSemantic = resolveReferences(
    selectedSemantic,
    semanticReferences,
    `${scheme}.semantic`
  )

  if (
    !isTokenTree(resolvedSemantic) ||
    !isTokenTree(resolvedSemanticForReferences)
  ) {
    throw new Error(`Expected resolved semantic tokens for "${scheme}"`)
  }

  const componentReferences = createReferenceRoot(
    primitive,
    resolvedSemanticForReferences
  )
  const selectedComponents = selectComponentColorSchemes(
    componentsSource,
    scheme
  )
  const resolvedComponents = resolveReferences(
    selectedComponents,
    componentReferences,
    `${scheme}.components`
  )

  return {
    semantic: compileGroup(resolvedSemantic, 'semantic', scheme),
    components: compileGroup(resolvedComponents, 'components', scheme),
  }
}

export const compileTokens = (source: TokenTree): CompiledTokens => {
  const primitive = getGroup(source, 'primitive')
  const semanticSource = getGroup(source, 'semantic')
  const componentsSource = getGroup(source, 'components')
  const fonts = compileFonts(primitive)
  const light = compileScheme(
    primitive,
    semanticSource,
    componentsSource,
    'light'
  )
  const dark = compileScheme(
    primitive,
    semanticSource,
    componentsSource,
    'dark'
  )
  const semantic = { light: light.semantic, dark: dark.semantic }
  const components = { light: light.components, dark: dark.components }

  assertSameShape(semantic.light, semantic.dark)
  assertSameShape(components.light, components.dark)

  return { fonts, semantic, components }
}
