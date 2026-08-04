import { withLegacyTokens } from './legacyTokens'
import { componentTokens, fontTokens, semanticTokens } from './tokens'
import darkSemanticColorSchemeTokens from './tokens/semantic/colorScheme/dark.json'
import lightSemanticColorSchemeTokens from './tokens/semantic/colorScheme/light.json'
import type { RuntimeTheme, ThemeType } from './types'

const createRuntimeTheme = (
  colorScheme: RuntimeTheme['semantic']['colorScheme'],
  components: RuntimeTheme['components']
): RuntimeTheme => ({
  semantic: { colorScheme, ...semanticTokens },
  components,
  fonts: fontTokens,
})

const runtimeThemes = {
  light: createRuntimeTheme(
    lightSemanticColorSchemeTokens,
    componentTokens.light
  ),
  dark: createRuntimeTheme(darkSemanticColorSchemeTokens, componentTokens.dark),
}

export const lightTheme: ThemeType = withLegacyTokens(
  runtimeThemes.light,
  'light'
)

export const darkTheme: ThemeType = withLegacyTokens(runtimeThemes.dark, 'dark')
