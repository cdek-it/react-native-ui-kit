import { defineConfig } from 'eslint/config'

import { noSpreadIconStyles } from './noSpreadIconStyles'
import { noSpreadUnistyles } from './noSpreadUnistyles'
import { noUnistylesInWorklet } from './noUnistylesInWorklet'

export const unistylesPlugin = {
  rules: {
    'no-spread-unistyles': noSpreadUnistyles,
    'no-unistyles-in-worklet': noUnistylesInWorklet,
    'no-spread-icon-styles': noSpreadIconStyles,
  },
}

export const unistylesConfig = defineConfig([
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { unistyles: unistylesPlugin },
    rules: {
      'unistyles/no-spread-unistyles': 'error',
      'unistyles/no-unistyles-in-worklet': 'error',
      'unistyles/no-spread-icon-styles': 'warn',
    },
  },
])
