import type { ExpoConfig } from 'expo/config'

import { version } from './package.json'

const internalFontsPlugin = [
  'expo-font',
  {
    android: {
      fonts: [
        {
          fontFamily: 'TT Fellows',
          fontDefinitions: [
            {
              path: './assets/fonts/TTFellows-DemiBoldItalic.ttf',
              weight: 600,
              style: 'italic',
            },
            { path: './assets/fonts/TTFellows-DemiBold.ttf', weight: 600 },
            { path: './assets/fonts/TTFellows-Regular.ttf', weight: 400 },
          ],
        },
        {
          fontFamily: 'Noto Sans',
          fontDefinitions: [
            { path: './assets/fonts/NotoSans-Bold.ttf', weight: 700 },
            { path: './assets/fonts/NotoSans-Regular.ttf', weight: 400 },
          ],
        },
      ],
    },
    ios: {
      fonts: [
        './assets/fonts/TTFellows-DemiBold.ttf',
        './assets/fonts/TTFellows-DemiBoldItalic.ttf',
        './assets/fonts/TTFellows-Regular.ttf',
        './assets/fonts/NotoSans-Regular.ttf',
        './assets/fonts/NotoSans-Bold.ttf',
      ],
    },
  },
] satisfies NonNullable<ExpoConfig['plugins']>[number]

const plugins: NonNullable<ExpoConfig['plugins']> = [
  './expo/plugins/withEnsureBundler.js',
  '@react-native-async-storage/expo-with-async-storage',
  ...(process.env.UI_KIT_INTERNAL_FONTS === 'true'
    ? [internalFontsPlugin]
    : []),
]

export default {
  expo: {
    name: 'CDEK UI',
    slug: 'cdek-uikit',
    version,
    orientation: 'portrait',
    android: { package: 'ru.cdek.uikit.prime' },
    ios: {
      appleTeamId: 'AY3Q95T9QG',
      bundleIdentifier: 'ru.cdek.uikit.prime',
      config: { usesNonExemptEncryption: false },
    },
    splash: {
      image: './splash.png',
      resizeMode: 'cover',
      backgroundColor: '#FFFFFF',
    },
    icon: './icon.png',
    updates: { fallbackToCacheTimeout: 0 },
    plugins,
    assetBundlePatterns: ['**/*'],
  } satisfies ExpoConfig,
}
