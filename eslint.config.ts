import { defineConfig } from 'eslint/config'

import { MobileConfig } from './configs/eslint'

export default defineConfig([
  ...MobileConfig,
  { files: ['configs/eslint/**/*'], rules: { 'max-lines': 'off' } },
  {
    ignores: [
      'node_modules/**/*',
      '.expo/**/*',
      '.git/**/*',
      '.idea/**/*',
      'dist/**/*',
      'build/**/*',
      'coverage/**/*',
      '**/*.min.js',
      '.gradle/**/*',
      'android/**/*',
      'ios/**/*',
      '.yarn/**/*',
      '.vscode/**/*',
      '.jest/**/*',
      '.gemini/**/*',
      '.storybook/**/*',
      'configs/cz-conventional-mobile/**/*',
    ],
  },
])
