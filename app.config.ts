import type { ExpoConfig } from 'expo/config'

import { version } from './package.json'

export default {
  expo: {
    name: 'CDEK UI',
    slug: 'cdek-uikit',
    version,
    orientation: 'portrait',
    android: { package: 'ru.cdek.uikit.prime' },
    ios: {
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
    plugins: ['./expo/plugins/withEnsureBundler.js'],
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
  } satisfies ExpoConfig,
}
