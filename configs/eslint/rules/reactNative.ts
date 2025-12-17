import { fixupPluginRules } from '@eslint/compat'
import { defineConfig } from 'eslint/config'

// @ts-expect-error eslint-plugin-react-native не предоставляет типизацию
import reactNativePlugin from 'eslint-plugin-react-native'

export const reactNativeConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    plugins: { 'react-native': fixupPluginRules(reactNativePlugin) },
    settings: {
      react: { version: 'detect' },
      'react-native/style-sheet-object-names': ['makeStyles'],
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { __DEV__: 'readable', ReactNavigation: 'readable' },
    },
    rules: {
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': [
        'error',
        {
          skip: [
            'Body',
            'Title',
            'Caption',
            'Service',
            'Subtitle',
            'Avatar',
            'Badge',
          ],
        },
      ],
      'react-native/no-single-element-style-arrays': 'error',
    },
  },
  {
    files: ['**/*.{test,spec}.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
    },
  },
  {
    files: ['**/*.stories.{js,jsx,cjs,mjs,ts,tsx,mts,cts}'],
    rules: {
      'react-native/no-color-literals': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
    },
  },
])
