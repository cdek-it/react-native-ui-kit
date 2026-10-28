import { defineConfig } from 'eslint/config'
import { createNodeResolver } from 'eslint-plugin-import-x'

import { MobileConfig } from './configs/eslint'

export default defineConfig([
  ...MobileConfig,
  { files: ['configs/eslint/**/*'], rules: { 'max-lines': 'off' } },
  {
    files: ['scripts/**/*.ts', '.agents/scripts/*.mjs'],
    rules: { 'import-x/no-nodejs-modules': 'off' },
  },
  {
    files: ['.agents/scripts/*.mjs'],
    settings: { 'import-x/resolver-next': [createNodeResolver()] },
  },
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
