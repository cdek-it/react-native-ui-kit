/**
 * Prettier configuration for React Native Prime UI Kit
 * 
 * This configuration was previously imported from @cdek/prettier-config-mobile
 * and has been expanded inline for open-source distribution.
 */

/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  objectWrap: 'collapse',
  quoteProps: 'as-needed',
  requirePragma: false,
  proseWrap: 'always',
  overrides: [
    { files: ['*.tsx'], options: { parser: 'babel-ts' } },
    { files: ['*.ts', '*.mts', '*.cts'], options: { parser: 'typescript' } },
    {
      files: ['*.js', '*.jsx', '*.cjs', '*.mjs'],
      options: { parser: 'babel' },
    },
    { files: ['*.md'], options: { parser: 'markdown' } },
    { files: ['*.yml'], options: { parser: 'yaml' } },
  ],
}

module.exports = config
